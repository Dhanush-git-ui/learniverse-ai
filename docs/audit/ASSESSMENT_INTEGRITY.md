# Assessment integrity

**Reviewed:** 2026-11-08.

## Current server-side controls

- Assessment session endpoints require JWT identity and compare the token subject with the candidate roll. Session reads/writes include ownership checks; admin routes use `require_admin`.
- `/submit` loads the saved server-side question set and calculates marks from saved answers; browser score fields are not used as score inputs.
- Coding submissions are retained for review but `_score_coding_submission` returns zero marks until a trusted server-side grader is integrated. Browser test counts/verdicts are not trusted.
- Scenario scoring no longer rewards answer length. Only explicit `rubrics[].signals` are machine-scored. Existing prose-only rubrics are flagged `needs_manual_review` and receive zero automatic marks.
- Submit uses a row lock for PostgreSQL and updates the session/result within the request transaction. Exact duplicate/concurrent behavior still needs a real PostgreSQL integration test.

## Remaining risks

- Existing scenario items contain prose criteria rather than machine-checkable signals. Those require a reviewer workflow; currently the flag is returned in the detailed answer data but a review queue/UI has not been implemented.
- Coding marks remain unavailable until authoritative hidden test cases are executed by a trusted isolated grader. The current compiler flow’s sandbox limits have not been verified.
- SQLite compatibility and question-bank fallback paths remain; production should require PostgreSQL and a deployed migration procedure.
- Timer/heartbeat, duplicate session start, autosave races, disqualification, concurrent submissions and hidden-case secrecy were not exercised against PostgreSQL.
- File/CSV/Excel backup logic writes response data to local disk and is not durable deployment storage. PostgreSQL must remain the system of record; backup storage and retention need an explicit privacy policy.

**Readiness:** core score forgery was reduced, but this is not yet a complete assessment integrity sign-off.
