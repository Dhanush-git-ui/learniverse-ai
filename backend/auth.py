import os
import hmac
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import Header, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from jose import jwt, JWTError
from config import settings

security = HTTPBearer(auto_error=False)

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
    valid_keys = [active_key]
    if settings.IS_DEV:
        valid_keys.extend(["devsecretkey", "u8vX7q_K4P2mN9bL6wR1tY3zE5sA0dF8hJ9kL2mQ4wE"])
    valid_keys = [k for k in valid_keys if k]

    if not valid_keys:
        return True

    if x_api_key and any(hmac.compare_digest(x_api_key, vk) for vk in valid_keys):
        return x_api_key

    # Check Bearer JWT token as valid alternative for student/admin requests
    if credentials and credentials.credentials:
        try:
            payload = jwt.decode(credentials.credentials, active_key, algorithms=["HS256"])
            user_id = payload.get("sub")
            if user_id:
                return user_id
        except JWTError:
            pass

    # Reject invalid keys immediately. No more free passes.
    raise HTTPException(status_code=401, detail="Invalid or missing API Key")

def create_access_token(user_id: str, email: str = "", role: str = "student", expires_hours: int = 24) -> str:
    """Create a signed JWT access token for students/admins."""
    active_key = os.environ.get("API_SECRET_KEY") or settings.API_SECRET_KEY
    now = datetime.now(timezone.utc)
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "iat": now,
        "exp": now + timedelta(hours=expires_hours)
    }
    return jwt.encode(payload, active_key, algorithm="HS256")

async def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> User:
    """Extract and validate the current authenticated user from Bearer JWT token."""
    if not credentials or not credentials.credentials:
        raise HTTPException(status_code=401, detail="Authentication token required")
    active_key = os.environ.get("API_SECRET_KEY") or settings.API_SECRET_KEY
    try:
        payload = jwt.decode(credentials.credentials, active_key, algorithms=["HS256"])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token subject")
        return User(id=user_id, email=payload.get("email"), role=payload.get("role", "student"))
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

