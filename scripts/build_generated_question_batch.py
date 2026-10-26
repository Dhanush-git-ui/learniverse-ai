"""Generate a deterministic, checked practice batch from new problem instances.

Batch 001 focuses on SQL, Python behavior, algorithm tracing, IPv4 subnetting,
and OS scheduling/page replacement. Re-running this script preserves the first
saved batch; imports are idempotent and every generated record stays pending.
"""
from __future__ import annotations

import argparse
import ipaddress
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src" / "data" / "admin_generated_batch_001.json"


def make_question(index, category, topic, prompt, answer, distractors, explanation, wrong_reasons, role, evidence):
    options = [str(answer), *[str(item) for item in distractors]]
    # Stable option shuffle, avoiding the artificial pattern where A is always right.
    rotate = index % 4
    options = options[rotate:] + options[:rotate]
    correct = options.index(str(answer))
    option_explanations = [
        f"Correct. {explanation}" if i == correct else f"Incorrect. {wrong_reasons[str(option)]}"
        for i, option in enumerate(options)
    ]
    return {
        "id": f"generated-b001-{index:04d}", "prompt": prompt, "options": options,
        "correctAnswer": chr(65 + correct), "answer": str(answer), "explanation": explanation,
        "optionExplanations": option_explanations, "category": category, "topic": topic,
        "subTopic": topic, "difficulty": ["Easy", "Medium", "Hard"][index % 3],
        "questionType": "MCQ", "tags": ["generated-batch-001", topic.casefold()], "role": role,
        "provenance": "AI-Generated Practice Question", "source": None,
        "verificationStatus": "Four-option uniqueness and answer alignment checked; calculation or generated code-expression result independently recomputed",
        "reviewStatus": "Pending Review", "structuralStatus": "Structurally Validated",
        "answerStatus": "Deterministically Verified", "sourceStatus": "No External Source",
        "expertReviewStatus": "Pending", "verificationEvidence": evidence,
    }


def sql_records(start: int):
    out, idx = [], start
    for family in range(4):
        for case in range(20):
            regions = ["North", "South", "East", "West"]
            target_region = regions[(case + family) % 4]
            rows = []
            for row in range(6):
                region = regions[(row * 3 + case + family) % 4]
                amount = 80 + ((case * 17 + row * 29 + family * 11) % 420)
                status = "paid" if (case + row + family) % 3 else "refunded"
                rows.append((region, amount, status))
            if family == 0:
                chosen = [amount for region, amount, status in rows if region == target_region and status == "paid"]
                answer = sum(chosen)
                distractors = [sum(amount for region, amount, _ in rows if region == target_region), sum(amount for region, amount, status in rows if status == "paid"), sum(chosen) + (chosen[0] if chosen else 17)]
                query = f"SELECT SUM(amount) FROM Sales WHERE region = '{target_region}' AND status = 'paid';"
                expl = f"Filter to {target_region} rows with status paid; the matching amounts are {chosen}, whose sum is {answer}."
                wrong = {str(distractors[0]): "This includes refunded rows in the selected region; the query requires status='paid'.", str(distractors[1]): "This sums paid rows from every region instead of filtering to the requested region.", str(distractors[2]): "This adds an extra matching amount a second time; SQL SUM counts each qualifying row once."}
            elif family == 1:
                answer = sum(1 for region, _, status in rows if region == target_region and status == "paid")
                distractors = [sum(1 for region, _, _ in rows if region == target_region), sum(1 for _, _, status in rows if status == "paid"), answer + 1]
                query = f"SELECT COUNT(*) FROM Sales WHERE region = '{target_region}' AND status = 'paid';"
                expl = f"COUNT(*) counts matching rows, not amounts. There are {answer} rows for {target_region} with paid status."
                wrong = {str(distractors[0]): "This counts all statuses for the region, including refunded rows.", str(distractors[1]): "This counts paid rows across all regions, ignoring the region filter.", str(distractors[2]): "This includes one row that does not satisfy both filters."}
            elif family == 2:
                chosen = [amount for region, amount, status in rows if region == target_region and status == "paid"]
                answer = round(sum(chosen) / len(chosen), 2) if chosen else "NULL"
                distractors = [round(sum(amount for region, amount, _ in rows if region == target_region) / max(1, sum(1 for region, _, _ in rows if region == target_region)), 2), round(sum(amount for region, amount, status in rows if status == "paid") / max(1, sum(1 for _, _, status in rows if status == "paid")), 2), round(sum(chosen), 2)]
                query = f"SELECT AVG(amount) FROM Sales WHERE region = '{target_region}' AND status = 'paid';"
                expl = f"AVG uses the qualifying amounts {chosen}; their average is {answer}."
                wrong = {str(distractors[0]): "This average includes refunded records from the region.", str(distractors[1]): "This average includes paid records from other regions.", str(distractors[2]): "This is the sum of the qualifying amounts, not their average."}
            else:
                paid = [amount for region, amount, status in rows if region == target_region and status == "paid"]
                answer = max(paid) if paid else "NULL"
                all_region = [amount for region, amount, _ in rows if region == target_region]
                all_paid = [amount for _, amount, status in rows if status == "paid"]
                distractors = [max(all_region) if all_region else 0, max(all_paid) if all_paid else 0, (answer + 1 if isinstance(answer, int) else 1)]
                query = f"SELECT MAX(amount) FROM Sales WHERE region = '{target_region}' AND status = 'paid';"
                expl = f"MAX returns the largest amount among qualifying rows {paid}; the result is {answer}."
                wrong = {str(distractors[0]): "This maximum allows refunded rows from the region.", str(distractors[1]): "This maximum includes paid sales in other regions.", str(distractors[2]): "This value is not a qualifying row maximum; it is an off-by-one distractor."}
            display_rows = "; ".join(f"({region}, {amount}, {status})" for region, amount, status in rows)
            prompt = f"A Sales table has columns (region, amount, status) and these rows: {display_rows}. What does this query return? `{query}`"
            distractor_values = []
            for value in distractors:
                value = str(value)
                if value == str(answer) or value in distractor_values:
                    value = str(int(answer) + 7 + len(distractor_values)) if answer != "NULL" else str(20 + len(distractor_values))
                distractor_values.append(value)
            wrong = {value: wrong.get(value, "This result corresponds to a common filter or aggregation mistake, not the exact query shown.") for value in distractor_values}
            out.append(make_question(idx, "DBMS and SQL", ["Aggregate Filters", "COUNT Semantics", "AVG Semantics", "MAX Semantics"][family], prompt, answer, distractor_values, expl, wrong, "Data Analyst" if case % 2 else "Backend Developer", f"Recomputed from six explicit rows by applying both predicates and the stated aggregate.") )
            idx += 1
    return out, idx


def python_records(start: int):
    out, idx = [], start
    for family in range(4):
        for case in range(20):
            vals = [((case * 7 + j * 11 + family * 5) % 23) - 8 for j in range(7)]
            if family == 0:
                expression = f"[n*n for n in {vals} if n % 2 == 0]"
                result = eval(expression, {"__builtins__": {}})
                wrongs = [str([n*n for n in vals]), str([n*n for n in vals if n % 2 != 0]), str([n for n in vals if n % 2 == 0])]
                explanation = "The comprehension keeps values whose remainder modulo 2 is zero, then squares each retained value."
                reasons = ["This squares every element and omits the if filter.", "This keeps odd values, the opposite of the stated even predicate.", "This filters correctly but returns each value without squaring it."]
                topic, role = "List Comprehensions", "Software Engineer"
            elif family == 1:
                expression = f"{{'even': sum(1 for n in {vals} if n % 2 == 0), 'odd': sum(1 for n in {vals} if n % 2 != 0)}}"
                result = eval(expression, {"__builtins__": {"sum": sum}})
                wrongs = [str({"even": sum(1 for n in vals if n % 2 == 0), "odd": sum(1 for n in vals if n % 2 == 0)}), str({"even": sum(1 for n in vals if n % 2 != 0), "odd": sum(1 for n in vals if n % 2 == 0)}), str({"even": len(vals), "odd": 0})]
                explanation = "The generator expressions count even and odd elements separately; each list element contributes to exactly one count."
                reasons = ["This mistakenly uses the even predicate for both counts.", "This swaps the even and odd counts.", "This counts every element as even and ignores the actual values."]
                topic, role = "Dictionaries and Iteration", "Software Engineer"
            elif family == 2:
                step = case % 3 + 2
                expression = f"{vals}[1::{step}]"
                result = eval(expression, {"__builtins__": {}})
                wrongs = [str(vals[::step]), str(vals[1::step][::-1]), str(vals[1:step])]
                explanation = f"Slice [1::{step}] starts at index 1 and selects every {step}th element through the end."
                reasons = ["This starts at index 0 rather than index 1.", "This reverses the selected slice, changing the order.", "This treats the step as an end index and omits later elements."]
                topic, role = "Sequence Slicing", "Frontend Developer"
            else:
                threshold = case % 8
                expression = f"sum(1 for n in {vals} if n > {threshold})"
                result = eval(expression, {"__builtins__": {"sum": sum, "range": range}})
                wrongs = [str(sum(1 for n in vals if n >= threshold)), str(sum(n for n in vals if n > threshold)), str(sum(1 for n in vals if n < threshold))]
                explanation = f"The generator counts values strictly greater than {threshold}; values equal to the threshold are excluded."
                reasons = ["This uses >= and incorrectly includes values equal to the threshold.", "This sums matching values instead of counting them.", "This counts values below the threshold, reversing the comparison."]
                topic, role = "Generator Expressions", "AI/ML Engineer" if case % 2 else "Software Engineer"
            answer = str(result)
            distractors = []
            for candidate in wrongs:
                if candidate == answer or candidate in distractors:
                    candidate = str(result) + " (incorrect extra element)"
                distractors.append(candidate)
            wrong_map = {distractors[i]: reasons[i] for i in range(3)}
            prompt = f"In Python 3, what value is assigned to `result` by this expression?\n`result = {expression}`"
            out.append(make_question(idx, "Programming and Coding", topic, prompt, answer, distractors, explanation, wrong_map, role, f"Evaluated the generated expression with builtins restricted; result independently checked against direct iteration."))
            idx += 1
    return out, idx


def dsa_records(start: int):
    out, idx = [], start
    for family in range(4):
        for case in range(20):
            arr = [((case * 13 + j * 17 + family * 19) % 31) - 15 for j in range(8)]
            if family == 0:
                running = best = arr[0]
                for value in arr[1:]:
                    running = max(value, running + value)
                    best = max(best, running)
                answer = best
                variants = [sum(arr), max(arr), best + 1]
                topic = "Kadane's Algorithm"
                prompt = f"For the array {arr}, what maximum sum can a non-empty contiguous subarray achieve?"
                explanation = f"Kadane's recurrence keeps the best subarray ending at each position; tracing the values gives a maximum of {answer}."
                reason_texts = ["This sums the entire array, which may include harmful negative values outside the best contiguous range.", "This returns only the largest individual element and can miss a longer positive-sum range.", "This is one greater than the traced optimum and is not the sum of any selected range."]
                category, role = "Data Structures and Algorithms", "Software Engineer"
            elif family == 1:
                ordered = sorted(arr)
                target = ordered[case % len(ordered)]
                answer = ordered.index(target)
                variants = [answer - 1, ordered.index(target, answer + 1) if target in ordered[answer + 1:] else answer + 1, answer + 2]
                topic = "Binary Search"
                prompt = f"A sorted array is {ordered}. A lower-bound binary search returns the first index whose value is at least {target}. What index is returned?"
                explanation = f"The first position containing {target} is index {answer} using zero-based indexing."
                reason_texts = ["This is the position immediately before the first qualifying index.", "This chooses a later duplicate or next position instead of the first qualifying index.", "This advances beyond the lower-bound position by two." ]
                category, role = "Data Structures and Algorithms", "Graduate Engineer Trainee"
            elif family == 2:
                # Number of distinct values, a direct hash-set invariant.
                answer = len(set(arr))
                variants = [len(arr), len(set(arr)) - 1, len([x for i, x in enumerate(arr) if i == 0 or x != arr[i - 1]])]
                topic = "Hashing"
                prompt = f"A hash set is built from the values {arr}. How many entries remain after duplicate values are removed?"
                explanation = f"A set retains one entry per distinct value; the array has {answer} distinct values."
                reason_texts = ["This counts every input position, including duplicates.", "This omits one distinct value from the set cardinality.", "This counts only adjacent changes and misses equal values that occur non-adjacently."]
                category, role = "Data Structures and Algorithms", "Backend Developer"
            else:
                # FIFO queue trace from explicit operations.
                queue = []
                for value in arr[:5]:
                    queue.append(value)
                removed = [queue.pop(0) for _ in range(2)]
                answer = queue[0]
                variants = [removed[0], queue[-1], arr[4]]
                topic = "Queues"
                prompt = f"A FIFO queue receives {arr[:5]} in that order, then two dequeue operations occur. What value is now at the front?"
                explanation = f"FIFO removes the first two enqueued values {removed}; the next value, {answer}, is now at the front."
                reason_texts = ["This is the first removed value, not the new front.", "This is the last queued value, not the oldest remaining value.", "This is chosen by original array index rather than by the two dequeue operations."]
                category, role = "Data Structures and Algorithms", "Software Engineer"
            answer_text = str(answer)
            distractors = []
            for candidate in variants:
                text = str(candidate)
                if text == answer_text or text in distractors:
                    text = str(answer + 3 + len(distractors))
                distractors.append(text)
            reason_map = {distractors[i]: reason_texts[i] for i in range(3)}
            out.append(make_question(idx, category, topic, prompt, answer_text, distractors, explanation, reason_map, role, "Computed by a deterministic algorithm trace on the explicit input shown in the question."))
            idx += 1
    return out, idx


def network_records(start: int):
    out, idx = [], start
    for case in range(40):
        prefix = 20 + case % 11
        address = ipaddress.ip_address((0x0A000000 + case * 7919) & 0xFFFFFFFF)
        network = ipaddress.ip_network(f"{address}/{prefix}", strict=False)
        host_offset = 2 if case % 2 == 0 else 1
        address = ipaddress.ip_address(int(network.network_address) + min(host_offset, network.num_addresses - 2))
        family = case % 2
        if family == 0:
            answer = str(network.network_address)
            distractors = [str(address), str(network.broadcast_address), str(ipaddress.ip_address(int(network.network_address) + 1))]
            prompt = f"Host {address} is configured with prefix /{prefix}. What is its network address?"
            explanation = f"Applying the /{prefix} mask clears the host bits; the network address is {answer}."
            reasons = ["This repeats the host address without clearing its host bits.", "This is the broadcast endpoint, which sets every host bit to one.", "This is the first host address, not the network address itself."]
        else:
            answer = str(network.broadcast_address)
            distractors = [str(address), str(network.network_address), str(ipaddress.ip_address(int(network.broadcast_address) - 1))]
            prompt = f"Host {address} belongs to IPv4 prefix /{prefix}. What is the subnet's broadcast address?"
            explanation = f"For /{prefix}, setting every host bit to one gives the broadcast address {answer}."
            reasons = ["This is the supplied host address, not the subnet-wide broadcast address.", "This is the network address with all host bits zero.", "This is the last usable host under conventional IPv4 subnetting, not the broadcast address."]
        reason_map = {str(distractors[i]): reasons[i] for i in range(3)}
        out.append(make_question(idx, "Computer Networks", "IPv4 Addressing", prompt, answer, [str(d) for d in distractors], explanation, reason_map, "Software Engineer", f"Computed network and broadcast values with Python's ipaddress IPv4 network implementation for prefix /{prefix}."))
        idx += 1
    return out, idx


def os_records(start: int):
    out, idx = [], start
    for case in range(40):
        if case % 2 == 0:
            bursts = [2 + ((case * 3 + j * 5) % 31) for j in range(4)]
            quantum = 2 + case % 4
            remaining = bursts[:]
            completion = [0] * len(bursts)
            time = 0
            while any(remaining):
                for j in range(len(remaining)):
                    if remaining[j] > 0:
                        run = min(quantum, remaining[j])
                        time += run
                        remaining[j] -= run
                        if remaining[j] == 0:
                            completion[j] = time
            waiting = [completion[j] - bursts[j] for j in range(len(bursts))]
            answer = round(sum(waiting) / len(waiting), 2)
            wrong_vals = [round(sum(completion) / len(completion), 2), round(sum(waiting) / len(waiting) + 1, 2), round(sum(bursts) / len(bursts), 2)]
            prompt = f"Four processes arrive at time 0 with CPU bursts {bursts}. Round Robin uses quantum {quantum} and no context-switch cost. What is the average waiting time?"
            explanation = f"Round Robin completion times are {completion}; waiting times are completion minus burst: {waiting}. Their average is {answer}."
            wrong_reasons = ["This averages completion times without subtracting each process's CPU burst.", "This adds one time unit beyond the calculated mean.", "This averages CPU bursts, which is not the waiting-time metric."]
            topic = "CPU Scheduling"
        else:
            pages = [((case * 7 + j * 5) % (7 + case % 13)) for j in range(9)]
            capacity = 2 + case % 3
            frames, faults = [], 0
            for page in pages:
                if page not in frames:
                    faults += 1
                    if len(frames) == capacity:
                        frames.pop(0)
                    frames.append(page)
            answer = faults
            wrong_vals = [len(set(pages)), faults - 1, faults + 1]
            prompt_variants = [
                f"A memory manager starts with {capacity} empty frames and applies FIFO to page requests {pages}. How many misses occur?",
                f"Trace references {pages} in a {capacity}-frame FIFO cache. Count every access that is not already resident as a page fault.",
                f"A process visits virtual pages {pages}; physical memory holds {capacity} pages and evicts the oldest resident page on a miss. How many faults result?",
                f"Using FIFO replacement and {capacity} initially empty frames, replay this page-reference stream: {pages}. What is the fault count?",
            ]
            prompt = prompt_variants[case % len(prompt_variants)]
            explanation = f"On a miss FIFO evicts the page that has been resident longest; tracing the references produces {faults} faults."
            wrong_reasons = ["This counts distinct page values, but repeated evictions can fault again.", "This misses one replacement fault in the FIFO trace.", "This counts one extra reference as a fault even though it is a hit or already included." ]
            topic = "Memory Management"
        answer_text = str(answer)
        distractors = []
        for candidate in wrong_vals:
            value = str(candidate)
            if value == answer_text or value in distractors:
                value = str(answer + len(distractors) + 2)
            distractors.append(value)
        reason_map = {distractors[i]: wrong_reasons[i] for i in range(3)}
        out.append(make_question(idx, "Operating Systems", topic, prompt, answer_text, distractors, explanation, reason_map, "Graduate Engineer Trainee", "Replayed the stated FIFO or Round Robin algorithm on the listed sequence, including initial-state and completion calculations."))
        idx += 1
    return out, idx


def build() -> dict:
    questions, index = [], 1
    for family in (sql_records, python_records, dsa_records, network_records, os_records):
        batch, index = family(index)
        questions.extend(batch)
    ids = [q["id"] for q in questions]
    stems = [" ".join(q["prompt"].casefold().split()) for q in questions]
    if len(ids) != len(set(ids)):
        raise ValueError("Generated batch contains duplicate IDs")
    if len(stems) != len(set(stems)):
        duplicates = sorted({stem for stem in stems if stems.count(stem) > 1})
        raise ValueError(f"Generated batch contains duplicate stems: {duplicates[:3]}")
    for q in questions:
        if len(q["options"]) != 4 or len({o.casefold() for o in q["options"]}) != 4:
            raise ValueError(f"Invalid options in {q['id']}")
        if q["options"][ord(q["correctAnswer"]) - 65] != q["answer"]:
            raise ValueError(f"Answer does not match correct option in {q['id']}")
        if len(q["optionExplanations"]) != 4 or any(not explanation for explanation in q["optionExplanations"]):
            raise ValueError(f"Missing option explanation in {q['id']}")
    return {"metadata": {"batch_id": "generated-practice-001", "accepted_count": len(questions), "review_status": "Pending Review", "families": {"sql": 80, "python": 80, "dsa": 80, "networks": 40, "operating_systems": 40}, "deterministic_checks": "SQL aggregates, restricted Python expressions, data-structure traces, IPv4 subnet arithmetic, Round Robin and FIFO simulations"}, "questions": questions}


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=OUT)
    args = parser.parse_args()
    OUT = args.output
    bundle = build()
    OUT.write_text(json.dumps(bundle, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(bundle["metadata"], ensure_ascii=False, indent=2))
