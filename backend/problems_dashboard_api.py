"""
Problems Dashboard API - Track user performance, hints used, and solved problems
Designed to be persisted to database and accessible from Vercel frontend
"""

from fastapi import APIRouter, HTTPException, Query, Depends, Request
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
import uuid
import json

# Models for dashboard
class HintUsed(BaseModel):
    """Track when a user uses a hint"""
    hint_id: int
    hint_text: str
    used_at: str  # ISO timestamp
    problem_id: int

class AttemptRecord(BaseModel):
    """Record each code attempt"""
    attempt_id: str
    problem_id: int
    language: str
    code: str
    status: str  # "accepted", "wrong_answer", "runtime_error", "time_limit_exceeded"
    passed_tests: int
    total_tests: int
    execution_time_ms: float
    memory_used_mb: float
    submitted_at: str  # ISO timestamp
    hints_used: List[HintUsed] = []

class UserDashboardStats(BaseModel):
    """User's overall statistics"""
    user_id: str
    total_problems_solved: int
    total_attempts: int
    total_hints_used: int
    total_submission_time: float  # seconds
    problems_solved: List[int]  # Problem IDs
    languages_used: Dict[str, int]  # Language -> count
    difficulty_breakdown: Dict[str, int]  # difficulty -> count solved
    average_attempts_per_problem: float
    last_submission: Optional[str]
    created_at: str

class ProblemPerformance(BaseModel):
    """Performance on specific problem"""
    problem_id: int
    user_id: str
    status: str  # "solved", "attempted", "not_attempted"
    total_attempts: int
    successful_attempt: Optional[int]  # attempt_id that passed
    hints_used: List[HintUsed]
    best_time_ms: Optional[float]
    best_memory_mb: Optional[float]
    languages_tried: List[str]
    first_attempt_at: Optional[str]
    solved_at: Optional[str]

# In-memory storage (production: use PostgreSQL)
_user_attempts: Dict[str, List[AttemptRecord]] = {}
_user_stats: Dict[str, UserDashboardStats] = {}
_problem_performance: Dict[str, Dict[int, ProblemPerformance]] = {}
_hints_storage: Dict[str, List[HintUsed]] = {}

dashboard_router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

# ============================================================================
# SUBMISSION TRACKING
# ============================================================================

@dashboard_router.post("/record-attempt", tags=["Tracking"])
async def record_attempt(
    req: AttemptRecord,
    request: Request = None,
):
    """
    Record a code submission attempt for dashboard tracking

    Called after every submission to track:
    - Which problems user attempted
    - Number of attempts per problem
    - Which hints they used
    - Languages tried
    - Execution metrics
    """
    try:
        user_id = req.user_id or "anonymous"

        # Initialize user storage if needed
        if user_id not in _user_attempts:
            _user_attempts[user_id] = []
            _user_stats[user_id] = UserDashboardStats(
                user_id=user_id,
                total_problems_solved=0,
                total_attempts=0,
                total_hints_used=0,
                total_submission_time=0,
                problems_solved=[],
                languages_used={},
                difficulty_breakdown={},
                average_attempts_per_problem=0,
                last_submission=None,
                created_at=datetime.now(timezone.utc).isoformat()
            )
            _problem_performance[user_id] = {}

        # Store attempt
        _user_attempts[user_id].append(req)

        # Update user stats
        stats = _user_stats[user_id]
        stats.total_attempts += 1
        stats.total_hints_used += len(req.hints_used)
        stats.total_submission_time += req.execution_time_ms / 1000
        stats.last_submission = req.submitted_at

        # Track language usage
        lang = req.language.lower()
        stats.languages_used[lang] = stats.languages_used.get(lang, 0) + 1

        # Update problem-specific performance
        if req.problem_id not in _problem_performance[user_id]:
            _problem_performance[user_id][req.problem_id] = ProblemPerformance(
                problem_id=req.problem_id,
                user_id=user_id,
                status="attempted",
                total_attempts=0,
                successful_attempt=None,
                hints_used=[],
                best_time_ms=None,
                best_memory_mb=None,
                languages_tried=[],
                first_attempt_at=req.submitted_at,
                solved_at=None
            )

        perf = _problem_performance[user_id][req.problem_id]
        perf.total_attempts += 1
        perf.hints_used.extend(req.hints_used)

        if req.language not in perf.languages_tried:
            perf.languages_tried.append(req.language)

        # Check if problem solved
        if req.status == "accepted":
            if perf.status != "solved":
                perf.status = "solved"
                perf.solved_at = req.submitted_at
                stats.total_problems_solved += 1

                if req.problem_id not in stats.problems_solved:
                    stats.problems_solved.append(req.problem_id)

            perf.successful_attempt = req.attempt_id

            # Track best performance
            if perf.best_time_ms is None or req.execution_time_ms < perf.best_time_ms:
                perf.best_time_ms = req.execution_time_ms
            if perf.best_memory_mb is None or req.memory_used_mb < perf.best_memory_mb:
                perf.best_memory_mb = req.memory_used_mb

        # Calculate average attempts
        if stats.total_problems_solved > 0:
            stats.average_attempts_per_problem = stats.total_attempts / stats.total_problems_solved

        return {
            "status": "recorded",
            "attempt_id": req.attempt_id,
            "user_id": user_id,
            "problem_solved": req.status == "accepted"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to record attempt: {e}")

# ============================================================================
# HINT TRACKING
# ============================================================================

@dashboard_router.post("/record-hint", tags=["Tracking"])
async def record_hint_usage(
    problem_id: int,
    user_id: str,
    hint_id: int,
    hint_text: str,
    request: Request = None,
):
    """
    Record when a user views/uses a hint

    This helps track:
    - Which hints users need
    - Learning patterns
    - Problem difficulty indicators
    """
    try:
        hint = HintUsed(
            hint_id=hint_id,
            hint_text=hint_text,
            used_at=datetime.now(timezone.utc).isoformat(),
            problem_id=problem_id
        )

        key = f"{user_id}:{problem_id}"
        if key not in _hints_storage:
            _hints_storage[key] = []

        _hints_storage[key].append(hint)

        # Update user stats
        if user_id in _user_stats:
            _user_stats[user_id].total_hints_used += 1

        return {
            "status": "recorded",
            "hint_id": hint_id,
            "user_id": user_id,
            "problem_id": problem_id
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to record hint: {e}")

# ============================================================================
# DASHBOARD ENDPOINTS
# ============================================================================

@dashboard_router.get("/user-stats/{user_id}", tags=["Public"])
async def get_user_stats(user_id: str):
    """Get comprehensive dashboard stats for a user"""
    if user_id not in _user_stats:
        raise HTTPException(status_code=404, detail=f"No stats found for user {user_id}")

    stats = _user_stats[user_id]

    return {
        "user_id": stats.user_id,
        "total_problems_solved": stats.total_problems_solved,
        "total_attempts": stats.total_attempts,
        "total_hints_used": stats.total_hints_used,
        "total_submission_time_seconds": stats.total_submission_time,
        "problems_solved": stats.problems_solved,
        "languages_used": stats.languages_used,
        "difficulty_breakdown": stats.difficulty_breakdown,
        "average_attempts_per_problem": round(stats.average_attempts_per_problem, 2),
        "last_submission": stats.last_submission,
        "created_at": stats.created_at
    }

@dashboard_router.get("/problem-performance/{user_id}/{problem_id}", tags=["Public"])
async def get_problem_performance(user_id: str, problem_id: int):
    """Get performance on specific problem"""
    if user_id not in _problem_performance:
        raise HTTPException(status_code=404, detail=f"No data for user {user_id}")

    if problem_id not in _problem_performance[user_id]:
        raise HTTPException(status_code=404, detail=f"No performance data for problem {problem_id}")

    perf = _problem_performance[user_id][problem_id]

    return {
        "problem_id": perf.problem_id,
        "user_id": perf.user_id,
        "status": perf.status,
        "total_attempts": perf.total_attempts,
        "successful_attempt": perf.successful_attempt,
        "hints_used": [
            {
                "hint_id": h.hint_id,
                "hint_text": h.hint_text,
                "used_at": h.used_at
            }
            for h in perf.hints_used
        ],
        "best_time_ms": perf.best_time_ms,
        "best_memory_mb": perf.best_memory_mb,
        "languages_tried": perf.languages_tried,
        "first_attempt_at": perf.first_attempt_at,
        "solved_at": perf.solved_at
    }

@dashboard_router.get("/user-attempts/{user_id}", tags=["Public"])
async def get_user_attempts(
    user_id: str,
    problem_id: Optional[int] = Query(None),
    limit: int = Query(50, le=100),
):
    """Get all attempts for a user (optionally filtered by problem)"""
    if user_id not in _user_attempts:
        raise HTTPException(status_code=404, detail=f"No attempts for user {user_id}")

    attempts = _user_attempts[user_id]

    if problem_id:
        attempts = [a for a in attempts if a.problem_id == problem_id]

    # Sort by most recent
    attempts = sorted(attempts, key=lambda x: x.submitted_at, reverse=True)

    return {
        "user_id": user_id,
        "total_attempts": len(attempts),
        "attempts": [
            {
                "attempt_id": a.attempt_id,
                "problem_id": a.problem_id,
                "language": a.language,
                "status": a.status,
                "passed_tests": a.passed_tests,
                "total_tests": a.total_tests,
                "execution_time_ms": a.execution_time_ms,
                "memory_used_mb": a.memory_used_mb,
                "submitted_at": a.submitted_at,
                "hints_used_count": len(a.hints_used)
            }
            for a in attempts[:limit]
        ]
    }

@dashboard_router.get("/problem-hints/{user_id}/{problem_id}", tags=["Public"])
async def get_problem_hints(user_id: str, problem_id: int):
    """Get all hints used for a specific problem"""
    key = f"{user_id}:{problem_id}"

    if key not in _hints_storage:
        return {
            "user_id": user_id,
            "problem_id": problem_id,
            "hints_used": [],
            "total_hints": 0
        }

    hints = _hints_storage[key]

    return {
        "user_id": user_id,
        "problem_id": problem_id,
        "hints_used": [
            {
                "hint_id": h.hint_id,
                "hint_text": h.hint_text,
                "used_at": h.used_at
            }
            for h in hints
        ],
        "total_hints": len(hints)
    }

@dashboard_router.get("/leaderboard", tags=["Public"])
async def get_leaderboard(
    limit: int = Query(50, le=100),
    sort_by: str = Query("problems_solved", regex="^(problems_solved|total_attempts|average_attempts)$"),
):
    """Get global leaderboard"""
    users_data = []

    for user_id, stats in _user_stats.items():
        if stats.total_problems_solved == 0:
            continue

        users_data.append({
            "user_id": user_id,
            "problems_solved": stats.total_problems_solved,
            "total_attempts": stats.total_attempts,
            "average_attempts": round(stats.average_attempts_per_problem, 2),
            "total_hints_used": stats.total_hints_used,
            "last_submission": stats.last_submission
        })

    # Sort
    if sort_by == "problems_solved":
        users_data.sort(key=lambda x: x["problems_solved"], reverse=True)
    elif sort_by == "total_attempts":
        users_data.sort(key=lambda x: x["total_attempts"])
    elif sort_by == "average_attempts":
        users_data.sort(key=lambda x: x["average_attempts"])

    # Add rank
    for idx, user in enumerate(users_data[:limit]):
        user["rank"] = idx + 1

    return {
        "leaderboard": users_data[:limit],
        "total_users": len(users_data),
        "sort_by": sort_by
    }

@dashboard_router.get("/daily-summary/{user_id}", tags=["Public"])
async def get_daily_summary(user_id: str):
    """Get today's activity summary"""
    if user_id not in _user_attempts:
        return {
            "user_id": user_id,
            "date": datetime.now(timezone.utc).date().isoformat(),
            "problems_attempted": 0,
            "problems_solved": 0,
            "total_attempts": 0,
            "total_hints_used": 0,
            "total_time_spent_minutes": 0
        }

    from datetime import date
    today = date.today()

    today_attempts = [
        a for a in _user_attempts[user_id]
        if a.submitted_at.startswith(today.isoformat())
    ]

    problems_attempted = set(a.problem_id for a in today_attempts)
    problems_solved = set(a.problem_id for a in today_attempts if a.status == "accepted")
    total_hints = sum(len(a.hints_used) for a in today_attempts)
    total_time = sum(a.execution_time_ms for a in today_attempts) / 1000 / 60  # Convert to minutes

    return {
        "user_id": user_id,
        "date": today.isoformat(),
        "problems_attempted": len(problems_attempted),
        "problems_solved": len(problems_solved),
        "total_attempts": len(today_attempts),
        "total_hints_used": total_hints,
        "total_time_spent_minutes": round(total_time, 2)
    }

@dashboard_router.get("/progress/{user_id}", tags=["Public"])
async def get_progress_chart(user_id: str):
    """Get progress data for charts (problems solved over time)"""
    if user_id not in _user_attempts:
        return {"user_id": user_id, "progress": []}

    # Group by date
    progress_by_date = {}

    for attempt in _user_attempts[user_id]:
        if attempt.status != "accepted":
            continue

        date_key = attempt.submitted_at.split("T")[0]
        if date_key not in progress_by_date:
            progress_by_date[date_key] = 0
        progress_by_date[date_key] += 1

    # Convert to cumulative
    sorted_dates = sorted(progress_by_date.keys())
    cumulative = []
    total = 0

    for date in sorted_dates:
        total += progress_by_date[date]
        cumulative.append({
            "date": date,
            "problems_solved": total,
            "solved_today": progress_by_date[date]
        })

    return {
        "user_id": user_id,
        "progress": cumulative
    }
