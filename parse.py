"""
parse_questions.py

Walks a cloned question-bank repo (Markdown, "N. **Question**: ... **Solution**: ...
**Answer**: ..." format under "## Topic" sections) and emits a single structured
JSON file ready to seed into a DB (Postgres/Prisma, Mongo, whatever).

Usage:
    python3 parse_questions.py <repo_root> <output.json> [--category-map map.json]

Folder convention assumed (matches rohanmistry231/CSE-Aptitude-Test-Practice-Hub):
    <repo_root>/<NN Category Name>/<NN Difficulty>/README.md

Output schema (one row per question):
{
  "id": "quant-basic-percentages-0001",
  "category": "quantitative-aptitude",   # normalized, machine-friendly
  "category_label": "Quantitative Aptitude (Numerical Ability)",
  "topic": "Percentages",                # the ## section heading
  "difficulty": "basic" | "intermediate" | "advanced",
  "question": "What is 25% of 400?",
  "options": ["Scarce", "Plentiful", ...] | null,   # best-effort MCQ extraction
  "answer": "100",
  "solution": "25% of 400 = ...",
  "source_repo": "rohanmistry231/CSE-Aptitude-Test-Practice-Hub",
  "source_file": "01 Quantitative Aptitude .../01 Basic/README.md"
}
"""

import argparse
import json
import re
import sys
from pathlib import Path

QUESTION_BLOCK_RE = re.compile(
    r"\d+\.\s*\*\*Question\*\*:\s*(?P<question>.+?)\s*"
    r"(?:\*\*Options\*\*:\s*(?P<options_line>.+?)\s*)?"
    r"\*\*Solution\*\*:\s*(?P<solution>.+?)\s*"
    r"\*\*Answer\*\*:\s*(?P<answer>.+?)"
    r"(?=\n\s*\d+\.\s*\*\*Question\*\*:|\Z)",
    re.DOTALL,
)

# Best-effort MCQ option extractor: "A) Scarce B) Plentiful C) Limited D) Rare"
# ponytail: ceiling=naive regex pattern matcher for A) B) C) D) options, upgrade=AST or LLM-based structured markdown parser
OPTION_RE = re.compile(r"\b([A-D])\)\s*(.*?)(?=\s+[A-D]\)|$)")

# Folder-name -> normalized category slug. Extend this as you add more repos.
DEFAULT_CATEGORY_MAP = {
    "quantitative aptitude": "quantitative-aptitude",
    "logical reasoning": "logical-reasoning",
    "verbal ability": "verbal-ability",
    "data interpretation": "data-interpretation",
    "abstract reasoning": "abstract-reasoning",
    "technical aptitude": "computer-fundamentals",
}

DIFFICULTY_MAP = {
    "basic": "basic",
    "intermediate": "intermediate",
    "advance": "advanced",
    "advanced": "advanced",
}


def normalize_ws(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip()


def strip_numbering_prefix(folder_name: str) -> str:
    # "01 Quantitative Aptitude (Numerical Ability)" -> "Quantitative Aptitude (Numerical Ability)"
    return re.sub(r"^\d+\s*", "", folder_name).strip()


def slugify_category(label: str) -> str:
    key = label.lower()
    for needle, slug in DEFAULT_CATEGORY_MAP.items():
        if needle in key:
            return slug
    return re.sub(r"[^a-z0-9]+", "-", key).strip("-")


def extract_options(question_text: str):
    matches = OPTION_RE.findall(question_text)
    if len(matches) < 2:
        return question_text, None
    options = [normalize_ws(text) for _, text in matches]
    # strip the "A) ... D) ..." tail out of the question stem
    stem = question_text[: question_text.find(f"{matches[0][0]})")].strip()
    stem = stem.rstrip(":").strip()
    return stem, options


def parse_file(path: Path, repo_root: Path, source_repo: str, category_map):
    text = path.read_text(encoding="utf-8", errors="ignore")

    category_folder = path.parent.parent.name  # "01 Quantitative Aptitude (...)"
    difficulty_folder = path.parent.name        # "01 Basic"

    category_label = strip_numbering_prefix(category_folder)
    category_slug = slugify_category(category_label)

    difficulty_raw = strip_numbering_prefix(difficulty_folder).lower()
    difficulty = DIFFICULTY_MAP.get(difficulty_raw, difficulty_raw or "unknown")

    rows = []
    # split on "## Topic" headings so every question inherits its section topic
    sections = re.split(r"\n##\s+", text)
    for section in sections[1:]:
        topic_line, _, body = section.partition("\n")
        topic = re.sub(r"\s*\(\d+[\u2013-]\d+\)\s*$", "", topic_line).strip()

        for i, m in enumerate(QUESTION_BLOCK_RE.finditer(body), start=1):
            raw_q = normalize_ws(m.group("question"))
            solution = normalize_ws(m.group("solution"))
            answer = normalize_ws(m.group("answer")).rstrip(".")
            options_line = m.group("options_line")

            if options_line:
                # options given on their own "**Options**: A) ... B) ..." line
                stem = raw_q
                _, options = extract_options(normalize_ws(options_line))
                if options is None:
                    options = [normalize_ws(options_line)]
            else:
                # options embedded inline in the question text itself
                stem, options = extract_options(raw_q)

            qid_topic = re.sub(r"[^a-z0-9]+", "-", topic.lower()).strip("-")
            qid = f"{category_slug}-{difficulty}-{qid_topic}-{len(rows)+1:04d}"

            rows.append(
                {
                    "id": qid,
                    "category": category_slug,
                    "category_label": category_label,
                    "topic": topic,
                    "difficulty": difficulty,
                    "question": stem,
                    "options": options,
                    "answer": answer,
                    "solution": solution,
                    "source_repo": source_repo,
                    "source_file": str(path.relative_to(repo_root)),
                }
            )
    return rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("repo_root", type=Path)
    ap.add_argument("output_json", type=Path)
    ap.add_argument("--source-repo", default="")
    args = ap.parse_args()

    repo_root = args.repo_root
    source_repo = args.source_repo or repo_root.name

    md_files = sorted(repo_root.glob("*/*/README.md"))
    if not md_files:
        print(f"No matching README.md files found under {repo_root}", file=sys.stderr)
        sys.exit(1)

    all_rows = []
    for f in md_files:
        all_rows.extend(parse_file(f, repo_root, source_repo, DEFAULT_CATEGORY_MAP))

    args.output_json.write_text(json.dumps(all_rows, indent=2, ensure_ascii=False), encoding="utf-8")

    # summary
    by_cat = {}
    for r in all_rows:
        key = (r["category"], r["difficulty"])
        by_cat[key] = by_cat.get(key, 0) + 1

    print(f"Parsed {len(all_rows)} questions from {len(md_files)} files -> {args.output_json}")
    for (cat, diff), count in sorted(by_cat.items()):
        print(f"  {cat:28s} {diff:14s} {count}")


if __name__ == "__main__":
    main()