import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv('backend/.env')
db_url = os.environ.get('DATABASE_URL')

conn = psycopg2.connect(db_url)
cur = conn.cursor(cursor_factory=RealDictCursor)

tables = ["test_sessions", "fixly_test_submissions", "question_responses", "section_results", "violations"]
for t in tables:
    cur.execute(f"""
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = '{t}' 
        ORDER BY ordinal_position;
    """)
    cols = cur.fetchall()
    print(f"\n==================== TABLE: {t} ({len(cols)} columns) ====================")
    for c in cols:
        print(f"  {c['column_name']:<25} {c['data_type']:<20} Nullable: {c['is_nullable']}")
        
    cur.execute(f"SELECT COUNT(*) FROM {t};")
    count = cur.fetchone()["count"]
    print(f"  --> Total Rows in {t}: {count}")

conn.close()
