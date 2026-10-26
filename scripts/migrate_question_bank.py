"""Apply question-bank schema migration to local SQLite or configured PostgreSQL.

Default mode targets DATABASE_URL. Use --local-sqlite to target the existing
development assessment DB without connecting to any external service.
"""

from __future__ import annotations

import argparse
import os
import sqlite3
import sys
from pathlib import Path

from dotenv import load_dotenv


ROOT = Path(__file__).resolve().parents[1]
BACKEND = ROOT / "backend"
SQL_MIGRATION = BACKEND / "migrations" / "004_admin_question_bank.sql"
LOCAL_DB = BACKEND / "placement_assessment_system" / "assessment_local.db"


def migrate_sqlite(path: Path) -> None:
    sys.path.insert(0, str(BACKEND))
    from placement_assessment_system.api import SQLiteCursorAdapter
    from placement_assessment_system.question_bank_admin import ensure_question_bank_schema

    conn = sqlite3.connect(path)
    try:
        conn.row_factory = sqlite3.Row
        adapter = SQLiteCursorAdapter(conn)
        ensure_question_bank_schema(adapter)
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def migrate_postgres() -> None:
    import psycopg2

    load_dotenv(BACKEND / ".env", override=False)
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL is not configured")
    conn = psycopg2.connect(database_url, connect_timeout=8)
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(SQL_MIGRATION.read_text(encoding="utf-8"))
    finally:
        conn.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--local-sqlite", action="store_true", help="migrate the existing local development DB")
    parser.add_argument("--path", type=Path, default=LOCAL_DB, help="SQLite path when --local-sqlite is used")
    args = parser.parse_args()
    if args.local_sqlite:
        migrate_sqlite(args.path)
        print(f"Question-bank migration applied to local SQLite ({args.path.name}).")
    else:
        migrate_postgres()
        print("Question-bank PostgreSQL migration applied.")
