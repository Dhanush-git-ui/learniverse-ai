import os
import psycopg2
from dotenv import load_dotenv

load_dotenv('backend/.env')
db_url = os.environ.get('DATABASE_URL')
print("DB_URL present:", bool(db_url))

try:
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    cur.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
    """)
    tables = [r[0] for r in cur.fetchall()]
    print("Tables in Neon DB:", tables)
    
    for t in tables:
        cur.execute(f"SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '{t}' LIMIT 10;")
        cols = cur.fetchall()
        print(f"\nTable {t}: {[c[0] for c in cols]}")
    conn.close()
except Exception as e:
    print("Error:", e)
