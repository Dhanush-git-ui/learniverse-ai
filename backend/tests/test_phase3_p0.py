import json
import sys
from pathlib import Path
from unittest.mock import MagicMock

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from auth import User
from fastapi import BackgroundTasks
from placement_assessment_system import api as assessment_api
from placement_assessment_system import multi_tenant_service


ROOT = Path(__file__).resolve().parents[2]


def test_candidate_frontend_does_not_contain_answer_bearing_question_bank():
    page = (ROOT / "src/pages/PlacementAssessment.tsx").read_text(encoding="utf-8")
    question_module = (ROOT / "src/data/assessmentQuestions.ts").read_text(encoding="utf-8")

    assert "getNormalPlacementTestQuestions" not in page
    assert "getLocalQuestionsForRole" not in page
    assert '"correct_option":' not in question_module
    assert "NORMAL_APTITUDE_QUESTIONS" not in question_module
    protected_banks = (
        "admin_question_bank.json",
        "admin_supplemental_question_bank.json",
        "admin_coding_question_bank.json",
        "admin_company_practice_batch_001.json",
        "admin_generated_batch_001.json",
    )
    for bank_name in protected_banks:
        assert not (ROOT / "src/data" / bank_name).exists()
        assert (ROOT / "backend/data" / bank_name).is_file()


def test_assessment_question_templates_are_selected_server_side():
    bank = json.loads((ROOT / "backend/data/assessment_question_templates.json").read_text(encoding="utf-8"))
    react_questions = multi_tenant_service._load_server_question_template("React Native Developer")
    ai_questions = multi_tenant_service._load_server_question_template("AI Engineer")

    assert len(bank) == 9
    assert react_questions
    assert ai_questions
    assert all("correct_option" in question for question in react_questions if question.get("options"))
    assert {question["id"] for question in react_questions} != {question["id"] for question in ai_questions}


def test_create_assessment_ignores_client_supplied_question_answers():
    db = MagicMock()
    db.fetchone.return_value = None
    client_question = {
        "id": "client-controlled",
        "category": "Domain",
        "question": "Injected question",
        "correct_option": "Z",
        "marks": 1000,
    }

    result = multi_tenant_service.create_assessment_test(
        db,
        {
            "company_name": "Synthetic Company",
            "test_name": "Synthetic Assessment",
            "role_track": "AI Engineer",
            "start_time": "2026-11-08T00:00:00+00:00",
            "end_time": "2026-11-09T00:00:00+00:00",
            "questions": [client_question],
        },
    )

    inserted_question_rows = []
    for call in db.execute.call_args_list:
        sql = call.args[0]
        if "INSERT INTO test_questions" in sql:
            inserted_question_rows.append(call.args[1])

    assert result["status"] == "success"
    assert len(inserted_question_rows) == 22
    assert all(row[2] != "client-controlled" for row in inserted_question_rows)
    assert all(json.loads(row[6]).get("correct_option") != "Z" for row in inserted_question_rows)


def test_completed_submission_retry_returns_the_stored_result():
    db = MagicMock()
    db.fetchone.return_value = {
        "total_marks": 4,
        "max_marks": 6,
        "percentage": 66.67,
        "question_answers": [
            {
                "question_id": "q1",
                "category": "Aptitude",
                "question": "Synthetic question",
                "options": ["A", "B"],
                "student_answer": "A",
                "correct_option": "A",
                "is_correct": True,
                "marks_awarded": 4,
            }
        ],
    }
    db.fetchall.return_value = [
        {"section_name": "Aptitude", "marks": 4},
        {"section_name": "Coding", "marks": 0},
    ]

    result = assessment_api._existing_submission_result(db, "synthetic-session")

    assert result == {
        "status": "success",
        "score": {
            "aptitude": 4.0,
            "verbal": 0.0,
            "comp_fundamentals": 0.0,
            "coding": 0.0,
            "total": 4.0,
            "percentage": 66.67,
        },
        "report": [
            {
                "id": "q1",
                "category": "Aptitude",
                "topic": None,
                "difficulty": None,
                "question": "Synthetic question",
                "options": ["A", "B"],
                "correct_option": "A",
                "explanation": "",
                "user_answer": "A",
                "is_correct": True,
                "marks_awarded": 4.0,
                "coding_details": None,
            }
        ],
    }


def test_submit_route_replays_completed_owned_attempt_without_rescoring():
    db = MagicMock()
    db.fetchone.side_effect = [
        {
            "session_id": "synthetic-session",
            "student_roll_number": "STUDENT_1",
            "status": "completed",
        },
        {
            "total_marks": 2,
            "max_marks": 2,
            "percentage": 100,
            "question_answers": [],
        },
    ]
    db.fetchall.return_value = [{"section_name": "Aptitude", "marks": 2}]

    result = assessment_api.submit_test(
        assessment_api.SubmitAttemptRequest(attempt_id="synthetic-session"),
        BackgroundTasks(),
        User(id="STUDENT_1", email="student1@example.org", role="student"),
        db,
    )

    assert result["status"] == "success"
    assert result["score"]["total"] == 2
    assert db.fetchone.call_count == 2


def test_candidate_question_payload_is_sanitized_before_response():
    sanitized = assessment_api._sanitize_questions_for_candidate(
        [{
            "id": "synthetic-q",
            "question": "Synthetic question",
            "options": ["A", "B"],
            "correct_option": "A",
            "answer": "private expected answer",
            "explanation": "private explanation",
        }]
    )

    assert sanitized == [{
        "id": "synthetic-q",
        "question": "Synthetic question",
        "options": ["A", "B"],
    }]
