"""Build an importable coding-problem bundle from existing repository records.

Only records with a statement, examples, a reference implementation, and an
explicit constraints section are included. They remain Pending Review because
this build step does not execute or independently verify the supplied solutions.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "backend" / "data" / "placement_coding_questions.json"
OUTPUT = ROOT / "src" / "data" / "admin_coding_question_bank.json"

COMPANIES = {
    "TCS": ("tcs", "TCS", "Software Engineer", "Coding Practice"),
    "Infosys": ("infosys", "Infosys", "Software Engineer", "Coding Practice"),
}

# Explicit input/output conventions derived from the variables and objective in
# the repository's problem statements. They remain review drafts until confirmed.
IO_DRAFTS = {
    "codevita_sport_stadium": ("Line 1: S N k M. Line 2: M positive integers giving the alternating dry/wet block lengths.", "Print the minimum last-seat minus first-seat distance, or 0 if seating is impossible."),
    "codevita_water_cistern": ("One line: r h s d g, where g is measured in degrees.", "Print the shortest surface-path length rounded to the nearest integer."),
    "codevita_square_free_numbers": ("One line: the positive integer N.", "Print the number of square-free positive divisors of N, excluding 1."),
    "codevita_codu_and_sum_love": ("Line 1: N. Line 2: N integers x_i.", "Print (sum of (2^x_i mod 100)) mod 100."),
    "codevita_obstacle_game": ("Line 1: N. Next N lines: N grid characters per line.", "For each route cell, print its adjacent hurdles in alphabetical order, then print DESTINATION at D."),
    "infy_server_load_balancing": ("Line 1: N M. Next N lines: P_i C_i for each cluster.", "Print the maximum throughput achievable with at most M tasks."),
    "infy_max_subarray_zeroing": ("Line 1: N. Line 2: N integers A_i.", "Print the maximum contiguous-subarray sum after setting at most one contiguous subsegment to zero."),
    "infy_network_pathing_tolls": ("Line 1: N M. Next N lines: T_u R_u. Next M lines: directed edges u v w (vertices are 1-based).", "Print the maximum net path score over valid paths."),
    "infy_discount_voucher_selection": ("Line 1: N M. Next N lines: V_i D_i for each voucher category.", "Print the maximum savings from at most M voucher redemptions."),
    "infy_subsegment_sum_cyclic": ("Line 1: N. Line 2: N integers A_i.", "Print the maximum contiguous-subarray sum after at most one cyclic right shift."),
    "infy_color_partitioned_graph": ("Line 1: N M K. Line 2: S E. Next N lines: C_u V_u. Next M lines: undirected edges u v w (vertices are 1-based).", "Print the maximum valid net profit, or -1 when no valid path exists."),
    "infy_resource_extraction": ("Line 1: N M. Next N lines: Y_i K_i for each mine.", "Print the maximum total yield from at most M extractions."),
    "infy_subarray_range_inversion": ("Line 1: N. Line 2: N integers A_i.", "Print the maximum contiguous-subarray sum after at most one contiguous range sign inversion."),
    "infy_layered_dag_path": ("Line 1: N M. Next N lines: L_u W_u. Next M lines: directed edges u v (vertices are 1-based).", "Print the maximum net score over valid paths."),
    "infy_task_energy_optimization": ("Line 1: N M. Next N lines: E_i D_i for each task.", "Print the maximum total energy from at most M task executions."),
    "infy_max_subarray_negations": ("Line 1: N K. Line 2: N non-zero integers A_i.", "Print the maximum contiguous-subarray sum after at most K sign negations."),
    "infy_portal_jump_grid": ("Line 1: R C J. Next R lines: C cell values V. Next R lines: C layer values L.", "Print the maximum valid path value from top-left to bottom-right, or -1 if unreachable."),
}


def section(text: str, heading: str, next_headings: tuple[str, ...]) -> str:
    match = re.search(rf"\*\*{re.escape(heading)}\s*:\*\*\s*(.*?)(?=\n\s*\*\*(?:{'|'.join(map(re.escape, next_headings))})\s*:|\Z)", text, re.I | re.S)
    return re.sub(r"\s+", " ", match.group(1)).strip() if match else ""


def build() -> dict:
    rows = json.loads(SOURCE.read_text(encoding="utf-8"))
    questions = []
    rejected = {}
    seen = set()
    for row in rows:
        problem = row.get("question", "")
        try:
            answer = json.loads(row.get("answer", "{}"))
        except (TypeError, json.JSONDecodeError):
            answer = {}
        solution = answer.get("optimal_code")
        examples = row.get("examples") or []
        constraints = section(problem, "Constraints", ("Input Format", "Output Format", "Sample Input", "Sample Output", "Examples", "Explanation"))
        input_format = section(problem, "Input Format", ("Output Format", "Constraints", "Sample Input", "Sample Output", "Examples", "Explanation"))
        output_format = section(problem, "Output Format", ("Constraints", "Input Format", "Sample Input", "Sample Output", "Examples", "Explanation"))
        if row.get("id") in IO_DRAFTS:
            input_format = input_format or IO_DRAFTS[row["id"]][0]
            output_format = output_format or IO_DRAFTS[row["id"]][1]
        missing = [name for name, value in (("statement", problem), ("constraints", constraints), ("input_format", input_format), ("output_format", output_format), ("examples", examples), ("reference_solution", solution), ("time_complexity", answer.get("time_complexity"))) if not value]
        normalized = re.sub(r"\W+", " ", problem.casefold()).strip()
        if missing or normalized in seen:
            reason = "missing_" + (missing[0] if missing else "duplicate_statement")
            rejected[reason] = rejected.get(reason, 0) + 1
            continue
        seen.add(normalized)
        company_tags = row.get("company_tags") or []
        associations = []
        for tag in company_tags:
            if tag in COMPANIES:
                slug, name, role, stage = COMPANIES[tag]
                associations.append({
                    "company": name, "role": role, "recruitmentStage": stage,
                    "provenance": "Company-Style Practice Question",
                    "source": "backend/data/placement_coding_questions.json; company tag supplied by repository data; historical appearance not verified",
                })
        questions.append({
            "id": f"coding-{row['id']}", "prompt": re.sub(r"^#+\s*", "", problem, flags=re.M).strip(),
            "options": [], "correctAnswer": None, "answer": None,
            "explanation": "Coding problem; sample and reference implementation are supplied in the attached metadata. The reference implementation has not been independently executed.",
            "optionExplanations": [], "category": "Programming and Coding", "topic": row.get("topic") or row.get("category") or "Programming",
            "subTopic": row.get("category") or row.get("topic") or "Programming", "difficulty": row.get("difficulty") or "Medium",
            "questionType": "coding", "tags": ["coding", row.get("category", "Programming"), row.get("topic", "")],
            "source": "backend/data/placement_coding_questions.json", "provenance": "Company-Style Practice Question" if associations else "Source-Verified Practice Question",
            "verificationStatus": "Schema checks passed; inferred input/output conventions require author confirmation; reference solution and sample outputs not independently executed",
            "reviewStatus": "Pending Review", "inputFormat": input_format, "outputFormat": output_format,
            "structuralStatus": "Pending Validation", "answerStatus": "Unverified",
            "sourceStatus": "Repository Source Recorded", "expertReviewStatus": "Pending",
            "verificationEvidence": "Problem fields were extracted or drafted from the repository statement; reference code and samples have not been executed.",
            "constraints": constraints, "sampleExplanation": examples[0].get("explanation", "") if examples else "",
            "examples": examples, "testCases": examples, "referenceSolution": solution,
            "timeComplexity": answer["time_complexity"], "spaceComplexity": answer.get("space_complexity"),
            "supportedLanguages": ["Python"], "associations": associations,
        })
    return {"metadata": {"source": str(SOURCE.relative_to(ROOT)), "source_count": len(rows), "accepted_count": len(questions), "rejected_count": rejected, "review_status": "Pending Review", "solutions_executed": 0}, "questions": questions}


if __name__ == "__main__":
    bundle = build()
    OUTPUT.write_text(json.dumps(bundle, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(bundle["metadata"], ensure_ascii=False, indent=2))
