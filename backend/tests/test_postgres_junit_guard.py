"""Regression tests for the CI gate that prevents skipped PostgreSQL checks."""
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_DIR / "scripts"))

from check_postgres_junit import REQUIRED_CASES, main


def write_report(path: Path, *, skipped: str | None = None, failed: str | None = None, missing: str | None = None):
    root = ET.Element("testsuites")
    suite = ET.SubElement(root, "testsuite")
    for name in sorted(REQUIRED_CASES - ({missing} if missing else set())):
        case = ET.SubElement(suite, "testcase", name=name)
        if name == skipped:
            ET.SubElement(case, "skipped", message="synthetic skip")
        if name == failed:
            ET.SubElement(case, "failure", message="synthetic failure")
    ET.ElementTree(root).write(path, encoding="utf-8", xml_declaration=True)


def test_guard_accepts_all_required_cases_passed(tmp_path):
    report = tmp_path / "passed.xml"
    write_report(report)

    assert main(str(report)) == 0


def test_guard_rejects_skipped_required_case(tmp_path):
    report = tmp_path / "skipped.xml"
    write_report(report, skipped=sorted(REQUIRED_CASES)[0])

    assert main(str(report)) == 1


def test_guard_rejects_missing_required_case(tmp_path):
    report = tmp_path / "missing.xml"
    write_report(report, missing=sorted(REQUIRED_CASES)[0])

    assert main(str(report)) == 1


def test_guard_rejects_failed_required_case(tmp_path):
    report = tmp_path / "failed.xml"
    write_report(report, failed=sorted(REQUIRED_CASES)[0])

    assert main(str(report)) == 1
