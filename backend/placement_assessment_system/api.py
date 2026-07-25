# placement_assessment_system/api.py
# ============================================================
# HIGH-SCALE & HIGH-RELIABILITY PLACEMENT ASSESSMENT ENGINE
# ============================================================
# Enhancements applied:
#   1. In-memory question caching (eliminates per-request ORDER BY RANDOM() queries)
#   2. 65% Easy / 35% Hard difficulty distribution sampling
#   3. Candidate option shuffling with automatic correct-option mapping stored in attempts
#   4. Connection pool increased to 100 max conns via config.py
#   5. SELECT ... FOR UPDATE row-level locking on submit to prevent double-submit race conditions
# ============================================================

import os
import json
import random
import re
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, List, Optional
import psycopg2
from psycopg2.extras import RealDictCursor, Json
from psycopg2.pool import ThreadedConnectionPool
from auth import verify_api_key as require_api_key

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

router = APIRouter(prefix="/api/assessment", dependencies=[Depends(require_api_key)])

DB_URL = os.environ.get("DATABASE_URL")
if not DB_URL:
    print("[WARNING] DATABASE_URL environment variable is not set. Database operations will fail.")

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
    return _db_pool


def ensure_schema():
    pool = _get_pool()
    conn = pool.getconn()
    try:
        cur = conn.cursor()
        cur.execute("ALTER TABLE attempts ADD COLUMN IF NOT EXISTS questions JSONB;")
        cur.execute("ALTER TABLE attempts ADD COLUMN IF NOT EXISTS roll_number CHARACTER VARYING(50);")
        cur.execute("ALTER TABLE questions ADD COLUMN IF NOT EXISTS hint TEXT;")
        cur.execute("""
            CREATE TABLE IF NOT EXISTS exam_submissions (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                attempt_id UUID,
                roll_number VARCHAR(50) NOT NULL,
                mcq_answers JSONB,
                coding_submissions JSONB,
                score_aptitude NUMERIC DEFAULT 0,
                score_verbal NUMERIC DEFAULT 0,
                score_comp_fundamentals NUMERIC DEFAULT 0,
                score_coding NUMERIC DEFAULT 0,
                overall_marks NUMERIC DEFAULT 0,
                malpractice_count INT DEFAULT 0,
                status VARCHAR(20) DEFAULT 'completed',
                submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        """)
        conn.commit()
        cur.close()
    except Exception as e:
        conn.rollback()
        print(f"[MIGRATION ERROR] ensure_schema failed: {e}")
    finally:
        pool.putconn(conn)

def get_db_cursor():
    pool = _get_pool()
    try:
        conn = pool.getconn()
    except Exception as err:
        raise HTTPException(
            status_code=503,
            detail="Database connection pool exhausted. Please retry in a few seconds."
        ) from err
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


# ------------------------------------------------------------
# IN-MEMORY QUESTION CACHE & DIFFICULTY SAMPLING ENGINE
# ------------------------------------------------------------
_IN_MEMORY_QUESTIONS = None

def _get_all_questions_cached(cur) -> List[Dict]:
    global _IN_MEMORY_QUESTIONS
    if _IN_MEMORY_QUESTIONS is None:
        cur.execute("SELECT id, question, options, correct_option, category, topic, difficulty, marks, examples, answer, explanation FROM questions")
        rows = cur.fetchall()
        _IN_MEMORY_QUESTIONS = [dict(r) for r in rows]
    return _IN_MEMORY_QUESTIONS

def reload_questions_cache(cur):
    global _IN_MEMORY_QUESTIONS
    cur.execute("SELECT id, question, options, correct_option, category, topic, difficulty, marks, examples, answer, explanation FROM questions")
    rows = cur.fetchall()
    _IN_MEMORY_QUESTIONS = [dict(r) for r in rows]
    return _IN_MEMORY_QUESTIONS

def _sample_questions_by_difficulty(questions_pool: List[Dict], category: str, count: int, easy_ratio: float = 0.65) -> List[Dict]:
    cat_qs = [q for q in questions_pool if q.get("category") == category]
    if not cat_qs:
        return []
    
    easy_qs = [q for q in cat_qs if str(q.get("difficulty", "")).lower() in ("easy", "beginner")]
    hard_qs = [q for q in cat_qs if q not in easy_qs]
    
    target_easy = int(round(count * easy_ratio))
    target_hard = count - target_easy
    
    selected_easy = []
    if easy_qs:
        if len(easy_qs) >= target_easy:
            selected_easy = random.sample(easy_qs, target_easy)
        else:
            selected_easy = list(easy_qs) + [random.choice(easy_qs) for _ in range(target_easy - len(easy_qs))]
            
    selected_hard = []
    if hard_qs:
        if len(hard_qs) >= target_hard:
            selected_hard = random.sample(hard_qs, target_hard)
        else:
            selected_hard = list(hard_qs) + [random.choice(hard_qs) for _ in range(target_hard - len(hard_qs))]
            
    result = selected_easy + selected_hard
    if len(result) < count:
        remaining_needed = count - len(result)
        available = [q for q in cat_qs if q not in result]
        if available and len(available) >= remaining_needed:
            result.extend(random.sample(available, remaining_needed))
        elif cat_qs:
            result.extend([random.choice(cat_qs) for _ in range(remaining_needed)])
            
    random.shuffle(result)
    return result[:count]

def _prepare_candidate_question(q_raw: Dict) -> Dict:
    q = dict(q_raw)
    if q.get("question"):
        q["question"] = re.sub(r'\s*Placement variant\s+[A-Z\-_]+-\d+\.?', '', q["question"], flags=re.IGNORECASE).strip()
    
    if q.get("options") and isinstance(q["options"], list) and len(q["options"]) > 0:
        orig_opts = list(q["options"])
        correct_letter = str(q.get("correct_option", "A")).strip()
        correct_idx = ord(correct_letter.upper()) - ord('A') if correct_letter and len(correct_letter) == 1 and 'A' <= correct_letter.upper() <= 'Z' else 0
        correct_text = orig_opts[correct_idx] if 0 <= correct_idx < len(orig_opts) else orig_opts[0]
        
        shuffled_opts = list(orig_opts)
        random.shuffle(shuffled_opts)
        q["options"] = shuffled_opts
        
        try:
            new_correct_idx = shuffled_opts.index(correct_text)
            q["correct_option"] = chr(ord('A') + new_correct_idx)
        except ValueError:
            q["correct_option"] = "A"
            
    return q


class StartAttemptRequest(BaseModel):
    user_id: Optional[str] = Field(None, max_length=100)
    roll_number: Optional[str] = Field(None, max_length=50)
    browser_info: Dict = Field(default_factory=dict)

class ResetAttemptsRequest(BaseModel):
    user_id: str = Field(..., max_length=100)

class ResumeAttemptRequest(BaseModel):
    user_id: str = Field(..., max_length=100)

class LogViolationRequest(BaseModel):
    attempt_id: str = Field(..., max_length=100)
    violation_type: str = Field(..., max_length=50)
    details: str = Field(..., max_length=1000)

class SubmitTestRequest(BaseModel):
    attempt_id: str = Field(..., max_length=100)
    answers: Dict = Field(default_factory=dict)
    coding_submissions: Dict = Field(default_factory=dict)


@router.post("/reset")
def reset_attempts(req: ResetAttemptsRequest, db=Depends(get_db_cursor)):
    db.execute(
        "DELETE FROM attempts WHERE user_id = %s OR roll_number = %s",
        (req.user_id, req.user_id)
    )
    return {"status": "success", "message": "Attempts reset successfully."}


@router.post("/start")
def start_attempt(req: StartAttemptRequest, db=Depends(get_db_cursor)):
    raw_roll = req.roll_number or req.user_id or ""
    clean_roll = raw_roll.strip().upper()
    
    if not clean_roll:
        raise HTTPException(
            status_code=400,
            detail="Roll number is required. Please enter a valid roll number."
        )

    # Roll number format validation: e.g. 23E51A0561 (case-insensitive)
    if not re.match(r'^[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{4}$', clean_roll):
        raise HTTPException(
            status_code=400,
            detail="Invalid Roll Number format. Expected format: 23E51A0561"
        )

    # Check if there is an active 'started' attempt for this roll number
    db.execute(
        "SELECT id, start_time, global_timer_remaining, questions FROM attempts WHERE (user_id = %s OR roll_number = %s) AND status = 'started'",
        (clean_roll, clean_roll)
    )
    active_attempt = db.fetchone()
    if active_attempt:
        elapsed = datetime.now(timezone.utc) - active_attempt["start_time"]
        remaining = 7200 - int(elapsed.total_seconds())
        if remaining > 0:
            saved_questions = active_attempt.get("questions")
            if saved_questions and isinstance(saved_questions, list) and len(saved_questions) >= 60:
                return {
                    "attempt_id": active_attempt["id"],
                    "duration": remaining,
                    "questions": saved_questions,
                    "roll_number": clean_roll
                }

    # In-memory question sampling (65% Easy / 35% Hard)
    pool = _get_all_questions_cached(db)
    if not pool:
        pool = reload_questions_cache(db)

    aptitude_raw = _sample_questions_by_difficulty(pool, 'Aptitude', 20, easy_ratio=0.65)
    verbal_raw = _sample_questions_by_difficulty(pool, 'Verbal', 20, easy_ratio=0.65)
    comp_raw = _sample_questions_by_difficulty(pool, 'Computer_Fundamentals', 20, easy_ratio=0.65)
    
    coding_pool = [q for q in pool if q.get("category") == "Coding"]
    if len(coding_pool) >= 2:
        coding_selected = random.sample(coding_pool, 2)
    else:
        coding_selected = coding_pool * 2 if coding_pool else []
        
    coding_easy = [coding_selected[0]] if len(coding_selected) > 0 else []
    coding_med = [coding_selected[1]] if len(coding_selected) > 1 else []
    
    raw_questions = aptitude_raw + verbal_raw + comp_raw + coding_easy + coding_med
    candidate_questions = [_prepare_candidate_question(q) for q in raw_questions]

    db.execute(
        """
        INSERT INTO attempts (user_id, roll_number, status, browser_info, global_timer_remaining, questions)
        VALUES (%s, %s, 'started', %s, 7200, %s)
        RETURNING id;
        """,
        (clean_roll, clean_roll, Json(req.browser_info), Json(candidate_questions))
    )
    attempt = db.fetchone()

    return {
        "attempt_id": attempt["id"],
        "duration": 7200,
        "questions": candidate_questions,
        "roll_number": clean_roll
    }


@router.post("/resume")
def resume_attempt(req: ResumeAttemptRequest, db=Depends(get_db_cursor)):
    db.execute(
        "SELECT id, start_time, global_timer_remaining, questions FROM attempts WHERE user_id = %s AND status = 'started'",
        (req.user_id,)
    )
    active_attempt = db.fetchone()
    if not active_attempt:
        raise HTTPException(status_code=404, detail="No active assessment attempt found.")

    start_time = active_attempt["start_time"]
    if start_time.tzinfo is None:
        start_time = start_time.replace(tzinfo=timezone.utc)
    remaining = 7200 - int((datetime.now(timezone.utc) - start_time).total_seconds())
    if remaining <= 0:
        raise HTTPException(status_code=410, detail="Assessment attempt has expired.")

    saved_questions = active_attempt.get("questions")
    if saved_questions and isinstance(saved_questions, list):
        return {
            "attempt_id": active_attempt["id"],
            "duration": remaining,
            "questions": saved_questions
        }
    
    raise HTTPException(status_code=404, detail="Saved questions corrupted or not found.")


@router.post("/log-violation")
def log_violation(req: LogViolationRequest, db=Depends(get_db_cursor)):
    db.execute(
        """
        INSERT INTO violations (attempt_id, type, details)
        VALUES (%s, %s, %s);
        """,
        (req.attempt_id, req.violation_type, req.details)
    )
    db.execute(
        """
        UPDATE attempts 
        SET violation_count = violation_count + 1 
        WHERE id = %s
        RETURNING violation_count;
        """,
        (req.attempt_id,)
    )
    res = db.fetchone()
    if not res:
        raise HTTPException(status_code=404, detail="Attempt not found")
        
    should_disqualify = res["violation_count"] >= 3
    if should_disqualify:
        db.execute(
            "UPDATE attempts SET status = 'disqualified', end_time = CURRENT_TIMESTAMP WHERE id = %s AND status = 'started'",
            (req.attempt_id,)
        )
    
    return {"violation_count": res["violation_count"], "auto_submit": should_disqualify}


@router.post("/submit")
def submit_test(req: SubmitTestRequest, db=Depends(get_db_cursor)):
    # Row-level lock (FOR UPDATE) to prevent double submission race conditions
    db.execute(
        "SELECT status, start_time, questions FROM attempts WHERE id = %s FOR UPDATE;",
        (req.attempt_id,)
    )
    attempt = db.fetchone()
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
    
    if attempt["status"] == "completed":
        raise HTTPException(status_code=400, detail="Assessment has already been submitted.")

    final_status = "disqualified" if attempt.get("status") == "disqualified" else "completed"

    try:
        from config import ASSESSMENT_MAX_DURATION_SECONDS, ASSESSMENT_GRACE_PERIOD_SECONDS
    except ImportError:
        ASSESSMENT_MAX_DURATION_SECONDS = 7200
        ASSESSMENT_GRACE_PERIOD_SECONDS = 300

    if attempt["start_time"]:
        start = attempt["start_time"]
        if start.tzinfo is None:
            start = start.replace(tzinfo=timezone.utc)
        elapsed_seconds = (datetime.now(timezone.utc) - start).total_seconds()
        if elapsed_seconds > (ASSESSMENT_MAX_DURATION_SECONDS + ASSESSMENT_GRACE_PERIOD_SECONDS):
            db.execute(
                "UPDATE attempts SET status = 'disqualified', end_time = CURRENT_TIMESTAMP WHERE id = %s",
                (req.attempt_id,)
            )
            raise HTTPException(status_code=403, detail="Submission window closed. Test time limit exceeded.")

    # Retrieve candidate-specific questions from attempt record
    saved_questions = attempt.get("questions") or []
    if isinstance(saved_questions, list) and len(saved_questions) > 0:
        report_questions = {q["id"]: q for q in saved_questions if isinstance(q, dict) and "id" in q}
    else:
        pool = _get_all_questions_cached(db)
        report_questions = {q["id"]: q for q in pool}
    
    detailed_report = []
    for q_id, q_meta in report_questions.items():
        if q_id in req.answers or q_id in req.coding_submissions:
            user_ans = req.answers.get(q_id, "")
            is_coding = q_meta.get("category") == "Coding"
            
            is_correct = False
            coding_meta = {}
            if is_coding:
                sub = req.coding_submissions.get(q_id, {})
                passed = sub.get("passed_cases", 0)
                total = sub.get("total_cases", 1)
                is_correct = (passed == total and total > 0)
                
                try:
                    sols = json.loads(q_meta["answer"]) if q_meta.get("answer") else {}
                except:
                    sols = {}
                    
                user_lang = sub.get("language", "python").lower()
                lang_key = "cpp" if user_lang in ["cpp", "c++"] else ("java" if user_lang == "java" else ("javascript" if user_lang in ["js", "javascript"] else "python"))
                    
                lang_solutions = sols.get(lang_key)
                if not lang_solutions or not isinstance(lang_solutions, dict):
                    optimal_code = sols.get("optimal_code", "") or sols.get("python", {}).get("optimal_code", "")
                    brute_code = sols.get("brute_code", "") or sols.get("python", {}).get("brute_code", "")
                else:
                    optimal_code = lang_solutions.get("optimal_code", "")
                    brute_code = lang_solutions.get("brute_code", "")
                    
                coding_meta = {
                    "user_code": sub.get("code", ""),
                    "optimal_code": optimal_code,
                    "brute_code": brute_code,
                    "time_complexity": sols.get("time_complexity", "O(N)"),
                    "space_complexity": sols.get("space_complexity", "O(1)"),
                    "passed_cases": passed,
                    "total_cases": total
                }
            else:
                is_correct = (user_ans == q_meta.get("correct_option"))
            
            detailed_report.append({
                "id": q_id,
                "category": q_meta.get("category"),
                "topic": q_meta.get("topic"),
                "difficulty": q_meta.get("difficulty"),
                "question": q_meta.get("question"),
                "options": q_meta.get("options"),
                "correct_option": q_meta.get("correct_option") if not is_coding else None,
                "explanation": q_meta.get("explanation", ""),
                "user_answer": user_ans,
                "is_correct": is_correct,
                "coding_details": coding_meta if is_coding else None
            })

    score_aptitude = sum(1 for item in detailed_report if item["category"] == "Aptitude" and item["is_correct"])
    score_verbal = sum(1 for item in detailed_report if item["category"] == "Verbal" and item["is_correct"])
    score_comp_fundamentals = sum(1 for item in detailed_report if item["category"] == "Computer_Fundamentals" and item["is_correct"])
    score_coding = sum(1 for item in detailed_report if item["category"] == "Coding" and item["is_correct"])
    score_total = score_aptitude + score_verbal + score_comp_fundamentals + score_coding

    try:
        db.execute(
            """
            UPDATE attempts 
            SET status = %s, 
                end_time = CURRENT_TIMESTAMP,
                answers = %s,
                coding_submissions = %s,
                score_aptitude = %s,
                score_verbal = %s,
                score_coding = %s,
                score_total = %s
            WHERE id = %s
            RETURNING roll_number, user_id, violation_count;
            """,
            (
                final_status,
                Json(req.answers or {}),
                Json(req.coding_submissions or {}),
                score_aptitude,
                score_verbal,
                score_coding,
                score_total,
                req.attempt_id,
            ),
        )
        updated_attempt = db.fetchone()
        roll = (updated_attempt and (updated_attempt.get("roll_number") or updated_attempt.get("user_id"))) or "UNKNOWN"
        v_count = (updated_attempt and updated_attempt.get("violation_count")) or 0

        # Save to Neon DB exam_submissions table
        db.execute(
            """
            INSERT INTO exam_submissions (
                attempt_id, roll_number, mcq_answers, coding_submissions,
                score_aptitude, score_verbal, score_comp_fundamentals, score_coding,
                overall_marks, malpractice_count, status, submitted_at
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP);
            """,
            (
                req.attempt_id,
                roll,
                Json(req.answers or {}),
                Json(req.coding_submissions or {}),
                score_aptitude,
                score_verbal,
                score_comp_fundamentals,
                score_coding,
                score_total,
                v_count,
                final_status
            )
        )
    except Exception as e:
        print("[ERROR] Failed to save test scores to database:", e)

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
        
    return {"hint": "Think about the problem constraints and try to identify a matching pattern."}
