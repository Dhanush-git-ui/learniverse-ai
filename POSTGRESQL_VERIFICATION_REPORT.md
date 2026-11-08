# PostgreSQL Integration Verification — Phase 2.1

Date: 2026-11-08
Branch: `hardening/deployable-8-of-10`
Status: **BLOCKED — Phase 2.2 PostgreSQL CI has not executed for this branch**

## Scope and safety

No production database was accessed, no production credentials were used or displayed, and no production migration was run. Local test runs disabled dotenv loading, set `DATABASE_URL` to an empty value, and used synthetic API keys. PostgreSQL integration tests require explicit `TEST_POSTGRES_URL` and `RUN_POSTGRES_INTEGRATION=1`; they reject a URL equal to `DATABASE_URL`, require a database name containing `test`, and allow loopback hosts only (or the GitHub Actions `postgres` service alias when `GITHUB_ACTIONS=true`). Test records and schema names are generated synthetic values.

## PostgreSQL version and CI environment

- Deployment image: `postgres:15-alpine` in `docker-compose.prod.yml`.
- CI service: changed from PostgreSQL 16 to `postgres:15-alpine` to match deployment.
- Database: `learniverse_test`, synthetic `postgres` service credentials scoped to the ephemeral GitHub Actions container. No repository or production secret is referenced.
- Health gate: `pg_isready -U postgres -d learniverse_test`, 5-second interval/timeout, 12 retries.
- Integration variables: `TEST_POSTGRES_URL=postgresql://postgres:postgres@localhost:5432/learniverse_test`, `RUN_POSTGRES_INTEGRATION=1`, `DATABASE_URL=''`.
- Cleanup: per-test generated table/schema cleanup and removal of synthetic assessment session/submission rows; the isolated service container is discarded at the end of each job.
- CI has distinct backend unit/security, PostgreSQL integration, and full backend suite jobs. The full suite job also opts into PostgreSQL tests.
- CI runs on `hardening/**` pushes and supports manual dispatch. The integration and full-suite jobs write JUnit XML and call `backend/scripts/check_postgres_junit.py`, which fails if any required PostgreSQL case is absent, skipped, or failed.
- The workflow configuration parses as YAML, but the workflow has not run from this checkout; CI execution evidence is pending.

## Pool configuration

`backend/config.py` defaults to `DB_POOL_MIN_CONNS=1` and `DB_POOL_MAX_CONNS=10`. It caps the requested minimum at 5 and maximum at 20 per process. `backend/db_pool.py` supplies a single shared pool to application, assessment, CDC, analytics, and export integrations in each worker process.

```text
maximum application pool demand = min(requested max, 20) × workers × instances
default application pool demand = 10 × workers × instances
```

Worker count and instance count are not fixed in the repository, so a deployment-wide maximum cannot be derived here. Deployment guides that stated 20/100/150 pool sizes were corrected.

## Tests executed locally

| Check | Result |
|---|---|
| Python compilation: `python -m compileall -q backend` | Passed |
| CI workflow YAML parsing | Passed |
| Full backend suite: `python -m pytest backend/tests -q` with dotenv disabled, empty `DATABASE_URL`, and synthetic API keys | 122 passed, 8 skipped, 2 warnings, 13 subtests passed (10.85s) |
| PostgreSQL integration cases | 7 skipped: six in `test_db_reliability.py` and the PostgreSQL deployability smoke test; no local PostgreSQL listener/tooling is available |
| Optional Brotli test | 1 skipped because Brotli is not installed |

The final local run had **0 failures**. The four requested live PostgreSQL scenarios and the two migration scenarios were not executed, so their migration results remain **pending**, not passed or failed.

Four automated JUnit-guard regression tests passed in the backend suite: all required cases pass; a skipped case, missing case, or failed case is rejected. These check only the CI guard, not PostgreSQL behavior.

The full-suite stall was diagnosed: collection completes (126 tests), while the restricted Windows sandbox blocks the local socketpair used by Starlette `TestClient`/asyncio Proactor during startup. The full suite completed when run outside that local socket restriction. One initial full-suite failure (`test_health`) was due to a missing synthetic `OPENROUTER_API_KEY` in the test setup; the test now provides it, and the final run passed.

## Required PostgreSQL checks — pending

The following tests exist and are wired into the CI service but have not yet executed against a live PostgreSQL 15 instance:

1. Commit, rollback, and duplicate-key behavior.
2. Concurrent writes and one atomic conditional state transition.
3. Concurrent assessment route submissions (one commit, one conflict).
4. Connection termination and pool recovery.
5. Migration 005 on clean synthetic data, including idempotency, uniqueness enforcement, and rollback row preservation.
6. Migration 005 with duplicate synthetic rows; expected to fail without deleting rows or leaving the unique index behind.
7. Existing PostgreSQL deployability commit/rollback smoke test.

The previous CI configuration already had a PostgreSQL service, but it used PostgreSQL 16 and did not set `RUN_POSTGRES_INTEGRATION=1`. Its latest run predates the Phase 2 PostgreSQL test module, so it did not execute the current reliability cases. If the gated tests were present under that configuration, the missing opt-in would have caused them to skip. The revised configuration matches the deployed PostgreSQL 15 image and opts in explicitly.

## Key files reviewed or changed

- Reviewed: `backend/db_pool.py`, `backend/config.py`, FastAPI app and assessment DB/session code, CDC integration, analytics DB helpers, export helpers, `backend/placement_assessment_system/db_setup.sql`, migrations 005 and the migration runner, reliability/security tests, deployment docs, and `.github/workflows/ci.yml`.
- Changed for verification: `.github/workflows/ci.yml`, `backend/tests/test_db_reliability.py`, `backend/tests/test_security_audit.py`, `backend/migrations/005_unique_assessment_submission.sql`, `backend/migrations/005_rollback_unique_assessment_submission.sql`, `backend/.env.example`, pool sizing references in deployment docs, and the reliability/progress reports.
- Confirmed defects corrected: CI had no integration opt-in and used a different PostgreSQL major version than deployment; the migration DO block lacked the required PL/pgSQL statement terminator; the new migration tests had been inserted inside the assessment test body, leaving its actual concurrency assertions unreachable. The tests and SQL syntax are now corrected, but still require live execution.

Migration 005 checks duplicates before creating the partial unique index and raises an error if duplicate non-null `session_id` values exist. It does not repair or delete duplicates. The test suite prepares a disposable schema for both migration branches. The rollback script drops only the index and preserves rows; the migration ledger remains, so reapplication through the runner requires an operator to review state and deliberately remove the matching `_migrations` entry.

## Outcome and remaining limitation

CI infrastructure and reproducible live integration cases are prepared. However, the PostgreSQL tests were skipped locally and the updated GitHub workflow has not yet produced a run. Therefore transaction semantics, concurrent submission behavior, connection recovery, migration outcomes, and Postgres 15 compatibility are **unverified**. Phase 2.1 must remain blocked until the PostgreSQL integration job passes against the isolated service and its actual output is reviewed.
