# Regression test report

**Run date:** 2026-11-08 | **Branch:** `hardening/deployable-8-of-10`

## Executed

- `python -m pytest backend/tests/test_hardening_regressions.py -q`: **13 passed**.
- `python -m compileall -q backend`: passed after correcting escaped docstring delimiters in `backend/db_schema_integration.py`.
- `npm run type-check`: passed.
- `npm test -- --reporter=dot`: **1 test file, 1 test passed**.
- `npm run build`: passed; Vite reports several chunks above 500 kB.
- `npm run lint`: passed with **122 warnings** and no errors.
- Compose file YAML syntax parsed with PyYAML; Docker Compose semantic validation remains unavailable because Docker is not installed.

## Not completed

- `test_security_audit.py` stalled at `test_admin_login_fails_closed_without_configured_credentials` in this Windows/Python 3.13 environment; the full backend suite is not marked passing.
- `docker compose -f docker-compose.prod.yml config --quiet` could not run because Docker is not installed in the environment.
- No PostgreSQL integration service, browser E2E suite, provider integration, production smoke check, migration test, or 120-user load test was run.
- CI workflow targets `main`/`master`, not this hardening branch; branch protection and CI execution were not checked.

See `backend/tests/test_hardening_regressions.py` for security, scenario scoring and retrieval selection tests. Do not interpret tests written but not executed as verification.
