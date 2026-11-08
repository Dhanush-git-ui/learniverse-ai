"""Fail CI unless every PostgreSQL integration case ran and passed."""
from __future__ import annotations

import sys
import xml.etree.ElementTree as ET


REQUIRED_CASES = {
    "test_commit_rollback_and_duplicate_constraint",
    "test_concurrent_writes_and_single_assessment_state_transition",
    "test_concurrent_assessment_submission_route_commits_once",
    "test_reconnect_after_database_closes_a_checked_out_connection",
    "test_migration_005_is_idempotent_and_rollback_preserves_rows",
    "test_migration_005_refuses_existing_duplicates_without_deleting_data",
    "test_production_postgres_commit_and_rollback",
}


def main(path: str) -> int:
    root = ET.parse(path).getroot()
    cases = [case for case in root.iter("testcase") if case.get("name") in REQUIRED_CASES]
    by_name = {case.get("name"): case for case in cases}
    missing = sorted(REQUIRED_CASES - by_name.keys())
    skipped = sorted(name for name, case in by_name.items() if case.find("skipped") is not None)
    failed = sorted(
        name for name, case in by_name.items()
        if case.find("failure") is not None or case.find("error") is not None
    )

    if missing or skipped or failed or len(cases) != len(REQUIRED_CASES):
        print(f"Required PostgreSQL cases: {len(REQUIRED_CASES)}; found: {len(cases)}")
        if missing:
            print("Missing:", ", ".join(missing))
        if skipped:
            print("Skipped:", ", ".join(skipped))
        if failed:
            print("Failed:", ", ".join(failed))
        return 1

    print(f"Verified: all {len(REQUIRED_CASES)} required PostgreSQL cases ran without skips or failures.")
    return 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python scripts/check_postgres_junit.py <pytest-junit.xml>")
    raise SystemExit(main(sys.argv[1]))
