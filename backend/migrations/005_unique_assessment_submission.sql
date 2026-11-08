-- Prevent duplicate authoritative assessment result rows for one session.
-- Preflight existing data before applying: duplicate sessions must be reviewed
-- and reconciled by an authorized operator; this migration never deletes data.
--
-- SELECT session_id, COUNT(*)
-- FROM fixly_test_submissions
-- WHERE session_id IS NOT NULL
-- GROUP BY session_id HAVING COUNT(*) > 1;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM fixly_test_submissions
        WHERE session_id IS NOT NULL
        GROUP BY session_id
        HAVING COUNT(*) > 1
    ) THEN
        RAISE EXCEPTION 'Migration 005 refused: duplicate session_id values exist in fixly_test_submissions';
    END IF;
END;
$$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_fixly_session_once
    ON fixly_test_submissions(session_id)
    WHERE session_id IS NOT NULL;
