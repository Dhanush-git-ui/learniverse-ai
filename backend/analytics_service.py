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


def _release(conn):
    try:
        from app import release_db_conn
        release_db_conn(conn)
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
                    time_taken_s: int = 0, hint_used: bool = False):
    conn = _conn()
    if not conn:
        return
    try:
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO mcq_attempts
                (user_id, topic_slug, question_id, selected_idx, correct_idx,
                 is_correct, time_taken_s, hint_used)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
        """, (user_id, topic_slug, question_id, selected_idx, correct_idx,
              is_correct, time_taken_s, hint_used))
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
    try:
        from psycopg2.extras import RealDictCursor
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Main aggregates from view
        cur.execute("SELECT * FROM v_student_dashboard WHERE user_id = %s;", (user_id,))
        row = cur.fetchone()
        result = dict(row) if row else {}

        # Per-topic MCQ accuracy
        cur.execute("""
            SELECT topic_slug, accuracy_pct, questions_attempted, correct_count, last_attempted
            FROM v_mcq_topic_accuracy
            WHERE user_id = %s
            ORDER BY last_attempted DESC
            LIMIT 10;
        """, (user_id,))
        result["mcq_by_topic"] = [dict(r) for r in cur.fetchall()]

        # Weak topics (accuracy < 60%)
        cur.execute("""
            SELECT topic_slug, accuracy_pct
            FROM v_mcq_topic_accuracy
            WHERE user_id = %s AND questions_attempted >= 3
            ORDER BY accuracy_pct ASC
            LIMIT 5;
        """, (user_id,))
        result["weak_topics"] = [dict(r) for r in cur.fetchall()]

        # Recent coding submissions
        cur.execute("""
            SELECT problem_id, problem_title, language, verdict, passed, total, ts
            FROM coding_submissions
            WHERE user_id = %s AND action = 'submit'
            ORDER BY ts DESC
            LIMIT 10;
        """, (user_id,))
        result["recent_submissions"] = [dict(r) for r in cur.fetchall()]

        # Streak: days with at least one topic view in last 30 days
        cur.execute("""
            SELECT COUNT(DISTINCT started_at::date) AS streak_days
            FROM topic_views
            WHERE user_id = %s AND started_at >= NOW() - INTERVAL '30 days';
        """, (user_id,))
        streak_row = cur.fetchone()
        result["streak_days"] = streak_row["streak_days"] if streak_row else 0

        # Placement score (from fixly_test_submissions)
        try:
            cur.execute("""
                SELECT total_marks, max_marks, percentage, status, submitted_at
                FROM fixly_test_submissions
                WHERE UPPER(roll_number) = (
                    SELECT UPPER(roll_number) FROM users WHERE id = %s LIMIT 1
                )
                ORDER BY submitted_at DESC LIMIT 1;
            """, (user_id,))
            prow = cur.fetchone()
            result["placement"] = dict(prow) if prow else None
        except Exception:
            result["placement"] = None

        cur.close()
        return result
    except Exception as e:
        logger.warning("[ANALYTICS get_dashboard_summary] %s", e)
        return {}
    finally:
        _release(conn)
