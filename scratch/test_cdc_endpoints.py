import os
import sys
import json
from fastapi.testclient import TestClient

backend_dir = os.path.join(os.path.dirname(__file__), "../backend")
sys.path.insert(0, backend_dir)

from app import app

client = TestClient(app)

print("=== 1. Test GET /api/cdc/all-results (with tier filter) ===")
res = client.get("/api/cdc/all-results")
print("Status:", res.status_code)
data = res.json()
print("Total submissions found:", data.get("total_count"))
if data.get("results"):
    sample = data["results"][0]
    print(f"Sample candidate: {sample.get('roll_number')} | Score: {sample.get('percentage')}% | Tier: {sample.get('placement_tier')} ({sample.get('tier_band')}) | Strongest: {sample.get('strongest_topic')} | Pacing: {sample.get('pacing_efficiency')}")

print("\n=== 2. Test Direct Mock Exam Submission with Telemetry & Automated Calculations ===")
mock_roll = "22341A05TIER1"
mock_submission = {
    "session_id": "test_sess_cdc_mastery_101",
    "student_name": "Praveen Kumar",
    "roll_number": mock_roll,
    "role": "Cloud / DevOps Engineer Intern",
    "branch": "CSE",
    "total_marks": 18.0,
    "max_marks": 20.0,
    "percentage": 90.0,
    "total_questions": 5,
    "attempted": 5,
    "correct_count": 4,
    "wrong_count": 1,
    "unanswered_count": 0,
    "violations_count": 0,
    "status": "completed",
    "question_answers": [
        {
            "question_id": "q1",
            "category": "Aptitude",
            "topic": "Time and Work",
            "difficulty": "Easy",
            "student_answer": "Option A",
            "correct_option": "Option A",
            "is_correct": True,
            "marks_awarded": 1.0,
            "time_spent": 24
        },
        {
            "question_id": "q2",
            "category": "Aptitude",
            "topic": "Time and Work",
            "difficulty": "Medium",
            "student_answer": "Option B",
            "correct_option": "Option B",
            "is_correct": True,
            "marks_awarded": 1.0,
            "time_spent": 38
        },
        {
            "question_id": "q3",
            "category": "Computer_Fundamentals",
            "topic": "Docker & Containers",
            "difficulty": "Medium",
            "student_answer": "Option C",
            "correct_option": "Option C",
            "is_correct": True,
            "marks_awarded": 1.0,
            "time_spent": 19
        },
        {
            "question_id": "q4",
            "category": "Verbal",
            "topic": "Sentence Correction",
            "difficulty": "Easy",
            "student_answer": "Option A",
            "correct_option": "Option D",
            "is_correct": False,
            "marks_awarded": 0.0,
            "time_spent": 12
        },
        {
            "question_id": "q5",
            "category": "Coding",
            "topic": "Binary Search",
            "difficulty": "Hard",
            "student_answer": "def search(): return 0",
            "correct_option": "Valid Code",
            "is_correct": True,
            "marks_awarded": 15.0,
            "time_spent": 115
        }
    ]
}

submit_res = client.post(
    "/api/assessment/fixly/submit-direct",
    json=mock_submission,
    headers={"X-API-Key": "devsecretkey"}
)
print("Submit Status:", submit_res.status_code, submit_res.json().get("status"))

print(f"\n=== 3. Verify GET /api/cdc/student/{mock_roll} ===")
res_student = client.get(f"/api/cdc/student/{mock_roll}")
print("Status:", res_student.status_code)
student_data = res_student.json()
assert student_data.get("found") is True
s = student_data["student"]

print(f"Candidate: {s['student_name']} ({s['roll_number']})")
print(f"Score: {s['total_marks']} / {s['max_marks']} ({s['percentage']}%)")

tier = s.get("placement_tier", {})
print("\n--- Automated Placement Tier ---")
print(f"Tier: {tier.get('tier')}")
print(f"Band: {tier.get('band')}")
print(f"Expected CTC Range: {tier.get('expected_ctc_range')}")
print(f"Recommended Companies: {tier.get('recommended_companies')[:5]}")
assert tier.get("tier") == "Tier-1 Product Ready"

mastery = s.get("topic_mastery", {})
print("\n--- Automated Topic Mastery ---")
print(f"Total Topics Evaluated: {mastery.get('total_topics_evaluated')}")
print(f"Strongest Topics: {mastery.get('strongest_topics')}")
print(f"Weakest Topics: {mastery.get('weakest_topics')}")
for topic_name, t_info in mastery.get("topics", {}).items():
    print(f"  * {topic_name}: {t_info['correct']}/{t_info['total_questions']} correct ({t_info['accuracy']}%) | {t_info['mastery_level']} | Avg Time: {t_info['avg_time_per_question_sec']}s")

assert "Time and Work" in mastery.get("topics", {})
assert mastery["topics"]["Time and Work"]["accuracy"] == 100.0

diff = s.get("difficulty_breakdown", {})
print("\n--- Difficulty Breakdown ---")
for d_level, d_info in diff.items():
    print(f"  * {d_level}: {d_info['correct']}/{d_info['total']} ({d_info['accuracy']}%)")

pacing = s.get("pacing_telemetry", {})
print("\n--- Pacing Telemetry ---")
print(f"Total Time: {pacing.get('total_time_seconds')} seconds")
print(f"Avg Time per Question: {pacing.get('avg_time_per_question_sec')} seconds")
print(f"Pacing Efficiency Rating: {pacing.get('pacing_efficiency')}")

print(f"\n=== 4. Test Dedicated Analytics Dossier: GET /api/cdc/student/{mock_roll}/analytics ===")
res_analytics = client.get(f"/api/cdc/student/{mock_roll}/analytics")
print("Analytics Dossier Status:", res_analytics.status_code)
assert res_analytics.status_code == 200

print(f"\n=== 5. Test Public Portfolio Reflection: GET /api/portfolio/{mock_roll} ===")
res_port = client.get(f"/api/portfolio/{mock_roll}")
print("Portfolio Status:", res_port.status_code)
port_data = res_port.json()
print(f"Portfolio Placement Tier: {port_data.get('placement_tier')}")
print(f"Portfolio Strongest Topic: {port_data.get('strongest_topic')}")
print(f"Portfolio Weakest Topic: {port_data.get('weakest_topic')}")
assert port_data.get("placement_tier") == "Tier-1 Product Ready"

print(f"\n=== 6. Test Public HTML Page: GET /u/{mock_roll} ===")
res_html = client.get(f"/u/{mock_roll}")
print("HTML Status:", res_html.status_code)
assert "Tier-1 Product Ready" in res_html.text
print("HTML contains Tier-1 Badge: True")

print("\n[ALL CDC HITAM TOPIC MASTERY & PLACEMENT TIER AUTOMATION TESTS PASSED!]")
