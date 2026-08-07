import sys
import os
import pytest
import json

# Add parent dir to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import type_aware_compare, format_stdin_adapter, save_algorithm, get_algorithm, AlgorithmPersistRequest

def test_type_aware_compare_exact_text():
    # Verify exact_text preserves exact formatting and does NOT strip prefixes from actual
    exp = "nums = [1, 2, 3]"
    act = "nums = [1, 2, 3]"
    assert type_aware_compare(exp, act, "exact_text") == True

    # Different string should fail in exact_text mode
    act_diff = "[1, 2, 3]"
    assert type_aware_compare(exp, act_diff, "exact_text") == False


def test_type_aware_compare_integer_array():
    # Verify array formatting equality: [0, 0, 1, 1, 1] vs [0,0,1,1,1]
    exp = "[0, 0, 1, 1, 1]"
    act = "[0,0,1,1,1]"
    assert type_aware_compare(exp, act, "integer_array") == True
    assert type_aware_compare(exp, act, "auto") == True


def test_type_aware_compare_float_tolerance():
    exp = "3.14159265"
    act = "3.14159268"
    assert type_aware_compare(exp, act, "float") == True


def test_type_aware_compare_integer():
    assert type_aware_compare("42", "42", "integer") == True
    assert type_aware_compare("42", "43", "integer") == False


def test_type_aware_compare_boolean():
    assert type_aware_compare("True", "true", "boolean") == True
    assert type_aware_compare("False", "false", "boolean") == True


def test_format_stdin_adapter_explicit():
    tc = {
        "id": "tc1",
        "displayInput": "n = 5",
        "stdin": "5\n",
        "expected": "10"
    }
    assert format_stdin_adapter(tc) == "5\n"


def test_format_stdin_adapter_legacy_fallback(caplog):
    tc = {
        "id": "tc_legacy",
        "displayInput": "nums = [1, 0, 1, 0, 1]",
        "expected": "[0, 0, 1, 1, 1]"
    }
    stdin_res = format_stdin_adapter(tc)
    assert "1 0 1 0 1" in stdin_res
    # Verify fallback warning was logged
    assert "[STDIN FALLBACK]" in caplog.text


def test_algorithm_persistence_flexible_keys():
    req = AlgorithmPersistRequest(
        student_id="student_101",
        problem_id="prob_two_sum",
        context_type="coding_challenge",
        context_id="ctx_001",
        algorithm="1. Use Hash Map for O(N) lookup.",
        time_complexity="O(N)",
        space_complexity="O(N)"
    )
    res = save_algorithm(req)
    assert res["status"] == "success"

    fetched = get_algorithm(
        student_id="student_101",
        problem_id="prob_two_sum",
        context_type="coding_challenge",
        context_id="ctx_001"
    )
    assert fetched["exists"] == True
    assert "Hash Map" in fetched["algorithm"]


def test_algorithm_persistence_missing():
    fetched = get_algorithm(
        student_id="student_nonexistent",
        problem_id="prob_unknown",
        context_type="top_100"
    )
    assert fetched["exists"] == False
