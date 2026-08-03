# placement_assessment_system/seed_questions.py
# ============================================================
# WEBSCRAPED QUESTION SEEDING ENGINE
# ============================================================

import json
import os
import sys
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv

# Ensure validator can be imported
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from validator import validate_and_enrich_question

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

DB_URL = os.environ.get("DATABASE_URL")

def seed_database():
    if not DB_URL:
        print("[WARNING] DATABASE_URL not set. Skipping DB seed execution.")
        return

    possible_paths = [
        os.path.join(os.path.dirname(__file__), "../../../questions.json"),
        os.path.join(os.path.dirname(__file__), "../../questions.json"),
        "questions.json"
    ]
    dataset_path = next((p for p in possible_paths if os.path.exists(p)), None)
    if not dataset_path:
        print("Dataset file questions.json not found.")
        return

    with open(dataset_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()

    # Ensure schema migrations on questions table
    cur.execute("ALTER TABLE questions ADD COLUMN IF NOT EXISTS question_type VARCHAR(50) DEFAULT 'mcq';")
    cur.execute("ALTER TABLE questions ADD COLUMN IF NOT EXISTS subtopic VARCHAR(100);")
    cur.execute("ALTER TABLE questions ADD COLUMN IF NOT EXISTS estimated_time INT DEFAULT 90;")
    cur.execute("ALTER TABLE questions ADD COLUMN IF NOT EXISTS blooms_level VARCHAR(50) DEFAULT 'Understand';")
    cur.execute("ALTER TABLE questions ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;")
    cur.execute("ALTER TABLE questions ADD COLUMN IF NOT EXISTS language VARCHAR(30) DEFAULT 'general';")
    cur.execute("ALTER TABLE questions ADD COLUMN IF NOT EXISTS generator_version VARCHAR(20) DEFAULT 'v2.0';")
    conn.commit()

    print(f"Seeding and validating {len(data)} webscraped questions from {dataset_path}...")

    rows_to_insert = []
    rejected_count = 0

    for raw_q in data:
        q_dict = {
            "id": raw_q.get("id"),
            "category": raw_q.get("category_label") or raw_q.get("category"),
            "question_type": "mcq",
            "topic": raw_q.get("topic") or "General",
            "subtopic": raw_q.get("topic"),
            "difficulty": raw_q.get("difficulty") or "Medium",
            "question": raw_q.get("question"),
            "options": raw_q.get("options"),
            "correct_option": "A",
            "answer": raw_q.get("answer"),
            "explanation": raw_q.get("solution"),
            "marks": 1,
            "negative_marks": 0.25,
            "time_limit": 120,
        }

        is_valid, errs, enriched = validate_and_enrich_question(q_dict)
        if not is_valid:
            rejected_count += 1
            continue

        rows_to_insert.append((
            enriched["id"],
            enriched["category"],
            enriched.get("question_type", "mcq"),
            enriched["topic"],
            enriched["subtopic"],
            enriched["difficulty"],
            enriched["question"],
            json.dumps(enriched["options"]) if enriched.get("options") else None,
            enriched.get("correct_option"),
            enriched.get("answer"),
            enriched.get("explanation"),
            enriched.get("marks", 1),
            enriched.get("negative_marks", 0.25),
            enriched.get("time_limit", 120),
            enriched.get("estimated_time", 90),
            enriched.get("blooms_level", "Understand"),
            json.dumps(enriched.get("tags", [])),
            enriched.get("language", "general"),
            enriched.get("generator_version", "v2.0"),
            None # examples
        ))

    if rows_to_insert:
        print(f"Inserting {len(rows_to_insert)} webscraped questions into Neon DB...")
        execute_values(
            cur,
            """
            INSERT INTO questions (
                id, category, question_type, topic, subtopic, difficulty, question,
                options, correct_option, answer, explanation, marks, negative_marks,
                time_limit, estimated_time, blooms_level, tags, language, generator_version, examples
            )
            VALUES %s
            ON CONFLICT (id) DO UPDATE SET
                question = EXCLUDED.question,
                options = EXCLUDED.options,
                correct_option = EXCLUDED.correct_option,
                explanation = EXCLUDED.explanation,
                subtopic = EXCLUDED.subtopic,
                tags = EXCLUDED.tags,
                generator_version = EXCLUDED.generator_version;
            """,
            rows_to_insert
        )

    conn.commit()
    cur.close()
    conn.close()
    print(f"Database seeding completed successfully! Inserted/Updated: {len(rows_to_insert)}, Rejected: {rejected_count}")

if __name__ == "__main__":
    seed_database()
