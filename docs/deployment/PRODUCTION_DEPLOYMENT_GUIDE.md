# Production deployment guide

This guide describes the checked-in configuration; it is not evidence of a live deployment.

## Services

- Frontend: Vercel, built from repository root with `npm ci` and `npm run build`. `vercel.json` rewrites `/api/:path*` to `https://learniverse-ai-zpph.onrender.com/api/:path*` and all other paths to `/index.html`.
- Backend: Render, run the ASGI app `app:app` from `backend` with Uvicorn. Set `ENV=production`, provision PostgreSQL, set all required variables in `ENVIRONMENT_VARIABLES.md`, and configure the exact frontend origin.
- Database: Neon/PostgreSQL. The assessment service refuses SQLite fallback outside development. Apply reviewed migrations before directing student traffic; migration runner was not exercised in this audit.
- Compiler: Judge0 is the preferred isolated execution service. Configure its URL/token and verify worker health and resource limits. Piston is disabled unless explicitly opted in. Local execution must remain disabled.

## Release sequence

1. Rotate any previously exposed credentials, generate a new `API_SECRET_KEY`, configure Google client ID/admin identities, and provision the roster as a private Render secret file/read-only mount. Set `STUDENT_ROSTER_PATH` to that mounted path; never commit or bundle the roster.
2. Create a staging Neon database and run reviewed migrations with a verified backup. Do not run destructive migrations against production without approval and tested recovery.
3. Configure Render variables and deploy backend to staging. Check `/health` and `/readiness`; verify PostgreSQL connectivity and auth/RAG/compiler provider configuration without exposing environment output.
4. Configure Vercel’s production origin and confirm API rewrite and SPA deep links against staging.
5. Run frontend checks, the complete backend suite against isolated test services, compiler tests, RAG dataset evaluation, auth/ownership tests, and a staged load test up to the approved pilot size.
6. Confirm logs omit student answers/credentials, database backups restore successfully, and rollback steps are available. Only then schedule a controlled pilot.

## Current validation and gaps

The frontend type check, one frontend unit test and production build pass. Compose validation was not possible because Docker is unavailable. Render, Neon, Vercel, OAuth, Judge0, CORS, migrations, shutdown behavior, monitoring/alerts, backups and recovery were not validated against live/staging services. There is no verified 120-student capacity claim.

**Current recommendation: NO-GO for student production traffic.**
