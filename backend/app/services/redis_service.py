"""
Redis Session & Cache Service.
Manages live conversation state, encounter session state, document processing status,
and background job progress with an in-memory fallback store when Redis is offline.
"""

import os
import json
from typing import Dict, Any, Optional

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

_redis_client = None
_in_memory_store: Dict[str, str] = {}

def get_redis():
    global _redis_client
    if _redis_client is None:
        try:
            import redis
            _redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)
            _redis_client.ping()
        except Exception:
            _redis_client = False # Fallback to in-memory store
    return _redis_client

def set_session_state(key: str, value: Any, ttl_seconds: int = 3600):
    r = get_redis()
    json_val = json.dumps(value)
    if r:
        try:
            r.setex(key, ttl_seconds, json_val)
            return
        except Exception:
            pass
    _in_memory_store[key] = json_val

def get_session_state(key: str) -> Optional[Any]:
    r = get_redis()
    if r:
        try:
            val = r.get(key)
            if val:
                return json.loads(val)
        except Exception:
            pass
    val = _in_memory_store.get(key)
    return json.loads(val) if val else None

def set_processing_status(job_id: str, status: str, payload: dict = None):
    data = {"status": status, "payload": payload or {}}
    set_session_state(f"job:{job_id}", data, ttl_seconds=1800)

def get_processing_status(job_id: str) -> dict:
    res = get_session_state(f"job:{job_id}")
    return res or {"status": "UNKNOWN", "payload": {}}
