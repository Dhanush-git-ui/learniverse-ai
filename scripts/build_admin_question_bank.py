"""Build the admin-panel bundle from the repository's source question set.

Records are imported only when the supplied answer matches exactly one of the
four options and the question has a usable explanation. The script never
connects to a database and does not alter the source file.
"""

from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "questions.json"
OUTPUT = ROOT / "src" / "data" / "admin_question_bank.json"


def normalize(value: object) -> str:
    return re.sub(r"\s+", " ", str(value or "").strip()).casefold()


def display_text(value: object) -> str:
    return str(value or "").replace("\ufffd", "×").strip()


def map_category(source_category: str, topic: str) -> str:
    category = source_category.casefold()
    topic_key = topic.casefold()
    if "abstract reasoning" in category or "logical reasoning" in category:
        return "Logical Reasoning"
    if "data interpretation" in category or "quantitative aptitude" in category:
        return "Quantitative Aptitude"
    if "verbal ability" in category or category == "verbal":
        return "Verbal Ability"
    if "technical aptitude" in category:
        if "ai/ml" in topic_key or "ai ml" in topic_key:
            return "Artificial Intelligence and Machine Learning"
        if "database" in topic_key or "sql" in topic_key:
            return "DBMS and SQL"
        if "operating system" in topic_key:
            return "Operating Systems"
        if "network" in topic_key:
            return "Computer Networks"
        if "algorithm" in topic_key or "data structure" in topic_key:
            return "Data Structures and Algorithms"
        if "programming" in topic_key:
            return "Programming and Coding"
        return "Computer Fundamentals"
    return source_category


def build() -> tuple[list[dict], dict]:
    source = json.loads(SOURCE.read_text(encoding="utf-8"))
    records: list[dict] = []
    seen_stems: set[str] = set()
    rejected = Counter()

    for row in source:
        stem = display_text(row.get("question"))
        options = row.get("options")
        answer = display_text(row.get("answer"))
        explanation = display_text(row.get("solution"))
        if not stem:
            rejected["missing_stem"] += 1
            continue
        if not isinstance(options, list) or len(options) != 4 or len({normalize(x) for x in options}) != 4:
            rejected["invalid_options"] += 1
            continue
        matches = [i for i, option in enumerate(options) if normalize(option) == normalize(answer)]
        if len(matches) != 1:
            rejected["answer_not_unique_option"] += 1
            continue
        if not explanation:
            rejected["missing_explanation"] += 1
            continue
        stem_key = normalize(stem)
        if stem_key in seen_stems:
            rejected["duplicate_stem"] += 1
            continue
        seen_stems.add(stem_key)

        correct_index = matches[0]
        correct_letter = chr(ord("A") + correct_index)
        topic = str(row.get("topic") or "General")
        source_category = str(row.get("category_label") or row.get("category") or "General")
        category = map_category(source_category, topic)
        difficulty = str(row.get("difficulty") or "intermediate").casefold()
        difficulty = {"basic": "Easy", "intermediate": "Medium", "advanced": "Hard"}.get(difficulty, "Medium")
        source_repo = str(row.get("source_repo") or "")
        source_file = str(row.get("source_file") or "")
        source_ref = f"{source_repo}/{source_file}".strip("/")

        # Keep the source explanation intact and give each option an explicit
        # rationale without inventing extra technical claims.
        option_explanations = [
            (f"Correct. {explanation}" if i == correct_index else
             f"Incorrect. The source marks {correct_letter} ({options[correct_index]}) as the answer. {explanation}")
            for i in range(4)
        ]
        records.append({
            "id": str(row.get("id") or f"source-q-{len(records) + 1:05d}"),
            "prompt": stem,
            "options": [display_text(option) for option in options],
            "correctAnswer": correct_letter,
            "answer": answer,
            "explanation": explanation,
            "optionExplanations": option_explanations,
            "category": category,
            "topic": topic,
            "subTopic": topic,
            "difficulty": difficulty,
            "questionType": "MCQ",
            "tags": ", ".join([category, topic]),
            "company": None,
            "role": None,
            "provenance": "Source-Verified Practice Question",
            "source": source_ref,
            "verificationStatus": "Answer matches exactly one option; source explanation present; semantic review not independently performed",
            "reviewStatus": "Pending Review",
            "structuralStatus": "Structurally Validated",
            "answerStatus": "Unverified",
            "sourceStatus": "Repository Source Recorded",
            "expertReviewStatus": "Pending",
            "verificationEvidence": "Four distinct options; supplied answer matches exactly one option; source explanation is present. This does not independently establish factual correctness.",
        })

    records.sort(key=lambda q: q["id"])
    meta = {
        "source": "questions.json",
        "source_count": len(source),
        "accepted_count": len(records),
        "rejected_count": dict(rejected),
        "unique_topics": len({q["topic"] for q in records}),
        "unique_categories": len({q["category"] for q in records}),
        "review_status": "Pending Review",
    }
    return records, meta


if __name__ == "__main__":
    records, metadata = build()
    OUTPUT.write_text(json.dumps({"metadata": metadata, "questions": records}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(metadata, ensure_ascii=False, indent=2))
