import os
import sys
import unittest
from unittest.mock import MagicMock, patch

# Ensure backend directory is in sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi.testclient import TestClient
from app import app, get_rate_limit_key, get_db_connection
from auth import create_access_token

class TestSecurityAuditRemediation(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

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
        """Spoofed x-roll-number is completely ignored for rate limiting."""
        mock_req = MagicMock()
        mock_req.headers = {
            "x-roll-number": "RANDOM_ATTACKER_ROLL_999",
            "x-forwarded-for": "203.0.113.195"
        }
        mock_req.client = None

        key = get_rate_limit_key(mock_req)
        # Should be based on forwarded IP, NOT student roll number
        self.assertEqual(key, "203.0.113.195")

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

if __name__ == "__main__":
    unittest.main()
