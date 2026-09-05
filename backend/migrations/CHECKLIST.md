# MIGRATION 001 IMPLEMENTATION CHECKLIST
## learniverse-ai Database Schema Improvements

**Date**: 2026-09-04  
**Migration**: 001_schema_improvements  
**Status**: READY TO EXECUTE

---

## PRE-MIGRATION CHECKLIST (Complete Before Running Migration)

### Communication & Planning
- [ ] Team notified of maintenance window
- [ ] Scheduled during low-traffic period (2-4 AM UTC)
- [ ] Have backup plan documented
- [ ] Assign dedicated monitoring person

### Database Preparation
- [ ] Staging database backed up
- [ ] Production database backed up (Neon branch or pg_dump)
- [ ] Connection pool configured (2-50 connections)
- [ ] Database accessible via psql

### File Verification
- [ ] backend/migrations/001_schema_improvements.sql exists
- [ ] backend/migrations/001_rollback.sql exists
- [ ] backend/migrations/verify.sql exists
- [ ] backend/db_schema_integration.py ready
- [ ] backend/config.py ready for updates
- [ ] backend/migrations/MIGRATION_GUIDE.md reviewed

### Environment Check
- [ ] \ set correctly
- [ ] psql client installed
- [ ] Sufficient disk space (schemas are small, <100MB)
- [ ] Network connectivity stable

---

## STAGING EXECUTION CHECKLIST

### Step 1: Pre-Execution (30 min before)
- [ ] Close all active connections to staging database
- [ ] Verify no queries running: psql \ -c "SELECT * FROM pg_stat_activity WHERE state != 'idle';"
- [ ] Check disk space: psql \ -c "SELECT pg_size_pretty(pg_database_size(current_database()));"
- [ ] Start monitoring script

### Step 2: Run Forward Migration (15-30 min)
- [ ] Execute: psql -v ON_ERROR_STOP=on --echo-all --log-file=migration_001_staging.log \ -f backend/migrations/001_schema_improvements.sql
- [ ] Monitor log file in real-time
- [ ] Check for any errors

### Step 3: Verify Migration Success (5 min)
- [ ] Execute: psql \ -f backend/migrations/verify.sql
- [ ] Review output against expected results in MIGRATION_GUIDE.md
- [ ] Verify all 12 verification checks pass
- [ ] No constraint violations detected

### Step 4: Deploy Backend Code (30 min)
- [ ] Copy db_schema_integration.py to backend/
- [ ] Update config.py with feature flags (disabled by default)
- [ ] Update placement_assessment_system/api.py with new endpoints
- [ ] Update app.py with integration code
- [ ] Restart backend service
- [ ] Verify backend starts without errors
- [ ] Check logs for warnings

### Step 5: Run Full Test Suite (Varies)
- [ ] Run unit tests
- [ ] Run integration tests
- [ ] Test all assessment endpoints
- [ ] Test code execution endpoints
- [ ] Test chat/RAG endpoints
- [ ] Verify no performance degradation

### Step 6: Monitor Staging (24-48 hours)
- [ ] Monitor error logs
- [ ] Check query performance
- [ ] Monitor database connections
- [ ] Monitor disk space usage
- [ ] Run manual tests
- [ ] Verify feature flags disabled (no new features active)

### Step 7: Approve for Production
- [ ] All tests passed
- [ ] No errors in logs
- [ ] Performance metrics acceptable
- [ ] Team approves
- [ ] Backup confirmed for production

---

## PRODUCTION EXECUTION CHECKLIST

### Pre-Migration (1 hour before)
- [ ] All staging tests passed
- [ ] Announce maintenance window to users
- [ ] Create production Neon branch backup: neon branch create --parent=main backup_001_prod
- [ ] Or full backup: pg_dump \ | gzip > prod_backup_before_001.sql.gz
- [ ] Verify backup completed successfully
- [ ] Close all active connections
- [ ] Disable application traffic (optional, can run during low-traffic)
- [ ] Start monitoring dashboard

### Migration Execution (Low-traffic window)
- [ ] Execute: psql -v ON_ERROR_STOP=on --echo-all --log-file=migration_001_prod.log \ -f backend/migrations/001_schema_improvements.sql
- [ ] Monitor log in real-time
- [ ] Watch for errors every 2-3 minutes
- [ ] Check database lock status

### Post-Migration Verification (5-10 min)
- [ ] Execute: psql \ -f backend/migrations/verify.sql
- [ ] Review all 12 verification checks pass
- [ ] No constraint violations
- [ ] All indexes created
- [ ] All triggers in place

### Backend Deployment (30 min after migration verified)
- [ ] Deploy code with feature flags DISABLED
- [ ] Restart backend service
- [ ] Verify backend starts cleanly
- [ ] Verify no application errors
- [ ] Test key endpoints
- [ ] Monitor error logs

### Production Monitoring (1 hour minimum)
- [ ] Monitor error logs continuously
- [ ] Check query performance
- [ ] Monitor database connections
- [ ] Monitor user traffic
- [ ] Verify response times normal
- [ ] Spot-check functionality

### Gradual Feature Enablement (3-5 days)
- [ ] Day 1: Enable ENABLE_INTEGRITY_EVENTS=true (staging only, test 24h)
- [ ] Day 2: Enable ENABLE_BROWSER_INFO=true (staging only, test 24h)
- [ ] Day 3+: Enable in production one at a time, 24h testing between each
- [ ] Monitor metrics after each feature enable

---

## IF MIGRATION FAILS - ROLLBACK CHECKLIST

### Immediate Actions (First 5 minutes)
- [ ] Stop running migration if still executing (Ctrl+C)
- [ ] Note exact error from log file
- [ ] Do NOT restart backend
- [ ] Alert team

### Decision Point (5-10 minutes)
- [ ] Review error details in migration_001_*.log
- [ ] Determine if fixable vs. rollback needed
- [ ] Fixable errors: Fix in SQL, re-run specific phase
- [ ] Rollback needed: Proceed to rollback steps

### Rollback Execution (5-15 minutes)
- [ ] Execute: psql -v ON_ERROR_STOP=on --echo-all --log-file=rollback_001.log \ -f backend/migrations/001_rollback.sql
- [ ] Monitor log for errors
- [ ] Verify rollback completed

### Rollback Verification (5 minutes)
- [ ] Execute: SELECT COUNT(*) FROM information_schema.table_constraints WHERE constraint_type = 'CHECK' AND table_name IN ('questions', 'test_sessions');
- [ ] Should return 0 if fully rolled back
- [ ] Verify tables still intact
- [ ] Verify data unchanged

### Full Restore (If Rollback Script Failed)
- [ ] From Neon branch: neon branch restore backup_001_prod main
- [ ] Or from backup: psql \ < prod_backup_before_001.sql.gz
- [ ] Verify restore completed
- [ ] Verify data intact

### Investigation & Recovery
- [ ] Save all log files for analysis
- [ ] Determine root cause of failure
- [ ] Fix issue (usually constraint violations)
- [ ] Schedule retry (not same day)
- [ ] Inform team

---

## POST-MIGRATION SUCCESS CRITERIA

All of these must be true:

- [ ] Forward migration completed without errors
- [ ] verify.sql shows all 12 checks passing
- [ ] All new constraints exist and enforced
- [ ] All new indexes created
- [ ] All new triggers active
- [ ] No constraint violations found
- [ ] Backend deployed and running
- [ ] No application errors in logs
- [ ] All endpoints responding
- [ ] Query performance unchanged or improved
- [ ] Zero breaking changes observed
- [ ] Feature flags disabled by default
- [ ] Ready for gradual feature rollout

---

## ROLLBACK SUCCESS CRITERIA

If rollback executed:

- [ ] Rollback script completed without errors
- [ ] CHECK constraints removed
- [ ] New tables preserved (data intact)
- [ ] Indexes removed
- [ ] Triggers removed
- [ ] Application restored
- [ ] All endpoints working
- [ ] No data loss

---

## MONITORING QUERIES (Copy & Paste)

### Active During Migration
\\\sql
-- Watch for locks
SELECT * FROM pg_locks WHERE NOT granted;

-- Check connections
SELECT datname, usename, count(*) FROM pg_stat_activity GROUP BY datname, usename;

-- Monitor progress (if indexes being created)
SELECT * FROM pg_stat_progress_create_index;
\\\

### Post-Migration Verification
\\\sql
-- Constraint verification
SELECT COUNT(*) FROM information_schema.table_constraints WHERE constraint_type = 'CHECK';

-- Table verification
SELECT table_name FROM information_schema.tables WHERE table_name IN ('session_integrity_events', 'session_browser_info');

-- Index verification
SELECT COUNT(*) FROM pg_indexes WHERE tablename IN ('test_sessions', 'question_responses');

-- Trigger verification
SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_name LIKE '%_updated';
\\\

### Performance Monitoring (1 hour after migration)
\\\sql
-- Query performance
SELECT query, mean_exec_time, calls FROM pg_stat_statements WHERE query LIKE '%test_sessions%' ORDER BY mean_exec_time DESC LIMIT 5;

-- Index usage
SELECT schemaname, tablename, indexname, idx_scan FROM pg_stat_user_indexes ORDER BY idx_scan DESC LIMIT 10;

-- Table sizes
SELECT tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) FROM pg_tables WHERE schemaname = 'public' ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
\\\

---

## KEY CONTACTS & ESCALATION

| Issue | Action | Contact |
|-------|--------|---------|
| Migration hangs >5min | Check logs, monitor queries | Database Admin |
| Constraint violation | Fix data, retry | Database Admin |
| Rollback needed | Execute 001_rollback.sql | Database Admin |
| Full restore needed | Restore from backup | DevOps / Database Admin |
| App not starting | Check error logs | Backend Team |
| Performance degraded | Check query plans | Database Admin |

---

## QUICK COMMAND REFERENCE

\\\ash
# Backup (staging)
pg_dump \ > backup_staging.sql

# Backup (production)
pg_dump \ | gzip > prod_backup.sql.gz

# Run migration
psql -v ON_ERROR_STOP=on --echo-all --log-file=migration_001.log \ -f backend/migrations/001_schema_improvements.sql

# Verify migration
psql \ -f backend/migrations/verify.sql

# Rollback
psql -v ON_ERROR_STOP=on --log-file=rollback_001.log \ -f backend/migrations/001_rollback.sql

# Check for locks
psql \ -c "SELECT * FROM pg_locks WHERE NOT granted;"

# Quick verification
psql \ -c "SELECT COUNT(*) FROM information_schema.table_constraints WHERE constraint_type = 'CHECK';"
\\\

---

## DOCUMENT REFERENCES

| Document | Purpose | Read Time |
|----------|---------|-----------|
| README.md | Executive summary & timeline | 5 min |
| QUICKSTART.md | Quick reference guide | 3 min |
| MIGRATION_GUIDE.md | Complete step-by-step | 20 min |
| BACKEND_INTEGRATION.md | Code changes required | 15 min |
| This file | Pre/during/post checklist | 10 min |

---

## FINAL SIGN-OFF

Before executing migration in production, confirm:

- [ ] All pre-migration checklist items completed
- [ ] Staging testing passed
- [ ] Team aware and available
- [ ] Backups verified
- [ ] Rollback tested in dev
- [ ] Monitoring dashboard ready
- [ ] Low-traffic window confirmed
- [ ] All stakeholders approved

**Signed off by**: ___________________  
**Date**: ___________________  
**Time**: ___________________  

---

**Generated**: 2026-09-04  
**Version**: 1.0  
**Status**: READY FOR EXECUTION
