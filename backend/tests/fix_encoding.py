import os
import json
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
db_url = os.environ.get("DATABASE_URL")
if not db_url:
    raise RuntimeError("DATABASE_URL environment variable is missing.")

conn = psycopg2.connect(db_url)
cur = conn.cursor(cursor_factory=RealDictCursor)

print("=== Executing DB Question Encoding Migration ===")

# Fix logical reasoning question referencing missing diagram
cur.execute("""
UPDATE questions 
SET question = 'If a figure rotates 90 degrees clockwise, and it is a triangle pointing up, which direction will it point next?'
WHERE id = 'logical-reasoning-basic-non-verbal-reasoning-0082';
""")

cur.execute("SELECT id, question, options, explanation FROM questions;")
rows = cur.fetchall()

updated_count = 0

for r in rows:
    qid = r['id']
    qtext = r['question'] or ''
    opts = r['options']
    exp = r['explanation'] or ''
    
    new_qtext = qtext.replace('\ufffd', "'")
    new_exp = exp.replace('\ufffd', "'")
    
    new_opts = None
    if opts:
        if isinstance(opts, str):
            new_opts = opts.replace('\ufffd', "'")
        elif isinstance(opts, list):
            new_opts = json.dumps([str(o).replace('\ufffd', "'") for o in opts])
            
    if new_qtext != qtext or new_exp != exp or (opts and str(new_opts) != str(opts)):
        cur.execute(
            """
            UPDATE questions 
            SET question = %s, options = %s, explanation = %s 
            WHERE id = %s;
            """,
            (new_qtext, new_opts or opts, new_exp, qid)
        )
        updated_count += 1

conn.commit()
cur.close()
conn.close()

print(f"Successfully sanitized {updated_count} database questions!")
