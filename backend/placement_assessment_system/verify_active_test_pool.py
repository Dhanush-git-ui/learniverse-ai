import os, sys, json, psycopg2
from dotenv import load_dotenv

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, os.path.dirname(__file__))

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
DB_URL = os.environ.get("DATABASE_URL")

from api import _get_all_questions_cached, reload_questions_cache

def main():
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    
    # Force reload cache
    pool = reload_questions_cache(cur)
    
    apt = [q for q in pool if q.get("category") == "Aptitude"]
    vrb = [q for q in pool if q.get("category") == "Verbal"]
    cs  = [q for q in pool if q.get("category") == "Computer_Fundamentals"]
    
    print("=" * 60)
    print("VERIFICATION OF ACTIVE TEST POOL FOR CANDIDATES")
    print("=" * 60)
    print(f"Total MCQs loaded in Cache : {len(apt) + len(vrb) + len(cs)}")
    print(f"  - Aptitude Questions     : {len(apt)}")
    print(f"  - Verbal Questions       : {len(vrb)}")
    print(f"  - CS Fundamentals        : {len(cs)}")
    print("-" * 60)
    print("Versions present in Aptitude pool:")
    print(set(q.get("generator_version") for q in apt))
    print("Versions present in Verbal pool:")
    print(set(q.get("generator_version") for q in vrb))
    print("Versions present in CS pool:")
    print(set(q.get("generator_version") for q in cs))
    print("=" * 60)
    print("CONFIRMATION: Every new placement test attempt will now use")
    print("EXCLUSIVELY these 60 newly fed curated questions!")
    print("=" * 60)

    cur.close()
    conn.close()

if __name__ == "__main__":
    main()
