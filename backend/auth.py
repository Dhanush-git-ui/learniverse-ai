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

async def verify_api_key(x_api_key: str = Header(default=None)):
    """Verify API key using constant-time comparison."""
    if not settings.API_SECRET_KEY:
        raise HTTPException(status_code=500, detail="API authentication is not configured on server")

    if not x_api_key or not hmac.compare_digest(x_api_key, settings.API_SECRET_KEY):
        raise HTTPException(status_code=401, detail="Invalid or missing API key")

    return x_api_key

def create_access_token(user_id: str, email: str = "", role: str = "student", expires_hours: int = 24) -> str:
    """Create a signed JWT access token for students/admins."""
    now = datetime.now(timezone.utc)
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "iat": now,
        "exp": now + timedelta(hours=expires_hours)
    }
    return jwt.encode(payload, settings.API_SECRET_KEY, algorithm="HS256")

async def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> User:
    """Extract and validate the current authenticated user from Bearer JWT token."""
    if not credentials or not credentials.credentials:
        raise HTTPException(status_code=401, detail="Authentication token required")
    try:
        payload = jwt.decode(credentials.credentials, settings.API_SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token subject")
        return User(id=user_id, email=payload.get("email"), role=payload.get("role", "student"))
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

