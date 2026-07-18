# placement_assessment_system/seed_questions_fixed.py
# ============================================================
# FIXED VERSION — Replace your existing seed_questions.py
# ============================================================
# Fixes applied:
#   B-2: DB credentials moved to environment variable
# ============================================================

import json
import os
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv

# Load environment variables from backend/.env
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

# [FIX B-2] Read DB URL from environment variable
DB_URL = os.environ.get("DATABASE_URL")
if not DB_URL:
    raise RuntimeError("DATABASE_URL not set. Add it to backend/.env")

def seed_database():
    # Adjusted dataset path since script runs inside backend/placement_assessment_system/
    dataset_path = "../../placement_assessment_mongodb_dataset.json"
    
    if not os.path.exists(dataset_path):
        print(f"Dataset file not found at: {os.path.abspath(dataset_path)}")
        return

    with open(dataset_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()

    print("Seeding questions in batches...")

    # 1. Prepare and seed Aptitude, Verbal, and Computer Fundamentals questions
    mcq_tuples = []
    for category in ["aptitude_questions", "verbal_questions", "computer_fundamentals_questions"]:
        questions_list = data.get(category, [])
        cat_name = category.replace("_questions", "").title()
        
        for q in questions_list:
            mcq_tuples.append((
                q.get("_id"),
                cat_name,
                q.get("topic"),
                q.get("difficulty"),
                q.get("question"),
                json.dumps(q.get("options")) if q.get("options") else None,
                q.get("correctOption"),
                q.get("answer"),
                q.get("explanation"),
                q.get("marks", 1),
                q.get("negativeMarks", 0.25),
                q.get("timeLimit"),
                None # examples
            ))

    if mcq_tuples:
        print(f"Inserting {len(mcq_tuples)} MCQ questions...")
        execute_values(
            cur,
            """
            INSERT INTO questions (id, category, topic, difficulty, question, options, correct_option, answer, explanation, marks, negative_marks, time_limit, examples)
            VALUES %s
            ON CONFLICT (id) DO NOTHING;
            """,
            mcq_tuples
        )

    # 2. Prepare and seed Coding Questions
        # 2. Prepare and seed Coding Questions
    coding_tuples = []
    coding_questions = data.get("coding_questions", [])
    for q in coding_questions:
        q_text = q.get("problemStatement") or q.get("question")
        
        # Serialize solutions and complexities to JSON inside the answer column
        solutions_json = json.dumps({
            "optimal_code": q.get("optimalSolution") or "",
            "brute_code": q.get("bruteForceSolution") or "",
            "time_complexity": q.get("expectedTime") or "O(N)",
            "space_complexity": q.get("expectedSpaceComplexity") or "O(1)"
        })
        
        coding_tuples.append((
            q.get("_id"),
            "Coding",
            q.get("topic"),
            q.get("difficulty"),
            q_text,
            None, # options
            None, # correct_option
            solutions_json, # Store structured solutions inside 'answer'
            q.get("explanation"),
            q.get("marks", 10),
            q.get("negativeMarks", 0),
            None, # time_limit
            json.dumps(q.get("examples", []))
        ))


    if coding_tuples:
        print(f"Inserting {len(coding_tuples)} coding questions...")
        execute_values(
            cur,
            """
            INSERT INTO questions (id, category, topic, difficulty, question, options, correct_option, answer, explanation, marks, negative_marks, time_limit, examples)
            VALUES %s
            ON CONFLICT (id) DO NOTHING;
            """,
            coding_tuples
        )

    conn.commit()
    cur.close()
    conn.close()
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_database()
