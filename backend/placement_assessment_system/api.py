# placement_assessment_system/api.py
# ============================================================
# HIGH-SCALE & PRODUCTION-GRADE PLACEMENT ASSESSMENT ENGINE
# ============================================================

import os
import json
import random
import re
import csv
import io
import time as _time
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel, Field
from typing import Dict, List, Optional
import psycopg2
from psycopg2.extras import RealDictCursor, Json, execute_values
from decimal import Decimal

def _make_json_serializable(obj):
    """Recursively convert Decimal objects to float/int for psycopg2 Json and json.dumps compatibility."""
    if isinstance(obj, Decimal):
        return float(obj) if obj % 1 != 0 else int(obj)
    elif isinstance(obj, dict):
        return {k: _make_json_serializable(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [_make_json_serializable(v) for v in obj]
    elif isinstance(obj, tuple):
        return tuple(_make_json_serializable(v) for v in obj)
    return obj


from psycopg2.pool import ThreadedConnectionPool
from auth import verify_api_key as require_api_key

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

router = APIRouter(prefix="/api/assessment", dependencies=[Depends(require_api_key)])

DB_URL = os.environ.get("DATABASE_URL")
if not DB_URL:
    print("[WARNING] DATABASE_URL environment variable is not set. Database operations will fail.")

# [FIX B-6] Connection pool instead of per-request connections
_db_pool = None

def _get_pool():
    global _db_pool
    if not DB_URL:
        raise RuntimeError("DATABASE_URL environment variable is not set. Please configure it in your environment.")
    if _db_pool is None or _db_pool.closed:
        from config import DB_POOL_MIN_CONNS, DB_POOL_MAX_CONNS
        _db_pool = ThreadedConnectionPool(
            minconn=DB_POOL_MIN_CONNS,
            maxconn=DB_POOL_MAX_CONNS,
            dsn=DB_URL
        )
        # NOTE: schema migrations should run out-of-band (startup job or CI)
        # to avoid DDL in request-time code paths. If you need to ensure
        # specific columns exist in development, run `ensure_schema()`
        # manually during startup.
    return _db_pool


def ensure_schema():
    """
    Helper to perform minimal safe schema changes. This should be invoked
    only from maintenance scripts or during controlled startup, NOT from
    within request handlers.
    """
    pool = _get_pool()
    conn = pool.getconn()
    try:
        cur = conn.cursor()
        cur.execute("ALTER TABLE attempts ADD COLUMN IF NOT EXISTS questions JSONB;")
        cur.execute("ALTER TABLE questions ADD COLUMN IF NOT EXISTS hint TEXT;")
        conn.commit()
        cur.close()
    except Exception as e:
        conn.rollback()
        print(f"[MIGRATION ERROR] ensure_schema failed: {e}")
    finally:
        pool.putconn(conn)

def get_db_cursor():
    pool = _get_pool()
    conn = pool.getconn()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    try:
        yield cur
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cur.close()
        pool.putconn(conn)


# Request schemas
class StartAttemptRequest(BaseModel):
    user_id: Optional[str] = Field(None, max_length=100)
    roll_number: Optional[str] = Field(None, max_length=50)
    student_name: Optional[str] = Field(default="Student", max_length=100)
    branch: Optional[str] = Field(default="CSE", max_length=50)
    year: Optional[str] = Field(default="4th Year", max_length=20)
    browser_info: Dict = Field(default_factory=dict)

class ResetAttemptsRequest(BaseModel):
    user_id: str = Field(..., max_length=100)

class ResumeAttemptRequest(BaseModel):
    user_id: str = Field(..., max_length=100)

class LogViolationRequest(BaseModel):
    attempt_id: str = Field(..., max_length=100)
    violation_type: str = Field(..., max_length=50)
    details: str = Field(..., max_length=1000)

class AutoSaveRequest(BaseModel):
    attempt_id: str = Field(..., max_length=100)
    answers: Dict = Field(default_factory=dict)
    coding_submissions: Dict = Field(default_factory=dict)

class SubmitAttemptRequest(BaseModel):
    attempt_id: str = Field(..., max_length=100)
    answers: Dict = Field(default_factory=dict)
    coding_submissions: Dict = Field(default_factory=dict)

SubmitTestRequest = SubmitAttemptRequest



@router.post("/reset")
def reset_attempts(req: ResetAttemptsRequest, db=Depends(get_db_cursor)):
    db.execute(
        "DELETE FROM test_sessions WHERE student_roll_number = %s OR student_roll_number = %s",
        (req.user_id, req.user_id)
    )
    db.execute(
        "DELETE FROM attempts WHERE user_id = %s OR roll_number = %s",
        (req.user_id, req.user_id)
    )
    return {"status": "success", "message": "Test session reset successfully."}


@router.post("/start")
def start_attempt(req: StartAttemptRequest, db=Depends(get_db_cursor)):
    raw_roll = req.roll_number or req.user_id or ""
    clean_roll = raw_roll.strip().upper()
    
    if not clean_roll:
        raise HTTPException(
            status_code=400,
            detail="Roll number is required. Please enter a valid roll number."
        )

    if not re.match(r'^[A-Z0-9]{8,12}$', clean_roll):
        raise HTTPException(
            status_code=400,
            detail="Invalid Roll Number format. Expected format e.g.: 23E51A0561, 24E51A66E1"
        )

    # Check for active 'started' session in test_sessions
    db.execute(
        """
        SELECT session_id, start_time, questions, answers, coding_submissions, student_name, branch, year
        FROM test_sessions
        WHERE student_roll_number = %s AND status = 'started'
        """,
        (clean_roll,)
    )
    active_session = db.fetchone()
    if active_session:
        start_t = active_session.get("start_time")
        if start_t:
            if start_t.tzinfo is None:
                start_t = start_t.replace(tzinfo=timezone.utc)
            elapsed = datetime.now(timezone.utc) - start_t
        else:
            elapsed = timedelta(seconds=0)
        remaining = 7200 - int(elapsed.total_seconds())
        if remaining > 0:
            saved_questions = _make_json_serializable(active_session.get("questions") or [])
            sanitized_qs = _sanitize_questions_for_candidate(saved_questions)
            return {
                "attempt_id": str(active_session["session_id"]),
                "session_id": str(active_session["session_id"]),
                "duration": remaining,
                "questions": sanitized_qs,
                "roll_number": clean_roll,
                "student_name": active_session.get("student_name", req.student_name),
                "branch": active_session.get("branch", req.branch),
                "saved_answers": active_session.get("answers") or {},
                "saved_coding_submissions": active_session.get("coding_submissions") or {}
            }

    # Sample questions (20 Aptitude, 20 Verbal, 20 CS Fundamentals, 2 Coding)
    pool = reload_questions_cache(db)


    used_ids = set()
    aptitude_raw = _sample_questions_by_difficulty(pool, 'Aptitude', 20, easy_ratio=0.65, exclude_ids=used_ids)
    verbal_raw = _sample_questions_by_difficulty(pool, 'Verbal', 20, easy_ratio=0.65, exclude_ids=used_ids)
    comp_raw = _sample_questions_by_difficulty(pool, 'Computer_Fundamentals', 20, easy_ratio=0.65, exclude_ids=used_ids)
    
    coding_pool = [q for q in pool if q.get("category") == "Coding" and q.get("id") not in used_ids]
    easy_coding = [q for q in coding_pool if str(q.get("difficulty", "")).lower() == "easy"]
    medium_coding = [q for q in coding_pool if str(q.get("difficulty", "")).lower() in ("medium", "hard")]

    selected_easy_coding = random.sample(easy_coding, 1) if easy_coding else []
    selected_med_coding = random.sample(medium_coding, 1) if medium_coding else []

    coding_selected = selected_easy_coding + selected_med_coding
    if len(coding_selected) < 2 and coding_pool:
        remaining_needed = 2 - len(coding_selected)
        avail = [q for q in coding_pool if q.get("id") not in {cq.get("id") for cq in coding_selected}]
        if avail:
            coding_selected.extend(random.sample(avail, min(len(avail), remaining_needed)))
    
    raw_questions = aptitude_raw + verbal_raw + comp_raw + coding_selected
    candidate_questions = [_prepare_candidate_question(q) for q in raw_questions]
    serializable_candidate_qs = _make_json_serializable(candidate_questions)

    # Create new test session record
    db.execute(
        """
        INSERT INTO test_sessions (
            test_id, student_roll_number, student_name, branch, year,
            status, total_questions, unanswered, browser, questions
        )
        VALUES ('placement_assessment_v1', %s, %s, %s, %s, 'started', %s, %s, %s, %s)
        RETURNING session_id, start_time;
        """,
        (
            clean_roll,
            (req.student_name or "Student")[:100],
            (req.branch or "CSE")[:50],
            (req.year or "4th Year")[:20],
            len(serializable_candidate_qs),
            len(serializable_candidate_qs),
            str(req.browser_info.get("user_agent", "Web Browser"))[:500],
            Json(serializable_candidate_qs)
        )

    )
    new_sess = db.fetchone()

    # Dual-write to attempts for legacy API compatibility
    try:
        db.execute(
            """
            INSERT INTO attempts (id, user_id, roll_number, status, browser_info, global_timer_remaining, questions)
            VALUES (%s, %s, %s, 'started', %s, 7200, %s)
            ON CONFLICT (id) DO UPDATE SET status = 'started', questions = EXCLUDED.questions;
            """,
            (
                str(new_sess["session_id"]),
                clean_roll,
                clean_roll,
                Json(_make_json_serializable(req.browser_info)),
                Json(serializable_candidate_qs)
            )
        )
    except Exception as e:
        print(f"[LEGACY DUAL-WRITE WARNING] Skipping legacy attempts insert: {e}")

    sanitized_qs = _sanitize_questions_for_candidate(serializable_candidate_qs)

    return {
        "attempt_id": str(new_sess["session_id"]),
        "session_id": str(new_sess["session_id"]),
        "duration": 7200,
        "questions": sanitized_qs,
        "roll_number": clean_roll,
        "student_name": req.student_name or "Student",
        "branch": req.branch or "CSE"
    }


@router.post("/resume")
def resume_attempt(req: ResumeAttemptRequest, db=Depends(get_db_cursor)):
    clean_roll = req.user_id.strip().upper()
    db.execute(
        "SELECT session_id, start_time, questions, answers, coding_submissions FROM test_sessions WHERE student_roll_number = %s AND status = 'started'",
        (clean_roll,)
    )
    active_session = db.fetchone()
    if not active_session:
        raise HTTPException(status_code=404, detail="No active assessment attempt found.")

    start_time = active_session["start_time"]
    if start_time.tzinfo is None:
        start_time = start_time.replace(tzinfo=timezone.utc)
    remaining = 7200 - int((datetime.now(timezone.utc) - start_time).total_seconds())
    if remaining <= 0:
        raise HTTPException(status_code=410, detail="Assessment attempt has expired.")

    saved_questions = active_session.get("questions") or []
    sanitized_qs = _sanitize_questions_for_candidate(saved_questions)

    return {
        "attempt_id": str(active_session["session_id"]),
        "session_id": str(active_session["session_id"]),
        "duration": remaining,
        "questions": sanitized_qs,
        "saved_answers": active_session.get("answers") or {},
        "saved_coding_submissions": active_session.get("coding_submissions") or {}
    }


@router.post("/autosave")
def autosave_attempt(req: AutoSaveRequest, db=Depends(get_db_cursor)):
    attempt_id = req.attempt_id
    answers = req.answers or {}
    coding_subs = req.coding_submissions or {}
    attempted_count = len(answers) + len(coding_subs)

    db.execute(
        """
        UPDATE test_sessions
        SET answers = %s,
            coding_submissions = %s,
            attempted = %s
        WHERE session_id::text = %s AND status = 'started';
        """,
        (Json(answers), Json(coding_subs), attempted_count, attempt_id)
    )
    db.execute(
        """
        UPDATE attempts
        SET answers = %s,
            coding_submissions = %s
        WHERE id::text = %s AND status = 'started';
        """,
        (Json(answers), Json(coding_subs), attempt_id)
    )
    return {"status": "success", "message": "Draft answers auto-saved successfully."}


@router.post("/log-violation")
def log_violation(req: LogViolationRequest, db=Depends(get_db_cursor)):
    attempt_id = req.attempt_id
    v_type = req.violation_type
    details = req.details

    event_item = {
        "type": v_type,
        "details": details,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

    # Fetch current session
    db.execute(
        "SELECT session_id, tab_switch_count, fullscreen_exit_count, copy_attempts, suspicious_events FROM test_sessions WHERE session_id::text = %s",
        (attempt_id,)
    )
    sess = db.fetchone()
    if not sess:
        # Fallback to attempts
        db.execute("SELECT id, violation_count FROM attempts WHERE id::text = %s", (attempt_id,))
        att = db.fetchone()
        if not att:
            raise HTTPException(status_code=404, detail="Attempt not found")
        db.execute("INSERT INTO violations (attempt_id, type, details) VALUES (%s, %s, %s)", (attempt_id, v_type, details))
        db.execute("UPDATE attempts SET violation_count = violation_count + 1 WHERE id::text = %s RETURNING violation_count", (attempt_id,))
        res = db.fetchone()
        disq = res["violation_count"] >= 3
        if disq:
            db.execute("UPDATE attempts SET status = 'disqualified', end_time = CURRENT_TIMESTAMP WHERE id::text = %s", (attempt_id,))
        return {"violation_count": res["violation_count"], "suspicion_score": res["violation_count"] * 25.0, "auto_submit": disq}

    events = sess.get("suspicious_events") or []
    if not isinstance(events, list):
        events = []
    events.append(event_item)

    tab_count = sess.get("tab_switch_count", 0) + (1 if "tab" in v_type.lower() or "blur" in v_type.lower() else 0)
    fs_count = sess.get("fullscreen_exit_count", 0) + (1 if "fullscreen" in v_type.lower() else 0)
    copy_count = sess.get("copy_attempts", 0) + (1 if "copy" in v_type.lower() or "paste" in v_type.lower() else 0)

    suspicion_score = _calculate_suspicion_score(events, len(events))
    should_disqualify = suspicion_score >= 80.0 or len(events) >= 5

    status_update = "disqualified" if should_disqualify else "started"

    db.execute(
        """
        UPDATE test_sessions
        SET tab_switch_count = %s,
            fullscreen_exit_count = %s,
            copy_attempts = %s,
            suspicious_events = %s,
            suspicion_score = %s,
            status = CASE WHEN status = 'started' AND %s = 'disqualified' THEN 'disqualified' ELSE status END
        WHERE session_id::text = %s;
        """,
        (tab_count, fs_count, copy_count, Json(events), suspicion_score, status_update, attempt_id)
    )

    db.execute("INSERT INTO violations (attempt_id, type, details) VALUES (%s, %s, %s)", (attempt_id, v_type, details))
    db.execute("UPDATE attempts SET violation_count = violation_count + 1 WHERE id::text = %s", (attempt_id,))

    return {
        "violation_count": len(events),
        "suspicion_score": suspicion_score,
        "auto_submit": should_disqualify
    }


@router.post("/submit")
def submit_test(req: SubmitTestRequest, db=Depends(get_db_cursor)):
    attempt_id = req.attempt_id

    # Row-level lock (FOR UPDATE)
    db.execute(
        "SELECT session_id, student_roll_number, status, start_time, questions FROM test_sessions WHERE session_id::text = %s FOR UPDATE;",
        (attempt_id,)
    )
    session = db.fetchone()
    
    # Fallback to attempts table if not found in test_sessions
    if not session:
        db.execute("SELECT id, user_id as student_roll_number, status, start_time, questions FROM attempts WHERE id::text = %s FOR UPDATE;", (attempt_id,))
        session = db.fetchone()
        if session:
            session["session_id"] = session["id"]

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if session["status"] == "completed":
        raise HTTPException(status_code=400, detail="Assessment has already been submitted.")

    final_status = "disqualified" if session.get("status") == "disqualified" else "completed"

    saved_questions = session.get("questions") or []
    report_questions = {q["id"]: q for q in saved_questions if isinstance(q, dict) and "id" in q}

    detailed_report = []
    section_breakdown = {
        "Aptitude": {"questions": 0, "attempted": 0, "correct": 0, "wrong": 0, "marks": 0.0},
        "Verbal": {"questions": 0, "attempted": 0, "correct": 0, "wrong": 0, "marks": 0.0},
        "Computer_Fundamentals": {"questions": 0, "attempted": 0, "correct": 0, "wrong": 0, "marks": 0.0},
        "Coding": {"questions": 0, "attempted": 0, "correct": 0, "wrong": 0, "marks": 0.0}
    }

    response_rows = []

    for q_id, q_meta in report_questions.items():
        sec = q_meta.get("category", "Aptitude")
        if sec not in section_breakdown:
            section_breakdown[sec] = {"questions": 0, "attempted": 0, "correct": 0, "wrong": 0, "marks": 0.0}
        section_breakdown[sec]["questions"] += 1

        is_coding = (sec == "Coding")
        user_ans = req.answers.get(q_id, "")
        sub_coding = req.coding_submissions.get(q_id, {})

        is_attempted = bool(user_ans or sub_coding.get("code"))
        if is_attempted:
            section_breakdown[sec]["attempted"] += 1

        is_correct = False
        marks_awarded = 0.0
        coding_meta = {}

        if is_coding:
            passed = sub_coding.get("passed_cases", 0)
            total = sub_coding.get("total_cases", 1)
            is_correct = (passed == total and total > 0)
            marks_awarded = float(q_meta.get("marks", 10)) if is_correct else 0.0
            
            try:
                sols = json.loads(q_meta["answer"]) if isinstance(q_meta.get("answer"), str) else (q_meta.get("answer") or {})
            except Exception:
                sols = {}

            coding_meta = {
                "user_code": sub_coding.get("code", ""),
                "optimal_code": sols.get("optimal_code", ""),
                "brute_code": sols.get("brute_code", ""),
                "time_complexity": sols.get("time_complexity", "O(N)"),
                "passed_cases": passed,
                "total_cases": total
            }
        else:
            correct_opt = q_meta.get("correct_option", "A")
            is_correct = (user_ans == correct_opt)
            if is_attempted:
                if is_correct:
                    marks_awarded = float(q_meta.get("marks", 1))
                else:
                    marks_awarded = 0.0

        if is_correct:
            section_breakdown[sec]["correct"] += 1
        elif is_attempted:
            section_breakdown[sec]["wrong"] += 1

        section_breakdown[sec]["marks"] += marks_awarded

        opts = q_meta.get("options") or []
        detailed_report.append({
            "id": q_id,
            "category": sec,
            "topic": q_meta.get("topic"),
            "difficulty": q_meta.get("difficulty"),
            "question": q_meta.get("question"),
            "options": opts,
            "correct_option": q_meta.get("correct_option") if not is_coding else None,
            "explanation": q_meta.get("explanation", ""),
            "user_answer": user_ans,
            "is_correct": is_correct,
            "marks_awarded": round(marks_awarded, 2),
            "coding_details": coding_meta if is_coding else None
        })

        response_rows.append((
            str(session["session_id"]),
            sec,
            q_id,
            q_meta.get("question"),
            opts[0] if len(opts) > 0 else None,
            opts[1] if len(opts) > 1 else None,
            opts[2] if len(opts) > 2 else None,
            opts[3] if len(opts) > 3 else None,
            user_ans,
            q_meta.get("correct_option"),
            is_correct,
            round(marks_awarded, 2),
            q_meta.get("difficulty", "Medium"),
            q_meta.get("topic", "General"),
            q_meta.get("explanation", "")
        ))

    score_total = sum(sec_data["marks"] for sec_data in section_breakdown.values())
    total_q_count = len(report_questions)
    total_attempted = sum(sec_data["attempted"] for sec_data in section_breakdown.values())
    total_correct = sum(sec_data["correct"] for sec_data in section_breakdown.values())
    total_wrong = sum(sec_data["wrong"] for sec_data in section_breakdown.values())
    unanswered_count = total_q_count - total_attempted
    max_marks = float(total_q_count)
    percentage = round((score_total / max_marks * 100.0), 2) if max_marks > 0 else 0.0

    # Save to test_sessions table
    db.execute(
        """
        UPDATE test_sessions
        SET status = %s,
            end_time = CURRENT_TIMESTAMP,
            answers = %s,
            coding_submissions = %s,
            attempted = %s,
            correct = %s,
            wrong = %s,
            unanswered = %s,
            total_marks = %s,
            percentage = %s
        WHERE session_id::text = %s;
        """,
        (
            final_status,
            Json(req.answers or {}),
            Json(req.coding_submissions or {}),
            total_attempted,
            total_correct,
            total_wrong,
            unanswered_count,
            round(score_total, 2),
            percentage,
            str(session["session_id"])
        )
    )

    # Save section_results (Table 3)
    for sec_name, sec_info in section_breakdown.items():
        if sec_info["questions"] > 0:
            sec_pct = round((sec_info["marks"] / float(sec_info["questions"])) * 100.0, 2)
            db.execute(
                """
                INSERT INTO section_results (session_id, section_name, questions, attempted, correct, wrong, unanswered, marks, percentage)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);
                """,
                (
                    str(session["session_id"]),
                    sec_name,
                    sec_info["questions"],
                    sec_info["attempted"],
                    sec_info["correct"],
                    sec_info["wrong"],
                    sec_info["questions"] - sec_info["attempted"],
                    round(sec_info["marks"], 2),
                    sec_pct
                )
            )

    # Save question_responses (Table 2)
    if response_rows:
        execute_values(
            db,
            """
            INSERT INTO question_responses (
                session_id, section, question_id, question_text,
                option_a, option_b, option_c, option_d,
                selected_option, correct_option, is_correct, marks_awarded,
                difficulty, topic, explanation
            )
            VALUES %s;
            """,
            response_rows
        )

    total_questions = len(detailed_report) if detailed_report else 62
    percentage = round((score_total / max(total_questions, 1)) * 100, 1)

    # 1. Placement Readiness Classification
    if percentage >= 85:
        readiness_level = "Excellent"
    elif percentage >= 70:
        readiness_level = "Placement Ready"
    elif percentage >= 50:
        readiness_level = "Nearly Ready"
    else:
        readiness_level = "Needs Improvement"

    # 2. Topic & Strengths / Weaknesses Analysis
    category_totals = {}
    category_corrects = {}
    for item in detailed_report:
        cat = item["category"]
        category_totals[cat] = category_totals.get(cat, 0) + 1
        if item["is_correct"]:
            category_corrects[cat] = category_corrects.get(cat, 0) + 1

    strengths = []
    weaknesses = []
    recommendations = []

    for cat, total in category_totals.items():
        correct = category_corrects.get(cat, 0)
        cat_pct = (correct / max(total, 1)) * 100
        cat_name = cat.replace("_", " ")
        if cat_pct >= 70:
            strengths.append(f"Strong accuracy in {cat_name} ({correct}/{total})")
        else:
            weaknesses.append(f"Needs improvement in {cat_name} ({correct}/{total})")

    if score_coding == 0:
        recommendations.append("Practice hands-on coding problems on Arrays, Strings, and Data Structures.")
    if score_aptitude < (category_totals.get("Aptitude", 20) * 0.6):
        recommendations.append("Focus on Quantitative Aptitude speed and logical reasoning questions.")
    if score_comp_fundamentals < (category_totals.get("Computer_Fundamentals", 20) * 0.6):
        recommendations.append("Review Operating Systems, DBMS, and Networking core fundamentals.")

    if not recommendations:
        recommendations.append("Maintain your strong pace by practicing advanced algorithm optimization.")

    # 3. Proctoring Integrity Summary
    proctoring_events = []
    violation_count = 0
    try:
        db.execute("SELECT type, details FROM violations WHERE attempt_id = %s", (req.attempt_id,))
        rows = db.fetchall()
        violation_count = len(rows)
        for r in rows:
            proctoring_events.append({"type": r["type"], "details": r["details"]})
    except Exception as e:
        print("[WARNING] Failed to fetch violation logs for report:", e)

    return {
        "status": "success",
        "score": {
            "aptitude": score_aptitude,
            "verbal": score_verbal,
            "comp_fundamentals": score_comp_fundamentals,
            "coding": score_coding,
            "total": score_total
        },
        "report": detailed_report
    }


# ------------------------------------------------------------
# ANALYTICS & ADMIN DASHBOARD ENDPOINTS
# ------------------------------------------------------------

@router.get("/analytics/{session_id}")
def get_session_analytics(session_id: str, db=Depends(get_db_cursor)):
    """[REQUIREMENT 16] Fetch comprehensive post-assessment analytics."""
    db.execute(
        """
        SELECT session_id, test_id, student_roll_number, student_name, branch, year,
               start_time, end_time, status, total_questions, attempted, correct, wrong, unanswered,
               total_marks, percentage, suspicion_score, suspicious_events
        FROM test_sessions
        WHERE session_id::text = %s;
        """,
        (session_id,)
    )
    session = db.fetchone()
    if not session:
        raise HTTPException(status_code=404, detail="Session analytics not found")

    db.execute(
        """
        SELECT section_name, questions, attempted, correct, wrong, unanswered, marks, percentage
        FROM section_results
        WHERE session_id::text = %s;
        """,
        (session_id,)
    )
    sections = db.fetchall()

    db.execute(
        """
        SELECT topic, is_correct, count(*) as count
        FROM question_responses
        WHERE session_id::text = %s
        GROUP BY topic, is_correct;
        """,
        (session_id,)
    )
    topic_stats = db.fetchall()

    strong_topics = list({t["topic"] for t in topic_stats if t["is_correct"]})
    weak_topics = list({t["topic"] for t in topic_stats if not t["is_correct"] and t["topic"] not in strong_topics})

    return {
        "session": session,
        "sections": sections,
        "strong_topics": strong_topics[:5],
        "weak_topics": weak_topics[:5],
        "accuracy": round((session["correct"] / float(session["attempted"]) * 100.0) if session["attempted"] > 0 else 0.0, 2),
        "recommendation": "Focus review on: " + (", ".join(weak_topics[:3]) if weak_topics else "Advanced Problem Solving")
    }


@router.get("/admin/sessions")
def get_admin_sessions(
    search: Optional[str] = None,
    status: Optional[str] = None,
    branch: Optional[str] = None,
    db=Depends(get_db_cursor)
):
    """[REQUIREMENT 17] Admin search & filter interface across test sessions."""
    query = """
        SELECT session_id, student_roll_number, student_name, branch, year,
               start_time, end_time, status, total_marks, percentage, suspicion_score
        FROM test_sessions
        WHERE 1=1
    """
    params = []

    if search:
        query += " AND (student_roll_number ILIKE %s OR student_name ILIKE %s)"
        params.extend([f"%{search}%", f"%{search}%"])
    if status:
        query += " AND status = %s"
        params.append(status)
    if branch:
        query += " AND branch = %s"
        params.append(branch)

    query += " ORDER BY start_time DESC LIMIT 100;"
    db.execute(query, tuple(params))
    rows = db.fetchall()
    return {"sessions": rows}


@router.get("/admin/session/{session_id}")
def get_admin_session_detail(session_id: str, db=Depends(get_db_cursor)):
    """[REQUIREMENT 17] Timeline audit replay & detailed response breakdown for proctors."""
    db.execute("SELECT * FROM test_sessions WHERE session_id::text = %s;", (session_id,))
    session = db.fetchone()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    db.execute("SELECT * FROM question_responses WHERE session_id::text = %s ORDER BY created_at ASC;", (session_id,))
    responses = db.fetchall()

    return {
        "session": session,
        "responses": responses,
        "suspicious_events": session.get("suspicious_events") or []
    }


@router.get("/admin/export")
def export_admin_sessions_csv(db=Depends(get_db_cursor)):
    """[REQUIREMENT 17] Export student assessment results to CSV."""
    db.execute(
        """
        SELECT student_roll_number, student_name, branch, year, status,
               total_marks, percentage, attempted, correct, wrong, suspicion_score, start_time
        FROM test_sessions
        ORDER BY start_time DESC;
        """
    )
    rows = db.fetchall()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Roll Number", "Student Name", "Branch", "Year", "Status",
        "Total Marks", "Percentage", "Attempted", "Correct", "Wrong", "Suspicion Score", "Start Time"
    ])
    for r in rows:
        writer.writerow([
            r["student_roll_number"], r["student_name"], r["branch"], r["year"], r["status"],
            r["total_marks"], r["percentage"], r["attempted"], r["correct"], r["wrong"], r["suspicion_score"], r["start_time"]
        ])

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=placement_assessment_results.csv"}
    )


class GetHintRequest(BaseModel):
    question_id: str

@router.post("/hint")
def get_coding_hint(req: GetHintRequest, db=Depends(get_db_cursor)):
    db.execute("SELECT question, hint FROM questions WHERE id = %s", (req.question_id,))
    row = db.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Question not found")
        
    if row.get("hint") and row["hint"].strip():
        return {"hint": row["hint"].strip()}
        
    return {"hint": "Identify the primary data structure or pattern (e.g. Hash Table, Two Pointers, Dynamic Programming)."}
