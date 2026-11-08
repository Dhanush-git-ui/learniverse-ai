import time
import threading
import json
import logging
from collections import OrderedDict
from typing import Dict, Any, Optional
from config import settings

logger = logging.getLogger("learniverse.cache")

class MemoryCache:
    """A simple in-memory TTL cache with basic thread-safety.
    
    # ponytail: ceiling=in-memory Python dict without size eviction bounds (O(N) memory), upgrade=RedisCache or DiskCache with LRU eviction
    """

    def __init__(self, max_entries: int = 2048):
        self._cache: OrderedDict[str, Dict[str, Any]] = OrderedDict()
        self._max_entries = max_entries
        self._lock = threading.Lock()

    def get(self, key: str) -> Optional[Any]:
        with self._lock:
            item = self._cache.get(key)
            if not item:
                return None
            if item["expiry"] is None or item["expiry"] > time.time():
                self._cache.move_to_end(key)
                return item["value"]
            # expired
            del self._cache[key]
            return None

    def set(self, key: str, value: Any, ttl_seconds: Optional[int] = None) -> None:
        expiry = time.time() + ttl_seconds if ttl_seconds else None
        with self._lock:
            self._cache.pop(key, None)
            self._cache[key] = {
                "value": value,
                "expiry": expiry,
            }
            while len(self._cache) > self._max_entries:
                self._cache.popitem(last=False)

    def clear(self) -> None:
        with self._lock:
            self._cache.clear()

class RedisCache:
    """Redis-backed cache."""
    PREFIX = "learniverse:topic:"

    def __init__(self, redis_client, fallback: Optional[MemoryCache] = None):
        self.redis = redis_client
        self.fallback = fallback or MemoryCache()

    def get(self, key: str) -> Optional[Any]:
        try:
            val = self.redis.get(self.PREFIX + key)
            if val:
                return json.loads(val)
        except Exception as exc:
            logger.warning("Redis cache read failed (%s); using worker memory cache", type(exc).__name__)
            return self.fallback.get(key)
        return None

    def set(self, key: str, value: Any, ttl_seconds: Optional[int] = None) -> None:
        try:
            val_str = json.dumps(value)
            if ttl_seconds:
                self.redis.setex(self.PREFIX + key, ttl_seconds, val_str)
            else:
                self.redis.set(self.PREFIX + key, val_str)
        except Exception as exc:
            logger.warning("Redis cache write failed (%s); using worker memory cache", type(exc).__name__)
            self.fallback.set(key, value, ttl_seconds)

    def clear(self) -> None:
        try:
            keys = list(self.redis.scan_iter(match=self.PREFIX + "*"))
            if keys:
                self.redis.delete(*keys)
        except Exception as exc:
            logger.warning("Redis cache clear failed (%s)", type(exc).__name__)
        finally:
            self.fallback.clear()

def _init_cache():
    if settings.REDIS_URL:
        try:
            import redis
            client = redis.from_url(
                settings.REDIS_URL,
                decode_responses=True,
                socket_connect_timeout=1,
                socket_timeout=1,
                health_check_interval=30,
            )
        except Exception as exc:
            logger.warning("Redis client initialization failed (%s); using bounded worker memory cache", type(exc).__name__)
            return MemoryCache()
        try:
            client.ping()
            logger.info("Using Redis for topic caching")
        except Exception as exc:
            logger.warning("Redis unavailable at startup (%s); cache will use memory until Redis recovers", type(exc).__name__)
        # Keep the client when initial ping fails so RedisCache retries on later
        # requests and can recover without restarting the API worker.
        return RedisCache(client)
    else:
        logger.info("REDIS_URL not configured; using bounded worker memory cache")
    
    return MemoryCache()

# Global cache instance
topic_cache = _init_cache()
