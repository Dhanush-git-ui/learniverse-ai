import os
import sys
import unittest
from uuid import uuid4
from unittest.mock import MagicMock, patch

# Ensure backend directory is in sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi.testclient import TestClient
from app import app, get_rate_limit_key, get_db_connection
from auth import User, create_access_token
from auth_api import verify_google_id_token, is_admin_email, verify_admin_password
from fastapi import HTTPException
from placement_assessment_system.api import (
    AutoSaveRequest,
    HeartbeatRequest,
    SubmitTestRequest,
    _assert_candidate_identity,
    _assert_session_owner,
    _score_coding_submission,
    auto_save,
    candidate_heartbeat,
    ensure_schema,
    get_session_analytics,
    get_db_cursor,
    lookup_student,
    reset_attempts,
    submit_test,
)
from cdc_integration import _fetch_submission_from_sources, save_to_bulk_test_table
from placement_assessment_system import api as assessment_api


class TestPostgresDeployability(unittest.TestCase):
    @unittest.skipUnless(os.environ.get("TEST_POSTGRES_URL"), "PostgreSQL service URL is not configured")
    def test_production_postgres_commit_and_rollback(self):
        """A synthetic write persists on commit and disappears after rollback."""
        table = f"deployability_smoke_{uuid4().hex}"
        url = os.environ["TEST_POSTGRES_URL"]
        with patch("placement_assessment_system.api.settings.IS_DEV", False), \
             patch("placement_assessment_system.api.DB_URL", url), \
             patch("placement_assessment_system.api._db_pool", None):
            try:
                ensure_schema()

                cursor_gen = get_db_cursor()
                cursor = next(cursor_gen)
                cursor.execute(f"CREATE TABLE {table} (test_id TEXT PRIMARY KEY, value TEXT NOT NULL)")
                cursor.execute(f"INSERT INTO {table} (test_id, value) VALUES (%s, %s)", ("committed", "visible"))
                with self.assertRaises(StopIteration):
                    next(cursor_gen)

                cursor_gen = get_db_cursor()
                cursor = next(cursor_gen)
                cursor.execute(f"SELECT value FROM {table} WHERE test_id = %s", ("committed",))
                self.assertEqual(cursor.fetchone()["value"], "visible")
                with self.assertRaises(StopIteration):
                    next(cursor_gen)

                cursor_gen = get_db_cursor()
                cursor = next(cursor_gen)
                cursor.execute(f"INSERT INTO {table} (test_id, value) VALUES (%s, %s)", ("rolled-back", "hidden"))
                with self.assertRaisesRegex(RuntimeError, "synthetic rollback"):
                    cursor_gen.throw(RuntimeError("synthetic rollback"))

                cursor_gen = get_db_cursor()
                cursor = next(cursor_gen)
                cursor.execute(f"SELECT COUNT(*) AS count FROM {table} WHERE test_id = %s", ("rolled-back",))
                self.assertEqual(cursor.fetchone()["count"], 0)
                with self.assertRaises(StopIteration):
                    next(cursor_gen)
            finally:
                pool = assessment_api._db_pool
                if pool:
                    conn = pool.getconn()
                    try:
                        cur = conn.cursor()
                        cur.execute(f"DROP TABLE IF EXISTS {table}")
                        conn.commit()
                        cur.close()
                    finally:
                        pool.putconn(conn)
                        pool.closeall()
                        assessment_api._db_pool = None

class TestSecurityAuditRemediation(unittest.TestCase):
    def setUp(self):
        app.dependency_overrides[get_db_cursor] = lambda: MagicMock()
        self.client = TestClient(app)

    def tearDown(self):
        app.dependency_overrides.clear()

    def test_missing_api_key_rejected(self):
        """Calling protected endpoints without credentials must return 401."""
        response = self.client.post("/api/chat", json={"message": "hello", "topic": "Array", "history": []})
        self.assertEqual(response.status_code, 401)
        self.assertIn("detail", response.json())

    def test_invalid_api_key_rejected(self):
        """Calling protected endpoints with an invalid API key must return 401."""
        response = self.client.post(
            "/api/chat",
            headers={"X-API-Key": "completely-invalid-attacker-key"},
            json={"message": "hello", "topic": "Array", "history": []}
        )
        self.assertEqual(response.status_code, 401)

    def test_bearer_jwt_authentication(self):
        """Endpoints accept valid signed Bearer JWT token."""
        token = create_access_token(user_id="22E51A0501", email="student@hitam.org", role="student")
        
        with patch("rag.rag_pipeline.run_rag_pipeline") as mock_pipeline:
            mock_pipeline.return_value = {
                "teacher_answer": "Valid explanation.",
                "peer_answer": "Peer notes.",
                "sources": []
            }
            response = self.client.post(
                "/api/chat",
                headers={"Authorization": f"Bearer {token}"},
                json={"message": "What is an array?", "topic": "Array", "history": []}
            )
            self.assertEqual(response.status_code, 200)

    def test_rate_limit_key_extracts_token_sub(self):
        """Authenticated requests are keyed by user sub, preventing header spoofing."""
        token = create_access_token(user_id="TEST_STUDENT_42")
        mock_req = MagicMock()
        mock_req.headers = {
            "authorization": f"Bearer {token}",
            "x-forwarded-for": "198.51.100.1",
            "x-roll-number": "SPOOFED_ROLL"
        }
        mock_req.client.host = "10.0.0.1"

        key = get_rate_limit_key(mock_req)
        self.assertEqual(key, "user:TEST_STUDENT_42")

    def test_rate_limit_key_ignores_roll_number_header(self):
        """Spoofed identity and forwarding headers cannot reset an IP bucket."""
        mock_req = MagicMock()
        mock_req.headers = {
            "x-roll-number": "RANDOM_ATTACKER_ROLL_999",
            "x-forwarded-for": "203.0.113.195",
            "cf-connecting-ip": "198.51.100.80",
        }
        mock_req.client.host = "10.0.0.1"

        key = get_rate_limit_key(mock_req)
        self.assertEqual(key, "10.0.0.1")

    def test_db_connection_context_manager_leak_free(self):
        """get_db_connection must always release connection even on exceptions."""
        with patch("app.get_db_conn") as mock_get, patch("app.release_db_conn") as mock_rel:
            dummy_conn = MagicMock()
            mock_get.return_value = dummy_conn

            try:
                with get_db_connection() as conn:
                    self.assertEqual(conn, dummy_conn)
                    raise RuntimeError("Simulated unhandled exception during query execution")
            except RuntimeError:
                pass

            # Verify connection was reliably returned to pool
            mock_rel.assert_called_once_with(dummy_conn)

    def test_admin_login_fails_closed_without_configured_credentials(self):
        with patch.dict(os.environ, {
            "ADMIN_EMAILS": "",
            "ADMIN_USERNAMES": "",
            "ADMIN_PASSWORD_HASH": "",
        }, clear=False):
            response = self.client.post(
                "/api/auth/admin-login",
                json={"username": "admin2026", "password": "admin2026"},
            )
            self.assertEqual(response.status_code, 401)
            self.assertFalse(verify_admin_password("admin2026"))

    def test_general_login_does_not_elevate_hardcoded_admin_alias(self):
        with patch.dict(os.environ, {
            "ADMIN_EMAILS": "",
            "ADMIN_USERNAMES": "",
            "ADMIN_PASSWORD_HASH": "",
        }, clear=False):
            response = self.client.post(
                "/api/auth/hitam-login",
                json={"identifier": "admin2026"},
            )
            self.assertEqual(response.status_code, 401)

    def test_roll_number_cannot_authenticate_an_arbitrary_student(self):
        response = self.client.post(
            "/api/auth/hitam-login",
            json={"identifier": "24E51A0501"},
        )
        self.assertEqual(response.status_code, 401)

    def test_google_login_requires_exact_roster_email(self):
        claims = {"email": "student@example.org", "email_verified": True, "sub": "google-sub-1"}
        with patch("auth_api.GOOGLE_CLIENT_IDS", ["configured-test-client"]), \
             patch("auth_api.id_token.verify_oauth2_token", return_value=claims), \
             patch("auth_api._verified_student_for_email", return_value=None):
            response = self.client.post("/api/auth/google-login", json={"credential": "verified-token"})
        self.assertEqual(response.status_code, 403)

    def test_enrolled_google_identity_uses_roster_roll_as_subject(self):
        claims = {"email": "student@example.org", "email_verified": True, "sub": "google-sub-1"}
        record = {"roll_number": "24E51A0501", "name": "Synthetic Student", "branch": "CSE"}
        with patch("auth_api.GOOGLE_CLIENT_IDS", ["configured-test-client"]), \
             patch("auth_api.id_token.verify_oauth2_token", return_value=claims), \
             patch("auth_api._verified_student_for_email", return_value=record):
            response = self.client.post("/api/auth/google-login", json={"credential": "verified-token"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["user"]["id"], "24E51A0501")

    def test_forged_google_token_is_rejected(self):
        with patch("auth_api.GOOGLE_CLIENT_IDS", ["configured-test-client"]), \
             patch("auth_api.id_token.verify_oauth2_token", side_effect=ValueError("invalid token")):
            with self.assertRaises(HTTPException) as raised:
                verify_google_id_token("header.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIn0.signature")
        self.assertEqual(raised.exception.status_code, 401)

    def test_google_login_rejects_unverified_account_email(self):
        verified_claims = {
            "email": "admin@example.org",
            "email_verified": False,
            "sub": "google-user-1",
        }
        with patch("auth_api.GOOGLE_CLIENT_IDS", ["configured-test-client"]), \
             patch("auth_api.id_token.verify_oauth2_token", return_value=verified_claims), \
             patch.dict(os.environ, {"ADMIN_EMAILS": "admin@example.org"}, clear=False):
            response = self.client.post(
                "/api/auth/google-login",
                json={"credential": "validly-signed-but-unverified-email"},
            )
        self.assertEqual(response.status_code, 401)

    def test_configured_admin_login_succeeds_with_hash(self):
        with patch("auth_api.verify_admin_password", return_value=True), \
             patch.dict(os.environ, {
                 "ADMIN_EMAILS": "admin@example.org",
                 "ADMIN_USERNAMES": "",
             }, clear=False):
            response = self.client.post(
                "/api/auth/admin-login",
                json={"username": "ADMIN@example.org", "password": "configured-only"},
            )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["user"]["role"], "admin")

    def test_admin_allowlist_uses_exact_configured_email(self):
        with patch.dict(os.environ, {"ADMIN_EMAILS": "admin@example.org"}, clear=False):
            self.assertTrue(is_admin_email("ADMIN@example.org"))
            self.assertFalse(is_admin_email("attacker+admin@example.org"))

    def test_student_jwt_cannot_access_admin_export(self):
        token = create_access_token(user_id="STUDENT_1", email="student@example.org", role="student")
        response = self.client.get(
            "/api/assessment/admin/export",
            headers={"Authorization": f"Bearer {token}"},
        )
        self.assertEqual(response.status_code, 403)

    def test_student_jwt_cannot_access_cdc_student_results(self):
        token = create_access_token(user_id="STUDENT_1", email="student@example.org", role="student")
        response = self.client.get(
            "/api/cdc/student/STUDENT_1",
            headers={"Authorization": f"Bearer {token}"},
        )
        self.assertEqual(response.status_code, 403)

    def test_jwt_requires_issuer_audience_and_role(self):
        from jose import jwt
        from auth import get_current_user
        import asyncio
        from config import settings
        secret = os.environ.get("API_SECRET_KEY") or settings.API_SECRET_KEY
        malformed = jwt.encode({"sub": "STUDENT_1", "role": "admin", "exp": 4102444800}, secret, algorithm="HS256")
        class Credentials:
            credentials = malformed
        with self.assertRaises(HTTPException):
            asyncio.run(get_current_user(Credentials()))

    def test_student_jwt_cannot_reset_another_candidate(self):
        token = create_access_token(user_id="STUDENT_1", email="student@example.org", role="student")
        response = self.client.post(
            "/api/assessment/reset",
            headers={"Authorization": f"Bearer {token}"},
            json={"user_id": "STUDENT_2"},
        )
        self.assertEqual(response.status_code, 403)

    def test_reset_handler_rejects_foreign_identity_before_database_write(self):
        db = MagicMock()
        request = type("Reset", (), {"user_id": "STUDENT_2"})()
        with self.assertRaises(HTTPException) as raised:
            reset_attempts(request, User(id="STUDENT_1", email="student1@example.org", role="student"), db)
        self.assertEqual(raised.exception.status_code, 403)
        db.execute.assert_not_called()

    def test_candidate_identity_uses_canonical_token_subject_only(self):
        _assert_candidate_identity(
            User(id="STUDENT_1", email="student@example.org", role="student"),
            "STUDENT_1",
        )
        with self.assertRaises(HTTPException) as raised:
            _assert_candidate_identity(
                User(id="STUDENT_1", email="student@example.org", role="student"),
                "student",
            )
        self.assertEqual(raised.exception.status_code, 403)

    def test_candidate_cannot_access_other_session(self):
        with self.assertRaises(HTTPException) as raised:
            _assert_session_owner(
                User(id="STUDENT_1", email="student1@example.org", role="student"),
                {"student_roll_number": "STUDENT_2"},
            )
        self.assertEqual(raised.exception.status_code, 403)

    def test_autosave_does_not_update_foreign_session(self):
        db = MagicMock()
        db.fetchone.return_value = {
            "session_id": "session-2",
            "student_roll_number": "STUDENT_2",
            "status": "started",
        }
        with self.assertRaises(HTTPException) as raised:
            auto_save(
                AutoSaveRequest(attempt_id="session-2", answers={"q1": "B"}),
                User(id="STUDENT_1", email="student1@example.org", role="student"),
                db,
            )
        self.assertEqual(raised.exception.status_code, 403)
        db.execute.assert_called_once()

    def test_submit_rejects_cross_candidate_session(self):
        db = MagicMock()
        db.fetchone.return_value = {
            "session_id": "synthetic-session-2",
            "student_roll_number": "STUDENT_2",
            "status": "started",
        }
        with self.assertRaises(HTTPException) as raised:
            submit_test(
                SubmitTestRequest(attempt_id="synthetic-session-2"),
                MagicMock(),
                User(id="STUDENT_1", email="student1@example.org", role="student"),
                db,
            )
        self.assertEqual(raised.exception.status_code, 403)
        db.execute.assert_called_once()

    def test_analytics_rejects_foreign_session(self):
        db = MagicMock()
        db.fetchone.return_value = {
            "session_id": "synthetic-session-2",
            "student_roll_number": "STUDENT_2",
        }
        with self.assertRaises(HTTPException) as raised:
            get_session_analytics(
                "synthetic-session-2",
                User(id="STUDENT_1", email="student1@example.org", role="student"),
                db,
            )
        self.assertEqual(raised.exception.status_code, 403)
        db.execute.assert_called_once()

    def test_heartbeat_rejects_foreign_candidate_before_service_call(self):
        db = MagicMock()
        request = HeartbeatRequest(roll_number="STUDENT_2", session_id="synthetic-session-2")
        with patch("placement_assessment_system.api.multi_tenant_service.heartbeat_candidate_session") as heartbeat:
            with self.assertRaises(HTTPException) as raised:
                candidate_heartbeat(
                    request,
                    User(id="STUDENT_1", email="student1@example.org", role="student"),
                    db,
                )
        self.assertEqual(raised.exception.status_code, 403)
        heartbeat.assert_not_called()

    def test_student_cannot_write_client_calculated_direct_score(self):
        token = create_access_token(user_id="STUDENT_1", email="student@example.org", role="student")
        response = self.client.post(
            "/api/assessment/fixly/submit-direct",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "student_name": "Student",
                "roll_number": "STUDENT_1",
                "total_marks": 100,
                "percentage": 100,
            },
        )
        self.assertEqual(response.status_code, 403)

    def test_modified_client_code_scores_cannot_change_authoritative_marks(self):
        result = _score_coding_submission({
            "code": "print('synthetic')",
            "passed_cases": 100,
            "total_cases": 100,
            "score": 100,
            "percentage": 100,
            "status": "accepted",
        })
        self.assertEqual(result, (True, 0, 0, False, 0.0))

    def test_student_lookup_does_not_return_contact_details(self):
        with patch("placement_assessment_system.api._get_roster", return_value=[{
            "roll_number": "STUDENT_1",
            "name": "Student",
            "branch": "CSE",
            "role": "Candidate",
            "email": "student@example.org",
            "phone": "5550100",
        }]):
            response = lookup_student("STUDENT_1", User(id="STUDENT_1", email="student@example.org", role="student"))
        self.assertEqual(set(response["student"]), {"roll_number", "name", "branch", "role"})

    def test_production_database_failure_does_not_fall_back_to_sqlite(self):
        with patch("placement_assessment_system.api.settings.IS_DEV", False), \
             patch("placement_assessment_system.api._get_pool", return_value=None), \
             patch("placement_assessment_system.api._init_sqlite_db") as initialize_sqlite:
            cursor = get_db_cursor()
            with self.assertRaises(HTTPException) as raised:
                next(cursor)
        self.assertEqual(raised.exception.status_code, 503)
        initialize_sqlite.assert_not_called()

    def test_production_schema_initialization_fails_closed_without_postgres(self):
        with patch("placement_assessment_system.api.settings.IS_DEV", False), \
             patch("placement_assessment_system.api._get_pool", return_value=None), \
             patch("placement_assessment_system.api._init_sqlite_db") as initialize_sqlite:
            with self.assertRaisesRegex(RuntimeError, "PostgreSQL database is unavailable"):
                ensure_schema()
        initialize_sqlite.assert_not_called()

    def test_cdc_production_read_and_write_do_not_fall_back_to_sqlite(self):
        with patch("cdc_integration.settings.IS_DEV", False), \
             patch("cdc_integration.settings.DATABASE_URL", None), \
             patch("cdc_integration.sqlite3.connect") as sqlite_connect:
            with self.assertRaises(HTTPException) as raised:
                _fetch_submission_from_sources("SYNTHETIC-1")
            self.assertEqual(raised.exception.status_code, 503)
            saved = save_to_bulk_test_table({"roll_number": "SYNTHETIC-1", "percentage": 0})
        self.assertFalse(saved)
        sqlite_connect.assert_not_called()

    def test_student_denied_from_assessment_admin_read_endpoints(self):
        token = create_access_token(user_id="STUDENT_1", email="student@example.org", role="student")
        headers = {"Authorization": f"Bearer {token}"}
        for path in (
            "/api/assessment/admin/sessions",
            "/api/assessment/admin/export",
            "/api/assessment/fixly/submissions",
            "/api/assessment/fixly/export-excel",
            "/api/assessment/admin/tests/test-1/live",
            "/api/assessment/admin/session/session-1",
        ):
            with self.subTest(path=path):
                response = self.client.get(path, headers=headers)
                self.assertEqual(response.status_code, 403)

    def test_student_denied_from_assessment_admin_mutations(self):
        token = create_access_token(user_id="STUDENT_1", email="student@example.org", role="student")
        headers = {"Authorization": f"Bearer {token}"}
        calls = (
            ("/api/assessment/admin/tests", {"company_name": "Synthetic", "test_name": "Synthetic Test", "start_time": "2026-10-15T00:00:00Z", "end_time": "2026-10-16T00:00:00Z"}),
            ("/api/assessment/admin/tests/test-1/candidate-reset", {"roll_number": "STUDENT_2"}),
            ("/api/assessment/admin/tests/test-1/bulk-assign", {"emails_or_rolls": ["STUDENT_2"]}),
        )
        for path, body in calls:
            with self.subTest(path=path):
                response = self.client.post(path, headers=headers, json=body)
                self.assertEqual(response.status_code, 403)

    def test_student_cannot_query_another_candidate_lookup_or_submit_feedback(self):
        token = create_access_token(user_id="STUDENT_1", email="student@example.org", role="student")
        headers = {"Authorization": f"Bearer {token}"}
        lookup = self.client.get("/api/assessment/lookup-candidate?identifier=STUDENT_2", headers=headers)
        feedback = self.client.post(
            "/api/assessment/feedback",
            headers=headers,
            json={"roll_number": "STUDENT_2", "student_name": "Other", "rating": 5, "comments": "x"},
        )
        self.assertEqual(lookup.status_code, 403)
        self.assertEqual(feedback.status_code, 403)

if __name__ == "__main__":
    unittest.main()
