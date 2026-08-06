import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1] / "placement_assessment_system"))

from validator import validate_and_enrich_question, contains_weak_distractors, is_text_truncated

def test_validator_rejects_weak_distractors():
    opts = ["36", "Not Defined", "None of the Above", "Insufficient Data"]
    assert contains_weak_distractors(opts) is True

def test_validator_enriches_valid_question():
    q = {
        "id": "q101",
        "category": "Aptitude",
        "topic": "Percentages",
        "difficulty": "Easy",
        "question": "What is 20% of 500?",
        "options": ["100", "90", "110", "120"],
        "correct_option": "A",
        "explanation": "20% of 500 = (20/100)*500 = 100."
    }
    is_valid, errs, enriched = validate_and_enrich_question(q)
    assert is_valid is True
    assert len(errs) == 0
    assert enriched["id"] == "q101"
    assert enriched["category"] == "Aptitude"
    assert enriched["generator_version"] == "v2.0_validated"

def test_validator_detects_truncated_text():
    assert is_text_truncated("What is the speed of...") is True
    assert is_text_truncated("Find the value of x when x is equal to") is True
    assert is_text_truncated("What is 5 + 5?") is False

