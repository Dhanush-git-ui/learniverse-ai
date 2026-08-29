import os
import sys
import json
import asyncio
import requests
import re
import ast
from datetime import datetime, timezone
from typing import Optional, Dict, List

# Ensure backend directory is in sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

import logging
import time as _time_module

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("learniverse.backend")

from dotenv import load_dotenv
env_path = os.path.join(backend_dir, ".env")
if os.path.exists(env_path):
    load_dotenv(env_path)
load_dotenv()

from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from starlette.middleware.gzip import GZipMiddleware
from pydantic import BaseModel, Field
from typing import List
import threading
from starlette.requests import Request
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Limit concurrent code executions
_code_execution_semaphore = None

def get_code_execution_semaphore():
    global _code_execution_semaphore
    if _code_execution_semaphore is None:
        _code_execution_semaphore = asyncio.Semaphore(settings.CODE_EXECUTION_SEMAPHORE_LIMIT)
    return _code_execution_semaphore

# Only import lightweight config at startup. Defer heavy RAG imports to request time.
from config import ALLOWED_ORIGINS
from auth import verify_api_key

from config import settings

DB_URL = settings.DATABASE_URL

from psycopg2.pool import ThreadedConnectionPool
from config import DB_POOL_MIN_CONNS, DB_POOL_MAX_CONNS
_db_pool = None

def get_db_conn():
    global _db_pool
    if not DB_URL:
        return None
    try:
        if _db_pool is None or _db_pool.closed:
            _db_pool = ThreadedConnectionPool(
                minconn=DB_POOL_MIN_CONNS,
                maxconn=DB_POOL_MAX_CONNS,
                dsn=DB_URL
            )
        return _db_pool.getconn()
    except Exception as e:
        logger.warning("[DB POOL] Could not acquire connection: %s", e)
        return None

def release_db_conn(conn):
    global _db_pool
    if _db_pool and conn:
        try:
            _db_pool.putconn(conn)
        except Exception:
            pass

from contextlib import asynccontextmanager
from utils.http_client import http_client

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB pool
    global _db_pool, _code_execution_semaphore
    _code_execution_semaphore = asyncio.Semaphore(50)
    if DB_URL and (_db_pool is None or _db_pool.closed):
        try:
            _db_pool = ThreadedConnectionPool(
                minconn=DB_POOL_MIN_CONNS,
                maxconn=DB_POOL_MAX_CONNS,
                dsn=DB_URL
            )
        except Exception as e:
            logger.warning("[DB STARTUP] Could not initialize DB pool: %s", e)
    
    # Startup: Preload some topics
    try:
        from utils.cache_manager import topic_cache
        for topic in ["Stack & Queue", "Linked Lists", "Sorting Algorithms", "Searching Algorithms", "Binary Trees", "Graph Algorithms"]:
            load_preloaded_topic(topic)
    except Exception as e:
        print(f"Failed to preload topics: {e}")
        
    yield
    
    # Shutdown: Close DB pool
    if _db_pool is not None and not _db_pool.closed:
        _db_pool.closeall()
    
    # Shutdown: Close HTTP client
    await http_client.aclose()

app = FastAPI(title="Learniverse AI RAG Backend", lifespan=lifespan)



# Compression for API responses (reduces bandwidth and speeds up transfer)
app.add_middleware(GZipMiddleware, minimum_size=500)

def get_rate_limit_key(request: Request) -> str:
    # Rate limit by the authenticated client API key first to protect shared NAT environments
    api_key = request.headers.get("x-api-key")
    if api_key:
        return api_key
    # Fall back to X-Forwarded-For if behind a proxy
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "127.0.0.1"

limiter = Limiter(key_func=get_rate_limit_key)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Auto-bootstrap: ensure ChromaDB persistent folder exists to avoid silent failures
CHROMA_DIR = os.path.join(os.path.dirname(__file__), "chroma_db")
if not os.path.exists(CHROMA_DIR):
    try:
        os.makedirs(CHROMA_DIR, exist_ok=True)
        print(f"Created missing ChromaDB directory at: {CHROMA_DIR}")
    except Exception as e:
        print(f"Warning: Could not create ChromaDB directory: {e}")


# Output normalization & STDIN formatting helpers
def _normalize_output_text(s: str) -> str:
    if s is None:
        return ""
    s = str(s).replace('\r\n', '\n').strip()
    s = re.sub(r"\s+", " ", s)
    return s




def safe_literal_eval(val):
    """Safely parse literals without risk of arbitrary code execution."""
    if not isinstance(val, str):
        return val
    try:
        return json.loads(val)
    except (json.JSONDecodeError, ValueError):
        pass
    try:
        import ast
        node = ast.parse(val, mode='eval').body
        allowed_nodes = (
            ast.List, ast.Tuple, ast.Dict, ast.Set,
            ast.Constant, ast.UnaryOp, ast.BinOp
        )
        for child in ast.walk(node):
            if not isinstance(child, allowed_nodes):
                raise ValueError("Unsafe node detected in literal")
        return ast.literal_eval(val)
    except Exception:
        return val


def format_stdin_adapter(tc: dict) -> str:
    # 1. Direct explicit stdin string matching documented input format
    if tc.get("stdin") is not None and str(tc.get("stdin")).strip():
        s = str(tc["stdin"])
        return s if s.endswith("\n") else s + "\n"

    # 2. Legacy fallback logging
    raw_input = tc.get("displayInput") if tc.get("displayInput") is not None else tc.get("input", "")
    tc_id = tc.get("id", "unknown")
    logger.warning("[STDIN FALLBACK] Test case ID %s missing explicit stdin. Inferring from display input: %s", tc_id, raw_input)

    if isinstance(raw_input, dict):
        lines = [str(v) for v in raw_input.values()]
        return "\n".join(lines) + "\n"
    elif isinstance(raw_input, list):
        return " ".join(map(str, raw_input)) + "\n"

    s_raw = str(raw_input)
    matches = list(re.finditer(r"(\w+)\s*=", s_raw))
    if matches:
        extracted = []
        for idx, match in enumerate(matches):
            start = match.end()
            end = matches[idx + 1].start() if idx + 1 < len(matches) else len(s_raw)
            val = s_raw[start:end].strip().rstrip(",").strip()
            if val.startswith("[") and val.endswith("]"):
                try:
                    arr = safe_literal_eval(val)
                    if isinstance(arr, list):
                        extracted.append(" ".join(map(str, arr)))
                    else:
                        extracted.append(val)
                except Exception:
                    extracted.append(val)
            else:
                extracted.append(val)
        return "\n".join(extracted) + "\n"

    return s_raw if s_raw.endswith("\n") else s_raw + "\n"


def type_aware_compare(expected, actual, output_type: str = "auto") -> bool:
    if expected is None or actual is None:
        return expected == actual

    # 1. Exact text mode: compare text without modifying actual output
    if output_type == "exact_text":
        exp_t = str(expected).replace("\r\n", "\n")
        act_t = str(actual).replace("\r\n", "\n")
        return exp_t == act_t

    act_str = str(actual).replace("\r\n", "\n").strip()
    exp_str = str(expected).replace("\r\n", "\n").strip()

    # Legacy compatibility fallback ONLY for malformed expected values starting with "output =" or "result ="
    if exp_str.lower().startswith("output =") or exp_str.lower().startswith("result ="):
        exp_str = exp_str.split("=", 1)[1].strip()

    # 2. Integer comparison
    if output_type == "integer":
        try:
            return int(exp_str) == int(act_str)
        except Exception:
            pass

    # 3. Float comparison with 1e-6 tolerance
    if output_type == "float":
        try:
            return abs(float(exp_str) - float(act_str)) < 1e-6
        except Exception:
            pass

    # 4. Boolean comparison
    if output_type == "boolean":
        return exp_str.lower() == act_str.lower()

    # 5. Array / Matrix comparison
    if output_type in ["integer_array", "string_array", "matrix", "array", "list"] or exp_str.startswith("["):
        exp_parsed = safe_literal_eval(exp_str) if isinstance(expected, str) else expected
        act_parsed = safe_literal_eval(act_str) if isinstance(actual, str) else actual
        if exp_parsed is not None and act_parsed is not None and type(exp_parsed) == type(act_parsed):
            return exp_parsed == act_parsed

    # 6. Default / Auto comparison
    try:
        exp_parsed = safe_literal_eval(exp_str) if isinstance(expected, str) else expected
        act_parsed = safe_literal_eval(act_str) if isinstance(actual, str) else actual
        if type(exp_parsed) == type(act_parsed) and type(exp_parsed) in (list, dict, int, float, bool):
            return exp_parsed == act_parsed
    except Exception:
        pass

    return _normalize_output_text(exp_str) == _normalize_output_text(act_str)




def _compare_expected_actual(expected, actual, language: str | None = None) -> bool:
    return type_aware_compare(expected, actual, "auto")


# Add CORS Middleware to allow requests from specific frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-API-Key"],
    max_age=3600,
)
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    """Add standard defense-in-depth HTTP security headers."""
    response = await call_next(request)
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

@app.middleware("http")
async def request_timing_middleware(request: Request, call_next):
    """Log every request with timing information."""
    import time as _t
    start = _t.perf_counter()
    response = await call_next(request)
    duration_ms = round((_t.perf_counter() - start) * 1000, 1)
    path = request.url.path
    skip_exts = (".js", ".css", ".png", ".ico", ".svg", ".woff", ".woff2", ".ttf")
    if not path.startswith("/static") and not any(path.endswith(ext) for ext in skip_exts):
        logger.info("%s %s → %d (%sms)", request.method, path, response.status_code, duration_ms)
    return response

from placement_assessment_system.api import router as assessment_router
app.include_router(assessment_router)

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):  
    message: str = Field(..., max_length=2000)
    topic: str = "General"
    category: str = "DSA"
    history: List[ChatMessage] = Field(default_factory=list)

class SourceInfo(BaseModel):
    book: str
    chapter: str
    topic: str
    score: float = 0.0
    content_type: str = "general"

class ChatResponse(BaseModel):
    teacher_answer: str
    peer_answer: str
    sources: List[SourceInfo]

class EvaluationRequest(BaseModel):
    user_answer: str = Field(..., max_length=2000)
    expected_solution: str = Field(..., max_length=2000)
    question_prompt: str = Field(..., max_length=2000)

@app.post("/api/chat", response_model=ChatResponse, dependencies=[Depends(verify_api_key)])
@limiter.limit("30/minute")
async def chat(request: Request, chat_req: ChatRequest):
    try:
        # Lazy import the RAG orchestrator to avoid heavy startup memory usage
        from rag.rag_pipeline import run_rag_pipeline

        # Hand the payload over to our operational RAG orchestrator
        response_bundle = await run_rag_pipeline(
            query=chat_req.message,
            topic=chat_req.topic,
            category=chat_req.category,
            history=chat_req.history,
        )
        
        # Ensure all required keys exist and return ChatResponse compatible format
        return ChatResponse(
            teacher_answer=response_bundle.get("teacher_answer", ""),
            peer_answer=response_bundle.get("peer_answer", ""),
            sources=[
                SourceInfo(
                    book=src.get("book", "Unknown"),
                    chapter=src.get("chapter", "Unknown"),
                    topic=src.get("topic", "Unknown"),
                    score=src.get("score", 0.0),
                    content_type=src.get("content_type", "general")
                )
                for src in response_bundle.get("sources", [])
            ]
        )
        
    except Exception as e:
        print(f"Error handling chat endpoint request execution: {str(e)}")
        # Shield internal traceback from being exposed
        raise HTTPException(
            status_code=500,
            detail="An internal server error occurred while processing your request. Please try again later."
        )

    
@app.get("/")
def home():
    return {"message": "Learniverse Backend Running"}


@app.get("/health")
def health():
    """Full health check: database, chromadb, and LLM key presence."""
    checks = {"api": "ok"}
    try:
        conn = get_db_conn()
        release_db_conn(conn)
        checks["database"] = "ok"
    except Exception as e:
        checks["database"] = f"error: {str(e)}"
        logger.warning("Health check: database error: %s", e)

    try:
        from rag.retriever import get_chroma_collection
        _, col = get_chroma_collection()
        col.count()
        checks["chromadb"] = "ok"
    except Exception as e:
        checks["chromadb"] = "error"
        logger.warning("Health check: chromadb error: %s", e)

    # Fast key-presence check without making an LLM call
    from config import settings
    checks["llm"] = "ok" if settings.GEMINI_API_KEY else "unconfigured"

    overall = "healthy" if all(v == "ok" for v in checks.values()) else "degraded"
    status_code = 200 if overall == "healthy" else 503
    from fastapi.responses import JSONResponse
    return JSONResponse(content={"status": overall, "checks": checks}, status_code=status_code)


@app.get("/readiness")
def readiness():
    """Lightweight liveness check for load balancers — just confirms the process is alive."""
    return {"status": "ok"}


@app.get("/api/topics")
def get_topics():
    return {
        "categories": ["DSA"],
        "topics": {
            "DSA": ["Array", "Linked List", "Stack", "Queue", "Tree", "BST", "AVL Tree", "Red-Black Tree", "Sorting", "Searching", "Graph"]
        }
    }

VALID_TOPICS = {
    "Array", "Linked List", "Stack", "Queue", "Tree", "BST", "AVL Tree", "Red-Black Tree", "Sorting", "Searching", "Graph",
    "Sorting Algorithms", "Searching Algorithms", "Binary Trees", "Graph Algorithms", "Hash Tables", "Stack & Queue", "Linked Lists", "Dynamic Programming", "Greedy Algorithms", "Complexity Analysis"
}

from utils.cache_manager import topic_cache

@app.get("/api/topic/overview", dependencies=[Depends(verify_api_key)])
@limiter.limit("6/minute")
async def get_topic_overview(request: Request, topic: str = Query(...)):
    if topic not in VALID_TOPICS:
        raise HTTPException(status_code=400, detail="Invalid topic name.")
    
    cache_key = f"overview_{topic}"
    cached = topic_cache.get(cache_key)
    if cached:
        return cached
    try:
        from rag.generator import get_model
        from rag.dsa_prompts import OVERVIEW_PROMPT
        model = get_model()
        prompt = OVERVIEW_PROMPT.format(topic=topic)
        response = await model.generate_content(prompt)
        # model.generate_content returns a sanitized string
        result = {"markdown": response if isinstance(response, str) else str(response)}
        
        # Cache for 1 hour (3600 seconds)
        topic_cache.set(cache_key, result, 3600)
        return result
    except Exception as e:
        logger.error("[get_topic_overview]: %s", e)
        raise HTTPException(status_code=500, detail="Failed to generate topic overview.")


@app.post("/api/evaluate", dependencies=[Depends(verify_api_key)])
@limiter.limit("3/minute")
async def evaluate_answer(request: Request, evaluation_req: EvaluationRequest):
    prompt = f"""
    You are an AI Socratic Grader. Compare the student's answer to the expected solution.
    Determine if the student has understood the concept.
    Return ONLY a raw JSON block:
    {{
      "is_correct": true/false,
      "explanation": "Brief Socratic explanation of why the answer is correct or what was missed."
    }}
    Question: {evaluation_req.question_prompt}
    Expected Solution: {evaluation_req.expected_solution}
    Student Answer: {evaluation_req.user_answer}
    """
    from rag.generator import get_model

    model = get_model()
    resp = await model.generate_content(prompt)
    try:
        # Extract JSON block
        clean_text = resp.text.strip()
        if "```" in clean_text:
            clean_text = clean_text.split("```")[1]
            if clean_text.startswith("json"):
                clean_text = clean_text[4:]
        return json.loads(clean_text.strip())
    except Exception as e:
        return {
            "is_correct": False, 
            "explanation": "Could not verify conceptual understanding automatically."
        }
                
@app.get("/api/topic/mcqs", dependencies=[Depends(verify_api_key)])
@limiter.limit("20/minute")
async def get_topic_mcqs(request: Request, topic: str = Query(...)):
    if topic not in VALID_TOPICS:
        raise HTTPException(status_code=400, detail="Invalid topic name.")
    
    cache_key = f"mcqs_{topic}"
    cached = topic_cache.get(cache_key)
    if cached:
        return cached
    try:
        from rag.generator import get_model
        from rag.dsa_prompts import MCQ_PROMPT
        model = get_model()
        prompt = MCQ_PROMPT.format(topic=topic)
        response = await model.generate_content(prompt)
        raw_text = response.text.strip()
        if raw_text.startswith("```"):
            raw_text = raw_text.split("```")[1]
            if raw_text.startswith("json"):
                raw_text = raw_text[4:]
        mcqs = json.loads(raw_text.strip())
        result = {"mcqs": mcqs}
        
        topic_cache.set(cache_key, result, 3600)
        return result
    except Exception as e:
        logger.error("[get_topic_mcqs]: %s", e)
        raise HTTPException(status_code=500, detail="Failed to generate MCQs.")

@app.get("/api/topic/coding", dependencies=[Depends(verify_api_key)])
@limiter.limit("20/minute")
async def get_topic_coding(request: Request, topic: str = Query(...)):
    if topic not in VALID_TOPICS:
        raise HTTPException(status_code=400, detail="Invalid topic name.")
    try:
        from rag.generator import get_model
        from rag.dsa_prompts import CODING_PROMPT

        model = get_model()
        prompt = CODING_PROMPT.format(topic=topic)
        response = await model.generate_content(prompt)
        
        # Clean up code blocks
        raw_text = response.text.strip()
        if raw_text.startswith("```"):
            raw_text = raw_text.split("```")[1]
            if raw_text.startswith("json"):
                raw_text = raw_text[4:]
                
        coding_challenges = json.loads(raw_text.strip())
        return {"challenges": coding_challenges}
    except Exception as e:
        logger.error("[get_topic_coding]: %s", e)
        raise HTTPException(status_code=500, detail="Failed to generate coding challenges. Please try again.")

# Add this at the very bottom of backend/app.py

DATA_DIR = os.path.join(os.path.dirname(__file__), "data", "topics")

def load_preloaded_topic(topic_name: str) -> dict:
    from utils.cache_manager import topic_cache
    cache_key = f"preloaded_topic_{topic_name}"
    cached = topic_cache.get(cache_key)
    if cached:
        return cached
    if topic_name == "Stack & Queue":
        # Load stack.json and queue.json and merge them!
        stack_data = {}
        queue_data = {}
        stack_path = os.path.join(DATA_DIR, "stack.json")
        queue_path = os.path.join(DATA_DIR, "queue.json")
        
        if os.path.exists(stack_path):
            try:
                with open(stack_path, "r", encoding="utf-8") as f:
                    stack_data = json.load(f)
            except Exception as e:
                print(f"Error loading stack.json: {e}")
        if os.path.exists(queue_path):
            try:
                with open(queue_path, "r", encoding="utf-8") as f:
                    queue_data = json.load(f)
            except Exception as e:
                print(f"Error loading queue.json: {e}")
                
        # Merge them
        merged = {
            "topic": "Stack & Queue",
            "overview": stack_data.get("overview", queue_data.get("overview", {
                "what_is_it": "Stacks and Queues are basic linear data structures.",
                "why_it_matters": "They manage data in LIFO and FIFO orders respectively.",
                "core_idea": "LIFO vs FIFO storage.",
                "time_complexity": "O(1) average for push/pop/enqueue/dequeue",
                "space_complexity": "O(N) total",
                "when_to_use": ["LIFO order operations", "FIFO order operations"],
                "common_mistakes": ["Stack overflow", "Queue underflow"]
            })),
            "pseudocode": stack_data.get("pseudocode", "") + "\n\n" + queue_data.get("pseudocode", ""),
            "real_world_usage": stack_data.get("real_world_usage", []) + queue_data.get("real_world_usage", []),
            "recognition_guide": {
                "keywords": list(set(stack_data.get("recognition_guide", {}).get("keywords", []) + queue_data.get("recognition_guide", {}).get("keywords", []))),
                "patterns": list(set(stack_data.get("recognition_guide", {}).get("patterns", []) + queue_data.get("recognition_guide", {}).get("patterns", []))),
                "constraints": list(set(stack_data.get("recognition_guide", {}).get("constraints", []) + queue_data.get("recognition_guide", {}).get("constraints", [])))
            },
            "mcqs": stack_data.get("mcqs", []) + queue_data.get("mcqs", []),
            "coding_problems": stack_data.get("coding_problems", []) + queue_data.get("coding_problems", [])
        }
        topic_cache.set(cache_key, merged, 3600*24)
        return merged

    # Map other topic names if they differ from filenames
    topic_file_map = {
        "Linked Lists": "linked_lists.json",
        "Sorting Algorithms": "sorting_algorithms.json",
        "Searching Algorithms": "searching_algorithms.json",
        "Binary Trees": "binary_trees.json",
        "Graph Algorithms": "graph_algorithms.json",
    }
    
    file_name = topic_file_map.get(topic_name, f"{topic_name.lower().replace(' ', '_')}.json")
    file_path = os.path.join(DATA_DIR, file_name)
    
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            topic_cache.set(cache_key, data, 3600*24)
            return data
    else:
        return {
            "topic": topic_name,
            "overview": {
                "what_is_it": "Topic data is currently being preloaded.",
                "why_it_matters": "Check back soon.",
                "core_idea": "No description available.",
                "time_complexity": "N/A",
                "space_complexity": "N/A",
                "when_to_use": [],
                "common_mistakes": []
            },
            "pseudocode": "// Code coming soon",
            "real_world_usage": [],
            "recognition_guide": {"keywords": [], "patterns": [], "constraints": []},
            "mcqs": [],
            "coding_problems": []
        }

@app.get("/api/topic/all-content")
@limiter.limit("20/minute")
def get_topic_all_content(request: Request, topic: str = Query(...)):
    if topic not in VALID_TOPICS:
        raise HTTPException(status_code=400, detail="Invalid topic name.")
    return load_preloaded_topic(topic)

def _parse_example_value(value: str):
    normalized = value.strip()
    if normalized.lower() == "true":
        return True
    if normalized.lower() == "false":
        return False
    if normalized.lower() == "null":
        return None
    try:
        return ast.literal_eval(normalized)
    except Exception:
        return normalized

def get_test_cases_for_problem(problem_id: str) -> tuple[list, dict, dict]:
    from utils.cache_manager import topic_cache
    cache_key = f"test_cases_{problem_id}"
    cached = topic_cache.get(cache_key)
    if cached:
        return cached[0], cached[1], cached[2]
    topics_dir = os.path.join(os.path.dirname(__file__), "data", "topics")
    if not os.path.exists(topics_dir):
        return [], {}, {}
        
    for file_name in os.listdir(topics_dir):
        if not file_name.endswith(".json"):
            continue
        try:
            with open(os.path.join(topics_dir, file_name), "r", encoding="utf-8") as f:
                data = json.load(f)
                for problem in data.get("coding_problems", []):
                    if problem.get("id") == problem_id or problem.get("title") == problem_id:
                        tc = parse_examples_into_test_cases(problem.get("examples", []))
                        reg = problem.get("solution_regular", {})
                        opt = problem.get("solution_optimal", {})
                        topic_cache.set(cache_key, (tc, reg, opt), 3600*24)
                        return tc, reg, opt
        except Exception as e:
            print(f"Error loading topic file {file_name}: {e}")
            
    return [{"input": [5, 2, 3, 1], "expected": [1, 2, 3, 5]}], {}, {}

def parse_examples_into_test_cases(examples: list) -> list:
    test_cases = []
    for example in examples or []:
        raw_input = str(example.get("input", ""))
        pairs = {}
        matches = list(re.finditer(r"(\w+)\s*=", raw_input))
        for idx, match in enumerate(matches):
            start = match.end()
            end = matches[idx + 1].start() if idx + 1 < len(matches) else len(raw_input)
            raw_value = raw_input[start:end].strip().rstrip(",").strip()
            pairs[match.group(1)] = _parse_example_value(raw_value)

        parsed_input = pairs if pairs else _parse_example_value(raw_input)
        test_cases.append({
            "input": parsed_input,
            "expected": _parse_example_value(str(example.get("output", "")))
        })
    return test_cases

def build_harness(user_code: str, language: str, test_cases: list) -> str:
    lang = language.lower()
    test_cases_json = json.dumps(test_cases)
    
    if lang in ["python", "py"]:
        return f"""
import json
import sys

# USER CODE
{user_code}

# RESOLVE SOLVE ENTRY POINT
_target_fn = None
try:
    _target_fn = solve
except NameError:
    try:
        if 'Solution' in globals():
            _sol_inst = Solution()
            if hasattr(_sol_inst, 'solve'):
                _target_fn = _sol_inst.solve
    except Exception:
        pass

if _target_fn is None:
    def _missing_solve(*args, **kwargs):
        raise NameError("Entry point 'solve' function or 'class Solution' not found. Please define a top-level solve() function or a Solution class with a solve method.")
    _target_fn = _missing_solve

# DRIVER
test_cases = {test_cases_json}
results = []
for tc in test_cases:
    args = tc['input']
    expected = tc['expected']
    try:
        import inspect
        has_args = False
        try:
            sig = inspect.signature(_target_fn)
            has_args = len(sig.parameters) > 0
        except:
            has_args = True
            
        if not has_args:
            actual = _target_fn()
        elif isinstance(args, dict):
            actual = _target_fn(**args)
        elif isinstance(args, list) or isinstance(args, tuple):
            actual = _target_fn(args)
        else:
            actual = _target_fn(args)
            
        passed = (actual == expected)
        results.append({{
            "testcase": f"Input: {{args}}",
            "expected": f"Output: {{expected}}",
            "actual": f"Output: {{actual}}",
            "passed": passed
        }})
    except Exception as e:
        results.append({{
            "testcase": f"Input: {{args}}",
            "expected": f"Output: {{expected}}",
            "actual": f"Error: {{str(e)}}",
            "passed": False
        }})
print(json.dumps(results))
"""
    elif lang in ["javascript", "js"]:
        return f"""
// USER CODE
{user_code}

// RESOLVE SOLVE ENTRY POINT
let targetFn = typeof solve === 'function' ? solve : null;
if (!targetFn && typeof Solution !== 'undefined') {{
    try {{
        const sol = new Solution();
        if (typeof sol.solve === 'function') targetFn = sol.solve.bind(sol);
    }} catch (e) {{}}
}}
if (!targetFn) {{
    targetFn = () => {{ throw new Error("Entry point 'solve' function or 'class Solution' not found."); }};
}}

// DRIVER
const testCases = {test_cases_json};
const results = [];
for (let i = 0; i < testCases.length; i++) {{
    const tc = testCases[i];
    const args = tc.input;
    const expected = tc.expected;
    try {{
        let actual;
        const hasArgs = typeof targetFn === 'function' && targetFn.length > 0;
        if (!hasArgs && typeof targetFn === 'function') {{
            actual = targetFn();
        }} else if (Array.isArray(args)) {{
            actual = targetFn(args);
        }} else if (typeof args === 'object' && args !== null) {{
            actual = targetFn(...Object.values(args));
        }} else {{
            actual = targetFn(args);
        }}
        
        const isDeepEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
        const passed = isDeepEqual(actual, expected);
        results.push({{
            testcase: "Input: " + JSON.stringify(args),
            expected: "Output: " + JSON.stringify(expected),
            actual: "Output: " + JSON.stringify(actual),
            passed: passed
        }});
    }} catch (e) {{
        results.push({{
            testcase: "Input: " + JSON.stringify(args),
            expected: "Output: " + JSON.stringify(expected),
            actual: "Error: " + e.message,
            passed: false
        }});
    }}
}}
console.log(JSON.stringify(results));
"""
    elif lang in ["cpp", "c++"]:
        inputs_str = []
        expecteds_str = []
        for tc in test_cases:
            inp = tc['input']
            if isinstance(inp, list):
                inputs_str.append("{" + ", ".join(map(str, inp)) + "}")
            else:
                inputs_str.append(f"{{{str(inp)}}}")
                
            exp = tc['expected']
            if isinstance(exp, list):
                expecteds_str.append("{" + ", ".join(map(str, exp)) + "}")
            else:
                expecteds_str.append(f"{{{str(exp)}}}")
            
        inputs_cpp = "{" + ", ".join(inputs_str) + "}"
        expecteds_cpp = "{" + ", ".join(expecteds_str) + "}"
        
        # Support both 'solve' and 'sortBinaryArray' by wrapping it if needed
        wrapper = ""
        if "sortBinaryArray" in user_code and "solve" not in user_code:
            wrapper = "\nvector<int> solve(vector<int>& nums) { return sortBinaryArray(nums); }\n"
            
        return f"""
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>

using namespace std;

{user_code}
{wrapper}

int main() {{
    vector<vector<int>> inputs = {inputs_cpp};
    vector<vector<int>> expecteds = {expecteds_cpp};
    
    cout << "[";
    for (size_t i = 0; i < inputs.size(); ++i) {{
        vector<int> actual = solve(inputs[i]);
        bool passed = (actual == expecteds[i]);
        if (i > 0) cout << ",";
        cout << "{{\\"testcase\\": \\"Case " << (i+1) << "\\\", \\"passed\\": " << (passed ? "true" : "false") << "}}";
    }}
    cout << "]" << endl;
    return 0;
}}
"""
    elif lang == "java":
        inputs_str = []
        expecteds_str = []
        for tc in test_cases:
            inp = tc['input']
            if isinstance(inp, list):
                inputs_str.append("new int[]{" + ", ".join(map(str, inp)) + "}")
            else:
                inputs_str.append(f"new int[]{{{str(inp)}}}")
                
            exp = tc['expected']
            if isinstance(exp, list):
                expecteds_str.append("new int[]{" + ", ".join(map(str, exp)) + "}")
            else:
                expecteds_str.append(f"new int[]{{{str(exp)}}}")
            
        inputs_java = "new int[][]{" + ", ".join(inputs_str) + "}"
        expecteds_java = "new int[][]{" + ", ".join(expecteds_str) + "}"
        
        return f"""
import java.util.*;

{user_code}

public class Main {{
    public static void main(String[] args) {{
        Solution sol = new Solution();
        int[][] inputs = {inputs_java};
        int[][] expecteds = {expecteds_java};
        
        System.out.print("[");
        for (int i = 0; i < inputs.length; i++) {{
            int[] actual = sol.solve(inputs[i]);
            boolean passed = Arrays.equals(actual, expecteds[i]);
            if (i > 0) System.out.print(",");
            System.out.print("{{\\"testcase\\": \\"Case " + (i+1) + "\\\", \\"passed\\": " + passed + "}}");
        }}
        System.out.println("]");
    }}
}}
"""


    return user_code


# Serve built frontend (Vite `dist/`) when available. This allows the backend
# to serve the production frontend build directly for simple deployments.
DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'dist'))
if os.path.isdir(DIST_DIR):
    try:
        # Mount the dist directory under a dedicated mount so API routes remain reachable.
        app.mount('/_dist', StaticFiles(directory=DIST_DIR), name='dist')
        @app.get('/{full_path:path}', include_in_schema=False)
        async def _serve_spa(full_path: str):
            # Prevent accidentally serving API endpoints through the SPA fallback
            if full_path.startswith('api') or full_path.startswith('health'):
                raise HTTPException(status_code=404)
            file_path = os.path.join(DIST_DIR, full_path)
            if os.path.exists(file_path) and os.path.isfile(file_path):
                return FileResponse(file_path)
            index_path = os.path.join(DIST_DIR, 'index.html')
            if os.path.exists(index_path):
                return FileResponse(index_path, media_type='text/html')
            raise HTTPException(status_code=404)
    except Exception as e:
        print(f"Warning: could not mount frontend dist directory: {e}")



def execute_code_locally(language: str, code: str, stdin: str = "") -> dict:
    # Local execution is inherently unsafe. This function is intended
    # for development only and will refuse to run unless explicitly enabled
    # via `ALLOW_LOCAL_EXECUTION=true` AND `ENV=development` in the environment.
    allow_local = os.environ.get("ALLOW_LOCAL_EXECUTION", "false").lower() == "true"
    env_mode = os.environ.get("ENV", "production").lower()
    if not (allow_local and env_mode == "development"):
        return {
            "run": {
                "stdout": "",
                "stderr": "Local execution is disabled on this host. Enable ALLOW_LOCAL_EXECUTION=true and ENV=development to allow it (development only).",
                "code": 1
            }
        }

    import subprocess
    import tempfile
    import shutil
    import sys

    # Define resource limits for the sandbox subprocesses (Unix only)
    preexec = None
    if sys.platform != "win32":
        def set_resource_limits():
            try:
                import resource
                # Max 512MB memory limit
                resource.setrlimit(resource.RLIMIT_AS, (512 * 1024 * 1024, 512 * 1024 * 1024))
                # Max 5 CPU seconds
                resource.setrlimit(resource.RLIMIT_CPU, (5, 5))
                # Max 20 threads/processes to prevent fork-bombs
                resource.setrlimit(resource.RLIMIT_NPROC, (20, 20))
            except Exception:
                pass
        preexec = set_resource_limits

    # Sanitize env to prevent credential leaks (like DATABASE_URL or GEMINI_API_KEY)
    safe_env = {}
    for var in ["PATH", "SystemRoot", "SystemDrive", "TEMP", "TMP"]:
        if var in os.environ:
            safe_env[var] = os.environ[var]
        elif var.upper() in os.environ:
            safe_env[var.upper()] = os.environ[var.upper()]

    lang = language.lower()
    stdout = ""
    stderr = ""
    exit_code = 1

    if lang in ["python", "py"]:
        with tempfile.NamedTemporaryFile(suffix=".py", delete=False, mode="w", encoding="utf-8") as f:
            f.write(code)
            temp_path = f.name
        try:
            res = subprocess.run(
                ["python", temp_path],
                input=stdin,
                capture_output=True,
                text=True,
                timeout=5,
                env=safe_env,
                preexec_fn=preexec
            )
            stdout = res.stdout[:50000]
            stderr = res.stderr[:50000]
            exit_code = res.returncode
        except subprocess.TimeoutExpired:
            stdout = ""
            stderr = "Time Limit Exceeded (Timeout > 5s)"
            exit_code = 124
        except Exception as e:
            stdout = ""
            stderr = f"Local execution failed: {str(e)}"
            exit_code = 1
        finally:
            try:
                os.remove(temp_path)
            except:
                pass
        return {
            "run": {
                "stdout": stdout,
                "stderr": stderr,
                "code": exit_code
            }
        }
    elif lang in ["javascript", "js"]:
        with tempfile.NamedTemporaryFile(suffix=".js", delete=False, mode="w", encoding="utf-8") as f:
            f.write(code)
            temp_path = f.name
        try:
            res = subprocess.run(
                ["node", temp_path],
                input=stdin,
                capture_output=True,
                text=True,
                timeout=5,
                env=safe_env,
                preexec_fn=preexec
            )
            stdout = res.stdout[:50000]
            stderr = res.stderr[:50000]
            exit_code = res.returncode
        except subprocess.TimeoutExpired:
            stdout = ""
            stderr = "Time Limit Exceeded (Timeout > 5s)"
            exit_code = 124
        except Exception as e:
            stdout = ""
            stderr = f"Local execution failed: {str(e)}"
            exit_code = 1
        finally:
            try:
                os.remove(temp_path)
            except:
                pass
        return {
            "run": {
                "stdout": stdout,
                "stderr": stderr,
                "code": exit_code
            }
        }
    elif lang in ["cpp", "c++"]:
        with tempfile.NamedTemporaryFile(suffix=".cpp", delete=False, mode="w", encoding="utf-8") as f:
            f.write(code)
            temp_path = f.name
        exe_path = temp_path.replace(".cpp", ".exe")
        try:
            compile_res = subprocess.run(
                ["g++", temp_path, "-o", exe_path],
                capture_output=True,
                text=True,
                timeout=5,
                env=safe_env,
                preexec_fn=preexec
            )
            if compile_res.returncode != 0:
                return {
                    "run": {
                        "stdout": "",
                        "stderr": ("Compilation Error:\n" + compile_res.stderr)[:50000],
                        "code": compile_res.returncode
                    }
                }
            res = subprocess.run(
                [exe_path],
                input=stdin,
                capture_output=True,
                text=True,
                timeout=5,
                env=safe_env,
                preexec_fn=preexec
            )
            stdout = res.stdout[:50000]
            stderr = res.stderr[:50000]
            exit_code = res.returncode
        except subprocess.TimeoutExpired:
            stdout = ""
            stderr = "Time Limit Exceeded (Timeout > 5s)"
            exit_code = 124
        except FileNotFoundError:
            stdout = ""
            stderr = "C++ compiler (g++) is not installed or not in PATH."
            exit_code = 1
        except Exception as e:
            stdout = ""
            stderr = f"Local C++ execution failed: {str(e)}"
            exit_code = 1
        finally:
            try:
                os.remove(temp_path)
                if os.path.exists(exe_path):
                    os.remove(exe_path)
            except:
                pass
        return {
            "run": {
                "stdout": stdout,
                "stderr": stderr,
                "code": exit_code
            }
        }
    elif lang == "java":
        temp_dir = tempfile.mkdtemp()
        java_file = os.path.join(temp_dir, "Solution.java")
        with open(java_file, "w", encoding="utf-8") as f:
            f.write(code)
        try:
            compile_res = subprocess.run(
                ["javac", "Solution.java"],
                cwd=temp_dir,
                capture_output=True,
                text=True,
                timeout=5,
                env=safe_env,
                preexec_fn=preexec
            )
            if compile_res.returncode != 0:
                return {
                    "run": {
                        "stdout": "",
                        "stderr": ("Compilation Error:\n" + compile_res.stderr)[:50000],
                        "code": compile_res.returncode
                    }
                }
            res = subprocess.run(
                ["java", "Solution"],
                cwd=temp_dir,
                input=stdin,
                capture_output=True,
                text=True,
                timeout=5,
                env=safe_env,
                preexec_fn=preexec
            )
            stdout = res.stdout[:50000]
            stderr = res.stderr[:50000]
            exit_code = res.returncode
        except subprocess.TimeoutExpired:
            stdout = ""
            stderr = "Time Limit Exceeded (Timeout > 5s)"
            exit_code = 124
        except FileNotFoundError:
            stdout = ""
            stderr = "Java compiler (javac/java) is not installed or not in PATH."
            exit_code = 1
        except Exception as e:
            stdout = ""
            stderr = f"Local Java execution failed: {str(e)}"
            exit_code = 1
        finally:
            try:
                shutil.rmtree(temp_dir)
            except:
                pass
        return {
            "run": {
                "stdout": stdout,
                "stderr": stderr,
                "code": exit_code
            }
        }
    else:
        return {
            "run": {
                "stdout": "",
                "stderr": f"Local execution for '{language}' is not supported.",
                "code": 1
            }
        }

def execute_code_via_judge0(language: str, code: str, stdin: str = "") -> dict:
    import requests
    import base64
    import os

    lang = language.lower()
    judge0_url = os.environ.get("JUDGE0_URL", "").strip()
    judge0_api_key = os.environ.get("JUDGE0_API_KEY", "").strip()
    lang_map = {
        "cpp": 54,
        "c++": 54,
        "java": 62,
        "python": 71,
        "py": 71,
        "javascript": 63,
        "js": 63
    }
    lang_id = lang_map.get(lang, 71)

    url = judge0_url
    api_key = judge0_api_key

    if not url and not api_key:
        logger.info("[JUDGE0] No JUDGE0_URL or JUDGE0_API_KEY configured; skipping Judge0 execution.")
        return None

    try:
        code_b64 = base64.b64encode(code.encode("utf-8")).decode("utf-8")
        stdin_b64 = base64.b64encode(stdin.encode("utf-8")).decode("utf-8")

        headers = {"Content-Type": "application/json"}
        payload = {
            "source_code": code_b64,
            "language_id": lang_id,
            "stdin": stdin_b64
        }

        if api_key:
            endpoint = url or "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true"
            headers["x-rapidapi-key"] = api_key
            headers["x-rapidapi-host"] = "judge0-ce.p.rapidapi.com"
        else:
            endpoint = f"{url.rstrip('/')}/submissions?base64_encoded=true&wait=true"

        resp = requests.post(endpoint, json=payload, headers=headers, timeout=10)
        if resp.status_code in [200, 201]:
            data = resp.json()
            stdout = ""
            if data.get("stdout"):
                stdout = base64.b64decode(data["stdout"].encode("utf-8")).decode("utf-8", errors="replace")

            stderr = ""
            if data.get("stderr"):
                stderr = base64.b64decode(data["stderr"].encode("utf-8")).decode("utf-8", errors="replace")
            if data.get("compile_output"):
                stderr += "\n" + base64.b64decode(data["compile_output"].encode("utf-8")).decode("utf-8", errors="replace")

            status_id = data.get("status", {}).get("id", 3)
            exit_code = 0 if status_id == 3 else 1

            if status_id == 5:
                stderr = "Time Limit Exceeded (Timeout > 5s)"
                exit_code = 124

            return {
                "run": {
                    "stdout": stdout,
                    "stderr": stderr.strip(),
                    "code": exit_code
                }
            }
        else:
            logger.info("[JUDGE0] API call returned status {resp.status_code}")
            return None
    except Exception as e:
        logger.error("[JUDGE0] Exception occurred: %s", e)
        return None

def execute_code_via_piston_api(language: str, code: str, stdin: str = "") -> dict:
    import requests
    lang_map = {
        "python": "python",
        "py": "python",
        "javascript": "javascript",
        "js": "javascript",
        "java": "java",
        "cpp": "cpp",
        "c++": "cpp"
    }
    version_map = {
        "python": "3.10.0",
        "javascript": "18.15.0",
        "java": "15.0.2",
        "cpp": "10.2.0"
    }
    lang = lang_map.get(language.lower(), "python")
    version = version_map.get(lang, "*")
    
    payload = {
        "language": lang,
        "version": version,
        "files": [{"content": code}],
        "stdin": stdin
    }
    try:
        resp = requests.post("https://emkc.org/api/v2/piston/execute", json=payload, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        run = data.get("run", {})
        compile_res = data.get("compile", {})
        
        stdout = run.get("stdout", "")
        stderr = run.get("stderr", "")
        if compile_res and compile_res.get("stderr"):
            stderr = compile_res.get("stderr") + "\n" + stderr
            
        return {
            "run": {
                "stdout": stdout,
                "stderr": stderr.strip(),
                "code": run.get("code", 0)
            }
        }
    except Exception as e:
        logger.error("[PISTON API] Exception occurred: %s", e)
        return None

def execute_code_via_piston(language: str, code: str, stdin: str = "") -> dict:
    from config import settings
    # 1. Prefer Judge0 whenever it is configured
    judge0_res = execute_code_via_judge0(language, code, stdin)
    if judge0_res is not None:
        return judge0_res

    # 2. Fallback to Sandboxed Piston API
    piston_res = execute_code_via_piston_api(language, code, stdin)
    if piston_res is not None:
        return piston_res

    # 3. If everything fails, only allow local fallback in explicit development mode
    if not (settings.ALLOW_LOCAL_EXECUTION and settings.IS_DEV):
        logger.info("[EXECUTION] Judge0 & Piston failed, and local execution disabled in this environment.")
        return None

    logger.info("[EXECUTION] Falling back to local sandbox execution (development opt-in).")
    return execute_code_locally(language, code, stdin)

async def generate_code_review(problem_id: str, user_code: str, language: str, passed_count: int, total_count: int) -> str:
    prompt = f"""
You are an expert technical interviewer. Review the following student code submission for accuracy, code quality, and efficiency.
Provide a constructive 2-3 sentence review of their approach.

Problem ID: {problem_id}
Submitted Code ({language}):
{user_code}

Test Cases Passed: {passed_count} / {total_count}

Write a direct, encouraging, and brief review.
"""
    try:
        from rag.generator import get_model

        model = get_model()
        response = await model.generate_content(prompt)
        return response.strip() if isinstance(response, str) else str(response).strip()
    except Exception:
        return f"Code submitted successfully. Test cases passed: {passed_count}/{total_count}. Excellent work!"

class RawExecuteRequest(BaseModel):
    language: str
    version: str = "*"
    files: List[dict] = []
    stdin: str = ""

@app.post("/api/code/execute-raw")
@limiter.limit("20/minute")
def execute_raw_code(request: Request, req: RawExecuteRequest, _=Depends(verify_api_key)):
    # Basic payload protections: limit file content size to avoid memory abuse.
    code = ""
    if req.files:
        code = req.files[0].get("content", "")
        if code and len(code) > 20000:
            raise HTTPException(status_code=413, detail="Payload too large")

    execution_result = execute_code_via_piston(req.language, code, req.stdin)
    if execution_result is None:
        # Execution service not available (Judge0 missing and local execution disabled)
        raise HTTPException(status_code=503, detail="Code execution service is not available. Contact administrator.")

    return execution_result

class AlgorithmPersistRequest(BaseModel):
    student_id: str
    problem_id: str
    context_type: str = "coding_challenge"
    context_id: Optional[str] = None
    algorithm: str
    time_complexity: Optional[str] = ""
    space_complexity: Optional[str] = ""

_algorithm_store: Dict[str, dict] = {}

def get_algo_key(student_id: str, problem_id: str, context_type: str, context_id: Optional[str] = None) -> str:
    ctx = context_id or ""
    return f"{student_id}:{problem_id}:{context_type}:{ctx}"

@app.post("/api/code/algorithm", dependencies=[Depends(verify_api_key)])
def save_algorithm(req: AlgorithmPersistRequest):
    key = get_algo_key(req.student_id, req.problem_id, req.context_type, req.context_id)
    _algorithm_store[key] = {
        "algorithm": req.algorithm,
        "time_complexity": req.time_complexity,
        "space_complexity": req.space_complexity,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    return {"status": "success", "message": "Algorithm saved successfully."}

@app.get("/api/code/algorithm", dependencies=[Depends(verify_api_key)])
def get_algorithm(student_id: str, problem_id: str, context_type: str = "coding_challenge", context_id: Optional[str] = None):
    key = get_algo_key(student_id, problem_id, context_type, context_id)
    algo_data = _algorithm_store.get(key)
    if algo_data:
        return {"exists": True, **algo_data}
    return {"exists": False, "algorithm": "", "time_complexity": "", "space_complexity": ""}

class CodeRunRequest(BaseModel):
    code: str
    language: str
    problemId: str
    studentId: Optional[str] = "student_default"
    contextType: Optional[str] = "coding_challenge"
    contextId: Optional[str] = None
    algorithm: Optional[str] = None

from fastapi.concurrency import run_in_threadpool

def detect_io_mode(code: str, language: str) -> bool:
    code_str = code.lower()
    lang = language.lower()
    if lang in ["python", "py"]:
        return "def solve" not in code_str or "input(" in code_str or "print(" in code_str
    elif lang in ["cpp", "c++"]:
        return "int main" in code_str or "solve" not in code_str
    elif lang == "java":
        return "public static void main" in code_str or "solve" not in code_str
    elif lang in ["javascript", "js"]:
        return "function solve" not in code_str and "const solve" not in code_str and "let solve" not in code_str and "var solve" not in code_str
    return True

def format_io_input(raw_input) -> str:
    if isinstance(raw_input, dict):
        return "\n".join(str(v) for v in raw_input.values())
    elif isinstance(raw_input, list):
        return " ".join(str(v) for v in raw_input)
    return str(raw_input)

@app.post("/api/code/run", dependencies=[Depends(verify_api_key)])
@limiter.limit("6/minute")
async def run_user_code(request: Request, code_req: CodeRunRequest):
    if code_req.code and len(code_req.code) > 20000:
        raise HTTPException(status_code=413, detail="Payload too large")
    
    test_cases = []
    
    # 1. First, check if it's a placement assessment question (code_0001, etc.) in the database
    if code_req.problemId.startswith("code_"):
        def fetch_db_test_cases():
            import psycopg2
            from psycopg2.extras import RealDictCursor
            db_conn = None
            try:
                db_conn = get_db_conn()
                db_cur = db_conn.cursor(cursor_factory=RealDictCursor)
                db_cur.execute("SELECT examples FROM questions WHERE id = %s", (code_req.problemId,))
                row = db_cur.fetchone()
                db_cur.close()
                if row and row["examples"]:
                    return json.loads(row["examples"]) if isinstance(row["examples"], str) else row["examples"]
            except Exception as e:
                print("[ERROR] Database check in run_user_code:", e)
            finally:
                if db_conn:
                    release_db_conn(db_conn)
            return []
            
        test_cases = await run_in_threadpool(fetch_db_test_cases)
            
    # 2. Otherwise fallback to preloaded topic files
    if not test_cases:
        test_cases, _, _ = get_test_cases_for_problem(code_req.problemId)
        
    if not test_cases or code_req.problemId in ["free_run", "playground", "general", "free"]:
        try:
            await asyncio.wait_for(_code_execution_semaphore.acquire(), timeout=30.0)
            execution_result = await run_in_threadpool(execute_code_via_piston, code_req.language, code_req.code, "")
        except Exception as exec_err:
            execution_result = {"run": {"stdout": "", "stderr": str(exec_err), "code": 1}}
        finally:
            _code_execution_semaphore.release()
            
        stdout = execution_result.get("run", {}).get("stdout", "").strip() if execution_result else ""
        stderr = execution_result.get("run", {}).get("stderr", "").strip() if execution_result else "Execution service unavailable"
        code = execution_result.get("run", {}).get("code", 0) if execution_result else 1
        
        passed = (code == 0 and not stderr)
        return {
            "status": "success" if passed else "failed",
            "passed": passed,
            "results": [{
                "testcase": "Free Program Execution",
                "expected": "Clean execution",
                "actual": stdout if stdout else (stderr if stderr else "Program finished with no output."),
                "passed": passed
            }]
        }
        
    is_io_mode = code_req.problemId.startswith("code_") or detect_io_mode(code_req.code, code_req.language)
    if is_io_mode:
        results = []
        passed_cases = 0
        total_cases = len(test_cases)
        
        try:
            await asyncio.wait_for(_code_execution_semaphore.acquire(), timeout=30.0)
            for idx, tc in enumerate(test_cases):
                stdin_data = format_stdin_adapter(tc)
                out_type = tc.get("outputType") or tc.get("output_type") or "auto"
                execution_result = await run_in_threadpool(execute_code_via_piston, code_req.language, code_req.code, stdin_data)
                stdout = execution_result.get("run", {}).get("stdout", "").strip() if execution_result else ""
                stderr = execution_result.get("run", {}).get("stderr", "").strip() if execution_result else ""
                code = execution_result.get("run", {}).get("code", 0) if execution_result else 1
                
                if code != 0 or stderr:
                    error_msg = stderr if stderr else f"Execution failed with exit code {code}"
                    results.append({
                        "testcase": f"Case {idx+1}",
                        "input": tc.get("displayInput") or str(tc.get("input", "")),
                        "stdin": stdin_data,
                        "expected": str(tc.get("expected", "")),
                        "actual": None,
                        "error": error_msg,
                        "passed": False
                    })
                else:
                    passed = type_aware_compare(tc["expected"], stdout, out_type)
                    if passed:
                        passed_cases += 1
                    results.append({
                        "testcase": f"Case {idx+1}",
                        "input": tc.get("displayInput") or str(tc.get("input", "")),
                        "stdin": stdin_data,
                        "expected": str(tc.get("expected", "")),
                        "actual": stdout,
                        "error": None,
                        "passed": passed
                    })
        finally:
            _code_execution_semaphore.release()
            
        all_passed = (passed_cases == total_cases and total_cases > 0)
        return {
            "status": "success" if all_passed else "failed",
            "passed": all_passed,
            "results": results
        }
        
    # For standard function-style topic questions, use the legacy wrapper harness
    harness_code = build_harness(code_req.code, code_req.language, test_cases)
    
    try:
        await asyncio.wait_for(_code_execution_semaphore.acquire(), timeout=30.0)
    except asyncio.TimeoutError:
        raise HTTPException(status_code=429, detail="Too many concurrent submissions. Please retry in 30 seconds.")
    try:
        execution_result = await run_in_threadpool(execute_code_via_piston, code_req.language, harness_code)
    finally:
        _code_execution_semaphore.release()
        
    if not execution_result:
        return {
            "status": "failed",
            "passed": False,
            "results": [{"testcase": "Sandbox check", "expected": "Compiler response", "actual": "Code execution server offline. Please try again.", "passed": False}]
        }
        
    stdout = execution_result.get("run", {}).get("stdout", "").strip()
    stderr = execution_result.get("run", {}).get("stderr", "").strip()
    code = execution_result.get("run", {}).get("code", 0)
    
    if code != 0 or stderr:
        error_msg = stderr if stderr else f"Execution failed with exit code {code}"
        return {
            "status": "failed",
            "passed": False,
            "results": [{"testcase": "Compilation/Runtime check", "expected": "Clean execution", "actual": error_msg, "passed": False}]
        }
        
    try:
        results = json.loads(stdout)
        all_passed = all(r.get("passed", False) for r in results)
        return {
            "status": "success",
            "passed": all_passed,
            "results": results
        }
    except Exception as e:
        return {
            "status": "failed",
            "passed": False,
            "results": [{"testcase": "Output", "expected": "JSON-formatted test results", "actual": stdout if stdout else "Executed successfully, but no valid test case markers found.", "passed": False}]
        }

@app.post("/api/code/submit", dependencies=[Depends(verify_api_key)])
@limiter.limit("3/minute")
async def submit_user_code(request: Request, code_req: CodeRunRequest):
    if code_req.code and len(code_req.code) > 20000:
        raise HTTPException(status_code=413, detail="Payload too large")
    import time
    
    # Save optional algorithm if provided
    if code_req.algorithm and code_req.algorithm.strip():
        key = get_algo_key(code_req.studentId or "student_default", code_req.problemId, code_req.contextType or "coding_challenge", code_req.contextId)
        _algorithm_store[key] = {
            "algorithm": code_req.algorithm,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }

    test_cases = []
    reg_sol = {}
    opt_sol = {}
    
    if code_req.problemId.startswith("code_"):
        def fetch_db_submit_info():
            import psycopg2
            from psycopg2.extras import RealDictCursor
            db_conn = None
            try:
                db_conn = get_db_conn()
                if db_conn:
                    db_cur = db_conn.cursor(cursor_factory=RealDictCursor)
                    db_cur.execute("SELECT examples, answer, explanation FROM questions WHERE id = %s", (code_req.problemId,))
                    row = db_cur.fetchone()
                    db_cur.close()
                    if row:
                        tc = json.loads(row["examples"]) if isinstance(row["examples"], str) else (row["examples"] or [])
                        try:
                            sols = json.loads(row["answer"]) if row["answer"] else {}
                        except:
                            sols = {}
                        rs = {
                            "approach": "Standard brute force approach.",
                            "code": sols.get("brute_code", ""),
                            "time": sols.get("time_complexity", "O(N)"),
                            "space": sols.get("space_complexity", "O(N)")
                        }
                        osol = {
                            "approach": row["explanation"] or "Optimal approach.",
                            "code": sols.get("optimal_code", ""),
                            "time": sols.get("time_complexity", "O(N)"),
                            "space": sols.get("space_complexity", "O(N)")
                        }
                        return tc, rs, osol
            except Exception as e:
                print("[ERROR] Database check in submit_user_code:", e)
            finally:
                if db_conn:
                    release_db_conn(db_conn)
            return [], {}, {}
        
        test_cases, reg_sol, opt_sol = await run_in_threadpool(fetch_db_submit_info)
            
    if not test_cases:
        test_cases, raw_reg, raw_opt = get_test_cases_for_problem(code_req.problemId)
        reg_sol = {
            "approach": raw_reg.get("approach", "Standard approach."),
            "code": raw_reg.get("code", "// Solution code"),
            "time": raw_reg.get("time", "O(N^2)"),
            "space": raw_reg.get("space", "O(1)")
        }
        opt_sol = {
            "approach": raw_opt.get("approach", "Optimal approach."),
            "code": raw_opt.get("code", "// Optimal solution code"),
            "time": raw_opt.get("time", "O(N log N)"),
            "space": raw_opt.get("space", "O(N)")
        }
        
    passed_cases = 0
    total_cases = len(test_cases) if test_cases else 1
    
    is_io_mode = code_req.problemId.startswith("code_") or detect_io_mode(code_req.code, code_req.language)
    if is_io_mode:
        start_time = time.perf_counter()
        try:
            await asyncio.wait_for(_code_execution_semaphore.acquire(), timeout=30.0)
        except asyncio.TimeoutError:
            raise HTTPException(status_code=429, detail="Too many concurrent submissions. Please retry in 30 seconds.")
        try:
            for idx, tc in enumerate(test_cases):
                stdin_data = format_stdin_adapter(tc)
                out_type = tc.get("outputType") or tc.get("output_type") or "auto"
                execution_result = await run_in_threadpool(execute_code_via_piston, code_req.language, code_req.code, stdin_data)
                stdout = execution_result.get("run", {}).get("stdout", "").strip() if execution_result else ""
                stderr = execution_result.get("run", {}).get("stderr", "").strip() if execution_result else ""
                code = execution_result.get("run", {}).get("code", 0) if execution_result else 1
                
                if code == 0 and not stderr:
                    passed = type_aware_compare(tc["expected"], stdout, out_type)
                    if passed:
                        passed_cases += 1
        finally:
            _code_execution_semaphore.release()
            
        elapsed_ms = round((time.perf_counter() - start_time) * 1000, 1)
        run_time_str = f"{elapsed_ms}ms"
        
        review = await generate_code_review(code_req.problemId, code_req.code, code_req.language, passed_cases, total_cases)
        
        all_passed = (passed_cases == total_cases and total_cases > 0)
        is_live_assessment = str(code_req.problemId).startswith("code_") or str(code_req.problemId).startswith("exam_")

        return {
            "passed_cases": passed_cases,
            "total_cases": total_cases,
            "runtime": run_time_str,
            "memory": "N/A",
            "approach_review": review,
            "regular_solution": reg_sol if (all_passed and not is_live_assessment) else None,
            "optimal_solution": opt_sol if (all_passed and not is_live_assessment) else None
        }

        
    # Legacy execution logic for function-style questions
    harness_code = build_harness(code_req.code, code_req.language, test_cases)
    
    start_time = time.perf_counter()
    try:
        await asyncio.wait_for(_code_execution_semaphore.acquire(), timeout=30.0)
    except asyncio.TimeoutError:
        raise HTTPException(status_code=429, detail="Too many concurrent submissions. Please retry in 30 seconds.")
    try:
        execution_result = await run_in_threadpool(execute_code_via_piston, code_req.language, harness_code)
    finally:
        _code_execution_semaphore.release()
        
    elapsed_ms = round((time.perf_counter() - start_time) * 1000, 1)
    run_time_str = f"{elapsed_ms}ms"
    
    stdout = ""
    if execution_result:
        stdout = execution_result.get("run", {}).get("stdout", "").strip()
        stderr = execution_result.get("run", {}).get("stderr", "").strip()
        code = execution_result.get("run", {}).get("code", 0)
        if code == 0 and not stderr:
            try:
                results = json.loads(stdout)
                passed_cases = sum(1 for r in results if r.get("passed", False))
                total_cases = len(results)
            except Exception:
                passed_cases = 1
                total_cases = 1
                
    review = generate_code_review(code_req.problemId, code_req.code, code_req.language, passed_cases, total_cases)
    
    all_passed = (passed_cases == total_cases and total_cases > 0)
    is_live_assessment = str(code_req.problemId).startswith("code_") or str(code_req.problemId).startswith("exam_")

    return {
        "passed_cases": passed_cases,
        "total_cases": total_cases,
        "runtime": run_time_str,
        "memory": "N/A",
        "approach_review": review,
        "regular_solution": reg_sol if (all_passed and not is_live_assessment) else None,
        "optimal_solution": opt_sol if (all_passed and not is_live_assessment) else None
    }


if __name__ == "__main__":
    import uvicorn
    import os
    
    is_dev = os.environ.get("ENV", "development") == "development"
    
    if is_dev:
        uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
    else:
        uvicorn.run("app:app", host="0.0.0.0", port=8000, workers=4)

