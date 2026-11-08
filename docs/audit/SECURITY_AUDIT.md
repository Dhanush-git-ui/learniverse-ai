# Security audit

**Reviewed:** 2026-11-08 | **Scope:** current source tree and mounted FastAPI routers. This review did not rewrite Git history or access production services.

## Confirmed fixes in this branch

- Removed fixed JWT signing and API-key acceptance fallbacks. Token issuance and protected requests fail closed if `API_SECRET_KEY` is not provisioned.
- Removed built-in admin usernames and bcrypt hashes. Admin usernames and bcrypt hash must be configured explicitly.
- Removed the built-in Judge0 credential. An absent Judge0 credential stops Judge0 calls; Piston is now an explicit `PISTON_FALLBACK_ENABLED` opt-in.
- Removed browser API-key injection from shared request headers. Browser requests use server-signed Bearer JWTs.
- Student sign-in now requires an exact roster email match; a syntactically valid `@hitam.org` address no longer creates a roster identity.
- Removed analytics `X-Roll-Number` authentication fallback. Portfolio/dashboard endpoints enforce JWT ownership (admin may access across users); portfolio HTML fields are escaped.
- Connected active chat flow to Chroma retrieval, score validation, deduplication, a 12,000-character context cap, source metadata, and explicit no-evidence prompts. OpenRouter generation and Gemini embeddings use separate configuration names.
- Scenario responses no longer earn marks by word count. Legacy prose-only rubric entries earn no auto-marks and are marked `needs_manual_review`; machine scoring requires explicit rubric `signals`.
- Untracked four likely student/candidate response files from this branch’s index while preserving their local copies; added ignore patterns.

## Authorization matrix

| Endpoint group | Authentication | Required role | Ownership check | Status |
|---|---|---|---|---|
| `/`, `/health`, `/readiness`, `/api/topics`, `/api/topic/all-content` | Public | None | N/A | Public by design; health/readiness disclose only service state |
| `/api/auth/*` login endpoints | Google token or configured admin credentials | Student/admin based on verified identity | Exact roster email for students; configured allowlist for admins | Hardened; no token revocation/refresh workflow |
| `/api/assessment/start`, `resume`, `autosave`, `submit`, `reset`, `heartbeat`, `log-violation`, `feedback`, student lookup/analytics | Shared API/JWT guard plus Bearer JWT | Student or admin | Candidate/session ownership; admin exception | Enforced in handler paths; concurrency and replay behavior needs broader integration tests |
| `/api/assessment/admin/*`, `/fixly/*` result/admin routes | API/JWT guard plus `require_admin` | Admin | Admin scope | Explicit JWT role guard |
| `/api/admin/question-bank/*` | Router-level `require_admin` | Admin | Admin scope | Explicit JWT role guard |
| `/api/cdc/*` | Router-level `require_admin` | Admin | Admin scope | Explicit JWT role guard |
| `/api/analytics/*` | Bearer JWT | Student for user events, admin for admin routes | Identity derived from JWT; roll-number header rejected | Header bypass removed; needs API integration regression coverage |
| `/api/student/dashboard/{roll}`, `/api/portfolio/{roll}`, `/u/{roll}`, `/badge/{roll}.svg` | Bearer JWT | Owner or admin | Normalized JWT subject to requested roll | Protected; public share capability is suspended pending per-student consent design |
| `/api/chat`, `/api/debate`, `/api/evaluate`, `/api/code/*`, topic AI endpoints | Shared API/JWT guard | Any signed-in user (or server API key) | No per-student resource except saved code state | Client secret removed; per-route privacy/rate-limit review remains |

## Secret and private-data handling

- `.env`, `.env.local`, `.env.production`, and `backend/.env` are ignored and are not tracked at the current Git tip; `backend/.env.example` contains placeholders.
- Four tracked response files were removed from the current index, but historical commits may still contain them. A history scan/cleanup was not performed because rewriting shared history needs coordination. Restrict access to old clones/artifacts and arrange history purge before public distribution.
- Existing local environment files may contain previously exposed credentials. Rotate API, provider, database, Google OAuth and Judge0 credentials if they were ever committed, pasted, or shipped in a frontend build. This audit intentionally does not print or inspect secret values.
- Other tracked Excel workbooks may contain assessment question banks or source responses; they were not removed without content classification. Review them before public distribution.

## Remaining security risks

- LocalStorage stores bearer tokens, so an XSS flaw could steal a valid token. An HttpOnly secure-cookie migration needs CSRF design and a coordinated frontend/backend auth change.
- The assessment router accepts a server API key at router level as well as JWT; service-key access must remain server-only. Some content/code routes do not impose student/admin role distinctions.
- Several logging paths log exception text and request metadata. Review for PII and provider response leakage before production.
- Public portfolio sharing has no consent/token model; routes are owner/admin-only in this branch, which changes public share behavior.
- Git history, existing deployment artifacts, dependency vulnerability status, production CORS and live secret rotation have not been verified.

**Deployment recommendation:** NO-GO until live secrets are rotated/provisioned, historical response data is purged or access-controlled, and the remaining checks above are completed.
