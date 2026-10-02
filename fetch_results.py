import os
import sys
import json
import time
import sqlite3
import urllib.request
import ssl
import pandas as pd
from datetime import datetime

# Ensure Windows console encoding safety
if sys.stdout is not None:
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass
if sys.stderr is not None:
    try:
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass


ROOT_DIR = r'C:\Users\dhanu\OneDrive\Desktop\learn'
TECHHASH_DIR = os.path.join(ROOT_DIR, '01_TechHash_Internship_Tests')
os.makedirs(TECHHASH_DIR, exist_ok=True)

def safe_write_excel(primary_path, fallback_paths, sheets_dict):
    """Writes multi-sheet excel file safely, writing to all fallbacks and primary if unlocked."""
    def _do_write(target_path):
        with pd.ExcelWriter(target_path, engine='openpyxl') as writer:
            for sname, df in sheets_dict.items():
                if df is not None and not df.empty:
                    df.to_excel(writer, sheet_name=sname, index=False)

    if isinstance(fallback_paths, str):
        fallback_paths = [fallback_paths]

    # 1. Always write all live/fallback copies with full tabs
    for fp in (fallback_paths or []):
        try:
            _do_write(fp)
        except Exception as e:
            pass

    # 2. Try updating primary file
    try:
        _do_write(primary_path)
        return True, primary_path
    except PermissionError:
        return False, fallback_paths[0] if fallback_paths else primary_path
    except Exception as e:
        return False, str(e)


def run_sync():
    now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    print("=" * 60)
    print(f"[{now_str}] Syncing live assessment results from Cloud & Local...")
    print("=" * 60)

    # -------------------------------------------------------------
    # 1. FETCH FROM VERCEL / RENDER CLOUD BACKEND
    # -------------------------------------------------------------
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    headers = {
        'User-Agent': 'Mozilla/5.0',
        'X-API-Key': 'u8vX7q_K4P2mN9bL6wR1tY3zE5sA0dF8hJ9kL2mQ4wE'
    }

    url = 'https://learniverse-ai-zpph.onrender.com/api/assessment/fixly/submissions'
    cloud_subs = []
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30, context=ctx) as resp:
            raw_data = resp.read()
            json_file = os.path.join(TECHHASH_DIR, 'Vercel_Cloud_Submissions.json')
            with open(json_file, 'wb') as f:
                f.write(raw_data)
            parsed = json.loads(raw_data.decode('utf-8'))
            cloud_subs = parsed.get('submissions', [])
            print(f"[OK] Fetched {len(cloud_subs)} submissions from Cloud Backend.")
    except Exception as e:
        print(f"[NOTE] Cloud fetch note: {e}")
        json_file = os.path.join(TECHHASH_DIR, 'Vercel_Cloud_Submissions.json')
        if os.path.exists(json_file):
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    cloud_subs = json.load(f).get('submissions', [])
            except Exception:
                pass

    # -------------------------------------------------------------
    # 2. LOAD APPLICATION ROSTER (74 CANDIDATES)
    # -------------------------------------------------------------
    roster_file = os.path.join(TECHHASH_DIR, 'Source_Documents', 'TeccHash Pvt. Ltd. - Internship Application Form (Responses).xlsx')
    roster_map = {}
    roster_df = pd.DataFrame()
    if os.path.exists(roster_file):
        try:
            roster_df = pd.read_excel(roster_file)
            name_col = next((c for c in roster_df.columns if 'name' in c.lower()), 'Full Name')
            roll_col = next((c for c in roster_df.columns if 'roll' in c.lower()), 'Roll Number ')
            role_col = next((c for c in roster_df.columns if 'role' in c.lower()), 'Internship Role Applying For')
            branch_col = next((c for c in roster_df.columns if 'branch' in c.lower()), 'Branch / Department')
            phone_col = next((c for c in roster_df.columns if 'phone' in c.lower() or 'whatsapp' in c.lower()), 'Phone Number / WhatsApp Number')

            for _, row in roster_df.iterrows():
                r_num = str(row.get(roll_col, '')).strip().upper()
                if r_num and r_num != 'NAN':
                    roster_map[r_num] = {
                        'name': str(row.get(name_col, '')).strip(),
                        'role': str(row.get(role_col, '')).strip(),
                        'branch': str(row.get(branch_col, '')).strip(),
                        'phone': str(row.get(phone_col, '')).strip()
                    }
        except Exception as e:
            print(f"[NOTE] Roster parse note: {e}")


    # -------------------------------------------------------------
    # 3. LOAD LOCAL / NGROK SUBMISSIONS
    # -------------------------------------------------------------
    local_json = os.path.join(ROOT_DIR, 'learniverse-ai/backend/data/Fixly_Submissions_Live.json')
    local_subs = []
    if os.path.exists(local_json):
        try:
            with open(local_json, 'r', encoding='utf-8') as f:
                local_subs = json.load(f)
        except Exception:
            pass

    sqlite_path = os.path.join(ROOT_DIR, 'learniverse-ai/backend/placement_assessment_system/assessment_local.db')
    sqlite_subs = []
    if os.path.exists(sqlite_path):
        try:
            conn = sqlite3.connect(sqlite_path)
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute("SELECT * FROM fixly_test_submissions;")
            sqlite_subs = [dict(r) for r in cur.fetchall()]
            conn.close()
        except Exception:
            pass

    # -------------------------------------------------------------
    # 4. INTELLIGENT DEDUPLICATION & ENRICHMENT
    # -------------------------------------------------------------
    all_records = {}

    def process_submission(r, source_name):
        roll = str(r.get('roll_number', '')).strip().upper()
        # Group near-instant duplicate requests (within same minute)
        sub_at = str(r.get('submitted_at', ''))[:16]
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
            
            # Prefer entries that have real student name over generic 'Candidate'
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
    records.sort(key=lambda x: str(x.get('submitted_at', '')), reverse=True)

    # -------------------------------------------------------------
    # 5. PREPARE SHEETS: SCORECARD, SCENARIOS, ALL QUESTION ANSWERS
    # -------------------------------------------------------------
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
                'Source Platform': src,
                'Student Name': student_name,
                'Roll Number': roll_num,
                'Role / Track': role,
                'Question ID': q_id,
                'Category': cat,
                'Topic': q.get('topic'),
                'Question': q.get('question'),
                'Candidate Answer': ans_text,
                'Correct Answer Key': q.get('correct_option'),
                'Is Correct?': 'YES' if q.get('is_correct') else 'NO',
                'Marks Awarded': q.get('marks_awarded', 0),
                'Submitted At': str(r.get('submitted_at', ''))
            })

            if is_scenario:
                w_count = len(ans_text.split()) if ans_text and ans_text != '(unattempted)' else 0
                scenario_rows.append({
                    'Student Name': student_name,
                    'Roll Number': roll_num,
                    'Assigned Track / Role': role,
                    'Topic': q.get('topic'),
                    'Scenario Question': q.get('question'),
                    'Candidate Written Solution': ans_text,
                    'Word Count': w_count,
                    'Marks Awarded': q.get('marks_awarded', 0),
                    'Submitted At': str(r.get('submitted_at', '')),
                    'Source': src
                })

    # -------------------------------------------------------------
    # 6. GENERATE STATUS TRACKER FOR ALL 74 ROSTER APPLICANTS
    # -------------------------------------------------------------
    status_rows = []
    if not roster_df.empty:
        # Build multi-index candidate lookups (by roll, clean_roll, and candidate name)
        completed_by_roll = {}
        completed_by_clean_roll = {}
        completed_by_name = {}

        for r in records:
            roll = str(r.get('roll_number', '')).strip().upper()
            marks = float(r.get('total_marks') or 0.0)
            name = str(r.get('student_name', '')).strip().lower()
            clean_roll = ''.join(c for c in roll if c.isalnum())

            # Keep highest scoring attempt per candidate
            if roll and (roll not in completed_by_roll or marks > float(completed_by_roll[roll].get('total_marks') or 0.0)):
                completed_by_roll[roll] = r
            if clean_roll and (clean_roll not in completed_by_clean_roll or marks > float(completed_by_clean_roll[clean_roll].get('total_marks') or 0.0)):
                completed_by_clean_roll[clean_roll] = r
            if name and name not in ['candidate', 'unknown']:
                if name not in completed_by_name or marks > float(completed_by_name[name].get('total_marks') or 0.0):
                    completed_by_name[name] = r

        for _, row in roster_df.iterrows():
            name = str(row.get(name_col, '')).strip()
            roll = str(row.get(roll_col, '')).strip().upper()
            role = str(row.get(role_col, '')).strip()
            branch = str(row.get(branch_col, '')).strip()
            phone = str(row.get(phone_col, '')).strip()

            r_clean = ''.join(c for c in roll if c.isalnum())
            
            # Robust matching: exact roll -> alphanumeric roll -> fuzzy roll (missing 'E') -> name fallback
            sub = completed_by_roll.get(roll)
            if not sub:
                sub = completed_by_clean_roll.get(r_clean)
            if not sub:
                r_no_e = r_clean.replace('E', '')
                for cr, cand in completed_by_clean_roll.items():
                    if cr.replace('E', '') == r_no_e:
                        sub = cand
                        break
            if not sub:
                sub = completed_by_name.get(name.lower())

            if sub:
                status_rows.append({
                    'Full Name': name,
                    'Roll Number': roll,
                    'Applied Role': role,
                    'Branch': branch,
                    'Phone Number': phone,
                    'Test Status': 'COMPLETED',
                    'Total Marks': sub.get('total_marks', 0.0),
                    'Max Marks': sub.get('max_marks', 70),
                    'Percentage (%)': sub.get('percentage', 0.0),
                    'Violations': sub.get('violations_count', 0),
                    'Submitted At': str(sub.get('submitted_at', ''))
                })
            else:
                status_rows.append({
                    'Full Name': name,
                    'Roll Number': roll,
                    'Applied Role': role,
                    'Branch': branch,
                    'Phone Number': phone,
                    'Test Status': 'NOT ATTEMPTED YET',
                    'Total Marks': 0.0,
                    'Max Marks': 70,
                    'Percentage (%)': 0.0,
                    'Violations': 0,
                    'Submitted At': '-'
                })

    df_status = pd.DataFrame(status_rows)
    df_scenarios = pd.DataFrame(scenario_rows)
    df_answers = pd.DataFrame(detail_rows)
    df_scorecard = pd.DataFrame(summary_rows)

    sheets_payload = {
        'Applicant_Status_Tracker': df_status,
        'Scenario_Solutions': df_scenarios,
        'All_Question_Answers': df_answers,
        'Completed_Scorecard': df_scorecard
    }

    # -------------------------------------------------------------
    # 7. SAVE TO BOTH WORKBOOKS WITH FULL TABS
    # -------------------------------------------------------------
    # Primary 1: TechHash_Applicants_Test_Status.xlsx
    status_file = os.path.join(TECHHASH_DIR, 'TechHash_Applicants_Test_Status.xlsx')
    status_live = os.path.join(TECHHASH_DIR, 'TechHash_Applicants_Test_Status_Live.xlsx')
    status_latest = os.path.join(TECHHASH_DIR, 'TechHash_Applicants_Test_Status_LATEST.xlsx')
    ok, path_saved = safe_write_excel(status_file, [status_latest, status_live], sheets_payload)
    if ok:
        print(f"[SUCCESS] Updated Status Workbook (All 4 Tabs): {path_saved}")
    else:
        print(f"[LOCKED] TechHash_Applicants_Test_Status.xlsx is currently open in Excel.")
        print(f"--> Live data automatically updated across tabs to: {status_latest} and {status_live}")

    # Primary 2: ALL_STUDENTS_ASSESSMENT_RESULTS_MASTER.xlsx
    master_file = os.path.join(TECHHASH_DIR, 'ALL_STUDENTS_ASSESSMENT_RESULTS_MASTER.xlsx')
    master_live = os.path.join(TECHHASH_DIR, 'ALL_STUDENTS_ASSESSMENT_RESULTS_MASTER_LATEST.xlsx')
    ok_m, master_saved = safe_write_excel(master_file, [master_live], sheets_payload)
    if ok_m:
        print(f"[SUCCESS] Updated Master Dossier: {master_saved}")


    # Summary
    completed_candidates = [s for s in status_rows if s['Test Status'] == 'COMPLETED']
    print("=" * 60)
    print(f"Status Summary: {len(completed_candidates)} / {len(status_rows)} applicants completed")
    print(f"Scenario Solutions Saved: {len(scenario_rows)} written solutions")
    print(f"Total Question Answers Logged: {len(detail_rows)} answers")
    print("=" * 60)

if __name__ == '__main__':
    is_watch = '--watch' in sys.argv or '--loop' in sys.argv
    interval = 30
    for arg in sys.argv:
        if arg.startswith('--interval='):
            try:
                interval = int(arg.split('=')[1])
            except Exception:
                pass

    if is_watch:
        print(f"[WATCHER] Starting Auto-Sync Watcher (polling every {interval}s)... Press Ctrl+C to stop.", flush=True)
        try:
            while True:
                run_sync()
                time.sleep(interval)
        except KeyboardInterrupt:
            print("\nWatcher stopped.", flush=True)
    else:
        run_sync()

