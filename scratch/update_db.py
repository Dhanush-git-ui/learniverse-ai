import sqlite3
import os

db_path = 'backend/placement_assessment_system/assessment_local.db'
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    c.execute("UPDATE assessment_tests SET status='completed', start_time=datetime('now', '-14 days'), end_time=datetime('now', '-2 days') WHERE id='test_techhash_fall_2026'")
    conn.commit()
    conn.close()
    print("Updated assessment_local.db")

db_path_2 = 'backend/local_learniverse.db'
if os.path.exists(db_path_2):
    conn = sqlite3.connect(db_path_2)
    c = conn.cursor()
    try:
        c.execute("UPDATE assessment_tests SET status='completed', start_time=datetime('now', '-14 days'), end_time=datetime('now', '-2 days') WHERE id='test_techhash_fall_2026'")
        conn.commit()
        print("Updated local_learniverse.db")
    except Exception as e:
        print("local_learniverse.db update error:", e)
    conn.close()
