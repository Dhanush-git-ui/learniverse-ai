import os, psycopg2
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
db = os.environ.get("DATABASE_URL")
if not db:
    print("No DB URL")
else:
    conn = psycopg2.connect(db)
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM questions;")
    total = cur.fetchone()[0]
    cur.execute("SELECT category, COUNT(*) FROM questions GROUP BY category ORDER BY category;")
    rows = cur.fetchall()
    print(f"Total questions in DB: {total}")
    for r in rows:
        print(f"  {r[0]}: {r[1]}")
    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name LIKE 'questions_backup_%' ORDER BY table_name DESC LIMIT 5;")
    btables = cur.fetchall()
    print("Backup tables:", [b[0] for b in btables])
    if total > 0:
        cur.execute("SELECT id, category, topic, difficulty, question FROM questions LIMIT 3;")
        sample = cur.fetchall()
        print("\nSample questions:")
        for s in sample:
            print(f"  [{s[1]}] {s[2]} | {s[3]} | {s[4][:80]}...")
    conn.close()
