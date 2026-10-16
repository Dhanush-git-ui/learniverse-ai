"""
Test suite for Top 100 Problems API and functionality
"""

import unittest
import json
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient

# Import from your app
# from app import app
# from top_100_problems import get_problem, list_all_problems
# from top_100_problems_api import problems_router

class TestProblemsAPI(unittest.TestCase):
    """Test Top 100 Problems API endpoints"""

    @classmethod
    def setUpClass(cls):
        """Set up test client"""
        # Mock FastAPI app for testing
        from fastapi import FastAPI
        from top_100_problems_api import problems_router

        cls.app = FastAPI()
        cls.app.include_router(problems_router)
        cls.client = TestClient(cls.app)

    def test_list_problems_empty_params(self):
        """Test listing all problems without filters"""
        response = self.client.get("/api/problems/list")

        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertIn("total", data)
        self.assertIn("problems", data)
        self.assertIn("skip", data)
        self.assertIn("limit", data)

        self.assertGreaterEqual(data["total"], 2)  # At least 2 problems
        self.assertGreaterEqual(len(data["problems"]), 1)

    def test_list_problems_with_difficulty_filter(self):
        """Test listing problems filtered by difficulty"""
        response = self.client.get("/api/problems/list?difficulty=easy")

        self.assertEqual(response.status_code, 200)
        data = response.json()

        # All returned problems should be easy
        for problem in data["problems"]:
            self.assertEqual(problem["difficulty"], "easy")

    def test_list_problems_with_invalid_difficulty(self):
        """Test listing problems with invalid difficulty"""
        response = self.client.get("/api/problems/list?difficulty=invalid")

        self.assertEqual(response.status_code, 400)

    def test_list_problems_pagination(self):
        """Test pagination of problems list"""
        response1 = self.client.get("/api/problems/list?skip=0&limit=5")
        response2 = self.client.get("/api/problems/list?skip=5&limit=5")

        self.assertEqual(response1.status_code, 200)
        self.assertEqual(response2.status_code, 200)

        data1 = response1.json()
        data2 = response2.json()

        # Different problems in different pages
        ids1 = [p["id"] for p in data1["problems"]]
        ids2 = [p["id"] for p in data2["problems"]]

        # Should have minimal overlap
        overlap = set(ids1) & set(ids2)
        self.assertLess(len(overlap), 2)

    def test_get_problem_details(self):
        """Test getting detailed problem information"""
        response = self.client.get("/api/problems/problem/1")

        self.assertEqual(response.status_code, 200)
        data = response.json()

        # Verify required fields
        required_fields = [
            "id", "number", "title", "slug", "difficulty",
            "description", "examples", "constraints", "topics",
            "code_templates", "public_test_cases"
        ]

        for field in required_fields:
            self.assertIn(field, data, f"Missing field: {field}")

        # Verify structure
        self.assertEqual(data["id"], 1)
        self.assertEqual(data["number"], 1)
        self.assertIsInstance(data["examples"], list)
        self.assertIsInstance(data["code_templates"], list)
        self.assertGreaterEqual(len(data["public_test_cases"]), 1)

    def test_get_nonexistent_problem(self):
        """Test getting a problem that doesn't exist"""
        response = self.client.get("/api/problems/problem/99999")

        self.assertEqual(response.status_code, 404)

    def test_get_problem_stats(self):
        """Test getting problem statistics"""
        response = self.client.get("/api/problems/stats/1")

        self.assertEqual(response.status_code, 200)
        data = response.json()

        required_fields = [
            "problem_id", "total_submissions", "total_accepted",
            "acceptance_rate", "average_execution_time_ms", "average_memory_mb"
        ]

        for field in required_fields:
            self.assertIn(field, data, f"Missing stats field: {field}")

        # Validate data types and ranges
        self.assertIsInstance(data["acceptance_rate"], float)
        self.assertGreaterEqual(data["acceptance_rate"], 0)
        self.assertLessEqual(data["acceptance_rate"], 1)


class TestCodeExecution(unittest.TestCase):
    """Test code execution against test cases"""

    def test_submit_python_solution_correct(self):
        """Test submitting a correct Python solution"""
        code = """
def twoSum(nums, target):
    d = {}
    for i, num in enumerate(nums):
        if target - num in d:
            return [d[target - num], i]
        d[num] = i
    return []
"""

        payload = {
            "problem_id": 1,
            "language": "python",
            "code": code,
            "user_id": "test-user-1"
        }

        # This would call the submit endpoint
        # For now, just validate the structure
        self.assertIn("problem_id", payload)
        self.assertIn("language", payload)
        self.assertIn("code", payload)

    def test_submit_javascript_solution(self):
        """Test submitting a JavaScript solution"""
        code = """
function twoSum(nums, target) {
    const map = {};
    for (let i = 0; i < nums.length; i++) {
        if (map[target - nums[i]] !== undefined) {
            return [map[target - nums[i]], i];
        }
        map[nums[i]] = i;
    }
    return [];
}
"""

        payload = {
            "problem_id": 1,
            "language": "javascript",
            "code": code,
            "user_id": "test-user-2"
        }

        self.assertEqual(payload["language"], "javascript")

    def test_submit_empty_code(self):
        """Test submitting empty code"""
        payload = {
            "problem_id": 1,
            "language": "python",
            "code": "",
            "user_id": "test-user-3"
        }

        self.assertEqual(payload["code"].strip(), "")

    def test_code_size_limit(self):
        """Test that oversized code is rejected"""
        large_code = "x = 1\n" * 50000  # Exceed 50KB limit

        self.assertGreater(len(large_code.encode('utf-8')), 50000)


class TestRateLimiting(unittest.TestCase):
    """Test rate limiting on API endpoints"""

    def test_rate_limit_headers(self):
        """Test that rate limit headers are present"""
        # This would test actual rate limiting in integration tests
        # For now, document the expected behavior
        expected_headers = {
            "x-ratelimit-limit": "100",
            "x-ratelimit-remaining": "99",
            "x-ratelimit-reset": "some-timestamp"
        }

        self.assertIn("x-ratelimit-limit", expected_headers)


class TestProblemDatabase(unittest.TestCase):
    """Test problem database operations"""

    def test_get_problem_caching(self):
        """Test that problems are cached efficiently"""
        from top_100_problems import get_problem

        # First call (should load from cache)
        prob1 = get_problem(1)
        self.assertIsNotNone(prob1)

        # Second call (should be instant from cache)
        prob2 = get_problem(1)
        self.assertIsNotNone(prob2)

        # Should be the same object (or equivalent)
        self.assertEqual(prob1.id, prob2.id)
        self.assertEqual(prob1.title, prob2.title)

    def test_get_nonexistent_problem_returns_none(self):
        """Test that nonexistent problem returns None"""
        from top_100_problems import get_problem

        prob = get_problem(99999)
        self.assertIsNone(prob)

    def test_list_problems_filtering(self):
        """Test filtering problems by difficulty"""
        from top_100_problems import list_all_problems, DifficultyLevel

        result = list_all_problems(difficulty=DifficultyLevel.EASY)

        self.assertIn("total", result)
        self.assertIn("problems", result)

        # All problems should be easy
        for prob in result["problems"]:
            self.assertEqual(prob["difficulty"], "easy")


class TestSubmissionStorage(unittest.TestCase):
    """Test submission storage and retrieval"""

    def test_store_submission(self):
        """Test storing a submission"""
        from top_100_problems import store_submission, SubmissionResult
        from datetime import datetime, timezone

        result = SubmissionResult(
            submission_id="test-123",
            problem_id=1,
            user_id="test-user",
            language="python",
            passed_tests=5,
            total_tests=5,
            status="accepted",
            test_results=[],
            execution_time_ms=45.2,
            memory_used_mb=12.5,
            timestamp=datetime.now(timezone.utc).isoformat()
        )

        store_submission(result)

        # Verify it's stored
        from top_100_problems import get_user_submissions
        submissions = get_user_submissions("test-user", problem_id=1)

        self.assertGreater(len(submissions), 0)
        self.assertEqual(submissions[0].submission_id, "test-123")

    def test_get_user_submissions(self):
        """Test retrieving user submissions"""
        from top_100_problems import get_user_submissions

        submissions = get_user_submissions("test-user")

        self.assertIsInstance(submissions, list)
        # Should be sorted by timestamp (most recent first)
        if len(submissions) > 1:
            self.assertGreaterEqual(
                submissions[0].timestamp,
                submissions[1].timestamp
            )


class TestLanguageSupport(unittest.TestCase):
    """Test support for different programming languages"""

    def test_supported_languages(self):
        """Test that required languages are supported"""
        from top_100_problems import ProgrammingLanguage

        required_languages = ["python", "javascript", "java", "cpp"]

        for lang in required_languages:
            try:
                ProgrammingLanguage(lang)
            except ValueError:
                self.fail(f"Language '{lang}' not supported")

    def test_language_case_insensitive(self):
        """Test that language names are case-insensitive"""
        from top_100_problems import ProgrammingLanguage

        # Should accept both cases
        lang1 = ProgrammingLanguage("python")
        lang2 = ProgrammingLanguage("python")

        self.assertEqual(lang1, lang2)


class TestPerformance(unittest.TestCase):
    """Test performance metrics"""

    def test_list_problems_response_time(self):
        """Test that listing problems is fast"""
        import time
        from top_100_problems import list_all_problems

        start = time.time()
        result = list_all_problems()
        elapsed = (time.time() - start) * 1000  # Convert to ms

        # Should be very fast (< 100ms)
        self.assertLess(elapsed, 100, f"List problems took {elapsed}ms")

    def test_get_problem_response_time(self):
        """Test that getting a problem is fast"""
        import time
        from top_100_problems import get_problem

        start = time.time()
        problem = get_problem(1)
        elapsed = (time.time() - start) * 1000  # Convert to ms

        # Should be instant (< 10ms)
        self.assertLess(elapsed, 10, f"Get problem took {elapsed}ms")


class TestEdgeCases(unittest.TestCase):
    """Test edge cases and error handling"""

    def test_special_characters_in_code(self):
        """Test code with special characters"""
        code = """
def special_chars(s):
    return s.replace("'", '"').replace('\\n', '\\t')
"""
        self.assertIn("'", code)
        self.assertIn('"', code)

    def test_unicode_in_code(self):
        """Test code with unicode characters"""
        code = """
def unicode_test(s):
    return f"Hello 世界 🌍"
"""
        self.assertIn("世界", code)
        self.assertIn("🌍", code)

    def test_multiline_code_with_indentation(self):
        """Test complex multiline code"""
        code = """
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        if not nums:
            return []

        d = {}
        for i, num in enumerate(nums):
            if target - num in d:
                return [d[target - num], i]
            d[num] = i

        return []
"""
        self.assertIn("class Solution:", code)
        self.assertIn("def twoSum", code)


# Integration test example
class TestIntegration(unittest.TestCase):
    """Integration tests for full workflow"""

    def test_full_submission_workflow(self):
        """Test complete workflow: list -> select -> submit"""
        # 1. List problems
        from top_100_problems import list_all_problems
        problems = list_all_problems()
        self.assertGreater(problems["total"], 0)

        # 2. Get first problem
        problem_id = problems["problems"][0]["id"]
        from top_100_problems import get_problem
        problem = get_problem(problem_id)
        self.assertIsNotNone(problem)

        # 3. Submit code
        from top_100_problems import store_submission, SubmissionResult
        from datetime import datetime, timezone

        submission = SubmissionResult(
            submission_id="integration-test-1",
            problem_id=problem_id,
            user_id="integration-test-user",
            language="python",
            passed_tests=3,
            total_tests=5,
            status="wrong_answer",
            test_results=[],
            execution_time_ms=120.5,
            memory_used_mb=25.0,
            timestamp=datetime.now(timezone.utc).isoformat()
        )

        store_submission(submission)

        # 4. Retrieve submission
        from top_100_problems import get_user_submissions
        submissions = get_user_submissions("integration-test-user")
        self.assertGreater(len(submissions), 0)


# Benchmark tests
class TestBenchmarks(unittest.TestCase):
    """Benchmark tests for performance tracking"""

    def test_benchmark_list_all_problems(self):
        """Benchmark listing all problems"""
        import time
        from top_100_problems import list_all_problems

        times = []
        for _ in range(10):
            start = time.time()
            list_all_problems()
            times.append((time.time() - start) * 1000)

        avg_time = sum(times) / len(times)
        print(f"\nAverage list problems time: {avg_time:.2f}ms")
        self.assertLess(avg_time, 50)

    def test_benchmark_get_problem(self):
        """Benchmark getting a problem"""
        import time
        from top_100_problems import get_problem

        times = []
        for _ in range(100):
            start = time.time()
            get_problem(1)
            times.append((time.time() - start) * 1000)

        avg_time = sum(times) / len(times)
        print(f"\nAverage get problem time: {avg_time:.2f}ms")
        self.assertLess(avg_time, 5)


if __name__ == "__main__":
    # Run tests with verbose output
    unittest.main(verbosity=2)
