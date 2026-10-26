"""Produce a reproducible quality/count audit of the persisted local bank."""
from __future__ import annotations

import json
import re
import sqlite3
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DB = ROOT / "backend" / "placement_assessment_system" / "assessment_local.db"
OUTPUT = ROOT / "src" / "data" / "admin_question_bank_audit.json"


def norm(text: str) -> str:
    return re.sub(r"\s+", " ", (text or "").strip().casefold())


def trigrams(text: str) -> set[tuple[str, ...]]:
    words = re.findall(r"\w+", text.casefold())
    return {tuple(words[i:i + 3]) for i in range(max(1, len(words) - 2))}


def audit() -> dict:
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    questions = [dict(r) for r in conn.execute("SELECT * FROM questions ORDER BY id")]
    category_counts = dict(conn.execute("SELECT category, COUNT(*) FROM questions GROUP BY category ORDER BY category").fetchall())
    topic_counts = {f"{category} / {topic}": count for category, topic, count in conn.execute("SELECT category, topic, COUNT(*) FROM questions GROUP BY category, topic ORDER BY category, topic")}
    company_counts = dict(conn.execute("SELECT c.name, COUNT(DISTINCT a.question_id) FROM question_companies c LEFT JOIN question_company_roles a ON a.company_slug=c.slug GROUP BY c.name ORDER BY c.name").fetchall())
    role_counts = dict(conn.execute("SELECT r.name, COUNT(DISTINCT links.question_id) FROM question_roles r LEFT JOIN (SELECT role_slug, question_id FROM question_role_links UNION SELECT role_slug, question_id FROM question_company_roles) links ON links.role_slug=r.slug GROUP BY r.name ORDER BY r.name").fetchall())
    status_counts = dict(conn.execute("SELECT review_status, COUNT(*) FROM questions GROUP BY review_status ORDER BY review_status").fetchall())
    type_counts = dict(conn.execute("SELECT question_type, COUNT(*) FROM questions GROUP BY question_type ORDER BY question_type").fetchall())
    difficulty_counts = dict(conn.execute("SELECT difficulty, COUNT(*) FROM questions GROUP BY difficulty ORDER BY difficulty").fetchall())
    structural_counts = dict(conn.execute("SELECT structural_status, COUNT(*) FROM questions GROUP BY structural_status ORDER BY structural_status").fetchall())
    answer_counts = dict(conn.execute("SELECT answer_status, COUNT(*) FROM questions GROUP BY answer_status ORDER BY answer_status").fetchall())
    source_status_counts = dict(conn.execute("SELECT source_status, COUNT(*) FROM questions GROUP BY source_status ORDER BY source_status").fetchall())
    expert_counts = dict(conn.execute("SELECT expert_review_status, COUNT(*) FROM questions GROUP BY expert_review_status ORDER BY expert_review_status").fetchall())
    linked = conn.execute("SELECT COUNT(DISTINCT question_id) FROM question_company_roles").fetchone()[0]
    import_batches = [dict(row) for row in conn.execute(
        "SELECT batch_id, source, attempted_count, upserted_count, review_status, imported_at FROM question_import_batches ORDER BY batch_id"
    )]
    conn.close()

    exact: dict[str, list[str]] = defaultdict(list)
    mcq_valid = 0
    coding_complete = 0
    for q in questions:
        exact[norm(q["question"])].append(q["id"])
        if q["question_type"] == "mcq":
            options = json.loads(q.get("options") or "[]")
            option_reasons = json.loads(q.get("option_explanations") or "[]")
            valid = len(options) == 4 and len({norm(str(x)) for x in options}) == 4 and bool(q.get("explanation")) and len(option_reasons) == 4 and all("pending reviewer rationale" not in str(reason).casefold() for reason in option_reasons)
            correct = str(q.get("correct_option") or "")
            valid = valid and correct in {"A", "B", "C", "D"} and norm(str(options[ord(correct) - ord("A")])) == norm(str(q.get("answer") or ""))
            mcq_valid += int(valid)
        elif q["question_type"] == "coding":
            coding_complete += int(all(q.get(k) for k in ("input_format", "output_format", "constraints_text", "sample_explanation", "test_cases", "reference_solution", "time_complexity")))
    duplicate_groups = [ids for ids in exact.values() if len(ids) > 1]

    stems = [(q["id"], norm(q["question"])) for q in questions]
    grams = [trigrams(stem) for _, stem in stems]
    inverted: dict[tuple[str, ...], list[int]] = defaultdict(list)
    for index, values in enumerate(grams):
        for gram in values:
            inverted[gram].append(index)
    pairs: set[tuple[int, int]] = set()
    for indexes in inverted.values():
        if len(indexes) > 1:
            for pos, left in enumerate(indexes):
                for right in indexes[pos + 1:]:
                    if abs(len(stems[left][1]) - len(stems[right][1])) <= 30:
                        pairs.add((left, right))
    near = []
    for left, right in pairs:
        union = grams[left] | grams[right]
        score = len(grams[left] & grams[right]) / len(union) if union else 1
        if score >= 0.80:
            near.append({"question_ids": [stems[left][0], stems[right][0]], "three_word_shingle_jaccard": round(score, 3), "review_status": "Pending Review"})
    near.sort(key=lambda row: (-row["three_word_shingle_jaccard"], row["question_ids"]))
    report = {
        "persisted_question_count": len(questions), "unique_id_count": len({q["id"] for q in questions}),
        "exact_duplicate_groups": duplicate_groups, "near_duplicate_candidates_threshold_0_80": near,
        "mcq_records_passing_structural_checks": mcq_valid,
        "coding_records_with_all_required_fields": coding_complete,
        "questions_by_category": category_counts, "questions_by_topic": topic_counts,
        "questions_by_company": company_counts, "questions_by_role": role_counts,
        "questions_by_review_status": status_counts, "questions_by_type": type_counts,
        "questions_by_difficulty": difficulty_counts,
        "questions_by_structural_status": structural_counts,
        "questions_by_answer_status": answer_counts,
        "questions_by_source_status": source_status_counts,
        "questions_by_expert_review_status": expert_counts,
        "import_batches": import_batches,
        "approved_for_test_use": status_counts.get("Approved", 0),
        "questions_with_nonempty_source_metadata": sum(bool(q.get("source")) for q in questions),
        "questions_with_independently_verified_external_sources": 0,
        "company_role_link_count": linked,
        "reference_solutions_executed_by_this_audit": 0,
        "notes": ["Structural checks do not prove factual correctness.", "Near-duplicate pairs are candidates for human review and were not deleted automatically.", "All imported records remain Pending Review until an authorized reviewer checks them."],
    }
    OUTPUT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return report


if __name__ == "__main__":
    result = audit()
    print(json.dumps({k: v for k, v in result.items() if k not in ("questions_by_topic", "near_duplicate_candidates_threshold_0_80")}, ensure_ascii=False, indent=2))
