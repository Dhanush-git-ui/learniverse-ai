#!/usr/bin/env python3
"""
Assembles all 175 questions across 8 PrepInsta categories into top100Data.ts.
Categories:
1. Getting Started (28)
2. Working with Numbers (26)
3. Recursion (19)
4. Arrays (32)
5. Strings (22)
6. Advanced Arrays (29)
7. Matrix (9)
8. Pattern Printing (10)
Total: 175 questions
"""
import json, re

# Load existing 100 questions
with open('scratch/extracted_existing_100.json', encoding='utf-8') as f:
    existing_100 = json.load(f)

# Load Recursion
with open('scratch/recursion_questions.json', encoding='utf-8') as f:
    recursion_qs = json.load(f)

# Load Arrays
with open('scratch/arrays_questions.json', encoding='utf-8') as f:
    arrays_qs = json.load(f)

# Load Strings
with open('scratch/strings_questions.json', encoding='utf-8') as f:
    strings_qs = json.load(f)

def clean_title(s):
    if not isinstance(s, str):
        return s
    # Clean up any trailing PrepInsta language tags like ":C|C++|Java|Python"
    s = re.sub(r'\s*[:\-–]?\s*[C|/]+\s*C\+\+.*$', '', s)
    # Clean up any weird unicode quotes or replacement characters
    s = s.replace('\ufffd', "'")
    return s.strip()

all_questions = []

# ── 1. GETTING STARTED (28 questions) ───────────────────────────
getting_started = existing_100[:28]
for q in getting_started:
    q['title'] = clean_title(q['title'])
    q['category'] = "Getting Started"
    all_questions.append(q)

print(f"Added Getting Started: {len(getting_started)}")

# ── 2. WORKING WITH NUMBERS (26 questions) ──────────────────────
# existing_100 has 24 questions (indices 28 to 51)
working_with_nums = existing_100[28:52]
for q in working_with_nums:
    q['title'] = clean_title(q['title'])
    q['category'] = "Working with Numbers"
    all_questions.append(q)

# 2 additional questions: "Number of Digits in an Integer", "Convert Number to Words"
extra_num_q1 = {
    "title": "Number of Digits in an Integer",
    "category": "Working with Numbers",
    "difficulty": "Easy",
    "statement": "Given an integer n, count the number of digits in it.",
    "inputFormat": "n = <integer>",
    "outputFormat": "Integer",
    "examples": [{"input": "n = 12345", "output": "5"}, {"input": "n = 0", "output": "1"}],
    "hint1": "Convert to string and return length, or divide by 10 repeatedly.",
    "hint2": "Handle negative numbers by taking absolute value first.",
    "solution": {
        "python": "def solve(n):\n    return len(str(abs(n)))",
        "cpp": "int solve(int n) {\n    if (n == 0) return 1;\n    int count = 0;\n    n = abs(n);\n    while (n > 0) { count++; n /= 10; }\n    return count;\n}",
        "java": "public int solve(int n) {\n    return String.valueOf(Math.abs(n)).length();\n}",
        "javascript": "function solve(n) {\n    return Math.abs(n).toString().length;\n}"
    },
    "boilerplate": {
        "python": "# Solution for Number of Digits in an Integer\ndef solve(n):\n    # Write your solution here\n    pass",
        "cpp": "// Solution for Number of Digits in an Integer\n#include <iostream>\nusing namespace std;\n\nint solve(int n) {\n    // Write your solution here\n    return 0;\n}",
        "java": "// Solution for Number of Digits in an Integer\nclass Solution {\n    public int solve(int n) {\n        // Write your solution here\n        return 0;\n    }\n}",
        "javascript": "// Solution for Number of Digits in an Integer\nfunction solve(n) {\n    // Write your solution here\n    return 0;\n}"
    }
}

extra_num_q2 = {
    "title": "Convert Number to Words",
    "category": "Working with Numbers",
    "difficulty": "Medium",
    "statement": "Convert a given non-negative integer (0-9999) to its English word representation.",
    "inputFormat": "n = <integer>",
    "outputFormat": "String",
    "examples": [{"input": "n = 123", "output": '"One Hundred Twenty Three"'}, {"input": "n = 0", "output": '"Zero"'}],
    "hint1": "Break the number into thousands, hundreds, tens, and ones.",
    "hint2": "Map each group to its word representation using lookup arrays.",
    "solution": {
        "python": 'def solve(n):\n    if n == 0: return "Zero"\n    ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"]\n    tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"]\n    result = ""\n    if n >= 1000:\n        result += ones[n//1000] + " Thousand "\n        n %= 1000\n    if n >= 100:\n        result += ones[n//100] + " Hundred "\n        n %= 100\n    if n >= 20:\n        result += tens[n//10] + " "\n        n %= 10\n    if n > 0:\n        result += ones[n]\n    return result.strip()',
        "cpp": 'string solve(int n) {\n    if (n == 0) return "Zero";\n    string ones[] = {"","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"};\n    string tens[] = {"","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"};\n    string result = "";\n    if (n >= 1000) { result += ones[n/1000] + " Thousand "; n %= 1000; }\n    if (n >= 100) { result += ones[n/100] + " Hundred "; n %= 100; }\n    if (n >= 20) { result += tens[n/10] + " "; n %= 10; }\n    if (n > 0) result += ones[n];\n    while (result.back() == \' \') result.pop_back();\n    return result;\n}',
        "java": 'public String solve(int n) {\n    if (n == 0) return "Zero";\n    String[] ones = {"","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"};\n    String[] tens = {"","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"};\n    StringBuilder sb = new StringBuilder();\n    if (n >= 1000) { sb.append(ones[n/1000]).append(" Thousand "); n %= 1000; }\n    if (n >= 100) { sb.append(ones[n/100]).append(" Hundred "); n %= 100; }\n    if (n >= 20) { sb.append(tens[n/10]).append(" "); n %= 10; }\n    if (n > 0) sb.append(ones[n]);\n    return sb.toString().trim();\n}',
        "javascript": 'function solve(n) {\n    if (n === 0) return "Zero";\n    const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];\n    const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];\n    let result = "";\n    if (n >= 1000) { result += ones[Math.floor(n/1000)] + " Thousand "; n %= 1000; }\n    if (n >= 100) { result += ones[Math.floor(n/100)] + " Hundred "; n %= 100; }\n    if (n >= 20) { result += tens[Math.floor(n/10)] + " "; n %= 10; }\n    if (n > 0) result += ones[n];\n    return result.trim();\n}'
    },
    "boilerplate": {
        "python": "# Solution for Convert Number to Words\ndef solve(n):\n    # Write your solution here\n    pass",
        "cpp": "// Solution for Convert Number to Words\n#include <string>\nusing namespace std;\n\nstring solve(int n) {\n    // Write your solution here\n    return \"\";\n}",
        "java": "// Solution for Convert Number to Words\nclass Solution {\n    public String solve(int n) {\n        // Write your solution here\n        return \"\";\n    }\n}",
        "javascript": "// Solution for Convert Number to Words\nfunction solve(n) {\n    // Write your solution here\n    return \"\";\n}"
    }
}
all_questions.append(extra_num_q1)
all_questions.append(extra_num_q2)
print(f"Added Working with Numbers: 26 questions (24 existing + 2 new)")

# ── 3. RECURSION (19 questions) ─────────────────────────────────
for q in recursion_qs:
    q['title'] = clean_title(q['title'])
    q['category'] = "Recursion"
    all_questions.append(q)
print(f"Added Recursion: {len(recursion_qs)} questions")

# ── 4. ARRAYS (32 questions) ────────────────────────────────────
for q in arrays_qs:
    q['title'] = clean_title(q['title'])
    q['category'] = "Arrays"
    all_questions.append(q)
print(f"Added Arrays: {len(arrays_qs)} questions")

# ── 5. STRINGS (22 questions) ───────────────────────────────────
for q in strings_qs:
    q['title'] = clean_title(q['title'])
    q['category'] = "Strings"
    all_questions.append(q)
print(f"Added Strings: {len(strings_qs)} questions")

# ── 6. ADVANCED ARRAYS (29 questions) ───────────────────────────
# From existing_100 indices 52 to 80 (originally named "Arrays")
adv_arrays = existing_100[52:81]
for q in adv_arrays:
    q['title'] = clean_title(q['title'])
    q['category'] = "Advanced Arrays"
    all_questions.append(q)
print(f"Added Advanced Arrays: {len(adv_arrays)} questions")

# ── 7. MATRIX (9 questions) ─────────────────────────────────────
# From existing_100 indices 81 to 89
matrix_qs = existing_100[81:90]
for q in matrix_qs:
    q['title'] = clean_title(q['title'])
    q['category'] = "Matrix"
    all_questions.append(q)
print(f"Added Matrix: {len(matrix_qs)} questions")

# ── 8. PATTERN PRINTING (10 questions) ──────────────────────────
# From existing_100 indices 90 to 98 (9 pattern questions)
pattern_qs = existing_100[90:99]
for q in pattern_qs:
    q['title'] = clean_title(q['title'])
    q['category'] = "Pattern Printing"
    all_questions.append(q)

# 10th pattern: Butterfly Star Pattern
extra_pat_q = {
    "title": "Butterfly Star Pattern",
    "category": "Pattern Printing",
    "difficulty": "Medium",
    "statement": "Given an integer n, print the butterfly star pattern with 2*n rows.",
    "inputFormat": "n = <integer>",
    "outputFormat": "Array of strings",
    "examples": [{"input": "n = 3", "output": '["*    *", "**  **", "******", "******", "**  **", "*    *"]'}],
    "hint1": "Upper half has i stars on left, 2*(n-i) spaces, and i stars on right.",
    "hint2": "Lower half is the inverted reflection of the upper half.",
    "solution": {
        "python": "def solve(n):\n    res = []\n    for i in range(1, n + 1):\n        res.append('*' * i + ' ' * (2 * (n - i)) + '*' * i)\n    for i in range(n, 0, -1):\n        res.append('*' * i + ' ' * (2 * (n - i)) + '*' * i)\n    return res",
        "cpp": "vector<string> solve(int n) {\n    vector<string> res;\n    for(int i=1; i<=n; ++i) res.push_back(string(i, '*') + string(2*(n-i), ' ') + string(i, '*'));\n    for(int i=n; i>=1; --i) res.push_back(string(i, '*') + string(2*(n-i), ' ') + string(i, '*'));\n    return res;\n}",
        "java": "public List<String> solve(int n) {\n    List<String> res = new ArrayList<>();\n    for(int i=1; i<=n; ++i) res.add(\"*\".repeat(i) + \" \".repeat(2*(n-i)) + \"*\".repeat(i));\n    for(int i=n; i>=1; --i) res.add(\"*\".repeat(i) + \" \".repeat(2*(n-i)) + \"*\".repeat(i));\n    return res;\n}",
        "javascript": "function solve(n) {\n    const res = [];\n    for(let i=1; i<=n; ++i) res.push('*'.repeat(i) + ' '.repeat(2*(n-i)) + '*'.repeat(i));\n    for(let i=n; i>=1; --i) res.push('*'.repeat(i) + ' '.repeat(2*(n-i)) + '*'.repeat(i));\n    return res;\n}"
    },
    "boilerplate": {
        "python": "# Solution for Butterfly Star Pattern\ndef solve(n):\n    # Write your solution here\n    pass",
        "cpp": "// Solution for Butterfly Star Pattern\n#include <vector>\n#include <string>\nusing namespace std;\n\nvector<string> solve(int n) {\n    // Write your solution here\n    return {};\n}",
        "java": "// Solution for Butterfly Star Pattern\nimport java.util.*;\nclass Solution {\n    public List<String> solve(int n) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
        "javascript": "// Solution for Butterfly Star Pattern\nfunction solve(n) {\n    // Write your solution here\n    return [];\n}"
    }
}
all_questions.append(extra_pat_q)
print(f"Added Pattern Printing: 10 questions (9 existing + 1 new)")

# Re-assign 1-based sequential IDs
for idx, q in enumerate(all_questions, 1):
    q['id'] = idx

# Save JSON representation
with open('scratch/all_175_prepinsta.json', 'w', encoding='utf-8') as f:
    json.dump(all_questions, f, indent=2)

print("Saved scratch/all_175_prepinsta.json successfully!")
