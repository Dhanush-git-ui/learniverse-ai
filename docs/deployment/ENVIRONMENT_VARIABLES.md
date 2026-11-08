# Environment variables

Copy `backend/.env.example` for local development. Production values belong in Render/Vercel secret settings, not source files. Never prefix backend-only secrets with `VITE_`.

| Variable | Required | Purpose |
|---|---|---|
| `ENV` | Yes | Use `production` in Render; controls development-only behavior. |
| `API_SECRET_KEY` | Yes | Strong random backend API/JWT signing key; rotate any old key and expect existing tokens to expire/become invalid after rotation. |
| `DATABASE_URL` | Yes in production | PostgreSQL connection string (Neon or provisioned PostgreSQL). |
| `DB_POOL_MIN_CONNS`, `DB_POOL_MAX_CONNS` | Optional | Pool sizing; account for every worker and both backend pools against provider limits. |
| `GOOGLE_CLIENT_ID` | Yes for Google sign-in | OAuth client ID accepted by backend token verification. |
| `VITE_GOOGLE_CLIENT_ID` | Yes for Google sign-in UI | Public Google Identity Services client ID; it is not a secret and must match backend configuration. |
| `ADMIN_EMAILS` | Yes for Google admins | Comma-separated exact admin identities. |
| `ADMIN_USERNAMES`, `ADMIN_PASSWORD_HASH` | Optional for password admins | Explicit username allowlist and bcrypt hash(es), comma-separated. No default admin account exists. |
| `STUDENT_ROSTER_PATH` | Yes for student access | Path to the privately provisioned roster JSON file. Keep it out of Git and frontend assets; missing/unreadable roster intentionally rejects student login. |
| `GEMINI_API_KEY` | Yes for RAG retrieval | Google Gemini embedding API credential. |
| `OPENROUTER_API_KEY` | Yes for AI generation | OpenRouter credential; separate from Gemini. |
| `OPENROUTER_MODEL_NAME` | Optional | OpenRouter model identifier. |
| `JUDGE0_URL`, `JUDGE0_API_KEY` | Yes for code execution | Authenticated Judge0 endpoint and token. Self-hosted Judge0 should use its `X-Auth-Token`; RapidAPI mode uses its provider headers. |
| `PISTON_FALLBACK_ENABLED` | Optional, default false | Explicitly opt into Piston if its remote isolation and data handling are approved. |
| `ALLOW_LOCAL_EXECUTION` | No in production | Must remain `false`; do not execute student code in the API process. |
| `CODE_EXECUTION_SEMAPHORE_LIMIT` | Optional | Per-process execution concurrency cap. |
| `FRONTEND_URL` | Yes | Production frontend origin for CORS. |
| `REDIS_URL` | If required by chosen deployment | Redis service URL; usage/availability needs runtime validation. |
| `CDC_HITAM_URL`, `CDC_TRACKS_BACKEND_URL`, `CDC_HITAM_WEBHOOK_URL`, `CDC_API_SECRET_KEY` | If integration enabled | CDC service endpoints and webhook credential. |

The bundled template contains names and safe placeholders only. Verify the effective names against the selected service’s settings before deployment.
