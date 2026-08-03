import os
import json
import re
import time
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed
import psycopg2
from dotenv import load_dotenv

load_dotenv()

# --- OpenRouter Credentials & Config ---
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

MODELS = [
    "openrouter/free",
    "google/gemma-4-31b-it:free",
    "inclusionai/ling-3.0-flash:free"
]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
QUESTIONS_PATH = os.path.join(BASE_DIR, "questions.json")
RESULTS_PATH = os.path.join(BASE_DIR, "qa_results.json")
MAX_WORKERS = 3

SYSTEM_PROMPT = """You are a strict quality-assurance reviewer for a placement-prep question bank covering: Quantitative Aptitude, Logical Reasoning, Verbal Ability, Abstract Reasoning, Data Interpretation, and Computer Fundamentals.

You will receive ONE question object (id, category, topic, difficulty, question, options, answer, solution). Review it against four checks and return ONLY a raw JSON object — no prose, no markdown fences, nothing before or after the JSON.

1) CLARITY
- Is the question worded unambiguously, with all needed data present, no undefined terms, and exactly one valid interpretation?
- Flag it if it references a figure/table/diagram that isn't actually included in the text (e.g. "refer to the chart below" with nothing below).

2) VISUAL REPRESENTATION
- Decide whether this question would be clearer, more realistic, or more exam-authentic with a chart or diagram (pie chart, bar chart, line graph, table, Venn diagram, shape/sequence grid, flowchart). This is common for Data Interpretation and some Logical/Abstract Reasoning items (seating arrangements, Venn/syllogism, sequences), and rare for pure Verbal or formula-based Quant.
- If yes, do NOT draw anything yourself. Instead output a "chart_spec" object with real, internally consistent numeric data that the question and solution actually support: invent plausible numbers only if the source question implies data without stating it, and make sure those numbers make the correct answer come out true.
- chart_spec shape:
  { "chart_type": "pie" | "bar" | "line" | "table" | "venn" | "grid" | "flowchart",
    "title": "short title",
    "data": { ... shape appropriate to chart_type, e.g.
       pie/bar: {"labels": [...], "values": [...]},
       line: {"x": [...], "series": {"name": [...]}},
       table: {"columns": [...], "rows": [[...], ...]},
       venn: {"set_a": "...", "set_b": "...", "only_a": n, "only_b": n, "both": n},
       grid/flowchart: {"nodes": [...], "edges": [["a","b"], ...]} } }

3) OPTION QUALITY (only if options exist)
- Good distractors share the answer's type, unit, and order of magnitude, and each one is traceable to one specific realistic mistake (sign error, off-by-one, wrong formula, reversed logic, unit slip, partial calculation) — not random or transparently wrong values.
- If the existing options are weak, lazy, or too easy to eliminate by guessing, set "options_tricky": false and supply "revised_options" (same count as the original, correct answer still included, position may change).

4) ANSWER VERIFICATION
- Independently re-solve the question from scratch. Compare against the stated answer.
- If your derivation disagrees with the stated answer, trust your own work, and explain the discrepancy in one to two sentences.

Return EXACTLY this JSON shape, nothing else:
{
  "id": "<echo the input id>",
  "clear": true | false,
  "clarity_notes": "<empty string if clear, else what's wrong>",
  "needs_image": true | false,
  "chart_spec": null | { "chart_type": "...", "title": "...", "data": { ... } },
  "options_tricky": true | false | null,
  "revised_options": null | ["...", "...", "...", "..."],
  "answer_correct": true | false,
  "correct_answer": "<your verified answer, even if identical to the given one>",
  "verification_notes": "<1-2 sentence justification, concise>"
}

Rules:
- Never invent chart data that breaks the arithmetic behind the answer.
- options_tricky is null (not false) when the question has no options at all.
- Keep verification_notes to 1-2 sentences — a short justification, not a full worked derivation.
- Output raw JSON only. No ```json fences, no commentary, no repetition of the input.
"""

def extract_json(raw_text):
    """Extract valid JSON from string with fallback regex handling."""
    if not raw_text:
        return None
    text = raw_text.strip()
    if text.startswith("```json"):
        text = text[7:]
    if text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    text = text.strip()

    try:
        return json.loads(text)
    except Exception:
        match = re.search(r'(\{[\s\S]*\})', text)
        if match:
            try:
                return json.loads(match.group(1))
            except Exception:
                pass
        return None

def call_openrouter(question_obj, attempts=0):
    """Send question object to OpenRouter with automatic model rotation and retry."""
    model_name = MODELS[attempts % len(MODELS)]
    payload = {
        "model": model_name,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": json.dumps({
                "id": question_obj.get("id"),
                "category": question_obj.get("category"),
                "topic": question_obj.get("topic"),
                "difficulty": question_obj.get("difficulty"),
                "question": question_obj.get("question"),
                "options": question_obj.get("options"),
                "answer": question_obj.get("answer"),
                "solution": question_obj.get("solution")
            }, indent=2)}
        ],
        "temperature": 0.1
    }

    req = urllib.request.Request(
        OPENROUTER_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://learniverse.ai",
            "X-Title": "Learniverse Master QA Pipeline"
        }
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            content = data["choices"][0]["message"]["content"]
            parsed = extract_json(content)
            if parsed and parsed.get("id") == question_obj.get("id"):
                return parsed
            elif attempts < 3:
                time.sleep(1)
                return call_openrouter(question_obj, attempts + 1)
    except urllib.error.HTTPError as e:
        if attempts < 4:
            time.sleep(2 * (attempts + 1))
            return call_openrouter(question_obj, attempts + 1)
    except Exception:
        if attempts < 3:
            time.sleep(1)
            return call_openrouter(question_obj, attempts + 1)

    return None

def run_qa_pipeline():
    with open(QUESTIONS_PATH, "r", encoding="utf-8") as f:
        questions = json.load(f)

    print(f"Loaded {len(questions)} total questions from {QUESTIONS_PATH}")

    results = {}
    if os.path.exists(RESULTS_PATH):
        try:
            with open(RESULTS_PATH, "r", encoding="utf-8") as f:
                saved = json.load(f)
                results = {r["id"]: r for r in saved}
            print(f"Loaded {len(results)} previously audited questions from {RESULTS_PATH}")
        except Exception:
            results = {}

    pending_questions = [q for q in questions if q["id"] not in results]
    print(f"Pending questions to audit: {len(pending_questions)}")

    if pending_questions:
        completed = 0
        total_pending = len(pending_questions)
        batch = pending_questions[:100] # Audit in chunks of 100

        with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
            future_to_id = {executor.submit(call_openrouter, q): q["id"] for q in batch}

            for future in as_completed(future_to_id):
                q_id = future_to_id[future]
                res = future.result()
                completed += 1

                if res:
                    results[q_id] = res
                    clear_status = "✓ Clear" if res.get("clear") else "⚠️ Flagged"
                    correct_status = "✓ Correct" if res.get("answer_correct") else "❌ Corrected"
                    print(f"[{completed}/{total_pending}] Audited {q_id} -> {clear_status} | {correct_status}")
                else:
                    print(f"[{completed}/{total_pending}] Retrying later for {q_id}")

                if completed % 10 == 0 or completed == len(batch):
                    with open(RESULTS_PATH, "w", encoding="utf-8") as f:
                        json.dump(list(results.values()), f, indent=2)

        print(f"\nSaved checkpoint: {len(results)} total questions audited so far in {RESULTS_PATH}")

    sync_qa_results(questions, list(results.values()))

def sync_qa_results(questions, qa_results):
    res_map = {r["id"]: r for r in qa_results}
    updated_count = 0

    for q in questions:
        q_id = q["id"]
        if q_id in res_map:
            qa = res_map[q_id]
            modified = False

            if qa.get("options_tricky") is False and qa.get("revised_options"):
                q["options"] = qa["revised_options"]
                modified = True

            if qa.get("answer_correct") is False and qa.get("correct_answer"):
                q["answer"] = qa["correct_answer"]
                modified = True

            if qa.get("needs_image") and qa.get("chart_spec"):
                q["chart_spec"] = qa["chart_spec"]
                modified = True

            if modified:
                updated_count += 1

    with open(QUESTIONS_PATH, "w", encoding="utf-8") as f:
        json.dump(questions, f, indent=2)
    print(f"Updated {updated_count} question items in questions.json with QA revisions.")

    DB_URL = os.environ.get("DATABASE_URL")
    if DB_URL:
        try:
            conn = psycopg2.connect(DB_URL)
            cur = conn.cursor()
            db_sync = 0
            for q in questions:
                q_id = q["id"]
                if q_id in res_map:
                    options_json = json.dumps(q.get("options")) if q.get("options") else None
                    cur.execute("""
                        UPDATE questions 
                        SET answer = %s, options = %s
                        WHERE id = %s
                    """, (q.get("answer"), options_json, q_id))
                    db_sync += cur.rowcount
            conn.commit()
            cur.close()
            conn.close()
            print(f"Synced {db_sync} rows in PostgreSQL questions table!")
        except Exception as e:
            print(f"DB sync notice: {e}")

if __name__ == "__main__":
    run_qa_pipeline()
