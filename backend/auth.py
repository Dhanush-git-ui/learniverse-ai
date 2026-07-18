import hmac
from fastapi import Header, HTTPException
from config import settings

async def verify_api_key(x_api_key: str = Header(default=None)):
    """Simple API key verification with constant-time comparison.

    Notes:
    - If `API_SECRET_KEY` is not configured, the function will return a 500
      so the operator can detect a misconfiguration rather than accidentally
      allowing unauthenticated access.
    - Comparison uses `hmac.compare_digest` to avoid timing attacks.
    """
    api_secret_key = settings.API_SECRET_KEY
    if not api_secret_key:
        raise HTTPException(status_code=500, detail="API authentication is not configured")

    if not x_api_key or not hmac.compare_digest(x_api_key, api_secret_key):
        raise HTTPException(status_code=401, detail="Invalid or missing API key")

    return x_api_key
