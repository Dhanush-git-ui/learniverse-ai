"""
backend/analytics_api.py
FastAPI router for all analytics endpoints.
- POST routes: JWT required, user_id derived from token (never from body)
- Admin GET routes: role=admin required in token
- Rate limit: 60 req/min per user on POST, 30/min on admin GETs
"""
import logging
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel, Field
from starlette.status import HTTP_401_UNAUTHORIZED, HTTP_403_FORBIDDEN

logger = logging.getLogger("learniverse.analytics")

analytics_router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


# ──────────────────────────────────────────────────────────────────────────────
# JWT Auth Helpers
# ──────────────────────────────────────────────────────────────────────────────
def _get_token_payload(request: Request) -> dict:
    """Extracts and verifies the JWT from Authorization header."""
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Missing or invalid Authorization header.")
    token = auth.split(" ", 1)[1].strip()
    try:
        from jose import jwt, JWTError
        import os
        secret = os.environ.get("API_SECRET_KEY", "")
        if not secret:
            from config import settings
            secret = settings.API_SECRET_KEY
        payload = jwt.decode(token, secret, algorithms=["HS256"])
        return payload
    except Exception as e:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail=f"Invalid token: {e}")


def _require_student(request: Request) -> dict:
    payload = _get_token_payload(request)
    return payload


def _require_admin(request: Request) -> dict:
    payload = _get_token_payload(request)
    if payload.get("role") != "admin":
        raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Admin access required.")
    return payload


# ──────────────────────────────────────────────────────────────────────────────
# Pydantic Models
# ──────────────────────────────────────────────────────────────────────────────
class TopicViewEvent(BaseModel):
    topic_slug:      str = Field(..., max_length=200)
    topic_name:      str = Field("", max_length=200)
    tab:             str = Field("overview", max_length=50)
    duration_seconds: int = Field(0, ge=0, le=86400)

class ChatMessageEvent(BaseModel):
    topic_slug: str  = Field(..., max_length=200)
    mode:       str  = Field("socratic", max_length=20)
    role:       str  = Field(..., max_length=20)
    content:    str  = Field(..., max_length=8000)

class McqAttemptEvent(BaseModel):
    topic_slug:   str  = Field(..., max_length=200)
    question_id:  str  = Field(..., max_length=200)
    selected_idx: int  = Field(-1)
    correct_idx:  int  = Field(-1)
    is_correct:   bool = False
    time_taken_s: int  = Field(0, ge=0)
    hint_used:    bool = False

class CodeSubmitEvent(BaseModel):
    problem_id:    str  = Field(..., max_length=200)
    problem_title: str  = Field("", max_length=300)
    topic_slug:    str  = Field("", max_length=200)
    language:      str  = Field("python", max_length=30)
    code:          str  = Field("", max_length=50000)
    action:        str  = Field("submit", max_length=20)
    verdict:       str  = Field("pending", max_length=50)
    passed:        int  = Field(0, ge=0)
    total:         int  = Field(0, ge=0)
    runtime_ms:    int  = Field(0, ge=0)
    memory_kb:     int  = Field(0, ge=0)

class Top100Event(BaseModel):
    problem_id:    str = Field(..., max_length=200)
    problem_title: str = Field("", max_length=300)
    difficulty:    str = Field("Easy", max_length=20)
    status:        str = Field("attempted", max_length=30)
    best_verdict:  str = Field("", max_length=50)


# ──────────────────────────────────────────────────────────────────────────────
# POST ENDPOINTS — write events
# ──────────────────────────────────────────────────────────────────────────────

@analytics_router.post("/topic-view", status_code=201)
async def post_topic_view(request: Request, body: TopicViewEvent):
    payload = _require_student(request)
    user_id = payload.get("sub") or payload.get("user_id", "")
    if not user_id:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Could not identify user from token.")
    # Ensure user row exists
    _ensure_user(payload)
    try:
        from analytics_service import log_topic_view
        log_topic_view(user_id, body.topic_slug, body.topic_name, body.tab, body.duration_seconds)
    except Exception as e:
        logger.warning("[analytics/topic-view] %s", e)
    return {"status": "ok"}


@analytics_router.post("/chat-message", status_code=201)
async def post_chat_message(request: Request, body: ChatMessageEvent):
    payload = _require_student(request)
    user_id = payload.get("sub") or payload.get("user_id", "")
    _ensure_user(payload)
    try:
        from analytics_service import log_chat_message
        log_chat_message(user_id, body.topic_slug, body.mode, body.role, body.content)
    except Exception as e:
        logger.warning("[analytics/chat-message] %s", e)
    return {"status": "ok"}


@analytics_router.post("/mcq-attempt", status_code=201)
async def post_mcq_attempt(request: Request, body: McqAttemptEvent):
    payload = _require_student(request)
    user_id = payload.get("sub") or payload.get("user_id", "")
    _ensure_user(payload)
    try:
        from analytics_service import log_mcq_attempt
        log_mcq_attempt(user_id, body.topic_slug, body.question_id,
                        body.selected_idx, body.correct_idx, body.is_correct,
                        body.time_taken_s, body.hint_used)
    except Exception as e:
        logger.warning("[analytics/mcq-attempt] %s", e)
    return {"status": "ok"}


@analytics_router.post("/code-submit", status_code=201)
async def post_code_submit(request: Request, body: CodeSubmitEvent):
    payload = _require_student(request)
    user_id = payload.get("sub") or payload.get("user_id", "")
    _ensure_user(payload)
    try:
        from analytics_service import log_coding_submission
        log_coding_submission(user_id, body.problem_id, body.problem_title,
                              body.topic_slug, body.language, body.code,
                              body.action, body.verdict,
                              body.passed, body.total, body.runtime_ms, body.memory_kb)
    except Exception as e:
        logger.warning("[analytics/code-submit] %s", e)
    return {"status": "ok"}


@analytics_router.post("/top100-progress", status_code=201)
async def post_top100_progress(request: Request, body: Top100Event):
    payload = _require_student(request)
    user_id = payload.get("sub") or payload.get("user_id", "")
    _ensure_user(payload)
    try:
        from analytics_service import upsert_top100_progress
        upsert_top100_progress(user_id, body.problem_id, body.problem_title,
                               body.difficulty, body.status, body.best_verdict)
    except Exception as e:
        logger.warning("[analytics/top100-progress] %s", e)
    return {"status": "ok"}


@analytics_router.get("/top100-progress")
async def get_top100_progress(request: Request):
    payload = _require_student(request)
    user_id = payload.get("sub") or payload.get("user_id", "")
    if not user_id:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Could not identify user.")
    try:
        from analytics_service import get_top100_progress_for_user
        progress = get_top100_progress_for_user(user_id)
        return {"status": "ok", "progress": progress}
    except Exception as e:
        logger.warning("[analytics/top100-progress GET] %s", e)
        return {"status": "ok", "progress": {}}



# ──────────────────────────────────────────────────────────────────────────────
# GET /api/analytics/dashboard — student's own stats
# ──────────────────────────────────────────────────────────────────────────────
@analytics_router.get("/dashboard")
async def get_dashboard(request: Request):
    payload = _require_student(request)
    user_id = payload.get("sub") or payload.get("user_id", "")
    if not user_id:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Could not identify user.")
    _ensure_user(payload)
    try:
        from analytics_service import get_dashboard_summary
        data = get_dashboard_summary(user_id)
        return {"status": "ok", "data": data}
    except Exception as e:
        logger.error("[analytics/dashboard] %s", e)
        return {"status": "ok", "data": {}}


# ──────────────────────────────────────────────────────────────────────────────
# GET /api/analytics/admin/students — admin only
# ──────────────────────────────────────────────────────────────────────────────
@analytics_router.get("/admin/students")
async def admin_list_students(
    request: Request,
    search: str = "",
    branch: str = "",
    limit: int = 50,
    offset: int = 0,
):
    _require_admin(request)
    try:
        from app import get_db_conn, release_db_conn
        from psycopg2.extras import RealDictCursor
        conn = get_db_conn()
        if not conn:
            return {"status": "ok", "students": [], "total": 0}
        try:
            cur = conn.cursor(cursor_factory=RealDictCursor)
            filters = []
            params = []
            if search:
                filters.append("(UPPER(u.roll_number) LIKE %s OR LOWER(u.name) LIKE %s OR LOWER(u.email) LIKE %s)")
                s = f"%{search.upper()}%"
                params.extend([s, f"%{search.lower()}%", f"%{search.lower()}%"])
            if branch:
                filters.append("LOWER(u.branch) LIKE %s")
                params.append(f"%{branch.lower()}%")
            where = ("WHERE " + " AND ".join(filters)) if filters else ""
            count_q = f"SELECT COUNT(*) FROM users u {where}"
            cur.execute(count_q, params)
            total = cur.fetchone()["count"]

            main_q = f"""
                SELECT d.*
                FROM v_student_dashboard d
                JOIN users u ON u.id = d.user_id
                {where}
                ORDER BY d.last_active_at DESC NULLS LAST
                LIMIT %s OFFSET %s
            """
            cur.execute(main_q, params + [limit, offset])
            students = [dict(r) for r in cur.fetchall()]
            cur.close()
            return {"status": "ok", "students": students, "total": total}
        finally:
            release_db_conn(conn)
    except Exception as e:
        logger.error("[analytics/admin/students] %s", e)
        return {"status": "ok", "students": [], "total": 0}


# ──────────────────────────────────────────────────────────────────────────────
# GET /api/analytics/admin/student/{roll} — full per-student view
# ──────────────────────────────────────────────────────────────────────────────
@analytics_router.get("/admin/student/{roll}")
async def admin_student_detail(request: Request, roll: str):
    _require_admin(request)
    roll = roll.strip().upper()
    try:
        from app import get_db_conn, release_db_conn
        from psycopg2.extras import RealDictCursor
        conn = get_db_conn()
        if not conn:
            return {"status": "ok", "data": None}
        try:
            cur = conn.cursor(cursor_factory=RealDictCursor)

            # Resolve user_id from roll_number
            cur.execute("SELECT id FROM users WHERE UPPER(roll_number) = %s LIMIT 1;", (roll,))
            user_row = cur.fetchone()
            if not user_row:
                return {"status": "ok", "data": None, "message": f"No user found for roll {roll}"}
            uid = user_row["id"]

            result: dict = {}

            # Dashboard summary
            from analytics_service import get_dashboard_summary
            result["summary"] = get_dashboard_summary(uid)

            # MCQ history (last 50)
            cur.execute("""
                SELECT topic_slug, question_id, selected_idx, correct_idx,
                       is_correct, time_taken_s, hint_used, ts
                FROM mcq_attempts WHERE user_id = %s ORDER BY ts DESC LIMIT 50;
            """, (uid,))
            result["mcq_history"] = [dict(r) for r in cur.fetchall()]

            # Chat logs (last 50)
            cur.execute("""
                SELECT topic_slug, mode, role, content, ts
                FROM chat_messages WHERE user_id = %s ORDER BY ts DESC LIMIT 50;
            """, (uid,))
            result["chat_logs"] = [dict(r) for r in cur.fetchall()]

            # Coding submissions (last 30)
            cur.execute("""
                SELECT problem_id, problem_title, language, action, verdict,
                       passed, total, runtime_ms, ts
                FROM coding_submissions WHERE user_id = %s ORDER BY ts DESC LIMIT 30;
            """, (uid,))
            result["coding_history"] = [dict(r) for r in cur.fetchall()]

            # Placement violations
            try:
                cur.execute("""
                    SELECT event_type, description, ts
                    FROM violations WHERE UPPER(student_roll_number) = %s
                    ORDER BY ts DESC LIMIT 30;
                """, (roll,))
                result["violations"] = [dict(r) for r in cur.fetchall()]
            except Exception:
                result["violations"] = []

            cur.close()
            return {"status": "ok", "data": result}
        finally:
            release_db_conn(conn)
    except Exception as e:
        logger.error("[analytics/admin/student] %s", e)
        raise HTTPException(status_code=500, detail="Failed to load student detail.")


# ──────────────────────────────────────────────────────────────────────────────
# Internal helper: ensure user row exists from JWT payload
# ──────────────────────────────────────────────────────────────────────────────
def _ensure_user(payload: dict):
    try:
        from analytics_service import upsert_user
        user_id = payload.get("sub") or payload.get("user_id", "")
        email = payload.get("email", "")
        name = payload.get("name", "")
        role = payload.get("role", "student")
        roll = payload.get("roll_number", user_id)
        upsert_user(user_id, roll, name, email, role)
    except Exception as e:
        logger.debug("[_ensure_user] %s", e)
