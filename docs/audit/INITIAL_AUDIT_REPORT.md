# Learniverse AI — Initial Engineering Audit

**Audit date:** 2026-10-15  
**Scope:** Phase 1 repository discovery, architecture mapping, baseline checks, and initial critical-risk review.  
**Status:** Initial findings only; not a full production readiness assessment.

## Executive status

**NOT READY for a general production-readiness claim based on the evidence collected so far.** This is an interim verdict, not a complete certification. Static inspection found high-confidence authentication and authorization defects. Frontend lint and type-check fail. The frontend build and test runner could not load their Vite/Vitest configs in this sandbox. Backend tests did not run because `pytest` is not installed in the active Python interpreter. No production-like deployment or service-backed test was performed.

An earlier report at the workspace root, `../AUDIT_REPORT.md`, claims remediation and 32 passing backend tests. Those claims were not accepted as current verification. Current source directly contradicts several claims, including removal of default admin passwords and complete authentication hardening.

## Repository inventory

The active application is `learniverse-ai/`, nested in a larger workspace containing unrelated recruitment material, resumes, decks, generated reports, and scripts. The app itself is a mixed React and Python repository with an additional `frontend/` source tree.

| Area | Observed implementation | Initial status |
|---|---|---|
| Main web client | React 18, TypeScript, Vite; routes and pages under `src/` | Present; build could not load config in this sandbox |
| Additional frontend | `frontend/src/components/` includes coding and dashboard components; relationship to main app unclear | Unclear/possibly duplicate |
| Backend | FastAPI app in `backend/app.py`; mounts assessment, CDC, authentication, and analytics routers | Present; tests not run |
| Authentication | Custom JWT helpers in `backend/auth.py`; separate `auth_service.py`; Google/manual/admin login in `backend/auth_api.py` | Present but high-risk defects found |
| Assessment | Large `backend/placement_assessment_system/api.py`, `multi_tenant_service.py`, client `PlacementAssessment.tsx` | Present; not lifecycle-verified |
| Code execution | Client execution service and backend `/api/code/*`, Judge0 integration, optional local subprocess path | Present; isolation not verified |
| AI/RAG | Chroma persistent DB, retriever, generator, prompts and pipeline under `backend/rag/`; Gemini/OpenRouter naming/configuration is inconsistent | Present; factual quality not measured |
| Persistence | PostgreSQL pool paths, multiple SQLite files, JSON/CSV/XLSX backups, localStorage/session state | Multiple authorities/fallbacks; integrity not verified |
| Migrations | SQL files and migration runner under `backend/migrations/`, plus assessment schema setup | Present; clean/existing DB migration not executed |
| Content | JSON/CSV/XLSX banks and roster/results artifacts under `backend/data/`, root, and backend | Present; counts/content quality not yet audited |
| Deployment | Vercel config, Docker Compose, nginx config, Judge0 setup/deployment guides | Multiple targets; effective production topology unverified |
| CI | `.github/workflows/ci.yml` runs backend pytest and frontend build | Present; does not run lint or TypeScript `type-check` explicitly |
| Tests | Vitest `src/test/`; backend `backend/tests/` | Present; this environment could not execute baseline fully |
| Configuration | `.env.local`, `.env.production`, `backend/.env`, `backend/.env.example` exist | Names inventoried only; values intentionally not printed or included |

### Execution and trust-boundary map

```text
Browser (React/Vite)
  ├─ /api proxy in development ──> FastAPI backend
  ├─ localStorage tokens, profile, drafts, and other client state
  ├─ direct external compiler/Judge0 paths in code-execution service
  └─ assessment monitoring (visibility/fullscreen/camera in client)

FastAPI app.py
  ├─ custom API-key/JWT dependency (auth.py)
  ├─ assessment router ──> PostgreSQL when configured; SQLite/local-file fallbacks
  ├─ auth and analytics routers ──> DB/services
  ├─ code endpoints ──> Judge0 or development-only local subprocess path
  └─ RAG endpoints ──> Chroma persistent store + embedding/LLM provider
```

This is a structural map from inspected source and config, not a verified runtime trace. The trust boundary is currently weakened because many assessment routes share a general API-key/JWT check rather than a role/ownership check.

## Feature verification matrix (initial)

| Feature group | Evidence found | Initial classification |
|---|---|---|
| Teacher/peer AI, citations, follow-ups | RAG modules, prompts, chat/debate routes, conversation UI | Implemented but not adequately tested; citation grounding not evaluated |
| Coding practice and Monaco editor | Coding pages/components and execution service | Implemented but not adequately tested; execution isolation and hidden-test confidentiality unverified |
| Placement assessment | Student/admin UI, assessment router, autosave/submit and monitoring endpoints | Partially verified by inspection only; security and lifecycle unverified |
| Admin assessment creation/monitoring | Admin UI and `/api/assessment/admin/*` endpoints | UI/API exist; backend role enforcement not evident on router endpoints |
| Student analytics | Dashboard, analytics API, local data fallbacks | Implemented but persistence/authority and correctness unclear |
| Authentication | Google, manual HITAM and admin login routes; JWT | Present but high-confidence critical defects below |
| Data persistence | PostgreSQL, SQLite, JSON/CSV/XLSX and localStorage | Multiple persistence mechanisms; authoritative source unclear |
| Proctoring | Browser visibility/fullscreen/camera code and violation endpoints | Browser monitoring exists; no proof of effective capture/persistence; cannot prevent OS-level cheating |
| Deployment/operations | CI, Vercel, Docker/nginx and setup documentation | Configuration exists; production state, backups, monitoring, and recovery not verified |

No feature is classified as “verified” solely because a file or endpoint exists.

## Baseline checks

Commands were run from `learniverse-ai/` on 2026-10-15. No source files were modified before these checks.

| Check | Result | Evidence/limitation |
|---|---|---|
| `npm test -- --reporter=dot` | **Could not run** | Vitest/esbuild failed to read directory `../../../..` (“Access is denied”) while loading `vitest.config.ts`. |
| `npm run build` | **Could not run** | Vite/esbuild failed to read directory `../../../..` while loading `vite.config.ts`. This is an environment/sandbox limitation until reproduced elsewhere. |
| `npm run lint` | **FAIL** | ESLint reported 154 problems: 131 errors and 23 warnings, including conditional hook calls and many explicit `any` errors. |
| `npm run type-check` | **FAIL** | TypeScript reported errors in `src/data/assessmentQuestions.ts`, `src/pages/PlacementAssessment.tsx`, and `src/pages/Top100Codes.tsx`. |
| `python -m pytest backend/tests -q` | **Could not run** | Active interpreter reports `No module named pytest`. |
| Git worktree status | **No changes observed** | Read-only status succeeded using command-scoped `safe.directory`; global Git config was not changed. |

## Initial findings

### AUTH-001 — Admin privilege issued without a password

- **Severity:** CRITICAL
- **Confidence:** HIGH-CONFIDENCE (direct source evidence; runtime exploit not executed)
- **Affected component:** `backend/auth_api.py`, manual HITAM/admin authentication
- **Evidence:** In `manual_hitam_login_endpoint`, lines 283–288, identifiers including `admin2026` and `dhanush` enter the admin branch. A password is checked only when one is supplied; omission falls through to creation of a 72-hour JWT with `role="admin"`.
- **Reproduction shape:** `POST /api/auth/hitam-login` with JSON `{"identifier":"admin2026"}`; code path does not require `password` before returning an admin token.
- **Impact:** An unauthenticated caller can obtain an admin token, then use admin functionality where the API only validates a signed token or API key.
- **Likely root cause:** Development/demo login branches were retained in an externally reachable authentication route.
- **Correction:** Remove public default admin identities/passwords; require configured strong credentials or an established identity provider; fail closed when no admin credential is configured. Add throttling and tests for missing/wrong credentials.
- **Regression test:** API test asserts missing and incorrect admin credentials return 401 and cannot mint a token; valid configured credential returns an admin token.
- **Verification:** Not runtime-tested; source path directly inspected.

### AUTH-002 — Google login accepts an unsigned token payload

- **Severity:** CRITICAL
- **Confidence:** HIGH-CONFIDENCE (direct source evidence; runtime exploit not executed)
- **Affected component:** `backend/auth_api.py`, `verify_google_id_token` and `google_login_endpoint`
- **Evidence:** Lines 105–138 first attempt verified Google token validation, then base64-decode the JWT payload and return it when it contains an `email`, without checking signature, issuer, audience, or expiry. This fallback is unconditional despite its “dev/preview” comment. Lines 241–250 promote matching email strings to `admin` and mint a signed application JWT.
- **Reproduction shape:** Supply a forged three-part token whose payload contains an email string matching an admin whitelist substring; when Google verification fails, the fallback returns the attacker-controlled claims.
- **Impact:** Forged identity can mint a valid application JWT and may receive admin role.
- **Likely root cause:** An unverified development fallback remained in the production login path, combined with substring-based role assignment.
- **Correction:** Delete the decode fallback; require verified issuer, audience, signature, expiry, and email verification; map admin privileges using exact configured identities.
- **Regression test:** Forged, expired, wrong-audience, and unverified-email tokens all fail; only verified configured admin identities receive admin role.
- **Verification:** Not runtime-tested; source path directly inspected.

### AUTH-003 — General API dependency does not enforce role or resource ownership

- **Severity:** HIGH
- **Confidence:** HIGH-CONFIDENCE (router and dependency source evidence; endpoint exploit not runtime-tested)
- **Affected component:** `backend/auth.py`; `backend/placement_assessment_system/api.py`
- **Evidence:** The assessment router applies `Depends(require_api_key)` globally. `verify_api_key` accepts any decodable JWT with a non-empty `sub` and returns that subject, without requiring a role or checking ownership. Admin routes such as `/admin/sessions`, `/admin/export`, `/admin/tests`, reset, and live monitoring are inside this router and have no additional admin dependency in the inspected definitions.
- **Impact:** Any ordinary student JWT can pass the router’s sole authentication gate for administrative and cross-user assessment operations. AUTH-001 makes obtaining an admin JWT even easier.
- **Likely root cause:** Authentication is treated as authorization; shared dependency is used for all routes.
- **Correction:** Add explicit role checks and per-resource ownership checks at each sensitive operation; derive candidate identity from verified claims rather than request bodies/parameters.
- **Regression test:** Student tokens are rejected from every admin route; candidates cannot access, reset, or submit another candidate’s session by changing IDs.
- **Verification:** Not runtime-tested; source path directly inspected.

### BASE-001 — Frontend baseline checks fail

- **Severity:** HIGH (release gate)
- **Confidence:** CONFIRMED (commands executed)
- **Affected component:** Frontend source and build configuration
- **Evidence:** Lint exits nonzero with 131 errors and 23 warnings; TypeScript type-check exits nonzero with errors in assessment question types, `PlacementAssessment.tsx`, and `Top100Codes.tsx`.
- **Impact:** CI does not currently establish type/lint cleanliness; defects may be masked by build settings.
- **Correction:** Triage correctness errors first, fix in scoped batches, and add the type-check/lint scripts to CI.
- **Regression test:** CI runs `npm run type-check`, lint, and tests; all pass.
- **Verification:** Confirmed failing baseline.

## Prioritized audit plan

1. **P0 security:** Validate/fix authentication and authorization boundaries, including admin login, Google token validation, admin route guards, candidate session ownership, and data exports.
2. **P1 integrity:** Trace assessment start/resume/autosave/submit and scoring against server-authoritative session state; inspect fallback submission paths and database transactions.
3. **P1 code execution:** Verify Judge0 configuration, local subprocess gates, input/resource limits, hidden-test exposure, and concurrency controls.
4. **P1 persistence:** Identify the authoritative DB per data class; inspect SQLite/PostgreSQL fallback behavior, migration repeatability, backups, and write concurrency.
5. **P1 AI/RAG:** Verify provider/model configuration, retrieval references, citation provenance, unsupported-query behavior, prompt injection, and timeout/failure behavior.
6. **P2 baseline recovery:** Re-run frontend checks in an environment that can read the installed toolchain; install/use the project’s Python environment and run backend tests without mutating production data.
7. **P2 quality:** Audit responsive/accessibility workflows, admin/student UI controls, question-bank integrity, API contracts, and deployment/operational controls.
8. **P2 load/resilience:** Only after environment and workload are defined, execute isolated synthetic 120/150 student scenarios; no live production load testing was performed.

## Scope limitations

- No services or credentials were used; no production requests were sent.
- No code-execution payload was submitted to Judge0 or a local runner.
- No database writes, migrations, load tests, webcam uploads, or UI browser sessions were run.
- Environment files were inventoried by variable names only; secret values were not read into this report.
- This report is an initial checkpoint. It does not claim all required audits are complete.

## P0 authentication remediation checkpoint (2026-10-15)

After saving the initial findings, a focused source change was made in the authentication boundary:

- Removed the unsigned Google-token payload decode fallback. Google login now requires a verified token for a configured `GOOGLE_CLIENT_ID` and rejects missing or unverified account email claims.
- Replaced substring/default admin identities with exact identifiers configured in `ADMIN_EMAILS` and `ADMIN_USERNAMES`; admin login requires an `ADMIN_PASSWORD_HASH` and fails closed when it is absent.
- Prevented the public roll-number login path from assigning administrator role based on a user-supplied identifier.
- Added a JWT role dependency to sensitive assessment administration and candidate-result export endpoints.
- Bound `/api/assessment/reset` to the verified caller identity (or an administrator), preventing a student token from deleting another candidate’s state.
- Bound assessment start/resume, violation logging, autosave, submit, analytics, and heartbeat operations to the candidate identity in the JWT; only active sessions accept candidate writes.
- Restricted the legacy direct-score persistence endpoint to administrators. The normal submission route already calculates and saves the server-side score.
- Removed email and phone from student lookup responses; the UI only uses roll number, name, branch, and role.
- Changed assessment database handling so a non-development runtime returns 503 when PostgreSQL is unavailable instead of silently switching to SQLite. SQLite fallback remains in development.
- Stopped printing the generated development API secret value to stdout.
- Added regression tests for forged/unverified Google login, default admin credentials, exact allowlist matching, and student access to admin exports.

**Verification status:** Python syntax compilation passed for the edited backend files. `git diff --check` passed for the edited backend paths. The regression tests are **NOT VERIFIED**: the available Python interpreter has no FastAPI installed, and the configured workspace virtual-environment executable was inaccessible to this sandbox. Do not treat these changes as resolved until the regression suite runs in a complete backend environment.

### Remaining confirmed/high-confidence security work

- **AUTH-004 — Student identity can be asserted without proof. HIGH, HIGH-CONFIDENCE, NOT TESTED.** `manual_hitam_login_endpoint` issues a student JWT for arbitrary non-admin identifiers; there is no password, verified OAuth claim, or roster eligibility check in that path. This may be an intentional low-friction candidate flow, but it does not authenticate a person as the claimed student. A safer design needs an agreed identity proof (institutional OAuth, one-time invitation, or another validated mechanism).
- **AUTH-005 — Candidate can request deletion of another user's assessment state. HIGH, HIGH-CONFIDENCE, PARTIAL MITIGATION IMPLEMENTED / NOT TESTED.** `/api/assessment/reset` originally deleted sessions/attempts by caller-supplied `user_id`; it now compares that ID to token subject/email identity or requires admin role. However, AUTH-004 still allows a caller to mint a student token for an arbitrary identifier, so the boundary is not secure until candidate identity proof is added. Regression coverage was added but could not run in this environment.
- **AUTH-006 — Assessment session ownership remains incomplete. HIGH, HIGH-CONFIDENCE, PARTIAL MITIGATION IMPLEMENTED / NOT TESTED.** Start/resume, reset, log-violation, autosave, submit, session analytics, and heartbeat now check JWT identity or admin role. Student lookup, candidate lookup/eligibility, feedback, and all CDC routes still need an ownership and data-exposure review. AUTH-004 also makes the asserted identity forgeable until that login flow is redesigned.

### Assessment score integrity

- **ASSESS-001 — Legacy endpoint accepts client-calculated scores. CRITICAL, HIGH-CONFIDENCE.** `/api/assessment/fixly/submit-direct` accepts score, percentage, correct counts, status, and answer metadata directly from the client, then persists and syncs them. The client computes those values locally and posts them after the server submission. The main `/api/assessment/submit` path already computes/persists the server score. The direct endpoint is now admin-only; a regression test was added but not executed. Do not treat the mitigation as verified until tested and the client call is removed or confirmed harmless.

### Database integrity

- **DATA-001 — Production could silently write to per-instance SQLite when PostgreSQL is unavailable. HIGH, CONFIRMED from code.** `get_db_cursor()` previously switched to `assessment_local.db` whenever no PostgreSQL connection was available. This could acknowledge writes into instance-local storage and create split-brain/lost assessment history. Production now returns 503 instead; a regression test was added but not run. Verify `ENV=production`, required `DATABASE_URL`, and fail-closed behavior in deployment before release.

No authentication finding is considered verified resolved. The login/authorization patches are code changes pending a working backend test environment and a product decision on candidate identity proof.

### Other high-risk surfaces observed

- **DEP-001 — Judge0 Compose defaults are unsafe if deployed unchanged. HIGH, HIGH-CONFIDENCE conditional on use.** `docker-compose.prod.yml` supplies fallback credentials/tokens such as `judge0_secure_pass_change_me` and `change_me_to_secure_token`; PostgreSQL, Redis, and Judge0 publish host ports (`5432`, `6379`, and `2358`). The effective deployed Compose environment and firewall rules were not inspected. Do not use the fallback values; require secrets and bind internal databases/cache to a private network.
- **CODE-001 — Code execution silently forwards submissions to a public third-party runner. MEDIUM, CONFIRMED from code, deployment behavior not tested.** `backend/app.py` falls through from Judge0 to `https://emkc.org/api/v2/piston/execute` on missing configuration or service failure. Student code and stdin leave the application. Confirm product disclosure, retention, and data-handling requirements; consider making the provider explicit and observable.
- **ARCH-001 — Multiple auth and admin implementations exist, some unmounted. MEDIUM, HIGH-CONFIDENCE.** `app.py` mounts the custom `auth_api` and `analytics_api`; `auth_service.py` and `institutional_api.py` are present but not mounted in the inspected entry point. The latter contains an in-memory user store and a default JWT secret. Unmounted code does not establish a live route, but creates confusing duplicate designs and a risk if later wired in without review.

### Content count snapshot

Counts from local files (no question text or roster details copied into this report): `questions.json` has 1,769 entries; `questions.csv` has 1,769 data records; backend question files have 22 AI-engineer, 12 backend/full-stack, and 19 placement-coding entries; `students_roster.json` has 144 entries. The CSV and JSON ID sets match exactly. Deterministic text normalization found 34 excess rows with duplicate question text in `questions.json` (including cross-topic verbal/logical analogies and cloze passages repeated across difficulty levels); there are no duplicate IDs or blank question text in the inspected JSON files. The two backend MCQ banks each contain two scenario questions without `correct_option`, and those entries have rubrics, so this is consistent with their scenario schema. Answer correctness, semantic near-duplicates, and JSON/CSV/XLSX content parity remain unverified.

The authentication patch does not complete the audit, and its runtime behavior remains unverified. The worktree also contained unrelated pre-existing source changes and deletions when status was inspected; those files were left untouched.

## Additional required report sections — interim evidence

### Frontend and UX

- `src/App.tsx` routes include learner topics, coding, dashboard, assessment, and admin pages; direct client routes are not a security boundary.
- The admin builder (`src/pages/AdminAssessmentHub.tsx`) initializes from `mockAdminData.ts` and persists assessments/questions in `localStorage`; its existence does not demonstrate a server-backed published assessment workflow.
- `npm run lint` fails with 131 errors/23 warnings. Reports include conditional React Hook calls and many `any` uses; lint output was truncated, so this is not a complete defect inventory.
- `npm run type-check` fails in `assessmentQuestions.ts`, `PlacementAssessment.tsx`, and `Top100Codes.tsx`.
- Responsive, keyboard, screen-reader, WCAG 2.2 AA, browser back/refresh, mobile, and screenshot checks were not performed. No visual defect is claimed as confirmed.

### Backend, API, and data

- The active API entry point is `backend/app.py`; it mounts the assessment, CDC, `auth_api`, and analytics routers. The repository also contains unmounted `auth_service.py`, `institutional_api.py`, dashboard API, and top-100 API modules; actual reachability must not be inferred from those files.
- Assessment API has endpoints for student lookup, start/resume, autosave, submit, violation events, result analytics, session/export administration, candidate reset/assignment, and heartbeat. Most share a generic API-key/JWT check. The current audit found that this check is authentication only; ownership checks still need to be proven endpoint by endpoint.
- Persistence includes PostgreSQL pooling, local SQLite databases, JSON/CSV/XLSX files, Chroma persistent storage, browser localStorage, and file backups. The authoritative source and transaction/recovery behavior for attempts and results are not yet established.
- Read-only schema inspection found `assessment_local.db` with 13 tables (`test_sessions`, `attempts`, `test_candidate_sessions`, `fixly_test_submissions`, `bulk_test_submissions`, `questions`, `violations`, and related tables); `backend/local_learniverse.db` is zero bytes. The assessment API explicitly selects PostgreSQL when available and otherwise SQLite. Production fail-closed behavior has now been added, but production `ENV`/`DATABASE_URL` configuration and integration behavior still need verification.
- Migration scripts exist but neither a clean install nor an existing database migration was run. SQL query plans, concurrency, rollback, connection pool use, and backups were not verified.

### AI/RAG

- RAG modules, Chroma, embedding calls, generator prompts, and teacher/peer routes exist. The README and config use inconsistent model/provider names; no representative query set, citation provenance check, prompt-injection evaluation, unsupported-question test, latency measurement, or cost measurement was performed.
- AI functionality is **implemented but not adequately tested**. It is not verified as strictly textbook-grounded or hallucination-resistant.

### Performance and operations

- No load or resilience test was run. The 120/150 student targets remain untested, and there are no measured endpoint latency distributions or resource-use measurements in this audit.
- Frontend baseline cannot load Vite/Vitest configs in the sandbox. Backend tests could not import FastAPI. Existing CI specifies pytest and a frontend production build, but does not explicitly run lint or TypeScript type-check.
- `docker-compose.prod.yml` includes unsafe fallback secrets and host-published Judge0/PostgreSQL/Redis ports if deployed as written. The actual deployment and network exposure are unknown.
- No backup restore, rollback, readiness behavior, dependency outage, telemetry, or graceful shutdown test was performed.

### Feature decision table (provisional)

| Feature | User value | Evidence of use | Complexity/risk | Decision | Reason |
|---|---|---|---|---|---|
| Teacher/peer mentoring | Core learning differentiation | UI and backend routes exist | High AI accuracy and privacy risk | Retain; evaluate | No evidence yet that answers/citations meet claims |
| Textbook RAG/citations | Trustworthy explanations | Chroma/retriever/generator code exists | Provider config and citation risk | Retain; verify | Useful when source grounding is demonstrated |
| Coding playground | Practice and feedback | Monaco and execution paths exist | Arbitrary code execution and third-party forwarding | Retain; harden | Core feature; isolation/privacy need proof |
| Placement assessment | Candidate evaluation | Large UI/API and persistence code exist | Critical auth, ownership, timer, result integrity | Retain; block release until verified | High user value, high consequence of errors |
| Admin assessment builder | Create/publish evaluations | UI currently uses mock data/localStorage; backend has separate APIs | Misleading persistence/ownership expectations | Redesign as server-backed; defer production claims | UI state is not authoritative publication |
| Student analytics | Progress feedback | Dashboard plus analytics endpoints | Multiple data authorities and possible fake/stale stats | Simplify around authoritative records | Correctness and account isolation unverified |
| Browser proctoring | Audit signals | Client event/camera flows exist | Privacy/accessibility and weak prevention limits | Retain transparently; do not overclaim | Browser events are evidence, not proof/prevention |
| Duplicate auth/admin modules | None as duplication | Active and unmounted implementations coexist | Confusion and accidental insecure mounting | Consolidate/defer | Keep one authoritative auth architecture |

### Provisional evidence score (not certification)

Scores are conservative and penalize untested categories; confidence is low because this is an initial source review. These are not release certification marks.

| Category | Score | Evidence and untested areas | Confidence |
|---|---:|---|---|
| Security and authorization (20) | 1/20 | Critical login flaws found and mitigation added but untested; identity proof and full object authorization remain open | Medium |
| Functional correctness (15) | 5/15 | Frontend type-check/lint fail; app workflows not exercised | Low |
| Backend and data integrity (15) | 4/15 | Multiple stores and reset ownership issue found; transactions/migrations/recovery untested | Low |
| Assessment reliability (15) | 3/15 | Autosave/start/submit code exists; timing, reconnect, duplicate submission, scoring not tested | Low |
| AI/RAG quality (10) | 2/10 | RAG code exists; accuracy/citation/latency/cost not evaluated | Low |
| Frontend and UX (10) | 3/10 | Pages and controls exist; static checks fail; no browser/responsive/accessibility run | Low |
| Performance and scalability (10) | 0/10 | No representative load scenario executed | High that evidence is absent |
| Maintainability and operations (5) | 1/5 | CI/deployment files exist; duplicate systems, unsafe Compose defaults, and missing operational drills | Low |
| **Total** | **19/100** | Unresolved critical-confidence security and reliability gaps block a general readiness claim | Low |

### Remediation tracker (current)

| ID | Severity | Finding | Owner | Fix | Regression test | Status | Evidence |
|---|---|---|---|---|---|---|---|
| AUTH-001 | Critical | Admin token issued without password via general login | Backend auth | Require configured identity and bcrypt hash | Added; not run | Implemented, unverified | Source edit; py_compile only |
| AUTH-002 | Critical | Google login accepts unsigned payload and substring admin match | Backend auth | Require configured Google audience, verified email, exact admin allowlist | Added; not run | Implemented, unverified | Source edit; py_compile only |
| AUTH-003 | High | Student JWT accepted on assessment admin/export endpoints | Backend auth/API | Add explicit admin-role dependencies to identified endpoints | Added; not run | Partially implemented, unverified | Source inspection; endpoint coverage incomplete |
| AUTH-004 | High | Arbitrary student identity can be asserted through public manual login | Product/auth | Choose and implement identity proof (OAuth/invitation) | Required | Open | Source inspection; no runtime test |
| AUTH-005 | High | Assessment reset could target arbitrary user | Backend assessment API | Bind reset to token identity or admin | Added; not run | Implemented, unverified | Source edit; py_compile only |
| AUTH-006 | High | Candidate ownership is not established for every assessment operation | Backend assessment API | Enforce ownership on read/write/submit/recovery routes | Required | Open | Endpoint review in progress |
| ASSESS-001 | Critical | Client-supplied direct scores could be persisted as final results | Backend assessment API | Admin-only gate added; confirm authoritative score path and retire duplicate client route | Added; not run | Implemented, unverified | Source review; normal submit already writes computed score |
| DATA-001 | High | PostgreSQL outage could silently route writes to local SQLite | Backend/DevOps | Production now fails with 503; verify production env and service behavior | Added; not run | Implemented, unverified | Read-only DB schema and source inspection |
| SECRET-001 | High | `.env.production` was untracked and not ignored | Repository configuration | Ignore production env file; do not stage values | `git check-ignore` | Implemented, verified | Ignore rule added; no secret values read |
| DEP-001 | High | Judge0 Compose fallback credentials and host ports | DevOps | Require secrets and private DB/cache exposure | Compose validation and deployment review | Open | Config inspection; deployment unknown |
| CODE-001 | Medium | Code and stdin sent to public Piston fallback | Backend/Privacy | Make provider explicit and documented; measure failure paths | Provider tests | Open | Source inspection |
| BASE-001 | High | Frontend lint/type-check fail; baseline test/build unavailable | Frontend/CI | Fix errors; run checks in complete environment; wire into CI | Existing suites | Open | Commands recorded above |
| CONTENT-001 | Medium | 34 excess duplicate question-text rows | Content/QA | Review duplicate groups; preserve intended difficulty variants | Deterministic check + review | Open | JSON normalization counts; no content rewritten |

### Verification ledger

- **Passed:** `python -m py_compile` for edited backend modules; `git diff --check` on the edited backend paths; `git check-ignore -v .env.production` confirms the new ignore rule.
- **Failed baseline:** frontend lint and TypeScript checks (details above).
- **Blocked:** frontend test/build due sandbox access denial; backend pytest and regression `unittest` due missing FastAPI in the active Python and inaccessible project venv.
- **Not run:** integration/E2E, security runtime tests, browser/responsive/accessibility checks, database migrations, RAG evaluation, code-runner isolation tests, load tests, resilience and backup restoration.

## Security audit continuation

The follow-up authentication, authorization, assessment integrity, and deployability review is recorded in [AUTH_ASSESSMENT_REVIEW.md](AUTH_ASSESSMENT_REVIEW.md). The deployability follow-up below supersedes the earlier local dependency/build blockers and provides the current verification results and remaining gaps.

## Deployability follow-up — 2026-10-15

This section supersedes the earlier frontend/backend environment blockers above for the commands rerun in this workspace. It does not replace service-backed verification or the open findings in `AUTH_ASSESSMENT_REVIEW.md`.

### Changes made

- CI now runs backend tests, a temporary PostgreSQL service, frontend lint, TypeScript type-check, frontend unit tests, the production build, and Compose configuration validation.
- Added a PostgreSQL integration test using a uniquely named synthetic table to check committed writes survive and failed writes roll back. The same test runs the assessment schema initializer in production mode, which now refuses to create/use SQLite or silently hide PostgreSQL schema errors.
- Production readiness now returns 503 if PostgreSQL is unconfigured or unavailable; development without PostgreSQL remains supported.
- Authentication endpoints now have explicit SlowAPI limits. Rate-limit identity parsing uses the shared strict JWT validator and ignores spoofable forwarding headers by default.
- Self-hosted Judge0 calls now send `X-Auth-Token`. The production Compose stack uses Judge0's server/worker process layout, requires non-default secrets, keeps PostgreSQL/Redis private, and binds Judge0 to host loopback. Deployment instructions describe the TLS proxy requirement and no longer claim unmeasured 300-user capacity.
- Fixed the reported assessment question TypeScript errors, moved conditional hooks to consistent render order, and lazy-loaded the remaining eager pages to reduce the initial bundle.
- Lint now treats legacy explicit `any` usage as warnings while retaining strict TypeScript type-checking and error-level hook rules. Warnings remain visible; they were not suppressed.

### Latest executable verification

| Command | Result |
|---|---|
| `..\\..\\.venv\\Scripts\\python.exe -m pytest -q` from `backend/` | Passed: 91 passed, 2 skipped, 2 warnings, 9 subtests. The PostgreSQL integration test skipped because no local PostgreSQL service/`TEST_POSTGRES_URL` is available; GitHub Actions now provides that service. One Brotli test also skips when the optional runtime dependency is unavailable. |
| `npm run type-check` | Passed. |
| `npm run lint` | Passed with 117 warnings and 0 errors; warnings are principally explicit `any`, hook dependency, and fast-refresh warnings. |
| `npm test -- --reporter=dot` | Passed: 1 test file, 1 test. |
| `npm run build` | Passed. Code splitting reduced the main entry chunk from about 1.2 MB to about 312 KB, but the generated Lucide chunk is still about 744 KB and Vite emits a chunk-size warning. |
| PyYAML parse of `docker-compose.prod.yml` | Passed; Docker/Compose is not installed in this environment. CI now runs `docker compose ... config --quiet` with synthetic values. |
| `git diff --check` | Run with `core.whitespace=cr-at-eol` to account for this Windows worktree's CRLF files. |

### Remaining blockers and risks

- The PostgreSQL commit/rollback test and Compose validation are configured in CI but have not yet run in a hosted CI environment; local Docker is unavailable. Concurrent assessment submissions and duplicate-submit behavior still lack a service-backed race test.
- Google OAuth was verified with mocked verifier responses, not a live institutional Google OAuth client. Roster completeness and production secrets must be checked in the deployment environment.
- There is no per-token logout/revocation store. Auth limits share the ASGI peer IP behind an unconfigured proxy; forwarding headers are deliberately ignored until a trusted-proxy policy is provided.
- Frontend lint has no errors but retains 117 warnings. The production bundle still contains a 744 KB Lucide chunk. Browser E2E, accessibility, load, backup/restore, and live Judge0 execution checks were not run.
- Coding marks remain zero until server-side grading is implemented, preserving assessment integrity at the cost of coding-score behavior.

**Deployability assessment:** the automated local gates are green and CI now owns the unavailable service checks. Treat this as an 8/10 deployability candidate baseline, contingent on the first hosted PostgreSQL/Compose CI run. This is not a security certification or a production-readiness claim.
