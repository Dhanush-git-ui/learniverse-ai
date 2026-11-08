"""One bounded PostgreSQL pool shared by all backend modules in a worker."""
from __future__ import annotations

import logging
import threading
from typing import Optional

from psycopg2.pool import ThreadedConnectionPool

from config import DB_POOL_MAX_CONNS, DB_POOL_MIN_CONNS

logger = logging.getLogger("learniverse.database")
_lock = threading.RLock()
_pool: Optional[ThreadedConnectionPool] = None
_pool_dsn: Optional[str] = None


def get_pool(dsn: Optional[str]) -> Optional[ThreadedConnectionPool]:
    """Return the worker's shared pool; a missing DSN means no database configured."""
    global _pool, _pool_dsn
    if not dsn:
        return None
    with _lock:
        if _pool is not None and not _pool.closed and _pool_dsn == dsn:
            return _pool
        if _pool is not None and not _pool.closed:
            # DSN changes happen only during isolated tests or process reconfiguration.
            _pool.closeall()
        _pool = ThreadedConnectionPool(
            minconn=DB_POOL_MIN_CONNS,
            maxconn=DB_POOL_MAX_CONNS,
            dsn=dsn,
        )
        _pool_dsn = dsn
        return _pool


def close_pool() -> None:
    """Close all worker connections at application shutdown."""
    global _pool, _pool_dsn
    with _lock:
        if _pool is not None and not _pool.closed:
            _pool.closeall()
        _pool = None
        _pool_dsn = None


def current_pool() -> Optional[ThreadedConnectionPool]:
    """Expose the shared pool for compatibility and deterministic tests."""
    return _pool


def acquire_connection(dsn: Optional[str]):
    """Check out a connection from the shared bounded pool."""
    pool = get_pool(dsn)
    if pool is None:
        raise RuntimeError("DATABASE_URL is not configured")
    return pool.getconn()


def release_connection(conn, *, discard: bool = False) -> None:
    """Return a connection and clear any read-only transaction state."""
    pool = current_pool()
    if conn is None:
        return
    if pool is None or pool.closed:
        try:
            conn.close()
        except Exception:
            pass
        return
    broken = discard or getattr(conn, "closed", 0) != 0
    if not broken:
        try:
            conn.rollback()
        except Exception:
            broken = True
    pool.putconn(conn, close=broken)
