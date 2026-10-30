"""
backend/analytics_service.py
Reusable fire-and-forget analytics write helper.
All functions are non-blocking: they swallow exceptions so a DB hiccup
never disrupts the learning flow.
"""
import logging
import uuid
from datetime import datetime, timezone
from typing import Optional

logger = logging.getLogger("learniverse.analytics")


# ──────────────────────────────────────────────────────────────────────────────
# Internal: get a connection from the shared pool in app.py
# ──────────────────────────────────────────────────────────────────────────────
def _conn():
    """Returns a raw psycopg2 connection from the app-level pool, or None."""
    try:
        from app import get_db_conn
        return get_db_conn()
    except Exception:
        return None


def _release(conn, close: bool = False):
    try:
        from app import release_db_conn
        release_db_conn(conn, close=close)
    except Exception:
        pass


# ──────────────────────────────────────────────────────────────────────────────
# 1. Upsert user row (called on every authenticated request)
# ──────────────────────────────────────────────────────────────────────────────
def upsert_user(user_id: str, roll_number: str, name: str = "",
                email: str = "", role: str = "student", branch: str = "", college: str = "HITAM Hyderabad"):
    conn = _conn()
    if not conn:
        return
    try:
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO users (id, roll_number, name, email, role, branch, college, last_seen_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())
            ON CONFLICT (id) DO UPDATE
                SET name         = EXCLUDED.name,
                    email        = EXCLUDED.email,
                    branch       = EXCLUDED.branch,
                    last_seen_at = NOW();
        """, (user_id, roll_number.upper(), name, email.lower(), role, branch, college))
        conn.commit()
        cur.close()
    except Exception as e:
        logger.debug("[ANALYTICS upsert_user] %s", e)
        try: conn.rollback()
        except Exception: pass
    finally:
        _release(conn)


# ──────────────────────────────────────────────────────────────────────────────
# 2. Log a topic view
# ──────────────────────────────────────────────────────────────────────────────
def log_topic_view(user_id: str, topic_slug: str, topic_name: str = "",
                   tab: str = "overview", duration_seconds: int = 0):
    conn = _conn()
    if not conn:
        return
    try:
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO topic_views (user_id, topic_slug, topic_name, tab, duration_seconds)
            VALUES (%s, %s, %s, %s, %s);
        """, (user_id, topic_slug, topic_name, tab, duration_seconds))
        conn.commit()
        cur.close()
    except Exception as e:
        logger.debug("[ANALYTICS log_topic_view] %s", e)
        try: conn.rollback()
        except Exception: pass
    finally:
        _release(conn)


# ──────────────────────────────────────────────────────────────────────────────
# 3. Log a chat message
# ──────────────────────────────────────────────────────────────────────────────
def log_chat_message(user_id: str, topic_slug: str, mode: str,
                     role: str, content: str):
    conn = _conn()
    if not conn:
        return
    try:
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO chat_messages (user_id, topic_slug, mode, role, content)
            VALUES (%s, %s, %s, %s, %s);
        """, (user_id, topic_slug, mode[:20], role[:20], content[:4000]))
        conn.commit()
        cur.close()
    except Exception as e:
        logger.debug("[ANALYTICS log_chat_message] %s", e)
        try: conn.rollback()
        except Exception: pass
    finally:
        _release(conn)


# ──────────────────────────────────────────────────────────────────────────────
# 4. Log an MCQ attempt
# ──────────────────────────────────────────────────────────────────────────────
def log_mcq_attempt(user_id: str, topic_slug: str, question_id: str,
                    selected_idx: int, correct_idx: int, is_correct: bool,
                    time_taken_s: int = 0, hint_used: bool = False,
                    selected_answer: str = "", correct_answer: str = "",
                    question_text: str = "", explanation: str = ""):
    conn = _conn()
    if not conn:
        return
    try:
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO mcq_attempts
                (user_id, topic_slug, question_id, selected_idx, correct_idx,
                 is_correct, time_taken_s, hint_used, selected_answer, correct_answer, question_text, explanation)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
        """, (user_id, topic_slug, question_id, selected_idx, correct_idx,
              is_correct, time_taken_s, hint_used,
              (selected_answer or "")[:2000], (correct_answer or "")[:2000],
              (question_text or "")[:4000], (explanation or "")[:4000]))
        conn.commit()
        cur.close()
    except Exception as e:
        logger.debug("[ANALYTICS log_mcq_attempt] %s", e)
        try: conn.rollback()
        except Exception: pass
    finally:
        _release(conn)


# ──────────────────────────────────────────────────────────────────────────────
# 5. Log a coding submission
# ──────────────────────────────────────────────────────────────────────────────
def log_coding_submission(user_id: str, problem_id: str, problem_title: str,
                          topic_slug: str, language: str, code: str,
                          action: str, verdict: str,
                          passed: int = 0, total: int = 0,
                          runtime_ms: int = 0, memory_kb: int = 0):
    conn = _conn()
    if not conn:
        return
    try:
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO coding_submissions
                (user_id, problem_id, problem_title, topic_slug, language, code,
                 action, verdict, passed, total, runtime_ms, memory_kb)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
        """, (user_id, problem_id, problem_title, topic_slug, language,
              code[:20000], action, verdict, passed, total, runtime_ms, memory_kb))
        conn.commit()
        cur.close()
    except Exception as e:
        logger.debug("[ANALYTICS log_coding_submission] %s", e)
        try: conn.rollback()
        except Exception: pass
    finally:
        _release(conn)


# ──────────────────────────────────────────────────────────────────────────────
# 6. Upsert Top 100 progress
# ──────────────────────────────────────────────────────────────────────────────
def upsert_top100_progress(user_id: str, problem_id: str, problem_title: str,
                           difficulty: str, status: str, best_verdict: str):
    conn = _conn()
    if not conn:
        return
    try:
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO top100_progress
                (user_id, problem_id, problem_title, difficulty, status, best_verdict, attempts, last_ts)
            VALUES (%s, %s, %s, %s, %s, %s, 1, NOW())
            ON CONFLICT (user_id, problem_id) DO UPDATE
                SET status       = CASE WHEN EXCLUDED.status = 'solved' THEN 'solved'
                                        WHEN top100_progress.status = 'solved' THEN 'solved'
                                        ELSE EXCLUDED.status END,
                    best_verdict = CASE WHEN EXCLUDED.best_verdict = 'accepted' THEN 'accepted'
                                        ELSE top100_progress.best_verdict END,
                    attempts     = top100_progress.attempts + 1,
                    last_ts      = NOW();
        """, (user_id, problem_id, problem_title, difficulty, status, best_verdict))
        conn.commit()
        cur.close()
    except Exception as e:
        logger.debug("[ANALYTICS upsert_top100_progress] %s", e)
        try: conn.rollback()
        except Exception: pass
    finally:
        _release(conn)


def get_top100_progress_for_user(user_id: str) -> dict:
    conn = _conn()
    if not conn:
        return {}
    try:
        from psycopg2.extras import RealDictCursor
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            SELECT problem_id, problem_title, difficulty, status, best_verdict, attempts, last_ts
            FROM top100_progress
            WHERE user_id = %s;
        """, (user_id,))
        rows = cur.fetchall()
        cur.close()
        return {str(r["problem_id"]): dict(r) for r in rows}
    except Exception as e:
        logger.warning("[ANALYTICS get_top100_progress_for_user] %s", e)
        return {}
    finally:
        _release(conn)


# ──────────────────────────────────────────────────────────────────────────────
# 7. Get dashboard summary for a single user
# ──────────────────────────────────────────────────────────────────────────────
def get_dashboard_summary(user_id: str) -> dict:
    conn = _conn()
    if not conn:
        return {}
    failed = False
    try:
        from psycopg2.extras import RealDictCursor
        cur = conn.cursor(cursor_factory=RealDictCursor)

        clean_uid = str(user_id or "").strip()
        # Resolve all associated user identities (Google sub id, roll number, email)
        cur.execute("""
            SELECT id, roll_number, email FROM users
            WHERE id = %s 
               OR UPPER(TRIM(roll_number)) = UPPER(TRIM(%s))
               OR LOWER(TRIM(email)) = LOWER(TRIM(%s))
            LIMIT 1;
        """, (clean_uid, clean_uid, clean_uid))
        u_row = cur.fetchone()

        user_ids = {clean_uid}
        roll_num = clean_uid.upper()
        if u_row:
            if u_row.get("id"):
                user_ids.add(str(u_row["id"]).strip())
            if u_row.get("roll_number"):
                user_ids.add(str(u_row["roll_number"]).strip())
                roll_num = str(u_row["roll_number"]).strip().upper()

        user_ids_list = list(user_ids)

        # Main aggregates from view
        cur.execute("""
            SELECT * FROM v_student_dashboard 
            WHERE user_id = ANY(%s) OR UPPER(TRIM(roll_number)) = %s
            LIMIT 1;
        """, (user_ids_list, roll_num))
        row = cur.fetchone()
        result = dict(row) if row else {}

        # Per-topic MCQ accuracy
        cur.execute("""
            SELECT topic_slug, accuracy_pct, questions_attempted, correct_count, last_attempted
            FROM v_mcq_topic_accuracy
            WHERE user_id = ANY(%s) OR UPPER(TRIM(user_id)) = %s
            ORDER BY last_attempted DESC
            LIMIT 10;
        """, (user_ids_list, roll_num))
        result["mcq_by_topic"] = [dict(r) for r in cur.fetchall()]

        # Weak topics (accuracy < 60%)
        cur.execute("""
            SELECT topic_slug, accuracy_pct
            FROM v_mcq_topic_accuracy
            WHERE (user_id = ANY(%s) OR UPPER(TRIM(user_id)) = %s) AND questions_attempted >= 3
            ORDER BY accuracy_pct ASC
            LIMIT 5;
        """, (user_ids_list, roll_num))
        result["weak_topics"] = [dict(r) for r in cur.fetchall()]

        # Recent coding submissions
        cur.execute("""
            SELECT problem_id, problem_title, language, verdict, passed, total, ts, runtime_ms
            FROM coding_submissions
            WHERE user_id = ANY(%s) OR UPPER(TRIM(user_id)) = %s
            ORDER BY ts DESC
            LIMIT 10;
        """, (user_ids_list, roll_num))
        result["recent_submissions"] = [dict(r) for r in cur.fetchall()]

        # Ensure coding aggregates are populated even if view join is sparse
        if not result.get("coding_solved"):
            try:
                cur.execute("""
                    SELECT COUNT(DISTINCT problem_id) as solved_count
                    FROM coding_submissions
                    WHERE (user_id = ANY(%s) OR UPPER(TRIM(user_id)) = %s)
                      AND LOWER(verdict) = 'accepted';
                """, (user_ids_list, roll_num))
                cs_row = cur.fetchone()
                if cs_row and cs_row.get("solved_count") is not None:
                    result["coding_solved"] = cs_row["solved_count"]
            except Exception:
                pass

        # Recent MCQ attempts (questions and answers)
        try:
            cur.execute("""
                SELECT topic_slug, question_id, is_correct, selected_answer, correct_answer, question_text, explanation, ts
                FROM mcq_attempts
                WHERE user_id = ANY(%s) OR UPPER(TRIM(user_id)) = %s
                ORDER BY ts DESC
                LIMIT 10;
            """, (user_ids_list, roll_num))
            result["recent_mcq_attempts"] = [dict(r) for r in cur.fetchall()]
        except Exception:
            result["recent_mcq_attempts"] = []

        # Top 100 Codes breakdown
        try:
            cur.execute("""
                SELECT 
                    COUNT(*) FILTER (WHERE LOWER(status) = 'solved') as solved_total,
                    COUNT(*) as attempted_total,
                    COUNT(*) FILTER (WHERE difficulty ILIKE 'Easy' AND LOWER(status) = 'solved') as easy_solved,
                    COUNT(*) FILTER (WHERE difficulty ILIKE 'Medium' AND LOWER(status) = 'solved') as medium_solved,
                    COUNT(*) FILTER (WHERE difficulty ILIKE 'Hard' AND LOWER(status) = 'solved') as hard_solved
                FROM top100_progress
                WHERE user_id = ANY(%s) OR UPPER(TRIM(user_id)) = %s;
            """, (user_ids_list, roll_num))
            trow = cur.fetchone()
            result["top100_summary"] = dict(trow) if trow else {
                "solved_total": 0, "attempted_total": 0, "easy_solved": 0, "medium_solved": 0, "hard_solved": 0
            }
            if not result.get("top100_solved"):
                result["top100_solved"] = result["top100_summary"].get("solved_total", 0)
        except Exception:
            result["top100_summary"] = {
                "solved_total": 0, "attempted_total": 0, "easy_solved": 0, "medium_solved": 0, "hard_solved": 0
            }

        # Recent topics visited
        try:
            cur.execute("""
                SELECT topic_slug, topic_name, tab, duration_seconds, started_at
                FROM topic_views
                WHERE user_id = ANY(%s) OR UPPER(TRIM(user_id)) = %s
                ORDER BY started_at DESC
                LIMIT 8;
            """, (user_ids_list, roll_num))
            result["recent_topics_visited"] = [dict(r) for r in cur.fetchall()]
        except Exception:
            result["recent_topics_visited"] = []

        # Streak: days with at least one topic view in last 30 days
        cur.execute("""
            SELECT COUNT(DISTINCT started_at::date) AS streak_days
            FROM topic_views
            WHERE (user_id = ANY(%s) OR UPPER(TRIM(user_id)) = %s) AND started_at >= NOW() - INTERVAL '30 days';
        """, (user_ids_list, roll_num))
        streak_row = cur.fetchone()
        result["streak_days"] = streak_row["streak_days"] if streak_row else 0

        # Placement score (from fixly_test_submissions)
        try:
            cur.execute("""
                SELECT id, session_id, student_name, roll_number, role, branch,
                       total_marks, max_marks, percentage, total_questions, attempted,
                       correct_count, wrong_count, unanswered_count, violations_count,
                       status, submitted_at, question_answers
                FROM fixly_test_submissions
                WHERE UPPER(TRIM(roll_number)) = %s
                   OR UPPER(TRIM(roll_number)) IN (SELECT UPPER(TRIM(roll_number)) FROM users WHERE id = ANY(%s))
                   OR session_id = ANY(%s)
                ORDER BY submitted_at DESC LIMIT 1;
            """, (roll_num, user_ids_list, user_ids_list))
            prow = cur.fetchone()
            if prow:
                p_dict = dict(prow)
                pct = float(p_dict.get("percentage") or 0.0)
                v_count = int(p_dict.get("violations_count") or 0)
                
                if pct >= 80 and v_count < 3:
                    tier = "Tier 1: Super Dream (12+ LPA)"
                    band = "Product & AI High-Frequency Engineering"
                    recruiters = ["Google", "Microsoft", "Amazon", "Directi", "Goldman Sachs", "ServiceNow"]
                elif pct >= 65 and v_count < 3:
                    tier = "Tier 2: Dream (7 - 12 LPA)"
                    band = "Specialized Product & FinTech"
                    recruiters = ["TCS Digital", "Infosys DSE", "Cognizant GenC Next", "Accenture Advanced", "Oracle"]
                elif pct >= 45:
                    tier = "Tier 3: Service & Core (4.5 - 7 LPA)"
                    band = "Enterprise Application Engineering"
                    recruiters = ["TCS Ninja", "Infosys SE", "Wipro Elite", "Cognizant GenC", "Capgemini"]
                else:
                    tier = "Foundation Remedial Training (< 4.5 LPA)"
                    band = "Intensive Skill Bootcamps Required"
                    recruiters = ["Intensive Placement Bootcamp", "Core DSA Remedial", "Assessment Re-attempt"]

                p_dict["placement_tier"] = tier
                p_dict["readiness_band"] = band
                p_dict["target_recruiters"] = recruiters
                p_dict["proctoring_clearance"] = "PASSED" if v_count == 0 else ("FLAGGED" if v_count < 3 else "DISQUALIFIED")
                result["placement"] = p_dict
            else:
                result["placement"] = None
        except Exception as e:
            logger.debug("[ANALYTICS placement lookup] %s", e)
            result["placement"] = None
            result["placement"] = None

        # Generate personalized AI recommendations
        recs = []
        weak = result.get("weak_topics", [])
        if weak:
            top_weak = weak[0].get("topic_slug", "").replace("-", " ").title()
            recs.append(f"Strengthen {top_weak}: Your accuracy is under 60%. Review peer debates and interactive step panels.")
        
        top100 = result.get("top100_summary", {})
        solved_count = top100.get("solved_total", 0)
        if solved_count < 15:
            recs.append(f"Top 100 Codes: {solved_count}/100 completed. Target 5 more Easy problems to build algorithmic muscle memory.")
        elif top100.get("medium_solved", 0) < 10:
            recs.append("Interview Readiness: Solve 5 more Medium Top 100 codes to unlock the 7+ LPA technical assessment tier.")

        placement = result.get("placement")
        if placement:
            pct = float(placement.get("percentage") or 0)
            if pct < 50:
                recs.append("Diagnostic Assessment: Score below 50%. Focus on foundational DSA and Aptitude modules before your placement drive.")
            else:
                recs.append(f"Placement Clearance: Verified score of {pct:.1f}%. High readiness for product and service interviews.")
        else:
            recs.append("Take the Diagnostic Placement Assessment to benchmark your company readiness band and generate your proctored CDC report.")

        result["ai_recommendations"] = recs

        cur.close()
        return result
    except Exception as e:
        failed = True
        logger.warning("[ANALYTICS get_dashboard_summary] %s", e)
        return {}
    finally:
        _release(conn, close=failed)
