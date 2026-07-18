# placement_assessment_system/init_db_fixed.py
# ============================================================
# FIXED VERSION — Replace your existing init_db.py
# ============================================================
# Fixes applied:
#   B-2: DB credentials moved to environment variable
# ============================================================

import os
import psycopg2
from dotenv import load_dotenv
from seed_questions import seed_database

# Load environment variables from backend/.env
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

# [FIX B-2] Read DB URL from environment variable
DB_URL = os.environ.get("DATABASE_URL")
if not DB_URL:
    raise RuntimeError("DATABASE_URL not set. Add it to backend/.env")

def initialize_db():
    sql_path = "db_setup.sql"
    
    if not os.path.exists(sql_path):
        # Handle path differences when run from different directories
        sql_path = os.path.join(os.path.dirname(__file__), "db_setup.sql")
        
    if not os.path.exists(sql_path):
        print(f"SQL file not found at: {sql_path}")
        return

    print("Connecting to Neon PostgreSQL database...")
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    
    print("Reading and executing db_setup.sql...")
    with open(sql_path, "r", encoding="utf-8") as f:
        sql_script = f.read()
        
    try:
        cur.execute(sql_script)
        conn.commit()
        print("Database tables created successfully!")
    except Exception as e:
        conn.rollback()
        print(f"Error executing SQL: {e}")
        return
    finally:
        cur.close()
        conn.close()

    # Seed the database questions right after table creation
    print("Starting question seeding...")
    seed_database()

if __name__ == "__main__":
    initialize_db()
