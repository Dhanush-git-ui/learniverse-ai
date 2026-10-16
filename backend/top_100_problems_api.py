"""
Top 100 Problems API Endpoints
Public endpoints for executing code against problems (LeetCode-style)
"""

from fastapi import APIRouter, HTTPException, Query, Depends, Request
from fastapi.responses import JSONResponse
import uuid
import asyncio
import base64
import json
import subprocess
import re
from datetime import datetime, timezone
from typing import Optional, List

from top_100_problems import (
    Problem, ProblemStats, SubmissionRequest, SubmissionResult,
    get_problem, list_all_problems, get_problem_with_public_tests,
    store_submission, get_problem_stats, get_user_submissions,
    DifficultyLevel
)

# Create router (will be included in main app.py)
problems_router = APIRouter(prefix="/api/problems", tags=["Top 100 Problems"])

import logging
logger = logging.getLogger("top_100_problems.api")

# ============================================================================
# PUBLIC ENDPOINTS (No authentication required)
# ============================================================================

@problems_router.get("/list", tags=["Public"])
async def list_problems(
    difficulty: Optional[str] = Query(None),
    topic: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    _request: Request = None,  # For rate limiting
):
    """
    List all top 100 problems with filters

    **Rate Limit**: 100 requests/minute

    Query Parameters:
    - difficulty: "easy", "medium", "hard"
    - topic: Filter by topic tag
    - skip: Pagination offset
    - limit: Results per page (max 100)
    """
    try:
        diff_enum = None
        if difficulty:
            diff_enum = DifficultyLevel(difficulty.lower())

        result = list_all_problems(
            difficulty=diff_enum,
            topic=topic,
            skip=skip,
            limit=limit
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid difficulty: {e}")
    except Exception as e:
        logger.error(f"Error listing problems: {e}")
        raise HTTPException(status_code=500, detail="Failed to list problems")

@problems_router.get("/problem/{problem_id}", tags=["Public"])
async def get_problem_details(problem_id: int):
    """
    Get detailed problem description (public test cases only)

    **Includes**:
    - Problem description
    - Examples
    - Constraints
    - Public test cases
    - Code templates for all languages
    - Acceptance rate

    **Rate Limit**: 200 requests/minute
    """
    prob_data = get_problem_with_public_tests(problem_id)
    if not prob_data:
        raise HTTPException(status_code=404, detail=f"Problem {problem_id} not found")

    return prob_data

@problems_router.get("/stats/{problem_id}", tags=["Public"])
async def get_stats(problem_id: int):
    """Get acceptance rate and submission statistics for a problem"""
    stats = get_problem_stats(problem_id)
    if not stats:
        raise HTTPException(status_code=404, detail=f"Problem {problem_id} not found")

    return stats.dict()

# ============================================================================
# CODE EXECUTION ENDPOINTS
# ============================================================================

@problems_router.post("/submit", tags=["Execution"])
async def submit_solution(
    req: SubmissionRequest,
    _request: Request = None,  # For rate limiting
):
    """
    Execute code against problem test cases

    **Rate Limit**: 20 submissions/minute per IP

    Returns:
    - passed_tests: Number of passed test cases
    - total_tests: Total test cases
    - status: "accepted", "wrong_answer", "runtime_error", "time_limit_exceeded"
    - test_results: Detailed results for each test case
    - execution_time_ms: Total execution time
    """
    try:
        # Validate problem exists
        problem = get_problem(req.problem_id)
        if not problem:
            raise HTTPException(status_code=404, detail=f"Problem {req.problem_id} not found")

        # Validate code not empty
        if not req.code or len(req.code.strip()) == 0:
            raise HTTPException(status_code=400, detail="Code cannot be empty")

        if len(req.code) > 50000:
            raise HTTPException(status_code=413, detail="Code too large (max 50KB)")

        # Execute code
        submission_id = str(uuid.uuid4())
        start_time = datetime.now(timezone.utc)

        test_results = []
        passed_tests = 0
        status = "accepted"
        execution_time_ms = 0.0
        memory_used_mb = 0.0

        try:
            # Run against each test case
            for test_case in problem.test_cases:
                result = await execute_test_case(
                    code=req.code,
                    language=req.language,
                    test_case=test_case,
                    problem=problem
                )

                test_results.append(result)

                if result["passed"]:
                    passed_tests += 1
                else:
                    status = "wrong_answer"

                execution_time_ms += result["execution_time_ms"]
                memory_used_mb = max(memory_used_mb, result.get("memory_mb", 0))

        except TimeoutError:
            status = "time_limit_exceeded"
        except Exception as e:
            status = "runtime_error"
            test_results = [{"error": str(e), "passed": False}]

        # Store submission result
        submission_result = SubmissionResult(
            submission_id=submission_id,
            problem_id=req.problem_id,
            user_id=req.user_id,
            language=req.language,
            passed_tests=passed_tests,
            total_tests=len(problem.test_cases),
            status=status,
            test_results=test_results,
            execution_time_ms=execution_time_ms,
            memory_used_mb=memory_used_mb,
            timestamp=datetime.now(timezone.utc).isoformat()
        )

        store_submission(submission_result)

        return {
            "submission_id": submission_id,
            "status": status,
            "passed_tests": passed_tests,
            "total_tests": len(problem.test_cases),
            "execution_time_ms": execution_time_ms,
            "memory_used_mb": memory_used_mb,
            "test_results": [
                {
                    "id": r["id"],
                    "passed": r["passed"],
                    "input": r.get("input", ""),
                    "expected": r.get("expected", ""),
                    "actual": r.get("actual", ""),
                    "error": r.get("error"),
                    "execution_time_ms": r.get("execution_time_ms", 0),
                } for r in test_results
            ]
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Submission error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Submission failed")

@problems_router.post("/test", tags=["Execution"])
async def test_solution(
    problem_id: int = Query(...),
    language: str = Query(...),
    code: str = Query(...),
    test_input: Optional[str] = Query(None),
    _request: Request = None,
):
    """
    Quick test code against a custom input or first public test case

    **Rate Limit**: 30 requests/minute per IP
    """
    problem = get_problem(problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail=f"Problem {problem_id} not found")

    if not code or len(code.strip()) == 0:
        raise HTTPException(status_code=400, detail="Code cannot be empty")

    try:
        # Use provided test input or first public test case
        if test_input:
            test_case = {
                "id": 0,
                "input": test_input,
                "expected_output": "",
                "is_public": True
            }
        else:
            public_tests = [t for t in problem.test_cases if t.is_public]
            if not public_tests:
                raise HTTPException(status_code=404, detail="No public test cases available")
            test_case = public_tests[0]

        result = await execute_test_case(code, language, test_case, problem)

        return {
            "success": True,
            "passed": result["passed"],
            "output": result.get("actual", ""),
            "expected": result.get("expected", ""),
            "error": result.get("error"),
            "execution_time_ms": result.get("execution_time_ms", 0),
        }

    except Exception as e:
        logger.error(f"Test error: {e}")
        return {
            "success": False,
            "error": str(e),
            "output": "",
        }

# ============================================================================
# USER SUBMISSION HISTORY
# ============================================================================

@problems_router.get("/submissions/{user_id}", tags=["History"])
async def get_submissions(
    user_id: str,
    problem_id: Optional[int] = Query(None),
    limit: int = Query(50, le=100),
):
    """Get user's submission history"""
    submissions = get_user_submissions(user_id, problem_id)
    return {
        "user_id": user_id,
        "submissions": [
            {
                "submission_id": s.submission_id,
                "problem_id": s.problem_id,
                "status": s.status,
                "language": s.language,
                "passed_tests": s.passed_tests,
                "total_tests": s.total_tests,
                "timestamp": s.timestamp,
            }
            for s in submissions[:limit]
        ]
    }

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

async def execute_test_case(code: str, language: str, test_case: dict, problem: Problem) -> dict:
    """
    Execute code against a single test case

    Returns:
    {
        "id": test_case_id,
        "passed": bool,
        "input": input_str,
        "expected": expected_output,
        "actual": actual_output,
        "error": error_message or None,
        "execution_time_ms": float,
        "memory_mb": float,
    }
    """
    import time
    start_time = time.time()

    try:
        # Language-specific execution
        result = None

        if language.lower() in ["python", "py"]:
            result = execute_python(code, test_case, problem)
        elif language.lower() in ["javascript", "js"]:
            result = execute_javascript(code, test_case, problem)
        elif language.lower() in ["java"]:
            result = execute_java(code, test_case, problem)
        elif language.lower() in ["cpp", "c++"]:
            result = execute_cpp(code, test_case, problem)
        else:
            # Fallback to Judge0
            from app import execute_code_via_judge0
            result = execute_code_via_judge0(language, code, test_case["input"])
            if result is None:
                raise Exception("Execution service unavailable")

        execution_time_ms = (time.time() - start_time) * 1000

        # Parse output and check correctness
        actual_output = result.get("stdout", "").strip()
        expected_output = test_case["expected_output"].strip()

        passed = normalize_output(actual_output) == normalize_output(expected_output)

        return {
            "id": test_case.get("id", 0),
            "passed": passed,
            "input": test_case["input"],
            "expected": expected_output,
            "actual": actual_output,
            "error": result.get("stderr") if result.get("code", 0) != 0 else None,
            "execution_time_ms": execution_time_ms,
            "memory_mb": 0,  # Would need to measure from execution
        }

    except Exception as e:
        execution_time_ms = (time.time() - start_time) * 1000
        return {
            "id": test_case.get("id", 0),
            "passed": False,
            "input": test_case["input"],
            "expected": test_case["expected_output"],
            "actual": "",
            "error": str(e),
            "execution_time_ms": execution_time_ms,
            "memory_mb": 0,
        }

def execute_python(code: str, test_case: dict, problem: Problem) -> dict:
    """Execute Python code"""
    # Extract function call from code
    exec_code = f"""{code}

# Test execution
import sys
import io

# Capture output
old_stdout = sys.stdout
sys.stdout = buffer = io.StringIO()

try:
    # Call the function
    result = {problem.code_templates[0].function_name}({test_case['input']})
    if result is not None:
        print(result)
except Exception as e:
    sys.stdout = old_stdout
    print(f"Error: {{e}}", file=sys.stderr)
    sys.exit(1)

sys.stdout = old_stdout
output = buffer.getvalue()
print(output, end='')
"""
    try:
        result = subprocess.run(
            ["python", "-c", exec_code],
            input=test_case["input"],
            capture_output=True,
            text=True,
            timeout=5
        )
        return {
            "stdout": result.stdout,
            "stderr": result.stderr,
            "code": result.returncode
        }
    except subprocess.TimeoutExpired:
        raise TimeoutError("Execution timed out (> 5s)")
    except Exception as e:
        raise Exception(f"Python execution failed: {e}")

def execute_javascript(code: str, test_case: dict, problem: Problem) -> dict:
    """Execute JavaScript code"""
    # Node.js execution
    exec_code = f"""{code}

// Test execution
const input = `{test_case['input']}`;
try {{
    const result = {problem.code_templates[1].function_name}(input);
    console.log(result);
}} catch(e) {{
    console.error(e.message);
    process.exit(1);
}}
"""
    try:
        result = subprocess.run(
            ["node", "-e", exec_code],
            capture_output=True,
            text=True,
            timeout=5
        )
        return {
            "stdout": result.stdout,
            "stderr": result.stderr,
            "code": result.returncode
        }
    except subprocess.TimeoutExpired:
        raise TimeoutError("Execution timed out (> 5s)")
    except Exception as e:
        raise Exception(f"JavaScript execution failed: {e}")

def execute_java(code: str, test_case: dict, problem: Problem) -> dict:
    """Execute Java code (compile then run)"""
    # Placeholder - requires compilation
    raise NotImplementedError("Java execution requires compilation setup")

def execute_cpp(code: str, test_case: dict, problem: Problem) -> dict:
    """Execute C++ code (compile then run)"""
    # Placeholder - requires compilation
    raise NotImplementedError("C++ execution requires compilation setup")

def normalize_output(output: str) -> str:
    """Normalize output for comparison"""
    # Remove extra whitespace, handle floating point comparisons
    lines = output.strip().split("\n")
    normalized = []

    for line in lines:
        line = line.strip()
        if line:
            # Try to parse as number for floating-point comparison
            try:
                num = float(line)
                normalized.append(f"{num:.6f}")
            except:
                normalized.append(line)

    return "\n".join(normalized)
