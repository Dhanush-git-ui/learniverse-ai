# Backend Reliability Report — Phase 2

Date: 2026-11-08
Branch: `hardening/deployable-8-of-10`
Scope: FastAPI runtime, PostgreSQL pooling and transactions, assessment submission safety, Redis/memory cache behavior. No production credentials were read, no production database was accessed, and no migrations were executed.

## Files inspected

- `backend/app.py`, `backend/config.py`, `backend/auth.py`
- `backend/analytics_api.py`, `backend/analytics_service.py`, `backend/db_schema_integration.py`
- `backend/placement_assessment_system/api.py`, `db_setup.sql`, migrations, and assessment tests
- `backend/cdc_integration.py`, `backend/export_results.py`
- `backend/utils/cache_manager.py`, cache consumers, requirements, CI workflow, and deployment configuration
- Phase 0/1 reports and historical audit reports listed in the Phase 2 request

## Confirmed defects and changes

| Finding | Change |
|---|---|
| App and assessment code each created a PostgreSQL pool, both defaulting to 50 connections; CDC and result export opened extra direct connections outside those pools. | Added `backend/db_pool.py` and routed app, assessment, CDC, analytics helpers, and export through one bounded, thread-safe pool per worker. Default is 1–10 connections; requested pool sizes are capped at 5 minimum and 20 maximum per worker. |
| Assessment pool exhaustion was treated like a broken pool: it could close every connection, rebuild the pool, then fall back to SQLite in development. | Pool exhaustion now returns HTTP 503 without closing the shared pool or silently falling back. SQLite remains available only in development when no usable PostgreSQL pool is available. Production startup requires `DATABASE_URL` and fails if pool initialization fails. |
| Assessment connections could be returned without rollback on cancellation, and cursor creation failure could leave a checked-out connection. | Cursor setup is inside the protected lifecycle; all exceptional exits roll back and return/discard the connection. Both cursor adapters expose explicit `commit()`. |
| Assessment submission wrote its JSON backup and queued external work before dependency teardown committed PostgreSQL. | Session status, section and response rows, and the authoritative submission row are explicitly committed together before backup or CDC side effects begin. The normal dependency commit remains harmlessly idempotent. |
| Direct admin submission logged DB insert failures and still returned success and wrote a backup. | Persistence failure now returns 503; backup and sync work start only after a successful commit. |
| Duplicate assessment result rows were not constrained at the database layer for direct submissions. | Added a partial unique index on non-null `fixly_test_submissions.session_id` in the schema and additive migration `005_unique_assessment_submission.sql`. The migration includes a duplicate preflight and does not delete data. Existing data must be reviewed before an operator applies it. |
| Analytics endpoints declared `async` while doing synchronous psycopg2 work; raw code execution also blocked inside `async def`. | Converted database-only analytics handlers and raw execution handler to synchronous FastAPI routes so FastAPI runs them in its worker thread pool. |
| Redis cache used `FLUSHDB`, could leak connection error details, had no runtime memory fallback, and memory fallback had no size bound. | Cache keys now use a `learniverse:topic:` namespace; clear deletes only that namespace. Redis has connection/read timeouts and a bounded worker-local memory fallback with TTL and 2,048-entry LRU eviction. The Redis client is retained after an initial outage and retried on later requests. Failures log exception type only. |

Runtime assessment submission already takes a row lock in PostgreSQL and conditionally updates `status='started'`; the route returns 409 when another submission changed the state. The added integration test exercises that actual route concurrently.

## Connection capacity calculation

The application now creates one pool per worker process, shared by app routes, analytics helpers, assessment, CDC, and result export. Effective demand is bounded by:

```text
max PostgreSQL connections = min(configured DB_POOL_MAX_CONNS or 10, 20)
                           × application worker processes
                           × application instances
```

The clean-config default is 10 per worker (minimum 1). This checkout's effective loaded settings were capped to minimum 5 / maximum 20; only these numeric pool limits were inspected. The configured worker/instance count and database service connection budget are not defined in this repository, so the deployment-wide total cannot be calculated from this checkout. Operators must reserve capacity for migrations, monitoring, and other services. Legacy oversized pool settings are capped and a warning is logged.

## Phase 2.1 verification update (2026-11-08)

`backend/tests/test_db_reliability.py` now contains four PostgreSQL tests for commit/rollback/duplicate keys, concurrent writes and a single atomic state transition, concurrent assessment route submission, and connection termination/recovery. It also tests Migration 005 on temporary schemas with synthetic records, both with and without existing duplicates. All live tests require both `TEST_POSTGRES_URL` and `RUN_POSTGRES_INTEGRATION=1`, reject a URL equal to `DATABASE_URL`, and limit hosts to loopback; the `postgres` service alias is accepted only in GitHub Actions. Migration tests drop their uniquely named temporary schemas. Assessment-route tests delete only their synthetic session and result rows. The CI service database is ephemeral and isolated per job.

CI was changed to use PostgreSQL 15 Alpine, matching `docker-compose.prod.yml` (the former CI service used PostgreSQL 16). It has separate backend unit/security, PostgreSQL integration, and full-suite jobs with synthetic credentials, `DATABASE_URL` blank, a PostgreSQL health check, and opt-in test variables only in the two PostgreSQL jobs. A JUnit gate now fails if any of the seven required PostgreSQL tests are missing, skipped, or failed. This workflow has not run from this checkout, so it is configuration rather than execution evidence.

The source pool defaults are minimum 1 and maximum 10 per process. Configuration caps the requested minimum at 5 and maximum at 20. One shared pool is used by application, assessment, CDC, analytics, and result-export code in each process. Peak application-pool demand is `min(requested max, 20) × worker processes × instances`; at defaults it is `10 × workers × instances`. Deployment worker and instance counts are not specified here, so there is no single deployment-wide total. Older deployment examples that recommended 20/100/150 connections were corrected to reflect the implementation and its caps.

## Test evidence

No PostgreSQL server, local listener on 127.0.0.1:5432, or local PostgreSQL/Docker tooling is available. We did not connect to any remote database and did not inspect database credentials. The actual four PostgreSQL integration tests and two migration tests remain **BLOCKED pending execution in the configured CI service**; their local skips are not passes.

Executed:

```text
python -m pytest backend/tests/test_db_reliability.py backend/tests/test_hardening_regressions.py -q
20 passed, 4 skipped in 2.85s

python -m compileall -q backend
passed
```

The four skips are PostgreSQL-only tests for commit/rollback/duplicate key behavior, concurrent writes and atomic state transition, a real concurrent assessment route submission, and recovery after terminating a checked-out test connection. No live PostgreSQL result is claimed.

Full-suite diagnostics showed collection succeeds (130 tests collected in the final checkout). The no-output stall in the restricted Windows sandbox was due to Starlette `TestClient` initializing an asyncio Proactor self-pipe: `socket._fallback_socketpair()` blocked on local `accept()`. Running outside that socket restriction completed the suite. A prior run initially had one test failure because health-test configuration lacked a synthetic OpenRouter key; the test was corrected to provide one. A final full run with dotenv loading disabled, `DATABASE_URL` empty, and synthetic API keys completed:

```text
python -m pytest backend/tests -q
122 passed, 8 skipped, 2 warnings, 13 subtests passed in 10.85s
```

No test failed in this final run.

The 8 skips include all seven live PostgreSQL-gated tests (the six reliability/migration tests plus the PostgreSQL deployability smoke test) and the optional Brotli test. Warnings are a deprecated Gemini SDK notice and a Pydantic `.dict()` deprecation. This suite verifies unit/security regressions but does not establish live PostgreSQL behavior.

`python -m compileall -q backend` passed. `.github/workflows/ci.yml` parsed successfully as YAML. The workflow itself has not yet been run by GitHub.

## Remaining risks / unverified behavior

- Run the isolated PostgreSQL CI jobs and review their logs before marking Phase 2.1 complete. No integration result is asserted yet.
- Migration 005 has a duplicate preflight and a manual index-only rollback; neither forward nor rollback SQL has been run against PostgreSQL in this checkout. The integration tests are prepared to verify clean-data idempotency, duplicate refusal without deletion, uniqueness enforcement, and rollback row preservation.
- Deployment-wide connection demand depends on actual process/instance scaling and the database plan. Configure `DB_POOL_MAX_CONNS` and worker counts against that budget; the per-process cap cannot enforce a cross-instance global limit.
- Live PostgreSQL transaction, concurrency, connection-interruption, assessment-route and migration behavior remains blocked pending isolated PostgreSQL infrastructure.
- CDC keeps local SQLite/file reads only in development; those are intentionally not part of production state.
- Auth state and assessment state are not cached. The topic cache contains shared public topic material only; its memory fallback is per worker and bounded. Cross-worker cache coherence is not required for this data.
- Some non-critical analytics helpers still intentionally swallow write failures. The complete backend suite and production provider/database behavior need CI verification before declaring the backend production-ready.

## Phase 2.2 CI execution status (2026-11-08)

The current local commit is `7201bdec77ecdc93888e919176f6767eaa272148`; the requested hardening branch is not present on GitHub and has no upstream. GitHub CLI is not installed. The latest available workflow run is run 43 (`41217219116`) on `main` at `c90e2e310c3aed31ac45f273241d4d0e17f21d9e`; its backend step passed, but its workflow used PostgreSQL 16, omitted `RUN_POSTGRES_INTEGRATION=1`, and predates the Phase 2 integration tests. It does not verify PostgreSQL transaction or concurrency behavior.

CI now triggers for `hardening/**` pushes and manual dispatch, and a JUnit gate rejects skipped/missing required PostgreSQL cases. GitHub Actions API reports zero runs for `hardening/deployable-8-of-10`; the branch lookup returned 404. This workflow change and the test guard remain uncommitted. No commit or push was made. The actual PostgreSQL CI execution is **BLOCKED** until the intended branch changes are committed and pushed; see `POSTGRESQL_CI_EXECUTION_REPORT.md`.
