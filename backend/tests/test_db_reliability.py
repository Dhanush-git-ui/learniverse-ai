"""Database reliability tests; live PostgreSQL cases require explicit test DB opt-in."""
import os
import sys
import time
import unittest
from concurrent.futures import ThreadPoolExecutor
from unittest.mock import MagicMock, patch
from urllib.parse import parse_qs, urlparse
from uuid import uuid4

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from fastapi import HTTPException
from psycopg2 import IntegrityError
from psycopg2.pool import PoolError


class PoolAndCacheUnitTests(unittest.TestCase):
    def test_postgres_target_guard_requires_local_test_database(self):
        self.assertIsNone(assert_isolated_postgres_target(
            "postgresql://test:test@localhost:5432/learniverse_test"
        ))
        for unsafe_url, production_url in (
            ("postgresql://test:test@example.com:5432/learniverse_test", ""),
            ("postgresql://test:test@localhost:5432/learniverse_test?hostaddr=203.0.113.1", ""),
            ("postgresql://user:pass@localhost:5432/learniverse", ""),
            ("postgresql://test:test@localhost:5432/learniverse_test",
             "postgresql://test:test@localhost:5432/learniverse_test"),
        ):
            with self.subTest(url=unsafe_url), self.assertRaises(RuntimeError):
                assert_isolated_postgres_target(unsafe_url, production_url)

    def test_pool_is_singleton_for_a_worker_dsn(self):
        import db_pool

        fake_pool = MagicMock()
        fake_pool.closed = 0
        with patch.object(db_pool, "_pool", None), patch.object(db_pool, "_pool_dsn", None), \
             patch.object(db_pool, "ThreadedConnectionPool", return_value=fake_pool) as factory:
            first = db_pool.get_pool("isolated-test-dsn")
            second = db_pool.get_pool("isolated-test-dsn")
            self.assertIs(first, second)
            factory.assert_called_once()
            self.assertLessEqual(factory.call_args.kwargs["maxconn"], 20)
            db_pool.close_pool()

    def test_pool_exhaustion_does_not_close_shared_pool(self):
        from placement_assessment_system.api import _get_live_conn

        pool = MagicMock()
        pool.getconn.side_effect = PoolError("pool exhausted")
        with self.assertRaises(HTTPException) as raised:
            _get_live_conn(pool)
        self.assertEqual(raised.exception.status_code, 503)
        pool.closeall.assert_not_called()

    def test_memory_cache_expires_and_bounds_entry_count(self):
        from utils.cache_manager import MemoryCache

        cache = MemoryCache(max_entries=2)
        with patch("utils.cache_manager.time.time", return_value=10):
            cache.set("short", "value", ttl_seconds=2)
            cache.set("first", 1)
            cache.set("second", 2)
        self.assertIsNone(cache.get("short"))
        self.assertEqual(cache.get("first"), 1)
        cache.set("third", 3)
        self.assertIsNone(cache.get("second"))

    def test_redis_failure_falls_back_to_worker_memory_without_flushdb(self):
        from utils.cache_manager import RedisCache, MemoryCache

        redis_client = MagicMock()
        fallback = MemoryCache()
        cache = RedisCache(redis_client, fallback=fallback)
        redis_client.setex.side_effect = OSError("offline")
        cache.set("topic-a", {"title": "A"}, 60)
        redis_client.get.side_effect = OSError("offline")
        self.assertEqual(cache.get("topic-a"), {"title": "A"})
        cache.clear()
        redis_client.flushdb.assert_not_called()

    def test_redis_startup_outage_keeps_client_for_recovery(self):
        import redis
        from utils.cache_manager import RedisCache, _init_cache
        client = MagicMock()
        client.ping.side_effect = OSError("offline")
        with patch("utils.cache_manager.settings.REDIS_URL", "redis://isolated.invalid"), \
             patch.object(redis, "from_url", return_value=client):
            cache = _init_cache()
        self.assertIsInstance(cache, RedisCache)


POSTGRES_TEST_URL = os.environ.get("TEST_POSTGRES_URL", "")
POSTGRES_TEST_OPT_IN = os.environ.get("RUN_POSTGRES_INTEGRATION", "") == "1"


def assert_isolated_postgres_target(test_url: str, production_url: str = "") -> None:
    """Refuse all non-local/non-test targets before opening a PostgreSQL socket."""
    parsed = urlparse(test_url)
    host = (parsed.hostname or "").casefold()
    database = parsed.path.strip("/").casefold()
    query = {key.casefold(): values for key, values in parse_qs(parsed.query).items()}
    if test_url == production_url:
        raise RuntimeError("TEST_POSTGRES_URL must not equal DATABASE_URL")
    local_hosts = {"localhost", "127.0.0.1", "::1"}
    github_service_alias = host == "postgres" and os.environ.get("GITHUB_ACTIONS") == "true"
    if (
        parsed.scheme not in {"postgres", "postgresql"}
        or (host not in local_hosts and not github_service_alias)
        or "test" not in database
        or any(key in query for key in ("host", "hostaddr", "service"))
    ):
        raise RuntimeError("PostgreSQL integration tests require a local test database")


@unittest.skipUnless(
    POSTGRES_TEST_URL and POSTGRES_TEST_OPT_IN,
    "Set TEST_POSTGRES_URL to an isolated PostgreSQL database and RUN_POSTGRES_INTEGRATION=1",
)
class IsolatedPostgresReliabilityTests(unittest.TestCase):
    """Synthetic data/schema checks; reject production and non-local DB targets."""

    @classmethod
    def setUpClass(cls):
        assert_isolated_postgres_target(POSTGRES_TEST_URL, os.environ.get("DATABASE_URL", ""))
        from db_pool import close_pool

        close_pool()
        from config import settings
        from placement_assessment_system import api as assessment_api
        with patch.object(assessment_api, "DB_URL", POSTGRES_TEST_URL), patch.object(settings, "IS_DEV", False):
            assessment_api.ensure_schema()
        cls.table = f"codex_reliability_{uuid4().hex}"
        import psycopg2

        conn = psycopg2.connect(POSTGRES_TEST_URL, connect_timeout=5)
        try:
            with conn.cursor() as cur:
                cur.execute(
                    f"CREATE TABLE {cls.table} (id INTEGER PRIMARY KEY, value INTEGER NOT NULL, status TEXT NOT NULL)"
                )
            conn.commit()
        finally:
            conn.close()

    @classmethod
    def tearDownClass(cls):
        import psycopg2
        from db_pool import close_pool

        close_pool()
        conn = psycopg2.connect(POSTGRES_TEST_URL, connect_timeout=5)
        try:
            with conn.cursor() as cur:
                cur.execute(f"DROP TABLE IF EXISTS {cls.table}")
            conn.commit()
        finally:
            conn.close()
        close_pool()

    def _new_connection(self):
        from db_pool import acquire_connection

        return acquire_connection(POSTGRES_TEST_URL)

    def _release(self, conn, discard=False):
        from db_pool import release_connection

        release_connection(conn, discard=discard)

    def test_commit_rollback_and_duplicate_constraint(self):
        conn = self._new_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(f"INSERT INTO {self.table} VALUES (1, 1, 'committed')")
            conn.commit()
            with conn.cursor() as cur:
                cur.execute(f"INSERT INTO {self.table} VALUES (2, 2, 'rolled-back')")
            conn.rollback()
            with conn.cursor() as cur:
                cur.execute(f"SELECT COUNT(*) FROM {self.table}")
                self.assertEqual(cur.fetchone()[0], 1)
            with self.assertRaises(IntegrityError):
                with conn.cursor() as cur:
                    cur.execute(f"INSERT INTO {self.table} VALUES (1, 9, 'duplicate')")
            conn.rollback()
            with conn.cursor() as cur:
                cur.execute(f"SELECT value FROM {self.table} WHERE id = 1")
                self.assertEqual(cur.fetchone()[0], 1)
        finally:
            self._release(conn)

    def test_concurrent_writes_and_single_assessment_state_transition(self):
        conn = self._new_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(f"INSERT INTO {self.table} VALUES (10, 0, 'started') ON CONFLICT (id) DO UPDATE SET value=0, status='started'")
            conn.commit()
        finally:
            self._release(conn)

        def increment(_):
            conn = self._new_connection()
            try:
                with conn.cursor() as cur:
                    cur.execute(f"UPDATE {self.table} SET value=value+1 WHERE id=10")
                conn.commit()
            finally:
                self._release(conn)

        with ThreadPoolExecutor(max_workers=8) as executor:
            list(executor.map(increment, range(40)))

        def submit_once(_):
            conn = self._new_connection()
            try:
                with conn.cursor() as cur:
                    cur.execute(f"UPDATE {self.table} SET status='completed' WHERE id=10 AND status='started'")
                    changed = cur.rowcount
                conn.commit()
                return changed
            finally:
                self._release(conn)

        with ThreadPoolExecutor(max_workers=8) as executor:
            transitions = list(executor.map(submit_once, range(8)))
        conn = self._new_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(f"SELECT value, status FROM {self.table} WHERE id=10")
                value, status = cur.fetchone()
            self.assertEqual(value, 40)
            self.assertEqual(status, "completed")
            self.assertEqual(sum(transitions), 1)
        finally:
            self._release(conn)

    def test_reconnect_after_database_closes_a_checked_out_connection(self):
        conn = self._new_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT pg_backend_pid()")
            backend_pid = cur.fetchone()[0]
        import psycopg2
        control = psycopg2.connect(POSTGRES_TEST_URL, connect_timeout=5)
        try:
            with control.cursor() as cur:
                cur.execute("SELECT pg_terminate_backend(%s)", (backend_pid,))
                self.assertTrue(cur.fetchone()[0])
            control.commit()
        finally:
            control.close()
        self._release(conn, discard=True)

        recovered = self._new_connection()
        try:
            with recovered.cursor() as cur:
                cur.execute("SELECT 1")
                self.assertEqual(cur.fetchone()[0], 1)
            recovered.commit()
        finally:
            self._release(recovered)

    def test_concurrent_assessment_submission_route_commits_once(self):
        import psycopg2
        from fastapi import BackgroundTasks, HTTPException
        from auth import User
        from placement_assessment_system import api as assessment_api
        from unittest.mock import patch

        session_id = str(uuid4())
        roll = f"PHASE2{uuid4().hex[:8].upper()}"
        conn = psycopg2.connect(POSTGRES_TEST_URL, connect_timeout=5)
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO test_sessions (session_id, student_roll_number, student_name, status, questions) VALUES (%s, %s, %s, 'started', '[]'::jsonb)",
                    (session_id, roll, "Synthetic Candidate"),
                )
            conn.commit()
        finally:
            conn.close()

        try:
            request = assessment_api.SubmitAttemptRequest(attempt_id=session_id)
            user = User(id=roll, role="student")

            def submit(_):
                cursor_generator = assessment_api.get_db_cursor()
                db = next(cursor_generator)
                try:
                    assessment_api.submit_test(request, BackgroundTasks(), user, db)
                    with self.assertRaises(StopIteration):
                        next(cursor_generator)
                    return "committed"
                except HTTPException as exc:
                    try:
                        cursor_generator.throw(exc)
                    except HTTPException:
                        pass
                    return exc.status_code

            with patch.object(assessment_api, "DB_URL", POSTGRES_TEST_URL), \
                 patch.object(assessment_api, "_save_submission_file_backup"), \
                 patch("cdc_integration.save_to_bulk_test_table", return_value=True), \
                 ThreadPoolExecutor(max_workers=2) as executor:
                results = list(executor.map(submit, range(2)))
            self.assertEqual(results.count("committed"), 1)
            self.assertEqual(results.count(409), 1)

            conn = psycopg2.connect(POSTGRES_TEST_URL, connect_timeout=5)
            try:
                with conn.cursor() as cur:
                    cur.execute("SELECT status FROM test_sessions WHERE session_id = %s", (session_id,))
                    self.assertEqual(cur.fetchone()[0], "completed")
                    cur.execute("SELECT COUNT(*) FROM fixly_test_submissions WHERE session_id = %s", (session_id,))
                    self.assertEqual(cur.fetchone()[0], 1)
            finally:
                conn.close()
        finally:
            conn = psycopg2.connect(POSTGRES_TEST_URL, connect_timeout=5)
            try:
                with conn.cursor() as cur:
                    cur.execute("DELETE FROM fixly_test_submissions WHERE session_id = %s", (session_id,))
                    cur.execute("DELETE FROM test_sessions WHERE session_id = %s", (session_id,))
                conn.commit()
            finally:
                conn.close()

    def _migration_schema(self, duplicate_rows=False):
        import psycopg2
        from psycopg2 import sql

        schema = f"codex_migration_test_{uuid4().hex}"
        conn = psycopg2.connect(POSTGRES_TEST_URL, connect_timeout=5)
        with conn.cursor() as cur:
            cur.execute(sql.SQL("CREATE SCHEMA {}").format(sql.Identifier(schema)))
            cur.execute(sql.SQL("SET search_path TO {}").format(sql.Identifier(schema)))
            cur.execute("CREATE TABLE fixly_test_submissions (id BIGSERIAL PRIMARY KEY, session_id TEXT)")
            cur.execute("INSERT INTO fixly_test_submissions (session_id) VALUES ('synthetic-session-1')")
            if duplicate_rows:
                cur.execute("INSERT INTO fixly_test_submissions (session_id) VALUES ('synthetic-session-1')")
        conn.commit()
        return conn, schema

    def _drop_migration_schema(self, conn, schema):
        from psycopg2 import sql

        try:
            conn.rollback()
            with conn.cursor() as cur:
                cur.execute("SET search_path TO public")
                cur.execute(sql.SQL("DROP SCHEMA IF EXISTS {} CASCADE").format(sql.Identifier(schema)))
            conn.commit()
        finally:
            conn.close()

    def test_migration_005_is_idempotent_and_rollback_preserves_rows(self):
        from psycopg2 import IntegrityError

        conn, schema = self._migration_schema()
        migration_path = os.path.join(BACKEND_DIR, "migrations", "005_unique_assessment_submission.sql")
        rollback_path = os.path.join(BACKEND_DIR, "migrations", "005_rollback_unique_assessment_submission.sql")
        try:
            with open(migration_path, encoding="utf-8") as migration_file:
                migration_sql = migration_file.read()
            with open(rollback_path, encoding="utf-8") as rollback_file:
                rollback_sql = rollback_file.read()
            with conn.cursor() as cur:
                cur.execute(migration_sql)
                conn.commit()
                cur.execute(migration_sql)
                conn.commit()
                cur.execute("SELECT to_regclass('idx_fixly_session_once')")
                self.assertIsNotNone(cur.fetchone()[0])
                with self.assertRaises(IntegrityError):
                    cur.execute("INSERT INTO fixly_test_submissions (session_id) VALUES ('synthetic-session-1')")
                conn.rollback()
                cur.execute(rollback_sql)
                conn.commit()
                cur.execute("SELECT COUNT(*) FROM fixly_test_submissions")
                self.assertEqual(cur.fetchone()[0], 1)
                cur.execute("SELECT to_regclass('idx_fixly_session_once')")
                self.assertIsNone(cur.fetchone()[0])
        finally:
            self._drop_migration_schema(conn, schema)

    def test_migration_005_refuses_existing_duplicates_without_deleting_data(self):
        from psycopg2 import DatabaseError

        conn, schema = self._migration_schema(duplicate_rows=True)
        migration_path = os.path.join(BACKEND_DIR, "migrations", "005_unique_assessment_submission.sql")
        try:
            with open(migration_path, encoding="utf-8") as migration_file:
                migration_sql = migration_file.read()
            with conn.cursor() as cur:
                with self.assertRaises(DatabaseError) as raised:
                    cur.execute(migration_sql)
                self.assertIn("duplicate session_id", str(raised.exception).casefold())
                conn.rollback()
                cur.execute("SELECT COUNT(*) FROM fixly_test_submissions")
                self.assertEqual(cur.fetchone()[0], 2)
                cur.execute("SELECT to_regclass('idx_fixly_session_once')")
                self.assertIsNone(cur.fetchone()[0])
        finally:
            self._drop_migration_schema(conn, schema)


if __name__ == "__main__":
    unittest.main()
