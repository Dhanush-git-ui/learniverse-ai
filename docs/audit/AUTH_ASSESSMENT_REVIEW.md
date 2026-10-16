# Authentication, Authorization, and Assessment Integrity Review

**Updated:** 2026-10-15  
**Scope:** Mounted authentication, assessment, analytics, and CDC routes; source changes and executable verification status. This is not a production security certification.

## Current findings

| ID | Severity | Finding | Current status |
|---|---|---|---|
| AUTH-001 | Critical | Admin password login used to have default identities/password paths. Configured admin identifiers now require a configured bcrypt hash; general login no longer elevates an unconfigured alias. Admin JWTs use the configured identifier as subject and expire in 8 hours. | Regression suite passed. Login limits are configured; exact 429 behavior has no dedicated test. |
| AUTH-002 | Critical | Google login previously accepted unsigned claims. It now uses Google token verification against configured `GOOGLE_CLIENT_ID`, requires verified email, exact admin email matching, and roster email match for students. | Mocked verifier, email verification, allowlist, and roster tests passed; live institutional OAuth and roster completeness remain unverified. |
| AUTH-003 | High | JWT validation previously omitted issuer, audience, and role checks, while analytics decoded tokens independently. Shared decoder now enforces signature, expiry, issuer, audience, subject, JTI, and `student`/`admin` role; analytics uses the shared decoder. | Regression suite passed. Key rotation invalidates all tokens; there is no individual revocation store. |
| AUTH-004 | Critical | Anyone could mint student tokens by naming a roll number. `/api/auth/hitam-login` now rejects student login; Google login only admits an email exactly present in the provisioned backend roster. | Arbitrary roll-number rejection and roster match tests passed; frontend/live institutional login compatibility remains unverified. |
| AUTH-005 | High | Assessment/CDC endpoints had incomplete role and ownership checks. CDC router now requires an admin JWT; feedback and candidate lookup endpoints bind to authenticated identity; assessment admin routes use `require_admin`. | Existing admin-denial and ownership regression suite passed. Generic-auth catalog/hint paths still need review. |
| AUTH-006 | High | Candidate ownership previously trusted caller-supplied IDs. Assessment operations now use the canonical token subject plus session ownership checks; student email aliases are not accepted as a second identity. Verified student token subjects use the canonical roster roll. | Available ownership regression tests passed; heartbeat session-ID behavior and untested rows in the matrix remain open. Student lookup now requires identity and returns limited profile fields. |
| ASSESS-001 | Critical | Legacy direct-score endpoint accepted client scores. It is admin-only. Normal submission computes MCQ/scenario scores on server and now ignores client coding pass counts, awarding no coding marks until server grading exists. | Modified-score and role-denial regressions passed. Coding marks remain unavailable pending a trusted grader. |
| ASSESS-002 | High | Duplicate submissions and DB errors could produce duplicate or acknowledged partial results. Submit now row-locks PostgreSQL session, conditionally changes `started` to final status, checks one-row update, and propagates key persistence failures to roll back the request transaction. | Ownership/scoring regressions passed. PostgreSQL commit/rollback smoke is configured in CI but skipped locally; assessment concurrency and duplicate-submit races remain unverified. File/CDC backup paths are not part of the DB transaction. |
| DATA-001 | High | Production assessment/CDC persistence could fall back to local SQLite or report unavailable results as empty. Assessment and CDC now avoid local SQLite in production and return 503 when PostgreSQL is missing/unavailable. Bulk CDC submissions are individually committed, so a mid-batch failure can still leave partial results. | Fail-closed regressions passed. A PostgreSQL-backed smoke test is configured in CI but not run locally. |
| AUTH-007 | High | No individual logout/revocation mechanism; bearer tokens remain valid until expiry or signing-key rotation. | Open. Login endpoints now use 5/minute limits (Google 10/minute); rate-limit key behavior ignores spoofable forwarding headers and uses strict JWT validation. No live load/rate-limit-store test yet. |

## Mounted assessment endpoint authorization matrix

All paths below are mounted under `/api/assessment`; the router-level dependency still accepts either the configured API key or a signed application JWT. Endpoint-level identity/role requirements are in the second column. An API key alone does not satisfy endpoint-level `get_current_user` or `require_admin` dependencies.

| Endpoint | Required identity / role and ownership | Operations and sensitive data | Regression coverage / status |
|---|---|---|---|
| `GET /student-lookup` | Student/admin JWT; student can query self only; admin any | Roster lookup, limited name/branch/role | Contact-field suppression regression passed |
| `POST /reset` | Student self or admin any candidate | Deletes attempts and sessions | Cross-candidate 403 regression passed |
| `POST /start` | Student self or admin | Creates assessment session; returns sanitized questions | Ownership source reviewed; no runtime start-session test |
| `POST /resume` | Student self or admin | Reads saved answers, code, timer and session | No direct foreign-session regression test |
| `POST /log-violation` | Active session owner or admin | Writes proctor events and may disqualify | No endpoint-specific runtime test |
| `POST /autosave` | Active session owner or admin | Writes submitted answers and code drafts | Foreign-session regression passed |
| `POST /submit` | Active session owner or admin; admin-only synthetic-session fallback | Computes marks and persists results/answers | Cross-candidate and client-code-score regressions passed; no route-level duplicate, race, timer, or DB-failure suite |
| `GET /fixly/submissions` | Admin | Lists candidate scores and result metadata | Student-denial regression passed |
| `GET /fixly/submissions/{submission_id}` | Admin | Candidate result details and answers | No direct test |
| `POST /fixly/submit-direct` | Admin | Persists supplied score/answers; score payload remains trusted for admins | Student-denial regression passed; admin payload remains trusted |
| `GET /fixly/export-excel` | Admin | Bulk candidate score export | Student-denial regression passed |
| `POST /feedback` | Student self/session owner or admin | Writes candidate feedback to JSON file | Foreign-candidate regression passed |
| `GET /analytics/{session_id}` | Session owner or admin | Reads score breakdown, answers and event analytics | Foreign-session regression passed |
| `GET /admin/sessions` | Admin | Lists candidate sessions and live status | Student-denial regression passed |
| `GET /admin/session/{session_id}` | Admin | Reads candidate session details | Student-denial regression passed |
| `GET /admin/export` | Admin | Exports sessions and candidate data | Student 403 regression passed |
| `POST /hint` | Router-level API key or signed JWT; no identity/ownership check | Returns coding hints; question/topic may be caller-selected | No test; confirm hint content cannot expose answer keys |
| `GET /catalog` | Router-level API key or signed JWT; no explicit role | Lists tests and schedule/catalog metadata | No endpoint-specific test; role/visibility review remains open |
| `GET /lookup-candidate` | Student self or admin | Checks assignment/eligibility by identifier | Foreign lookup denial regression passed |
| `GET /admin/tests/{test_id}/live` | Admin | Candidate assignment, completion, timer and violations | Student-denial regression passed |
| `POST /admin/tests` | Admin | Creates test, roster, questions | Student-denial regression passed |
| `POST /admin/tests/{test_id}/candidate-reset` | Admin | Resets candidate session and result | Student-denial regression passed |
| `POST /heartbeat` | Student matching request roll or admin | Updates live session/current question/violation telemetry | Cross-candidate regression passed; session-ID behavior needs a DB-backed test |
| `POST /admin/tests/{test_id}/bulk-assign` | Admin | Assigns candidates to a test | Student-denial regression passed |

## Mounted authentication endpoint matrix

| Endpoint | Required identity / role and ownership | Operations and sensitive data | Regression coverage / status |
|---|---|---|---|
| `POST /api/auth/admin-login` | Configured exact admin identifier plus valid configured bcrypt password | Mints admin JWT | Missing/default and configured credential regressions passed |
| `POST /api/auth/google-login` | Google-verified ID token for configured audience; exact admin allowlist or exact student roster email | Mints student/admin JWT and returns profile | Mocked forged-token, unverified-email, allowlist, and roster regressions passed |
| `POST /api/auth/google-hitam-login` | Same as `/google-login` (route alias) | Same as above | Shared handler regressions passed; alias dispatch not independently tested |
| `POST /api/auth/hitam-login` | Configured exact admin identifier + password hash for admin; students rejected | Mints admin JWT or rejects student login | Missing default admin and arbitrary-roll rejection regressions passed |

## Mounted CDC endpoint authorization matrix

The mounted `/api/cdc` router now requires `require_admin` on every endpoint. CDC is treated as an administrative placement-results surface. Student JWTs are rejected before endpoint execution.

| Endpoint | Required identity / role and ownership | Operations and sensitive data | Regression coverage / status |
|---|---|---|---|
| `GET /student/{roll_number}` | Admin JWT | Reads scores, rank, tiers, violation/proctor status and telemetry | Student-denial regression passed |
| `GET /student/{roll_number}/analytics` | Admin JWT | Reads detailed student analytics and recommendations | Router-level dependency reviewed; no endpoint-specific test |
| `GET /all-results` | Admin JWT | Lists all candidate results and filters | Router-level dependency reviewed; no endpoint-specific test |
| `POST /sync/{roll_number}` | Admin JWT | Queues external CDC score sync | Router-level dependency reviewed; no endpoint-specific test |
| `POST /bulk-submit` | Admin JWT | Writes arbitrary batch scores and queues external sync | Router-level dependency reviewed; no endpoint-specific test |
| `GET /bulk-tests` | Admin JWT | Lists bulk candidate results | Router-level dependency reviewed; no endpoint-specific test |
| `GET /bulk-tests/summary` | Admin JWT | Returns aggregated placement metrics | Router-level dependency reviewed; no endpoint-specific test |

## Test and verification results

Latest commands run from `learniverse-ai/` (backend command run from `backend/`):

| Command | Result |
|---|---|
| `..\\..\\.venv\\Scripts\\python.exe -m pytest -q` (from `backend/`) | Passed: 91 passed, 2 skipped, 2 warnings, 9 subtests. The PostgreSQL integration test skips locally without `TEST_POSTGRES_URL`; a Brotli test skips when the optional runtime dependency is absent. |
| `npm run type-check` | Passed. |
| `npm run lint` | Passed with 117 warnings, 0 errors. Explicit `any` is warning-level during migration; hook and correctness rules remain errors. |
| `npm test -- --reporter=dot` | Passed: 1 test file and 1 test. |
| `npm run build` | Passed. Main entry reduced from ~1.2 MB to ~312 KB; Lucide chunk remains ~744 KB and Vite reports a chunk-size warning. |
| PyYAML parse of `docker-compose.prod.yml` | Passed. Docker/Compose is unavailable locally; CI now runs `docker compose config --quiet` with synthetic config values. |
| `git diff --check` with `core.whitespace=cr-at-eol` | Passed; this Windows worktree uses CRLF. |

Not run locally: actual PostgreSQL commit/rollback smoke, concurrent assessment submit, duplicate submit under contention, expired-session submit, timer manipulation, repeated autosaves, unauthorized reset against persisted rows, live Google OAuth, live Judge0, browser E2E, accessibility, load, and backup/restore. CI now provisions PostgreSQL and runs the synthetic commit/rollback test. No production database, secret, or assessment record was read or written.

The distinct `backend/auth_service.py`, `backend/institutional_api.py`, dashboard/problem APIs, and other secondary routers were observed but are not mounted by `backend/app.py`. They are not currently part of the reachable route matrix; do not mount them without a separate authorization review because they implement separate identity/permission logic.

## Files changed in this phase

- `backend/auth.py` — shared JWT issuer/audience/subject/role/JTI validation, token claims, and role checks.
- `backend/auth_api.py` — roster-bound verified Google student login, removal of unproven public student login, shorter tokens, consistent admin subjects.
- `backend/analytics_api.py` — use the shared JWT validator instead of a separate decoder.
- `backend/cdc_integration.py` — require administrator JWT for all mounted CDC endpoints.
- `backend/placement_assessment_system/api.py` — constrain student lookup and candidate eligibility, bind feedback to caller/session, ignore untrusted code-run counts, serialize/fail closed on key submit writes.
- `backend/tests/test_security_audit.py` — add roster-auth, arbitrary-roll rejection, issuer/audience, CDC/admin surface, feedback, and ownership regressions.
- `backend/tests/test_api.py` — verify production readiness and self-hosted Judge0 authentication headers.
- `backend/app.py` — strict rate-limit key parsing, database-aware readiness, and self-hosted Judge0 auth token handling.
- `eslint.config.js`, `src/App.tsx`, `src/data/assessmentQuestions.ts`, `src/pages/PlacementAssessment.tsx`, `src/pages/StudentDashboard.tsx`, `src/pages/Top100Codes.tsx`, `src/pages/TopicDetailPage.tsx`, `src/components/Navbar.tsx`, and `src/services/codeExecutionService.ts` — clear blocking frontend type/lint issues and split eager route bundles.
- `.github/workflows/ci.yml`, `docker-compose.prod.yml`, and `../deployment/DEPLOYMENT_GUIDE.md` — gate service-backed checks, require deployment secrets, constrain ports, and document authenticated Judge0/TLS expectations.
- `AUTH_ASSESSMENT_REVIEW.md` — endpoint matrix, findings and verification ledger.
- `.gitignore`, `backend/.env.example`, and `backend/config.py` — earlier in-scope security checkpoint: ignore production environment file, document explicit identity/admin settings, and avoid printing the generated development API secret.

Other pre-existing modified and untracked files were preserved. UI behavior was not redesigned; frontend edits addressed type safety, hook correctness, lint blockers, and route chunking.

## Remediation tracker

| Finding | Status |
|---|---|
| AUTH-001 configured admin login and throttling | Verified by local regression suite; dedicated 429 exercise and production rate-limit store remain unverified |
| AUTH-002 Google verification and exact allowlist | Verified with mocked verifier tests; live institutional OAuth unverified |
| AUTH-003 JWT issuer/audience/role checks | Verified by local regression suite |
| AUTH-004 student identity proof | Verified with mocked Google/roster tests; deployed roster and login compatibility remain unverified |
| AUTH-005 assessment and CDC authorization | Partially verified; denial/ownership regressions pass, untested matrix rows remain |
| AUTH-006 candidate/session ownership | Partially verified; heartbeat session-ID and real database ownership remain open |
| AUTH-007 individual token invalidation | Open; bearer JWTs remain valid until expiry or key rotation |
| ASSESS-001 score tampering | Student direct-score rejection and modified client-code score tests passed; trusted coding grader remains unavailable |
| ASSESS-002 submission transaction/rollback | Mocked behavioral tests passed; CI PostgreSQL commit/rollback test not yet executed; concurrent submit unverified |
| DATA-001 PostgreSQL outage fail-closed | Unit/regression checks passed; CI PostgreSQL smoke not run locally; CDC bulk writes can partially persist |
| BASE-001 frontend quality gates | Type-check, lint (117 warnings), unit tests and production build pass locally; hosted service checks pending |

**Disposition:** The prior environment blockers are resolved. Do not declare the application secure or production-ready: live identity-provider behavior, PostgreSQL race behavior, and full service-backed CI still need evidence.
