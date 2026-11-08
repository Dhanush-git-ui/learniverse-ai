# Engineering Baseline — Learniverse AI

Inspection date: 2026-11-08
Repository: `C:/Users/dhanu/OneDrive/Desktop/learn/learniverse-ai`
Branch / HEAD: `hardening/deployable-8-of-10` / `7201bde audit`

## Scope and workspace state

Phase 0 inspected the current repository, applicable `docs/audit/AGENTS.md` instructions, setup docs, mounted API composition, authentication, assessment authorization, analytics, deployment and CI configuration, tests, and all seven prior audit reports. The working tree contains one pre-existing untracked file, `.agents/New Text Document.txt`; it was left untouched. No environment values or credential files were read. No `.env` file is tracked; `.env.example` and `backend/.env.example` are tracked.

## Actual architecture

- **Frontend:** React 18, TypeScript, Vite, Tailwind, React Router, TanStack Query, Monaco. Root `package.json` supplies `lint`, `type-check`, `test`, and `build` scripts.
- **Backend:** Python/FastAPI composed in `backend/app.py`. Mounted routers: placement assessment, admin question bank, CDC integration, authentication, and analytics. Other top-level handlers include chat, coding, student dashboard/portfolio, health, and a test-monitor WebSocket.
- **Identity/security:** `backend/auth.py` issues and validates HS256 JWTs with required expiry, issue time, issuer, audience, JTI, subject, and constrained roles. `auth_api.py` verifies Google ID tokens against configured client IDs, requires verified email, admits students only by exact roster email, and requires configured admin identifiers and bcrypt hash for password login. Assessment and CDC routers use JWT identity/admin dependencies; portfolio/dashboard enforce owner checks; analytics derives identity from the signed JWT.
- **Data:** PostgreSQL via psycopg2 pools and migration SQL; assessment module also retains local/dev SQLite and file backup paths. Analytics has service-layer SQL. Production database connectivity, migration application, backup restoration, and isolation are not established by this local inspection.
- **AI/RAG:** `backend/rag/` provides retrieval, prompt/generation, and RAG pipeline. Gemini is used for embeddings; OpenRouter and Gemini settings are distinct. No live provider or representative corpus evaluation was run.
- **Code execution:** Judge0 integration with opt-in Piston fallback and development-only local execution controls. Remote provider isolation, quotas, and live reliability were not verified.
- **Delivery:** GitHub Actions runs backend tests with PostgreSQL, frontend checks/build, and Docker Compose validation. Workflow execution and production deployment were not verified.

## Prior audit findings compared with current code

| Finding area | Current classification | Evidence / limits |
|---|---|---|
| Admin default credentials and arbitrary admin elevation | **ALREADY FIXED** | Admin identifiers and bcrypt hash are configuration-only; login endpoints are rate limited. |
| Unsigned/unverified Google claims and arbitrary student identity | **ALREADY FIXED** | Google verifier uses configured client ID; email verification and exact roster lookup are required. Live OAuth and roster completeness are **NOT VERIFIED**. |
| JWT signature, expiry, issuer, audience, subject, role | **ALREADY FIXED** | Shared decoder enforces required claims. Individual token revocation is absent, as previously reported. |
| Assessment ownership and admin routes | **PARTIALLY FIXED** | Current assessment routes have explicit candidate/session/admin checks. The coding hint and catalog are intentionally public within an API-key-authenticated router; endpoint matrix remains to be completed. |
| Student dashboard and portfolio IDOR / HTML injection | **ALREADY FIXED** | Owner enforcement and HTML escaping are present. |
| Analytics client-controlled roll identity | **ALREADY FIXED** | JWT-derived identity; admin endpoints check admin role. SQL queries inspected are parameterized. |
| Unauthenticated assessment monitor WebSocket | **CONFIRMED** | `/ws/test-monitor/{test_id}` accepts the socket without authenticating or checking admin role, then streams live test-monitor data. Phase 1 priority fix. |
| Secret fallback credentials / frontend server key | **ALREADY FIXED** | API/JWT and provider credentials have no insecure application defaults; frontend auth helper does not send server API secret. No tracked `.env` files. Historical Git contents and deployed environment are **NOT VERIFIED**. |
| Google verifier / database exception messages in logs | **PARTIALLY FIXED** | Google verifier logs provider exception text and may return it in development; several backend paths print/log exception strings. Assess for token, SQL, and personal-data leakage during Phase 1. |
| CORS and login throttling | **PARTIALLY FIXED** | CORS has explicit configured origins and auth endpoints use SlowAPI limits. Shared storage behavior across multiple workers and production proxy configuration are **NOT VERIFIED**. |
| Performance / capacity | **NOT VERIFIED** | Prior performance report has no reproducible production-like load evidence; no load test run in Phase 0. |
| RAG quality / factuality | **NOT VERIFIED** | Unit-level retrieval tests exist; no live provider, corpus benchmark, or quality set was evaluated. |
| Assessment integrity | **PARTIALLY FIXED** | Scenario prose is not scored by length and coding score waits for grading; external execution sandbox and human review operations require independent validation. |
| Deployment readiness / overall score | **BLOCKED** | Prior `FINAL_ENGINEERING_AUDIT.md` records 4.5/10 and NO-GO. Production database, OAuth, providers, secrets, backup/recovery, and capacity cannot be confirmed from this checkout. |

### Prior reports read

`docs/audit/INITIAL_AUDIT_REPORT.md`, `PERFORMANCE_AUDIT.md`, `RAG_EVALUATION.md`, `SECURITY_AUDIT.md`, `ASSESSMENT_INTEGRITY.md`, `AUTH_ASSESSMENT_REVIEW.md`, and `FINAL_ENGINEERING_AUDIT.md`. The original reports contain historical states and some conflicting checkpoints; current-source evidence above takes precedence. Prior reports also note missing live OAuth/database/provider/load and full-suite evidence, individual JWT revocation gaps, and deployment prerequisites.

## Test baseline

Executed during Phase 0:

```text
python -m pytest backend/tests/test_hardening_regressions.py -q
13 passed in 2.00s
```

The focused suite is local and mostly mocked/unit-level. It does not establish production integration readiness. The previous final audit records frontend checks and a full-suite stall in its environment; those historical results are not treated as fresh runs. Live Google OAuth, production PostgreSQL/migrations, compiler providers, distributed throttling, browser E2E, backups, and production-like load are not verified.

## Implementation order

1. **Phase 1 security:** authenticate and authorize the live monitor WebSocket; inspect every mounted route for authorization gaps, validate token/error handling and sensitive logs, verify API boundaries and configuration defaults, and add targeted regression coverage. Produce `SECURITY_REMEDIATION_REPORT.md` with residual operational steps. Do not rotate credentials or rewrite history.
2. **Later phases, not in this pass:** backend/database reliability; frontend correctness; RAG quality; assessment integrity; performance; deployment validation; production readiness score. No Phase 2–10 changes are included in this baseline.
