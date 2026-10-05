import sqlite3
import os

db_path = 'backend/placement_assessment_system/assessment_local.db'
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    # Find fixly company id
    c.execute("SELECT id FROM startup_companies WHERE slug='fixly'")
    res = c.fetchone()
    if res:
        fx_comp_id = res[0]
        # insert test if not exists
        c.execute("SELECT id FROM assessment_tests WHERE id='test_fixly_summer_2026'")
        if not c.fetchone():
            c.execute("""
            INSERT INTO assessment_tests (
                id, company_id, test_name, role_track, start_time, end_time, duration_minutes, total_marks, status, is_active
            ) VALUES (?, ?, ?, ?, datetime('now', '-14 days'), datetime('now', '-2 days'), ?, ?, ?, ?)
            """, ("test_fixly_summer_2026", fx_comp_id, "Fixly Backend & Cloud Engineer Assessment", "Backend & Cloud Roles", 90, 100.0, "completed", 1))
            conn.commit()
            print("Inserted Fixly test into assessment_local.db")
    conn.close()
