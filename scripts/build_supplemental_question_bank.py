"""Convert unused, structurally valid questions from the existing TS corpus.

Records already present in the persisted DB or main bundle are skipped. Every
record is marked Pending Review: this script checks schema/answer alignment,
not factual correctness or the quality of each distractor rationale.
"""
from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src" / "data" / "assessmentQuestions.ts"
MAIN_BUNDLE = ROOT / "src" / "data" / "admin_question_bank.json"
OUTPUT = ROOT / "src" / "data" / "admin_supplemental_question_bank.json"

ARRAY_START = re.compile(r"^export const (\w+)\s*=\s*\[", re.M)


def extract_arrays(text: str):
    for match in ARRAY_START.finditer(text):
        start = match.end() - 1
        depth, quote, escaped, end = 0, None, False, None
        for index in range(start, len(text)):
            char = text[index]
            if quote:
                if escaped:
                    escaped = False
                elif char == "\\":
                    escaped = True
                elif char == quote:
                    quote = None
                continue
            if char in ('"', "'"):
                quote = char
            elif char == "[":
                depth += 1
            elif char == "]":
                depth -= 1
                if depth == 0:
                    end = index + 1
                    break
        if end:
            try:
                records = json.loads(text[start:end])
            except json.JSONDecodeError:
                continue
            for record in records:
                yield match.group(1), record


def normalize(value: str) -> str:
    return re.sub(r"\s+", " ", str(value or "").strip().casefold())


def category_for(source_name: str, source_category: str) -> str:
    if source_name == "NORMAL_APTITUDE_QUESTIONS":
        return "Quantitative Aptitude"
    if source_name == "NORMAL_VERBAL_QUESTIONS":
        return "Verbal Ability"
    if source_name == "NORMAL_COMPUTER_FUNDAMENTALS_QUESTIONS":
        return "Computer Fundamentals"
    if source_name == "AI_ENGINEER_QUESTIONS":
        return "Artificial Intelligence and Machine Learning"
    if source_name == "DEVOPS_QUESTIONS":
        return "Cloud Computing and DevOps"
    if source_name == "BACKEND_FULLSTACK_QUESTIONS":
        return "Web Development"
    if source_name == "REACT_NATIVE_QUESTIONS":
        return "Mobile Development"
    return source_category or "Computer Fundamentals"


def role_for(source_role: str) -> str | None:
    return {
        "AI Engineer Intern": "AI/ML Engineer",
        "Backend & Full Stack Intern": "Backend Developer",
        "Mobile App Developer Intern": "Mobile App Developer",
    }.get(source_role)


def build() -> dict:
    used_ids = set()
    used_stems = set()
    if MAIN_BUNDLE.exists():
        main = json.loads(MAIN_BUNDLE.read_text(encoding="utf-8"))
        used_ids.update(str(q["id"]) for q in main.get("questions", []))
        used_stems.update(normalize(q.get("prompt", "")) for q in main.get("questions", []))
    # Compare against the canonical base bundle; imports themselves are
    # idempotent and preserve approval state in the database.
    rows = list(extract_arrays(SOURCE.read_text(encoding="utf-8")))
    accepted, rejected = [], Counter()
    for source_name, row in rows:
        stem = str(row.get("question") or "").strip()
        options = row.get("options")
        answer = str(row.get("correct_option") or "").strip().upper()
        normalized_stem = normalize(stem)
        record_id = f"supp-{source_name.casefold()}-{row.get('id', '')}"
        if not stem or not row.get("explanation"):
            rejected["missing_statement_or_explanation"] += 1
            continue
        if not isinstance(options, list) or len(options) != 4 or len({normalize(str(value)) for value in options}) != 4:
            rejected["invalid_four_option_set"] += 1
            continue
        if answer not in {"A", "B", "C", "D"}:
            rejected["invalid_correct_option"] += 1
            continue
        if normalized_stem in used_stems:
            rejected["exact_duplicate_stem"] += 1
            continue
        if record_id in used_ids:
            rejected["duplicate_id"] += 1
            continue

        correct_index = ord(answer) - ord("A")
        correct_text = str(options[correct_index])
        explanation = str(row["explanation"]).strip()
        role = role_for(str(row.get("role") or ""))
        source_tags = row.get("tags") or [source_name]
        if isinstance(source_tags, str):
            source_tags = [tag.strip() for tag in source_tags.split(",") if tag.strip()]
        option_explanations = []
        for index, option in enumerate(options):
            if index == correct_index:
                option_explanations.append(f"Correct. {explanation}")
            else:
                option_explanations.append(
                    f"Pending reviewer rationale: explain why {option!r} is wrong. "
                    f"The source's explanation supports option {answer} ({correct_text!r}): {explanation}"
                )

        category = category_for(source_name, str(row.get("category") or ""))
        difficulty = str(row.get("difficulty") or "Medium").strip().casefold()
        difficulty = {"basic": "Easy", "beginner": "Easy", "intermediate": "Medium", "advanced": "Hard"}.get(difficulty, difficulty.title())
        record = {
            "id": record_id, "prompt": stem, "options": [str(value) for value in options],
            "correctAnswer": answer, "answer": correct_text, "explanation": explanation,
            "optionExplanations": option_explanations, "category": category,
            "topic": str(row.get("topic") or source_category_name(source_name)),
            "subTopic": str(row.get("topic") or source_category_name(source_name)),
            "difficulty": difficulty, "questionType": "MCQ", "tags": source_tags,
            "company": None, "role": role, "provenance": "Source-Verified Practice Question",
            "source": f"src/data/assessmentQuestions.ts#{source_name}/{row.get('id', '')}",
            "verificationStatus": "Four-option and answer-letter alignment checks passed; factual answer and distractor rationales not independently verified",
            "reviewStatus": "Pending Review",
            "structuralStatus": "Needs Revision",
            "answerStatus": "Unverified",
            "sourceStatus": "Repository Source Recorded",
            "expertReviewStatus": "Pending",
            "verificationEvidence": "The supplied answer letter matches one option; per-distractor explanations are placeholders and need reviewer completion.",
            "associations": ([{"company": "", "role": role}] if role else []),
        }
        # A role without a company is not a company-role association; preserve
        # the role in tags until the importer links supported role metadata.
        record["associations"] = []
        record["tags"] = ([*record["tags"], f"role:{role}"] if role else record["tags"])
        accepted.append(record)
        used_ids.add(record_id)
        used_stems.add(normalized_stem)

    return {"metadata": {"source": str(SOURCE.relative_to(ROOT)), "records_seen": len(rows), "accepted_count": len(accepted), "rejected_count": dict(rejected), "review_status": "Pending Review"}, "questions": accepted}


def source_category_name(name: str) -> str:
    return name.removesuffix("_QUESTIONS").replace("_", " ").title()


if __name__ == "__main__":
    bundle = build()
    OUTPUT.write_text(json.dumps(bundle, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(bundle["metadata"], ensure_ascii=False, indent=2))
