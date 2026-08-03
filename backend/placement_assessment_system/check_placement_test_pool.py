import os, sys, psycopg2
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
DB_URL = os.environ.get("DATABASE_URL")

def main():
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()

    cur.execute("SELECT COUNT(*) FROM questions;")
    total = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM questions WHERE generator_version = 'v3.2_curated_60';")
    curated = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM questions WHERE generator_version != 'v3.2_curated_60' OR generator_version IS NULL;")
    older = cur.fetchone()[0]

    print("=" * 50)
    print("PLACEMENT ASSESSMENT QUESTION POOL DIAGNOSTIC")
    print("=" * 50)
    print(f"Total questions currently in DB : {total}")
    print(f"Newly fed 60 curated questions   : {curated}")
    print(f"Older/Other questions in DB      : {older}")
    print("-" * 50)
    
    if older > 0:
        print("RESULT: ❌ NO! Placement test is currently drawing from ALL 3,044 questions.")
        print("Reason: Older questions are still present in the 'questions' table.")
    else:
        print("RESULT: ✅ YES! Only the 60 curated questions are in the active question pool.")
    print("=" * 50)

    cur.close()
    conn.close()

if __name__ == "__main__":
    main()
