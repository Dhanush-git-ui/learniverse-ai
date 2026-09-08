import os
import psycopg2
from dotenv import load_dotenv

load_dotenv('backend/.env')
db_url = os.environ.get('DATABASE_URL')
print("Connecting to Neon DB...")

conn = psycopg2.connect(db_url)
conn.autocommit = True
cur = conn.cursor()

# 1. Create SQL Analytics View
sql_view = """
CREATE OR REPLACE VIEW v_student_placement_analytics AS
SELECT 
    f.roll_number,
    f.student_name,
    f.branch,
    f.role AS track,
    f.total_marks,
    f.max_marks,
    f.percentage,
    f.status,
    f.violations_count,
    f.submitted_at,
    -- Real-time Batch Rank within Branch
    DENSE_RANK() OVER (PARTITION BY f.branch ORDER BY f.percentage DESC) AS branch_rank,
    -- Overall College Rank
    DENSE_RANK() OVER (ORDER BY f.percentage DESC) AS overall_rank,
    -- Percentile Score across entire college
    ROUND(PERCENT_RANK() OVER (ORDER BY f.percentage ASC)::numeric * 100, 1) AS overall_percentile,
    -- Automated Placement Readiness Classification
    CASE 
        WHEN f.percentage >= 80 AND f.violations_count < 3 THEN 'Tier-1 Product Ready'
        WHEN f.percentage >= 60 AND f.violations_count < 3 THEN 'Tier-2 Enterprise Ready'
        ELSE 'Needs Remedial Training'
    END AS placement_tier
FROM fixly_test_submissions f;
"""
print("Creating view v_student_placement_analytics...")
cur.execute(sql_view)
print("View created successfully!")

# 2. Create Performance Indexes
indexes = [
    ("idx_submissions_roll", "CREATE INDEX IF NOT EXISTS idx_submissions_roll ON fixly_test_submissions (UPPER(roll_number));"),
    ("idx_sessions_roll", "CREATE INDEX IF NOT EXISTS idx_sessions_roll ON test_sessions (UPPER(student_roll_number));"),
    ("idx_submissions_branch_pct", "CREATE INDEX IF NOT EXISTS idx_submissions_branch_pct ON fixly_test_submissions (branch, percentage DESC);"),
    ("idx_submissions_answers_gin", "CREATE INDEX IF NOT EXISTS idx_submissions_answers_gin ON fixly_test_submissions USING GIN (question_answers);")
]

for name, q in indexes:
    try:
        print(f"Creating index {name}...")
        cur.execute(q)
        print(f"Index {name} created!")
    except Exception as e:
        print(f"Note on {name}: {e}")

# 3. Verify View with sample query
print("\nVerifying View query:")
cur.execute("SELECT roll_number, student_name, branch, track, percentage, branch_rank, overall_percentile, placement_tier FROM v_student_placement_analytics LIMIT 5;")
rows = cur.fetchall()
for r in rows:
    print(" ", r)

conn.close()
print("\nNeon DB View and Indexes enabled successfully!")
