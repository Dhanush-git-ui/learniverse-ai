# backend/cdc_integration.py
"""
CDC HITAM Integration API Router
Enables seamless two-way integration between Learniverse AI Assessment System
and CDC HITAM (https://cdc-hitam.onrender.com/).

Features:
- GET /api/cdc/student/{roll_number}: Student marks, percentage, section breakdown, and track verification
- GET /api/cdc/all-results: Aggregated candidate submissions for CDC dashboards & Google Sheets sync
- POST /api/cdc/sync/{roll_number}: Manual trigger to push marks to CDC HITAM backend
- dispatch_to_cdc_hitam(sub_record): Async background worker to auto-push scores upon test completion
"""

import os
import json
import logging
import sqlite3
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
import requests
from fastapi import APIRouter, HTTPException, Query, BackgroundTasks
from pydantic import BaseModel

from config import settings

logger = logging.getLogger("learniverse.cdc_integration")

cdc_router = APIRouter(prefix="/api/cdc", tags=["CDC HITAM Integration"])

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
SQLITE_DB_PATH = os.path.join(os.path.dirname(__file__), "placement_assessment_system", "assessment_local.db")
BACKUP_JSON_PATH = os.path.join(DATA_DIR, "Fixly_Submissions_Live.json")


def _fetch_submission_from_sources(roll_number: str) -> Optional[dict]:
    """Search for student submission across Neon PostgreSQL, SQLite, and persistent disk backup."""
    clean_roll = roll_number.strip().upper()

    # 1. PostgreSQL (Neon DB)
    db_url = settings.DATABASE_URL
    if db_url:
        try:
            import psycopg2
            from psycopg2.extras import RealDictCursor
            conn = psycopg2.connect(db_url)
            cur = conn.cursor(cursor_factory=RealDictCursor)
            cur.execute(
                """
                SELECT * FROM fixly_test_submissions
                WHERE UPPER(TRIM(roll_number)) = %s
                ORDER BY submitted_at DESC LIMIT 1;
                """,
                (clean_roll,)
            )
            row = cur.fetchone()
            conn.close()
            if row:
                return dict(row)
        except Exception as e:
            logger.warning("[CDC_INTEGRATION] Neon DB lookup error: %s", e)

    # 2. Local SQLite database
    if os.path.exists(SQLITE_DB_PATH):
        try:
            conn = sqlite3.connect(SQLITE_DB_PATH)
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute(
                """
                SELECT * FROM fixly_test_submissions
                WHERE UPPER(TRIM(roll_number)) = ?
                ORDER BY submitted_at DESC LIMIT 1;
                """,
                (clean_roll,)
            )
            row = cur.fetchone()
            conn.close()
            if row:
                return dict(row)
        except Exception as e:
            logger.warning("[CDC_INTEGRATION] SQLite lookup error: %s", e)

    # 3. Persistent JSON disk backup
    if os.path.exists(BACKUP_JSON_PATH):
        try:
            with open(BACKUP_JSON_PATH, "r", encoding="utf-8") as f:
                records = json.load(f)
            for r in reversed(records):
                if str(r.get("roll_number", "")).strip().upper() == clean_roll:
                    return r
        except Exception as e:
            logger.warning("[CDC_INTEGRATION] Disk backup lookup error: %s", e)

    return None


def _fetch_all_submissions_from_sources() -> List[dict]:
    """Retrieve all student exam submissions aggregated across all storage backends."""
    results_map: Dict[str, dict] = {}

    # 1. Neon PostgreSQL
    db_url = settings.DATABASE_URL
    if db_url:
        try:
            import psycopg2
            from psycopg2.extras import RealDictCursor
            conn = psycopg2.connect(db_url)
            cur = conn.cursor(cursor_factory=RealDictCursor)
            cur.execute("SELECT * FROM fixly_test_submissions ORDER BY submitted_at DESC;")
            rows = cur.fetchall() or []
            conn.close()
            for r in rows:
                roll = str(r.get("roll_number", "")).strip().upper()
                if roll and roll not in results_map:
                    results_map[roll] = dict(r)
        except Exception as e:
            logger.warning("[CDC_INTEGRATION] Neon DB fetch all error: %s", e)

    # 2. Local SQLite
    if os.path.exists(SQLITE_DB_PATH):
        try:
            conn = sqlite3.connect(SQLITE_DB_PATH)
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute("SELECT * FROM fixly_test_submissions ORDER BY submitted_at DESC;")
            rows = [dict(row) for row in cur.fetchall()]
            conn.close()
            for r in rows:
                roll = str(r.get("roll_number", "")).strip().upper()
                if roll and roll not in results_map:
                    results_map[roll] = r
        except Exception as e:
            logger.warning("[CDC_INTEGRATION] SQLite fetch all error: %s", e)

    # 3. Persistent JSON backup
    if os.path.exists(BACKUP_JSON_PATH):
        try:
            with open(BACKUP_JSON_PATH, "r", encoding="utf-8") as f:
                backup_rows = json.load(f)
            for r in backup_rows:
                roll = str(r.get("roll_number", "")).strip().upper()
                if roll and roll not in results_map:
                    results_map[roll] = r
        except Exception as e:
            logger.warning("[CDC_INTEGRATION] Disk backup fetch all error: %s", e)

    return list(results_map.values())


def determine_placement_tier(percentage: float, violations_count: int = 0, status: str = "completed") -> Dict[str, Any]:
    """
    Classifies a candidate into an institutional placement readiness tier.
    - Tier-1 Product Ready: >= 75% score, < 3 violations
    - Tier-2 Enterprise Ready: 50% - 74.9% score, < 3 violations
    - Needs Remedial Training: < 50% score
    - Disqualified: 3+ violations or disqualified status
    """
    clean_status = (status or "completed").lower()
    if clean_status == "disqualified" or violations_count >= 3:
        return {
            "tier": "Disqualified / Review Required",
            "tier_level": 0,
            "band": "Flagged",
            "expected_ctc_range": "N/A",
            "eligibility": "Proctoring Flag - Manual Verification Required",
            "recommended_companies": [],
            "status_message": f"Candidate flagged with {violations_count} proctoring violations.",
            "next_steps": "Candidate dossier forwarded to CDC HITAM Disciplinary Committee for review."
        }

    if percentage >= 75.0:
        return {
            "tier": "Tier-1 Product Ready",
            "tier_level": 1,
            "band": "Premium (8 - 24+ LPA)",
            "expected_ctc_range": "8 - 24 LPA",
            "eligibility": "Direct eligibility for Tier-1 Product Engineering & Super Dream companies",
            "recommended_companies": [
                "Amazon", "Google", "Microsoft", "Directi", "Adobe", 
                "Oracle", "Goldman Sachs", "Salesforce", "Atlassian"
            ],
            "status_message": "Exceptional problem-solving, DSA proficiency, and technical foundations.",
            "next_steps": "Fast-track candidate for Day-1 product engineering campus interviews."
        }
    elif percentage >= 50.0:
        return {
            "tier": "Tier-2 Enterprise Ready",
            "tier_level": 2,
            "band": "Standard (4.5 - 7.5 LPA)",
            "expected_ctc_range": "4.5 - 7.5 LPA",
            "eligibility": "Direct eligibility for Mass Recruitment & Enterprise Digital roles",
            "recommended_companies": [
                "TCS Digital", "Infosys DSE", "Wipro Turbo", "Accenture", 
                "Cognizant GenC Next", "Capgemini", "L&T Technology Services"
            ],
            "status_message": "Solid foundational competency. Ready for enterprise hiring with targeted practice.",
            "next_steps": "Assign 2-week mock interview drills and DSA optimization exercises."
        }
    else:
        return {
            "tier": "Needs Remedial Training",
            "tier_level": 3,
            "band": "Foundation Building (< 4.5 LPA)",
            "expected_ctc_range": "< 4.5 LPA",
            "eligibility": "Eligible for Service / Ninja tier roles upon completing remedial track",
            "recommended_companies": [
                "TCS Ninja", "Infosys SE", "Wipro Elite", "Cognizant GenC", "Tech Mahindra"
            ],
            "status_message": "Core gaps identified in Quantitative Aptitude, Technical Fundamentals, or Speed.",
            "next_steps": "Enroll in CDC HITAM 4-week remedial bootcamp with weekly progress tracking."
        }


def calculate_topic_mastery(record: dict) -> Dict[str, Any]:
    """
    Parses question-level responses and computes fine-grained topic mastery analytics:
    - Questions, Attempted, Correct, Wrong
    - Accuracy % and Marks obtained
    - Mastery Level: 'Mastered' (>=80%), 'Proficient' (>=60%), 'Needs Practice' (>=40%), 'Critical Gap' (<40%)
    - Time spent per topic
    - Sorted strongest vs. weakest topics and recommended focus areas
    """
    q_answers = record.get("question_answers")
    if isinstance(q_answers, str):
        try:
            q_answers = json.loads(q_answers)
        except Exception:
            q_answers = []

    if not isinstance(q_answers, list) or not q_answers:
        return {
            "topics": {},
            "strongest_topics": [],
            "weakest_topics": [],
            "recommended_focus_areas": [],
            "total_topics_evaluated": 0
        }

    topic_stats: Dict[str, dict] = {}

    for qa in q_answers:
        topic = (qa.get("topic") or qa.get("category") or "General").strip()
        if not topic:
            topic = "General"

        if topic not in topic_stats:
            topic_stats[topic] = {
                "topic": topic,
                "category": qa.get("category", "General"),
                "total_questions": 0,
                "attempted": 0,
                "correct": 0,
                "wrong": 0,
                "marks_obtained": 0.0,
                "max_marks": 0.0,
                "time_spent_seconds": 0
            }

        stats = topic_stats[topic]
        stats["total_questions"] += 1
        stats["max_marks"] += float(qa.get("marks_awarded") or 1.0) if qa.get("marks_awarded") else 1.0

        user_ans = str(qa.get("student_answer") or "").strip()
        is_attempted = bool(user_ans and user_ans != "(unattempted)")
        if is_attempted:
            stats["attempted"] += 1

        is_corr = bool(qa.get("is_correct"))
        if is_corr:
            stats["correct"] += 1
            stats["marks_obtained"] += float(qa.get("marks_awarded") or 1.0)
        elif is_attempted:
            stats["wrong"] += 1

        stats["time_spent_seconds"] += int(qa.get("time_spent") or 0)

    processed_topics = {}
    for t_name, data in topic_stats.items():
        tot = data["total_questions"]
        corr = data["correct"]
        acc = round((corr / tot) * 100.0, 1) if tot > 0 else 0.0
        avg_time = round(data["time_spent_seconds"] / float(tot), 1) if tot > 0 else 0.0

        if acc >= 80.0:
            level = "Mastered"
            badge = "STRONG"
        elif acc >= 60.0:
            level = "Proficient"
            badge = "GOOD"
        elif acc >= 40.0:
            level = "Needs Practice"
            badge = "MODERATE"
        else:
            level = "Critical Gap"
            badge = "WEAK"

        processed_topics[t_name] = {
            "topic": t_name,
            "category": data["category"],
            "total_questions": tot,
            "attempted": data["attempted"],
            "correct": corr,
            "wrong": data["wrong"],
            "accuracy": acc,
            "marks_obtained": round(data["marks_obtained"], 2),
            "max_marks": round(data["max_marks"], 2),
            "mastery_level": level,
            "status_badge": badge,
            "time_spent_seconds": data["time_spent_seconds"],
            "avg_time_per_question_sec": avg_time
        }

    sorted_topics = sorted(processed_topics.values(), key=lambda x: (x["accuracy"], x["correct"]), reverse=True)
    strongest = [t["topic"] for t in sorted_topics if t["accuracy"] >= 60.0][:3]
    weakest = [t["topic"] for t in reversed(sorted_topics) if t["accuracy"] < 60.0][:3]
    focus_areas = [t["topic"] for t in sorted_topics if t["accuracy"] < 50.0]

    return {
        "topics": processed_topics,
        "strongest_topics": strongest,
        "weakest_topics": weakest,
        "recommended_focus_areas": focus_areas,
        "total_topics_evaluated": len(processed_topics)
    }


def calculate_difficulty_breakdown(record: dict) -> Dict[str, Any]:
    """Computes candidate performance across Easy, Medium, and Hard questions."""
    q_answers = record.get("question_answers")
    if isinstance(q_answers, str):
        try:
            q_answers = json.loads(q_answers)
        except Exception:
            q_answers = []

    diffs = {
        "Easy": {"total": 0, "correct": 0, "accuracy": 0.0},
        "Medium": {"total": 0, "correct": 0, "accuracy": 0.0},
        "Hard": {"total": 0, "correct": 0, "accuracy": 0.0}
    }

    if isinstance(q_answers, list):
        for qa in q_answers:
            d = str(qa.get("difficulty") or "Medium").capitalize()
            if d not in diffs:
                diffs[d] = {"total": 0, "correct": 0, "accuracy": 0.0}
            diffs[d]["total"] += 1
            if qa.get("is_correct"):
                diffs[d]["correct"] += 1

        for d_val in diffs.values():
            if d_val["total"] > 0:
                d_val["accuracy"] = round((d_val["correct"] / d_val["total"]) * 100.0, 1)

    return diffs


def calculate_pacing_telemetry(record: dict) -> Dict[str, Any]:
    """Analyzes question completion speeds, identifying bottlenecks and pacing efficiency."""
    q_answers = record.get("question_answers")
    if isinstance(q_answers, str):
        try:
            q_answers = json.loads(q_answers)
        except Exception:
            q_answers = []

    if not isinstance(q_answers, list) or not q_answers:
        return {
            "total_time_seconds": 0,
            "avg_time_per_question_sec": 0.0,
            "fastest_question": None,
            "slowest_question": None,
            "pacing_efficiency": "Standard"
        }

    times = []
    fastest = None
    slowest = None

    for qa in q_answers:
        t = int(qa.get("time_spent") or 0)
        q_id = qa.get("question_id") or qa.get("id") or "unknown"
        topic = qa.get("topic") or "General"
        is_corr = bool(qa.get("is_correct"))

        item = {"question_id": q_id, "topic": topic, "time_spent_seconds": t, "is_correct": is_corr}
        times.append(t)

        if t > 0:
            if fastest is None or t < fastest["time_spent_seconds"]:
                fastest = item
            if slowest is None or t > slowest["time_spent_seconds"]:
                slowest = item

    total_time = sum(times)
    total_q = len(q_answers)
    avg_time = round(total_time / float(total_q), 1) if total_q > 0 else 0.0

    pct = float(record.get("percentage") or 0.0)
    if avg_time > 0 and avg_time < 35 and pct >= 70:
        efficiency = "Fast & Accurate"
    elif avg_time > 90 and pct < 50:
        efficiency = "Struggling / Bottlenecked"
    elif avg_time < 20 and pct < 40:
        efficiency = "Rushed (High Guess Rate)"
    else:
        efficiency = "Balanced Pacing"

    return {
        "total_time_seconds": total_time,
        "avg_time_per_question_sec": avg_time,
        "fastest_question": fastest,
        "slowest_question": slowest,
        "pacing_efficiency": efficiency
    }


def _fetch_student_rank_from_view(roll_number: str) -> Optional[dict]:
    """Queries Neon DB's v_student_placement_analytics view for real-time rank and percentile."""
    db_url = settings.DATABASE_URL
    if not db_url:
        return None
    try:
        import psycopg2
        from psycopg2.extras import RealDictCursor
        conn = psycopg2.connect(db_url)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(
            """
            SELECT branch_rank, overall_rank, overall_percentile, placement_tier
            FROM v_student_placement_analytics
            WHERE UPPER(TRIM(roll_number)) = %s
            ORDER BY submitted_at DESC LIMIT 1;
            """,
            (roll_number.strip().upper(),)
        )
        row = cur.fetchone()
        conn.close()
        if row:
            return {
                "branch_rank": row.get("branch_rank"),
                "overall_rank": row.get("overall_rank"),
                "overall_percentile": float(row.get("overall_percentile") or 0.0)
            }
    except Exception as e:
        logger.debug("[CDC_INTEGRATION] Analytics view lookup note: %s", e)
    return None


def _extract_section_breakdown(record: dict) -> dict:
    """Extract or calculate section scores (Aptitude, Verbal, Computer Fundamentals, Coding)."""
    q_answers = record.get("question_answers")
    if isinstance(q_answers, str):
        try:
            q_answers = json.loads(q_answers)
        except Exception:
            q_answers = []

    sections = {
        "Aptitude": {"questions": 0, "correct": 0, "marks": 0.0, "percentage": 0.0},
        "Verbal": {"questions": 0, "correct": 0, "marks": 0.0, "percentage": 0.0},
        "Computer_Fundamentals": {"questions": 0, "correct": 0, "marks": 0.0, "percentage": 0.0},
        "Coding": {"questions": 0, "correct": 0, "marks": 0.0, "percentage": 0.0}
    }

    if isinstance(q_answers, list) and q_answers:
        for qa in q_answers:
            sec = qa.get("category", "General")
            if sec not in sections:
                sections[sec] = {"questions": 0, "correct": 0, "marks": 0.0, "percentage": 0.0}
            sections[sec]["questions"] += 1
            if qa.get("is_correct"):
                sections[sec]["correct"] += 1
                sections[sec]["marks"] += float(qa.get("marks_awarded", 1.0))

        for sec, val in sections.items():
            if val["questions"] > 0:
                val["percentage"] = round((val["marks"] / float(val["questions"])) * 100.0, 1)

    return sections


@cdc_router.get("/student/{roll_number}")
def get_student_cdc_marks(roll_number: str):
    """
    Primary API Endpoint for CDC HITAM (https://cdc-hitam.onrender.com/).
    Returns student test score, percentage, track, placement tier, topic mastery,
    institutional ranks, and pacing telemetry.
    """
    clean_roll = roll_number.strip().upper()
    sub = _fetch_submission_from_sources(clean_roll)

    if not sub:
        return {
            "status": "not_found",
            "found": False,
            "roll_number": clean_roll,
            "message": f"No assessment submission recorded for roll number {clean_roll}."
        }

    sections = _extract_section_breakdown(sub)
    total_marks = float(sub.get("total_marks", 0.0))
    max_marks = float(sub.get("max_marks", 20.0))
    pct = float(sub.get("percentage", 0.0))
    violations = int(sub.get("violations_count", 0))
    status = sub.get("status", "completed")

    # Automated Placement Tier Classification
    tier_info = determine_placement_tier(pct, violations, status)

    # Automated Topic Mastery Breakdown
    topic_mastery = calculate_topic_mastery(sub)

    # Difficulty and Pacing Telemetry
    diff_breakdown = calculate_difficulty_breakdown(sub)
    pacing_data = calculate_pacing_telemetry(sub)

    # Institutional Ranking from Neon DB SQL View
    ranking_data = _fetch_student_rank_from_view(clean_roll)

    return {
        "status": "success",
        "found": True,
        "student": {
            "roll_number": clean_roll,
            "student_name": sub.get("student_name") or "Candidate",
            "branch": sub.get("branch") or "CSE",
            "role": sub.get("role") or "Mobile App Developer Intern",
            "total_marks": round(total_marks, 2),
            "max_marks": round(max_marks, 2),
            "percentage": round(pct, 2),
            "status": status,
            "placement_tier": tier_info,
            "institutional_ranking": ranking_data,
            "topic_mastery": topic_mastery,
            "difficulty_breakdown": diff_breakdown,
            "pacing_telemetry": pacing_data,
            "proctoring": {
                "violations_count": violations,
                "is_flagged": violations >= 3 or status == "disqualified",
                "clearance": "PASSED" if violations < 3 and status != "disqualified" else "FLAGGED_FOR_REVIEW"
            },
            "sections": sections,
            "submitted_at": str(sub.get("submitted_at") or datetime.now(timezone.utc).isoformat()),
            "verified": True,
            "portal": "Learniverse AI Placement Assessment Engine",
            "source_site": "https://cdc-hitam.onrender.com"
        }
    }


@cdc_router.get("/student/{roll_number}/analytics")
def get_student_cdc_analytics(roll_number: str):
    """
    Dedicated in-depth Analytics Dossier Endpoint for CDC Placement Officers.
    Provides topic mastery, difficulty breakdown, pacing efficiency, and interview recommendations.
    """
    clean_roll = roll_number.strip().upper()
    sub = _fetch_submission_from_sources(clean_roll)

    if not sub:
        raise HTTPException(status_code=404, detail=f"No submission found for roll number {clean_roll}")

    pct = float(sub.get("percentage", 0.0))
    violations = int(sub.get("violations_count", 0))
    status = sub.get("status", "completed")

    tier_info = determine_placement_tier(pct, violations, status)
    topic_mastery = calculate_topic_mastery(sub)
    diff_breakdown = calculate_difficulty_breakdown(sub)
    pacing_data = calculate_pacing_telemetry(sub)
    ranking_data = _fetch_student_rank_from_view(clean_roll)

    return {
        "status": "success",
        "roll_number": clean_roll,
        "student_name": sub.get("student_name") or "Candidate",
        "branch": sub.get("branch") or "CSE",
        "track": sub.get("role") or "Mobile App Developer Intern",
        "percentage": round(pct, 2),
        "placement_tier": tier_info,
        "institutional_ranking": ranking_data,
        "topic_mastery": topic_mastery,
        "difficulty_breakdown": diff_breakdown,
        "pacing_telemetry": pacing_data,
        "generated_at": datetime.now(timezone.utc).isoformat()
    }


@cdc_router.get("/all-results")
def get_all_cdc_results(
    branch: Optional[str] = Query(None, description="Filter by candidate branch (e.g., CSE, ECE, CSM)"),
    role: Optional[str] = Query(None, description="Filter by assigned career track / role"),
    tier: Optional[str] = Query(None, description="Filter by placement tier (e.g. Tier-1, Tier-2, Remedial)"),
    status: Optional[str] = Query(None, description="Filter by status ('completed', 'disqualified')"),
    min_percentage: Optional[float] = Query(None, description="Filter candidates with percentage >= value")
):
    """
    Bulk API Endpoint for CDC HITAM Admin Dashboard & Analytics.
    Returns all student assessment submissions with optional filtering.
    """
    all_subs = _fetch_all_submissions_from_sources()
    filtered = []

    for s in all_subs:
        if branch and str(s.get("branch", "")).upper() != branch.strip().upper():
            continue
        if role and role.strip().lower() not in str(s.get("role", "")).lower():
            continue
        if status and str(s.get("status", "")).lower() != status.strip().lower():
            continue
        pct = float(s.get("percentage", 0.0))
        if min_percentage is not None and pct < min_percentage:
            continue

        violations = int(s.get("violations_count", 0))
        sub_status = s.get("status", "completed")
        tier_data = determine_placement_tier(pct, violations, sub_status)

        if tier and tier.strip().lower() not in tier_data["tier"].lower():
            continue

        # Topic mastery summary
        mastery = calculate_topic_mastery(s)
        pacing = calculate_pacing_telemetry(s)

        filtered.append({
            "session_id": str(s.get("session_id") or s.get("id") or ""),
            "roll_number": str(s.get("roll_number", "")).strip().upper(),
            "student_name": s.get("student_name") or "Candidate",
            "branch": s.get("branch") or "CSE",
            "role": s.get("role") or "Mobile App Developer Intern",
            "total_marks": float(s.get("total_marks", 0.0)),
            "max_marks": float(s.get("max_marks", 20.0)),
            "percentage": pct,
            "attempted": int(s.get("attempted", 0)),
            "correct_count": int(s.get("correct_count", 0)),
            "wrong_count": int(s.get("wrong_count", 0)),
            "unanswered_count": int(s.get("unanswered_count", 0)),
            "violations_count": violations,
            "status": sub_status,
            "placement_tier": tier_data["tier"],
            "tier_band": tier_data["band"],
            "strongest_topic": mastery["strongest_topics"][0] if mastery["strongest_topics"] else "General",
            "weakest_topic": mastery["weakest_topics"][0] if mastery["weakest_topics"] else "None",
            "pacing_efficiency": pacing["pacing_efficiency"],
            "submitted_at": str(s.get("submitted_at") or "")
        })

    return {
        "status": "success",
        "total_count": len(filtered),
        "results": filtered,
        "synced_at": datetime.now(timezone.utc).isoformat()
    }


def dispatch_to_cdc_hitam_sync(sub_record: dict):
    """
    Synchronous / Worker helper: pushes student marks, topic mastery, and placement tier
    to CDC HITAM webhook or tracks backend.
    Called via FastAPI BackgroundTasks to never block or delay candidate submission response.
    """
    webhook_url = settings.CDC_HITAM_WEBHOOK_URL or f"{settings.CDC_TRACKS_BACKEND_URL.rstrip('/')}/api/student/assessment-marks"
    if not webhook_url:
        logger.info("[CDC SYNC] No CDC_HITAM_WEBHOOK_URL configured; skipping background push.")
        return

    clean_roll = str(sub_record.get("roll_number", "")).strip().upper()
    pct = float(sub_record.get("percentage", 0.0))
    violations = int(sub_record.get("violations_count", 0))
    status = sub_record.get("status", "completed")

    tier_info = determine_placement_tier(pct, violations, status)
    topic_mastery = calculate_topic_mastery(sub_record)
    diff_breakdown = calculate_difficulty_breakdown(sub_record)
    pacing_data = calculate_pacing_telemetry(sub_record)

    payload = {
        "roll_number": clean_roll,
        "student_name": sub_record.get("student_name") or "Candidate",
        "branch": sub_record.get("branch") or "CSE",
        "role": sub_record.get("role") or "Mobile App Developer Intern",
        "total_marks": float(sub_record.get("total_marks", 0.0)),
        "max_marks": float(sub_record.get("max_marks", 20.0)),
        "percentage": pct,
        "placement_tier": tier_info,
        "topic_mastery": topic_mastery,
        "difficulty_breakdown": diff_breakdown,
        "pacing_telemetry": pacing_data,
        "sections": _extract_section_breakdown(sub_record),
        "violations_count": violations,
        "status": status,
        "assessment_name": "Fixly Placement Assessment",
        "source": "Learniverse AI",
        "submitted_at": str(sub_record.get("submitted_at") or datetime.now(timezone.utc).isoformat())
    }

    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Learniverse-CDC-Sync/1.0"
    }
    if settings.CDC_API_SECRET_KEY:
        headers["X-CDC-Secret-Key"] = settings.CDC_API_SECRET_KEY

    try:
        resp = requests.post(webhook_url, json=payload, headers=headers, timeout=5)
        logger.info(
            "[CDC SYNC] Dispatched marks & tier for %s to %s | Status: %s | Tier: %s", 
            clean_roll, webhook_url, resp.status_code, tier_info["tier"]
        )
    except Exception as e:
        logger.warning("[CDC SYNC] Background push to CDC HITAM failed for %s: %s", clean_roll, e)


@cdc_router.post("/sync/{roll_number}")
def trigger_manual_cdc_sync(roll_number: str, background_tasks: BackgroundTasks):
    """Admin endpoint to manually trigger a sync for a student's marks to CDC HITAM."""
    clean_roll = roll_number.strip().upper()
    sub = _fetch_submission_from_sources(clean_roll)
    if not sub:
        raise HTTPException(status_code=404, detail=f"No submission found for {clean_roll}")

    background_tasks.add_task(dispatch_to_cdc_hitam_sync, sub)
    return {
        "status": "queued",
        "message": f"CDC HITAM sync queued for {clean_roll}",
        "roll_number": clean_roll
    }


def save_to_bulk_test_table(sub_record: dict, test_date: Optional[str] = None, batch_id: Optional[str] = None) -> bool:
    """
    Saves student exam submission into the separate 'bulk_test_submissions' table in Neon DB.
    Records the explicit test date, placement tier, topic mastery, and telemetry.
    """
    pct = float(sub_record.get("percentage") or 0.0)
    v_count = int(sub_record.get("violations_count") or 0)
    status = sub_record.get("status") or "completed"

    tier_info = determine_placement_tier(pct, v_count, status)
    mastery = calculate_topic_mastery(sub_record)
    diff = calculate_difficulty_breakdown(sub_record)
    pacing = calculate_pacing_telemetry(sub_record)
    sections = _extract_section_breakdown(sub_record)

    strongest = mastery["strongest_topics"][0] if mastery.get("strongest_topics") else "General"
    weakest = mastery["weakest_topics"][0] if mastery.get("weakest_topics") else "None"

    # Resolve test date (YYYY-MM-DD)
    if not test_date:
        sub_at = sub_record.get("submitted_at")
        if isinstance(sub_at, str) and len(sub_at) >= 10:
            test_date = sub_at[:10]
        elif hasattr(sub_at, "strftime"):
            test_date = sub_at.strftime("%Y-%m-%d")
        else:
            test_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    resolved_batch = batch_id or sub_record.get("batch_id") or f"DRIVE_{test_date}"

    # 1. Save to Neon PostgreSQL
    db_url = settings.DATABASE_URL
    if db_url:
        try:
            import psycopg2
            conn = psycopg2.connect(db_url)
            cur = conn.cursor()
            cur.execute(
                """
                INSERT INTO bulk_test_submissions (
                    test_date, batch_id, session_id, roll_number, student_name,
                    branch, role, total_marks, max_marks, percentage,
                    placement_tier, tier_band, strongest_topic, weakest_topic,
                    total_questions, attempted, correct_count, wrong_count, unanswered_count,
                    violations_count, status, sections, topic_mastery, difficulty_breakdown,
                    pacing_telemetry, question_answers, submitted_at
                ) VALUES (
                    %s::date, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s,
                    %s, %s, %s, %s,
                    %s, %s, %s, %s, %s,
                    %s, %s, %s::jsonb, %s::jsonb, %s::jsonb,
                    %s::jsonb, %s::jsonb, COALESCE(%s::timestamptz, CURRENT_TIMESTAMP)
                );
                """,
                (
                    test_date,
                    resolved_batch,
                    str(sub_record.get("session_id") or ""),
                    str(sub_record.get("roll_number") or "").strip().upper(),
                    str(sub_record.get("student_name") or "Candidate"),
                    str(sub_record.get("branch") or "CSE"),
                    str(sub_record.get("role") or "Mobile App Developer Intern"),
                    float(sub_record.get("total_marks") or 0.0),
                    float(sub_record.get("max_marks") or 20.0),
                    pct,
                    tier_info["tier"],
                    tier_info["band"],
                    strongest,
                    weakest,
                    int(sub_record.get("total_questions") or 20),
                    int(sub_record.get("attempted") or 0),
                    int(sub_record.get("correct_count") or 0),
                    int(sub_record.get("wrong_count") or 0),
                    int(sub_record.get("unanswered_count") or 0),
                    v_count,
                    status,
                    json.dumps(sections),
                    json.dumps(mastery),
                    json.dumps(diff),
                    json.dumps(pacing),
                    json.dumps(sub_record.get("question_answers") or []),
                    str(sub_record.get("submitted_at") or "") if sub_record.get("submitted_at") else None
                )
            )
            conn.commit()
            conn.close()
            logger.info("[BULK TEST TABLE] Saved test for %s on date %s to Neon DB", sub_record.get("roll_number"), test_date)
            return True
        except Exception as e:
            logger.warning("[BULK TEST TABLE] Neon DB insert error: %s", e)

    # 2. Local SQLite fallback
    if os.path.exists(SQLITE_DB_PATH):
        try:
            conn = sqlite3.connect(SQLITE_DB_PATH)
            cur = conn.cursor()
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS bulk_test_submissions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    test_date TEXT,
                    batch_id TEXT,
                    session_id TEXT,
                    roll_number TEXT,
                    student_name TEXT,
                    branch TEXT,
                    role TEXT,
                    total_marks REAL,
                    max_marks REAL,
                    percentage REAL,
                    placement_tier TEXT,
                    tier_band TEXT,
                    strongest_topic TEXT,
                    weakest_topic TEXT,
                    total_questions INTEGER,
                    attempted INTEGER,
                    correct_count INTEGER,
                    wrong_count INTEGER,
                    unanswered_count INTEGER,
                    violations_count INTEGER,
                    status TEXT,
                    sections TEXT,
                    topic_mastery TEXT,
                    difficulty_breakdown TEXT,
                    pacing_telemetry TEXT,
                    question_answers TEXT,
                    submitted_at TEXT,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                );
                """
            )
            cur.execute(
                """
                INSERT INTO bulk_test_submissions (
                    test_date, batch_id, session_id, roll_number, student_name,
                    branch, role, total_marks, max_marks, percentage,
                    placement_tier, tier_band, strongest_topic, weakest_topic,
                    total_questions, attempted, correct_count, wrong_count, unanswered_count,
                    violations_count, status, sections, topic_mastery, difficulty_breakdown,
                    pacing_telemetry, question_answers, submitted_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                """,
                (
                    test_date,
                    resolved_batch,
                    str(sub_record.get("session_id") or ""),
                    str(sub_record.get("roll_number") or "").strip().upper(),
                    str(sub_record.get("student_name") or "Candidate"),
                    str(sub_record.get("branch") or "CSE"),
                    str(sub_record.get("role") or "Mobile App Developer Intern"),
                    float(sub_record.get("total_marks") or 0.0),
                    float(sub_record.get("max_marks") or 20.0),
                    pct,
                    tier_info["tier"],
                    tier_info["band"],
                    strongest,
                    weakest,
                    int(sub_record.get("total_questions") or 20),
                    int(sub_record.get("attempted") or 0),
                    int(sub_record.get("correct_count") or 0),
                    int(sub_record.get("wrong_count") or 0),
                    int(sub_record.get("unanswered_count") or 0),
                    v_count,
                    status,
                    json.dumps(sections),
                    json.dumps(mastery),
                    json.dumps(diff),
                    json.dumps(pacing),
                    json.dumps(sub_record.get("question_answers") or []),
                    str(sub_record.get("submitted_at") or "")
                )
            )
            conn.commit()
            conn.close()
            return True
        except Exception as e:
            logger.warning("[BULK TEST TABLE] SQLite fallback error: %s", e)

    return False


class BulkTestSubmitRequest(BaseModel):
    batch_id: Optional[str] = "CAMPUS_PLACEMENT_DRIVE"
    test_date: Optional[str] = None
    submissions: List[Dict[str, Any]]


@cdc_router.post("/bulk-submit")
def submit_bulk_tests_endpoint(req: BulkTestSubmitRequest, background_tasks: BackgroundTasks):
    """
    Bulk submission endpoint for batch drives and exam batches.
    Saves every candidate submission with an explicit test_date into 'bulk_test_submissions'.
    """
    test_date = req.test_date or datetime.now(timezone.utc).strftime("%Y-%m-%d")
    batch_id = req.batch_id or f"DRIVE_{test_date}"

    saved_count = 0
    tier_summary = {"Tier-1": 0, "Tier-2": 0, "Remedial": 0, "Flagged": 0}

    for sub in req.submissions:
        sub["test_date"] = test_date
        sub["batch_id"] = batch_id
        if "submitted_at" not in sub:
            sub["submitted_at"] = datetime.now(timezone.utc).isoformat()

        success = save_to_bulk_test_table(sub, test_date=test_date, batch_id=batch_id)
        if success:
            saved_count += 1
            pct = float(sub.get("percentage") or 0.0)
            if pct >= 75:
                tier_summary["Tier-1"] += 1
            elif pct >= 50:
                tier_summary["Tier-2"] += 1
            else:
                tier_summary["Remedial"] += 1

        # Queue CDC HITAM real-time sync for each student
        background_tasks.add_task(dispatch_to_cdc_hitam_sync, sub)

    return {
        "status": "success",
        "saved_count": saved_count,
        "total_requested": len(req.submissions),
        "test_date": test_date,
        "batch_id": batch_id,
        "tier_distribution": tier_summary,
        "message": f"Successfully recorded {saved_count} tests in bulk_test_submissions for date {test_date}."
    }


@cdc_router.get("/bulk-tests")
def get_bulk_tests(
    date: Optional[str] = Query(None, description="Filter by test date (YYYY-MM-DD)"),
    from_date: Optional[str] = Query(None, description="Filter from date (YYYY-MM-DD)"),
    to_date: Optional[str] = Query(None, description="Filter to date (YYYY-MM-DD)"),
    batch_id: Optional[str] = Query(None, description="Filter by batch identifier"),
    branch: Optional[str] = Query(None, description="Filter by candidate branch"),
    tier: Optional[str] = Query(None, description="Filter by placement tier"),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0)
):
    """
    Queries the separate 'bulk_test_submissions' table by date, batch, branch, and tier.
    Used by CDC HITAM dashboards to inspect past and current placement drives by date.
    """
    db_url = settings.DATABASE_URL
    results = []
    total_count = 0

    if db_url:
        try:
            import psycopg2
            from psycopg2.extras import RealDictCursor
            conn = psycopg2.connect(db_url)
            cur = conn.cursor(cursor_factory=RealDictCursor)

            query = "SELECT * FROM bulk_test_submissions WHERE 1=1"
            count_query = "SELECT COUNT(*) FROM bulk_test_submissions WHERE 1=1"
            params = []

            if date:
                query += " AND test_date = %s::date"
                count_query += " AND test_date = %s::date"
                params.append(date.strip())
            if from_date:
                query += " AND test_date >= %s::date"
                count_query += " AND test_date >= %s::date"
                params.append(from_date.strip())
            if to_date:
                query += " AND test_date <= %s::date"
                count_query += " AND test_date <= %s::date"
                params.append(to_date.strip())
            if batch_id:
                query += " AND batch_id ILIKE %s"
                count_query += " AND batch_id ILIKE %s"
                params.append(f"%{batch_id.strip()}%")
            if branch:
                query += " AND UPPER(branch) = UPPER(%s)"
                count_query += " AND UPPER(branch) = UPPER(%s)"
                params.append(branch.strip())
            if tier:
                query += " AND placement_tier ILIKE %s"
                count_query += " AND placement_tier ILIKE %s"
                params.append(f"%{tier.strip()}%")

            cur.execute(count_query, tuple(params))
            total_count = cur.fetchone()["count"]

            query += " ORDER BY submitted_at DESC LIMIT %s OFFSET %s;"
            params.extend([limit, offset])

            cur.execute(query, tuple(params))
            rows = cur.fetchall() or []
            conn.close()

            for r in rows:
                item = dict(r)
                item["test_date"] = str(item.get("test_date") or "")
                item["submitted_at"] = str(item.get("submitted_at") or "")
                item["created_at"] = str(item.get("created_at") or "")
                results.append(item)

            return {
                "status": "success",
                "table": "bulk_test_submissions",
                "total_count": total_count,
                "returned_count": len(results),
                "filters": {
                    "date": date,
                    "from_date": from_date,
                    "to_date": to_date,
                    "batch_id": batch_id,
                    "branch": branch,
                    "tier": tier
                },
                "results": results
            }
        except Exception as e:
            logger.warning("[BULK TESTS QUERY ERROR] %s", e)

    # SQLite fallback
    if os.path.exists(SQLITE_DB_PATH):
        try:
            conn = sqlite3.connect(SQLITE_DB_PATH)
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute("SELECT * FROM bulk_test_submissions ORDER BY id DESC LIMIT ? OFFSET ?;", (limit, offset))
            results = [dict(r) for r in cur.fetchall()]
            conn.close()
            return {
                "status": "success",
                "table": "bulk_test_submissions (sqlite_fallback)",
                "total_count": len(results),
                "returned_count": len(results),
                "results": results
            }
        except Exception as e:
            logger.warning("[BULK TESTS SQLITE QUERY ERROR] %s", e)

    return {
        "status": "success",
        "table": "bulk_test_submissions",
        "total_count": 0,
        "returned_count": 0,
        "results": []
    }


@cdc_router.get("/bulk-tests/summary")
def get_bulk_tests_daily_summary(
    date: Optional[str] = Query(None, description="Filter summary by test date (YYYY-MM-DD)")
):
    """
    Returns aggregated daily test performance metrics from the 'v_daily_bulk_test_summary' view.
    """
    db_url = settings.DATABASE_URL
    if db_url:
        try:
            import psycopg2
            from psycopg2.extras import RealDictCursor
            conn = psycopg2.connect(db_url)
            cur = conn.cursor(cursor_factory=RealDictCursor)

            query = "SELECT * FROM v_daily_bulk_test_summary WHERE 1=1"
            params = []
            if date:
                query += " AND test_date = %s::date"
                params.append(date.strip())
            query += " ORDER BY test_date DESC, branch ASC;"

            cur.execute(query, tuple(params) if params else None)
            rows = cur.fetchall() or []
            conn.close()

            formatted = []
            for r in rows:
                item = dict(r)
                item["test_date"] = str(item.get("test_date") or "")
                item["first_submission_at"] = str(item.get("first_submission_at") or "")
                item["last_submission_at"] = str(item.get("last_submission_at") or "")
                formatted.append(item)

            return {
                "status": "success",
                "view": "v_daily_bulk_test_summary",
                "summary": formatted,
                "queried_at": datetime.now(timezone.utc).isoformat()
            }
        except Exception as e:
            logger.warning("[BULK SUMMARY VIEW ERROR] %s", e)

    return {
        "status": "not_available",
        "summary": [],
        "message": "Database view unavailable."
    }
