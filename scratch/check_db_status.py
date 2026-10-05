import sqlite3
conn = sqlite3.connect('backend/placement_assessment_system/assessment_local.db')
c = conn.cursor()
c.execute("SELECT status, start_time, end_time FROM assessment_tests WHERE id='test_techhash_fall_2026'")
print(c.fetchall())
