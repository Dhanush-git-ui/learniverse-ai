import unittest
import json
import os
import sys

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app import build_harness

class TestHarnessClassSolution(unittest.TestCase):

    def test_python_top_level_solve(self):
        code = "def solve(nums):\n    return sorted(nums)"
        test_cases = [{"input": [3, 1, 2], "expected": [1, 2, 3]}]
        harness = build_harness(code, "python", test_cases)
        
        namespace = {}
        exec(harness, namespace)
        # Note: the harness prints json output to stdout or populates namespace if executed directly
        self.assertIn("solve", harness)

    def test_python_class_solution_wrapper(self):
        code = "class Solution:\n    def solve(self, nums):\n        return sorted(nums)"
        test_cases = [{"input": [5, 2, 4], "expected": [2, 4, 5]}]
        harness = build_harness(code, "python", test_cases)
        
        # Intercept print output
        import io
        from contextlib import redirect_stdout
        
        f = io.StringIO()
        with redirect_stdout(f):
            exec(harness, {})
        
        output = f.getvalue().strip()
        results = json.loads(output)
        self.assertEqual(len(results), 1)
        self.assertTrue(results[0]["passed"])
        self.assertEqual(results[0]["actual"], "Output: [2, 4, 5]")

    def test_python_missing_solve_and_class_solution(self):
        code = "x = 42"
        test_cases = [{"input": [1], "expected": [1]}]
        harness = build_harness(code, "python", test_cases)
        
        import io
        from contextlib import redirect_stdout
        
        f = io.StringIO()
        with redirect_stdout(f):
            exec(harness, {})
            
        output = f.getvalue().strip()
        results = json.loads(output)
        self.assertEqual(len(results), 1)
        self.assertFalse(results[0]["passed"])
        self.assertIn("Entry point 'solve' function or 'class Solution' not found", results[0]["actual"])

if __name__ == "__main__":
    unittest.main()
