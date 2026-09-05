-- ============================================================
-- Rollback: 001_rollback.sql
-- Reverses 001_schema_improvements.sql
-- ============================================================
-- USE ONLY if migration causes issues
-- Test rollback procedure in staging first
-- ============================================================

BEGIN TRANSACTION;

-- ============================================================
-- PHASE 1: DROP TRIGGERS (Safe - no data loss)
-- ============================================================

DROP TRIGGER IF EXISTS test_sessions_updated ON test_sessions;
DROP TRIGGER IF EXISTS question_responses_updated ON question_responses;
DROP TRIGGER IF EXISTS section_results_updated ON section_results;

-- Keep the function for now in case other triggers use it

-- ============================================================
-- PHASE 2: REMOVE NEW FOREIGN KEYS
-- ============================================================

ALTER TABLE attempts
DROP CONSTRAINT IF EXISTS fk_attempts_test_sessions;

-- ============================================================
-- PHASE 3: DROP NEW TABLES (WARNING: Data will be lost!)
-- ============================================================
-- Uncomment ONLY if you're sure you don't need this data

-- DROP TABLE IF EXISTS session_integrity_events CASCADE;
-- DROP TABLE IF EXISTS session_browser_info CASCADE;

-- For now, just drop indexes to keep tables intact
DROP INDEX IF EXISTS idx_session_integrity_events_session;
DROP INDEX IF EXISTS idx_session_integrity_events_type;
DROP INDEX IF EXISTS idx_session_integrity_events_timestamp;
DROP INDEX IF EXISTS idx_session_browser_info_session;

-- ============================================================
-- PHASE 4: REMOVE CHECK CONSTRAINTS
-- ============================================================

ALTER TABLE questions 
DROP CONSTRAINT IF EXISTS valid_difficulty;

ALTER TABLE questions 
DROP CONSTRAINT IF EXISTS valid_question_type;

ALTER TABLE test_sessions 
DROP CONSTRAINT IF EXISTS valid_session_status;

ALTER TABLE question_responses 
DROP CONSTRAINT IF EXISTS valid_response_correctness;

ALTER TABLE attempts 
DROP CONSTRAINT IF EXISTS valid_attempt_status;

ALTER TABLE session_integrity_events
DROP CONSTRAINT IF EXISTS valid_event_type;

ALTER TABLE session_integrity_events
DROP CONSTRAINT IF EXISTS valid_severity;

-- ============================================================
-- PHASE 5: REMOVE AUDIT COLUMNS (OPTIONAL - uncomment if needed)
-- ============================================================
-- WARNING: This will DELETE data in updated_at columns!
-- Only do this if you're sure you don't need audit history

-- ALTER TABLE test_sessions DROP COLUMN IF EXISTS updated_at;
-- ALTER TABLE question_responses DROP COLUMN IF EXISTS updated_at;
-- ALTER TABLE section_results DROP COLUMN IF EXISTS updated_at;

-- ============================================================
-- PHASE 6: REMOVE NEW INDEXES
-- ============================================================

DROP INDEX IF EXISTS idx_test_sessions_student_active;
DROP INDEX IF EXISTS idx_question_responses_session_section;
DROP INDEX IF EXISTS idx_test_sessions_created_student;
DROP INDEX IF EXISTS idx_questions_category_topic;
DROP INDEX IF EXISTS idx_violations_attempt_timestamp;
DROP INDEX IF EXISTS idx_attempts_user_status;
DROP INDEX IF EXISTS idx_attempts_session;

-- ============================================================
-- PHASE 7: RESTORE NULL VALUES IN KEY COLUMNS (Optional)
-- ============================================================
-- This undoes the NOT NULL enforcement
-- Only if you want to revert to nullable columns

-- ALTER TABLE test_sessions
-- ALTER COLUMN student_name DROP NOT NULL,
-- ALTER COLUMN branch DROP NOT NULL,
-- ALTER COLUMN year DROP NOT NULL,
-- ALTER COLUMN browser DROP NOT NULL,
-- ALTER COLUMN device DROP NOT NULL,
-- ALTER COLUMN ip_address DROP NOT NULL;

-- ============================================================
-- PHASE 8: REMOVE SESSION_ID FROM ATTEMPTS
-- ============================================================

ALTER TABLE attempts
DROP COLUMN IF EXISTS session_id;

-- ============================================================
-- ROLLBACK COMPLETE
-- ============================================================

COMMIT;

-- ============================================================
-- POST-ROLLBACK VERIFICATION
-- ============================================================
-- Run these to verify rollback succeeded:

-- SELECT COUNT(*) FROM information_schema.table_constraints
-- WHERE table_name = 'test_sessions' AND constraint_type = 'CHECK';

-- SELECT COUNT(*) FROM information_schema.columns
-- WHERE table_name = 'attempts' AND column_name = 'session_id';
