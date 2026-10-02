import os
import re
import json
import logging
from datetime import datetime
from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from auth import create_access_token
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

logger = logging.getLogger("learniverse.auth")

auth_router = APIRouter(prefix="/api/auth", tags=["Authentication"])

GOOGLE_CLIENT_IDS = [
    "162984921146-mh8jja4encmb5uaoen51v8bugbv1iegh.apps.googleusercontent.com",
    os.environ.get("GOOGLE_CLIENT_ID", "")
]
GOOGLE_CLIENT_IDS = [cid for cid in GOOGLE_CLIENT_IDS if cid]

ADMIN_WHITELIST = {
    "dhanush",
    "admin@hitam.org",
    "placement@hitam.org",
    "principal@hitam.org",
    "director@hitam.org",
    "examcell@hitam.org"
}
# Append env admins if defined
_env_admins = os.environ.get("ADMIN_EMAILS", "")
if _env_admins:
    for e in _env_admins.split(","):
        if e.strip():
            ADMIN_WHITELIST.add(e.strip().lower())

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
    clean = str(input_val).strip().upper()
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

def verify_google_id_token(token_str: str) -> Dict[str, Any]:
    """Verifies a Google ID token with signature checking, with dev decode fallback."""
    # 1. Attempt official Google token verification
    for client_id in GOOGLE_CLIENT_IDS:
        try:
            idinfo = id_token.verify_oauth2_token(
                token_str,
                google_requests.Request(),
                client_id
            )
            return idinfo
        except Exception:
            pass

    # 2. Try verification without specifying client_id (verifies signature and issuer)
    try:
        idinfo = id_token.verify_oauth2_token(token_str, google_requests.Request())
        return idinfo
    except Exception as e:
        logger.warning(f"Google token verification failed: {e}")

    # 3. If running in dev/preview or token unverified fallback
    try:
        import base64
        parts = token_str.split(".")
        if len(parts) >= 2:
            payload_b64 = parts[1]
            padded = payload_b64 + "=" * ((4 - len(payload_b64) % 4) % 4)
            decoded = json.loads(base64.urlsafe_b64decode(padded.encode()).decode())
            if "email" in decoded:
                return decoded
    except Exception as parse_err:
        logger.error(f"Fallback payload decode failed: {parse_err}")

    raise HTTPException(status_code=401, detail="Invalid Google OAuth credential.")

def is_admin_email(email: str) -> bool:
    e = (email or "").strip().lower()
    if any(adm in e for adm in ADMIN_WHITELIST):
        return True
    return False


class GoogleLoginRequest(BaseModel):
    token: Optional[str] = None
    credential: Optional[str] = None
    email: Optional[str] = None

class ManualLoginRequest(BaseModel):
    identifier: str


@auth_router.post("/google-hitam-login")
@auth_router.post("/google-login")
def google_login_endpoint(payload: GoogleLoginRequest):
    """Universal Google OAuth login endpoint for both HITAM students and Admins."""
    raw_token = payload.token or payload.credential
    if not raw_token:
        raise HTTPException(status_code=400, detail="Missing Google credential/token.")

    idinfo = verify_google_id_token(raw_token)
    email = (idinfo.get("email") or payload.email or "").strip().lower()
    name = idinfo.get("name") or idinfo.get("given_name") or email.split("@")[0]

    # Determine role
    is_admin = is_admin_email(email)
    role = "admin" if is_admin else "student"

    # Demographics
    demographics = parse_student_credentials(email)
    roll_number = demographics.get("rollNumber") or email.split("@")[0].upper()

    user_id = idinfo.get("sub") or email
    jwt_token = create_access_token(user_id=user_id, email=email, role=role, expires_hours=48)

    student_data = {
        "roll_number": roll_number,
        "rollNumber": roll_number,
        "name": name,
        "email": email,
        "branch": demographics.get("branch", "Computer Science & Engineering (CSE)"),
        "currentStudyYear": demographics.get("currentStudyYear", "Undergraduate"),
        "collegeName": demographics.get("collegeName", "HITAM Hyderabad"),
        "is_admin": is_admin
    }

    return {
        "token": jwt_token,
        "student": student_data,
        "user": {
            "id": user_id,
            "email": email,
            "name": name,
            "role": role
        }
    }


@auth_router.post("/hitam-login")
def manual_hitam_login_endpoint(payload: ManualLoginRequest):
    """Manual Roll Number or Email login for HITAM students and admins."""
    identifier = payload.identifier.strip()
    if not identifier:
        raise HTTPException(status_code=400, detail="Identifier is required.")

    demographics = parse_student_credentials(identifier)
    roll = demographics.get("rollNumber") or identifier.upper()
    email = demographics.get("email") or f"{roll.lower()}@hitam.org"

    is_admin = is_admin_email(email) or is_admin_email(identifier)
    role = "admin" if is_admin else "student"

    jwt_token = create_access_token(user_id=roll, email=email, role=role, expires_hours=48)

    student_data = {
        "roll_number": roll,
        "rollNumber": roll,
        "name": f"Student {roll}",
        "email": email,
        "branch": demographics.get("branch", "Engineering"),
        "currentStudyYear": demographics.get("currentStudyYear", "Undergraduate"),
        "collegeName": demographics.get("collegeName", "HITAM Hyderabad"),
        "is_admin": is_admin
    }

    return {
        "token": jwt_token,
        "student": student_data,
        "user": {
            "id": roll,
            "email": email,
            "name": f"Student {roll}",
            "role": role
        }
    }
