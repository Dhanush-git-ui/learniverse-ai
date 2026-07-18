import time
import threading
from typing import Dict, Any, Optional


class MemoryCache:
    """A simple in-memory TTL cache with basic thread-safety.

    Note: This is safe for single-process multi-threaded use. For
    multi-process deployments (multiple workers), use an external cache
    like Redis or memcached.
    """

    def __init__(self):
        self._cache: Dict[str, Dict[str, Any]] = {}
        self._lock = threading.Lock()

    def get(self, key: str) -> Optional[Any]:
        with self._lock:
            item = self._cache.get(key)
            if not item:
                return None
            if item["expiry"] is None or item["expiry"] > time.time():
                return item["value"]
            # expired
            del self._cache[key]
            return None

    def set(self, key: str, value: Any, ttl_seconds: Optional[int] = None) -> None:
        expiry = time.time() + ttl_seconds if ttl_seconds else None
        with self._lock:
            self._cache[key] = {
                "value": value,
                "expiry": expiry,
            }

    def clear(self) -> None:
        with self._lock:
            self._cache.clear()


# Global cache instance
topic_cache = MemoryCache()
