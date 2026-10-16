"""
Authentication Service - JWT-based user management
Handles login, signup, password reset, email verification
"""

from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta, timezone
import jwt
import bcrypt
import secrets
from typing import Optional
import os
from enum import Enum

auth_router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# ============================================================================
# Models & Enums
# ============================================================================

class UserRole(str, Enum):
    STUDENT = "student"
    TEACHER = "teacher"
    ADMIN = "admin"
    INSTITUTION_ADMIN = "institution_admin"

class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    institution_id: Optional[str] = None
    role: UserRole = UserRole.STUDENT

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: UserRole
    institution_id: Optional[str]
    is_active: bool
    created_at: str

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

# ============================================================================
# Configuration
# ============================================================================

JWT_SECRET = os.environ.get("JWT_SECRET", "change-me-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRY_HOURS = int(os.environ.get("JWT_EXPIRY_HOURS", "24"))
REFRESH_TOKEN_EXPIRY_DAYS = int(os.environ.get("REFRESH_TOKEN_EXPIRY_DAYS", "30"))

# In-memory user storage (production: use PostgreSQL)
_users_db: dict = {}
_reset_tokens: dict = {}

# ============================================================================
# Password Hashing
# ============================================================================

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode(), salt).decode()

def verify_password(password: str, hashed: str) -> bool:
    """Verify password against hash"""
    return bcrypt.checkpw(password.encode(), hashed.encode())

# ============================================================================
# Token Generation
# ============================================================================

def create_access_token(user_id: str, email: str, role: UserRole) -> tuple[str, datetime]:
    """Create JWT access token"""
    now = datetime.now(timezone.utc)
    expiry = now + timedelta(hours=JWT_EXPIRY_HOURS)

    payload = {
        "sub": user_id,
        "email": email,
        "role": role.value,
        "iat": now,
        "exp": expiry
    }

    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token, expiry

def create_refresh_token(user_id: str) -> str:
    """Create refresh token"""
    now = datetime.now(timezone.utc)
    expiry = now + timedelta(days=REFRESH_TOKEN_EXPIRY_DAYS)

    payload = {
        "sub": user_id,
        "type": "refresh",
        "iat": now,
        "exp": expiry
    }

    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_token(token: str) -> dict:
    """Verify and decode JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ============================================================================
# Authentication Endpoints
# ============================================================================

@auth_router.post("/signup", response_model=TokenResponse, status_code=201)
async def signup(req: SignupRequest):
    """
    Register new user

    Returns JWT tokens and user data
    """
    # Check if user exists
    if req.email.lower() in _users_db:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Validate password strength
    if len(req.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    # Create user
    user_id = secrets.token_urlsafe(16)
    user = {
        "id": user_id,
        "email": req.email.lower(),
        "password_hash": hash_password(req.password),
        "full_name": req.full_name,
        "role": req.role,
        "institution_id": req.institution_id,
        "is_active": True,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "last_login": None,
        "email_verified": False
    }

    _users_db[req.email.lower()] = user

    # Generate tokens
    access_token, _ = create_access_token(user_id, req.email, req.role)
    refresh_token = create_refresh_token(user_id)

    # Send verification email (would use email service in production)
    # await send_verification_email(req.email, verification_token)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"],
            "institution_id": user["institution_id"]
        }
    }

@auth_router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest):
    """
    Login user with email and password

    Returns JWT tokens
    """
    email = req.email.lower()

    # Find user
    if email not in _users_db:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user = _users_db[email]

    # Verify password
    if not verify_password(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Check if user is active
    if not user["is_active"]:
        raise HTTPException(status_code=403, detail="Account is disabled")

    # Update last login
    user["last_login"] = datetime.now(timezone.utc).isoformat()

    # Generate tokens
    access_token, _ = create_access_token(user["id"], user["email"], UserRole(user["role"]))
    refresh_token = create_refresh_token(user["id"])

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"],
            "institution_id": user["institution_id"]
        }
    }

@auth_router.post("/refresh")
async def refresh_token(refresh_token: str):
    """
    Refresh access token using refresh token
    """
    try:
        payload = verify_token(refresh_token)

        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")

        user_id = payload.get("sub")

        # Find user
        user = None
        for u in _users_db.values():
            if u["id"] == user_id:
                user = u
                break

        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        # Generate new access token
        access_token, _ = create_access_token(user["id"], user["email"], UserRole(user["role"]))

        return {
            "access_token": access_token,
            "token_type": "bearer"
        }

    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

@auth_router.post("/password-reset")
async def request_password_reset(req: PasswordResetRequest):
    """
    Request password reset link (sends email)
    """
    email = req.email.lower()

    if email not in _users_db:
        # Don't reveal if email exists
        return {"message": "If email exists, reset link has been sent"}

    # Generate reset token
    reset_token = secrets.token_urlsafe(32)
    expiry = datetime.now(timezone.utc) + timedelta(hours=1)

    _reset_tokens[reset_token] = {
        "email": email,
        "expiry": expiry
    }

    # Send email with reset link (production: use email service)
    # reset_url = f"https://yourdomain.com/reset-password?token={reset_token}"
    # await send_password_reset_email(email, reset_url)

    return {"message": "If email exists, reset link has been sent"}

@auth_router.post("/password-reset/confirm")
async def confirm_password_reset(req: PasswordResetConfirm):
    """
    Confirm password reset with token
    """
    if req.token not in _reset_tokens:
        raise HTTPException(status_code=400, detail="Invalid reset token")

    reset_data = _reset_tokens[req.token]

    # Check expiry
    if datetime.now(timezone.utc) > reset_data["expiry"]:
        del _reset_tokens[req.token]
        raise HTTPException(status_code=400, detail="Reset token has expired")

    # Update password
    email = reset_data["email"]
    _users_db[email]["password_hash"] = hash_password(req.new_password)

    # Delete used token
    del _reset_tokens[req.token]

    return {"message": "Password has been reset successfully"}

@auth_router.get("/me", response_model=UserResponse)
async def get_current_user(authorization: str = None):
    """
    Get current authenticated user
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = authorization.split(" ")[1]
    payload = verify_token(token)

    # Find user
    user = None
    for u in _users_db.values():
        if u["id"] == payload["sub"]:
            user = u
            break

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user["id"],
        "email": user["email"],
        "full_name": user["full_name"],
        "role": user["role"],
        "institution_id": user["institution_id"],
        "is_active": user["is_active"],
        "created_at": user["created_at"]
    }

@auth_router.post("/logout")
async def logout(authorization: str = None):
    """
    Logout user (invalidate tokens on frontend)
    """
    # In production, add token to blacklist
    return {"message": "Logged out successfully"}

# ============================================================================
# Helper Functions
# ============================================================================

def get_current_user_id(authorization: str) -> str:
    """Extract user ID from Authorization header"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = authorization.split(" ")[1]
    payload = verify_token(token)

    return payload.get("sub")

def require_role(required_role: UserRole):
    """Dependency to check user role"""
    async def check_role(authorization: str = None):
        if not authorization:
            raise HTTPException(status_code=401, detail="Not authenticated")

        token = authorization.split(" ")[1]
        payload = verify_token(token)

        user_role = payload.get("role")

        if user_role != required_role.value and user_role != "admin":
            raise HTTPException(status_code=403, detail="Insufficient permissions")

        return payload.get("sub")

    return check_role
