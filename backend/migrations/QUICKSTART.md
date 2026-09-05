# Quick Reference: Database Migration Checklist
## 001_schema_improvements

**Status**: Ready for Staging  
**Date Created**: 2026-09-04  
**Estimated Execution Time**: 15-30 minutes  
**Rollback Available**: YES (001_rollback.sql)

---

## PRE-FLIGHT CHECKLIST

- [ ] Read MIGRATION_GUIDE.md completely
- [ ] Backup staging database
- [ ] Notify team of schedule
- [ ] Have monitoring dashboard ready
- [ ] Prepare rollback command
- [ ] Test rollback in dev first

---

## QUICK EXECUTION (Staging)

\\\ash
# Connect to staging
export STAGING_DB_URL='postgresql://user:pass@host/db'

# Run migration (verbose with logging)
psql -v ON_ERROR_STOP=on --echo-all \\
  --log-file=migration_001_staging_\.log \\
  \ -f backend/migrations/001_schema_improvements.sql

# Check for errors
grep -i error migration_001_staging_*.log || echo "No errors found"

# Run verification queries (see MIGRATION_GUIDE.md)
psql \ -f backend/migrations/verify.sql
\\\

---

## WHAT CHANGES

### New Tables
- \session_integrity_events\ - Track suspicious activity (replaces JSONB)
- \session_browser_info\ - Browser metadata (replaces JSONB)

### New Columns
- \updated_at\ - Audit timestamp on test_sessions, question_responses, section_results
- \session_id\ - Link attempts to test_sessions

### New Constraints (6 total)
- CHECK constraints on difficulty, question_type, status fields
- NOT NULL on key test_sessions columns

### New Indexes (6 total)
- Student activity lookups
- Query optimization indexes
- Timestamp-based queries

### Triggers (3 total)
- Auto-update \updated_at\ on changes

---

## ROLLBACK (If Needed)

\\\ash
# Quick rollback within 1 hour
psql -v ON_ERROR_STOP=on \\
  \ -f backend/migrations/001_rollback.sql

# Verify rollback
psql \ -c \"SELECT COUNT(*) FROM information_schema.table_constraints WHERE constraint_type = 'CHECK' AND table_name IN ('questions', 'test_sessions');\"
# Should return: 0 (if fully rolled back)
\\\

---

## MONITORING AFTER MIGRATION

Watch these metrics for 1 hour:

\\\sql
-- Query performance (should stay same or improve)
SELECT 
  query,
  mean_exec_time,
  calls
FROM pg_stat_statements
WHERE query LIKE '%test_sessions%'
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Connection health
SELECT 
  datname,
  count(*) as connections
FROM pg_stat_activity
GROUP BY datname;

-- Index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan as scans
FROM pg_stat_user_indexes
WHERE tablename IN ('test_sessions', 'question_responses')
ORDER BY idx_scan DESC;
\\\

---

## NEXT STEPS AFTER MIGRATION

1. **Deploy backend code changes** (config.py + api.py updates)
2. **Enable feature flags**: Set env vars to use new tables
3. **Migrate existing JSONB data** (optional, gradual rollout)
4. **Update queries** to use normalized tables
5. **Monitor for 24 hours**

See: MIGRATION_GUIDE.md for detailed backend integration code

---

## SUPPORT

**Migration stuck?**
1. Check log file: \	ail migration_001_staging_*.log\
2. Look for actual error (not just line number)
3. Run rollback if >5 minutes

**Questions?**
See MIGRATION_GUIDE.md full documentation
