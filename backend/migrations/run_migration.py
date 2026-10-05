"""
backend/migrations/run_migration.py
One-click migration runner — runs a numbered SQL file against Neon.
Usage:
    python backend/migrations/run_migration.py               # runs ALL pending
    python backend/migrations/run_migration.py 003           # runs 003_*.sql only
"""
import os
import sys
import glob
import psycopg2
from dotenv import load_dotenv

# Load .env from backend/ folder
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(SCRIPT_DIR)
load_dotenv(os.path.join(BACKEND_DIR, ".env"))

DB_URL = os.environ.get("DATABASE_URL")
if not DB_URL:
    print("ERROR: DATABASE_URL not set. Add it to backend/.env")
    sys.exit(1)

def run_sql_file(path: str, cur, conn):
    with open(path, "r", encoding="utf-8") as f:
        sql = f.read()
    try:
        cur.execute(sql)
        conn.commit()
        print(f"  [OK]   {os.path.basename(path)}")
    except Exception as e:
        conn.rollback()
        print(f"  [FAIL] {os.path.basename(path)}: {e}")
        raise

def main():
    target_prefix = sys.argv[1] if len(sys.argv) > 1 else None

    pattern = os.path.join(SCRIPT_DIR, "0*.sql")
    files = sorted(glob.glob(pattern))

    # Exclude rollback files
    files = [f for f in files if "rollback" not in os.path.basename(f).lower()]

    if target_prefix:
        files = [f for f in files if os.path.basename(f).startswith(target_prefix)]

    if not files:
        print("No migration files found matching criteria.")
        return

    print(f"\nConnecting to Neon DB...")
    conn = psycopg2.connect(DB_URL)
    conn.autocommit = False
    cur = conn.cursor()

    # Ensure migrations tracking table exists
    cur.execute("""
        CREATE TABLE IF NOT EXISTS _migrations (
            filename TEXT PRIMARY KEY,
            applied_at TIMESTAMPTZ DEFAULT NOW()
        );
    """)
    conn.commit()

    print(f"\nRunning {len(files)} migration(s):\n")
    skipped = 0
    for f in files:
        fname = os.path.basename(f)
        cur.execute("SELECT 1 FROM _migrations WHERE filename = %s", (fname,))
        if cur.fetchone():
            print(f"  [SKIP] {fname} (already applied, skipping)")
            skipped += 1
            continue
        run_sql_file(f, cur, conn)
        cur.execute("INSERT INTO _migrations (filename) VALUES (%s)", (fname,))
        conn.commit()

    cur.close()
    conn.close()
    print(f"\nDone. Applied: {len(files) - skipped}, Skipped: {skipped}")

if __name__ == "__main__":
    main()
