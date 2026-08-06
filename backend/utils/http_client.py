import httpx

# Global singleton client, initialized at module load.
# Will be explicitly closed in app.py's lifespan.
http_client = httpx.AsyncClient(
    timeout=httpx.Timeout(45.0, connect=10.0, read=45.0, write=10.0, pool=10.0),
    limits=httpx.Limits(max_keepalive_connections=20, max_connections=100)
)
