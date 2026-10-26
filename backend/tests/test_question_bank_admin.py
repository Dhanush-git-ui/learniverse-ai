"""Integration checks for persistent admin question-bank workflows."""
import os
import sqlite3
import sys
import unittest
from pathlib import Path

from fastapi import HTTPException

BACKEND = Path(__file__).resolve().parents[1]
if str(BACKEND) not in sys.path:
    sys.path.insert(0, str(BACKEND))

from auth import User, require_admin
from placement_assessment_system.api import SQLiteCursorAdapter
from placement_assessment_system import question_bank_admin
from placement_assessment_system.question_bank_admin import (
    TrainerTestRequest, QuestionReviewRequest, list_questions, review_question,
    save_trainer_test, router as question_bank_router,
)


class TestAdminQuestionBank(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        os.environ.setdefault("API_SECRET_KEY", "question-bank-tests-secret")
        cls.connection = sqlite3.connect(":memory:", check_same_thread=False)
        cls.connection.row_factory = sqlite3.Row
        cls.connection.execute("""CREATE TABLE questions (
            id TEXT PRIMARY KEY, category TEXT NOT NULL, question_type TEXT DEFAULT 'mcq', topic TEXT NOT NULL,
            subtopic TEXT, difficulty TEXT NOT NULL, question TEXT NOT NULL,
            options TEXT, correct_option TEXT, answer TEXT, explanation TEXT,
            marks INTEGER DEFAULT 1, negative_marks REAL DEFAULT 0,
            estimated_time INTEGER DEFAULT 90, tags TEXT DEFAULT '[]',
            generator_version TEXT DEFAULT 'test', examples TEXT
        )""")
        cls.db = SQLiteCursorAdapter(cls.connection)
        question_bank_admin._schema_ready = False
        question_bank_admin.ensure_question_bank_schema(cls.db)
        cls.db.execute("INSERT INTO questions (id, category, topic, difficulty, question, options, correct_option, answer, explanation, review_status, tags) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",
                       ("approved-1", "Programming", "Python", "Easy", "Which is immutable?", ["list", "tuple", "dict", "set"], "B", "tuple", "Tuple is immutable.", "Approved", ["python"]))
        cls.db.execute("INSERT INTO questions (id, category, topic, difficulty, question, options, correct_option, answer, explanation, review_status, tags) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",
                       ("pending-1", "Programming", "Python", "Medium", "Pending example?", ["A", "B", "C", "D"], "A", "A", "Pending review.", "Pending Review", ["python"]))
        cls.db.execute("INSERT INTO question_companies (slug, name) VALUES (%s,%s)", ("tcs", "TCS"))
        cls.db.execute("INSERT INTO question_roles (slug, name) VALUES (%s,%s)", ("software-engineer", "Software Engineer"))
        cls.db.execute("INSERT INTO question_company_roles (question_id, company_slug, role_slug, recruitment_stage, provenance) VALUES (%s,%s,%s,%s,%s)",
                       ("approved-1", "tcs", "software-engineer", "Technical", "Company-Style Practice Question"))
        cls.db.execute("INSERT INTO question_role_links (question_id, role_slug, provenance) VALUES (%s,%s,%s)",
                       ("pending-1", "software-engineer", "Source-Verified Practice Question"))
        cls.connection.commit()

    @classmethod
    def tearDownClass(cls):
        cls.connection.close()

    def setUp(self):
        self.connection.execute("UPDATE questions SET review_status='Pending Review' WHERE id='pending-1'")
        self.connection.execute("DELETE FROM trainer_tests")
        self.connection.execute("DELETE FROM question_review_events")
        self.connection.commit()

    def test_question_answers_require_admin_auth(self):
        self.assertTrue(any(dependency.dependency is require_admin for dependency in question_bank_router.dependencies))

    def test_server_filters_and_default_approved_status(self):
        response = list_questions(search="", category="", topic="", difficulty="", question_type="", company="", role="", status="Approved", page=1, page_size=1, db=self.db)
        self.assertEqual(response["total"], 1)
        self.assertEqual(response["items"][0]["id"], "approved-1")
        filtered = list_questions(search="", category="", topic="", difficulty="", question_type="", company="tcs", role="software-engineer", status="Approved", page=1, page_size=20, db=self.db)
        self.assertEqual(filtered["total"], 1)
        role_only = list_questions(search="", category="", topic="", difficulty="", question_type="", company="", role="software-engineer", status="all", page=1, page_size=20, db=self.db)
        self.assertEqual(role_only["total"], 2)
        all_status = list_questions(search="", category="", topic="", difficulty="", question_type="", company="", role="", status="all", page=1, page_size=1, db=self.db)
        self.assertEqual(all_status["total"], 2)
        self.assertEqual(all_status["pages"], 2)

    def test_approval_audit_and_test_requires_approved_questions(self):
        pending_test = TrainerTestRequest(id="test-1", title="Test", roleName="Software Engineer", status="Draft", sections=[{"id": "s1", "type": "MCQ", "selectedQuestionIds": ["pending-1"]}])
        with self.assertRaises(HTTPException) as denied:
            save_trainer_test("test-1", pending_test, User(id="admin-1", role="admin"), self.db)
        self.assertEqual(denied.exception.status_code, 422)
        with self.assertRaises(HTTPException) as approval_without_evidence:
            review_question("pending-1", QuestionReviewRequest(status="Approved", note="Verified answer and explanations."), User(id="admin-1", role="admin"), self.db)
        self.assertEqual(approval_without_evidence.exception.status_code, 422)
        reviewed = review_question("pending-1", QuestionReviewRequest(status="Approved", note="Verified answer and explanations.", structural_status="Structurally Validated", answer_status="Answer Verified", expert_review_status="Expert Reviewed", evidence="Compared with authoritative Python documentation and recalculated independently."), User(id="admin-1", role="admin"), self.db)
        self.assertEqual(reviewed["review_status"], "Approved")
        self.assertEqual(self.connection.execute("SELECT COUNT(*) FROM question_review_events WHERE question_id='pending-1'").fetchone()[0], 1)
        request = TrainerTestRequest(id="test-1", title="Test", roleName="Software Engineer", status="Draft", totalTime=10, totalScore=1,
            sections=[{"id": "s1", "name": "Python", "type": "MCQ", "timeLimit": 10, "questionsCount": 1, "score": 1, "selectedQuestionIds": ["pending-1"]}])
        saved = save_trainer_test("test-1", request, User(id="admin-1", role="admin"), self.db)
        self.assertEqual(saved["id"], "test-1")
        self.db.execute("SELECT section_data FROM trainer_test_sections WHERE test_id=%s", ("test-1",))
        self.assertEqual(self.db.fetchone()["section_data"]["selectedQuestionIds"], ["pending-1"])


if __name__ == "__main__":
    unittest.main()
