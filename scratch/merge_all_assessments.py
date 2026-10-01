import os
import json
import sqlite3
import pandas as pd
from datetime import datetime

ROOT_DIR = r'C:\Users\dhanu\OneDrive\Desktop\learn'
techhash_dir = os.path.join(ROOT_DIR, '01_TechHash_Internship_Tests')
os.makedirs(techhash_dir, exist_ok=True)

# 1. Load Vercel Cloud Submissions
vercel_json = os.path.join(techhash_dir, 'Vercel_Cloud_Submissions.json')
cloud_subs = []
if os.path.exists(vercel_json):
    with open(vercel_json, 'r', encoding='utf-8') as f:
        cloud_subs = json.load(f).get('submissions', [])

# 2. Load Local / Ngrok Submissions
local_json = os.path.join(ROOT_DIR, 'learniverse-ai/backend/data/Fixly_Submissions_Live.json')
local_subs = []
if os.path.exists(local_json):
    with open(local_json, 'r', encoding='utf-8') as f:
        local_subs = json.load(f)

# Also check local SQLite
sqlite_path = os.path.join(ROOT_DIR, 'learniverse-ai/backend/placement_assessment_system/assessment_local.db')
sqlite_subs = []
if os.path.exists(sqlite_path):
    conn = sqlite3.connect(sqlite_path)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute("SELECT * FROM fixly_test_submissions;")
    sqlite_subs = [dict(r) for r in cur.fetchall()]
    conn.close()

# 3. Deduplicate / combine all records by (roll_number, submitted_at)
all_records = {}

# Priority: Cloud submissions + Local SQLite + Local JSON
for r in cloud_subs:
    key = (str(r.get('roll_number', '')).strip().upper(), str(r.get('submitted_at', ''))[:19])
    all_records[key] = {**r, 'source_platform': 'Vercel (Cloud)'}

for r in sqlite_subs:
    key = (str(r.get('roll_number', '')).strip().upper(), str(r.get('submitted_at', ''))[:19])
    if key not in all_records:
        all_records[key] = {**r, 'source_platform': 'Local / Ngrok'}

for r in local_subs:
    key = (str(r.get('roll_number', '')).strip().upper(), str(r.get('submitted_at', ''))[:19])
    if key not in all_records:
        all_records[key] = {**r, 'source_platform': 'Local / Ngrok'}

records = list(all_records.values())
# Sort by submitted_at desc
records.sort(key=lambda x: str(x.get('submitted_at', '')), reverse=True)

print(f"Total Combined Candidate Assessments: {len(records)}")

summary_rows = []
detail_rows = []
scenario_rows = []

for r in records:
    student_name = r.get('student_name') or 'Candidate'
    roll_num = str(r.get('roll_number') or 'Unknown').strip().upper()
    role = r.get('role') or 'Engineering Intern'
    src = r.get('source_platform', 'Web')

    summary_rows.append({
        'Source Platform': src,
        'Student Name': student_name,
        'Roll Number': roll_num,
        'Assigned Track': role,
        'Branch': r.get('branch', 'CSE'),
        'Total Marks': r.get('total_marks', 0.0),
        'Max Marks': r.get('max_marks', 70),
        'Percentage (%)': r.get('percentage', 0.0),
        'Attempted': r.get('attempted', 0),
        'Correct': r.get('correct_count', 0),
        'Wrong': r.get('wrong_count', 0),
        'Violations': r.get('violations_count', 0),
        'Status': r.get('status', 'completed'),
        'Submitted At': str(r.get('submitted_at', ''))
    })

    q_ans = r.get('question_answers')
    if isinstance(q_ans, str):
        try:
            q_ans = json.loads(q_ans)
        except Exception:
            q_ans = []

    for q in (q_ans or []):
        q_id = str(q.get('question_id') or '')
        cat = str(q.get('category') or '')
        is_scenario = (cat == 'Real-World Scenarios' or q.get('question_type') == 'scenario' or 'scenario' in q_id.lower())
        ans_text = str(q.get('student_answer') or '').strip()

        detail_rows.append({
            'Source': src,
            'Student Name': student_name,
            'Roll Number': roll_num,
            'Role': role,
            'Question ID': q_id,
            'Category': cat,
            'Topic': q.get('topic'),
            'Question': q.get('question'),
            'Candidate Answer': ans_text,
            'Correct Answer Key': q.get('correct_option'),
            'Is Correct?': 'YES' if q.get('is_correct') else 'NO',
            'Marks Awarded': q.get('marks_awarded', 0)
        })

        if is_scenario:
            w_count = len(ans_text.split()) if ans_text and ans_text != '(unattempted)' else 0
            scenario_rows.append({
                'Source': src,
                'Student Name': student_name,
                'Roll Number': roll_num,
                'Role': role,
                'Topic': q.get('topic'),
                'Scenario Question': q.get('question'),
                'Candidate Architecture Solution': ans_text,
                'Word Count': w_count,
                'Marks Awarded': q.get('marks_awarded', 0),
                'Submitted At': str(r.get('submitted_at', ''))
            })

master_file = os.path.join(techhash_dir, 'ALL_STUDENTS_ASSESSMENT_RESULTS_MASTER.xlsx')
with pd.ExcelWriter(master_file, engine='openpyxl') as writer:
    pd.DataFrame(summary_rows).to_excel(writer, sheet_name='Candidate_Scores', index=False)
    if scenario_rows:
        pd.DataFrame(scenario_rows).to_excel(writer, sheet_name='Scenario_Submissions', index=False)
    if detail_rows:
        pd.DataFrame(detail_rows).to_excel(writer, sheet_name='Question_Breakdown', index=False)

print(f"Master unified Excel successfully written to: {master_file}")
