"""
Fixly Placement Assessment - Results Exporter Utility
Exports candidate test submissions from either Neon DB (PostgreSQL) or local SQLite (assessment_local.db)
to an Excel sheet (Fixly_Assessment_Results.xlsx).

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

DB_URL = os.environ.get("DATABASE_URL")
SQLITE_PATH = os.path.join(os.path.dirname(__file__), "placement_assessment_system/assessment_local.db")

def fetch_submissions():
    records = []
    source = "SQLite"

    # Try PostgreSQL first if available
    if DB_URL:
        try:
            import psycopg2
            from psycopg2.extras import RealDictCursor
            conn = psycopg2.connect(DB_URL)
            cur = conn.cursor(cursor_factory=RealDictCursor)
            cur.execute("SELECT * FROM fixly_test_submissions ORDER BY submitted_at DESC;")
            records = cur.fetchall() or []
            conn.close()
            source = "Neon PostgreSQL"
        except Exception as e:
            print(f"[NOTE] Neon DB connection failed ({e}). Checking local SQLite...")

    # Fallback to local SQLite
    if not records and os.path.exists(SQLITE_PATH):
        conn = sqlite3.connect(SQLITE_PATH)
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        try:
            cur.execute("SELECT * FROM fixly_test_submissions ORDER BY submitted_at DESC;")
            records = [dict(row) for row in cur.fetchall()]
            source = "Local SQLite (assessment_local.db)"
        except Exception as e:
            print(f"[NOTE] SQLite query: {e}")
        conn.close()

    return records, source

def export_to_excel():
    records, source = fetch_submissions()
    print(f"Fetched {len(records)} submissions from: {source}")

    if not records:
        print("No test submissions found yet in database.")
        return None

    # 1. Summary Sheet
    summary_rows = []
    for r in records:
        summary_rows.append({
            "Submission ID": r.get("id"),
            "Student Name": r.get("student_name"),
            "Roll Number": r.get("roll_number"),
            "Assigned Role": r.get("role"),
            "Branch": r.get("branch"),
            "Total Marks": r.get("total_marks"),
            "Max Marks": r.get("max_marks"),
            "Percentage (%)": r.get("percentage"),
            "Total Questions": r.get("total_questions"),
            "Attempted": r.get("attempted"),
            "Correct": r.get("correct_count"),
            "Wrong": r.get("wrong_count"),
            "Unanswered": r.get("unanswered_count"),
            "Violations Count": r.get("violations_count", 0),
            "Status": r.get("status"),
            "Submitted At": str(r.get("submitted_at"))
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
                "Role": r.get("role"),
                "Question ID": q.get("question_id"),
                "Topic": q.get("topic"),
                "Question Text": q.get("question"),
                "Student Answer": q.get("student_answer"),
                "Correct Option": q.get("correct_option"),
                "Is Correct": "YES" if q.get("is_correct") else "NO",
                "Marks Awarded": q.get("marks_awarded", 0),
                "Explanation": q.get("explanation", "")
            })

    df_details = pd.DataFrame(detail_rows)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    out_file = f"Fixly_Assessment_Results_{timestamp}.xlsx"
    out_path = os.path.join(os.path.dirname(__file__), out_file)

    with pd.ExcelWriter(out_path, engine="openpyxl") as writer:
        df_summary.to_excel(writer, sheet_name="Candidate_Scores", index=False)
        if not df_details.empty:
            df_details.to_excel(writer, sheet_name="Question_Breakdown", index=False)

    print(f"Successfully exported results to: {out_path}")
    return out_path

if __name__ == "__main__":
    export_to_excel()
