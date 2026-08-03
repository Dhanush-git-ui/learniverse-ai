# placement_assessment_system/validator.py
"""
Universal Question Validation & Quality Assurance Pipeline
Enforces strict checks across Aptitude, Verbal, CS Fundamentals, and Coding questions.
"""

import re
import json
import random
from typing import Dict, List, Tuple, Optional

# Placeholder / weak distractors that are strictly rejected
WEAK_DISTRACTOR_PATTERNS = [
    r"\bnot\s+defined\b",
    r"\bnone\s+of\s+the\s+above\b",
    r"\bnone\s+of\s+these\b",
    r"\binsufficient\s+data\b",
    r"\bcannot\s+be\s+determined\b",
    r"\bdata\s+inadequate\b",
    r"\bcan't\s+say\b",
    r"\ball\s+of\s+the\s+above\b"
]

def contains_weak_distractors(options: List[str]) -> bool:
    """Return True if any option matches banned filler distractor patterns."""
    for opt in options:
        opt_str = str(opt).strip().lower()
        for pat in WEAK_DISTRACTOR_PATTERNS:
            if re.search(pat, opt_str):
                return True
    return False


def is_text_truncated(text: str) -> bool:
    """Return True if text has incomplete sentences, trailing dots, or truncated markdown."""
    if not text or not isinstance(text, str):
        return True
    t = text.strip()
    if len(t) < 5:
        return True
    # Check for abrupt end without punctuation or ending inside code block
    if t.endswith("...") or t.endswith("…") or t.endswith(".."):
        return True
    if re.search(r'\b(the|a|an|is|are|in|of|on|to|for|with|by|that|which|when|where)\s*$', t, re.IGNORECASE):
        return True
    # Check for unclosed backticks
    if t.count("```") % 2 != 0:
        return True
    return False


def format_code_blocks_in_text(text: str, default_lang: str = "cpp") -> str:
    """
    Ensure code snippets inside question stems are enclosed in proper markdown code blocks
    with preserved indentation and syntax language identifiers.
    """
    if not text:
        return ""
    
    # If text already contains code block syntax ```, return clean
    if "```" in text:
        return text

    # Detect inline multi-line code patterns (e.g., `#include <iostream>`, `def `, `class `, `int main()`)
    code_signatures = [
        r"#include\s*<.*?>",
        r"using\s+namespace\s+std;",
        r"int\s+main\s*\(\)",
        r"public\s+static\s+void\s+main",
        r"def\s+[a-zA-Z_]\w*\s*\(",
        r"class\s+[a-zA-Z_]\w*.*\{",
        r"SELECT\s+.*?\s+FROM",
        r"for\s*\(\s*int\s+i\s*="
    ]
    
    has_code = any(re.search(sig, text, re.IGNORECASE) for sig in code_signatures)
    if not has_code:
        return text

    # Extract non-code prompt vs code body
    lines = text.split("\n")
    code_lines = []
    text_lines = []
    in_code = False

    for line in lines:
        if any(re.search(sig, line, re.IGNORECASE) for sig in code_signatures) or in_code:
            in_code = True
            code_lines.append(line)
        else:
            text_lines.append(line)

    if code_lines:
        code_body = "\n".join(code_lines)
        prompt_body = "\n".join(text_lines).strip()
        
        lang = "cpp"
        if "def " in code_body or "print(" in code_body:
            lang = "python"
        elif "public class" in code_body or "System.out.println" in code_body:
            lang = "java"
        elif "SELECT " in code_body.upper():
            lang = "sql"
        elif "function " in code_body or "console.log" in code_body:
            lang = "javascript"

        formatted = f"{prompt_body}\n\n```{lang}\n{code_body}\n```" if prompt_body else f"```{lang}\n{code_body}\n```"
        return formatted

    return text


def generate_realistic_numeric_distractors(correct_value: float, count: int = 3) -> List[str]:
    """
    Generate realistic numerical distractors based on typical calculation mistakes:
    - Off-by-one or small offsets
    - Percentage or sign errors (+/- 10%, +/- 20%)
    - Inverted fractions
    """
    val = float(correct_value)
    is_int = val.is_integer()
    
    candidates = []
    if is_int:
        i_val = int(val)
        offsets = [2, -2, 4, -4, 5, -5, 10, -10, 1]
        for off in offsets:
            d = i_val + off
            if d > 0 and d != i_val and str(d) not in candidates:
                candidates.append(str(d))
    else:
        multipliers = [1.1, 0.9, 1.2, 0.8, 1.05]
        for mult in multipliers:
            d = round(val * mult, 2)
            if d != val and str(d) not in candidates:
                candidates.append(str(d))
                
    random.shuffle(candidates)
    return candidates[:count]


def fix_distractors_if_weak(q: Dict) -> Dict:
    """Replace weak placeholder options ('Not Defined', 'None of the Above', 'Data Inadequate') with realistic tricky options."""
    opts = q.get("options")
    if not opts or not isinstance(opts, list) or len(opts) == 0:
        return q

    stem = str(q.get("question", "")).strip()
    correct_letter = str(q.get("correct_option", "A")).strip().upper()
    correct_idx = ord(correct_letter) - ord('A') if len(correct_letter) == 1 and 'A' <= correct_letter <= 'D' else 0
    correct_text = opts[correct_idx] if 0 <= correct_idx < len(opts) else opts[0]

    # Banned filler patterns
    banned_pats = [
        r"none\s+of\s+these", r"none\s+of\s+the\s+above", r"data\s+inadequate",
        r"cannot\s+be\s+determined", r"can't\s+say", r"insufficient\s+data", r"all\s+of\s+the\s+above"
    ]

    def is_banned(s: str) -> bool:
        sl = str(s).strip().lower()
        return any(re.search(pat, sl) for pat in banned_pats)

    # 1. Odd One Out Questions
    if "odd one out" in stem.lower():
        match = re.search(r'odd\s+one\s+out[:\s]+(.*)', stem, re.IGNORECASE)
        items = []
        if match:
            raw_items = re.split(r'[,:]\s*|\s+and\s+', match.group(1).replace("?", ""))
            items = [it.strip() for it in raw_items if it.strip()]
        if len(items) >= 4:
            valid_distractors = [it for it in items if it != correct_text]
            final_4 = [correct_text] + valid_distractors[:3]
            random.shuffle(final_4)
            q["options"] = final_4
            q["correct_option"] = chr(ord('A') + final_4.index(correct_text))
            return q

    # 2. Numerical extraction e.g. "45,000 visitors" or "25 km/h"
    num_match = re.search(r'^([\d,]+(?:\.\d+)?)\s*(.*)$', correct_text)
    if num_match:
        num_str, unit = num_match.group(1).replace(",", ""), num_match.group(2).strip()
        try:
            val = float(num_str)
            is_int = val.is_integer()
            if is_int:
                v_int = int(val)
                diffs = [
                    int(round(v_int * 0.9)),
                    int(round(v_int * 1.1)),
                    int(round(v_int * 1.25)),
                    v_int - 2, v_int + 2
                ]
                synth_opts = [f"{d:,} {unit}".strip() if "," in correct_text else f"{d} {unit}".strip() for d in diffs if d != v_int and d > 0]
            else:
                diffs = [round(val * 0.9, 2), round(val * 1.1, 2), round(val * 1.15, 2), round(val - 1.5, 2)]
                synth_opts = [f"{d} {unit}".strip() for d in diffs if d != val and d > 0]

            valid_distractors = [o for o in opts if o != correct_text and not is_banned(o)]
            for s_opt in synth_opts:
                if s_opt not in valid_distractors and s_opt != correct_text:
                    valid_distractors.append(s_opt)

            final_4 = [correct_text] + valid_distractors[:3]
            random.shuffle(final_4)
            q["options"] = final_4
            q["correct_option"] = chr(ord('A') + final_4.index(correct_text))
            return q
        except ValueError:
            pass

    # 3. Output prediction / CS integer outputs
    if str(correct_text).isdigit():
        val = int(correct_text)
        candidates = [str(val + 1), str(max(0, val - 1)), str(val * 2), "0", "1", "Compilation Error"]
        valid_distractors = [o for o in opts if o != correct_text and not is_banned(o)]
        for c in candidates:
            if c != correct_text and c not in valid_distractors:
                valid_distractors.append(c)

        final_4 = [correct_text] + valid_distractors[:3]
        random.shuffle(final_4)
        q["options"] = final_4
        q["correct_option"] = chr(ord('A') + final_4.index(correct_text))
        return q

    return q



def validate_and_enrich_question(q: Dict) -> Tuple[bool, List[str], Dict]:
    """
    Validate question against the 10-point production quality checklist.
    Returns (is_valid, error_list, enriched_question_dict).
    """
    errors = []
    q_enriched = dict(q)

    # 1. Existence check
    if not q_enriched.get("id"):
        q_enriched["id"] = f"q_{random.randint(10000, 99999)}"

    category = q_enriched.get("category", "General")
    q_text = q_enriched.get("question", "")

    if not q_text or is_text_truncated(q_text):
        errors.append("Question stem is empty or truncated")

    # 2. Category / Topic / Difficulty
    q_enriched["topic"] = q_enriched.get("topic") or "General Fundamentals"
    q_enriched["subtopic"] = q_enriched.get("subtopic") or q_enriched["topic"]
    q_enriched["difficulty"] = q_enriched.get("difficulty", "Medium").title()
    if q_enriched["difficulty"] not in ["Easy", "Medium", "Hard"]:
        q_enriched["difficulty"] = "Medium"

    # 3. Formatted code blocks check
    if category in ["Computer_Fundamentals", "Programming", "DSA", "Frontend", "Backend", "SQL"]:
        q_enriched["question"] = format_code_blocks_in_text(q_enriched.get("question", ""))

    # 4. MCQ Options & Distractor Quality (non-coding)
    if category != "Coding":
        opts = q_enriched.get("options")
        if not opts or not isinstance(opts, list):
            errors.append("MCQ Question is missing options array")
        elif len(opts) != 4:
            errors.append(f"MCQ Question has {len(opts)} options instead of exactly 4")
        else:
            # Fix weak distractors
            q_enriched = fix_distractors_if_weak(q_enriched)
            # Re-check weak distractors
            if contains_weak_distractors(q_enriched["options"]):
                errors.append("Question contains banned placeholder options (e.g. 'Not Defined', 'None of the Above')")

        # Correct option validation
        c_opt = str(q_enriched.get("correct_option", "")).upper()
        if not c_opt or c_opt not in ["A", "B", "C", "D"]:
            errors.append(f"Invalid or missing correct_option '{c_opt}'")

    # 5. Explanation completeness
    explanation = q_enriched.get("explanation", "")
    if not explanation or is_text_truncated(explanation) or len(explanation.strip()) < 10:
        # Auto-enrich simple explanation
        correct_letter = q_enriched.get("correct_option", "A")
        opts = q_enriched.get("options", [])
        correct_text = opts[ord(correct_letter) - ord('A')] if opts and len(opts) == 4 else "the correct choice"
        q_enriched["explanation"] = (
            f"Option {correct_letter} ('{correct_text}') is correct based on core concept principles. "
            f"Other options represent common calculation or logical misconceptions."
        )

    # 6. Metadata enrichment (Bloom's taxonomy, tags, time limit)
    q_enriched["marks"] = q_enriched.get("marks", 10 if category == "Coding" else 1)
    q_enriched["negative_marks"] = q_enriched.get("negative_marks", 0.0 if category == "Coding" else 0.25)
    q_enriched["estimated_time"] = q_enriched.get("estimated_time", 180 if category == "Coding" else 90)
    q_enriched["time_limit"] = q_enriched.get("time_limit", 300 if category == "Coding" else 120)
    q_enriched["blooms_level"] = q_enriched.get("blooms_level", "Apply" if q_enriched["difficulty"] == "Hard" else "Understand")
    q_enriched["tags"] = q_enriched.get("tags") or [category, q_enriched["topic"], q_enriched["difficulty"]]
    q_enriched["generator_version"] = "v2.0_validated"

    is_valid = len(errors) == 0
    return is_valid, errors, q_enriched
