# Final engineering audit (working-branch result)

**Date:** 2026-11-08 | **Branch:** `hardening/deployable-8-of-10`

## Scope and result

This was a source-grounded audit and remediation pass, not a complete production certification. The repository has multiple API modules, duplicated database pools, mixed deployment-era code and pre-existing private response files. High-confidence issues were corrected in the working tree: embedded browser/server keys, fixed JWT/Judge0 secrets, default admin hashes, analytics header identity, unrostered student auto-provisioning, public dashboard/portfolio access, unsafe HTML interpolation, disconnected chat retrieval, and scenario word-count scoring.

## Prioritized findings

| Priority | Finding | Current disposition |
|---|---|---|
| P0 | Fixed JWT/API/Judge0 keys accepted or shipped in source, including frontend bundle | Removed from active code; explicit secrets required. Rotate old credentials. |
| P0 | Default admin usernames/password hashes | Removed; explicit allowlist/hash required. |
| P0 | Client roll-number header could create analytics identity | Removed; JWT is required. |
| P0 | Any syntactically valid HITAM email could be auto-enrolled | Removed; exact roster match required. |
| P1 | Student dashboard and portfolio looked up by roll number without auth; HTML used unescaped profile values | Owner/admin JWT enforced; HTML/JSON-LD escaped. Public sharing now needs an explicit consent design. |
| P1 | Active chat skipped vector retrieval and returned no sources | Retrieval wired to active path with source selection and regression coverage; corpus relevance remains unmeasured. |
| P1 | Scenario score depended only on answer length | Removed; explicit signals needed; existing prose-only rubrics are manual-review/zero-auto-score. |
| P1 | Code assessment scores cannot be trusted from client; no server grader | Client verdict remains ignored and coding marks zero; trusted hidden-case grader is still absent. |
| P2 | Several DB pools, direct file backups, and external service fallbacks complicate recovery | Documented; no live database/load/recovery verification. |
| P2 | Historical tracked candidate data may remain in Git history | Current index removal preserves local files; history purge and old artifact controls remain. |
| P2 | Large frontend chunks | Build succeeds but warns; no performance optimization performed. |

## Verification evidence

- Backend regression tests: 13 passed in the final targeted run (auth fallback/configuration, admin defaults, analytics header, scenario rubric behavior, retrieval selection, compiler outage behavior, portfolio ownership and HTML escaping).
- `python -m compileall -q backend` passed.
- Frontend: type check passed; unit tests passed (1 test); production build passed with chunk-size warnings; lint passed with 122 warnings and no errors.
- Docker Compose check was not run successfully because `docker` is not installed.
- The combined legacy backend suite stalled in the current environment; full suite is therefore not verified. No provider, database, migration, browser E2E, production or 120-user load test was completed.

## Readiness score

| Category | Weight | Awarded | Basis |
|---|---:|---:|---|
| Security | 20 | 10 | Several critical fixes and tests; history/live secret rotation and broader route review incomplete. |
| Backend reliability | 15 | 7 | Focused error/identity fixes; full backend suite and runtime health unverified. |
| Database integrity | 15 | 6 | Assessment transaction path reviewed; pools, backup/recovery and concurrency not proven. |
| Assessment correctness | 15 | 6 | Server score authority and conservative scenario behavior; manual review workflow/grader incomplete. |
| AI/RAG reliability | 10 | 6 | Active retrieval connected and unit-covered; actual corpus/provider relevance not evaluated. |
| Compiler reliability | 10 | 3 | Secret fallback removed and Piston explicit; runtime sandbox limits and service tests incomplete. |
| Frontend quality | 5 | 4 | Type check, unit test and production build pass; chunk warning and E2E gaps. |
| Performance | 5 | 1 | Build evidence only; no measured load capacity. |
| Deployment and monitoring | 5 | 2 | Config and guide reviewed; Docker/live deployment, alerts and recovery unverified. |
| **Total** | **100** | **45** | **4.5 / 10** |

## Remaining blockers and recommendation

- Rotate provisioned secrets and purge candidate data from shared Git history/artifacts.
- Run all backend tests in CI with isolated PostgreSQL; run migrations, backup/restore and duplicate/concurrent submission tests.
- Add consent-based public portfolio sharing, scenario reviewer workflow, and trusted coding grader.
- Verify actual RAG retrieval quality and provider behavior; verify Judge0 resource limits.
- Validate Render/Vercel/Neon/Judge0 staging deployment and load-test at graduated concurrency before a pilot.

**GO / NO-GO: NO-GO for production student traffic.** The branch improves important controls but does not satisfy the requested 8/10 bar, and capacity/recovery claims remain unmeasured.
