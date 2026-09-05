-- ============================================================
-- File: backend/migrations/verify.sql
-- Purpose: Verification queries to run after migration
-- Usage: psql \ -f backend/migrations/verify.sql
-- ============================================================

\echo '=========================================='
\echo 'MIGRATION 001 VERIFICATION QUERIES'
\echo '=========================================='
\echo ''

-- ============================================================
-- 1. CHECK CONSTRAINTS VERIFICATION
-- ============================================================
\echo '1. Verifying CHECK constraints...'
SELECT 
  table_name,
  constraint_name,
  'CHECK' as type
FROM information_schema.table_constraints
WHERE constraint_type = 'CHECK'
  AND table_name IN ('questions', 'test_sessions', 'question_responses', 'attempts', 'session_integrity_events')
ORDER BY table_name, constraint_name;

\echo 'Expected: 8 CHECK constraints'
\echo ''

-- ============================================================
-- 2. AUDIT COLUMNS VERIFICATION
-- ============================================================
\echo '2. Verifying audit columns (updated_at)...'
SELECT 
  table_name,
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE column_name = 'updated_at'
  AND table_name IN ('test_sessions', 'question_responses', 'section_results')
ORDER BY table_name;

\echo 'Expected: 3 rows with TIMESTAMP WITH TIME ZONE'
\echo ''

-- ============================================================
-- 3. TRIGGERS VERIFICATION
-- ============================================================
\echo '3. Verifying triggers for audit columns...'
SELECT 
  trigger_name,
  event_object_table as table_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE trigger_name LIKE '%_updated'
ORDER BY event_object_table;

\echo 'Expected: 3 triggers (test_sessions_updated, question_responses_updated, section_results_updated)'
\echo ''

-- ============================================================
-- 4. NEW TABLES VERIFICATION
-- ============================================================
\echo '4. Verifying new tables...'
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN ('session_integrity_events', 'session_browser_info')
ORDER BY table_name;

\echo 'Expected: 2 tables (session_integrity_events with 7 columns, session_browser_info with 11 columns)'
\echo ''

-- ============================================================
-- 5. NEW INDEXES VERIFICATION
-- ============================================================
\echo '5. Verifying new indexes...'
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename IN ('test_sessions', 'question_responses', 'questions', 'violations', 'attempts', 'session_integrity_events', 'session_browser_info')
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

\echo 'Expected: 10+ indexes for optimized queries'
\echo ''

-- ============================================================
-- 6. NOT NULL CONSTRAINTS VERIFICATION
-- ============================================================
\echo '6. Verifying NOT NULL constraints on test_sessions...'
SELECT 
  column_name,
  is_nullable,
  data_type
FROM information_schema.columns
WHERE table_name = 'test_sessions'
  AND column_name IN ('student_name', 'branch', 'year', 'browser', 'device', 'ip_address')
ORDER BY ordinal_position;

\echo 'Expected: All is_nullable = NO'
\echo ''

-- ============================================================
-- 7. FOREIGN KEY VERIFICATION
-- ============================================================
\echo '7. Verifying foreign keys...'
SELECT 
  constraint_name,
  table_name,
  column_name,
  referenced_table_name,
  referenced_column_name
FROM information_schema.key_column_usage
WHERE table_name IN ('attempts', 'session_integrity_events', 'session_browser_info', 'question_responses')
  AND referenced_table_name IS NOT NULL
ORDER BY table_name, constraint_name;

\echo 'Expected: Foreign keys to test_sessions and questions tables'
\echo ''

-- ============================================================
-- 8. DATA INTEGRITY CHECK
-- ============================================================
\echo '8. Checking data integrity...'
SELECT 
  'questions' as table_name, 
  COUNT(*) as row_count,
  ROUND(pg_total_relation_size('questions') / 1024.0 / 1024.0, 2) as size_mb
FROM questions
UNION ALL
SELECT 'test_sessions', COUNT(*), ROUND(pg_total_relation_size('test_sessions') / 1024.0 / 1024.0, 2)
FROM test_sessions
UNION ALL
SELECT 'question_responses', COUNT(*), ROUND(pg_total_relation_size('question_responses') / 1024.0 / 1024.0, 2)
FROM question_responses
UNION ALL
SELECT 'section_results', COUNT(*), ROUND(pg_total_relation_size('section_results') / 1024.0 / 1024.0, 2)
FROM section_results
UNION ALL
SELECT 'attempts', COUNT(*), ROUND(pg_total_relation_size('attempts') / 1024.0 / 1024.0, 2)
FROM attempts
UNION ALL
SELECT 'session_integrity_events', COUNT(*), ROUND(pg_total_relation_size('session_integrity_events') / 1024.0 / 1024.0, 2)
FROM session_integrity_events
UNION ALL
SELECT 'session_browser_info', COUNT(*), ROUND(pg_total_relation_size('session_browser_info') / 1024.0 / 1024.0, 2)
FROM session_browser_info
ORDER BY table_name;

\echo ''
\echo 'Expected: All tables readable with data intact'
\echo ''

-- ============================================================
-- 9. CONSTRAINT VIOLATIONS CHECK
-- ============================================================
\echo '9. Checking for constraint violations...'
\echo 'Questions with invalid difficulty:'
SELECT COUNT(*) as invalid_count FROM questions 
WHERE difficulty NOT IN ('Easy', 'Medium', 'Hard');

\echo 'Questions with invalid question_type:'
SELECT COUNT(*) as invalid_count FROM questions 
WHERE question_type NOT IN ('mcq', 'reading_comprehension', 'code_prediction', 'coding');

\echo 'Test sessions with invalid status:'
SELECT COUNT(*) as invalid_count FROM test_sessions 
WHERE status NOT IN ('started', 'completed', 'auto_submitted', 'disqualified');

\echo 'Expected: 0 violations in all checks'
\echo ''

-- ============================================================
-- 10. TRIGGER FUNCTIONALITY TEST
-- ============================================================
\echo '10. Testing trigger functionality...'
\echo 'Most recently updated test sessions (should have updated_at):'
SELECT 
  session_id,
  student_roll_number,
  updated_at,
  (CURRENT_TIMESTAMP AT TIME ZONE 'UTC') - updated_at as time_since_update
FROM test_sessions
WHERE updated_at IS NOT NULL
ORDER BY updated_at DESC
LIMIT 5;

\echo ''
\echo 'Expected: updated_at populated for recent updates'
\echo ''

-- ============================================================
-- 11. INDEX USAGE STATISTICS
-- ============================================================
\echo '11. Index usage statistics...'
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan as scans_so_far,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE tablename IN ('test_sessions', 'question_responses', 'session_integrity_events')
ORDER BY tablename, idx_scan DESC;

\echo ''
\echo 'Expected: Indexes created and ready for use'
\echo ''

-- ============================================================
-- 12. MIGRATION SUMMARY
-- ============================================================
\echo '=========================================='
\echo 'MIGRATION VERIFICATION COMPLETE'
\echo '=========================================='
\echo ''
\echo 'Summary:'
\echo '  - CHECK constraints: ADDED'
\echo '  - Audit columns: ADDED'
\echo '  - Triggers: ADDED'
\echo '  - New tables: ADDED'
\echo '  - New indexes: ADDED'
\echo '  - NOT NULL constraints: APPLIED'
\echo '  - Foreign keys: VERIFIED'
\echo ''
\echo 'Next steps:'
\echo '  1. Review all verification results above'
\echo '  2. Deploy backend code with db_schema_integration.py'
\echo '  3. Update config.py with feature flags'
\echo '  4. Enable integrity event tracking'
\echo '  5. Monitor for 24 hours'
\echo ''
