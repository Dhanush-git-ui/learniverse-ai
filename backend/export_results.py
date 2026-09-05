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

    # 2. Detailed Question Answers Sheet
    detail_rows = []
    for r in records:
        q_ans = r.get("question_answers")
        if isinstance(q_ans, str):
            try:
                q_ans = json.loads(q_ans)
            except Exception:
                q_ans = []
        
        for q in (q_ans or []):
            detail_rows.append({
                "Student Name": r.get("student_name"),
                "Roll Number": r.get("roll_number"),
                "Assigned Track": r.get("role"),
                "Question ID": q.get("question_id"),
                "Topic": q.get("topic"),
                "Question Text": q.get("question"),
                "Candidate Selected Answer": q.get("student_answer"),
                "Correct Answer Key": q.get("correct_option"),
                "Is Correct?": "YES" if q.get("is_correct") else "NO",
                "Marks Awarded": q.get("marks_awarded", 0),
                "Explanation": q.get("explanation", "")
            })

    df_details = pd.DataFrame(detail_rows)

    backend_dir = os.path.dirname(os.path.abspath(__file__))
    latest_path = os.path.join(backend_dir, "Fixly_Assessment_Results_LATEST.xlsx")
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    timestamp_path = os.path.join(backend_dir, f"Fixly_Assessment_Results_{timestamp}.xlsx")

    for target_path in [latest_path, timestamp_path]:
        with pd.ExcelWriter(target_path, engine="openpyxl") as writer:
            df_summary.to_excel(writer, sheet_name="Candidate_Scores", index=False)
            if not df_details.empty:
                df_details.to_excel(writer, sheet_name="Question_Breakdown", index=False)

    print(f"[SUCCESS] Exported Excel report to:\n  -> {latest_path}\n  -> {timestamp_path}")
    return latest_path

if __name__ == "__main__":
    export_to_excel()

