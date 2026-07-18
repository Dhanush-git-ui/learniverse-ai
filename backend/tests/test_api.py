import asyncio
import sys
import os
import unittest
from unittest.mock import patch

# Ensure backend directory is in sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi.testclient import TestClient
from app import app, execute_code_locally
from auth import verify_api_key

class TestAPI(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_home(self):
        """Test the root endpoint."""
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"message": "Learniverse Backend Running"})

    def test_health(self):
        """Test the health check endpoint."""
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get("status"), "healthy")

    def test_get_topics(self):
        """Test the topics list retrieval endpoint."""
        response = self.client.get("/api/topics")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("categories", data)
        self.assertIn("topics", data)
        self.assertIn("DSA", data["categories"])

    @patch.dict(os.environ, {"ALLOW_LOCAL_EXECUTION": "false", "ENV": "production"}, clear=False)
    def test_execute_code_locally_disabled(self):
        """Local execution should return a disabled response instead of crashing."""
        result = execute_code_locally("python", "print('hello')", "")
        self.assertEqual(result["run"]["code"], 1)
        self.assertIn("disabled", result["run"]["stderr"].lower())

    @patch.dict(os.environ, {"API_SECRET_KEY": "runtime-secret"}, clear=False)
    def test_verify_api_key_uses_runtime_env(self):
        """API key validation should read the current environment value."""
        result = asyncio.run(verify_api_key("runtime-secret"))
        self.assertEqual(result, "runtime-secret")

    @patch("rag.rag_pipeline.run_rag_pipeline")
    def test_chat_success(self, mock_run_pipeline):
        """Test a successful call to the chat endpoint."""
        # Mock the return value of run_rag_pipeline
        mock_run_pipeline.return_value = {
            "teacher_answer": "Mocked teacher answer talking about AVL Trees.",
            "peer_answer": "Mocked peer answer.",
            "sources": [
                {
                    "book": "Open Data Structures",
                    "chapter": "AVL Trees",
                    "topic": "Rebalancing",
                    "score": 0.52,
                    "content_type": "theorem"
                }
            ]
        }

        payload = {
            "message": "What is an AVL Tree?",
            "topic": "AVL Tree",
            "category": "DSA",
            "history": []
        }
        
        response = self.client.post("/api/chat", json=payload)
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        self.assertIn("teacher_answer", data)
        self.assertIn("peer_answer", data)
        self.assertIn("sources", data)
        self.assertEqual(data["teacher_answer"], "Mocked teacher answer talking about AVL Trees.")
        self.assertEqual(data["sources"][0]["book"], "Open Data Structures")
        self.assertEqual(data["sources"][0]["content_type"], "theorem")

    @patch("rag.rag_pipeline.run_rag_pipeline")
    def test_chat_error_shielding(self, mock_run_pipeline):
        """Test that internal exceptions are shielded from the client."""
        # Force an exception inside the pipeline execution
        mock_run_pipeline.side_effect = Exception("Database connection failure")

        payload = {
            "message": "What is an AVL Tree?",
            "topic": "AVL Tree",
            "category": "DSA",
            "history": []
        }
        
        response = self.client.post("/api/chat", json=payload)
        # Status code should be 500
        self.assertEqual(response.status_code, 500)
        # Detail should be our generic error message, not the traceback
        data = response.json()
        self.assertIn("detail", data)
        self.assertIn("internal server error", data["detail"].lower())
        self.assertNotIn("Database connection failure", data["detail"])

if __name__ == "__main__":
    unittest.main()

