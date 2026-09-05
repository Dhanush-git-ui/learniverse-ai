-- ============================================================
-- Migration: 001_schema_improvements.sql
-- Date: 2026-09-04
-- Target: PostgreSQL / Neon DB
-- Purpose: Add constraints, normalize data, improve indexes
-- Status: REVERSIBLE (see 001_rollback.sql)
-- ============================================================
-- EXECUTION STRATEGY:
-- 1. Test in development first
-- 2. Backup production before running
-- 3. Execute during low-traffic window
-- 4. Monitor for 1 hour post-migration
-- ============================================================

BEGIN TRANSACTION;

-- ============================================================
-- PHASE 1: ADD CHECK CONSTRAINTS
-- ============================================================

ALTER TABLE questions 
ADD CONSTRAINT valid_difficulty 
CHECK (difficulty IN ('Easy', 'Medium', 'Hard'));

ALTER TABLE questions 
ADD CONSTRAINT valid_question_type 
CHECK (question_type IN ('mcq', 'reading_comprehension', 'code_prediction', 'coding'));

ALTER TABLE test_sessions 
ADD CONSTRAINT valid_session_status 
CHECK (status IN ('started', 'completed', 'auto_submitted', 'disqualified'));

ALTER TABLE question_responses 
ADD CONSTRAINT valid_response_correctness 
CHECK (is_correct IN (true, false));

ALTER TABLE attempts 
ADD CONSTRAINT valid_attempt_status 
CHECK (status IN ('started', 'completed', 'auto_submitted', 'disqualified'));

-- ============================================================
-- PHASE 2: ADD AUDIT COLUMNS
-- ============================================================

ALTER TABLE test_sessions 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE question_responses 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE section_results 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- ============================================================
-- PHASE 3: CREATE AUDIT TRIGGER FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS \$\$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
\$\$ LANGUAGE plpgsql;

-- ============================================================
-- PHASE 4: CREATE TRIGGERS
-- ============================================================

DROP TRIGGER IF EXISTS test_sessions_updated ON test_sessions;
CREATE TRIGGER test_sessions_updated
BEFORE UPDATE ON test_sessions
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS question_responses_updated ON question_responses;
CREATE TRIGGER question_responses_updated
BEFORE UPDATE ON question_responses
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS section_results_updated ON section_results;
CREATE TRIGGER section_results_updated
BEFORE UPDATE ON section_results
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- ============================================================
-- PHASE 5: CREATE OPTIMIZED INDEXES (NON-BLOCKING)
-- ============================================================

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_test_sessions_student_active
ON test_sessions(student_roll_number, status)
WHERE status = 'started';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_question_responses_session_section
ON question_responses(session_id, section);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_test_sessions_created_student
ON test_sessions(created_at DESC, student_roll_number);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_questions_category_topic
ON questions(category, topic);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_violations_attempt_timestamp
ON violations(attempt_id, timestamp DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_attempts_user_status
ON attempts(user_id, status);

-- ============================================================
-- PHASE 6: NORMALIZE SUSPICIOUS_EVENTS (NEW TABLE)
-- ============================================================

CREATE TABLE IF NOT EXISTS session_integrity_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES test_sessions(session_id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    event_count INT DEFAULT 1,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    details TEXT,
    severity VARCHAR(20) DEFAULT 'warning'
);

ALTER TABLE session_integrity_events
ADD CONSTRAINT valid_event_type
CHECK (event_type IN ('tab_switch', 'fullscreen_exit', 'copy_attempt', 'paste_attempt', 'keyboard_leave', 'custom'));

ALTER TABLE session_integrity_events
ADD CONSTRAINT valid_severity
CHECK (severity IN ('info', 'warning', 'critical'));

CREATE INDEX IF NOT EXISTS idx_session_integrity_events_session
ON session_integrity_events(session_id);

CREATE INDEX IF NOT EXISTS idx_session_integrity_events_type
ON session_integrity_events(session_id, event_type);

-- ============================================================
-- PHASE 7: BROWSER_INFO NORMALIZATION TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS session_browser_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL UNIQUE REFERENCES test_sessions(session_id) ON DELETE CASCADE,
    browser_name VARCHAR(100),
    browser_version VARCHAR(50),
    os_name VARCHAR(100),
    os_version VARCHAR(50),
    user_agent TEXT,
    screen_width INT,
    screen_height INT,
    timezone VARCHAR(50),
    locale VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_session_browser_info_session
ON session_browser_info(session_id);

-- ============================================================
-- PHASE 8: LINK ATTEMPTS TO TEST_SESSIONS
-- ============================================================

ALTER TABLE attempts
ADD COLUMN IF NOT EXISTS session_id UUID;

ALTER TABLE attempts
ADD CONSTRAINT fk_attempts_test_sessions
FOREIGN KEY (session_id)
REFERENCES test_sessions(session_id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_attempts_session
ON attempts(session_id);

-- ============================================================
-- PHASE 9: ADD NOT NULL CONSTRAINTS (with defaults)
-- ============================================================

UPDATE test_sessions SET student_name = 'Unknown Student' WHERE student_name IS NULL;
UPDATE test_sessions SET branch = 'UNKNOWN' WHERE branch IS NULL;
UPDATE test_sessions SET year = 'N/A' WHERE year IS NULL;
UPDATE test_sessions SET browser = 'Unknown Browser' WHERE browser IS NULL;
UPDATE test_sessions SET device = 'Unknown Device' WHERE device IS NULL;
UPDATE test_sessions SET ip_address = '0.0.0.0' WHERE ip_address IS NULL;

ALTER TABLE test_sessions
ALTER COLUMN student_name SET NOT NULL,
ALTER COLUMN branch SET NOT NULL,
ALTER COLUMN year SET NOT NULL,
ALTER COLUMN browser SET NOT NULL,
ALTER COLUMN device SET NOT NULL,
ALTER COLUMN ip_address SET NOT NULL;

-- ============================================================
-- PHASE 10: ANALYZE FOR QUERY OPTIMIZATION
-- ============================================================

ANALYZE questions;
ANALYZE test_sessions;
ANALYZE question_responses;
ANALYZE section_results;
ANALYZE attempts;

COMMIT;
