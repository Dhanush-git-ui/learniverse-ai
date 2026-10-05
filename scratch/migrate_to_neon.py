import sqlite3
import psycopg2
from psycopg2.extras import execute_values
import os

# You can paste your Neon DATABASE_URL here or set it in your environment
NEON_DB_URL = os.environ.get("DATABASE_URL", "postgresql://neondb_owner:npg_3v6QzTYIJcbg@ep-sparkling-grass-atrubrsk-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require")

SQLITE_DB_PATH = 'backend/placement_assessment_system/assessment_local.db'

def migrate_tests_to_neon():
    pass

    if not os.path.exists(SQLITE_DB_PATH):
        print(f"Local SQLite DB not found at {SQLITE_DB_PATH}")
        return

    # Connect to SQLite
    sqlite_conn = sqlite3.connect(SQLITE_DB_PATH)
    sqlite_conn.row_factory = sqlite3.Row
    sqlite_cur = sqlite_conn.cursor()

    # Connect to Neon
    print("Connecting to Neon Database...")
    neon_conn = psycopg2.connect(NEON_DB_URL)
    neon_cur = neon_conn.cursor()

    tables_to_migrate = [
        "startup_companies",
        "assessment_tests",
        "test_rosters",
        "test_questions"
    ]

    for table in tables_to_migrate:
        print(f"\n--- Migrating table: {table} ---")
        try:
            # 1. Fetch data from SQLite
            sqlite_cur.execute(f"SELECT * FROM {table}")
            rows = sqlite_cur.fetchall()
            
            if not rows:
                print(f"No records found in SQLite for {table}.")
                continue

            # 2. Get column names
            columns = rows[0].keys()
            col_names = ", ".join(columns)
            
            # Use ON CONFLICT DO NOTHING to avoid duplicate key errors on migration
            # Assuming 'id' is the primary key for all these tables
            placeholders = ", ".join(["%s"] * len(columns))
            insert_query = f"""
                INSERT INTO {table} ({col_names}) 
                VALUES %s 
                ON CONFLICT (id) DO NOTHING;
            """
            
            # 3. Insert into Neon
            data_to_insert = [tuple(row) for row in rows]
            execute_values(neon_cur, insert_query, data_to_insert)
            neon_conn.commit()
            
            print(f"Successfully migrated {len(data_to_insert)} records to Neon table '{table}'.")

        except Exception as e:
            print(f"Error migrating {table}: {e}")
            neon_conn.rollback()

    sqlite_conn.close()
    neon_cur.close()
    neon_conn.close()
    print("\nMigration complete!")

if __name__ == "__main__":
    migrate_tests_to_neon()
