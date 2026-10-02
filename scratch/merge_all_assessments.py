import os
import json
import sqlite3
import pandas as pd
from datetime import datetime

ROOT_DIR = r'C:\Users\dhanu\OneDrive\Desktop\learn'
techhash_dir = os.path.join(ROOT_DIR, '01_TechHash_Internship_Tests')
os.makedirs(techhash_dir, exist_ok=True)

# 0. Build Roster Lookup from Application Form Responses
roster_file = os.path.join(techhash_dir, 'Source_Documents', 'TeccHash Pvt. Ltd. - Internship Application Form (Responses).xlsx')
roster_map = {}
if os.path.exists(roster_file):
    try:
        roster_df = pd.read_excel(roster_file)
        # Find roll number and name columns
        name_col = next((c for c in roster_df.columns if 'name' in c.lower()), 'Full Name')
        roll_col = next((c for c in roster_df.columns if 'roll' in c.lower()), 'Roll Number ')
        role_col = next((c for c in roster_df.columns if 'role' in c.lower()), 'Internship Role Applying For')
        branch_col = next((c for c in roster_df.columns if 'branch' in c.lower()), 'Branch / Department')

        for _, row in roster_df.iterrows():
            r_num = str(row.get(roll_col, '')).strip().upper()
            if r_num and r_num != 'NAN':
                roster_map[r_num] = {
                    'name': str(row.get(name_col, '')).strip(),
                    'role': str(row.get(role_col, '')).strip(),
                    'branch': str(row.get(branch_col, '')).strip()
                }
    except Exception as e:
        print(f"Notice: Roster lookup parse note: {e}")

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

# 3. Intelligent Deduplication and Selection
# If multiple records exist for the same student, choose the one with:
# 1) Non-generic name, 2) Highest total marks / answers, 3) Most recent timestamp
all_records = {}

def process_submission(r, source_name):
    roll = str(r.get('roll_number', '')).strip().upper()
    sub_at = str(r.get('submitted_at', ''))[:19]
    key = (roll, sub_at)
    
    # Auto-enrich name from roster if missing or generic 'Candidate'
    curr_name = str(r.get('student_name', '')).strip()
    if (not curr_name or curr_name.lower() in ['candidate', 'unknown']) and roll in roster_map:
        r['student_name'] = roster_map[roll]['name']
    
    # Auto-enrich role if missing
    if (not r.get('role') or r.get('role') == 'Engineering Intern') and roll in roster_map:
        r['role'] = roster_map[roll]['role']
        
    entry = {**r, 'source_platform': source_name}
    
    if key not in all_records:
        all_records[key] = entry
    else:
        existing = all_records[key]
        ex_name = str(existing.get('student_name', '')).strip()
        new_name = str(entry.get('student_name', '')).strip()
        ex_marks = float(existing.get('total_marks') or 0.0)
        new_marks = float(entry.get('total_marks') or 0.0)
        
        # Replace if current entry has a real candidate name and existing is generic
        if ex_name.lower() in ['candidate', 'unknown'] and new_name.lower() not in ['candidate', 'unknown']:
            all_records[key] = entry
        elif new_marks > ex_marks:
            all_records[key] = entry

for r in cloud_subs:
    process_submission(r, 'Vercel (Cloud)')

for r in sqlite_subs:
    process_submission(r, 'Local / Ngrok')

for r in local_subs:
    process_submission(r, 'Local / Ngrok')

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
