-- Manual rollback for migration 005. This removes only the index; it does not
-- delete or modify any assessment rows. The runner's _migrations history is
-- intentionally retained. Before a later re-apply through run_migration.py,
-- an operator must review the data and migration state, then remove this
-- filename's _migrations entry as a separate, deliberate metadata operation.
DROP INDEX IF EXISTS idx_fixly_session_once;
