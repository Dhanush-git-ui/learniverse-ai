import os
import sys
import unittest
from unittest.mock import MagicMock, patch

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from jose import jwt
from auth import TOKEN_AUDIENCE, TOKEN_ISSUER, _decode_access_token, verify_api_key
from auth_api import get_valid_admin_usernames, parse_student_credentials, verify_admin_password
from placement_assessment_system.api import _score_scenario_submission
from rag import rag_pipeline
from fastapi import HTTPException
from starlette.requests import Request


class AuthenticationHardeningTests(unittest.TestCase):
    def test_live_monitor_requires_a_valid_admin_jwt(self):
        from app import _validate_monitor_admin_token
        from auth import create_access_token

        with patch.dict(os.environ, {"API_SECRET_KEY": "configured-test-secret"}, clear=False):
            student_token = create_access_token("student-1", role="student")
            admin_token = create_access_token("admin-1", role="admin")
            with self.assertRaises(HTTPException) as denied:
                _validate_monitor_admin_token(student_token)
            self.assertEqual(denied.exception.status_code, 403)
            self.assertEqual(_validate_monitor_admin_token(admin_token)["role"], "admin")
            with self.assertRaises(Exception):
                _validate_monitor_admin_token("invalid-token")

    def test_direct_submission_failure_is_not_reported_as_success(self):
        from fastapi import BackgroundTasks
        from placement_assessment_system.api import DirectFixlySubmissionRequest, submit_fixly_direct

        request = DirectFixlySubmissionRequest(
            student_name="Synthetic Candidate", roll_number="SYNTHETIC-1",
            total_marks=1, percentage=5,
        )
        database = MagicMock()
        database.execute.side_effect = RuntimeError("isolated persistence failure")
        with patch("placement_assessment_system.api._save_submission_file_backup") as backup:
            with self.assertRaises(HTTPException) as raised:
                submit_fixly_direct(request, BackgroundTasks(), _admin=None, db=database)
        self.assertEqual(raised.exception.status_code, 503)
        backup.assert_not_called()

    def test_legacy_signing_secrets_are_not_accepted(self):
        with patch.dict(os.environ, {"API_SECRET_KEY": "configured-test-secret"}, clear=False):
            legacy = jwt.encode({
                "sub": "student", "role": "student", "iat": 1900000000,
                "exp": 2000000000, "iss": TOKEN_ISSUER, "aud": TOKEN_AUDIENCE,
                "jti": "legacy-token",
            }, "legacy-test-signing-key", algorithm="HS256")
            with self.assertRaises(Exception):
                _decode_access_token(legacy)

    def test_api_key_must_be_explicit_and_exact(self):
        with patch.dict(os.environ, {"API_SECRET_KEY": "configured-test-secret"}, clear=False):
            invalid = verify_api_key("old-unconfigured-test-key", None)
            with self.assertRaises(HTTPException):
                invalid.send(None)
            valid = verify_api_key("configured-test-secret", None)
            with self.assertRaises(StopIteration) as result:
                valid.send(None)
            self.assertEqual(result.exception.value, "configured-test-secret")

    def test_missing_api_secret_fails_closed(self):
        with patch.dict(os.environ, {"API_SECRET_KEY": ""}, clear=False), \
             patch("config.settings.API_SECRET_KEY", ""):
            missing = verify_api_key(None, None)
            with self.assertRaises(HTTPException) as raised:
                missing.send(None)
            self.assertEqual(raised.exception.status_code, 503)

    def test_builtin_admin_credentials_are_not_provisioned(self):
        with patch.dict(os.environ, {"ADMIN_EMAILS": "", "ADMIN_USERNAMES": "", "ADMIN_PASSWORD_HASH": ""}, clear=False):
            self.assertNotIn("admin", get_valid_admin_usernames())
            self.assertFalse(verify_admin_password("password123"))

    def test_unrostered_identity_format_is_not_treated_as_valid(self):
        self.assertFalse(parse_student_credentials("invented-user@hitam.org").get("isValid", False))

    def test_analytics_ignores_client_roll_number_identity_header(self):
        from analytics_api import _get_token_payload
        request = Request({
            "type": "http", "method": "GET", "path": "/api/analytics/student",
            "headers": [(b"x-roll-number", b"24E51A0501")],
            "query_string": b"", "server": ("testserver", 80),
            "client": ("127.0.0.1", 1234), "scheme": "http",
        })
        with self.assertRaises(HTTPException) as raised:
            _get_token_payload(request)
        self.assertEqual(raised.exception.status_code, 401)

class AssessmentScenarioScoringTests(unittest.TestCase):
    def test_prose_only_rubric_does_not_award_marks_by_length(self):
        long_answer = "This answer has many words but does not satisfy any verified scoring criteria. " * 10
        result = _score_scenario_submission(long_answer, {"marks": 25, "rubrics": [{"marks": 25, "criteria": "Reviewer assessed"}]})
        self.assertEqual(result, (True, 0.0, False, True))

    def test_explicit_rubric_signals_control_marks(self):
        result = _score_scenario_submission(
            "Use WebSockets and keep API keys on the backend.",
            {"rubrics": [{"marks": 10, "signals": ["websockets", "backend", "reconnect"]}]},
        )
        self.assertEqual(result, (True, 6.67, True, False))


class CompilerFallbackTests(unittest.TestCase):
    def test_remote_outage_does_not_crash_or_run_locally_in_production(self):
        from app import execute_code_via_piston
        with patch.dict(os.environ, {"ALLOW_LOCAL_EXECUTION": "false", "ENV": "production"}, clear=False), \
             patch("app.execute_code_via_judge0", return_value=None), \
             patch("app.execute_code_via_piston_api", return_value=None), \
             patch("config.settings.PISTON_FALLBACK_ENABLED", False), \
             patch("config.settings.ALLOW_LOCAL_EXECUTION", False), \
             patch("config.settings.IS_DEV", False):
            self.assertIsNone(execute_code_via_piston("python", "print('x')"))


class PortfolioAuthorizationTests(unittest.TestCase):
    def test_dashboard_portfolio_owner_check_rejects_another_student(self):
        from app import _assert_student_route_owner
        from auth import User
        with self.assertRaises(HTTPException):
            _assert_student_route_owner(User(id="24E51A0501"), "24E51A0502")
        _assert_student_route_owner(User(id="24E51A0501"), "24E51A0501")

    def test_public_portfolio_html_escapes_profile_values(self):
        from app import public_portfolio_page
        from auth import User
        profile = {
            "student_name": "<script>alert(1)</script>", "role": "<img src=x>",
            "assessment_score": 10, "max_marks": 20, "percentage": 50,
            "problems_solved": 2, "topics_attempted": 3, "total_submissions": 4,
            "assessment_status": "completed", "placement_tier": "<svg>",
            "tier_band": "A", "external_link": "https://cdc-hitam.onrender.com",
        }
        with patch("app.get_portfolio", return_value=profile):
            response = public_portfolio_page("24E51A0501", User(id="24E51A0501"))
        body = response.body.decode("utf-8")
        self.assertNotIn("<script>alert(1)</script>", body)
        self.assertIn("\\u003cscript\\u003e", body)


class ActiveRagRetrievalTests(unittest.TestCase):
    def test_retrieval_selection_deduplicates_and_rejects_irrelevant_chunks(self):
        chunks = [
            {"text": "AVL trees maintain height balance.", "score": 0.2, "metadata": {"book": "Book", "chapter": "Trees", "topic": "AVL"}},
            {"text": "AVL trees maintain height balance.", "score": 0.3, "metadata": {"book": "Book", "chapter": "Trees", "topic": "AVL"}},
            {"text": "Irrelevant result", "score": 1.1, "metadata": {"book": "Other"}},
        ]
        passed_context, sources = rag_pipeline.select_retrieval_context(chunks, threshold=0.8)
        self.assertEqual(passed_context, "AVL trees maintain height balance.")
        self.assertEqual(len(sources), 1)
        self.assertEqual(sources[0]["book"], "Book")

    def test_empty_retrieval_returns_no_claimed_sources(self):
        self.assertEqual(rag_pipeline.select_retrieval_context([]), ("", []))


if __name__ == "__main__":
    unittest.main()
