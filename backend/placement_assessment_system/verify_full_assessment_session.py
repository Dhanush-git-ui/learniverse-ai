import os, sys, json, psycopg2
from dotenv import load_dotenv

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, os.path.dirname(__file__))

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
DB_URL = os.environ.get("DATABASE_URL")

from api import reload_questions_cache, _sample_questions_by_difficulty
import random

def main():
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    
    # Reload questions from database
    pool = reload_questions_cache(cur)
    
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
    
    print("=" * 65)
    print("FULL PLACEMENT ASSESSMENT CANDIDATE SESSION SIMULATION")
    print("=" * 65)
    print(f"Total MCQs Selected : {len(aptitude_raw) + len(verbal_raw) + len(comp_raw)}")
    print(f"  - Aptitude Questions         : {len(aptitude_raw)}")
    print(f"  - Verbal Questions           : {len(verbal_raw)}")
    print(f"  - CS Fundamentals Questions  : {len(comp_raw)}")
    print("-" * 65)
    print(f"Total Coding Questions Selected: {len(coding_selected)}")
    for i, cq in enumerate(coding_selected, 1):
        print(f"  Coding Problem {i}:")
        print(f"    - ID          : {cq.get('id')}")
        print(f"    - Difficulty  : {cq.get('difficulty')}")
        print(f"    - Topic       : {cq.get('topic')} ({cq.get('subtopic')})")
        print(f"    - Company Tags: {cq.get('tags')}")
        print(f"    - Has Examples: {'YES (' + str(len(json.loads(cq.get('examples', '[]')) if isinstance(cq.get('examples'), str) else cq.get('examples', []))) + ' test cases)'}")
    
    print("=" * 65)
    print("VERIFICATION CHECKS:")
    check_easy = len(selected_easy_coding) == 1
    check_med = len(selected_med_coding) == 1
    check_total = len(aptitude_raw) + len(verbal_raw) + len(comp_raw) + len(coding_selected) == 62
    
    print(f"  [1] Exactly 1 Easy Coding Question   : {'PASSED' if check_easy else 'FAILED'}")
    print(f"  [2] Exactly 1 Medium Coding Question : {'PASSED' if check_med else 'FAILED'}")
    print(f"  [3] Total Assessment Questions = 62 : {'PASSED' if check_total else 'FAILED'}")
    print("=" * 65)

    cur.close()
    conn.close()

if __name__ == "__main__":
    main()
