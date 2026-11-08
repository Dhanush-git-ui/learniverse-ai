# Security Remediation Report — Phase 1

Date: 2026-11-08
Branch: `hardening/deployable-8-of-10`
Scope: Authentication, authorization, sensitive-data exposure, API boundaries, and secrets. No credentials were rotated, and Git history or user data was not altered.

## Findings and remediation

| Area | Result | Evidence |
|---|---|---|
| Assessment monitor WebSocket | **FIXED — critical exposure** | `/ws/test-monitor/{test_id}` previously accepted every connection and streamed active candidate monitor data. It now validates a signed application JWT and requires role `admin` before accepting. Browser auth sends the short-lived JWT in an offered WebSocket subprotocol; the server only selects the noncredential `learniverse.admin` protocol and does not log or echo the JWT. |
| Google OAuth error handling | **FIXED — information disclosure** | The verifier previously included provider exception text in logs and development responses. Failures now return a generic 401 and log no exception detail. ID token verification remains against configured client IDs, with verified email and exact roster/admin allowlist checks. |
| Admin password handling | **FIXED — credential correctness** | Admin passwords are no longer trimmed before bcrypt verification, preserving exact configured password bytes including intentional leading/trailing spaces. |
| JWT / admin / roster controls | **ALREADY PRESENT; regression checked** | Shared decoder checks signature and required temporal, issuer, audience, JTI, subject, and role claims. Admin accounts require configured identifiers and bcrypt hash. Student Google identities require exact roster email match. |
| Assessment and candidate authorization | **ALREADY PRESENT; source reviewed** | Admin assessment routes use `require_admin`; candidate operations check authenticated identity and session ownership. CDC router is admin-gated. Student-facing dashboard/portfolio routes enforce owner checks. |
| Analytics identity and SQL | **ALREADY PRESENT; source reviewed** | Analytics derives identity from signed JWT claims, admin views enforce role, and inspected SQL uses parameterized values. |
| Cross-origin policy / throttling | **PARTIALLY VERIFIED** | Explicit origin configuration and SlowAPI limits exist on authentication and selected APIs. Production shared rate-limit storage, trusted-proxy settings, and distributed behavior were not exercised. |
| Secrets and historical exposure | **PARTIALLY VERIFIED** | Application config has no insecure signing-key fallback; `.env` files are ignored and examples are tracked. Git history, deployed settings, hosted logs, and external provider credentials were not inspected or rotated. |

## Verification

- `python -m pytest backend/tests/test_hardening_regressions.py -q` — **14 passed**.
- `python -m compileall -q backend` — **passed**.
- `npm run type-check` — **passed**.
- `npm test -- --reporter=dot` — **1 test passed**.
- `npm run build` — **passed**; Vite completed in 17.90s. It reports large chunks, including the PlacementAssessment bundle, above 500 kB.
- `npm run lint` — **passed with 122 existing warnings and 0 errors**.
- `git -c core.whitespace=cr-at-eol diff --check` — **passed**. The frontend file retains its existing CRLF line endings.
- `git diff --check` reports CRLF-related trailing whitespace on changed lines in `src/pages/PlacementAssessment.tsx`; the file uses CRLF line endings, and these are not literal spaces in the source. The existing untracked `.agents/New Text Document.txt` remains untouched.

Unit tests use local test keys and do not verify hosted OAuth, live database, browser WebSocket through a production proxy, or deployed logging configuration. A targeted selection from `test_security_audit.py` produced no output for about 15 seconds and was interrupted; those legacy cases remain unverified in this run.

## Operational actions still required

1. Confirm `API_SECRET_KEY`, `GOOGLE_CLIENT_ID`, `ADMIN_EMAILS`, `ADMIN_PASSWORD_HASH`, and `STUDENT_ROSTER_PATH` are provisioned in the deployment secret manager. Never place production values in frontend build variables.
2. If any production secrets were ever committed or exposed, revoke and rotate them through the respective providers. After rotation, deploy the new values and require users to sign in again. No rotation was performed here.
3. Review repository history and hosting logs with an authorized secret-scanning process. If real credentials are found in history, coordinate rotation first, then perform approved history cleanup and notify collaborators to re-clone; no history rewrite was performed.
4. Confirm the production reverse proxy allows WebSocket subprotocol negotiation and does not log `Sec-WebSocket-Protocol` request values. The JWT is not in the URL, but remains a bearer credential in the handshake and should have short expiry.
5. Use a shared production rate-limit backend and explicitly configure trusted proxy addresses before relying on IP-based limits across multiple workers.

## Remaining risk / out of scope

- JWTs remain in browser local storage, so successful same-origin script injection could steal them. Moving to secure, HttpOnly, SameSite cookies requires a broader CSRF and frontend auth migration.
- There is no individual JWT revocation store; access remains valid until expiry or signing-key rotation.
- Production OAuth, roster correctness, WebSocket proxy behavior, PostgreSQL authorization data, secret manager values, and rate-limit distribution remain unverified.
- This completes Phase 1 only. The performance, RAG evaluation, full assessment grading workflow, backup/recovery, and production readiness claims remain outside this phase.
