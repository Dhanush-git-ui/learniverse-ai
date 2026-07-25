import asyncio
import os
import sys
import unittest

# Ensure backend directory in sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app import app, execute_code_locally
from placement_assessment_system.api import (
    _sample_questions_by_difficulty,
    _prepare_candidate_question
)

class TestCompilerAndHarness(unittest.TestCase):

    def test_option_shuffling_and_correct_mapping(self):
        q_raw = {
            "id": "q1",
            "question": "What is 2 + 2? Placement variant VAR-1.",
            "options": ["3", "4", "5", "6"],
            "correct_option": "B",  # '4' is at index 1 ('B')
            "category": "Aptitude",
            "difficulty": "Easy"
        }
        
        # Test 10 iterations of shuffling
        for _ in range(10):
            prepared = _prepare_candidate_question(q_raw)
            # Question variant tag stripped
            self.assertNotIn("Placement variant", prepared["question"])
            # Options list shuffled
            self.assertEqual(len(prepared["options"]), 4)
            # The option corresponding to new correct_option letter MUST be '4'
            new_correct_letter = prepared["correct_option"]
            new_idx = ord(new_correct_letter) - ord('A')
            self.assertEqual(prepared["options"][new_idx], "4")

    def test_difficulty_sampling_ratio(self):
        pool = []
        # Create 50 easy questions and 50 hard questions
        for i in range(50):
            pool.append({"id": f"e_{i}", "category": "Aptitude", "difficulty": "Easy"})
            pool.append({"id": f"h_{i}", "category": "Aptitude", "difficulty": "Hard"})
            
        sampled = _sample_questions_by_difficulty(pool, "Aptitude", 20, easy_ratio=0.65)
        self.assertEqual(len(sampled), 20)
        
        easy_count = sum(1 for q in sampled if q["difficulty"] == "Easy")
        hard_count = sum(1 for q in sampled if q["difficulty"] == "Hard")
        
        # 20 * 0.65 = 13 Easy, 7 Hard
        self.assertEqual(easy_count, 13)
        self.assertEqual(hard_count, 7)

    def test_local_execution_python_infinite_loop_timeout(self):
        os.environ["ALLOW_LOCAL_EXECUTION"] = "true"
        os.environ["ENV"] = "development"
        
        code = "import time\nwhile True:\n    time.sleep(0.1)"
        res = execute_code_locally("python", code, stdin="")
        
        self.assertEqual(res["run"]["code"], 124)
        self.assertIn("Time Limit Exceeded", res["run"]["stderr"])

    def test_local_execution_python_success(self):
        os.environ["ALLOW_LOCAL_EXECUTION"] = "true"
        os.environ["ENV"] = "development"
        
        code = "print('HELLO_WORLD')"
        res = execute_code_locally("python", code, stdin="")
        
        self.assertEqual(res["run"]["code"], 0)
        self.assertIn("HELLO_WORLD", res["run"]["stdout"])

if __name__ == "__main__":
    unittest.main()
