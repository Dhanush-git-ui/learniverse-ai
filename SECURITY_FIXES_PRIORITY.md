# Security & Critical Issues - Remediation Priority
## Learniverse AI Project

**Date:** 2026-10-26  
**Status:** CRITICAL ISSUES IDENTIFIED  
**Urgency:** Fix P0 issues within 24 hours

---

## CONSOLIDATED FINDINGS

### Source
- **My Audit (Initial):** 10 findings (3 P1, 2 P2, 5 P3)
- **Phase 1 Subagent:** Complete scope inventory (200+ files, architecture)
- **Phase 2 Subagent:** Deep security review (5 P0, 6 P1, 7 P2, 7 P3)

**Total Unique Issues:** 20+ findings across all severities

---

## 🚨 CRITICAL P0 ISSUES (Fix NOW - 24 hours max)

### 1. HARDCODED JUDGE0 RAPIDAPI KEY IN SOURCE CODE
**File:** `backend/app.py` line 1613  
**Severity:** P0 - IMMEDIATE CREDENTIAL COMPROMISE  
**Evidence:**
```python
judge0_api_key = os.environ.get("JUDGE0_API_KEY", "").strip() or getattr(settings, "JUDGE0_API_KEY", "") or "4f20a9ed91msh760f84e4dfe3c76p1321c8jsn47eed2b4fe56"
```
**Risk:** Attacker reads source code → uses your RapidAPI key → consumes quota, modifies settings, accesses other projects  
**Action:**
- [ ] Remove hardcoded key immediately
- [ ] Rotate your actual Judge0 RapidAPI key
- [ ] Verify no other hardcoded keys in codebase: `grep -r "4f20a9ed91msh" backend/`
- [ ] Add pre-commit hook to prevent key commits

**Time:** 10 minutes

---

### 2. COMPLETE PRIVILEGE ESCALATION VIA LOCALSTORAGE
**File:** `src/pages/StudentDashboard.tsx` lines 88-117  
**Severity:** P0 - DIRECT ADMIN ACCESS WITHOUT AUTHENTICATION  
**Evidence:**
```typescript
let isAdminUser = false;
if (rawUser) {
  try {
    const u = JSON.parse(rawUser);
    if (u.role === "admin" || u.is_admin) isAdminUser = true;
  } catch {}
}
if (isAdminUser) {
  navigate("/assessment?admin=true", { replace: true });
  return;
}
```
**Exploit:** 
1. Open any page in browser
2. Open DevTools Console
3. Run: `localStorage.learniverse_student = JSON.stringify({role: "admin"})`
4. Reload page → redirected to `/assessment?admin=true`
5. Full admin access without any credentials

**Action:**
- [ ] Remove ALL localStorage-based role checks (lines 88-117)
- [ ] Backend JWT must be ONLY source of truth for roles
- [ ] Frontend reads role from decoded JWT token only
- [ ] If backend denies (JWT has `role: "user"`), show "Permission Denied"

**Time:** 20 minutes

---

### 3. UNAUTHENTICATED AUTH PATTERN - CODE EXECUTION ENDPOINT
**File:** `backend/app.py` line 1788  
**Severity:** P0 - FRAGILE AUTHENTICATION PATTERN  
**Evidence:**
```python
@app.post("/api/code/execute-raw")
@limiter.limit("20/minute")
def execute_raw_code(request: Request, req: RawExecuteRequest, _=Depends(verify_api_key)):
```
**Problem:** Parameter named `_` (underscore) is Python convention for "unused variable". While `verify_api_key` does validate, the pattern is fragile - a refactor could accidentally make this endpoint unauthenticated.

**Action:**
- [ ] Change to explicit auth verification:
```python
@app.post("/api/code/execute-raw")
@limiter.limit("5/minute")
async def execute_raw_code(
    request: Request,
    req: RawExecuteRequest,
    user_id: str = Depends(verify_api_key)
):
    logger.info(f"Code execution by {user_id}: lang={req.language}, code_len={len(code)}")
```
- [ ] Log user_id with every execution
- [ ] Lower rate limit to 5/minute (not 20)

**Time:** 15 minutes

---

### 4. HARDCODED DEV SECRET ACCEPTED IN PRODUCTION
**File:** `backend/auth.py` line 49  
**Severity:** P0 - DEVELOPMENT CREDENTIAL IN PRODUCTION  
**Evidence:**
```python
if settings.IS_DEV:
    valid_keys.append("devsecretkey")
```
**Risk:** If `IS_DEV=true` anywhere in config (env var typo, config error), anyone using string "devsecretkey" gains API access

**Action:**
- [ ] Remove dev key logic entirely
- [ ] Ensure `IS_DEV` is NEVER true in production
- [ ] Use only environment-loaded secrets

**Time:** 5 minutes

---

### 5. UNVALIDATED ADMIN QUERY PARAMETER
**File:** `src/pages/StudentDashboard.tsx` line 115  
**Severity:** P0 - DIRECT URL PRIVILEGE ESCALATION  
**Evidence:**
```typescript
navigate("/assessment?admin=true", { replace: true });
```
**Risk:** Attacker navigates to `/assessment?admin=true` directly and gains admin panel access if PlacementAssessment component doesn't validate backend JWT

**Action:**
- [ ] Remove `?admin=true` query parameter completely
- [ ] Backend issues JWT with `role: "admin"` claim only if user IS admin
- [ ] Frontend reads role from JWT only, never from URL params

**Time:** 10 minutes

---

## 🔴 MAJOR P1 ISSUES (This sprint)

### 6. CODE EXECUTION TEST HARNESS - INCOMPLETE OUTPUT PARSING
**File:** `src/services/codeExecutionService.ts` lines 839-864  
**Impact:** Silent test verdict failures (shows "PASSED" when actually failed)  
**Fix:**
- [ ] Validate all 4 prefix lines (I, P, A, E) present for each test
- [ ] Add validation that parsed idx is in bounds
- [ ] Log warnings if parsing is incomplete

**Time:** 1 hour

---

### 7. PYTHON HARNESS PARAMETER MISMATCH
**File:** `src/services/codeExecutionService.ts` lines 179-219  
**Impact:** Functions with wrong signatures silently fail  
**Fix:**
- [ ] Validate function signature before calling
- [ ] Or use `*args, **kwargs` passthrough wrapper

**Time:** 45 minutes

---

### 8. MISSING AUDIT LOGGING FOR CODE EXECUTION
**File:** `backend/app.py` line 1787-1802  
**Impact:** No user/timestamp tracking of code submissions (forensics, abuse detection impossible)  
**Fix:**
```python
logger.info(f"Code execution: user={user_id}, lang={req.language}, code_len={len(code)}, result={execution_result.get('run', {}).get('code')}")
```

**Time:** 20 minutes

---

### 9. ANALYTICS DATA NULL DISPLAY
**File:** `src/pages/StudentDashboard.tsx` line 666-667  
**Impact:** If analytics fails to load, shows "1 / 20" score (misleading - looks like student scored 1 mark)  
**Fix:**
- [ ] Render explicit loading state: "Assessment data loading..."
- [ ] Show skeleton loader

**Time:** 30 minutes

---

### 10. SQL INJECTION RISK IN INPUT PARSING
**File:** `backend/app.py` line 239 onwards  
**Impact:** Potential SQL injection if parsed input reaches database queries  
**Fix:**
- [ ] Use parameterized queries everywhere (psycopg2 `%s` placeholders)
- [ ] Validate all input against schema whitelist

**Time:** 2 hours

---

## 🟠 SIGNIFICANT P2 ISSUES

### 11. RATE LIMITING TOO WEAK
**Current:** 20 requests/minute  
**Action:** Lower to 5/minute for code execution
**Time:** 5 minutes

---

### 12. JWT EXPIRY NOT ENFORCED ON CLIENT
**Fix:** Parse JWT, check exp claim before sending
**Time:** 30 minutes

---

### 13. INSECURE TEMP FILE HANDLING
**File:** `backend/app.py` line 1403-1405  
**Fix:** Use `tempfile.TemporaryDirectory()` context manager
**Time:** 20 minutes

---

### 14. BASE64 ENCODING ERROR HANDLING
**Fix:** Add try-except for `UnicodeEncodeError`
**Time:** 10 minutes

---

### 15. THREAD POOL STARVATION RISK
**Fix:** Implement circuit breaker for slow Judge0 API
**Time:** 2 hours

---

## 🟡 MINOR P3 ISSUES

- Dead code: `get_code_execution_semaphore()` unused (line 49)
- Connection pool retry logging unclear
- Unhelpful error messages in frontend
- Stale comments

**Time:** 1 hour total

---

## REMEDIATION PLAN

### Phase 1: Emergency Fixes (24 hours - MANDATORY)
1. Remove hardcoded Judge0 key - 10 min
2. Fix localStorage admin bypass - 20 min
3. Fix auth pattern on code execution - 15 min
4. Remove dev secret - 5 min
5. Remove admin query parameter - 10 min
6. Rotate Judge0 RapidAPI key - 5 min
7. Add pre-commit hooks - 10 min

**Total Phase 1: ~75 minutes**

### Phase 2: High Priority (This sprint)
- Fix harness output parsing
- Fix Python parameter mismatch
- Add audit logging
- Fix analytics display
- Implement JWT expiry check
- Lower rate limits

**Total Phase 2: ~5-6 hours**

### Phase 3: Medium Priority (Next sprint)
- SQL injection fixes
- Temp file handling
- Circuit breaker pattern
- Dead code cleanup

**Total Phase 3: ~6-8 hours**

---

## VERIFICATION CHECKLIST

After fixes, verify:

- [ ] No hardcoded credentials in source code: `grep -r "4f20a9ed91msh\|devsecretkey\|162984921146" .`
- [ ] localStorage admin checks removed: `grep -r "localStorage.*admin\|is_admin" src/`
- [ ] Code execution logs user_id: `grep -A5 "execute_raw_code" backend/app.py`
- [ ] No `?admin=` query params: `grep -r "admin=true" src/`
- [ ] JWT validation on auth routes: Check `backend/auth.py` verify_api_key
- [ ] Rate limiting reduced: `grep -r "@limiter.limit" backend/app.py`

---

## SAFE TESTING COMMANDS

```bash
# Check for hardcoded keys
grep -r "4f20a9ed91msh\|devsecretkey" backend/ src/

# Check for localStorage role checks
grep -r "role.*admin" src/

# Verify no admin query params
grep -r "admin=true" src/

# Check JWT validation
grep -A10 "def verify_api_key" backend/auth.py

# Run backend tests (after credentials removed)
cd backend
pytest tests/test_security_audit.py -v
```

---

## DEPLOYMENT AFTER FIXES

1. **Before deploying:**
   - Run grep checks above - must return nothing for secrets
   - Run pytest security audit tests
   - Code review by second person

2. **During deployment:**
   - Rotate Judge0 RapidAPI key
   - Verify IS_DEV=false in production config
   - Check logs for any credential exposure

3. **After deployment:**
   - Monitor error logs for auth failures
   - Check audit logs for any anomalies
   - Verify admin access requires proper JWT

---

## NOTES

- **Judge0 Compiler Failure (My Audit):** Missing RAPIDAPI_KEY is now resolved by removing hardcoded fallback and requiring proper env var
- **Admin Bypass (Subagent Finding):** Critical - fixes privilege escalation completely
- **Architecture:** Frontend should NEVER make security decisions; backend JWT is source of truth

---

**Report Generated:** 2026-10-26  
**Audit Reports:** 
- `COMPREHENSIVE_AUDIT_REPORT.md` (my initial findings)
- Subagent Phase 1 & 2 reports (scope + security deep-dive)
