# Database Migration Guide: 001_schema_improvements
## Complete Step-by-Step Implementation

**Status**: Ready for execution  
**Date**: 2026-09-04  
**Target**: PostgreSQL / Neon DB  
**Risk Level**: LOW (backward compatible with rollback available)

---

## Table of Contents
1. Pre-Migration Checklist
2. Step-by-Step Execution
3. Post-Migration Verification
4. Monitoring & Troubleshooting
5. Rollback Procedure
6. Backend Code Changes Required

---

## PRE-MIGRATION CHECKLIST

### 1. Backup Production Database
\\\ash
# Via Neon Console: Create a branch backup
neon branch create --parent=main backup_001_

# Or backup via psql
pg_dump \ > learniverse_backup_.sql
\\\

### 2. Test in Development Environment
- [ ] Copy migration files to dev database
- [ ] Run 001_schema_improvements.sql
- [ ] Run verification queries
- [ ] Wait 24-48 hours for testing
- [ ] Verify no application errors

### 3. Communication
- [ ] Notify team of maintenance window
- [ ] Schedule during low-traffic period (2-4 AM UTC)
- [ ] Have rollback plan ready
- [ ] Assign monitoring person

### 4. Performance Check
\\\sql
-- Check current table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE tablename IN ('test_sessions', 'question_responses', 'questions', 'attempts')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check for locks
SELECT * FROM pg_locks WHERE NOT granted;

-- Check connection count
SELECT datname, usename, count(*) 
FROM pg_stat_activity 
GROUP BY datname, usename;
\\\

---

## STEP-BY-STEP EXECUTION

### Environment: STAGING (First)

**Step 1**: Connect to Staging Database
\\\ash
psql \
\\\

**Step 2**: Execute Forward Migration
\\\ash
# Option A: Via psql command
psql \ -f migrations/001_schema_improvements.sql

# Option B: Via Neon Console SQL Editor (paste entire file)

# Option C: Line by line if issues occur (NOT recommended)
\\\

**Step 3**: Verify Staging Migration (see Verification section below)

**Step 4**: Test with Backend
- Deploy backend code to staging
- Run full test suite
- Test all assessment endpoints
- Monitor logs for errors
- Check performance metrics

**Step 5**: Wait 24-48 hours in staging

---

### Environment: PRODUCTION (After Staging Success)

**Step 1**: Schedule Maintenance Window
- 2-4 AM UTC (low traffic)
- Notify users 24 hours in advance
- Prepare monitoring dashboard

**Step 2**: Create Production Backup
\\\ash
# Via Neon - Create branch backup
neon branch create --parent=main backup_001_prod_

# Or full backup
pg_dump \ | gzip > prod_backup_.sql.gz
\\\

**Step 3**: Execute Migration (Low-Traffic Window)
\\\ash
# Connect with timeout and verbose logging
psql -v ON_ERROR_STOP=on \\
  --echo-all \\
  --log-file=migration_001_\.log \\
  \ \\
  -f migrations/001_schema_improvements.sql
\\\

**Step 4**: Monitor for Errors
\\\ash
# Watch log file
tail -f migration_001_*.log

# Check for any failed statements
grep -i error migration_001_*.log
\\\

**Step 5**: Post-Migration Health Check (see section below)

**Step 6**: Deploy Backend Updates (see Backend Changes Required section)

**Step 7**: Monitor Production for 1 Hour
- Check error logs
- Monitor query performance
- Check database connections
- Verify no user-facing issues

---

## POST-MIGRATION VERIFICATION QUERIES

Run these queries to confirm migration success:

### 1. Verify CHECK Constraints Exist
\\\sql
SELECT 
  table_name,
  constraint_name,
  constraint_type
FROM information_schema.table_constraints
WHERE constraint_type = 'CHECK'
  AND table_name IN ('questions', 'test_sessions', 'question_responses', 'attempts')
ORDER BY table_name, constraint_name;
\\\

Expected: 5 CHECK constraints visible

### 2. Verify Audit Columns Exist
\\\sql
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE column_name = 'updated_at'
  AND table_name IN ('test_sessions', 'question_responses', 'section_results')
ORDER BY table_name;
\\\

Expected: 3 rows (one per table)

### 3. Verify Triggers Exist
\\\sql
SELECT 
  trigger_name,
  event_object_table,
  event_manipulation
FROM information_schema.triggers
WHERE trigger_name LIKE '%_updated'
ORDER BY event_object_table;
\\\

Expected: 3 triggers

### 4. Verify New Indexes
\\\sql
SELECT 
  indexname,
  tablename,
  indexdef
FROM pg_indexes
WHERE indexname LIKE 'idx_%'
  AND tablename IN ('test_sessions', 'question_responses', 'questions', 'violations', 'attempts')
ORDER BY tablename, indexname;
\\\

Expected: 6+ new indexes

### 5. Verify New Tables
\\\sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('session_integrity_events', 'session_browser_info')
ORDER BY table_name;
\\\

Expected: 2 new tables

### 6. Verify NOT NULL Constraints
\\\sql
SELECT 
  column_name,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'test_sessions'
  AND column_name IN ('student_name', 'branch', 'year', 'browser', 'device', 'ip_address')
ORDER BY column_name;
\\\

Expected: All should be 'NO' (not nullable)

### 7. Quick Health Check
\\\sql
-- Count records in key tables
SELECT 
  'questions' as table_name, COUNT(*) as row_count FROM questions
UNION ALL
SELECT 'test_sessions', COUNT(*) FROM test_sessions
UNION ALL
SELECT 'question_responses', COUNT(*) FROM question_responses
UNION ALL
SELECT 'attempts', COUNT(*) FROM attempts
UNION ALL
SELECT 'session_integrity_events', COUNT(*) FROM session_integrity_events
UNION ALL
SELECT 'session_browser_info', COUNT(*) FROM session_browser_info;
\\\

---

## MONITORING & TROUBLESHOOTING

### If Migration Hangs
\\\sql
-- Check for blocking queries
SELECT 
  pid,
  query,
  state,
  wait_event
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY query_start DESC;

-- If needed, cancel blocking queries (be careful!)
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE pid != pg_backend_pid() 
  AND query LIKE 'CREATE INDEX%';
\\\

### If Constraint Violation Occurs
\\\sql
-- Find rows violating difficulty constraint (example)
SELECT * FROM questions 
WHERE difficulty NOT IN ('Easy', 'Medium', 'Hard');

-- Fix them before migration
UPDATE questions 
SET difficulty = 'Medium' 
WHERE difficulty NOT IN ('Easy', 'Medium', 'Hard');
\\\

### Monitor During Execution
\\\ash
# Terminal 1: Watch migration log
tail -f migration_001_*.log

# Terminal 2: Monitor database
watch -n 1 'psql \ -c \"SELECT datname, usename, count(*) FROM pg_stat_activity GROUP BY datname, usename;\"'

# Terminal 3: Monitor indexes being created
watch -n 2 'psql \ -c \"SELECT * FROM pg_stat_progress_create_index;\"'
\\\

---

## ROLLBACK PROCEDURE

### If Critical Issues Occur

**Step 1**: Prepare Rollback (within 1 hour of migration)
\\\ash
psql \ -v ON_ERROR_STOP=on \\
  --echo-all \\
  --log-file=rollback_001_\.log \\
  -f migrations/001_rollback.sql
\\\

**Step 2**: Verify Rollback Success
\\\sql
-- Run verification queries in reverse
SELECT COUNT(*) FROM information_schema.table_constraints
WHERE constraint_type = 'CHECK'
  AND table_name IN ('questions', 'test_sessions');
-- Should return 0 if fully rolled back
\\\

**Step 3**: Restore from Backup (if needed)
\\\ash
# If rollback script fails, restore full backup
psql \ < prod_backup_*.sql.gz
\\\

---

## BACKEND CODE CHANGES REQUIRED

These changes integrate new schema features into the application.

### File 1: backend/config.py (Add Feature Flags)

Add to Settings class:
\\\python
# Schema Features (enable after migration verified)
self.ENABLE_INTEGRITY_EVENTS = os.environ.get("ENABLE_INTEGRITY_EVENTS", "true").lower() == "true"
self.ENABLE_BROWSER_INFO = os.environ.get("ENABLE_BROWSER_INFO", "true").lower() == "true"
self.TRACK_SESSION_UPDATES = os.environ.get("TRACK_SESSION_UPDATES", "true").lower() == "true"
\\\

### File 2: backend/placement_assessment_system/api.py (Use New Tables)

Add function to track integrity events:
\\\python
def record_integrity_event(session_id: str, event_type: str, details: str = None):
    \"\"\"Record session integrity events to new table.\"\"\"
    if not settings.ENABLE_INTEGRITY_EVENTS:
        return
    
    try:
        conn = get_db_conn()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO session_integrity_events 
            (session_id, event_type, details, severity)
            VALUES (%s, %s, %s, %s)
        ''', (session_id, event_type, details, 'warning'))
        conn.commit()
        cursor.close()
        release_db_conn(conn)
    except Exception as e:
        logger.error(f"Failed to record integrity event: {e}")
\\\

### File 3: backend/app.py (Record Browser Info)

When creating test session:
\\\python
def save_browser_info(session_id: str, browser_data: dict):
    \"\"\"Save browser info to normalized table.\"\"\"
    if not settings.ENABLE_BROWSER_INFO:
        return
    
    try:
        conn = get_db_conn()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO session_browser_info 
            (session_id, browser_name, browser_version, os_name, os_version,
             user_agent, screen_width, screen_height, timezone, locale)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (session_id) DO UPDATE SET
                updated_at = CURRENT_TIMESTAMP
        ''', (
            session_id,
            browser_data.get('browserName'),
            browser_data.get('browserVersion'),
            browser_data.get('osName'),
            browser_data.get('osVersion'),
            browser_data.get('userAgent'),
            browser_data.get('screenWidth'),
            browser_data.get('screenHeight'),
            browser_data.get('timezone'),
            browser_data.get('locale')
        ))
        conn.commit()
        cursor.close()
        release_db_conn(conn)
    except Exception as e:
        logger.error(f"Failed to save browser info: {e}")
\\\

---

## TIMELINE ESTIMATE

| Phase | Duration | Notes |
|-------|----------|-------|
| Pre-migration prep | 1 hour | Backup, communication |
| Staging migration | 15-30 min | Run SQL |
| Staging testing | 24-48 hours | Full test suite |
| Prod backup | 5 min | Via Neon |
| Prod migration | 15-30 min | During low-traffic |
| Post-migration verification | 5-10 min | Run queries |
| Backend code updates | 30 min | Add feature flags |
| Monitoring | 1 hour | Watch logs |
| **Total** | **2-3 days** | Including testing |

---

## SUCCESS CRITERIA

Migration is successful when:

✅ All verification queries return expected results  
✅ No error logs in migration_001_*.log  
✅ All constraints exist and are enforced  
✅ Query performance unchanged or improved  
✅ Zero breaking changes to application  
✅ Audit columns auto-populate on updates  
✅ New indexes visible in pg_indexes  

---

## SUPPORT & ESCALATION

If issues occur:

1. **Check migration log**: \	ail migration_001_*.log\
2. **Review error details**: Look for actual SQL error, not just line number
3. **Attempt rollback**: Run 001_rollback.sql if issues persist >5 min
4. **Restore backup**: Full backup recovery if rollback fails

Contact: Database Admin / DevOps
