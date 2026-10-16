"""
Top 100 LeetCode-style Problems Database & API
Provides public access to curated problem set with test case execution
"""

from typing import List, Dict, Optional, Any
from pydantic import BaseModel
from enum import Enum
import json
import os

# Problem Difficulty Levels
class DifficultyLevel(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

class ProgrammingLanguage(str, Enum):
    PYTHON = "python"
    JAVASCRIPT = "javascript"
    JAVA = "java"
    CPP = "cpp"
    C = "c"

# Data Models
class TestCase(BaseModel):
    """Represents a single test case for a problem"""
    id: int
    input: str
    expected_output: str
    is_public: bool = True  # Public test cases visible before submission
    explanation: Optional[str] = None

class CodeTemplate(BaseModel):
    """Code template for each language"""
    language: ProgrammingLanguage
    template: str
    function_name: str

class Problem(BaseModel):
    """Complete problem definition"""
    id: int
    number: int  # LeetCode-style problem number (1-100)
    title: str
    slug: str  # URL-friendly title
    difficulty: DifficultyLevel
    description: str
    examples: List[Dict[str, str]]  # Input/output examples
    constraints: List[str]
    topics: List[str]  # Tags like "array", "string", "dp"
    related_problems: List[int] = []  # Problem IDs
    test_cases: List[TestCase]
    code_templates: List[CodeTemplate]
    time_limit: int = 5  # seconds
    memory_limit: int = 256  # MB
    acceptance_rate: float = 0.0
    total_submissions: int = 0
    total_accepted: int = 0

class SubmissionRequest(BaseModel):
    """User code submission"""
    problem_id: int
    language: ProgrammingLanguage
    code: str
    user_id: Optional[str] = None  # Anonymous if not provided

class SubmissionResult(BaseModel):
    """Result of code execution against test cases"""
    submission_id: str
    problem_id: int
    user_id: Optional[str]
    language: ProgrammingLanguage
    passed_tests: int
    total_tests: int
    status: str  # "accepted", "wrong_answer", "runtime_error", "time_limit_exceeded"
    test_results: List[Dict[str, Any]]
    execution_time_ms: float
    memory_used_mb: float
    timestamp: str

class ProblemStats(BaseModel):
    """Statistics for a problem"""
    problem_id: int
    total_submissions: int
    total_accepted: int
    acceptance_rate: float
    average_execution_time_ms: float
    average_memory_mb: float

# Top 100 Problems Database
TOP_100_PROBLEMS = [
    {
        "id": 1,
        "number": 1,
        "title": "Two Sum",
        "slug": "two-sum",
        "difficulty": DifficultyLevel.EASY,
        "description": """Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.

You may assume that each input has exactly one solution, and you may not use the same element twice.

You can return the answer in any order.""",
        "examples": [
            {"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]", "explanation": "nums[0] + nums[1] == 9, so we return [0, 1]."},
            {"input": "nums = [3,2,4], target = 6", "output": "[1,2]", "explanation": "nums[1] + nums[2] == 6, so we return [1, 2]."},
        ],
        "constraints": [
            "2 <= nums.length <= 10^4",
            "-10^9 <= nums[i] <= 10^9",
            "-10^9 <= target <= 10^9",
            "Only one valid answer exists."
        ],
        "topics": ["array", "hash-table"],
        "test_cases": [
            {"id": 1, "input": "nums = [2,7,11,15], target = 9", "expected_output": "[0,1]", "is_public": True},
            {"id": 2, "input": "nums = [3,2,4], target = 6", "expected_output": "[1,2]", "is_public": True},
            {"id": 3, "input": "nums = [3,3], target = 6", "expected_output": "[0,1]", "is_public": False},
        ],
        "code_templates": [
            {
                "language": ProgrammingLanguage.PYTHON,
                "template": """def twoSum(nums, target):
    # Write your solution here
    pass""",
                "function_name": "twoSum"
            },
            {
                "language": ProgrammingLanguage.JAVASCRIPT,
                "template": """function twoSum(nums, target) {
    // Write your solution here
}""",
                "function_name": "twoSum"
            },
            {
                "language": ProgrammingLanguage.JAVA,
                "template": """class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }
}""",
                "function_name": "twoSum"
            },
            {
                "language": ProgrammingLanguage.CPP,
                "template": """class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        return {};
    }
};""",
                "function_name": "twoSum"
            }
        ],
        "time_limit": 5,
        "memory_limit": 256,
        "acceptance_rate": 0.47,
        "total_submissions": 45000000,
        "total_accepted": 21000000,
    },
    {
        "id": 2,
        "number": 2,
        "title": "Add Two Numbers",
        "slug": "add-two-numbers",
        "difficulty": DifficultyLevel.MEDIUM,
        "description": """You are given two non-empty linked lists representing two non-negative integers.
The digits are stored in reverse order, and each of their nodes contains a single digit.
Add the two numbers and return the sum as a linked list.""",
        "examples": [
            {"input": "l1 = [2,4,3], l2 = [5,6,4]", "output": "[7,0,8]", "explanation": "342 + 465 = 807."},
        ],
        "constraints": [
            "The number of nodes in each linked list is in the range [1, 100].",
            "0 <= Node.val <= 9"
        ],
        "topics": ["linked-list", "math"],
        "test_cases": [
            {"id": 1, "input": "l1 = [2,4,3], l2 = [5,6,4]", "expected_output": "[7,0,8]", "is_public": True},
            {"id": 2, "input": "l1 = [0], l2 = [0]", "expected_output": "[0]", "is_public": True},
        ],
        "code_templates": [
            {
                "language": ProgrammingLanguage.PYTHON,
                "template": """class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def addTwoNumbers(l1, l2):
    # Write your solution here
    pass""",
                "function_name": "addTwoNumbers"
            }
        ],
        "time_limit": 5,
        "memory_limit": 256,
        "acceptance_rate": 0.34,
        "total_submissions": 3500000,
        "total_accepted": 1200000,
    },
    # ... Add more problems (3-100)
]

# In-memory storage (use PostgreSQL in production)
_problems_cache: Dict[int, Problem] = {}
_submissions_db: List[SubmissionResult] = []

def load_problems():
    """Load top 100 problems into cache"""
    global _problems_cache
    for prob_data in TOP_100_PROBLEMS:
        prob = Problem(**prob_data)
        _problems_cache[prob.id] = prob

def get_problem(problem_id: int) -> Optional[Problem]:
    """Retrieve problem by ID"""
    if not _problems_cache:
        load_problems()
    return _problems_cache.get(problem_id)

def list_all_problems(
    difficulty: Optional[DifficultyLevel] = None,
    topic: Optional[str] = None,
    skip: int = 0,
    limit: int = 20
) -> Dict[str, Any]:
    """List problems with filtering and pagination"""
    if not _problems_cache:
        load_problems()

    problems = list(_problems_cache.values())

    # Filter by difficulty
    if difficulty:
        problems = [p for p in problems if p.difficulty == difficulty]

    # Filter by topic
    if topic:
        problems = [p for p in problems if topic in p.topics]

    # Sort by problem number
    problems.sort(key=lambda p: p.number)

    total = len(problems)
    paginated = problems[skip:skip + limit]

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "problems": [
            {
                "id": p.id,
                "number": p.number,
                "title": p.title,
                "slug": p.slug,
                "difficulty": p.difficulty,
                "acceptance_rate": p.acceptance_rate,
                "topics": p.topics,
            }
            for p in paginated
        ]
    }

def get_problem_with_public_tests(problem_id: int) -> Optional[Dict[str, Any]]:
    """Get problem with only public test cases (for user display)"""
    prob = get_problem(problem_id)
    if not prob:
        return None

    public_tests = [t for t in prob.test_cases if t.is_public]

    return {
        "id": prob.id,
        "number": prob.number,
        "title": prob.title,
        "slug": prob.slug,
        "difficulty": prob.difficulty,
        "description": prob.description,
        "examples": prob.examples,
        "constraints": prob.constraints,
        "topics": prob.topics,
        "code_templates": prob.code_templates,
        "public_test_cases": public_tests,
        "acceptance_rate": prob.acceptance_rate,
    }

def store_submission(result: SubmissionResult):
    """Store submission result for analytics"""
    _submissions_db.append(result)

def get_problem_stats(problem_id: int) -> Optional[ProblemStats]:
    """Get statistics for a problem"""
    prob = get_problem(problem_id)
    if not prob:
        return None

    return ProblemStats(
        problem_id=problem_id,
        total_submissions=prob.total_submissions,
        total_accepted=prob.total_accepted,
        acceptance_rate=prob.acceptance_rate,
        average_execution_time_ms=500.0,  # Mock data
        average_memory_mb=50.0,  # Mock data
    )

def get_user_submissions(user_id: str, problem_id: Optional[int] = None) -> List[SubmissionResult]:
    """Get user's submissions"""
    results = [s for s in _submissions_db if s.user_id == user_id]
    if problem_id:
        results = [s for s in results if s.problem_id == problem_id]
    return sorted(results, key=lambda s: s.timestamp, reverse=True)

# Initialize on module load
load_problems()
