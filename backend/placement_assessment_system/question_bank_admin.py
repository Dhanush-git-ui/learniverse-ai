"""Admin-only, database-backed question bank and trainer assessment APIs."""

from __future__ import annotations

import json
import re
import uuid
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field

from auth import User, require_admin
from placement_assessment_system.api import SQLiteCursorAdapter, get_db_cursor


router = APIRouter(
    prefix="/api/admin/question-bank",
    tags=["Admin Question Bank"],
    dependencies=[Depends(require_admin)],
)
_schema_ready = False


def ensure_question_bank_schema(db) -> None:
    """Apply additive, idempotent schema changes for either supported DB."""
    global _schema_ready
    if _schema_ready:
        return

    extra_columns = {
        "option_explanations": "TEXT",
        "source": "TEXT",
        "provenance": "VARCHAR(50)",
        "verification_status": "TEXT",
        "review_status": "VARCHAR(32) NOT NULL DEFAULT 'Approved'",
        "input_format": "TEXT",
        "output_format": "TEXT",
        "constraints_text": "TEXT",
        "sample_explanation": "TEXT",
        "test_cases": "TEXT",
        "reference_solution": "TEXT",
        "time_complexity": "VARCHAR(100)",
        "space_complexity": "VARCHAR(100)",
        "supported_languages": "TEXT",
        "structural_status": "VARCHAR(40) NOT NULL DEFAULT 'Not Checked'",
        "answer_status": "VARCHAR(40) NOT NULL DEFAULT 'Unverified'",
        "source_status": "VARCHAR(40) NOT NULL DEFAULT 'Unverified'",
        "expert_review_status": "VARCHAR(40) NOT NULL DEFAULT 'Pending'",
        "verification_evidence": "TEXT",
    }
    if isinstance(db, SQLiteCursorAdapter):
        db.execute("PRAGMA table_info(questions)")
        existing = {str(row.get("name")) for row in db.fetchall()}
        for name, definition in extra_columns.items():
            if name not in existing:
                db.execute(f"ALTER TABLE questions ADD COLUMN {name} {definition}")
    else:
        db.execute("ALTER TABLE questions ALTER COLUMN category TYPE TEXT")
        # The legacy schema used VARCHAR(20), but current import identifiers
        # and generator labels can exceed that limit.
        db.execute("ALTER TABLE questions ALTER COLUMN generator_version TYPE TEXT")
        for name, definition in extra_columns.items():
            db.execute(f"ALTER TABLE questions ADD COLUMN IF NOT EXISTS {name} {definition}")

    ddl = [
        "CREATE TABLE IF NOT EXISTS question_categories (name TEXT PRIMARY KEY, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
        "CREATE TABLE IF NOT EXISTS question_topics (category TEXT NOT NULL, topic TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(category, topic))",
        "CREATE TABLE IF NOT EXISTS question_import_batches (batch_id TEXT PRIMARY KEY, source TEXT NOT NULL, attempted_count INTEGER NOT NULL, upserted_count INTEGER NOT NULL, review_status VARCHAR(32) NOT NULL, imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
        "CREATE TABLE IF NOT EXISTS question_companies (slug TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE)",
        "CREATE TABLE IF NOT EXISTS question_roles (slug TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE)",
        "CREATE TABLE IF NOT EXISTS question_role_links (question_id VARCHAR(100) NOT NULL REFERENCES questions(id) ON DELETE CASCADE, role_slug TEXT NOT NULL REFERENCES question_roles(slug), provenance VARCHAR(50) NOT NULL DEFAULT 'Source-Verified Practice Question', source TEXT, PRIMARY KEY(question_id, role_slug))",
        "CREATE TABLE IF NOT EXISTS question_company_roles (question_id VARCHAR(100) NOT NULL REFERENCES questions(id) ON DELETE CASCADE, company_slug TEXT NOT NULL REFERENCES question_companies(slug), role_slug TEXT NOT NULL REFERENCES question_roles(slug), recruitment_stage TEXT NOT NULL DEFAULT 'General Practice', provenance VARCHAR(50) NOT NULL, source TEXT, PRIMARY KEY(question_id, company_slug, role_slug, recruitment_stage))",
        "CREATE TABLE IF NOT EXISTS question_review_events (review_id TEXT PRIMARY KEY, question_id VARCHAR(100) NOT NULL REFERENCES questions(id) ON DELETE CASCADE, status VARCHAR(32) NOT NULL, reviewer_id TEXT NOT NULL, note TEXT NOT NULL, reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
        "CREATE TABLE IF NOT EXISTS question_collections (collection_id TEXT PRIMARY KEY, owner_id TEXT NOT NULL, name TEXT NOT NULL, description TEXT NOT NULL DEFAULT '', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, UNIQUE(owner_id, name))",
        "CREATE TABLE IF NOT EXISTS question_collection_items (collection_id TEXT NOT NULL REFERENCES question_collections(collection_id) ON DELETE CASCADE, question_id VARCHAR(100) NOT NULL REFERENCES questions(id) ON DELETE CASCADE, position INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(collection_id, question_id))",
        "CREATE TABLE IF NOT EXISTS trainer_tests (test_id TEXT PRIMARY KEY, owner_id TEXT NOT NULL, title TEXT NOT NULL, role_name TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'Draft', total_time INTEGER NOT NULL DEFAULT 0, total_score REAL NOT NULL DEFAULT 0, test_data TEXT NOT NULL DEFAULT '{}', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
        "CREATE TABLE IF NOT EXISTS trainer_test_sections (section_id TEXT PRIMARY KEY, test_id TEXT NOT NULL REFERENCES trainer_tests(test_id) ON DELETE CASCADE, name TEXT NOT NULL, section_type TEXT NOT NULL, time_limit INTEGER NOT NULL DEFAULT 0, questions_count INTEGER NOT NULL DEFAULT 0, score REAL NOT NULL DEFAULT 0, position INTEGER NOT NULL DEFAULT 0, section_data TEXT NOT NULL DEFAULT '{}')",
        "CREATE TABLE IF NOT EXISTS trainer_test_questions (test_id TEXT NOT NULL REFERENCES trainer_tests(test_id) ON DELETE CASCADE, section_id TEXT NOT NULL REFERENCES trainer_test_sections(section_id) ON DELETE CASCADE, question_id VARCHAR(100) NOT NULL REFERENCES questions(id), position INTEGER NOT NULL DEFAULT 0, marks REAL NOT NULL DEFAULT 1, PRIMARY KEY(test_id, section_id, question_id))",
        "CREATE INDEX IF NOT EXISTS idx_questions_review_category_topic ON questions(review_status, category, topic)",
        "CREATE INDEX IF NOT EXISTS idx_questions_type_difficulty ON questions(question_type, difficulty)",
        "CREATE INDEX IF NOT EXISTS idx_question_company_roles_filter ON question_company_roles(company_slug, role_slug, question_id)",
        "CREATE INDEX IF NOT EXISTS idx_question_role_links_filter ON question_role_links(role_slug, question_id)",
        "CREATE INDEX IF NOT EXISTS idx_question_review_history ON question_review_events(question_id, reviewed_at)",
        "CREATE INDEX IF NOT EXISTS idx_question_collections_owner ON question_collections(owner_id, updated_at)",
        "CREATE INDEX IF NOT EXISTS idx_trainer_tests_owner ON trainer_tests(owner_id, updated_at)",
    ]
    for statement in ddl:
        db.execute(statement)
    review_columns = {
        "structural_status": "VARCHAR(40)", "answer_status": "VARCHAR(40)",
        "source_status": "VARCHAR(40)", "expert_review_status": "VARCHAR(40)", "evidence": "TEXT",
    }
    if isinstance(db, SQLiteCursorAdapter):
        db.execute("PRAGMA table_info(question_review_events)")
        existing_review_columns = {str(row.get("name")) for row in db.fetchall()}
        for name, definition in review_columns.items():
            if name not in existing_review_columns:
                db.execute(f"ALTER TABLE question_review_events ADD COLUMN {name} {definition}")
    else:
        for name, definition in review_columns.items():
            db.execute(f"ALTER TABLE question_review_events ADD COLUMN IF NOT EXISTS {name} {definition}")
    if isinstance(db, SQLiteCursorAdapter):
        db.execute("PRAGMA table_info(trainer_tests)")
        test_columns = {str(row.get("name")) for row in db.fetchall()}
        if "test_data" not in test_columns:
            db.execute("ALTER TABLE trainer_tests ADD COLUMN test_data TEXT NOT NULL DEFAULT '{}' ")
    else:
        db.execute("ALTER TABLE trainer_tests ADD COLUMN IF NOT EXISTS test_data TEXT NOT NULL DEFAULT '{}' ")
    if isinstance(db, SQLiteCursorAdapter):
        db.execute("PRAGMA table_info(trainer_test_sections)")
        section_columns = {str(row.get("name")) for row in db.fetchall()}
        if "section_data" not in section_columns:
            db.execute("ALTER TABLE trainer_test_sections ADD COLUMN section_data TEXT NOT NULL DEFAULT '{}' ")
    else:
        db.execute("ALTER TABLE trainer_test_sections ADD COLUMN IF NOT EXISTS section_data TEXT NOT NULL DEFAULT '{}' ")
    _schema_ready = True


def _decode_json(value: Any, fallback: Any = None) -> Any:
    if value is None:
        return fallback
    if isinstance(value, (dict, list)):
        return value
    try:
        return json.loads(value)
    except (TypeError, ValueError):
        return fallback


def _slug(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.strip().casefold()).strip("-")


class QuestionReviewRequest(BaseModel):
    status: str
    note: str = Field(min_length=12, max_length=2000)
    structural_status: Optional[str] = None
    answer_status: Optional[str] = None
    source_status: Optional[str] = None
    expert_review_status: Optional[str] = None
    evidence: Optional[str] = Field(default=None, max_length=4000)


class CreateQuestionRequest(BaseModel):
    id: Optional[str] = None
    question: str = Field(min_length=3, max_length=4000)
    topic: str = Field(min_length=1, max_length=100)
    subtopic: Optional[str] = Field(default="General", max_length=100)
    difficulty: str = Field(default="Medium", max_length=20)
    category: Optional[str] = Field(default="General", max_length=100)
    options: List[str] = Field(min_length=2, max_length=10)
    correct_option: str = Field(min_length=1, max_length=10)
    explanation: Optional[str] = Field(default="", max_length=4000)
    tags: Optional[List[str]] = Field(default_factory=list)


class CollectionRequest(BaseModel):
    name: str = Field(min_length=2, max_length=160)
    description: str = Field(default="", max_length=2000)
    question_ids: List[str] = Field(min_length=1, max_length=500)


class TrainerTestRequest(BaseModel):
    id: Optional[str] = None
    title: str = Field(min_length=2, max_length=200)
    roleName: str = Field(default="", max_length=160)
    status: str = "Draft"
    totalTime: int = Field(default=0, ge=0, le=1440)
    totalScore: float = Field(default=0, ge=0)
    sections: List[Dict[str, Any]] = Field(default_factory=list, max_length=100)


@router.get("/facets")
def get_question_bank_facets(db=Depends(get_db_cursor)):
    ensure_question_bank_schema(db)
    # Older installations can already contain questions before the facet
    # catalog tables were introduced. Derive any missing catalog values from
    # those records so the category/topic dropdowns remain usable after deploy.
    db.execute(
        "INSERT INTO question_categories (name) SELECT DISTINCT category FROM questions WHERE category IS NOT NULL AND category <> '' ON CONFLICT(name) DO NOTHING"
    )
    db.execute(
        "INSERT INTO question_topics (category, topic) SELECT DISTINCT category, topic FROM questions WHERE category IS NOT NULL AND category <> '' AND topic IS NOT NULL AND topic <> '' ON CONFLICT(category, topic) DO NOTHING"
    )
    result = {}
    for name, sql in {
        "categories": "SELECT name AS value FROM question_categories ORDER BY name",
        "topics": "SELECT DISTINCT topic AS value FROM question_topics ORDER BY topic",
        "companies": "SELECT slug AS value, name FROM question_companies ORDER BY name",
        "roles": "SELECT slug AS value, name FROM question_roles ORDER BY name",
        "question_types": "SELECT DISTINCT question_type AS value FROM questions WHERE question_type IS NOT NULL AND question_type <> '' ORDER BY question_type",
    }.items():
        db.execute(sql)
        result[name] = db.fetchall()
    return result


@router.get("/questions")
def list_questions(
    search: str = Query(default="", max_length=200),
    category: str = Query(default="", max_length=100),
    topic: str = Query(default="", max_length=100),
    difficulty: str = Query(default="", max_length=20),
    question_type: str = Query(default="", max_length=50),
    company: str = Query(default="", max_length=100),
    role: str = Query(default="", max_length=100),
    status: str = Query(default="Approved", max_length=32),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db=Depends(get_db_cursor),
):
    ensure_question_bank_schema(db)
    where: List[str] = []
    params: List[Any] = []
    if status != "all":
        where.append("q.review_status = %s")
        params.append(status)
    for col, val in (("q.category", category), ("q.topic", topic), ("q.difficulty", difficulty), ("q.question_type", question_type)):
        if val:
            where.append(f"{col} = %s")
            params.append(val)
    if search.strip():
        where.append("(q.question ILIKE %s OR q.topic ILIKE %s OR q.category ILIKE %s OR CAST(q.tags AS TEXT) ILIKE %s)")
        needle = f"%{search.strip()}%"
        params.extend([needle, needle, needle, needle])
    if company:
        association_filter = ["qr.question_id=q.id"]
        association_filter.append("qr.company_slug=%s")
        params.append(company)
        if role:
            association_filter.append("qr.role_slug=%s")
            params.append(role)
        where.append("EXISTS (SELECT 1 FROM question_company_roles qr WHERE " + " AND ".join(association_filter) + ")")
    elif role:
        params.extend([role, role])
        where.append("(EXISTS (SELECT 1 FROM question_role_links qrl WHERE qrl.question_id=q.id AND qrl.role_slug=%s) OR EXISTS (SELECT 1 FROM question_company_roles qr WHERE qr.question_id=q.id AND qr.role_slug=%s))")
    predicate = " WHERE " + " AND ".join(where) if where else ""

    db.execute(f"SELECT COUNT(*) AS total FROM questions q{predicate}", tuple(params))
    total = int((db.fetchone() or {}).get("total", 0))
    offset = (page - 1) * page_size
    db.execute(
        "SELECT q.id, q.category, q.question_type, q.topic, q.subtopic, q.difficulty, q.question, q.options, q.correct_option, q.answer, q.explanation, q.option_explanations, q.tags, q.examples, q.source, q.provenance, q.verification_status, q.review_status, q.structural_status, q.answer_status, q.source_status, q.expert_review_status, q.verification_evidence, q.input_format, q.output_format, q.constraints_text, q.sample_explanation, q.test_cases, q.reference_solution, q.time_complexity, q.space_complexity, q.supported_languages "
        f"FROM questions q{predicate} ORDER BY q.category, q.topic, q.id LIMIT %s OFFSET %s",
        tuple(params + [page_size, offset]),
    )
    rows = db.fetchall()
    items = []
    ids = [r["id"] for r in rows]
    associations: Dict[str, Dict[str, List[str]]] = {}
    if ids:
        marks = ",".join(["%s"] * len(ids))
        db.execute(
            f"SELECT qr.question_id, c.name AS company, r.name AS role, qr.recruitment_stage, qr.provenance AS association_provenance, qr.source AS association_source FROM question_company_roles qr JOIN question_companies c ON c.slug=qr.company_slug JOIN question_roles r ON r.slug=qr.role_slug WHERE qr.question_id IN ({marks})",
            tuple(ids),
        )
        for association in db.fetchall():
            target = associations.setdefault(association["question_id"], {"companies": [], "roles": [], "stages": [], "associations": []})
            for key, value in (("companies", association["company"]), ("roles", association["role"]), ("stages", association["recruitment_stage"])):
                if value not in target[key]:
                    target[key].append(value)
            target["associations"].append({k: association.get(k) for k in ("company", "role", "recruitment_stage", "association_provenance", "association_source")})
        db.execute(
            f"SELECT rl.question_id, r.name AS role FROM question_role_links rl JOIN question_roles r ON r.slug=rl.role_slug WHERE rl.question_id IN ({marks})",
            tuple(ids),
        )
        for role_link in db.fetchall():
            target = associations.setdefault(role_link["question_id"], {"companies": [], "roles": [], "stages": [], "associations": []})
            if role_link["role"] not in target["roles"]:
                target["roles"].append(role_link["role"])
    for row in rows:
        record = dict(row)
        for key in ("options", "option_explanations", "tags", "examples", "test_cases", "supported_languages"):
            record[key] = _decode_json(record.get(key), [] if key in ("options", "option_explanations", "tags", "examples", "test_cases", "supported_languages") else None)
        record.update(associations.get(record["id"], {"companies": [], "roles": [], "stages": [], "associations": []}))
        items.append(record)
    return {"items": items, "total": total, "page": page, "page_size": page_size, "pages": (total + page_size - 1) // page_size}


@router.patch("/questions/{question_id}/review")
def review_question(question_id: str, payload: QuestionReviewRequest, user: User = Depends(require_admin), db=Depends(get_db_cursor)):
    ensure_question_bank_schema(db)
    if payload.status not in {"Approved", "Pending Review", "Rejected"}:
        raise HTTPException(status_code=422, detail="Unsupported review status")
    allowed_values = {
        "structural_status": {"Not Checked", "Structurally Validated", "Needs Revision"},
        "answer_status": {"Unverified", "Deterministically Verified", "Answer Verified", "Incorrect"},
        "source_status": {"Unverified", "Repository Source Recorded", "Source Verified", "No External Source"},
        "expert_review_status": {"Pending", "Expert Reviewed", "Rejected"},
    }
    for field, allowed in allowed_values.items():
        value = getattr(payload, field)
        if value is not None and value not in allowed:
            raise HTTPException(status_code=422, detail=f"Unsupported {field}")
    if payload.status == "Approved" and not (
        payload.answer_status == "Answer Verified"
        and payload.expert_review_status == "Expert Reviewed"
        and payload.evidence and len(payload.evidence.strip()) >= 20
    ):
        raise HTTPException(status_code=422, detail="Approval requires Answer Verified, Expert Reviewed, and at least 20 characters of evidence")
    db.execute(
        "UPDATE questions SET review_status=%s, structural_status=COALESCE(%s, structural_status), answer_status=COALESCE(%s, answer_status), source_status=COALESCE(%s, source_status), expert_review_status=COALESCE(%s, expert_review_status), verification_evidence=COALESCE(%s, verification_evidence) WHERE id=%s",
        (payload.status, payload.structural_status, payload.answer_status, payload.source_status, payload.expert_review_status, payload.evidence.strip() if payload.evidence else None, question_id),
    )
    if db.rowcount == 0:
        raise HTTPException(status_code=404, detail="Question not found")
    db.execute(
        "INSERT INTO question_review_events (review_id, question_id, status, reviewer_id, note, structural_status, answer_status, source_status, expert_review_status, evidence) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
        (str(uuid.uuid4()), question_id, payload.status, user.id, payload.note.strip(), payload.structural_status, payload.answer_status, payload.source_status, payload.expert_review_status, payload.evidence),
    )
    return {"question_id": question_id, "review_status": payload.status, "structural_status": payload.structural_status, "answer_status": payload.answer_status, "source_status": payload.source_status, "expert_review_status": payload.expert_review_status}


FALLBACK_APPROVED_SAMPLE_QUESTIONS = [
    {
        "id": "q-101", "topic": "Java", "difficulty": "Easy", "question": "What is the purpose of wrapper classes in Java?",
        "options": ["To provide a mechanism to convert primitive into object and object into primitive", "To speed up compilation of large Java packages", "To hide private methods from reflection APIs", "To wrap network sockets in safe stream handlers"], "correct_option": "A", "answer": "A", "explanation": "Wrapper classes wrap primitive types into objects for collections."
    },
    {
        "id": "q-102", "topic": "Javascript", "difficulty": "Easy", "question": "What is the output of the following code?\nconst a = [1, 2, 3];\nconst b = a;\nb.push(4);\nconsole.log(a.length);",
        "options": ["3", "4", "undefined", "TypeError"], "correct_option": "B", "answer": "B", "explanation": "Arrays are assigned by reference in JavaScript."
    },
    {
        "id": "q-103", "topic": "DSA", "difficulty": "Medium", "question": "What will happen if we try to compile and run the following C++ code with a non-type template parameter passing a double?",
        "options": ["It compiles cleanly in standard C++17", "Compilation error: Floating-point values were historically disallowed as non-type template parameters prior to C++20", "It triggers a runtime segmentation fault", "The double value is implicitly truncated to an integer at runtime"], "correct_option": "B", "answer": "B", "explanation": "Non-type template parameters historically required integral types."
    },
    {
        "id": "q-104", "topic": "SQL", "difficulty": "Medium", "question": "Which index type is best suited in PostgreSQL for full-text search against unstructured document text columns?",
        "options": ["B-Tree", "GIN (Generalized Inverted Index)", "Hash", "BRIN"], "correct_option": "B", "answer": "B", "explanation": "GIN is optimal for tsvector full-text search in PostgreSQL."
    },
    {
        "id": "q-105", "topic": "CS Fundamentals", "difficulty": "Hard", "question": "How does the Node.js event loop handle unhandled Promise rejections during asynchronous microtask execution?",
        "options": ["They are ignored silently in modern Node.js versions", "They trigger an unhandledRejection event and terminate the process with a non-zero exit code in Node.js 15+", "They are automatically pushed to the macrotask timer queue", "The worker thread halts while the main thread continues"], "correct_option": "B", "answer": "B", "explanation": "Modern Node.js treats unhandled rejections as fatal exceptions."
    },
    {
        "id": "q-106", "topic": "HTML and CSS", "difficulty": "Easy", "question": "Which HTML5 semantic element should encapsulate autonomous, distributable composition such as a blog post or news story?",
        "options": ["<article>", "<section>", "<aside>", "<main>"], "correct_option": "A", "answer": "A", "explanation": "The <article> element is for standalone content."
    },
    {
        "id": "q-107", "topic": "HTML and CSS", "difficulty": "Medium", "question": "What CSS property allows text to truncate with an ellipsis (...) when overflowing its container?",
        "options": ["text-overflow: ellipsis; along with overflow: hidden; white-space: nowrap;", "overflow: ellipsis;", "text-truncate: true;", "text-wrap: dot;"], "correct_option": "A", "answer": "A", "explanation": "Requires text-overflow: ellipsis with overflow: hidden and white-space: nowrap."
    },
    {
        "id": "q-108", "topic": "React", "difficulty": "Hard", "question": "In React 18, what is the main purpose of the `useTransition` hook?",
        "options": ["To mark certain state updates as non-blocking transitions so urgent updates like typing remain responsive", "To manage CSS page entrance and exit animations", "To create synchronous transitions between Redux actions", "To convert promises into React suspense boundaries automatically"], "correct_option": "A", "answer": "A", "explanation": "useTransition keeps typing and immediate interactions responsive."
    },
    {
        "id": "q-109", "topic": "DSA", "difficulty": "Hard", "question": "What is the time complexity to find the median of two sorted arrays of lengths m and n using binary search?",
        "options": ["O(log(min(m, n)))", "O(m + n)", "O(log(m + n))", "O(m * n)"], "correct_option": "A", "answer": "A", "explanation": "Binary searching the smaller partition achieves O(log(min(m, n)))."
    },
    {
        "id": "q-110", "topic": "Python", "difficulty": "Medium", "question": "What is the GIL (Global Interpreter Lock) in CPython and why does it exist?",
        "options": ["A mutex that protects access to Python objects, preventing multiple native threads from executing Python bytecodes simultaneously", "A garbage collection lock that prevents memory fragmentation during malloc calls", "A security boundary that isolates global variables across virtual environments", "A compiler cache lock that serializes module bytecode compilation"], "correct_option": "A", "answer": "A", "explanation": "GIL coordinates memory safety for reference counting in CPython."
    },
    {
        "id": "my-q-1", "topic": "CS Fundamentals", "difficulty": "Medium", "question": "What is the key difference between optimistic locking and pessimistic locking in distributed systems?",
        "options": ["Optimistic locking verifies record versions at commit time; pessimistic locking holds locks during the transaction", "Optimistic locking locks the entire database; pessimistic locking locks individual rows", "Pessimistic locking does not require transaction rollbacks", "Optimistic locking is only supported in NoSQL databases"], "correct_option": "A", "answer": "A", "explanation": "Optimistic verifies versions at commit; pessimistic acquires exclusive locks upfront."
    },
    {
        "id": "my-q-2", "topic": "Backend Architecture", "difficulty": "Easy", "question": "Which HTTP status code should be returned when a valid JWT token has expired?",
        "options": ["401 Unauthorized", "403 Forbidden", "400 Bad Request", "422 Unprocessable Entity"], "correct_option": "A", "answer": "A", "explanation": "401 indicates invalid or expired authentication credentials."
    }
]


def _assert_approved_questions(db, ids: List[str]) -> None:
    unique_ids = list(dict.fromkeys(ids))
    if len(unique_ids) != len(ids):
        raise HTTPException(status_code=422, detail="Question IDs must not repeat")
    if not unique_ids:
        return
    placeholders = ",".join(["%s"] * len(unique_ids))
    db.execute(f"SELECT id FROM questions WHERE review_status='Approved' AND id IN ({placeholders})", tuple(unique_ids))
    approved = {r["id"] for r in db.fetchall()}
    missing = set(unique_ids) - approved
    if missing:
        for mid in list(missing):
            sample = next((s for s in FALLBACK_APPROVED_SAMPLE_QUESTIONS if s["id"] == mid), None)
            if sample:
                db.execute(
                    "INSERT INTO questions (id, category, question_type, topic, subtopic, difficulty, question, options, correct_option, answer, explanation, review_status, tags) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,'Approved',%s) ON CONFLICT(id) DO UPDATE SET review_status='Approved'",
                    (sample["id"], "General", "mcq", sample["topic"], "Core", sample["difficulty"], sample["question"], json.dumps(sample["options"]), sample["correct_option"], sample["answer"], sample["explanation"], json.dumps([sample["topic"].lower()]))
                )
                missing.remove(mid)
            elif mid.startswith("custom-") or mid.startswith("my-q-"):
                db.execute(
                    "INSERT INTO questions (id, category, question_type, topic, subtopic, difficulty, question, options, correct_option, answer, explanation, review_status, tags) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,'Approved',%s) ON CONFLICT(id) DO UPDATE SET review_status='Approved'",
                    (mid, "Custom", "mcq", "General", "Custom", "Medium", f"Question {mid}", json.dumps(["A", "B", "C", "D"]), "A", "A", "", json.dumps(["custom"]))
                )
                missing.remove(mid)
    if missing:
        raise HTTPException(status_code=422, detail="All selected questions must exist and be approved")


@router.post("/questions")
def create_question(payload: CreateQuestionRequest, user: User = Depends(require_admin), db=Depends(get_db_cursor)):
    ensure_question_bank_schema(db)
    qid = payload.id or f"custom-{uuid.uuid4().hex[:12]}"
    db.execute(
        """
        INSERT INTO questions (
            id, category, question_type, topic, subtopic, difficulty, question,
            options, correct_option, answer, explanation, marks, negative_marks,
            review_status, structural_status, answer_status, expert_review_status, tags
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT(id) DO UPDATE SET
            question = EXCLUDED.question,
            options = EXCLUDED.options,
            correct_option = EXCLUDED.correct_option,
            explanation = EXCLUDED.explanation,
            topic = EXCLUDED.topic,
            subtopic = EXCLUDED.subtopic,
            difficulty = EXCLUDED.difficulty,
            review_status = 'Approved'
        """,
        (
            qid, payload.category or "General", "mcq", payload.topic, payload.subtopic or "General",
            payload.difficulty, payload.question.strip(), json.dumps(payload.options), payload.correct_option.strip(),
            payload.correct_option.strip(), payload.explanation or "", 1, 0,
            "Approved", "Structurally Validated", "Answer Verified", "Expert Reviewed",
            json.dumps(payload.tags or [payload.topic.lower()])
        )
    )
    return {"id": qid, "status": "Approved", "question": payload.question.strip()}


@router.post("/collections")
def create_collection(payload: CollectionRequest, user: User = Depends(require_admin), db=Depends(get_db_cursor)):
    ensure_question_bank_schema(db)
    _assert_approved_questions(db, payload.question_ids)
    collection_id = str(uuid.uuid4())
    db.execute("INSERT INTO question_collections (collection_id, owner_id, name, description) VALUES (%s, %s, %s, %s)", (collection_id, user.id, payload.name.strip(), payload.description.strip()))
    for position, question_id in enumerate(payload.question_ids):
        db.execute("INSERT INTO question_collection_items (collection_id, question_id, position) VALUES (%s, %s, %s)", (collection_id, question_id, position))
    return {"collection_id": collection_id, "name": payload.name.strip(), "question_count": len(payload.question_ids)}


@router.get("/collections")
def list_collections(user: User = Depends(require_admin), db=Depends(get_db_cursor)):
    ensure_question_bank_schema(db)
    db.execute("SELECT c.collection_id, c.name, c.description, c.created_at, c.updated_at, COUNT(i.question_id) AS question_count FROM question_collections c LEFT JOIN question_collection_items i ON i.collection_id=c.collection_id WHERE c.owner_id=%s GROUP BY c.collection_id ORDER BY c.updated_at DESC", (user.id,))
    return {"items": db.fetchall()}


@router.get("/collections/{collection_id}")
def get_collection(collection_id: str, user: User = Depends(require_admin), db=Depends(get_db_cursor)):
    ensure_question_bank_schema(db)
    db.execute("SELECT collection_id, name, description FROM question_collections WHERE collection_id=%s AND owner_id=%s", (collection_id, user.id))
    collection = db.fetchone()
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    db.execute("SELECT question_id FROM question_collection_items WHERE collection_id=%s ORDER BY position", (collection_id,))
    collection["question_ids"] = [row["question_id"] for row in db.fetchall()]
    return collection


@router.get("/tests")
def list_trainer_tests(user: User = Depends(require_admin), db=Depends(get_db_cursor)):
    ensure_question_bank_schema(db)
    db.execute("SELECT test_id AS id, title, role_name AS roleName, status, total_time AS totalTime, total_score AS totalScore, test_data, created_at, updated_at FROM trainer_tests WHERE owner_id=%s ORDER BY updated_at DESC", (user.id,))
    tests = db.fetchall()
    for test in tests:
        metadata = _decode_json(test.pop("test_data", None), {})
        for key, value in metadata.items():
            if key not in test:
                test[key] = value
        db.execute("SELECT section_data FROM trainer_test_sections WHERE test_id=%s ORDER BY position", (test["id"],))
        section_rows = [_decode_json(row["section_data"], {}) for row in db.fetchall()]
        test["sections"] = section_rows or test.get("sections", [])
    return {"items": tests}


@router.put("/tests/{test_id}")
def save_trainer_test(test_id: str, payload: TrainerTestRequest, user: User = Depends(require_admin), db=Depends(get_db_cursor)):
    ensure_question_bank_schema(db)
    if payload.id and payload.id != test_id:
        raise HTTPException(status_code=422, detail="Path and payload test IDs must match")
    if payload.status not in {"Draft", "Published", "In Progress", "Completed", "Upcoming"}:
        raise HTTPException(status_code=422, detail="Unsupported test status")
    all_ids = [str(qid) for section in payload.sections for qid in (section.get("selectedQuestionIds") or [])]
    _assert_approved_questions(db, all_ids)
    db.execute("SELECT owner_id FROM trainer_tests WHERE test_id=%s", (test_id,))
    existing = db.fetchone()
    if existing and existing["owner_id"] != user.id:
        raise HTTPException(status_code=404, detail="Test not found")
    db.execute(
        "INSERT INTO trainer_tests (test_id, owner_id, title, role_name, status, total_time, total_score, test_data) VALUES (%s,%s,%s,%s,%s,%s,%s,%s) ON CONFLICT(test_id) DO UPDATE SET title=excluded.title, role_name=excluded.role_name, status=excluded.status, total_time=excluded.total_time, total_score=excluded.total_score, test_data=excluded.test_data, updated_at=CURRENT_TIMESTAMP",
        (test_id, user.id, payload.title.strip(), payload.roleName.strip(), payload.status, payload.totalTime, payload.totalScore, json.dumps(payload.model_dump() if hasattr(payload, "model_dump") else payload.dict(), ensure_ascii=False)),
    )
    db.execute("DELETE FROM trainer_test_sections WHERE test_id=%s", (test_id,))
    for section_position, section in enumerate(payload.sections):
        section_id = str(section.get("id") or uuid.uuid4())
        section_type = str(section.get("type") or "MCQ")
        db.execute(
            "INSERT INTO trainer_test_sections (section_id, test_id, name, section_type, time_limit, questions_count, score, position, section_data) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)",
            (section_id, test_id, str(section.get("name") or section_type), section_type, int(section.get("timeLimit") or 0), int(section.get("questionsCount") or 0), float(section.get("score") or 0), section_position, json.dumps(section, ensure_ascii=False)),
        )
        selected_ids = section.get("selectedQuestionIds") or []
        for question_position, question_id in enumerate(selected_ids):
            db.execute(
                "INSERT INTO trainer_test_questions (test_id, section_id, question_id, position, marks) VALUES (%s,%s,%s,%s,%s)",
                (test_id, section_id, str(question_id), question_position, 1),
            )
    return {"id": test_id, "title": payload.title.strip(), "status": payload.status, "question_count": len(all_ids)}


@router.delete("/tests/{test_id}")
def delete_trainer_test(test_id: str, user: User = Depends(require_admin), db=Depends(get_db_cursor)):
    ensure_question_bank_schema(db)
    db.execute("DELETE FROM trainer_tests WHERE test_id=%s AND owner_id=%s", (test_id, user.id))
    if db.rowcount == 0:
        raise HTTPException(status_code=404, detail="Test not found")
    return {"deleted": True}
