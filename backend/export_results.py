"""
Fixly Placement Assessment - Results Exporter Utility
Exports candidate test submissions from Neon DB (PostgreSQL), local SQLite, and persistent file backups
to an Excel sheet (Fixly_Assessment_Results_LATEST.xlsx and timestamped copy).

Usage:
    python export_results.py
"""

import os
import json
import sqlite3
from datetime import datetime
from dotenv import load_dotenv
import pandas as pd

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
load_dotenv()

DB_URL = os.environ.get("DATABASE_URL")
SQLITE_PATH = os.path.join(os.path.dirname(__file__), "placement_assessment_system/assessment_local.db")
BACKUP_JSON_PATH = os.path.join(os.path.dirname(__file__), "data/Fixly_Submissions_Live.json")

def fetch_all_submissions():
    records_by_roll = {}
    sources_found = []

    # 1. Try PostgreSQL (Neon DB)
    if DB_URL:
        try:
            import psycopg2
            from psycopg2.extras import RealDictCursor
            conn = psycopg2.connect(DB_URL)
            cur = conn.cursor(cursor_factory=RealDictCursor)
            cur.execute("SELECT * FROM fixly_test_submissions ORDER BY submitted_at DESC;")
            pg_rows = cur.fetchall() or []
            conn.close()
            for r in pg_rows:
                roll = str(r.get("roll_number", "")).strip().upper()
                if roll and roll not in records_by_roll:
                    records_by_roll[roll] = dict(r)
            if pg_rows:
                sources_found.append(f"Neon PostgreSQL ({len(pg_rows)} rows)")
        except Exception as e:
            print(f"[NOTE] Neon DB: {e}")

    # 2. Try SQLite
    if os.path.exists(SQLITE_PATH):
        try:
            conn = sqlite3.connect(SQLITE_PATH)
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute("SELECT * FROM fixly_test_submissions ORDER BY submitted_at DESC;")
            sqlite_rows = [dict(row) for row in cur.fetchall()]
            conn.close()
            for r in sqlite_rows:
                roll = str(r.get("roll_number", "")).strip().upper()
                if roll and roll not in records_by_roll:
                    records_by_roll[roll] = r
            if sqlite_rows:
                sources_found.append(f"SQLite ({len(sqlite_rows)} rows)")
        except Exception as e:
            print(f"[NOTE] SQLite: {e}")

    # 3. Try Local Disk Backup JSON
    if os.path.exists(BACKUP_JSON_PATH):
        try:
            with open(BACKUP_JSON_PATH, "r", encoding="utf-8") as f:
                backup_rows = json.load(f)
            for r in backup_rows:
                roll = str(r.get("roll_number", "")).strip().upper()
                if roll and roll not in records_by_roll:
                    records_by_roll[roll] = r
            if backup_rows:
                sources_found.append(f"Disk Backup JSON ({len(backup_rows)} rows)")
        except Exception as e:
            print(f"[NOTE] Disk Backup JSON: {e}")

    return list(records_by_roll.values()), ", ".join(sources_found) if sources_found else "None"

def export_to_excel():
    records, source = fetch_all_submissions()
    print(f"Aggregated {len(records)} candidate submissions from: {source}")

    if not records:
        print("No test submissions found yet in database or backup files.")
        return None

    # 1. Summary Sheet
    summary_rows = []
    for r in records:
        summary_rows.append({
            "Submission ID": r.get("id") or r.get("session_id"),
            "Student Name": r.get("student_name"),
            "Roll Number": r.get("roll_number"),
            "Assigned Track / Role": r.get("role"),
            "Department / Branch": r.get("branch"),
            "Total Marks Obtained": r.get("total_marks"),
            "Max Marks": r.get("max_marks", 20),
            "Score Percentage (%)": r.get("percentage"),
            "Total Questions": r.get("total_questions", 20),
            "Questions Attempted": r.get("attempted"),
            "Correct Count": r.get("correct_count"),
            "Wrong Count": r.get("wrong_count"),
            "Unanswered Count": r.get("unanswered_count"),
            "Violations Count": r.get("violations_count", 0),
            "Status": r.get("status", "completed"),
            "Submitted At (UTC)": str(r.get("submitted_at"))
        })

    df_summary = pd.DataFrame(summary_rows)

    # 2. Detailed Question Answers Sheet & 3. Dedicated Scenario Submissions Sheet
    detail_rows = []
    scenario_rows = []

    # Prepare Candidate Submissions folder in 01_TechHash_Internship_Tests
    techhash_cand_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../01_TechHash_Internship_Tests/Candidate_Submissions"))
    os.makedirs(techhash_cand_dir, exist_ok=True)

    for r in records:
        student_name = r.get("student_name") or "Candidate"
        roll_num = str(r.get("roll_number") or "Unknown").strip().upper()
        role = r.get("role") or "Engineering Intern"
        safe_name = "".join(c for c in student_name if c.isalnum() or c in (" ", "_", "-")).strip().replace(" ", "_")
        
        q_ans = r.get("question_answers")
        if isinstance(q_ans, str):
            try:
                q_ans = json.loads(q_ans)
            except Exception:
                q_ans = []
        
        cand_scenarios = []

        for q in (q_ans or []):
            q_id = str(q.get("question_id") or "")
            cat = str(q.get("category") or "")
            q_type = str(q.get("question_type") or "")
            is_scenario = (cat == "Real-World Scenarios" or q_type == "scenario" or "scenario" in q_id.lower())
            student_ans = str(q.get("student_answer") or "").strip()

            detail_rows.append({
                "Student Name": student_name,
                "Roll Number": roll_num,
                "Assigned Track": role,
                "Question ID": q_id,
                "Category": cat,
                "Topic": q.get("topic"),
                "Question Text": q.get("question"),
                "Candidate Selected / Written Answer": student_ans,
                "Correct Answer Key": q.get("correct_option"),
                "Is Correct?": "YES" if q.get("is_correct") else "NO",
                "Marks Awarded": q.get("marks_awarded", 0),
                "Explanation": q.get("explanation", "")
            })

            if is_scenario:
                word_count = len(student_ans.split()) if student_ans and student_ans != "(unattempted)" else 0
                scenario_rows.append({
                    "Student Name": student_name,
                    "Roll Number": roll_num,
                    "Assigned Track": role,
                    "Scenario ID": q_id,
                    "Topic": q.get("topic"),
                    "Scenario Question / Problem Statement": q.get("question"),
                    "Candidate Architecture Solution": student_ans,
                    "Word Count": word_count,
                    "Marks Awarded": q.get("marks_awarded", 0),
                    "Submitted At": str(r.get("submitted_at"))
                })
                cand_scenarios.append({
                    "id": q_id,
                    "topic": q.get("topic"),
                    "question": q.get("question"),
                    "answer": student_ans,
                    "word_count": word_count,
                    "marks": q.get("marks_awarded", 0)
                })

        # Save individual candidate submission file (TXT + JSON)
        cand_txt_path = os.path.join(techhash_cand_dir, f"{roll_num}_{safe_name}_Scenarios.txt")
        cand_json_path = os.path.join(techhash_cand_dir, f"{roll_num}_{safe_name}_Full_Submission.json")

        try:
            with open(cand_json_path, "w", encoding="utf-8") as jf:
                json.dump(r, jf, indent=2, ensure_ascii=False)
        except Exception:
            pass

        try:
            with open(cand_txt_path, "w", encoding="utf-8") as tf:
                tf.write("=" * 80 + "\n")
                tf.write(f"CANDIDATE ASSESSMENT REPORT & SCENARIO ARCHITECTURE SOLUTIONS\n")
                tf.write("=" * 80 + "\n\n")
                tf.write(f"Candidate Name  : {student_name}\n")
                tf.write(f"Roll Number     : {roll_num}\n")
                tf.write(f"Role / Track    : {role}\n")
                tf.write(f"Department      : {r.get('branch', 'CSE')}\n")
                tf.write(f"Total Score     : {r.get('total_marks')} / {r.get('max_marks')} ({r.get('percentage')}%)\n")
                tf.write(f"Status          : {r.get('status')}\n")
                tf.write(f"Violations      : {r.get('violations_count', 0)}\n")
                tf.write(f"Submitted At    : {r.get('submitted_at')}\n\n")

                if cand_scenarios:
                    tf.write("=" * 80 + "\n")
                    tf.write("REAL-WORLD SCENARIO RESPONSES (WRITTEN ARCHITECTURE PROPOSALS)\n")
                    tf.write("=" * 80 + "\n\n")
                    for i, sc in enumerate(cand_scenarios, 1):
                        tf.write(f"--- [SCENARIO {i}: {sc.get('topic') or sc.get('id')}] ---\n\n")
                        tf.write("PROBLEM STATEMENT:\n")
                        tf.write(f"{sc.get('question')}\n\n")
                        tf.write(f"CANDIDATE'S WRITTEN ARCHITECTURE SOLUTION (Word Count: {sc.get('word_count')} words):\n")
                        tf.write("-" * 60 + "\n")
                        tf.write(f"{sc.get('answer')}\n")
                        tf.write("-" * 60 + "\n\n")
                else:
                    tf.write("No descriptive scenario questions assigned for this track.\n\n")

                tf.write("=" * 80 + "\n")
                tf.write("FULL QUESTION-BY-QUESTION BREAKDOWN\n")
                tf.write("=" * 80 + "\n\n")
                for idx, qa in enumerate(q_ans or [], 1):
                    tf.write(f"Q{idx}. [{qa.get('category', '')}] {qa.get('question', '')}\n")
                    tf.write(f"   Selected Answer : {qa.get('student_answer', '')}\n")
                    tf.write(f"   Correct Answer  : {qa.get('correct_option', 'N/A')}\n")
                    tf.write(f"   Marks Awarded   : {qa.get('marks_awarded', 0)}\n")
                    tf.write(f"   Result          : {'CORRECT' if qa.get('is_correct') else 'INCORRECT'}\n\n")
        except Exception as _fe:
            print(f"[TXT WRITE WARNING] {_fe}")

    df_details = pd.DataFrame(detail_rows)
    df_scenarios = pd.DataFrame(scenario_rows)

    backend_dir = os.path.dirname(os.path.abspath(__file__))
    latest_path = os.path.join(backend_dir, "Fixly_Assessment_Results_LATEST.xlsx")
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    timestamp_path = os.path.join(backend_dir, f"Fixly_Assessment_Results_{timestamp}.xlsx")

    # Destination in 01_TechHash_Internship_Tests
    techhash_root = os.path.abspath(os.path.join(backend_dir, "../../01_TechHash_Internship_Tests"))
    techhash_latest = os.path.join(techhash_root, "Fixly_Assessment_Results_LATEST.xlsx")

    targets = [latest_path, timestamp_path, techhash_latest]
    for target_path in targets:
        try:
            with pd.ExcelWriter(target_path, engine="openpyxl") as writer:
                df_summary.to_excel(writer, sheet_name="Candidate_Scores", index=False)
                if not df_scenarios.empty:
                    df_scenarios.to_excel(writer, sheet_name="Scenario_Submissions", index=False)
                if not df_details.empty:
                    df_details.to_excel(writer, sheet_name="Question_Breakdown", index=False)
        except Exception as _we:
            print(f"[EXCEL WRITE WARNING] {target_path}: {_we}")

    print(f"[SUCCESS] Exported Excel reports to:\n  -> {latest_path}\n  -> {techhash_latest}")
    return latest_path

if __name__ == "__main__":
    export_to_excel()

