import os, sys, psycopg2
from dotenv import load_dotenv

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
DB_URL = os.environ.get("DATABASE_URL")

def main():
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()

    cur.execute("""
        DELETE FROM questions
        WHERE generator_version IS NULL OR generator_version != 'v3.2_curated_60';
    """)
    deleted = cur.rowcount
    conn.commit()

    cur.execute("SELECT category, difficulty, COUNT(*) FROM questions GROUP BY category, difficulty ORDER BY category, difficulty;")
    rows = cur.fetchall()

    print("=" * 60)
    print(f"ACTIVE QUESTION POOL ISOLATED (Removed older: {deleted})")
    print("Exact Breakdown of Active Questions in DB:")
    for cat, diff, cnt in rows:
        print(f"  - {cat} [{diff}]: {cnt}")
    print("=" * 60)

    cur.close()
    conn.close()

if __name__ == "__main__":
    main()
