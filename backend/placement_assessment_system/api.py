# placement_assessment_system/api.py
# ============================================================
# HIGH-SCALE & PRODUCTION-GRADE PLACEMENT ASSESSMENT ENGINE
# Supports PostgreSQL (production) & SQLite (local fallback)
# ============================================================

import os
import json
import random
import re
import csv
import io
import uuid
import sqlite3
import time as _time
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel, Field
from typing import Dict, List, Optional
from decimal import Decimal

def _make_json_serializable(obj):
    """Recursively convert Decimal objects to float/int for psycopg2 Json, sqlite3 and json.dumps compatibility."""
    if isinstance(obj, Decimal):
        return float(obj) if obj % 1 != 0 else int(obj)
    elif isinstance(obj, dict):
        return {k: _make_json_serializable(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [_make_json_serializable(v) for v in obj]
    elif isinstance(obj, tuple):
        return tuple(_make_json_serializable(v) for v in obj)
    return obj


from auth import verify_api_key as require_api_key

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
load_dotenv()

router = APIRouter(prefix="/api/assessment", dependencies=[Depends(require_api_key)])

DB_URL = os.environ.get("DATABASE_URL")
SQLITE_DB_PATH = os.path.join(os.path.dirname(__file__), "assessment_local.db")

_db_pool = None

_RETRYABLE_PG_FRAGMENTS = (
    "ssl connection has been closed",
    "connection is closed",
    "server closed the connection unexpectedly",
    "could not connect to server",
    "ssl syscall error",
    "connection reset by peer",
    "terminating connection due to administrator command",
)

def _is_retryable_pg_error(exc: Exception) -> bool:
    return any(f in str(exc).lower() for f in _RETRYABLE_PG_FRAGMENTS)

def _ping_conn(conn) -> bool:
    if conn.closed != 0:
        return False
    try:
        cur = conn.cursor()
        cur.execute("SELECT 1")
        cur.close()
        return True
    except Exception:
        return False

def _get_pool():
    global _db_pool
    if not DB_URL:
        return None
    if _db_pool is None or _db_pool.closed:
        try:
            from psycopg2.pool import ThreadedConnectionPool
            from config import DB_POOL_MIN_CONNS, DB_POOL_MAX_CONNS
            _db_pool = ThreadedConnectionPool(
                minconn=DB_POOL_MIN_CONNS,
                maxconn=DB_POOL_MAX_CONNS,
                dsn=DB_URL,
            )
        except Exception as e:
            print(f"[DB POOL] Could not connect to PostgreSQL: {e}. Falling back to SQLite.")
            _db_pool = None
    return _db_pool

def _get_live_conn(pool, max_retries: int = 3):
    global _db_pool
    last_err: Exception = RuntimeError("No connection attempts made")

    for attempt in range(max_retries):
        if attempt > 0:
            _time.sleep(0.5)

        try:
            conn = pool.getconn()
        except Exception as err:
            last_err = err
            try:
                pool.closeall()
            except Exception:
                pass
            _db_pool = None
            try:
                from psycopg2.pool import ThreadedConnectionPool
                from config import DB_POOL_MIN_CONNS, DB_POOL_MAX_CONNS
                pool = ThreadedConnectionPool(
                    minconn=DB_POOL_MIN_CONNS,
                    maxconn=DB_POOL_MAX_CONNS,
                    dsn=DB_URL,
                )
                _db_pool = pool
            except Exception as reconnect_err:
                last_err = reconnect_err
            continue

        if _ping_conn(conn):
            return conn

        try:
            import psycopg2
            last_err = psycopg2.OperationalError("Stale pooled connection discarded")
            pool.putconn(conn, close=True)
        except Exception:
            pass

    return None


# ------------------------------------------------------------
# SQLITE COMPATIBILITY LAYER FOR OFFLINE / LOCAL DEVELOPMENT
# ------------------------------------------------------------

def _init_sqlite_db():
    conn = sqlite3.connect(SQLITE_DB_PATH)
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS questions (
            id TEXT PRIMARY KEY,
            category TEXT NOT NULL,
            question_type TEXT DEFAULT 'mcq',
            topic TEXT NOT NULL,
            subtopic TEXT,
            difficulty TEXT NOT NULL,
            question TEXT NOT NULL,
            options TEXT,
            correct_option TEXT,
            answer TEXT,
            explanation TEXT,
            marks INT DEFAULT 1,
            negative_marks REAL DEFAULT 0.25,
            time_limit INT DEFAULT 120,
            estimated_time INT DEFAULT 90,
            blooms_level TEXT DEFAULT 'Understand',
            tags TEXT DEFAULT '[]',
            generator_version TEXT DEFAULT 'v2.0',
            examples TEXT
        );
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS test_sessions (
            session_id TEXT PRIMARY KEY,
            test_id TEXT DEFAULT 'placement_assessment_v1',
            student_roll_number TEXT NOT NULL,
            student_name TEXT DEFAULT 'Student',
            branch TEXT DEFAULT 'CSE',
            year TEXT DEFAULT '4th Year',
            start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            end_time TIMESTAMP,
            status TEXT DEFAULT 'started',
            total_questions INT DEFAULT 62,
            attempted INT DEFAULT 0,
            correct INT DEFAULT 0,
            wrong INT DEFAULT 0,
            unanswered INT DEFAULT 62,
            total_marks REAL DEFAULT 0.00,
            percentage REAL DEFAULT 0.00,
            time_taken INT DEFAULT 0,
            tab_switch_count INT DEFAULT 0,
            fullscreen_exit_count INT DEFAULT 0,
            copy_attempts INT DEFAULT 0,
            suspicious_events TEXT DEFAULT '[]',
            suspicion_score REAL DEFAULT 0.00,
            ip_address TEXT DEFAULT '127.0.0.1',
            browser TEXT DEFAULT 'Web Browser',
            device TEXT DEFAULT 'Desktop',
            questions TEXT DEFAULT '[]',
            answers TEXT DEFAULT '{}',
            coding_submissions TEXT DEFAULT '{}',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS question_responses (
            response_id TEXT PRIMARY KEY,
            session_id TEXT,
            section TEXT NOT NULL,
            question_id TEXT NOT NULL,
            question_text TEXT,
            option_a TEXT,
            option_b TEXT,
            option_c TEXT,
            option_d TEXT,
            selected_option TEXT,
            correct_option TEXT,
            is_correct INT DEFAULT 0,
            marks_awarded REAL DEFAULT 0.00,
            time_spent INT DEFAULT 0,
            difficulty TEXT,
            topic TEXT,
            subtopic TEXT,
            explanation TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS section_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT,
            section_name TEXT NOT NULL,
            questions INT DEFAULT 0,
            attempted INT DEFAULT 0,
            correct INT DEFAULT 0,
            wrong INT DEFAULT 0,
            unanswered INT DEFAULT 0,
            marks REAL DEFAULT 0.00,
            percentage REAL DEFAULT 0.00,
            average_time REAL DEFAULT 0.00
        );
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS violations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            attempt_id TEXT,
            type TEXT,
            details TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS attempts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            roll_number TEXT,
            questions TEXT
        );
    """)
    conn.commit()
    conn.close()

class SQLiteCursorAdapter:
    def __init__(self, conn):
        self.conn = conn
        self.cur = conn.cursor()
        self.description = None
        self._last_returning = None

    def execute(self, query: str, params: tuple = None):
        clean_q = query.strip()
        # Strip Postgres type casts (::text, ::jsonb)
        clean_q = re.sub(r'::[a-zA-Z0-9_]+', '', clean_q)
        # Convert ILIKE to LIKE
        clean_q = re.sub(r'\bILIKE\b', 'LIKE', clean_q, flags=re.IGNORECASE)
        # Convert Postgres placeholders %s to SQLite ?
        clean_q = clean_q.replace('%s', '?')

        sqlite_params = []
        if params is not None:
            for p in params:
                if isinstance(p, (dict, list)):
                    sqlite_params.append(json.dumps(p))
                elif hasattr(p, "adapted"):
                    sqlite_params.append(json.dumps(p.adapted))
                elif isinstance(p, Decimal):
                    sqlite_params.append(float(p))
                else:
                    sqlite_params.append(p)

        try:
            self.cur.execute(clean_q, tuple(sqlite_params))
            self.description = self.cur.description
        except Exception as e:
            if "gen_random_uuid()" in clean_q:
                clean_q = clean_q.replace("gen_random_uuid()", f"'{str(uuid.uuid4())}'")
                self.cur.execute(clean_q, tuple(sqlite_params))
                self.description = self.cur.description
            else:
                raise e
        return self

    def fetchone(self):
        row = self.cur.fetchone()
        if row is None:
            return None
        d = dict(row)
        for k, v in list(d.items()):
            if isinstance(v, str) and (v.startswith('{') or v.startswith('[')):
                try:
                    d[k] = json.loads(v)
                except Exception:
                    pass
            elif k == "start_time" and isinstance(v, str):
                try:
                    d[k] = datetime.fromisoformat(v.replace("Z", "+00:00"))
                except Exception:
                    pass
        return d

    def fetchall(self):
        rows = self.cur.fetchall()
        result = []
        for row in rows:
            d = dict(row)
            for k, v in list(d.items()):
                if isinstance(v, str) and (v.startswith('{') or v.startswith('[')):
                    try:
                        d[k] = json.loads(v)
                    except Exception:
                        pass
                elif k == "start_time" and isinstance(v, str):
                    try:
                        d[k] = datetime.fromisoformat(v.replace("Z", "+00:00"))
                    except Exception:
                        pass
            result.append(d)
        return result

    def close(self):
        self.cur.close()


def _safe_execute_values(db, sql: str, rows: list):
    """Execute batch inserts for both PostgreSQL and SQLite."""
    if not rows:
        return
    if isinstance(db, SQLiteCursorAdapter):
        clean_sql = re.sub(r'::[a-zA-Z0-9_]+', '', sql).strip()
        m = re.search(r'(INSERT\s+INTO\s+[a-zA-Z0-9_]+\s*\([^)]+\)\s*VALUES)', clean_sql, re.IGNORECASE)
        if m:
            prefix = m.group(1)
            col_count = len(rows[0])
            placeholders = "(" + ", ".join(["?"] * col_count) + ")"
            sqlite_sql = f"{prefix} {placeholders};"
            conv_rows = []
            for r in rows:
                conv_r = []
                for val in r:
                    if isinstance(val, (dict, list)):
                        conv_r.append(json.dumps(val))
                    elif hasattr(val, "adapted"):
                        conv_r.append(json.dumps(val.adapted))
                    elif isinstance(val, Decimal):
                        conv_r.append(float(val))
                    else:
                        conv_r.append(val)
                conv_rows.append(tuple(conv_r))
            db.cur.executemany(sqlite_sql, conv_rows)
    else:
        try:
            from psycopg2.extras import execute_values
            execute_values(db, sql, rows)
        except Exception as e:
            print(f"[BATCH INSERT ERROR] {e}")


def ensure_schema():
    """Run DDL migrations at startup to establish tables and indexes."""
    _init_sqlite_db()
    pool = _get_pool()
    if not pool:
        return
    conn = None
    try:
        conn = _get_live_conn(pool)
        if not conn:
            return
        cur = conn.cursor()
        cur.execute("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";")
        
        cur.execute("""
            CREATE TABLE IF NOT EXISTS questions (
                id VARCHAR(100) PRIMARY KEY,
                category VARCHAR(50) NOT NULL,
                question_type VARCHAR(50) DEFAULT 'mcq',
                topic VARCHAR(100) NOT NULL,
                subtopic VARCHAR(100),
                difficulty VARCHAR(20) NOT NULL,
                question TEXT NOT NULL,
                options JSONB,
                correct_option CHAR(1),
                answer TEXT,
                explanation TEXT,
                marks INT DEFAULT 1,
                negative_marks DECIMAL(3, 2) DEFAULT 0.25,
                time_limit INT DEFAULT 120,
                estimated_time INT DEFAULT 90,
                blooms_level VARCHAR(50) DEFAULT 'Understand',
                tags JSONB DEFAULT '[]'::jsonb,
                generator_version VARCHAR(20) DEFAULT 'v2.0',
                examples JSONB
            );
        """)

        cur.execute("""
            CREATE TABLE IF NOT EXISTS test_sessions (
                session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                test_id VARCHAR(100) DEFAULT 'placement_assessment_v1',
                student_roll_number VARCHAR(50) NOT NULL,
                student_name VARCHAR(100) DEFAULT 'Student',
                branch VARCHAR(50) DEFAULT 'CSE',
                year VARCHAR(20) DEFAULT '4th Year',
                start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                end_time TIMESTAMP WITH TIME ZONE,
                status VARCHAR(20) DEFAULT 'started',
                total_questions INT DEFAULT 62,
                attempted INT DEFAULT 0,
                correct INT DEFAULT 0,
                wrong INT DEFAULT 0,
                unanswered INT DEFAULT 62,
                total_marks DECIMAL(7, 2) DEFAULT 0.00,
                percentage DECIMAL(5, 2) DEFAULT 0.00,
                time_taken INT DEFAULT 0,
                tab_switch_count INT DEFAULT 0,
                fullscreen_exit_count INT DEFAULT 0,
                copy_attempts INT DEFAULT 0,
                suspicious_events JSONB DEFAULT '[]'::jsonb,
                suspicion_score DECIMAL(5, 2) DEFAULT 0.00,
                ip_address VARCHAR(50) DEFAULT '127.0.0.1',
                browser TEXT DEFAULT 'Web Browser',
                device VARCHAR(100) DEFAULT 'Desktop',
                questions JSONB DEFAULT '[]'::jsonb,
                answers JSONB DEFAULT '{}'::jsonb,
                coding_submissions JSONB DEFAULT '{}'::jsonb,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)

        cur.execute("""
            CREATE TABLE IF NOT EXISTS question_responses (
                response_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                session_id UUID REFERENCES test_sessions(session_id) ON DELETE CASCADE,
                section VARCHAR(50) NOT NULL,
                question_id VARCHAR(100) NOT NULL,
                question_text TEXT,
                option_a TEXT,
                option_b TEXT,
                option_c TEXT,
                option_d TEXT,
                selected_option VARCHAR(10),
                correct_option VARCHAR(10),
                is_correct BOOLEAN DEFAULT FALSE,
                marks_awarded DECIMAL(5, 2) DEFAULT 0.00,
                time_spent INT DEFAULT 0,
                difficulty VARCHAR(20),
                topic VARCHAR(100),
                subtopic VARCHAR(100),
                explanation TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)

        cur.execute("""
            CREATE TABLE IF NOT EXISTS section_results (
                id SERIAL PRIMARY KEY,
                session_id UUID REFERENCES test_sessions(session_id) ON DELETE CASCADE,
                section_name VARCHAR(50) NOT NULL,
                questions INT DEFAULT 0,
                attempted INT DEFAULT 0,
                correct INT DEFAULT 0,
                wrong INT DEFAULT 0,
                unanswered INT DEFAULT 0,
                marks DECIMAL(7, 2) DEFAULT 0.00,
                percentage DECIMAL(5, 2) DEFAULT 0.00,
                average_time DECIMAL(7, 2) DEFAULT 0.00
            );
        """)

        cur.execute("CREATE TABLE IF NOT EXISTS violations (id SERIAL PRIMARY KEY, attempt_id VARCHAR(100), type VARCHAR(50), details TEXT, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP);")
        cur.execute("CREATE TABLE IF NOT EXISTS attempts (id SERIAL PRIMARY KEY, user_id VARCHAR(100), roll_number VARCHAR(50), questions JSONB);")

        conn.commit()
        cur.close()
    except Exception as e:
        if conn and conn.closed == 0:
            try:
                conn.rollback()
            except Exception:
                pass
        print(f"[MIGRATION WARNING] PostgreSQL ensure_schema fallback: {e}")
    finally:
        if conn:
            try:
                pool.putconn(conn, close=(conn.closed != 0))
            except Exception:
                pass


def get_db_cursor():
    """Yields a database cursor: PostgreSQL pool if online, otherwise local SQLite."""
    pool = _get_pool()
    conn = None
    if pool:
        try:
            conn = _get_live_conn(pool)
        except Exception:
            conn = None

    if conn:
        from psycopg2.extras import RealDictCursor
        cur = conn.cursor(cursor_factory=RealDictCursor)
        is_broken = False
        try:
            yield cur
            if conn.closed == 0:
                conn.commit()
        except Exception as e:
            is_broken = True
            if conn.closed == 0:
                try:
                    conn.rollback()
                except Exception:
                    pass
            raise e
        finally:
            try:
                cur.close()
            except Exception:
                pass
            broken = is_broken or conn.closed != 0
            try:
                pool.putconn(conn, close=broken)
            except Exception:
                pass
    else:
        # Fallback to local SQLite database
        _init_sqlite_db()
        sqlite_conn = sqlite3.connect(SQLITE_DB_PATH)
        sqlite_conn.row_factory = sqlite3.Row
        adapter = SQLiteCursorAdapter(sqlite_conn)
        try:
            yield adapter
            sqlite_conn.commit()
        except Exception as e:
            try:
                sqlite_conn.rollback()
            except Exception:
                pass
            raise e
        finally:
            try:
                adapter.close()
                sqlite_conn.close()
            except Exception:
                pass


# ------------------------------------------------------------
# IN-MEMORY QUESTION CACHE & DIFFICULTY SAMPLING ENGINE
# ------------------------------------------------------------
_IN_MEMORY_QUESTIONS = None

def _load_local_json_fallback_questions() -> List[Dict]:
    possible_paths = [
        os.path.join(os.path.dirname(__file__), "../../../questions.json"),
        os.path.join(os.path.dirname(__file__), "../../questions.json"),
        os.path.join(os.path.dirname(__file__), "../questions.json"),
        "questions.json",
        os.path.join(os.path.dirname(__file__), "../../placement_assessment_mongodb_dataset.json"),
        "placement_assessment_mongodb_dataset.json"
    ]
    path = next((p for p in possible_paths if os.path.exists(p)), None)
    if not path:
        return []
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        flat_qs = []
        if isinstance(data, list):
            # questions.json format
            cat_map = {
                "Quantitative Aptitude (Numerical Ability)": "Aptitude",
                "Logical Reasoning (Analytical Ability)": "Aptitude",
                "Abstract Reasoning (Non-Verbal Reasoning)": "Aptitude",
                "Data Interpretation and Analysis": "Aptitude",
                "Verbal Ability (English Comprehension)": "Verbal",
                "Technical Aptitude (Basic Programming and AIML Concepts)": "Computer_Fundamentals",
            }
            for item in data:
                raw_cat = item.get("category_label") or item.get("category") or ""
                target_cat = cat_map.get(raw_cat, "Aptitude")
                q_dict = {
                    "id": str(item.get("id")),
                    "category": target_cat,
                    "topic": item.get("topic") or "General",
                    "subtopic": item.get("topic"),
                    "difficulty": item.get("difficulty") or "Easy",
                    "question": item.get("question", ""),
                    "options": item.get("options") or [],
                    "correct_option": item.get("correct_option") or "A",
                    "answer": item.get("answer"),
                    "explanation": item.get("solution") or item.get("explanation", ""),
                    "marks": item.get("marks", 1),
                    "negative_marks": item.get("negative_marks", 0.25)
                }
                flat_qs.append(q_dict)
        elif isinstance(data, dict):
            # legacy MongoDB format
            cat_map = {
                "aptitude_questions": "Aptitude",
                "verbal_questions": "Verbal",
                "computer_fundamentals_questions": "Computer_Fundamentals",
                "coding_questions": "Coding"
            }
            for key, cat_name in cat_map.items():
                for item in data.get(key, []):
                    q_dict = {
                        "id": str(item.get("_id") or item.get("id")),
                        "category": cat_name,
                        "topic": item.get("topic", "General"),
                        "difficulty": item.get("difficulty", "Easy"),
                        "question": item.get("question", ""),
                        "options": item.get("options") or [],
                        "correct_option": item.get("correctOption") or item.get("correct_option"),
                        "answer": item.get("answer"),
                        "explanation": item.get("explanation", ""),
                        "marks": item.get("marks", 1),
                        "negative_marks": item.get("negativeMarks", 0.25)
                    }
                    flat_qs.append(q_dict)

        # Load Coding problems from data/topics
        topics_dir = os.path.join(os.path.dirname(__file__), "../data/topics")
        if os.path.exists(topics_dir):
            for fname in os.listdir(topics_dir):
                if fname.endswith(".json"):
                    try:
                        with open(os.path.join(topics_dir, fname), "r", encoding="utf-8") as tf:
                            tdata = json.load(tf)
                            for cp in tdata.get("coding_problems", []):
                                flat_qs.append({
                                    "id": str(cp.get("id")),
                                    "category": "Coding",
                                    "topic": cp.get("title") or tdata.get("topic", "Coding"),
                                    "difficulty": cp.get("difficulty", "Easy"),
                                    "question": cp.get("description", ""),
                                    "options": [],
                                    "correct_option": None,
                                    "examples": cp.get("examples", []),
                                    "answer": json.dumps({
                                        "optimal_code": cp.get("solution_optimal", {}).get("python", ""),
                                        "brute_code": cp.get("solution_regular", {}).get("python", ""),
                                        "time_complexity": cp.get("solution_optimal", {}).get("time_complexity", "O(N)")
                                    }),
                                    "marks": 10,
                                    "negative_marks": 0.0
                                })
                    except Exception:
                        pass

        return flat_qs
    except Exception as e:
        print(f"[OFFLINE FALLBACK] Error loading dataset: {e}")
        return []

def _get_all_questions_cached(cur=None) -> List[Dict]:
    global _IN_MEMORY_QUESTIONS
    if _IN_MEMORY_QUESTIONS is None:
        if cur is not None:
            try:
                cur.execute("SELECT id, question, options, correct_option, category, topic, subtopic, difficulty, marks, negative_marks, examples, answer, explanation, generator_version FROM questions")
                rows = cur.fetchall()
                if rows:
                    _IN_MEMORY_QUESTIONS = [_make_json_serializable(dict(r)) for r in rows]
            except Exception as e:
                print(f"[OFFLINE FALLBACK] DB query for questions: {e}")
        
        if not _IN_MEMORY_QUESTIONS:
            _IN_MEMORY_QUESTIONS = _load_local_json_fallback_questions()
    return _IN_MEMORY_QUESTIONS

def reload_questions_cache(cur=None):
    global _IN_MEMORY_QUESTIONS
    _IN_MEMORY_QUESTIONS = None
    return _get_all_questions_cached(cur)


def _sample_questions_by_difficulty(questions_pool: List[Dict], category: str, count: int, easy_ratio: float = 0.65, exclude_ids: set = None) -> List[Dict]:
    if exclude_ids is None:
        exclude_ids = set()

    cat_targets = {category, category.replace("_", " "), category.replace(" ", "_")}
    cat_qs = [q for q in questions_pool if q.get("category") in cat_targets and q.get("id") not in exclude_ids]
    if not cat_qs:
        return []
    
    easy_qs = [q for q in cat_qs if str(q.get("difficulty", "")).lower() in ("easy", "beginner")]
    easy_ids = {q.get("id") for q in easy_qs}
    hard_qs = [q for q in cat_qs if q.get("id") not in easy_ids]
    
    target_easy = int(round(count * easy_ratio))
    target_hard = count - target_easy
    
    selected_easy = []
    if easy_qs:
        sample_size = min(len(easy_qs), target_easy)
        selected_easy = random.sample(easy_qs, sample_size)
            
    selected_hard = []
    if hard_qs:
        sample_size = min(len(hard_qs), target_hard)
        selected_hard = random.sample(hard_qs, sample_size)
            
    result = selected_easy + selected_hard
    selected_ids = {q.get("id") for q in result}

    if len(result) < count:
        remaining_needed = count - len(result)
        available = [q for q in cat_qs if q.get("id") not in selected_ids]
        if available:
            sample_size = min(len(available), remaining_needed)
            result.extend(random.sample(available, sample_size))
            
    for q in result:
        exclude_ids.add(q.get("id"))

    random.shuffle(result)
    return result[:count]


BANNED_FILLER_PATTERNS = [
    r"none\s+of\s+these",
    r"none\s+of\s+the\s+above",
    r"data\s+inadequate",
    r"cannot\s+be\s+determined",
    r"can't\s+say",
    r"insufficient\s+data",
    r"all\s+of\s+the\s+above"
]

def _is_filler_option(opt_str: str) -> bool:
    s = str(opt_str).strip().lower()
    return any(re.search(pat, s) for pat in BANNED_FILLER_PATTERNS)

def _clean_and_generate_tricky_distractors(q: Dict) -> Dict:
    q = _make_json_serializable(dict(q))

    cat = str(q.get("category", "")).lower()
    if cat == "coding" or q.get("type") == "coding":
        return q

    stem = str(q.get("question", "")).strip()
    if stem:
        q["question"] = re.sub(r'\s*Placement variant\s+[A-Z\-_]+-\d+\.?', '', stem, flags=re.IGNORECASE).strip()

    raw_options = q.get("options") or []
    if not isinstance(raw_options, list) or not raw_options:
        return q

    options = [str(o).strip() for o in raw_options if o is not None]
    correct_letter = str(q.get("correct_option", "A")).strip().upper()
    correct_idx = ord(correct_letter) - ord('A') if len(correct_letter) == 1 and 'A' <= correct_letter <= 'Z' else 0

    if 0 <= correct_idx < len(options):
        correct_text = options[correct_idx]
    else:
        correct_text = str(q.get("answer", "")).strip() or (options[0] if options else "Standard Option")

    if _is_filler_option(correct_text):
        if "odd one out" in stem.lower():
            items = re.findall(r'\b[A-Za-z0-9_]+\b', stem)
            correct_text = items[-1] if items else "Circle"
        else:
            correct_text = "Standard Option"

    valid_distractors = [opt for opt in options if opt != correct_text and not _is_filler_option(opt)]

    if "odd one out" in stem.lower():
        match = re.search(r'odd\s+one\s+out[:\s]+(.*)', stem, re.IGNORECASE)
        items = []
        if match:
            raw_items = re.split(r'[,:]\s*|\s+and\s+', match.group(1).replace("?", ""))
            items = [it.strip() for it in raw_items if it.strip()]
        if len(items) >= 4:
            valid_distractors = [it for it in items if it != correct_text]

    num_match = re.search(r'^([\d,]+(?:\.\d+)?)\s*(.*)$', correct_text)
    if num_match and len(valid_distractors) < 3:
        num_str, unit = num_match.group(1).replace(",", ""), num_match.group(2).strip()
        try:
            val = float(num_str)
            is_int = val.is_integer()
            if is_int:
                v_int = int(val)
                diffs = [
                    int(round(v_int * 0.9)),
                    int(round(v_int * 1.1)),
                    int(round(v_int * 1.25)),
                    v_int - 2, v_int + 2
                ]
                synth_opts = [f"{d:,} {unit}".strip() if "," in correct_text else f"{d} {unit}".strip() for d in diffs if d != v_int and d > 0]
            else:
                diffs = [round(val * 0.9, 2), round(val * 1.1, 2), round(val * 1.15, 2), round(val - 1.5, 2)]
                synth_opts = [f"{d} {unit}".strip() for d in diffs if d != val and d > 0]

            for s_opt in synth_opts:
                if s_opt not in valid_distractors and s_opt != correct_text:
                    valid_distractors.append(s_opt)
        except ValueError:
            pass

    if correct_text.isdigit() and len(valid_distractors) < 3:
        val = int(correct_text)
        candidates = [str(val + 1), str(max(0, val - 1)), str(val * 2), "0", "1", "Compilation Error"]
        for c in candidates:
            if c != correct_text and c not in valid_distractors:
                valid_distractors.append(c)

    fallback_words = ["Option A", "Option B", "Option C", "Option D"]
    while len(valid_distractors) < 3:
        for f in fallback_words:
            if f != correct_text and f not in valid_distractors:
                valid_distractors.append(f)
                break

    final_4 = [correct_text] + valid_distractors[:3]
    random.shuffle(final_4)
    q["options"] = final_4
    try:
        new_idx = final_4.index(correct_text)
        q["correct_option"] = chr(ord('A') + new_idx)
    except ValueError:
        q["correct_option"] = "A"

    return q


def _prepare_candidate_question(q_raw: Dict) -> Dict:
    """Option shuffling, filler distractor elimination, and stem normalization."""
    return _clean_and_generate_tricky_distractors(q_raw)


def _sanitize_questions_for_candidate(questions: List[Dict]) -> List[Dict]:
    """Strips correct options, answers, and explanations from questions before delivering payload to frontend."""
    sanitized = []
    for q in questions:
        q_copy = _make_json_serializable(dict(q))
        q_copy.pop("correct_option", None)
        q_copy.pop("answer", None)
        q_copy.pop("explanation", None)
        sanitized.append(q_copy)
    return sanitized


def _calculate_suspicion_score(events: List[Dict], violation_count: int) -> float:
    """Compute a composite suspicion score (0-100) based on cheating event telemetry."""
    score = 0.0
    for e in events:
        t = str(e.get("type", "")).lower()
        if "tab" in t:
            score += 15.0
        elif "blur" in t:
            score += 10.0
        elif "fullscreen" in t:
            score += 20.0
        elif "devtools" in t or "shortcut" in t:
            score += 30.0
        elif "copy" in t or "paste" in t:
            score += 15.0
        elif "screen" in t:
            score += 20.0
        else:
            score += 10.0
    score += violation_count * 10.0
    return min(100.0, round(score, 2))


# Pydantic Schemas
class StartAttemptRequest(BaseModel):
    user_id: Optional[str] = Field(None, max_length=100)
    roll_number: Optional[str] = Field(None, max_length=50)
    student_name: Optional[str] = Field(default="Student", max_length=100)
    branch: Optional[str] = Field(default="CSE", max_length=50)
    year: Optional[str] = Field(default="4th Year", max_length=20)
    browser_info: Dict = Field(default_factory=dict)

class ResetAttemptsRequest(BaseModel):
    user_id: str = Field(..., max_length=100)

class ResumeAttemptRequest(BaseModel):
    user_id: str = Field(..., max_length=100)

class LogViolationRequest(BaseModel):
    attempt_id: str = Field(..., max_length=100)
    violation_type: str = Field(..., max_length=50)
    details: str = Field(..., max_length=1000)

class AutoSaveRequest(BaseModel):
    attempt_id: str = Field(..., max_length=100)
    answers: Dict = Field(default_factory=dict)
    coding_submissions: Dict = Field(default_factory=dict)

class SubmitAttemptRequest(BaseModel):
    attempt_id: str = Field(..., max_length=100)
    answers: Dict = Field(default_factory=dict)
    coding_submissions: Dict = Field(default_factory=dict)

SubmitTestRequest = SubmitAttemptRequest


@router.post("/reset")
def reset_attempts(req: ResetAttemptsRequest, db=Depends(get_db_cursor)):
    db.execute(
        "DELETE FROM test_sessions WHERE student_roll_number = %s OR student_roll_number = %s",
        (req.user_id, req.user_id)
    )
    db.execute(
        "DELETE FROM attempts WHERE user_id = %s OR roll_number = %s",
        (req.user_id, req.user_id)
    )
    return {"status": "success", "message": "Test session reset successfully."}


@router.post("/start")
def start_attempt(req: StartAttemptRequest, db=Depends(get_db_cursor)):
    raw_roll = req.roll_number or req.user_id or ""
    clean_roll = raw_roll.strip().upper()
    
    if not clean_roll:
        raise HTTPException(
            status_code=400,
            detail="Roll number is required. Please enter a valid roll number."
        )

    if not re.match(r'^[A-Z0-9]{8,12}$', clean_roll):
        raise HTTPException(
            status_code=400,
            detail="Invalid Roll Number format. Expected format e.g.: 23E51A0561, 24E51A66E1"
        )

    # Check for active 'started' session in test_sessions
    db.execute(
        """
        SELECT session_id, start_time, questions, answers, coding_submissions, student_name, branch, year
        FROM test_sessions
        WHERE student_roll_number = %s AND status = 'started'
        """,
        (clean_roll,)
    )
    active_session = db.fetchone()
    if active_session:
        start_t = active_session.get("start_time")
        if start_t:
            if isinstance(start_t, str):
                try:
                    start_t = datetime.fromisoformat(start_t.replace("Z", "+00:00"))
                except Exception:
                    start_t = datetime.now(timezone.utc)
            if start_t.tzinfo is None:
                start_t = start_t.replace(tzinfo=timezone.utc)
            elapsed = datetime.now(timezone.utc) - start_t
        else:
            elapsed = timedelta(seconds=0)
        remaining = 7200 - int(elapsed.total_seconds())
        if remaining > 0:
            saved_questions = _make_json_serializable(active_session.get("questions") or [])
            sanitized_qs = _sanitize_questions_for_candidate(saved_questions)
            return {
                "attempt_id": str(active_session["session_id"]),
                "session_id": str(active_session["session_id"]),
                "duration": remaining,
                "questions": sanitized_qs,
                "roll_number": clean_roll,
                "student_name": active_session.get("student_name", req.student_name),
                "branch": active_session.get("branch", req.branch),
                "saved_answers": active_session.get("answers") or {},
                "saved_coding_submissions": active_session.get("coding_submissions") or {}
            }

    # Sample questions (20 Aptitude, 20 Verbal, 20 CS Fundamentals, 2 Coding)
    pool = reload_questions_cache(db)

    used_ids = set()
    aptitude_raw = _sample_questions_by_difficulty(pool, 'Aptitude', 20, easy_ratio=0.65, exclude_ids=used_ids)
    verbal_raw = _sample_questions_by_difficulty(pool, 'Verbal', 20, easy_ratio=0.65, exclude_ids=used_ids)
    comp_raw = _sample_questions_by_difficulty(pool, 'Computer_Fundamentals', 20, easy_ratio=0.65, exclude_ids=used_ids)
    
    coding_pool = [q for q in pool if q.get("category") == "Coding" and q.get("id") not in used_ids]
    easy_coding = [q for q in coding_pool if str(q.get("difficulty", "")).lower() == "easy"]
    medium_coding = [q for q in coding_pool if str(q.get("difficulty", "")).lower() in ("medium", "hard")]

    selected_easy_coding = random.sample(easy_coding, 1) if easy_coding else []
    selected_med_coding = random.sample(medium_coding, 1) if medium_coding else []

    coding_selected = selected_easy_coding + selected_med_coding
    if len(coding_selected) < 2 and coding_pool:
        remaining_needed = 2 - len(coding_selected)
        avail = [q for q in coding_pool if q.get("id") not in {cq.get("id") for cq in coding_selected}]
        if avail:
            coding_selected.extend(random.sample(avail, min(len(avail), remaining_needed)))
    
    raw_questions = aptitude_raw + verbal_raw + comp_raw + coding_selected
    candidate_questions = [_prepare_candidate_question(q) for q in raw_questions]
    serializable_candidate_qs = _make_json_serializable(candidate_questions)

    session_id = str(uuid.uuid4())

    db.execute(
        """
        INSERT INTO test_sessions (
            session_id, test_id, student_roll_number, student_name, branch, year,
            status, total_questions, unanswered, browser, questions
        )
        VALUES (%s, 'placement_assessment_v1', %s, %s, %s, %s, 'started', %s, %s, %s, %s);
        """,
        (
            session_id,
            clean_roll,
            (req.student_name or "Student")[:100],
            (req.branch or "CSE")[:50],
            (req.year or "4th Year")[:20],
            len(serializable_candidate_qs),
            len(serializable_candidate_qs),
            str(req.browser_info.get("user_agent", "Web Browser"))[:500],
            serializable_candidate_qs
        )
    )

    sanitized_qs = _sanitize_questions_for_candidate(serializable_candidate_qs)

    return {
        "attempt_id": session_id,
        "session_id": session_id,
        "duration": 7200,
        "questions": sanitized_qs,
        "roll_number": clean_roll,
        "student_name": req.student_name,
        "branch": req.branch,
        "saved_answers": {},
        "saved_coding_submissions": {}
    }


@router.post("/resume")
def resume_attempt(req: ResumeAttemptRequest, db=Depends(get_db_cursor)):
    clean_roll = req.user_id.strip().upper()
    db.execute(
        """
        SELECT session_id, start_time, questions, answers, coding_submissions, student_name, branch, year
        FROM test_sessions
        WHERE student_roll_number = %s AND status = 'started'
        ORDER BY start_time DESC LIMIT 1;
        """,
        (clean_roll,)
    )
    active_session = db.fetchone()
    if not active_session:
        return {"has_active_session": False}

    start_t = active_session.get("start_time")
    if start_t:
        if isinstance(start_t, str):
            try:
                start_t = datetime.fromisoformat(start_t.replace("Z", "+00:00"))
            except Exception:
                start_t = datetime.now(timezone.utc)
        if start_t.tzinfo is None:
            start_t = start_t.replace(tzinfo=timezone.utc)
        elapsed = datetime.now(timezone.utc) - start_t
    else:
        elapsed = timedelta(seconds=0)

    remaining = 7200 - int(elapsed.total_seconds())
    if remaining <= 0:
        db.execute("UPDATE test_sessions SET status = 'completed' WHERE session_id::text = %s", (str(active_session["session_id"]),))
        return {"has_active_session": False, "reason": "Time limit expired."}

    saved_questions = _make_json_serializable(active_session.get("questions") or [])
    sanitized_qs = _sanitize_questions_for_candidate(saved_questions)

    return {
        "has_active_session": True,
        "attempt_id": str(active_session["session_id"]),
        "session_id": str(active_session["session_id"]),
        "duration": remaining,
        "questions": sanitized_qs,
        "roll_number": clean_roll,
        "student_name": active_session.get("student_name"),
        "branch": active_session.get("branch"),
        "saved_answers": active_session.get("answers") or {},
        "saved_coding_submissions": active_session.get("coding_submissions") or {}
    }


@router.post("/log-violation")
def log_violation(req: LogViolationRequest, db=Depends(get_db_cursor)):
    db.execute(
        "INSERT INTO violations (attempt_id, type, details) VALUES (%s, %s, %s)",
        (req.attempt_id, req.violation_type, req.details)
    )

    db.execute("SELECT count(*) as count FROM violations WHERE attempt_id = %s", (req.attempt_id,))
    v_count_row = db.fetchone()
    v_count = v_count_row["count"] if v_count_row else 1

    db.execute(
        """
        SELECT tab_switch_count, fullscreen_exit_count, copy_attempts, suspicious_events
        FROM test_sessions
        WHERE session_id::text = %s
        """,
        (req.attempt_id,)
    )
    session_row = db.fetchone()
    if session_row:
        events = session_row.get("suspicious_events") or []
        events.append({
            "type": req.violation_type,
            "details": req.details,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
        suspicion_score = _calculate_suspicion_score(events, v_count)

        tab_switches = session_row.get("tab_switch_count", 0) + (1 if "tab" in req.violation_type.lower() else 0)
        fs_exits = session_row.get("fullscreen_exit_count", 0) + (1 if "fullscreen" in req.violation_type.lower() else 0)
        copies = session_row.get("copy_attempts", 0) + (1 if "copy" in req.violation_type.lower() else 0)

        db.execute(
            """
            UPDATE test_sessions
            SET tab_switch_count = %s,
                fullscreen_exit_count = %s,
                copy_attempts = %s,
                suspicion_score = %s,
                suspicious_events = %s
            WHERE session_id::text = %s
            """,
            (tab_switches, fs_exits, copies, suspicion_score, events, req.attempt_id)
        )

    disqualified = v_count >= 5
    if disqualified:
        db.execute(
            "UPDATE test_sessions SET status = 'disqualified', end_time = CURRENT_TIMESTAMP WHERE session_id::text = %s",
            (req.attempt_id,)
        )

    return {
        "status": "logged",
        "violation_count": v_count,
        "disqualified": disqualified
    }


@router.post("/autosave")
def auto_save(req: AutoSaveRequest, db=Depends(get_db_cursor)):
    db.execute(
        """
        UPDATE test_sessions
        SET answers = %s,
            coding_submissions = %s
        WHERE session_id::text = %s;
        """,
        (
            req.answers or {},
            req.coding_submissions or {},
            req.attempt_id
        )
    )
    return {"status": "saved"}


@router.post("/submit")
def submit_test(req: SubmitTestRequest, db=Depends(get_db_cursor)):
    db.execute(
        """
        SELECT session_id, student_roll_number, student_name, branch, year, start_time, status, questions
        FROM test_sessions
        WHERE session_id::text = %s;
        """,
        (req.attempt_id,)
    )
    session = db.fetchone()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if session["status"] == "completed":
        raise HTTPException(status_code=400, detail="Assessment has already been submitted.")

    # Server-side assessment duration check (Max duration 7200s + 300s grace period)
    start_t = session.get("start_time")
    if start_t:
        if isinstance(start_t, str):
            try:
                start_t = datetime.fromisoformat(start_t.replace("Z", "+00:00"))
            except Exception:
                start_t = datetime.now(timezone.utc)
        if start_t.tzinfo is None:
            start_t = start_t.replace(tzinfo=timezone.utc)
        elapsed_seconds = (datetime.now(timezone.utc) - start_t).total_seconds()
        if elapsed_seconds > (7200 + 300):
            db.execute("UPDATE test_sessions SET status = 'completed' WHERE session_id::text = %s", (str(session["session_id"]),))
            raise HTTPException(status_code=403, detail="Assessment deadline has expired. Submissions are no longer accepted.")


    final_status = "disqualified" if session.get("status") == "disqualified" else "completed"

    saved_questions = session.get("questions") or []
    report_questions = {q["id"]: q for q in saved_questions if isinstance(q, dict) and "id" in q}

    section_breakdown = {
        "Aptitude": {"questions": 0, "attempted": 0, "correct": 0, "wrong": 0, "marks": 0.0},
        "Verbal": {"questions": 0, "attempted": 0, "correct": 0, "wrong": 0, "marks": 0.0},
        "Computer_Fundamentals": {"questions": 0, "attempted": 0, "correct": 0, "wrong": 0, "marks": 0.0},
        "Coding": {"questions": 0, "attempted": 0, "correct": 0, "wrong": 0, "marks": 0.0}
    }

    detailed_report = []
    response_rows = []

    for q_id, q_meta in report_questions.items():
        sec = q_meta.get("category", "Aptitude")
        if sec not in section_breakdown:
            section_breakdown[sec] = {"questions": 0, "attempted": 0, "correct": 0, "wrong": 0, "marks": 0.0}
        section_breakdown[sec]["questions"] += 1

        is_coding = (sec == "Coding")
        user_ans = req.answers.get(q_id, "")
        sub_coding = req.coding_submissions.get(q_id, {})

        is_attempted = bool(user_ans or sub_coding.get("code"))
        if is_attempted:
            section_breakdown[sec]["attempted"] += 1

        is_correct = False
        marks_awarded = 0.0
        coding_meta = {}

        if is_coding:
            passed = sub_coding.get("passed_cases", 0)
            total = sub_coding.get("total_cases", 1)
            is_correct = (passed == total and total > 0)
            marks_awarded = float(q_meta.get("marks", 10)) if is_correct else 0.0
            
            try:
                sols = json.loads(q_meta["answer"]) if isinstance(q_meta.get("answer"), str) else (q_meta.get("answer") or {})
            except Exception:
                sols = {}

            coding_meta = {
                "user_code": sub_coding.get("code", ""),
                "optimal_code": sols.get("optimal_code", ""),
                "brute_code": sols.get("brute_code", ""),
                "time_complexity": sols.get("time_complexity", "O(N)"),
                "passed_cases": passed,
                "total_cases": total
            }
        else:
            correct_opt = q_meta.get("correct_option", "A")
            is_correct = (user_ans == correct_opt)
            if is_attempted:
                if is_correct:
                    marks_awarded = float(q_meta.get("marks", 1))
                else:
                    marks_awarded = 0.0

        if is_correct:
            section_breakdown[sec]["correct"] += 1
        elif is_attempted:
            section_breakdown[sec]["wrong"] += 1

        section_breakdown[sec]["marks"] += marks_awarded

        opts = q_meta.get("options") or []
        detailed_report.append({
            "id": q_id,
            "category": sec,
            "topic": q_meta.get("topic"),
            "difficulty": q_meta.get("difficulty"),
            "question": q_meta.get("question"),
            "options": opts,
            "correct_option": q_meta.get("correct_option") if not is_coding else None,
            "explanation": q_meta.get("explanation", ""),
            "user_answer": user_ans,
            "is_correct": is_correct,
            "marks_awarded": round(marks_awarded, 2),
            "coding_details": coding_meta if is_coding else None
        })

        response_rows.append((
            str(uuid.uuid4()),
            str(session["session_id"]),
            sec,
            q_id,
            q_meta.get("question"),
            opts[0] if len(opts) > 0 else None,
            opts[1] if len(opts) > 1 else None,
            opts[2] if len(opts) > 2 else None,
            opts[3] if len(opts) > 3 else None,
            user_ans,
            q_meta.get("correct_option"),
            1 if is_correct else 0,
            round(marks_awarded, 2),
            q_meta.get("difficulty", "Medium"),
            q_meta.get("topic", "General"),
            q_meta.get("explanation", "")
        ))

    score_total = sum(sec_data["marks"] for sec_data in section_breakdown.values())
    total_q_count = len(report_questions)
    total_attempted = sum(sec_data["attempted"] for sec_data in section_breakdown.values())
    total_correct = sum(sec_data["correct"] for sec_data in section_breakdown.values())
    total_wrong = sum(sec_data["wrong"] for sec_data in section_breakdown.values())
    unanswered_count = total_q_count - total_attempted
    max_marks = float(total_q_count)
    percentage = round((score_total / max_marks * 100.0), 2) if max_marks > 0 else 0.0

    # Save to test_sessions table
    db.execute(
        """
        UPDATE test_sessions
        SET status = %s,
            end_time = CURRENT_TIMESTAMP,
            answers = %s,
            coding_submissions = %s,
            attempted = %s,
            correct = %s,
            wrong = %s,
            unanswered = %s,
            total_marks = %s,
            percentage = %s
        WHERE session_id::text = %s;
        """,
        (
            final_status,
            req.answers or {},
            req.coding_submissions or {},
            total_attempted,
            total_correct,
            total_wrong,
            unanswered_count,
            round(score_total, 2),
            percentage,
            str(session["session_id"])
        )
    )

    # Save section_results
    for sec_name, sec_info in section_breakdown.items():
        if sec_info["questions"] > 0:
            sec_pct = round((sec_info["marks"] / float(sec_info["questions"])) * 100.0, 2)
            db.execute(
                """
                INSERT INTO section_results (session_id, section_name, questions, attempted, correct, wrong, unanswered, marks, percentage)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);
                """,
                (
                    str(session["session_id"]),
                    sec_name,
                    sec_info["questions"],
                    sec_info["attempted"],
                    sec_info["correct"],
                    sec_info["wrong"],
                    sec_info["questions"] - sec_info["attempted"],
                    round(sec_info["marks"], 2),
                    sec_pct
                )
            )

    # Save question_responses
    if response_rows:
        _safe_execute_values(
            db,
            """
            INSERT INTO question_responses (
                response_id, session_id, section, question_id, question_text,
                option_a, option_b, option_c, option_d,
                selected_option, correct_option, is_correct, marks_awarded,
                difficulty, topic, explanation
            )
            VALUES %s;
            """,
            response_rows
        )

    return {
        "status": "success",
        "score": {
            "aptitude": round(section_breakdown.get("Aptitude", {}).get("marks", 0.0), 2),
            "verbal": round(section_breakdown.get("Verbal", {}).get("marks", 0.0), 2),
            "comp_fundamentals": round(section_breakdown.get("Computer_Fundamentals", {}).get("marks", 0.0), 2),
            "coding": round(section_breakdown.get("Coding", {}).get("marks", 0.0), 2),
            "total": round(score_total, 2),
            "percentage": percentage
        },
        "report": detailed_report
    }


# ------------------------------------------------------------
# ANALYTICS & ADMIN DASHBOARD ENDPOINTS
# ------------------------------------------------------------

@router.get("/analytics/{session_id}")
def get_session_analytics(session_id: str, db=Depends(get_db_cursor)):
    """Fetch comprehensive post-assessment analytics."""
    db.execute(
        """
        SELECT session_id, test_id, student_roll_number, student_name, branch, year,
               start_time, end_time, status, total_questions, attempted, correct, wrong, unanswered,
               total_marks, percentage, suspicion_score, suspicious_events
        FROM test_sessions
        WHERE session_id::text = %s;
        """,
        (session_id,)
    )
    session = db.fetchone()
    if not session:
        raise HTTPException(status_code=404, detail="Session analytics not found")

    db.execute(
        """
        SELECT section_name, questions, attempted, correct, wrong, unanswered, marks, percentage
        FROM section_results
        WHERE session_id::text = %s;
        """,
        (session_id,)
    )
    sections = db.fetchall()

    db.execute(
        """
        SELECT topic, is_correct, count(*) as count
        FROM question_responses
        WHERE session_id::text = %s
        GROUP BY topic, is_correct;
        """,
        (session_id,)
    )
    topic_stats = db.fetchall()

    strong_topics = list({t["topic"] for t in topic_stats if t.get("is_correct")})
    weak_topics = list({t["topic"] for t in topic_stats if not t.get("is_correct") and t.get("topic") not in strong_topics})

    return {
        "session": session,
        "sections": sections,
        "strong_topics": strong_topics[:5],
        "weak_topics": weak_topics[:5],
        "accuracy": round((session["correct"] / float(session["attempted"]) * 100.0) if session["attempted"] > 0 else 0.0, 2),
        "recommendation": "Focus review on: " + (", ".join(weak_topics[:3]) if weak_topics else "Advanced Problem Solving")
    }


@router.get("/admin/sessions")
def get_admin_sessions(
    search: Optional[str] = None,
    status: Optional[str] = None,
    branch: Optional[str] = None,
    db=Depends(get_db_cursor)
):
    """Admin search & filter interface across test sessions."""
    query = """
        SELECT session_id, student_roll_number, student_name, branch, year,
               start_time, end_time, status, total_marks, percentage, suspicion_score
        FROM test_sessions
        WHERE 1=1
    """
    params = []

    if search:
        query += " AND (student_roll_number ILIKE %s OR student_name ILIKE %s)"
        params.extend([f"%{search}%", f"%{search}%"])
    if status:
        query += " AND status = %s"
        params.append(status)
    if branch:
        query += " AND branch = %s"
        params.append(branch)

    query += " ORDER BY start_time DESC LIMIT 100;"
    db.execute(query, tuple(params))
    rows = db.fetchall()
    return {"sessions": rows}


@router.get("/admin/session/{session_id}")
def get_admin_session_detail(session_id: str, db=Depends(get_db_cursor)):
    """Timeline audit replay & detailed response breakdown for proctors."""
    db.execute("SELECT * FROM test_sessions WHERE session_id::text = %s;", (session_id,))
    session = db.fetchone()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    db.execute("SELECT * FROM question_responses WHERE session_id::text = %s ORDER BY created_at ASC;", (session_id,))
    responses = db.fetchall()

    return {
        "session": session,
        "responses": responses,
        "suspicious_events": session.get("suspicious_events") or []
    }


@router.get("/admin/export")
def export_admin_sessions_csv(db=Depends(get_db_cursor)):
    """Export student assessment results to CSV."""
    db.execute(
        """
        SELECT student_roll_number, student_name, branch, year, status,
               total_marks, percentage, attempted, correct, wrong, suspicion_score, start_time
        FROM test_sessions
        ORDER BY start_time DESC;
        """
    )
    rows = db.fetchall()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Roll Number", "Student Name", "Branch", "Year", "Status",
        "Total Marks", "Percentage", "Attempted", "Correct", "Wrong", "Suspicion Score", "Start Time"
    ])
    for r in rows:
        writer.writerow([
            r["student_roll_number"], r["student_name"], r["branch"], r["year"], r["status"],
            r["total_marks"], r["percentage"], r["attempted"], r["correct"], r["wrong"], r["suspicion_score"], r["start_time"]
        ])

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=placement_assessment_results.csv"}
    )


class GetHintRequest(BaseModel):
    question_id: str

@router.post("/hint")
def get_coding_hint(req: GetHintRequest, db=Depends(get_db_cursor)):
    db.execute("SELECT question, hint FROM questions WHERE id = %s", (req.question_id,))
    row = db.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Question not found")
        
    if row.get("hint") and row["hint"].strip():
        return {"hint": row["hint"].strip()}
        
    return {"hint": "Identify the primary data structure or pattern (e.g. Hash Table, Two Pointers, Dynamic Programming)."}
