# placement_assessment_system/api.py
# ============================================================
# FIXED VERSION — Replace your existing api.py with this file
# ============================================================
# Fixes applied:
#   B-2: DB credentials moved to environment variable
#   B-3: API key authentication added
#   B-6: Connection pooling via ThreadedConnectionPool
#   B-8: Server-side timer enforcement + status check on submit
#   H-4: Attempt limit per user (max 3 completed attempts)
#   H-5: Prevents double submission (WHERE status = 'started')
# ============================================================

import os
import json
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, List, Optional
import psycopg2
from psycopg2.extras import RealDictCursor, Json
from psycopg2.pool import ThreadedConnectionPool
import random
from auth import verify_api_key as require_api_key

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

def translate_code(source_code: str, target_lang: str) -> str:
    if not source_code.strip():
        return ""
    import requests
    
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return source_code
        
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    lang_name = "C++" if target_lang in ["cpp", "c++"] else ("Java" if target_lang == "java" else ("JavaScript" if target_lang in ["js", "javascript"] else target_lang.title()))
    
    prompt = f"""You are an expert compiler assistant. Translate the following Python 3 code into clean, working {lang_name} code that reads from standard input and prints to standard output matching typical competitive programming constraints.

Python 3 Code:
{source_code}

Return ONLY the raw code. Do NOT wrap it in markdown code blocks, do not include any explanatory text, and do not include backticks. Just return the executable code block.
"""

    payload = {
        "model": "tencent/hy3:free",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.1
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=15)
        if response.status_code == 200:
            content = response.json()["choices"][0]["message"]["content"].strip()
            if content.startswith("```"):
                parts = content.split("```")
                if len(parts) >= 3:
                    raw = parts[1]
                    for tag in ["cpp", "java", "javascript", "js", "python", "py"]:
                        if raw.startswith(tag + "\n"):
                            raw = raw[len(tag)+1:]
                            break
                    content = raw.strip()
            return content
    except Exception as e:
        print("[ERROR] Code translation failed:", e)
        
    return source_code

router = APIRouter(prefix="/api/assessment", dependencies=[Depends(require_api_key)])

# [FIX B-2] Read DB URL from environment variable — no hardcoded secrets
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
    user_id: str = Field(..., max_length=100)
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
        "DELETE FROM attempts WHERE user_id = %s",
        (req.user_id,)
    )
    return {"status": "success", "message": "Attempts reset successfully."}


@router.post("/start")
def start_attempt(req: StartAttemptRequest, db=Depends(get_db_cursor)):
    # Check if there is an active 'started' attempt for this user
    db.execute(
        "SELECT id, start_time, global_timer_remaining, questions FROM attempts WHERE user_id = %s AND status = 'started'",
        (req.user_id,)
    )
    active_attempt = db.fetchone()
    if active_attempt:
        # Calculate remaining duration
        elapsed = datetime.now(timezone.utc) - active_attempt["start_time"]
        remaining = 7200 - int(elapsed.total_seconds())
        if remaining > 0:
            # Return same questions to resume
            saved_q_ids = active_attempt.get("questions")
            questions = []
            if saved_q_ids:
                db.execute(
                    "SELECT id, question, options, category, topic, difficulty, marks, examples FROM questions WHERE id = ANY(%s)",
                    (saved_q_ids,)
                )
                questions_raw = db.fetchall()
                q_dict = {q["id"]: q for q in questions_raw}
                questions = [q_dict[q_id] for q_id in saved_q_ids if q_id in q_dict]
            
            # Safe self-healing fallback: if questions list is empty or incomplete (due to database resets/reseeding)
            if not saved_q_ids or len(questions) < 62:
                db.execute("SELECT id, question, options, category, topic, difficulty, marks, examples FROM questions WHERE category = 'Aptitude' ORDER BY RANDOM() LIMIT 20")
                aptitude = db.fetchall()
                db.execute("SELECT id, question, options, category, topic, difficulty, marks, examples FROM questions WHERE category = 'Verbal' ORDER BY RANDOM() LIMIT 20")
                verbal = db.fetchall()
                db.execute("SELECT id, question, options, category, topic, difficulty, marks, examples FROM questions WHERE category = 'Computer_Fundamentals' ORDER BY RANDOM() LIMIT 20")
                comp_fundamentals = db.fetchall()
                db.execute("SELECT id, question, category, topic, difficulty, examples FROM questions WHERE category = 'Coding' AND difficulty = 'Easy' ORDER BY RANDOM() LIMIT 1")
                coding_easy = db.fetchall()
                db.execute("SELECT id, question, category, topic, difficulty, examples FROM questions WHERE category = 'Coding' AND difficulty = 'Medium' ORDER BY RANDOM() LIMIT 1")
                coding_med = db.fetchall()
                
                questions = aptitude + verbal + comp_fundamentals + coding_easy + coding_med
                question_ids = [q["id"] for q in questions]
                db.execute("UPDATE attempts SET questions = %s WHERE id = %s", (Json(question_ids), active_attempt["id"]))

            # Clean and shuffle options
            import re
            for q in questions:
                if q.get("question"):
                    q["question"] = re.sub(r'\s*Placement variant\s+[A-Z\-_]+-\d+\.?', '', q["question"], flags=re.IGNORECASE).strip()
            return {
                "attempt_id": active_attempt["id"],
                "duration": remaining,
                "questions": questions
            }

    # Otherwise check if user exceeded attempts
    db.execute(
        "SELECT COUNT(*) as attempt_count FROM attempts WHERE user_id = %s AND status IN ('completed', 'disqualified')",
        (req.user_id,)
    )
    count = db.fetchone()
    if count and count["attempt_count"] >= 3:
        raise HTTPException(
            status_code=429,
            detail="Maximum assessment attempts (3) reached for this user."
        )

    # 1. Fetch Randomized Questions (Aptitude, Verbal, Computer Fundamentals, Coding)
    db.execute("SELECT id, question, options, category, topic, difficulty, marks, examples FROM questions WHERE category = 'Aptitude' ORDER BY RANDOM() LIMIT 20")
    aptitude = db.fetchall()
    db.execute("SELECT id, question, options, category, topic, difficulty, marks, examples FROM questions WHERE category = 'Verbal' ORDER BY RANDOM() LIMIT 20")
    verbal = db.fetchall()
    db.execute("SELECT id, question, options, category, topic, difficulty, marks, examples FROM questions WHERE category = 'Computer_Fundamentals' ORDER BY RANDOM() LIMIT 20")
    comp_fundamentals = db.fetchall()
    db.execute("SELECT id, question, category, topic, difficulty, examples FROM questions WHERE category = 'Coding' AND difficulty = 'Easy' ORDER BY RANDOM() LIMIT 1")
    coding_easy = db.fetchall()
    db.execute("SELECT id, question, category, topic, difficulty, examples FROM questions WHERE category = 'Coding' AND difficulty = 'Medium' ORDER BY RANDOM() LIMIT 1")
    coding_med = db.fetchall()
    
    questions = aptitude + verbal + comp_fundamentals + coding_easy + coding_med
    question_ids = [q["id"] for q in questions]

    # 2. Create Assessment Attempt
    db.execute(
        """
        INSERT INTO attempts (user_id, status, browser_info, global_timer_remaining, questions)
        VALUES (%s, 'started', %s, 7200, %s)
        RETURNING id;
        """,
        (req.user_id, Json(req.browser_info), Json(question_ids))
    )
    attempt = db.fetchone()
    
    import re
    for q in questions:
        if q.get("question"):
            q["question"] = re.sub(r'\s*Placement variant\s+[A-Z\-_]+-\d+\.?', '', q["question"], flags=re.IGNORECASE).strip()
        if q.get("options"):
            opts = list(q["options"])
            random.shuffle(opts)
            q["options"] = opts

    return {
        "attempt_id": attempt["id"],
        "duration": 7200,
        "questions": questions
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

    saved_q_ids = active_attempt.get("questions")
    if saved_q_ids:
        db.execute(
            "SELECT id, question, options, category, topic, difficulty, marks, examples FROM questions WHERE id = ANY(%s)",
            (saved_q_ids,)
        )
        questions = db.fetchall()
        # Order the fetched questions to match stored order
        q_dict = {q["id"]: q for q in questions}
        questions = [q_dict[q_id] for q_id in saved_q_ids if q_id in q_dict]
    else:
        # Fallback for legacy attempts: select randomized questions
        db.execute("SELECT id, question, options, category, topic, difficulty, marks, examples FROM questions WHERE category = 'Aptitude' LIMIT 20")
        aptitude = db.fetchall()
        db.execute("SELECT id, question, options, category, topic, difficulty, marks, examples FROM questions WHERE category = 'Verbal' LIMIT 20")
        verbal = db.fetchall()
        db.execute("SELECT id, question, options, category, topic, difficulty, marks, examples FROM questions WHERE category = 'Computer_Fundamentals' LIMIT 20")
        comp_fundamentals = db.fetchall()
        db.execute("SELECT id, question, category, topic, difficulty, examples FROM questions WHERE category = 'Coding' AND difficulty = 'Easy' LIMIT 1")
        coding_easy = db.fetchall()
        db.execute("SELECT id, question, category, topic, difficulty, examples FROM questions WHERE category = 'Coding' AND difficulty = 'Medium' LIMIT 1")
        coding_med = db.fetchall()
        questions = aptitude + verbal + comp_fundamentals + coding_easy + coding_med
        # Backfill the legacy attempt
        question_ids = [q["id"] for q in questions]
        db.execute("UPDATE attempts SET questions = %s WHERE id = %s", (Json(question_ids), active_attempt["id"]))

    import re
    for q in questions:
        if q.get("question"):
            q["question"] = re.sub(r'\s*Placement variant\s+[A-Z\-_]+-\d+\.?', '', q["question"], flags=re.IGNORECASE).strip()

    return {
        "attempt_id": active_attempt["id"],
        "duration": remaining,
        "questions": questions
    }


@router.post("/log-violation")
def log_violation(req: LogViolationRequest, db=Depends(get_db_cursor)):
    # Log violation details
    db.execute(
        """
        INSERT INTO violations (attempt_id, type, details)
        VALUES (%s, %s, %s);
        """,
        (req.attempt_id, req.violation_type, req.details)
    )
    # Increment violation count in attempt
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
        
    # Auto-submit if violation count >= 3
    should_disqualify = res["violation_count"] >= 3
    
    # [FIX B-8] Server-side disqualification — mark attempt immediately
    if should_disqualify:
        db.execute(
            "UPDATE attempts SET status = 'disqualified', end_time = CURRENT_TIMESTAMP WHERE id = %s AND status = 'started'",
            (req.attempt_id,)
        )
    
    return {"violation_count": res["violation_count"], "auto_submit": should_disqualify}

@router.post("/submit")
def submit_test(req: SubmitTestRequest, db=Depends(get_db_cursor)):
    # [FIX B-8] Validate attempt exists, is not already submitted, and is within time
    db.execute(
        "SELECT status, start_time FROM attempts WHERE id = %s",
        (req.attempt_id,)
    )
    attempt = db.fetchone()
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
    
    # [FIX H-5] Prevent double submission
    if attempt["status"] in ("completed", "disqualified"):
        raise HTTPException(status_code=400, detail="Assessment has already been submitted.")

    # [FIX B-8] Server-side time limit enforcement (configured via config.py)
    try:
        from config import ASSESSMENT_MAX_DURATION_SECONDS, ASSESSMENT_GRACE_PERIOD_SECONDS
    except ImportError:
        ASSESSMENT_MAX_DURATION_SECONDS = 7200
        ASSESSMENT_GRACE_PERIOD_SECONDS = 300

    is_late = False
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
        if elapsed_seconds > ASSESSMENT_MAX_DURATION_SECONDS:
            is_late = True

    # Load all questions to grade answers
    db.execute(
        "SELECT id, question, category, topic, difficulty, options, correct_option, answer, explanation FROM questions"
    )
    report_questions = {q["id"]: q for q in db.fetchall()}
    
    detailed_report = []
    for q_id, q_meta in report_questions.items():
        # Check if question was in the test attempt (answers or coding_submissions)
        if q_id in req.answers or q_id in req.coding_submissions:
            user_ans = req.answers.get(q_id, "")
            is_coding = q_meta["category"] == "Coding"
            
            is_correct = False
            coding_meta = {}
            if is_coding:
                sub = req.coding_submissions.get(q_id, {})
                passed = sub.get("passed_cases", 0)
                total = sub.get("total_cases", 1)
                is_correct = (passed == total and total > 0)
                
                # Retrieve parsed solutions from database
                try:
                    sols = json.loads(q_meta["answer"]) if q_meta["answer"] else {}
                except:
                    sols = {}
                    
                user_lang = sub.get("language", "python").lower()
                if user_lang in ["py", "python"]:
                    lang_key = "python"
                elif user_lang in ["cpp", "c++"]:
                    lang_key = "cpp"
                elif user_lang in ["java"]:
                    lang_key = "java"
                elif user_lang in ["js", "javascript"]:
                    lang_key = "javascript"
                else:
                    lang_key = "python"
                    
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
                is_correct = (user_ans == q_meta["correct_option"])
            
            detailed_report.append({
                "id": q_id,
                "category": q_meta["category"],
                "topic": q_meta["topic"],
                "difficulty": q_meta["difficulty"],
                "question": q_meta["question"],
                "options": q_meta["options"],
                "correct_option": q_meta["correct_option"] if not is_coding else None,
                "explanation": q_meta["explanation"],
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
            SET status = 'completed', 
                end_time = CURRENT_TIMESTAMP,
                answers = %s,
                coding_submissions = %s,
                score_aptitude = %s,
                score_verbal = %s,
                score_coding = %s,
                score_total = %s
            WHERE id = %s;
            """,
            (
                Json(req.answers or {}),
                Json(req.coding_submissions or {}),
                score_aptitude,
                score_verbal,
                score_coding,
                score_total,
                req.attempt_id,
            ),
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

def generate_ai_hint(question_text: str) -> str:
    import requests
    
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("[WARNING] GEMINI_API_KEY is not set. Using fallback hint.")
        return "Think about the problem constraints and try to identify a matching pattern."
        
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    prompt = f"""You are an expert DSA Coach. Generate a helpful, conceptual hint for the following coding question.
Rules:
1. Do NOT directly give the algorithm, pseudocode, code, or the solution.
2. Guide the student's thinking. Suggest a pattern, a data structure, or a helpful approach.
3. The hint must be clear, sensible, and not reveal the final logic.
4. Keep the hint brief (2-3 sentences max).

Question:
{question_text}

Conceptual Hint:"""

    payload = {
        "model": "tencent/hy3:free",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.5
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=15)
        if response.status_code == 200:
            content = response.json()["choices"][0]["message"]["content"].strip()
            if content.startswith('"') and content.endswith('"'):
                content = content[1:-1]
            return content
        else:
            print(f"[ERROR] OpenRouter API responded with status {response.status_code}: {response.text}")
    except Exception as e:
        print("[ERROR] Hint generation failed:", e)
        
    return "Consider the edge cases and optimal time complexity."

@router.post("/hint")
def get_coding_hint(req: GetHintRequest):
    pool = _get_pool()
    conn = pool.getconn()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cur.execute("SELECT question, hint FROM questions WHERE id = %s", (req.question_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Question not found")
            
        if row.get("hint") and row["hint"].strip():
            return {"hint": row["hint"].strip()}
            
        hint_text = generate_ai_hint(row["question"])
        
        cur.execute("UPDATE questions SET hint = %s WHERE id = %s", (hint_text, req.question_id))
        conn.commit()
        
        return {"hint": hint_text}
    except Exception as e:
        conn.rollback()
        print(f"[ERROR] Failed to get hint: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve hint")
    finally:
        cur.close()
        pool.putconn(conn)

