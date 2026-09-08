import os
import sys
import json
from datetime import datetime, timezone
from fastapi.testclient import TestClient

backend_dir = os.path.join(os.path.dirname(__file__), "../backend")
sys.path.insert(0, backend_dir)

from app import app

client = TestClient(app)

print("=== 1. Test Single Submission automatically logged to bulk_test_submissions with Date ===")
single_roll = "22341A05BULK1"
today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")

single_submission = {
    "session_id": "sess_single_bulk_test_001",
    "student_name": "Ananya Reddy",
    "roll_number": single_roll,
    "role": "Full Stack Developer Intern",
    "branch": "CSE",
    "total_marks": 17.5,
    "max_marks": 20.0,
    "percentage": 87.5,
    "total_questions": 5,
    "attempted": 5,
    "correct_count": 4,
    "wrong_count": 1,
    "unanswered_count": 0,
    "violations_count": 0,
    "status": "completed",
    "question_answers": [
        {"category": "Aptitude", "topic": "Probability", "difficulty": "Medium", "is_correct": True, "marks_awarded": 1.0, "time_spent": 35},
        {"category": "Coding", "topic": "Dynamic Programming", "difficulty": "Hard", "is_correct": True, "marks_awarded": 15.0, "time_spent": 120}
    ]
}

res_single = client.post(
    "/api/assessment/fixly/submit-direct",
    json=single_submission,
    headers={"X-API-Key": "devsecretkey"}
)
print("Single Submit Status:", res_single.status_code)
assert res_single.status_code == 200

print("\n=== 2. Test POST /api/cdc/bulk-submit with Batch & Test Date ===")
bulk_payload = {
    "batch_id": "CAMPUS_DRIVE_BATCH_A",
    "test_date": today_str,
    "submissions": [
        {
            "roll_number": "22341A05B01",
            "student_name": "Rohan Sharma",
            "branch": "CSE",
            "role": "Data Engineer Intern",
            "total_marks": 16.0,
            "max_marks": 20.0,
            "percentage": 80.0,
            "violations_count": 0,
            "status": "completed",
            "question_answers": [
                {"category": "Computer_Fundamentals", "topic": "SQL & Normalization", "difficulty": "Medium", "is_correct": True, "marks_awarded": 1.0, "time_spent": 28}
            ]
        },
        {
            "roll_number": "22341A05B02",
            "student_name": "Sneha Patel",
            "branch": "ECE",
            "role": "Embedded Systems Intern",
            "total_marks": 11.0,
            "max_marks": 20.0,
            "percentage": 55.0,
            "violations_count": 1,
            "status": "completed",
            "question_answers": [
                {"category": "Aptitude", "topic": "Number Series", "difficulty": "Easy", "is_correct": True, "marks_awarded": 1.0, "time_spent": 20}
            ]
        },
        {
            "roll_number": "22341A05B03",
            "student_name": "Vikram Varma",
            "branch": "CSE",
            "role": "Cybersecurity Intern",
            "total_marks": 8.0,
            "max_marks": 20.0,
            "percentage": 40.0,
            "violations_count": 0,
            "status": "completed",
            "question_answers": [
                {"category": "Computer_Fundamentals", "topic": "Cryptography", "difficulty": "Hard", "is_correct": False, "marks_awarded": 0.0, "time_spent": 45}
            ]
        }
    ]
}

res_bulk = client.post("/api/cdc/bulk-submit", json=bulk_payload)
print("Bulk Submit Status:", res_bulk.status_code)
bulk_resp = res_bulk.json()
print("Saved Count:", bulk_resp.get("saved_count"))
print("Batch ID:", bulk_resp.get("batch_id"))
print("Test Date:", bulk_resp.get("test_date"))
print("Tier Distribution:", bulk_resp.get("tier_distribution"))
assert bulk_resp.get("saved_count") == 3

print(f"\n=== 3. Test GET /api/cdc/bulk-tests?date={today_str} ===")
res_query = client.get(f"/api/cdc/bulk-tests?date={today_str}")
print("Query Status:", res_query.status_code)
query_data = res_query.json()
print("Total tests on date", today_str, ":", query_data.get("total_count"))
for item in query_data.get("results", [])[:5]:
    print(f"  * {item.get('test_date')} | {item.get('roll_number')} | {item.get('student_name')} | {item.get('percentage')}% | {item.get('placement_tier')}")

assert query_data.get("total_count") >= 4

print(f"\n=== 4. Test GET /api/cdc/bulk-tests/summary?date={today_str} ===")
res_sum = client.get(f"/api/cdc/bulk-tests/summary?date={today_str}")
print("Summary Status:", res_sum.status_code)
sum_data = res_sum.json()
print("Daily Summary Rows:", len(sum_data.get("summary", [])))
for s_row in sum_data.get("summary", []):
    print(f"  * Date: {s_row.get('test_date')} | Branch: {s_row.get('branch')} | Students: {s_row.get('total_students_tested')} | Avg%: {s_row.get('avg_percentage')} | Tier 1: {s_row.get('tier_1_count')} | Tier 2: {s_row.get('tier_2_count')} | Remedial: {s_row.get('remedial_count')}")

print("\n[ALL BULK TEST SEPARATE TABLE WITH DATE TESTS PASSED SUCCESSFULLY!]")
