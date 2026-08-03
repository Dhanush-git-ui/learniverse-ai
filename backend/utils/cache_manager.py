import time
import threading
import json
from typing import Dict, Any, Optional
from config import settings

class MemoryCache:
    """A simple in-memory TTL cache with basic thread-safety.
    
    # ponytail: ceiling=in-memory Python dict without size eviction bounds (O(N) memory), upgrade=RedisCache or DiskCache with LRU eviction
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

class RedisCache:
    """Redis-backed cache."""
    def __init__(self, redis_client):
        self.redis = redis_client

    def get(self, key: str) -> Optional[Any]:
        try:
            val = self.redis.get(key)
            if val:
                return json.loads(val)
        except Exception as e:
            print(f"[CACHE ERROR] Redis get failed for {key}: {e}")
        return None

    def set(self, key: str, value: Any, ttl_seconds: Optional[int] = None) -> None:
        try:
            val_str = json.dumps(value)
            if ttl_seconds:
                self.redis.setex(key, ttl_seconds, val_str)
            else:
                self.redis.set(key, val_str)
        except Exception as e:
            print(f"[CACHE ERROR] Redis set failed for {key}: {e}")

    def clear(self) -> None:
        try:
            self.redis.flushdb()
        except Exception as e:
            print(f"[CACHE ERROR] Redis clear failed: {e}")

def _init_cache():
    if settings.REDIS_URL:
        try:
            import redis
            client = redis.from_url(settings.REDIS_URL, decode_responses=True)
            # Test connection
            client.ping()
            print("[CACHE] Using Redis for caching.")
            return RedisCache(client)
        except Exception as e:
            print(f"[CACHE] Failed to connect to Redis, falling back to MemoryCache: {e}")
    else:
        print("[CACHE] REDIS_URL not configured, using MemoryCache.")
    
    return MemoryCache()

# Global cache instance
topic_cache = _init_cache()
