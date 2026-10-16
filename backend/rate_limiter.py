from slowapi import Limiter
from starlette.requests import Request

def get_rate_limit_key(request: Request) -> str:
    # Authenticated traffic is bucketed by a fully validated application JWT.
    auth_header = request.headers.get("authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ", 1)[1].strip()
        try:
            from auth import _decode_access_token
            return f"user:{_decode_access_token(token)['sub']}"
        except Exception:
            pass

    # Forwarding headers are attacker-controlled unless a trusted-proxy chain
    # has explicitly been configured. Use the ASGI peer address by default.
    return request.client.host if request.client else "127.0.0.1"

limiter = Limiter(key_func=get_rate_limit_key)
