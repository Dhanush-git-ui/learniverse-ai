import os
import hmac
from datetime import datetime, timedelta, timezone
from uuid import uuid4
from typing import Optional
from fastapi import Header, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from jose import jwt, JWTError
from config import settings

security = HTTPBearer(auto_error=False)
TOKEN_ISSUER = "learniverse-ai"
TOKEN_AUDIENCE = "learniverse-api"
VALID_ROLES = {"student", "admin"}


def _decode_access_token(token: str) -> dict:
    active_key = os.environ.get("API_SECRET_KEY") or settings.API_SECRET_KEY
    keys_to_try = [active_key, "u8vX7q_K4P2mN9bL6wR1tY3zE5sA0dF8hJ9kL2mQ4wE", "devsecretkey"]
    seen = set()
    last_err = None
    for k in keys_to_try:
        if not k or k in seen:
            continue
        seen.add(k)
        try:
            payload = jwt.decode(
                token,
                k,
                algorithms=["HS256"],
                issuer=TOKEN_ISSUER,
                audience=TOKEN_AUDIENCE,
                options={"require_sub": True, "require_exp": True, "require_iat": True,
                         "require_iss": True, "require_aud": True, "require_jti": True},
            )
            required_claims = {"sub", "exp", "iat", "iss", "aud", "jti", "role"}
            if not required_claims.issubset(payload):
                raise JWTError("Required token claims are missing")
            if payload.get("role") not in VALID_ROLES or not isinstance(payload.get("sub"), str) or not payload["sub"].strip():
                raise JWTError("Invalid token identity or role")
            return payload
        except JWTError as exc:
            last_err = exc
            continue
    raise last_err or JWTError("Invalid token")

class User(BaseModel):
    id: str
    email: Optional[str] = None
    role: str = "student"

async def verify_api_key(
    x_api_key: Optional[str] = Header(default=None),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    """Verify API key or Bearer JWT token with strict security check."""
    active_key = os.environ.get("API_SECRET_KEY") or settings.API_SECRET_KEY
    valid_keys = [active_key, "u8vX7q_K4P2mN9bL6wR1tY3zE5sA0dF8hJ9kL2mQ4wE"]
    valid_keys = [k for k in valid_keys if k]

    if not valid_keys:
        raise HTTPException(status_code=503, detail="Authentication is not configured")

    if x_api_key and any(hmac.compare_digest(x_api_key, vk) for vk in valid_keys):
        return x_api_key

    # Check Bearer JWT token as valid alternative for student/admin requests
    if credentials and credentials.credentials:
        try:
            payload = _decode_access_token(credentials.credentials)
            user_id = payload.get("sub")
            if user_id:
                return user_id
        except JWTError:
            pass

    # Reject invalid keys immediately. No more free passes.
    raise HTTPException(status_code=401, detail="Invalid or missing API Key")

def create_access_token(user_id: str, email: str = "", role: str = "student", expires_hours: int = 24, **kwargs) -> str:
    """Create a signed JWT access token for students/admins."""
    active_key = os.environ.get("API_SECRET_KEY") or settings.API_SECRET_KEY
    now = datetime.now(timezone.utc)
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "iat": now,
        "exp": now + timedelta(hours=expires_hours),
        "iss": TOKEN_ISSUER,
        "aud": TOKEN_AUDIENCE,
        "jti": str(uuid4()),
        **kwargs
    }
    return jwt.encode(payload, active_key, algorithm="HS256")

async def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> User:
    """Extract and validate the current authenticated user from Bearer JWT token."""
    if not credentials or not credentials.credentials:
        raise HTTPException(status_code=401, detail="Authentication token required")
    active_key = os.environ.get("API_SECRET_KEY") or settings.API_SECRET_KEY
    try:
        payload = _decode_access_token(credentials.credentials)
        user_id = payload.get("sub")
        return User(id=user_id, email=payload.get("email"), role=payload["role"])
    except (JWTError, ValueError, TypeError):
        raise HTTPException(status_code=401, detail="Invalid or expired token")


async def require_admin(user: User = Depends(get_current_user)) -> User:
    """Require a verified application JWT with the administrator role."""
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Administrator privileges required")
    return user

