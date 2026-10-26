"""Idempotently import the admin question bundle into the placement DB."""

from __future__ import annotations

import argparse
import json
import os
import re
import sqlite3
import sys
from pathlib import Path

from dotenv import load_dotenv


ROOT = Path(__file__).resolve().parents[1]
BACKEND = ROOT / "backend"
LOCAL_DB = BACKEND / "placement_assessment_system" / "assessment_local.db"
BUNDLE = ROOT / "src" / "data" / "admin_question_bank.json"
CODING_BUNDLE = ROOT / "src" / "data" / "admin_coding_question_bank.json"
SUPPLEMENTAL_BUNDLE = ROOT / "src" / "data" / "admin_supplemental_question_bank.json"
COMPANY_BUNDLE = ROOT / "src" / "data" / "admin_company_practice_batch_001.json"
GENERATED_BUNDLE = ROOT / "src" / "data" / "admin_generated_batch_001.json"
CATEGORIES = [
    "Quantitative Aptitude", "Logical Reasoning", "Verbal Ability", "Computer Fundamentals",
    "Programming and Coding", "Core Computer Science", "Data Structures and Algorithms",
    "DBMS and SQL", "Operating Systems", "Computer Networks", "Object-Oriented Programming",
    "Software Engineering", "Web Development", "Artificial Intelligence and Machine Learning",
    "Cloud Computing and DevOps", "Cybersecurity", "System Design", "Mobile Development",
]
COMPANIES = ["TCS", "Infosys", "Wipro", "Accenture", "Cognizant", "Capgemini", "HCLTech", "Tech Mahindra", "Deloitte", "IBM", "LTIMindtree", "Amazon", "Microsoft", "Google", "Oracle", "Salesforce", "Walmart Global Tech", "Flipkart", "Zoho", "Freshworks"]
ROLES = ["Software Engineer", "Graduate Engineer Trainee", "Frontend Developer", "Backend Developer", "Full-Stack Developer", "Data Analyst", "AI/ML Engineer", "Mobile App Developer"]


def slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.strip().casefold()).strip("-")


def _json_or_none(value):
    return json.dumps(value, ensure_ascii=False) if value is not None else None


def import_bundle(db, bundle: dict, source_batches: list[dict] | None = None) -> tuple[int, int]:
    from placement_assessment_system.question_bank_admin import ensure_question_bank_schema

    ensure_question_bank_schema(db)
    inserted_or_updated = 0
    associations_added = 0
    for category in CATEGORIES:
        db.execute("INSERT INTO question_categories (name) VALUES (%s) ON CONFLICT(name) DO NOTHING", (category,))
    for batch in source_batches or []:
        db.execute(
            "INSERT INTO question_import_batches (batch_id, source, attempted_count, upserted_count, review_status, imported_at) VALUES (%s,%s,%s,%s,%s,CURRENT_TIMESTAMP) ON CONFLICT(batch_id) DO UPDATE SET source=excluded.source, attempted_count=excluded.attempted_count, upserted_count=excluded.upserted_count, review_status=excluded.review_status, imported_at=CURRENT_TIMESTAMP",
            (batch["batch_id"], batch["source"], batch["attempted_count"], batch["upserted_count"], batch["review_status"]),
        )
    for company in COMPANIES:
        db.execute("INSERT INTO question_companies (slug, name) VALUES (%s,%s) ON CONFLICT(slug) DO NOTHING", (slug(company), company))
    for role in ROLES:
        db.execute("INSERT INTO question_roles (slug, name) VALUES (%s,%s) ON CONFLICT(slug) DO NOTHING", (slug(role), role))
    for q in bundle["questions"]:
        category = str(q.get("category") or "General")
        topic = str(q.get("topic") or "General")
        tags = q.get("tags") or []
        if isinstance(tags, str):
            tags = [part.strip() for part in tags.split(",") if part.strip()]
        db.execute("INSERT INTO question_categories (name) VALUES (%s) ON CONFLICT(name) DO NOTHING", (category,))
        db.execute("INSERT INTO question_topics (category, topic) VALUES (%s, %s) ON CONFLICT(category, topic) DO NOTHING", (category, topic))
        db.execute(
            """INSERT INTO questions (
                id, category, question_type, topic, subtopic, difficulty, question, options,
                correct_option, answer, explanation, marks, negative_marks, estimated_time,
                tags, generator_version, option_explanations, source, provenance,
                verification_status, review_status, input_format, output_format,
                constraints_text, sample_explanation, test_cases, reference_solution,
                time_complexity, space_complexity, supported_languages, structural_status,
                answer_status, source_status, expert_review_status, verification_evidence
            ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            ON CONFLICT(id) DO UPDATE SET
                category=excluded.category, question_type=excluded.question_type, topic=excluded.topic,
                subtopic=excluded.subtopic, difficulty=excluded.difficulty, question=excluded.question,
                options=excluded.options, correct_option=excluded.correct_option, answer=excluded.answer,
                explanation=excluded.explanation, tags=excluded.tags, option_explanations=excluded.option_explanations,
                source=excluded.source, provenance=excluded.provenance, verification_status=excluded.verification_status,
                review_status=CASE WHEN EXISTS (SELECT 1 FROM question_review_events ev WHERE ev.question_id=questions.id) THEN questions.review_status ELSE excluded.review_status END,
                input_format=excluded.input_format, output_format=excluded.output_format,
                constraints_text=excluded.constraints_text, sample_explanation=excluded.sample_explanation,
                test_cases=excluded.test_cases, reference_solution=excluded.reference_solution,
                time_complexity=excluded.time_complexity, space_complexity=excluded.space_complexity,
                supported_languages=excluded.supported_languages, generator_version=excluded.generator_version,
                structural_status=CASE WHEN EXISTS (SELECT 1 FROM question_review_events ev WHERE ev.question_id=questions.id) THEN questions.structural_status ELSE excluded.structural_status END,
                answer_status=CASE WHEN EXISTS (SELECT 1 FROM question_review_events ev WHERE ev.question_id=questions.id) THEN questions.answer_status ELSE excluded.answer_status END,
                source_status=CASE WHEN EXISTS (SELECT 1 FROM question_review_events ev WHERE ev.question_id=questions.id) THEN questions.source_status ELSE excluded.source_status END,
                expert_review_status=CASE WHEN EXISTS (SELECT 1 FROM question_review_events ev WHERE ev.question_id=questions.id) THEN questions.expert_review_status ELSE excluded.expert_review_status END,
                verification_evidence=CASE WHEN EXISTS (SELECT 1 FROM question_review_events ev WHERE ev.question_id=questions.id) THEN questions.verification_evidence ELSE excluded.verification_evidence END""",
            (
                q["id"], category, str(q.get("questionType") or "MCQ").casefold(), topic,
                q.get("subTopic") or topic, q.get("difficulty") or "Medium", q["prompt"],
                q.get("options") or [], q.get("correctAnswer"), q.get("answer"), q.get("explanation"),
                int(q.get("marks") or 1), float(q.get("negativeMarks") or 0), int(q.get("estimatedTime") or 90),
                tags, "admin-question-bank-v1", q.get("optionExplanations") or [], q.get("source"),
                q.get("provenance") or "AI-Generated Practice Question", q.get("verificationStatus"),
                q.get("reviewStatus") or "Pending Review", q.get("inputFormat"), q.get("outputFormat"),
                q.get("constraints"), q.get("sampleExplanation"), _json_or_none(q.get("testCases")),
                _json_or_none(q.get("referenceSolution")), q.get("timeComplexity"), q.get("spaceComplexity"),
                _json_or_none(q.get("supportedLanguages")), q.get("structuralStatus") or "Not Checked",
                q.get("answerStatus") or "Unverified", q.get("sourceStatus") or ("Repository Source Recorded" if q.get("source") else "Unverified"),
                q.get("expertReviewStatus") or "Pending", q.get("verificationEvidence"),
            ),
        )
        inserted_or_updated += 1

        role_name = str(q.get("role") or "").strip()
        if role_name:
            role_slug = slug(role_name)
            db.execute("INSERT INTO question_roles (slug, name) VALUES (%s,%s) ON CONFLICT(slug) DO NOTHING", (role_slug, role_name))
            db.execute(
                "INSERT INTO question_role_links (question_id, role_slug, provenance, source) VALUES (%s,%s,%s,%s) ON CONFLICT(question_id, role_slug) DO NOTHING",
                (q["id"], role_slug, q.get("provenance") or "Source-Verified Practice Question", q.get("source")),
            )

        for assoc in q.get("associations") or []:
            company = str(assoc.get("company") or "").strip()
            role = str(assoc.get("role") or "").strip()
            if not company or not role:
                continue
            company_slug, role_slug = slug(company), slug(role)
            db.execute("INSERT INTO question_companies (slug, name) VALUES (%s,%s) ON CONFLICT(slug) DO NOTHING", (company_slug, company))
            db.execute("INSERT INTO question_roles (slug, name) VALUES (%s,%s) ON CONFLICT(slug) DO NOTHING", (role_slug, role))
            db.execute(
                "INSERT INTO question_company_roles (question_id, company_slug, role_slug, recruitment_stage, provenance, source) VALUES (%s,%s,%s,%s,%s,%s) ON CONFLICT(question_id, company_slug, role_slug, recruitment_stage) DO NOTHING",
                (q["id"], company_slug, role_slug, assoc.get("recruitmentStage") or "General Practice", assoc.get("provenance") or q.get("provenance") or "AI-Generated Practice Question", assoc.get("source") or q.get("source")),
            )
            associations_added += 1
    db.execute("DELETE FROM question_topics WHERE NOT EXISTS (SELECT 1 FROM questions q WHERE q.category=question_topics.category AND q.topic=question_topics.topic)")
    db.execute("DELETE FROM question_categories WHERE NOT EXISTS (SELECT 1 FROM questions q WHERE q.category=question_categories.name)")
    for category in CATEGORIES:
        db.execute("INSERT INTO question_categories (name) VALUES (%s) ON CONFLICT(name) DO NOTHING", (category,))
    return inserted_or_updated, associations_added


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--local-sqlite", action="store_true", help="use the existing local SQLite database")
    parser.add_argument("--bundle", type=Path, default=BUNDLE)
    parser.add_argument("--coding-bundle", type=Path, default=CODING_BUNDLE)
    parser.add_argument("--supplemental-bundle", type=Path, default=SUPPLEMENTAL_BUNDLE)
    parser.add_argument("--company-bundle", type=Path, default=COMPANY_BUNDLE)
    parser.add_argument("--generated-bundle", type=Path, default=GENERATED_BUNDLE)
    args = parser.parse_args()
    bundle = json.loads(args.bundle.read_text(encoding="utf-8"))
    base_metadata = bundle.get("metadata") or {}
    source_batches = [{
        "batch_id": base_metadata.get("batch_id") or "admin-question-bank-main-v1",
        "source": str(base_metadata.get("source") or args.bundle.name),
        "attempted_count": int(base_metadata.get("source_count") or base_metadata.get("records_seen") or len(bundle["questions"])),
        "upserted_count": len(bundle["questions"]),
        "review_status": str(base_metadata.get("review_status") or "Pending Review"),
    }]
    base_ids = {str(q["id"]) for q in bundle["questions"]}
    for additional_path in (args.coding_bundle, args.supplemental_bundle, args.company_bundle, args.generated_bundle):
        if additional_path.exists():
            additional = json.loads(additional_path.read_text(encoding="utf-8"))
            collision_ids = [q["id"] for q in additional["questions"] if str(q["id"]) in base_ids]
            if collision_ids:
                raise ValueError(f"{additional_path.name} contains colliding question IDs: {collision_ids[:5]}")
            bundle["questions"].extend(additional["questions"])
            base_ids.update(str(q["id"]) for q in additional["questions"])
            metadata = additional.get("metadata") or {}
            source_batches.append({
                "batch_id": metadata.get("batch_id") or additional_path.stem.replace("admin_", "") + "-v1",
                "source": str(metadata.get("source") or additional_path.name),
                "attempted_count": int(metadata.get("source_count") or metadata.get("records_seen") or len(additional["questions"])),
                "upserted_count": len(additional["questions"]),
                "review_status": str(metadata.get("review_status") or "Pending Review"),
            })
    sys.path.insert(0, str(BACKEND))

    if args.local_sqlite:
        from placement_assessment_system.api import SQLiteCursorAdapter
        connection = sqlite3.connect(LOCAL_DB)
        try:
            connection.row_factory = sqlite3.Row
            db = SQLiteCursorAdapter(connection)
            counts = import_bundle(db, bundle, source_batches)
            connection.commit()
        except Exception:
            connection.rollback()
            raise
        finally:
            connection.close()
    else:
        import psycopg2
        from psycopg2.extras import RealDictCursor
        from placement_assessment_system.api import PostgresCursorAdapter

        load_dotenv(BACKEND / ".env", override=False)
        database_url = os.environ.get("DATABASE_URL")
        if not database_url:
            raise RuntimeError("DATABASE_URL is not configured; use --local-sqlite for local development")
        connection = psycopg2.connect(database_url, connect_timeout=8)
        try:
            db = PostgresCursorAdapter(connection.cursor(cursor_factory=RealDictCursor), connection)
            counts = import_bundle(db, bundle, source_batches)
            connection.commit()
        except Exception:
            connection.rollback()
            raise
        finally:
            connection.close()

    print(f"Imported/upserted records: {counts[0]}")
    print(f"Company-role links processed: {counts[1]}")
    print(f"Bundle records: {len(bundle['questions'])}")


if __name__ == "__main__":
    main()
