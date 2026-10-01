import urllib.request
import json
import ssl
import os
import pandas as pd

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0',
    'X-API-Key': 'u8vX7q_K4P2mN9bL6wR1tY3zE5sA0dF8hJ9kL2mQ4wE'
}

url = 'https://learniverse-ai-zpph.onrender.com/api/assessment/fixly/submissions'
print(f"Connecting to Render Cloud: {url}")

req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, timeout=45, context=ctx) as resp:
    raw_data = resp.read()

os.makedirs('01_TechHash_Internship_Tests', exist_ok=True)
json_file = '01_TechHash_Internship_Tests/Vercel_Cloud_Submissions.json'
with open(json_file, 'wb') as f:
    f.write(raw_data)

parsed = json.loads(raw_data.decode('utf-8'))
subs = parsed.get('submissions', [])
print(f"Downloaded {len(subs)} submissions from Vercel Cloud!")

summary_rows = []
detail_rows = []
scenario_rows = []

for s in subs:
    student_name = s.get('student_name') or 'Candidate'
    roll_num = str(s.get('roll_number') or 'Unknown').strip().upper()
    role = s.get('role') or 'Engineering Intern'

    summary_rows.append({
        'Student Name': student_name,
        'Roll Number': roll_num,
        'Assigned Track / Role': role,
        'Department / Branch': s.get('branch'),
        'Total Marks Obtained': s.get('total_marks'),
        'Max Marks': s.get('max_marks'),
        'Score Percentage': s.get('percentage'),
        'Questions Attempted': s.get('attempted'),
        'Correct Count': s.get('correct_count'),
        'Wrong Count': s.get('wrong_count'),
        'Unanswered Count': s.get('unanswered_count'),
        'Violations Count': s.get('violations_count', 0),
        'Status': s.get('status'),
        'Submitted At (UTC)': str(s.get('submitted_at'))
    })

    q_ans = s.get('question_answers')
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
            'Student Name': student_name,
            'Roll Number': roll_num,
            'Role': role,
            'Question ID': q_id,
            'Category': cat,
            'Topic': q.get('topic'),
            'Question': q.get('question'),
            'Student Answer': ans_text,
            'Correct Option': q.get('correct_option'),
            'Is Correct': 'YES' if q.get('is_correct') else 'NO',
            'Marks Awarded': q.get('marks_awarded', 0)
        })

        if is_scenario:
            w_count = len(ans_text.split()) if ans_text and ans_text != '(unattempted)' else 0
            scenario_rows.append({
                'Student Name': student_name,
                'Roll Number': roll_num,
                'Role': role,
                'Topic': q.get('topic'),
                'Scenario Question': q.get('question'),
                'Student Written Solution': ans_text,
                'Word Count': w_count,
                'Marks Awarded': q.get('marks_awarded', 0),
                'Submitted At': str(s.get('submitted_at'))
            })

excel_out = '01_TechHash_Internship_Tests/Vercel_Students_Assessment_Results.xlsx'
with pd.ExcelWriter(excel_out, engine='openpyxl') as writer:
    pd.DataFrame(summary_rows).to_excel(writer, sheet_name='Candidate_Scores', index=False)
    if scenario_rows:
        pd.DataFrame(scenario_rows).to_excel(writer, sheet_name='Scenario_Submissions', index=False)
    if detail_rows:
        pd.DataFrame(detail_rows).to_excel(writer, sheet_name='Question_Breakdown', index=False)

print(f"Successfully generated master Vercel Excel at: {excel_out}")
print("Submissions found:")
for row in summary_rows:
    print(f"  -> {row['Roll Number']} | {row['Student Name']} | Marks: {row['Total Marks Obtained']} | Status: {row['Status']} | Submitted: {row['Submitted At (UTC)']}")
