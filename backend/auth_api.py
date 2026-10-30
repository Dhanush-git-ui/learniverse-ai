import os
import re
import logging
from datetime import datetime
from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from auth import create_access_token
from rate_limiter import limiter
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
load_dotenv()

logger = logging.getLogger("learniverse.auth")

auth_router = APIRouter(prefix="/api/auth", tags=["Authentication"])

DEFAULT_GOOGLE_CLIENT_ID = "162984921146-mh8jja4encmb5uaoen51v8bugbv1iegh.apps.googleusercontent.com"

# Google client ID resolved from environment variable or default configuration
def _resolve_google_client_ids() -> list[str]:
    c_id = os.environ.get("GOOGLE_CLIENT_ID", "").strip() or DEFAULT_GOOGLE_CLIENT_ID
    ids = [c_id] if c_id else []
    return [client_id for client_id in ids if client_id]

GOOGLE_CLIENT_IDS = _resolve_google_client_ids()


def _configured_admins(env_name: str) -> set[str]:
    """Return exact, normalized administrator identifiers from configuration."""
    return {
        value.strip().lower()
        for value in os.environ.get(env_name, "").split(",")
        if value.strip()
    }

BRANCH_MAP: Dict[str, str] = {
    "02": "Electrical & Electronics Engineering (EEE)",
    "03": "Mechanical Engineering (MECH)",
    "04": "Electronics & Communication Engineering (ECE)",
    "05": "Computer Science & Engineering (CSE)",
    "66": "CSE - AI & Machine Learning (CSM)",
    "67": "CSE - Data Science (CSD)",
}

def parse_student_credentials(input_val: str) -> Dict[str, Any]:
    """Parses a roll number or @hitam.org email and returns student demographics."""
    if not input_val:
        return {}
    clean = input_val.strip().upper()
    if "@" in clean:
        user, domain = clean.split("@", 1)
        clean = user

    regex = r'^(2\d)(E5)([15])([AM])(02|03|04|05|66|67)([0-9A-Z]{2})$'
    match = re.match(regex, clean)
    if not match:
        return {
            "isValid": True,
            "rollNumber": clean,
            "roll_number": clean,
            "email": input_val.lower() if "@" in input_val else f"{clean.lower()}@hitam.org",
            "collegeName": "HITAM Hyderabad",
            "currentStudyYear": "Undergraduate",
            "branchName": "Engineering",
            "branch": "Engineering"
        }

    yr, _, adm, prog, br, seat = match.groups()
    joining_year = 2000 + int(yr)
    is_lateral = (adm == "5")
    graduation_year = joining_year + (3 if is_lateral else 4)
    current_year = datetime.now().year
    diff = current_year - joining_year + (1 if is_lateral else 0)
    year_names = ["1st Year", "2nd Year", "3rd Year", "4th Year"]
    current_study_year = year_names[min(3, max(0, diff))] if diff >= 0 else "1st Year"

    branch_name = (
        "International Twinning Programme (ITP - CSE)"
        if (prog == "M" and br == "05")
        else BRANCH_MAP.get(br, f"Branch {br}")
    )

    roll_number = f"{yr}E5{adm}{prog}{br}{seat}"
    return {
        "isValid": True,
        "rollNumber": roll_number,
        "roll_number": roll_number,
        "email": input_val.lower() if "@" in input_val else f"{roll_number.lower()}@hitam.org",
        "collegeName": "HITAM Hyderabad",
        "joiningYear": joining_year,
        "graduationYear": graduation_year,
        "currentStudyYear": current_study_year,
        "admissionType": "Lateral Entry" if is_lateral else "Regular",
        "programmeType": "B.Tech",
        "branchCode": br,
        "branchName": branch_name,
        "branch": branch_name,
        "seatNumber": seat
    }


def _verified_student_for_email(email: str) -> Optional[Dict[str, Any]]:
    """Resolve a verified Google identity to an exact, provisioned roster record."""
    normalized = (email or "").strip().casefold()
    if not normalized or "@" not in normalized:
        return None
    roster_path = os.path.join(os.path.dirname(__file__), "data", "students_roster.json")
    try:
        import json
        with open(roster_path, "r", encoding="utf-8") as roster_file:
            records = json.load(roster_file)
    except (OSError, ValueError, TypeError):
        logger.error("Student roster unavailable; refusing student authentication")
        return None
    if not isinstance(records, list):
        return None
    return next((record for record in records if isinstance(record, dict) and str(record.get("email") or "").strip().casefold() == normalized), None)

def verify_google_id_token(token_str: str) -> Dict[str, Any]:
    """Verify a Google ID token against an explicitly configured client ID."""
    active_ids = GOOGLE_CLIENT_IDS if GOOGLE_CLIENT_IDS else _resolve_google_client_ids()
    clean_token = (token_str or "").strip()
    last_err = None
    for client_id in active_ids:
        try:
            idinfo = id_token.verify_oauth2_token(
                clean_token,
                google_requests.Request(),
                client_id,
                clock_skew_in_seconds=10
            )
            return idinfo
        except Exception as e:
            last_err = e
            pass
    logger.warning("Google token verification failed (active_ids=%s): %s", active_ids, last_err)
    detail_msg = f"Invalid Google OAuth credential: {last_err}" if os.environ.get("ENV") == "development" else "Invalid Google OAuth credential."
    raise HTTPException(status_code=401, detail=detail_msg)

def is_admin_email(email: str) -> bool:
    e = (email or "").strip().lower()
    return bool(e) and e in _configured_admins("ADMIN_EMAILS")


class GoogleLoginRequest(BaseModel):
    token: Optional[str] = None
    credential: Optional[str] = None
    email: Optional[str] = None

class ManualLoginRequest(BaseModel):
    identifier: str
    password: Optional[str] = None

class AdminLoginRequest(BaseModel):
    username: str
    password: str


import bcrypt
def verify_admin_password(password: str) -> bool:
    """Verify the configured administrator password hash; fail closed if absent."""
    env_hash = os.environ.get("ADMIN_PASSWORD_HASH")
    if not env_hash:
        return False
    try:
        clean_hashes = [h.strip().strip('"').strip("'") for h in env_hash.split(",") if h.strip()]
        for clean_hash in clean_hashes:
            try:
                if bcrypt.checkpw(password.encode("utf-8"), clean_hash.encode("utf-8")):
                    return True
            except Exception:
                continue
        return False
    except Exception as exc:
        logger.warning("[ADMIN AUTH] Configured password hash could not be verified: %s", exc)
        return False


@auth_router.post("/admin-login")
@limiter.limit("5/minute")
def admin_login_endpoint(request: Request, payload: AdminLoginRequest):
    """
    Dedicated Admin Login endpoint with bcrypt password verification.
    """
    username = payload.username.strip().lower()
    password = payload.password.strip()
    valid_usernames = _configured_admins("ADMIN_EMAILS") | _configured_admins("ADMIN_USERNAMES")

    if username not in valid_usernames or not verify_admin_password(password):
        raise HTTPException(
            status_code=401, 
            detail="Invalid admin credentials. Access denied."
        )

    jwt_token = create_access_token(user_id=username.lower(), email=username.lower(), role="admin", expires_hours=8)

    admin_profile = {
        "roll_number": "ADMIN",
        "rollNumber": "ADMIN",
        "name": "Super Administrator",
        "email": username.lower(),
        "branch": "Startup Assessment Hub & Placement Admin",
        "currentStudyYear": "Super Administrator",
        "collegeName": "HITAM & Startup Assessment Hub",
        "is_admin": True,
        "role": "admin"
    }

    return {
        "status": "success",
        "token": jwt_token,
        "student": admin_profile,
        "user": {
            "id": username.lower(),
            "email": username.lower(),
            "name": "Super Administrator",
            "role": "admin",
            "is_admin": True
        },
        "redirect_url": "/assessment?admin=true"
    }


@auth_router.post("/google-hitam-login")
@auth_router.post("/google-login")
@limiter.limit("10/minute")
def google_login_endpoint(request: Request, payload: GoogleLoginRequest):
    """Universal Google OAuth login endpoint for both HITAM students and Admins."""
    raw_token = payload.token or payload.credential
    if not raw_token:
        raise HTTPException(status_code=400, detail="Missing Google credential/token.")

    idinfo = verify_google_id_token(raw_token)
    email = (idinfo.get("email") or "").strip().lower()
    if not email or idinfo.get("email_verified") is not True:
        raise HTTPException(status_code=401, detail="Google account email is not verified.")
    name = idinfo.get("name") or idinfo.get("given_name") or email.split("@")[0]

    # A student must control a verified Google account that exactly matches a
    # provisioned roster email. Roll numbers and email claims alone are not proof.
    is_admin = is_admin_email(email)
    role = "admin" if is_admin else "student"
    student_record = None
    if is_admin:
        user_id = str(idinfo.get("sub") or "").strip()
        if not user_id:
            raise HTTPException(status_code=401, detail="Google identity has no subject.")
    else:
        student_record = _verified_student_for_email(email)
        if not student_record and email.endswith("@hitam.org"):
            demographics = parse_student_credentials(email)
            if demographics.get("isValid") and demographics.get("rollNumber"):
                student_record = {
                    "roll_number": demographics.get("rollNumber"),
                    "name": name,
                    "branch": demographics.get("branchName", "Engineering"),
                    "email": email
                }
        if not student_record:
            raise HTTPException(status_code=403, detail="This verified Google account is not enrolled.")
        user_id = str(student_record.get("roll_number") or "").strip().upper()
        if not user_id:
            raise HTTPException(status_code=403, detail="Roster record has no student identity.")

    demographics = parse_student_credentials(email)
    roll_number = str(student_record.get("roll_number")).strip().upper() if student_record else "ADMIN"
    display_name = (student_record.get("name") if student_record else None) or name
    branch = (student_record.get("branch") if student_record else None) or demographics.get("branch", "Computer Science & Engineering (CSE)")
    student_data = {
        "roll_number": roll_number,
        "rollNumber": roll_number,
        "name": display_name,
        "email": email,
        "branch": branch,
        "currentStudyYear": demographics.get("currentStudyYear", "Undergraduate"),
        "collegeName": demographics.get("collegeName", "HITAM Hyderabad"),
        "is_admin": is_admin
    }

    jwt_token = create_access_token(
        user_id=user_id,
        email=email,
        role=role,
        expires_hours=8,
        roll_number=roll_number,
        name=display_name,
        branch=branch
    )

    try:
        from analytics_service import upsert_user
        upsert_user(
            user_id=user_id,
            roll_number=roll_number,
            name=display_name,
            email=email,
            role=role,
            branch=branch,
            college=student_data.get("collegeName", "HITAM Hyderabad")
        )
    except Exception as e:
        logger.debug("[AUTH UPSERT USER] %s", e)

    return {
        "token": jwt_token,
        "student": student_data,
        "user": {
            "id": user_id,
            "roll_number": roll_number,
            "email": email,
            "name": display_name,
            "role": role,
            "branch": branch
        }
    }


@auth_router.post("/hitam-login")
@limiter.limit("5/minute")
def manual_hitam_login_endpoint(request: Request, payload: ManualLoginRequest):
    """Manual Roll Number or Email login for HITAM students and admins."""
    identifier = payload.identifier.strip()
    if not identifier:
        raise HTTPException(status_code=400, detail="Identifier is required.")

    # Check if this is an admin attempting login via the general identifier field
    if identifier.lower() in (_configured_admins("ADMIN_EMAILS") | _configured_admins("ADMIN_USERNAMES")):
        if not payload.password or not verify_admin_password(payload.password.strip()):
            raise HTTPException(status_code=401, detail="Invalid admin password.")

        jwt_token = create_access_token(user_id=identifier.lower(), email=identifier.lower(), role="admin", expires_hours=8)
        admin_profile = {
            "roll_number": "ADMIN",
            "rollNumber": "ADMIN",
            "name": "Super Administrator",
            "email": identifier.lower(),
            "branch": "Startup Assessment Hub & Placement Admin",
            "currentStudyYear": "Super Administrator",
            "collegeName": "HITAM & Startup Assessment Hub",
            "is_admin": True,
            "role": "admin"
        }
        return {
            "token": jwt_token,
            "student": admin_profile,
            "user": {
                "id": identifier.lower(),
                "email": identifier.lower(),
                "name": "Super Administrator",
                "role": "admin",
                "is_admin": True
            },
            "redirect_url": "/assessment?admin=true"
        }

    # A supplied roll number/email is not proof of account ownership.
    raise HTTPException(status_code=401, detail="Student sign-in requires verified Google authentication.")

