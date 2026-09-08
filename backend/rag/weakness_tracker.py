"""SQLite-backed weakness tracker.
Tracks per-student failure count per concept, used by Wrong-Answer Genealogy
to identify prerequisite gaps."""
import os
import sqlite3
import threading
from datetime import datetime

_DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "weakness.sqlite3")
os.makedirs(os.path.dirname(_DB_PATH), exist_ok=True)
_lock = threading.Lock()

def _conn():
    c = sqlite3.connect(_DB_PATH, check_same_thread=False)
    c.execute('''CREATE TABLE IF NOT EXISTS concept_failures (
        student_id TEXT,
        concept TEXT,
        fail_count INTEGER DEFAULT 0,
        last_failed TEXT,
        PRIMARY KEY(student_id, concept)
    )''')
    c.commit()
    return c

def record_failure(student_id: str, concept: str):
    with _lock:
        c = _conn()
        try:
            c.execute('''INSERT INTO concept_failures (student_id, concept, fail_count, last_failed)
                         VALUES (?, ?, 1, ?)
                         ON CONFLICT(student_id, concept) DO UPDATE
                         SET fail_count = fail_count + 1, last_failed = ?''',
                      (student_id, concept, datetime.utcnow().isoformat(), datetime.utcnow().isoformat()))
            c.commit()
        finally:
            c.close()

def get_weakest_concept(student_id: str) -> str | None:
    with _lock:
        c = _conn()
        try:
            row = c.execute('''SELECT concept FROM concept_failures
                                WHERE student_id=? ORDER BY fail_count DESC LIMIT 1''',
                             (student_id,)).fetchone()
            return row[0] if row else None
        finally:
            c.close()

def get_failure_count(student_id: str, concept: str) -> int:
    with _lock:
        c = _conn()
        try:
            row = c.execute('''SELECT fail_count FROM concept_failures
                                WHERE student_id=? AND concept=?''',
                             (student_id, concept)).fetchone()
            return row[0] if row else 0
        finally:
            c.close()
