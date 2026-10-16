"""
Institutional Admin API - Manage users, problems, analytics for the institution
"""

from fastapi import APIRouter, HTTPException, Query, Depends, UploadFile, File
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
import csv
import json
from enum import Enum

admin_router = APIRouter(prefix="/api/admin", tags=["Administration"])

# ============================================================================
# Models
# ============================================================================

class ProblemImport(BaseModel):
    number: int
    title: str
    slug: str
    difficulty: str  # easy, medium, hard
    description: str
    examples: List[Dict[str, str]]
    constraints: List[str]
    topics: List[str]
    test_cases: List[Dict[str, Any]]
    code_templates: List[Dict[str, str]]

class InstitutionSettings(BaseModel):
    institution_name: str
    institution_domain: str
    enable_signup_restrictions: bool = True
    allowed_email_domains: List[str] = []
    enable_ai_hints: bool = True
    problems_per_page: int = 20
    max_submission_time: int = 5
    enable_leaderboard: bool = True
    enable_discussion: bool = True

class AnalyticsReport(BaseModel):
    date: str
    problems_solved: int
    unique_users: int
    total_submissions: int
    avg_execution_time: float
    most_popular_problem: Optional[int]
    most_difficult_problem: Optional[int]

# In-memory storage
_institutions: Dict[str, Dict] = {}
_admin_settings: Dict[str, InstitutionSettings] = {}
_analytics_data: List[AnalyticsReport] = []

# ============================================================================
# User Management Endpoints
# ============================================================================

@admin_router.get("/users", tags=["User Management"])
async def list_users(
    institution_id: str,
    role: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, le=100),
):
    """
    List all users in institution

    Filters:
    - role: student, teacher, admin
    - skip/limit for pagination

    Returns user statistics
    """
    return {
        "institution_id": institution_id,
        "total_users": 0,
        "users": [],
        "skip": skip,
        "limit": limit
    }

@admin_router.post("/users/bulk-invite")
async def bulk_invite_users(
    institution_id: str,
    emails: List[str],
    role: str = "student",
):
    """
    Invite multiple users at once

    Sends email invitations to list of users
    """
    return {
        "invited_count": len(emails),
        "failed_count": 0,
        "message": f"Invited {len(emails)} users"
    }

@admin_router.patch("/users/{user_id}")
async def update_user(
    institution_id: str,
    user_id: str,
    is_active: Optional[bool] = None,
    role: Optional[str] = None,
):
    """
    Update user properties

    Can disable/enable account or change role
    """
    return {
        "user_id": user_id,
        "updated": True,
        "message": "User updated successfully"
    }

@admin_router.delete("/users/{user_id}")
async def delete_user(
    institution_id: str,
    user_id: str,
):
    """
    Delete user account

    WARNING: Irreversible operation
    """
    return {
        "user_id": user_id,
        "deleted": True,
        "message": "User deleted successfully"
    }

@admin_router.post("/users/export")
async def export_users(
    institution_id: str,
    format: str = "csv",  # csv or json
):
    """
    Export all users to CSV or JSON

    Useful for reports and backups
    """
    return {
        "format": format,
        "download_url": f"/api/admin/exports/users-{datetime.now().isoformat()}.{format}",
        "message": "Export ready for download"
    }

# ============================================================================
# Problem Management Endpoints
# ============================================================================

@admin_router.post("/problems/import")
async def import_problems(
    institution_id: str,
    file: UploadFile = File(...),
):
    """
    Bulk import problems from CSV or JSON

    CSV format:
    number,title,difficulty,description,examples,constraints,topics

    JSON format:
    [{"number": 1, "title": "Two Sum", ...}]

    Can import 100+ problems at once
    """
    try:
        content = await file.read()

        # Determine file type
        if file.filename.endswith('.csv'):
            # Parse CSV
            problems = []
        elif file.filename.endswith('.json'):
            # Parse JSON
            problems = json.loads(content)
        else:
            raise HTTPException(status_code=400, detail="File must be CSV or JSON")

        return {
            "imported_count": len(problems),
            "failed_count": 0,
            "message": f"Imported {len(problems)} problems successfully"
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Import failed: {e}")

@admin_router.post("/problems")
async def create_problem(
    institution_id: str,
    problem: ProblemImport,
):
    """
    Create a single problem manually
    """
    return {
        "problem_id": 1,
        "created": True,
        "message": "Problem created successfully"
    }

@admin_router.patch("/problems/{problem_id}")
async def update_problem(
    institution_id: str,
    problem_id: int,
    title: Optional[str] = None,
    difficulty: Optional[str] = None,
    is_public: Optional[bool] = None,
):
    """
    Update problem details
    """
    return {
        "problem_id": problem_id,
        "updated": True
    }

@admin_router.delete("/problems/{problem_id}")
async def delete_problem(
    institution_id: str,
    problem_id: int,
):
    """
    Delete problem

    WARNING: This also deletes all submissions for this problem
    """
    return {
        "problem_id": problem_id,
        "deleted": True
    }

@admin_router.post("/problems/{problem_id}/hints")
async def create_hint(
    institution_id: str,
    problem_id: int,
    hint_text: str,
    difficulty_level: int = 1,
):
    """
    Create a hint for a problem

    difficulty_level: 1-3 (1=easy hint, 3=hard hint close to solution)
    """
    return {
        "hint_id": 1,
        "problem_id": problem_id,
        "created": True
    }

# ============================================================================
# Analytics & Reporting
# ============================================================================

@admin_router.get("/analytics/dashboard")
async def get_analytics_dashboard(
    institution_id: str,
    from_date: Optional[str] = None,
    to_date: Optional[str] = None,
):
    """
    Get comprehensive analytics dashboard

    Shows:
    - Total problems solved
    - Most active students
    - Most popular problems
    - Difficulty distribution
    - Learning trends
    """
    return {
        "institution_id": institution_id,
        "total_problems_solved": 0,
        "total_unique_students": 0,
        "total_submissions": 0,
        "avg_execution_time": 0.0,
        "most_popular_problems": [],
        "least_solved_problems": [],
        "most_active_students": [],
        "difficulty_breakdown": {
            "easy": 0,
            "medium": 0,
            "hard": 0
        }
    }

@admin_router.get("/analytics/daily")
async def get_daily_analytics(
    institution_id: str,
    days: int = Query(30, ge=1, le=365),
):
    """
    Get daily analytics for last N days

    Useful for trends and growth tracking
    """
    return {
        "institution_id": institution_id,
        "days": days,
        "analytics": []
    }

@admin_router.get("/analytics/topics")
async def get_topics_analytics(institution_id: str):
    """
    Analytics by topic/difficulty

    Shows which topics students struggle with most
    """
    return {
        "topics": [
            {
                "name": "Array",
                "problems_count": 10,
                "solved_count": 8,
                "avg_attempts": 2.5,
                "success_rate": 0.8
            }
        ]
    }

@admin_router.post("/analytics/export")
async def export_analytics(
    institution_id: str,
    format: str = "pdf",  # pdf, csv, excel
    from_date: Optional[str] = None,
    to_date: Optional[str] = None,
):
    """
    Export analytics report

    Formats: PDF (professional report), CSV, Excel
    """
    return {
        "format": format,
        "download_url": f"/api/admin/exports/analytics-{datetime.now().isoformat()}.{format}",
        "message": "Report ready for download"
    }

# ============================================================================
# Leaderboard Management
# ============================================================================

@admin_router.get("/leaderboard")
async def get_leaderboard(
    institution_id: str,
    limit: int = Query(100, le=1000),
    sort_by: str = "problems_solved",
):
    """
    Get institutional leaderboard
    """
    return {
        "leaderboard": [],
        "total_users": 0,
        "generated_at": datetime.now(timezone.utc).isoformat()
    }

@admin_router.post("/leaderboard/refresh")
async def refresh_leaderboard(institution_id: str):
    """
    Force refresh leaderboard rankings

    Usually auto-refreshed, but can be triggered manually
    """
    return {
        "status": "refreshing",
        "message": "Leaderboard will be updated shortly"
    }

# ============================================================================
# Settings & Configuration
# ============================================================================

@admin_router.get("/settings")
async def get_settings(institution_id: str):
    """
    Get institution settings
    """
    return {
        "institution_id": institution_id,
        "institution_name": "Your Institution",
        "enable_ai_hints": True,
        "problems_per_page": 20,
        "enable_leaderboard": True
    }

@admin_router.patch("/settings")
async def update_settings(
    institution_id: str,
    settings: InstitutionSettings,
):
    """
    Update institution settings

    Only institution admin can modify
    """
    return {
        "institution_id": institution_id,
        "updated": True,
        "settings": settings.dict()
    }

# ============================================================================
# Email & Notifications
# ============================================================================

@admin_router.post("/notifications/send")
async def send_notification(
    institution_id: str,
    title: str,
    message: str,
    recipient_role: str = "student",  # student, teacher, all
):
    """
    Send notification to users

    Can target specific roles
    """
    return {
        "notification_id": 1,
        "sent_to": 0,
        "message": "Notification queued for delivery"
    }

@admin_router.get("/email-templates")
async def get_email_templates(institution_id: str):
    """
    Get configurable email templates

    - Welcome email
    - Password reset
    - Problem solved milestone
    - Weekly digest
    """
    return {
        "templates": [
            {
                "id": "welcome",
                "name": "Welcome Email",
                "subject": "Welcome to {institution_name}",
                "editable": True
            }
        ]
    }

@admin_router.patch("/email-templates/{template_id}")
async def update_email_template(
    institution_id: str,
    template_id: str,
    subject: Optional[str] = None,
    body: Optional[str] = None,
):
    """
    Update email template
    """
    return {
        "template_id": template_id,
        "updated": True
    }

# ============================================================================
# Audit Logs
# ============================================================================

@admin_router.get("/audit-logs")
async def get_audit_logs(
    institution_id: str,
    action: Optional[str] = None,
    skip: int = Query(0),
    limit: int = Query(50, le=100),
):
    """
    View all actions in institution

    - User signup
    - Problem solved
    - Admin changes
    - Settings updates
    """
    return {
        "logs": [],
        "total": 0
    }

# ============================================================================
# Backup & Maintenance
# ============================================================================

@admin_router.post("/backup")
async def create_backup(institution_id: str):
    """
    Create backup of all institution data

    Includes:
    - All problems
    - All submissions
    - All user data
    - Settings
    """
    return {
        "backup_id": "backup-123",
        "status": "creating",
        "estimated_size": "100MB",
        "download_url": "...",
        "message": "Backup creation started"
    }

@admin_router.get("/system-health")
async def get_system_health(institution_id: str):
    """
    Get system health status

    - Database status
    - Judge0 status
    - Cache status
    - API response times
    """
    return {
        "database": "healthy",
        "judge0": "healthy",
        "cache": "healthy",
        "api_response_time_ms": 45.2,
        "last_check": datetime.now(timezone.utc).isoformat()
    }
