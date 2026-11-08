# Phase 3 — Assessment Integrity Remediation Plan

**Status:** P0 implemented and locally verified; P1/P2 remain pending.
**Basis:** Static audit of revision `d5cf12a1129ba322525d90ca5558c1fe7260e1b5`. See `PHASE3_ASSESSMENT_AUDIT.md` and `PHASE3_TEST_COVERAGE.md`.

## P0 implementation record (2026-11-08)

- Moved all assessment question banks and answer keys out of `src/data` into `backend/data/assessment_question_templates.json`; moved answer-bearing admin question-bank and coding-bank JSON artifacts into backend data as well. Updated the question-bank build/import scripts to use server-side paths. The frontend requests only backend-selected templates through the existing admin-only test-creation operation, and client-supplied question/answer templates are ignored.
- Removed official-attempt local question fallback. The candidate flow proceeds only after `/api/assessment/start` returns a non-empty question list and server-issued attempt ID; startup errors are shown and can be retried.
- Removed immediate client-scored completion and the client-side direct-score submission call. The result screen now waits for successful server submission acknowledgment; failed submissions remain retryable. Completed owned attempts replay the stored result after a lost response.
- Added `backend/tests/test_phase3_p0.py` for answer-bank source exclusion, server template selection, client question injection rejection, candidate payload sanitization, and stored-result retry behavior.
- Local verification: 6 P0 tests passed; 6 focused existing security tests passed; 15 hardening regression tests passed; 1 existing frontend test passed; TypeScript type-check passed; production build passed; Python compilation passed; checked answer-bank fingerprints were absent from generated JavaScript assets.
- A broader selected TestClient security test stalled in the existing request path; it was interrupted and excluded from the final pass. No local live PostgreSQL test or browser E2E was run. PostgreSQL concurrency/idempotency behavior remains to be verified in isolated CI.
- P0 is a scoped implementation milestone only. Phase 3 remains incomplete and the audit's NO-GO recommendation remains until the remaining P1/P2 work and required tests pass.

## Recommended implementation order

### P0 — Close answer and result integrity failures

1. **Remove answer-bearing assessment data from public assets (audit P3-01).** Create a server-only source of truth for assessment questions and answers; candidate question responses are an allowlisted DTO. Keep a clearly separated, non-graded practice experience if local availability is a product requirement.
2. **Make official start fail closed and result display durable (P3-02).** Do not start an official attempt from the local fallback or an unpersisted attempt ID. Require server-issued session ID. Await submission acknowledgment, display pending/error state, and provide a safe idempotent status/retry path. Stop using local score as an official grade.

**Exit gate:** Static production asset scan and browser test show no answer/explanation/hidden-test leakage; API and DB show no official attempt or completed score without server confirmation.

### P1 — Make attempt lifecycle atomic and recoverable

3. **Serialize concurrent start and enforce one active attempt (P3-08).** Implement candidate-scoped locking and database invariant after safe duplicate preflight; define safe/manual handling for existing duplicate active sessions.
4. **Coordinate autosave with final submit (P3-03).** Apply active-state condition in the write transaction, add snapshot sequence/version, persist acknowledgment metadata, serialize saves with submit and protect completed content from late writes. Preserve offline draft recovery without treating local storage as authoritative.
5. **Formalize server-side expiry (P3-04).** Persist authoritative deadline and support deterministic expiry/finalization/retrieval. Verify policy around end-time and grace; avoid status-only completion that leaves an unscored session.

**Exit gate:** PostgreSQL race tests cover concurrent starts, stale autosave, submit/save interleaving, duplicate submit, expiry boundary, retry after lost response, and immutable completed state.

### P1 — Provide a trusted coding evaluation boundary

6. **Implement server-owned assessment grader (P3-05).** Integrate controlled hidden test storage and a trusted executor tied to attempt/question IDs. Result records must be immutable/idempotent and persisted with submission state. Define supported versions and explicit timeout, memory, output, process-count and network/file-system isolation policy for Python, Java, C++ and JavaScript.
7. **Separate public practice examples from hidden evaluation cases.** Remove hidden cases from client data and response payloads; only return safe aggregate verdicts and optionally sanitized compiler diagnostics.
8. **Model provider outages as pending/retryable, never as score zero or acceptance.** Build contract tests per Judge0/Piston configuration and failure class. Do not award coding marks until grader evidence is authoritative.

**Exit gate:** Tests prove forged client values cannot affect marks, no hidden cases reach candidate assets/API, and provider failure cannot yield a completed/incorrect score.

### P2 — Reviewable subjective evaluation and tenant-specific proctor state

9. **Implement reviewer queue and audit trail for prose scenarios (P3-06).** Persist rubric version, auto-scoring provenance, review status, reviewer identity/time, adjustments and explanations. Consider AI only as advisory until validated on an approved dataset and governed with model/version/prompt provenance. Keep expected solutions internal.
10. **Bind multi-tenant heartbeat to persisted session and test (P3-07).** Derive candidate/test/session from session ownership, use validated server data for the heartbeat, enforce unique tenant key and atomic upsert. Add route/service/DB tests.
11. **WebSocket authorization hardening verification.** Keep admin-only JWT requirement; verify test-tenant access and token handling with actual async WebSocket client tests; bound polling and handle disconnect/database overload explicitly.

### P2 — Browser regression and capacity evidence

12. Add frontend component and browser E2E test infrastructure for the assessment lifecycle before claiming availability or correctness.
13. Run an isolated synthetic-data load test with documented worker/instance configuration. Measure app and PostgreSQL pool saturation, autosave latency, submission latency, error rate, and code grader capacity. Do not claim support for 120 simultaneous candidates until this run passes with agreed SLOs.

## Required regression suite and acceptance criteria

- Answer keys, explanations, evaluator expected solutions and hidden test cases are absent from candidate static assets and pre-submit HTTP responses.
- Only an authenticated candidate can operate their server-issued session; all admin/proctor endpoints remain administrator-only and tenant-scoped.
- Candidate starts racing across processes yield one active attempt; refresh resumes same ID and server-derived remaining time.
- Autosave succeeds while active, rejects completed sessions, preserves newest version, and recovers after network interruption; a stale save cannot overwrite final answers.
- Submission is idempotent, atomic, retryable after lost response and only shown completed after durable commit; duplicate/concurrent attempts generate one authoritative result.
- Server enforces expiration even when browser is closed or its clock is manipulated. Expired finalization policy produces consistent persisted records.
- Code execution is session-bound and isolated; only server-controlled hidden cases affect score; all four supported languages have validated runtime/resource policy; provider outage cannot silently score.
- Subjective review failures do not create final marks; manual items enter a reviewer queue with traceable decisions.
- WebSocket accepts only authorized admin and scopes stream to requested permitted tenant/test.
- Phase 3 backend, frontend, PostgreSQL integration and browser suites pass. Load evidence must state configuration and measured outcome; until then no 120-user claim.

## Risks and constraints

- Moving assessment question banks out of the frontend changes the local offline experience. Preserve an explicit ungraded practice flow if product requirements demand offline access; do not retain official grading in an answer-bearing bundle.
- Existing persisted active sessions need a reviewed migration/transition strategy. Do not delete, silently reset, or rewrite student attempts.
- New unique constraints require duplicate preflight and a manual remediation policy, not automatic record deletion.
- LLM subjective evaluation and remote code runners are external nondeterministic dependencies; isolate them from final state transitions and make failures visible/retryable.
- This audit did not run tests, conduct a penetration test, inspect production, or execute a 120-candidate load test.

## Approval boundary

The user approved implementation of P0. P1 and P2 work has not started and remains pending review/approval. No production database, production credentials, external provider, or student records were accessed. No live PostgreSQL integration or 120-candidate load test was performed.
