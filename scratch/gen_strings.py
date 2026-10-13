#!/usr/bin/env python3
"""
Generates 22 PrepInsta Operations on Strings questions with complete solutions in 4 languages.
"""
import json

questions = []

def add_q(title, difficulty, statement, inputFmt, outputFmt, examples, hint1, hint2, sol_py, sol_cpp, sol_java, sol_js, bp_py, bp_cpp, bp_java, bp_js):
    questions.append({
        "title": title,
        "category": "Strings",
        "difficulty": difficulty,
        "statement": statement,
        "inputFormat": inputFmt,
        "outputFormat": outputFmt,
        "examples": examples,
        "hint1": hint1,
        "hint2": hint2,
        "solution": {"python": sol_py, "cpp": sol_cpp, "java": sol_java, "javascript": sol_js},
        "boilerplate": {"python": bp_py, "cpp": bp_cpp, "java": bp_java, "javascript": bp_js}
    })

# 1. Check whether a Character is a Vowel or Consonant
add_q("Check whether a Character is a Vowel or Consonant", "Easy",
  "Given a character ch, determine whether it is a 'Vowel' or 'Consonant'.",
  "ch = <string of length 1>", "String ('Vowel' or 'Consonant')",
  [{"input": 'ch = "a"', "output": '"Vowel"'}, {"input": 'ch = "z"', "output": '"Consonant"'}],
  "Convert the character to lowercase first.",
  "Check if it is in {'a', 'e', 'i', 'o', 'u'}.",
  'def solve(ch):\n    return "Vowel" if ch.lower() in "aeiou" else "Consonant"',
  'string solve(char ch) {\n    char c = tolower(ch);\n    if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\') return "Vowel";\n    return "Consonant";\n}',
  'public String solve(char ch) {\n    char c = Character.toLowerCase(ch);\n    if ("aeiou".indexOf(c) != -1) return "Vowel";\n    return "Consonant";\n}',
  'function solve(ch) {\n    return "aeiouAEIOU".includes(ch) ? "Vowel" : "Consonant";\n}',
  "# Solution for Check whether a Character is a Vowel or Consonant\ndef solve(ch):\n    # Write your solution here\n    pass",
  "// Solution for Check whether a Character is a Vowel or Consonant\n#include <string>\nusing namespace std;\n\nstring solve(char ch) {\n    // Write your solution here\n    return \"\";\n}",
  "// Solution for Check whether a Character is a Vowel or Consonant\nclass Solution {\n    public String solve(char ch) {\n        // Write your solution here\n        return \"\";\n    }\n}",
  "// Solution for Check whether a Character is a Vowel or Consonant\nfunction solve(ch) {\n    // Write your solution here\n    return \"\";\n}")

# 2. Check whether a Character is an Alphabet or Not
add_q("Check whether a Character is an Alphabet or Not", "Easy",
  "Given a character ch, check whether it is an alphabet (a-z or A-Z).",
  "ch = <string of length 1>", "Boolean (true/false)",
  [{"input": 'ch = "A"', "output": "true"}, {"input": 'ch = "9"', "output": "false"}],
  "Check if the character's ASCII value falls between 'a'-'z' or 'A'-'Z'.",
  "Or use built-in isalpha() method.",
  "def solve(ch):\n    return ch.isalpha()",
  "bool solve(char ch) {\n    return isalpha(ch);\n}",
  "public boolean solve(char ch) {\n    return Character.isLetter(ch);\n}",
  "function solve(ch) {\n    return /^[a-zA-Z]$/.test(ch);\n}",
  "# Solution for Check whether a Character is an Alphabet or Not\ndef solve(ch):\n    # Write your solution here\n    pass",
  "// Solution for Check whether a Character is an Alphabet or Not\n#include <cctype>\nusing namespace std;\n\nbool solve(char ch) {\n    // Write your solution here\n    return false;\n}",
  "// Solution for Check whether a Character is an Alphabet or Not\nclass Solution {\n    public boolean solve(char ch) {\n        // Write your solution here\n        return false;\n    }\n}",
  "// Solution for Check whether a Character is an Alphabet or Not\nfunction solve(ch) {\n    // Write your solution here\n    return false;\n}")

# 3. Find the ASCII Value of a Character
add_q("Find the ASCII Value of a Character", "Easy",
  "Given a character ch, find its ASCII value.",
  "ch = <string of length 1>", "Integer",
  [{"input": 'ch = "A"', "output": "65"}, {"input": 'ch = "a"', "output": "97"}],
  "In Python use ord(), in C++/Java cast to int, in JS use charCodeAt(0).",
  "Every character has an integer representation in the ASCII chart.",
  "def solve(ch):\n    return ord(ch)",
  "int solve(char ch) {\n    return (int)ch;\n}",
  "public int solve(char ch) {\n    return (int)ch;\n}",
  "function solve(ch) {\n    return ch.charCodeAt(0);\n}",
  "# Solution for Find the ASCII Value of a Character\ndef solve(ch):\n    # Write your solution here\n    pass",
  "// Solution for Find the ASCII Value of a Character\n#include <iostream>\nusing namespace std;\n\nint solve(char ch) {\n    // Write your solution here\n    return 0;\n}",
  "// Solution for Find the ASCII Value of a Character\nclass Solution {\n    public int solve(char ch) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "// Solution for Find the ASCII Value of a Character\nfunction solve(ch) {\n    // Write your solution here\n    return 0;\n}")

# 4. Length of the String Without Using strlen() Function
add_q("Length of String Without Using strlen", "Easy",
  "Find the length of a string s without using built-in length functions.",
  "s = <string>", "Integer",
  [{"input": 's = "Hello World"', "output": "11"}, {"input": 's = ""', "output": "0"}],
  "Loop over characters one by one with a counter.",
  "Increment the counter until the end of string is reached.",
  "def solve(s):\n    count = 0\n    for _ in s: count += 1\n    return count",
  "int solve(string s) {\n    int count = 0;\n    for (char c : s) count++;\n    return count;\n}",
  "public int solve(String s) {\n    int count = 0;\n    for (char c : s.toCharArray()) count++;\n    return count;\n}",
  "function solve(s) {\n    let count = 0;\n    for (let c of s) count++;\n    return count;\n}",
  "# Solution for Length of String Without Using strlen\ndef solve(s):\n    # Write your solution here\n    pass",
  "// Solution for Length of String Without Using strlen\n#include <string>\nusing namespace std;\n\nint solve(string s) {\n    // Write your solution here\n    return 0;\n}",
  "// Solution for Length of String Without Using strlen\nclass Solution {\n    public int solve(String s) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "// Solution for Length of String Without Using strlen\nfunction solve(s) {\n    // Write your solution here\n    return 0;\n}")

# 5. Toggle Each Character in a String
add_q("Toggle Each Character in a String", "Easy",
  "Given a string s, toggle the case of each character (lowercase becomes uppercase and vice versa).",
  "s = <string>", "String",
  [{"input": 's = "Hello World"', "output": '"hELLO wORLD"'}, {"input": 's = "PrepInsta"', "output": '"pREPiNSTA"'}],
  "Check each character: if uppercase, convert to lowercase; if lowercase, convert to uppercase.",
  "In Python, s.swapcase() does this directly.",
  "def solve(s):\n    return s.swapcase()",
  "string solve(string s) {\n    for (char& c : s) {\n        if (isupper(c)) c = tolower(c);\n        else if (islower(c)) c = toupper(c);\n    }\n    return s;\n}",
  "public String solve(String s) {\n    StringBuilder sb = new StringBuilder();\n    for (char c : s.toCharArray()) {\n        if (Character.isUpperCase(c)) sb.append(Character.toLowerCase(c));\n        else if (Character.isLowerCase(c)) sb.append(Character.toUpperCase(c));\n        else sb.append(c);\n    }\n    return sb.toString();\n}",
  "function solve(s) {\n    return s.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');\n}",
  "# Solution for Toggle Each Character in a String\ndef solve(s):\n    # Write your solution here\n    pass",
  "// Solution for Toggle Each Character in a String\n#include <string>\nusing namespace std;\n\nstring solve(string s) {\n    // Write your solution here\n    return \"\";\n}",
  "// Solution for Toggle Each Character in a String\nclass Solution {\n    public String solve(String s) {\n        // Write your solution here\n        return \"\";\n    }\n}",
  "// Solution for Toggle Each Character in a String\nfunction solve(s) {\n    // Write your solution here\n    return \"\";\n}")

# 6. Count the Number of Vowels in a String
add_q("Count the Number of Vowels in a String", "Easy",
  "Given a string s, count the total number of vowels present in it.",
  "s = <string>", "Integer",
  [{"input": 's = "prepinsta"', "output": "3"}, {"input": 's = "rhythm"', "output": "0"}],
  "Iterate through the string and check if each character is in 'aeiouAEIOU'.",
  "Sum the matching occurrences.",
  "def solve(s):\n    return sum(1 for c in s.lower() if c in 'aeiou')",
  "int solve(string s) {\n    int count = 0;\n    for (char c : s) {\n        char l = tolower(c);\n        if (l == 'a' || l == 'e' || l == 'i' || l == 'o' || l == 'u') count++;\n    }\n    return count;\n}",
  "public int solve(String s) {\n    int count = 0;\n    for (char c : s.toLowerCase().toCharArray()) {\n        if (\"aeiou\".indexOf(c) != -1) count++;\n    }\n    return count;\n}",
  "function solve(s) {\n    return (s.match(/[aeiou]/gi) || []).length;\n}",
  "# Solution for Count the Number of Vowels in a String\ndef solve(s):\n    # Write your solution here\n    pass",
  "// Solution for Count the Number of Vowels in a String\n#include <string>\nusing namespace std;\n\nint solve(string s) {\n    // Write your solution here\n    return 0;\n}",
  "// Solution for Count the Number of Vowels in a String\nclass Solution {\n    public int solve(String s) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "// Solution for Count the Number of Vowels in a String\nfunction solve(s) {\n    // Write your solution here\n    return 0;\n}")

# 7. Remove the Vowels from a String
add_q("Remove Vowels from a String", "Easy",
  "Given a string s, remove all vowels (both lowercase and uppercase) from the string.",
  "s = <string>", "String",
  [{"input": 's = "prepinsta"', "output": '"prpnst"'}, {"input": 's = "apple"', "output": '"ppl"'}],
  "Filter out all characters that belong to the set {'a', 'e', 'i', 'o', 'u'}.",
  "Join the remaining characters.",
  "def solve(s):\n    return ''.join(c for c in s if c.lower() not in 'aeiou')",
  "string solve(string s) {\n    string res = \"\";\n    for (char c : s) {\n        char l = tolower(c);\n        if (l != 'a' && l != 'e' && l != 'i' && l != 'o' && l != 'u') res += c;\n    }\n    return res;\n}",
  "public String solve(String s) {\n    return s.replaceAll(\"(?i)[aeiou]\", \"\");\n}",
  "function solve(s) {\n    return s.replace(/[aeiou]/gi, '');\n}",
  "# Solution for Remove Vowels from a String\ndef solve(s):\n    # Write your solution here\n    pass",
  "// Solution for Remove Vowels from a String\n#include <string>\nusing namespace std;\n\nstring solve(string s) {\n    // Write your solution here\n    return \"\";\n}",
  "// Solution for Remove Vowels from a String\nclass Solution {\n    public String solve(String s) {\n        // Write your solution here\n        return \"\";\n    }\n}",
  "// Solution for Remove Vowels from a String\nfunction solve(s) {\n    // Write your solution here\n    return \"\";\n}")

# 8. Check if the Given String is Palindrome or Not
add_q("Check if String is Palindrome", "Easy",
  "Given a string s, check if it reads the same forward and backward.",
  "s = <string>", "Boolean (true/false)",
  [{"input": 's = "racecar"', "output": "true"}, {"input": 's = "hello"', "output": "false"}],
  "Compare the string with its reversed version.",
  "Or use two pointers starting at ends moving towards center.",
  "def solve(s):\n    return s == s[::-1]",
  "bool solve(string s) {\n    int l = 0, r = (int)s.size() - 1;\n    while (l < r) if (s[l++] != s[r--]) return false;\n    return true;\n}",
  "public boolean solve(String s) {\n    return s.equals(new StringBuilder(s).reverse().toString());\n}",
  "function solve(s) {\n    return s === s.split('').reverse().join('');\n}",
  "# Solution for Check if String is Palindrome\ndef solve(s):\n    # Write your solution here\n    pass",
  "// Solution for Check if String is Palindrome\n#include <string>\nusing namespace std;\n\nbool solve(string s) {\n    // Write your solution here\n    return false;\n}",
  "// Solution for Check if String is Palindrome\nclass Solution {\n    public boolean solve(String s) {\n        // Write your solution here\n        return false;\n    }\n}",
  "// Solution for Check if String is Palindrome\nfunction solve(s) {\n    // Write your solution here\n    return false;\n}")

# 9. Print the Given String in Reverse Order
add_q("Reverse a String", "Easy",
  "Given a string s, return the string in reverse order.",
  "s = <string>", "String",
  [{"input": 's = "PrepInsta"', "output": '"atsnIperP"'}, {"input": 's = "12345"', "output": '"54321"'}],
  "Slice backwards in Python (s[::-1]) or reverse characters in an array.",
  "Return the reversed string.",
  "def solve(s):\n    return s[::-1]",
  "string solve(string s) {\n    reverse(s.begin(), s.end());\n    return s;\n}",
  "public String solve(String s) {\n    return new StringBuilder(s).reverse().toString();\n}",
  "function solve(s) {\n    return s.split('').reverse().join('');\n}",
  "# Solution for Reverse a String\ndef solve(s):\n    # Write your solution here\n    pass",
  "// Solution for Reverse a String\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nstring solve(string s) {\n    // Write your solution here\n    return \"\";\n}",
  "// Solution for Reverse a String\nclass Solution {\n    public String solve(String s) {\n        // Write your solution here\n        return \"\";\n    }\n}",
  "// Solution for Reverse a String\nfunction solve(s) {\n    // Write your solution here\n    return \"\";\n}")

# 10. Remove All Characters from String Except Alphabets
add_q("Remove All Characters Except Alphabets", "Easy",
  "Given a string s, remove all non-alphabetic characters (digits, symbols, spaces).",
  "s = <string>", "String",
  [{"input": 's = "take12% *&u ^$#forward"', "output": '"takeuforward"'}, {"input": 's = "1a2b3c!"', "output": '"abc"'}],
  "Filter for characters where isalpha() is true.",
  "Or use regex to remove [^a-zA-Z].",
  "def solve(s):\n    return ''.join(c for c in s if c.isalpha())",
  "string solve(string s) {\n    string res = \"\";\n    for (char c : s) if (isalpha(c)) res += c;\n    return res;\n}",
  "public String solve(String s) {\n    return s.replaceAll(\"[^a-zA-Z]\", \"\");\n}",
  "function solve(s) {\n    return s.replace(/[^a-zA-Z]/g, '');\n}",
  "# Solution for Remove All Characters Except Alphabets\ndef solve(s):\n    # Write your solution here\n    pass",
  "// Solution for Remove All Characters Except Alphabets\n#include <string>\nusing namespace std;\n\nstring solve(string s) {\n    // Write your solution here\n    return \"\";\n}",
  "// Solution for Remove All Characters Except Alphabets\nclass Solution {\n    public String solve(String s) {\n        // Write your solution here\n        return \"\";\n    }\n}",
  "// Solution for Remove All Characters Except Alphabets\nfunction solve(s) {\n    // Write your solution here\n    return \"\";\n}")

# 11. Remove Spaces from a String
add_q("Remove Spaces from a String", "Easy",
  "Given a string s, remove all whitespace characters from it.",
  "s = <string>", "String",
  [{"input": 's = "P r e p I n s t a"', "output": '"PrepInsta"'}, {"input": 's = "  hello  world "', "output": '"helloworld"'}],
  "Filter out space characters (' ').",
  "Or use replace(' ', '').",
  "def solve(s):\n    return s.replace(' ', '')",
  "string solve(string s) {\n    string res = \"\";\n    for (char c : s) if (c != ' ') res += c;\n    return res;\n}",
  "public String solve(String s) {\n    return s.replace(\" \", \"\");\n}",
  "function solve(s) {\n    return s.replace(/\\s+/g, '');\n}",
  "# Solution for Remove Spaces from a String\ndef solve(s):\n    # Write your solution here\n    pass",
  "// Solution for Remove Spaces from a String\n#include <string>\nusing namespace std;\n\nstring solve(string s) {\n    // Write your solution here\n    return \"\";\n}",
  "// Solution for Remove Spaces from a String\nclass Solution {\n    public String solve(String s) {\n        // Write your solution here\n        return \"\";\n    }\n}",
  "// Solution for Remove Spaces from a String\nfunction solve(s) {\n    // Write your solution here\n    return \"\";\n}")

# 12. Remove Brackets from an Algebraic Expression
add_q("Remove Brackets from an Algebraic Expression", "Easy",
  "Given an algebraic expression s, remove all brackets '(', ')', '{', '}', '[', ']'.",
  "s = <string>", "String",
  [{"input": 's = "(a-[b+c]*d)"', "output": '"a-b+c*d"'}, {"input": 's = "(a+b)=c"', "output": '"a+b=c"'}],
  "Filter out characters that are brackets.",
  "Brackets set: {'(', ')', '{', '}', '[', ']'}.",
  "def solve(s):\n    return ''.join(c for c in s if c not in '(){}[]')",
  "string solve(string s) {\n    string res = \"\";\n    for (char c : s) if (c != '(' && c != ')' && c != '{' && c != '}' && c != '[' && c != ']') res += c;\n    return res;\n}",
  "public String solve(String s) {\n    return s.replaceAll(\"[(){}\\\\[\\\\]]\", \"\");\n}",
  "function solve(s) {\n    return s.replace(/[(){}\\[\\]]/g, '');\n}",
  "# Solution for Remove Brackets from an Algebraic Expression\ndef solve(s):\n    # Write your solution here\n    pass",
  "// Solution for Remove Brackets from an Algebraic Expression\n#include <string>\nusing namespace std;\n\nstring solve(string s) {\n    // Write your solution here\n    return \"\";\n}",
  "// Solution for Remove Brackets from an Algebraic Expression\nclass Solution {\n    public String solve(String s) {\n        // Write your solution here\n        return \"\";\n    }\n}",
  "// Solution for Remove Brackets from an Algebraic Expression\nfunction solve(s) {\n    // Write your solution here\n    return \"\";\n}")

# 13. Count the Sum of Numbers in a String
add_q("Sum of Numbers in a String", "Easy",
  "Given a string s, find the sum of all contiguous numbers found in the string.",
  "s = <string>", "Integer",
  [{"input": 's = "12abc20yz68"', "output": "100", "explanation": "12 + 20 + 68 = 100"}, {"input": 's = "a1b2c3"', "output": "6"}],
  "Parse consecutive sequences of digits into integers.",
  "Sum all identified integers.",
  "def solve(s):\n    import re\n    return sum(int(x) for x in re.findall(r'\\d+', s))",
  "int solve(string s) {\n    int sum = 0, curr = 0;\n    for (char c : s) {\n        if (isdigit(c)) curr = curr * 10 + (c - '0');\n        else { sum += curr; curr = 0; }\n    }\n    return sum + curr;\n}",
  "public int solve(String s) {\n    int sum = 0, curr = 0;\n    for (char c : s.toCharArray()) {\n        if (Character.isDigit(c)) curr = curr * 10 + (c - '0');\n        else { sum += curr; curr = 0; }\n    }\n    return sum + curr;\n}",
  "function solve(s) {\n    const nums = s.match(/\\d+/g);\n    return nums ? nums.reduce((a, b) => a + parseInt(b), 0) : 0;\n}",
  "# Solution for Sum of Numbers in a String\ndef solve(s):\n    # Write your solution here\n    pass",
  "// Solution for Sum of Numbers in a String\n#include <string>\n#include <cctype>\nusing namespace std;\n\nint solve(string s) {\n    // Write your solution here\n    return 0;\n}",
  "// Solution for Sum of Numbers in a String\nclass Solution {\n    public int solve(String s) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "// Solution for Sum of Numbers in a String\nfunction solve(s) {\n    // Write your solution here\n    return 0;\n}")

# 14. Capitalize First and Last Character of Each Word
add_q("Capitalize First and Last Character of Each Word", "Easy",
  "Given a sentence s, capitalize the first and last character of each word in the string.",
  "s = <string>", "String",
  [{"input": 's = "prep insta is best"', "output": '"PreP InstA IS BesT"'}],
  "Split the string into words by space.",
  "For each word, uppercase word[0] and word[-1], then rejoin.",
  "def solve(s):\n    words = s.split(' ')\n    res = []\n    for w in words:\n        if len(w) == 1:\n            res.append(w.upper())\n        elif len(w) > 1:\n            res.append(w[0].upper() + w[1:-1] + w[-1].upper())\n        else:\n            res.append('')\n    return ' '.join(res)",
  "string solve(string s) {\n    int n = s.size();\n    for (int i = 0; i < n; ++i) {\n        if (i == 0 || s[i - 1] == ' ') s[i] = toupper(s[i]);\n        if (i == n - 1 || s[i + 1] == ' ') s[i] = toupper(s[i]);\n    }\n    return s;\n}",
  "public String solve(String s) {\n    char[] arr = s.toCharArray();\n    int n = arr.length;\n    for (int i = 0; i < n; i++) {\n        if (i == 0 || arr[i - 1] == ' ') arr[i] = Character.toUpperCase(arr[i]);\n        if (i == n - 1 || arr[i + 1] == ' ') arr[i] = Character.toUpperCase(arr[i]);\n    }\n    return new String(arr);\n}",
  "function solve(s) {\n    return s.split(' ').map(w => {\n        if (w.length <= 1) return w.toUpperCase();\n        return w[0].toUpperCase() + w.slice(1, -1) + w[w.length - 1].toUpperCase();\n    }).join(' ');\n}",
  "# Solution for Capitalize First and Last Character of Each Word\ndef solve(s):\n    # Write your solution here\n    pass",
  "// Solution for Capitalize First and Last Character of Each Word\n#include <string>\n#include <cctype>\nusing namespace std;\n\nstring solve(string s) {\n    // Write your solution here\n    return \"\";\n}",
  "// Solution for Capitalize First and Last Character of Each Word\nclass Solution {\n    public String solve(String s) {\n        // Write your solution here\n        return \"\";\n    }\n}",
  "// Solution for Capitalize First and Last Character of Each Word\nfunction solve(s) {\n    // Write your solution here\n    return \"\";\n}")

# 15. Calculate Frequency of Characters in a String
add_q("Calculate Frequency of Characters in a String", "Easy",
  "Count the frequency of each character in string s. Return an array of [char, count] pairs in order of first appearance.",
  "s = <string>", "Array of [string, integer] pairs",
  [{"input": 's = "takeuforward"', "output": '[["t", 1], ["a", 2], ["k", 1], ["e", 1], ["u", 1], ["f", 1], ["o", 1], ["r", 2], ["w", 1], ["d", 1]]'}],
  "Iterate through the string, maintaining count and tracking insertion order.",
  "Use OrderedDict / Map.",
  "def solve(s):\n    from collections import OrderedDict\n    d = OrderedDict()\n    for c in s:\n        d[c] = d.get(c, 0) + 1\n    return [[k, v] for k, v in d.items()]",
  "vector<pair<string, int>> solve(string s) {\n    vector<pair<string, int>> res;\n    unordered_map<char, int> mp;\n    vector<char> order;\n    for (char c : s) {\n        if (mp[c] == 0) order.push_back(c);\n        mp[c]++;\n    }\n    for (char c : order) res.push_back({string(1, c), mp[c]});\n    return res;\n}",
  "public List<List<Object>> solve(String s) {\n    Map<Character, Integer> map = new LinkedHashMap<>();\n    for (char c : s.toCharArray()) map.put(c, map.getOrDefault(c, 0) + 1);\n    List<List<Object>> res = new ArrayList<>();\n    for (var e : map.entrySet()) res.add(Arrays.asList(String.valueOf(e.getKey()), e.getValue()));\n    return res;\n}",
  "function solve(s) {\n    const map = new Map();\n    for (const c of s) map.set(c, (map.get(c) || 0) + 1);\n    return Array.from(map.entries());\n}",
  "# Solution for Calculate Frequency of Characters in a String\ndef solve(s):\n    # Write your solution here\n    pass",
  "// Solution for Calculate Frequency of Characters in a String\n#include <string>\n#include <vector>\nusing namespace std;\n\n// Write your solution here",
  "// Solution for Calculate Frequency of Characters in a String\nimport java.util.*;\nclass Solution {\n    // Write your solution here\n}",
  "// Solution for Calculate Frequency of Characters in a String\nfunction solve(s) {\n    // Write your solution here\n    return [];\n}")

# 16. Find Non-Repeating Characters in a String
add_q("Find Non-Repeating Characters in a String", "Easy",
  "Find all non-repeating (frequency == 1) characters in string s in order of appearance.",
  "s = <string>", "Array of characters",
  [{"input": 's = "google"', "output": '["l", "e"]'}, {"input": 's = "prepinsta"', "output": '["e", "i", "n", "s", "t", "a"]'}],
  "Count frequency of each character.",
  "Filter characters with count == 1 preserving order.",
  "def solve(s):\n    from collections import Counter\n    c = Counter(s)\n    return [ch for ch in s if c[ch] == 1]",
  "vector<char> solve(string s) {\n    unordered_map<char, int> mp;\n    for (char c : s) mp[c]++;\n    vector<char> res;\n    for (char c : s) if (mp[c] == 1) res.push_back(c);\n    return res;\n}",
  "public List<Character> solve(String s) {\n    Map<Character, Integer> map = new HashMap<>();\n    for (char c : s.toCharArray()) map.put(c, map.getOrDefault(c, 0) + 1);\n    List<Character> res = new ArrayList<>();\n    for (char c : s.toCharArray()) if (map.get(c) == 1) res.add(c);\n    return res;\n}",
  "function solve(s) {\n    const map = {};\n    for (const c of s) map[c] = (map[c] || 0) + 1;\n    return s.split('').filter(c => map[c] === 1);\n}",
  "# Solution for Find Non-Repeating Characters in a String\ndef solve(s):\n    # Write your solution here\n    pass",
  "// Solution for Find Non-Repeating Characters in a String\n#include <string>\n#include <vector>\nusing namespace std;\n\nvector<char> solve(string s) {\n    // Write your solution here\n    return {};\n}",
  "// Solution for Find Non-Repeating Characters in a String\nimport java.util.*;\nclass Solution {\n    public List<Character> solve(String s) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
  "// Solution for Find Non-Repeating Characters in a String\nfunction solve(s) {\n    // Write your solution here\n    return [];\n}")

# 17. Check if Two Strings are Anagram or Not
add_q("Check if Two Strings are Anagrams", "Easy",
  "Given two strings s1 and s2, check if they are anagrams of each other.",
  "s1 = <string>, s2 = <string>", "Boolean (true/false)",
  [{"input": 's1 = "listen", s2 = "silent"', "output": "true"}, {"input": 's1 = "hello", s2 = "world"', "output": "false"}],
  "Two strings are anagrams if sorting their characters yields the same result.",
  "Or check if character frequency maps are identical.",
  "def solve(s1, s2):\n    return sorted(s1) == sorted(s2)",
  "bool solve(string s1, string s2) {\n    sort(s1.begin(), s1.end());\n    sort(s2.begin(), s2.end());\n    return s1 == s2;\n}",
  "public boolean solve(String s1, String s2) {\n    char[] a = s1.toCharArray(), b = s2.toCharArray();\n    Arrays.sort(a); Arrays.sort(b);\n    return Arrays.equals(a, b);\n}",
  "function solve(s1, s2) {\n    return s1.split('').sort().join('') === s2.split('').sort().join('');\n}",
  "# Solution for Check if Two Strings are Anagrams\ndef solve(s1, s2):\n    # Write your solution here\n    pass",
  "// Solution for Check if Two Strings are Anagrams\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nbool solve(string s1, string s2) {\n    // Write your solution here\n    return false;\n}",
  "// Solution for Check if Two Strings are Anagrams\nimport java.util.*;\nclass Solution {\n    public boolean solve(String s1, String s2) {\n        // Write your solution here\n        return false;\n    }\n}",
  "// Solution for Check if Two Strings are Anagrams\nfunction solve(s1, s2) {\n    // Write your solution here\n    return false;\n}")

# 18. Replace Substring in a String
add_q("Replace Substring in a String", "Easy",
  "Given string s, old_sub and new_sub, replace all occurrences of old_sub with new_sub.",
  "s = <string>, old_sub = <string>, new_sub = <string>", "String",
  [{"input": 's = "hello world", old_sub = "world", new_sub = "there"', "output": '"hello there"'}],
  "Use built-in string replace method.",
  "Ensure all occurrences are replaced.",
  "def solve(s, old_sub, new_sub):\n    return s.replace(old_sub, new_sub)",
  "string solve(string s, string old_sub, string new_sub) {\n    size_t pos = 0;\n    while ((pos = s.find(old_sub, pos)) != string::npos) {\n        s.replace(pos, old_sub.length(), new_sub);\n        pos += new_sub.length();\n    }\n    return s;\n}",
  "public String solve(String s, String oldSub, String newSub) {\n    return s.replace(oldSub, newSub);\n}",
  "function solve(s, old_sub, new_sub) {\n    return s.split(old_sub).join(new_sub);\n}",
  "# Solution for Replace Substring in a String\ndef solve(s, old_sub, new_sub):\n    # Write your solution here\n    pass",
  "// Solution for Replace Substring in a String\n#include <string>\nusing namespace std;\n\nstring solve(string s, string old_sub, string new_sub) {\n    // Write your solution here\n    return \"\";\n}",
  "// Solution for Replace Substring in a String\nclass Solution {\n    public String solve(String s, String oldSub, String newSub) {\n        // Write your solution here\n        return \"\";\n    }\n}",
  "// Solution for Replace Substring in a String\nfunction solve(s, old_sub, new_sub) {\n    // Write your solution here\n    return \"\";\n}")

# 19. Replacing a Particular Word with Another Word in a String
add_q("Replacing Word with Another Word in a String", "Easy",
  "Given a sentence s, replace exact whole word old_w with new_w.",
  "s = <string>, old_w = <string>, new_w = <string>", "String",
  [{"input": 's = "apple banana apple", old_w = "apple", new_w = "orange"', "output": '"orange banana orange"'}],
  "Split the sentence by spaces into individual words.",
  "Replace matching whole words and join back with spaces.",
  "def solve(s, old_w, new_w):\n    words = s.split(' ')\n    return ' '.join(new_w if w == old_w else w for w in words)",
  "string solve(string s, string old_w, string new_w) {\n    stringstream ss(s);\n    string word, res = \"\";\n    while (ss >> word) {\n        if (!res.empty()) res += \" \";\n        res += (word == old_w ? new_w : word);\n    }\n    return res;\n}",
  "public String solve(String s, String oldW, String newW) {\n    String[] words = s.split(\" \");\n    for (int i = 0; i < words.length; i++) if (words[i].equals(oldW)) words[i] = newW;\n    return String.join(\" \", words);\n}",
  "function solve(s, old_w, new_w) {\n    return s.split(' ').map(w => w === old_w ? new_w : w).join(' ');\n}",
  "# Solution for Replacing Word with Another Word in a String\ndef solve(s, old_w, new_w):\n    # Write your solution here\n    pass",
  "// Solution for Replacing Word with Another Word in a String\n#include <string>\nusing namespace std;\n\nstring solve(string s, string old_w, string new_w) {\n    // Write your solution here\n    return \"\";\n}",
  "// Solution for Replacing Word with Another Word in a String\nclass Solution {\n    public String solve(String s, String oldW, String newW) {\n        // Write your solution here\n        return \"\";\n    }\n}",
  "// Solution for Replacing Word with Another Word in a String\nfunction solve(s, old_w, new_w) {\n    // Write your solution here\n    return \"\";\n}")

# 20. Count Common Subsequences in Two Strings
add_q("Count Common Subsequences in Two Strings", "Medium",
  "Count all matching non-empty common subsequences of two strings s1 and s2.",
  "s1 = <string>, s2 = <string>", "Integer",
  [{"input": 's1 = "ajblqcpks", s2 = "apple"', "output": "3"}],
  "Use 2D dynamic programming.",
  "dp[i][j] represents common subsequences of prefixes s1[:i] and s2[:j].",
  "def solve(s1, s2):\n    n, m = len(s1), len(s2)\n    dp = [[0] * (m + 1) for _ in range(n + 1)]\n    for i in range(1, n + 1):\n        for j in range(1, m + 1):\n            if s1[i-1] == s2[j-1]:\n                dp[i][j] = 1 + dp[i-1][j] + dp[i][j-1]\n            else:\n                dp[i][j] = dp[i-1][j] + dp[i][j-1] - dp[i-1][j-1]\n    return dp[n][m]",
  "int solve(string s1, string s2) {\n    int n = s1.size(), m = s2.size();\n    vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));\n    for (int i = 1; i <= n; ++i) {\n        for (int j = 1; j <= m; ++j) {\n            if (s1[i-1] == s2[j-1]) dp[i][j] = 1 + dp[i-1][j] + dp[i][j-1];\n            else dp[i][j] = dp[i-1][j] + dp[i][j-1] - dp[i-1][j-1];\n        }\n    }\n    return dp[n][m];\n}",
  "public int solve(String s1, String s2) {\n    int n = s1.length(), m = s2.length();\n    int[][] dp = new int[n + 1][m + 1];\n    for (int i = 1; i <= n; i++) {\n        for (int j = 1; j <= m; j++) {\n            if (s1.charAt(i - 1) == s2.charAt(j - 1)) dp[i][j] = 1 + dp[i - 1][j] + dp[i][j - 1];\n            else dp[i][j] = dp[i - 1][j] + dp[i][j - 1] - dp[i - 1][j - 1];\n        }\n    }\n    return dp[n][m];\n}",
  "function solve(s1, s2) {\n    const n = s1.length, m = s2.length;\n    const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));\n    for (let i = 1; i <= n; i++) {\n        for (let j = 1; j <= m; j++) {\n            if (s1[i - 1] === s2[j - 1]) dp[i][j] = 1 + dp[i - 1][j] + dp[i][j - 1];\n            else dp[i][j] = dp[i - 1][j] + dp[i][j - 1] - dp[i - 1][j - 1];\n        }\n    }\n    return dp[n][m];\n}",
  "# Solution for Count Common Subsequences in Two Strings\ndef solve(s1, s2):\n    # Write your solution here\n    pass",
  "// Solution for Count Common Subsequences in Two Strings\n#include <string>\n#include <vector>\nusing namespace std;\n\nint solve(string s1, string s2) {\n    // Write your solution here\n    return 0;\n}",
  "// Solution for Count Common Subsequences in Two Strings\nclass Solution {\n    public int solve(String s1, String s2) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "// Solution for Count Common Subsequences in Two Strings\nfunction solve(s1, s2) {\n    // Write your solution here\n    return 0;\n}")

# 21. Check if Two Strings Match Where One String Contains Wildcard Characters
add_q("Wildcard Matching", "Hard",
  "Check if string s matches pattern p containing wildcards '?' (matches any single character) and '*' (matches any sequence).",
  "s = <string>, p = <string>", "Boolean (true/false)",
  [{"input": 's = "aa", p = "*"', "output": "true"}, {"input": 's = "cb", p = "?a"', "output": "false"}],
  "Use 2D dynamic programming dp[i][j] = matches s[:i] with p[:j].",
  "When p[j-1] == '*', dp[i][j] = dp[i-1][j] (match 1+) or dp[i][j-1] (match 0).",
  "def solve(s, p):\n    n, m = len(s), len(p)\n    dp = [[False] * (m + 1) for _ in range(n + 1)]\n    dp[0][0] = True\n    for j in range(1, m + 1):\n        if p[j-1] == '*': dp[0][j] = dp[0][j-1]\n    for i in range(1, n + 1):\n        for j in range(1, m + 1):\n            if p[j-1] == '*':\n                dp[i][j] = dp[i-1][j] or dp[i][j-1]\n            elif p[j-1] == '?' or s[i-1] == p[j-1]:\n                dp[i][j] = dp[i-1][j-1]\n    return dp[n][m]",
  "bool solve(string s, string p) {\n    int n = s.size(), m = p.size();\n    vector<vector<bool>> dp(n + 1, vector<bool>(m + 1, false));\n    dp[0][0] = true;\n    for (int j = 1; j <= m; ++j) if (p[j-1] == '*') dp[0][j] = dp[0][j-1];\n    for (int i = 1; i <= n; ++i) {\n        for (int j = 1; j <= m; ++j) {\n            if (p[j-1] == '*') dp[i][j] = dp[i-1][j] || dp[i][j-1];\n            else if (p[j-1] == '?' || s[i-1] == p[j-1]) dp[i][j] = dp[i-1][j-1];\n        }\n    }\n    return dp[n][m];\n}",
  "public boolean solve(String s, String p) {\n    int n = s.length(), m = p.length();\n    boolean[][] dp = new boolean[n + 1][m + 1];\n    dp[0][0] = true;\n    for (int j = 1; j <= m; j++) if (p.charAt(j - 1) == '*') dp[0][j] = dp[0][j - 1];\n    for (int i = 1; i <= n; i++) {\n        for (int j = 1; j <= m; j++) {\n            if (p.charAt(j - 1) == '*') dp[i][j] = dp[i - 1][j] || dp[i][j - 1];\n            else if (p.charAt(j - 1) == '?' || s.charAt(i - 1) == p.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1];\n        }\n    }\n    return dp[n][m];\n}",
  "function solve(s, p) {\n    const n = s.length, m = p.length;\n    const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(false));\n    dp[0][0] = true;\n    for (let j = 1; j <= m; j++) if (p[j - 1] === '*') dp[0][j] = dp[0][j - 1];\n    for (let i = 1; i <= n; i++) {\n        for (let j = 1; j <= m; j++) {\n            if (p[j - 1] === '*') dp[i][j] = dp[i - 1][j] || dp[i][j - 1];\n            else if (p[j - 1] === '?' || s[i - 1] === p[j - 1]) dp[i][j] = dp[i - 1][j - 1];\n        }\n    }\n    return dp[n][m];\n}",
  "# Solution for Wildcard Matching\ndef solve(s, p):\n    # Write your solution here\n    pass",
  "// Solution for Wildcard Matching\n#include <string>\n#include <vector>\nusing namespace std;\n\nbool solve(string s, string p) {\n    // Write your solution here\n    return false;\n}",
  "// Solution for Wildcard Matching\nclass Solution {\n    public boolean solve(String s, String p) {\n        // Write your solution here\n        return false;\n    }\n}",
  "// Solution for Wildcard Matching\nfunction solve(s, p) {\n    // Write your solution here\n    return false;\n}")

# 22. Print All Permutations of a Given String in Lexicographically Sorted Order
add_q("Lexicographical Permutations of a String", "Medium",
  "Generate all unique permutations of string s in lexicographically sorted order.",
  "s = <string>", "Array of strings",
  [{"input": 's = "ABC"', "output": '["ABC", "ACB", "BAC", "BCA", "CAB", "CBA"]'}, {"input": 's = "ABA"', "output": '["AAB", "ABA", "BAA"]'}],
  "Sort the characters initially.",
  "Use backtracking or next_permutation, and deduplicate identical branches.",
  "def solve(s):\n    res = []\n    chars = sorted(list(s))\n    used = [False] * len(chars)\n    def backtrack(path):\n        if len(path) == len(chars):\n            res.append(''.join(path))\n            return\n        for i in range(len(chars)):\n            if used[i]: continue\n            if i > 0 and chars[i] == chars[i-1] and not used[i-1]: continue\n            used[i] = True\n            path.append(chars[i])\n            backtrack(path)\n            path.pop()\n            used[i] = False\n    backtrack([])\n    return res",
  "vector<string> solve(string s) {\n    vector<string> res;\n    sort(s.begin(), s.end());\n    do {\n        res.push_back(s);\n    } while (next_permutation(s.begin(), s.end()));\n    return res;\n}",
  "public List<String> solve(String s) {\n    List<String> res = new ArrayList<>();\n    char[] chars = s.toCharArray();\n    Arrays.sort(chars);\n    boolean[] used = new boolean[chars.length];\n    backtrack(chars, used, new StringBuilder(), res);\n    return res;\n}\nprivate void backtrack(char[] chars, boolean[] used, StringBuilder sb, List<String> res) {\n    if (sb.length() == chars.length) { res.add(sb.toString()); return; }\n    for (int i = 0; i < chars.length; i++) {\n        if (used[i]) continue;\n        if (i > 0 && chars[i] == chars[i - 1] && !used[i - 1]) continue;\n        used[i] = true;\n        sb.append(chars[i]);\n        backtrack(chars, used, sb, res);\n        sb.deleteCharAt(sb.length() - 1);\n        used[i] = false;\n    }\n}",
  "function solve(s) {\n    const chars = s.split('').sort();\n    const res = [];\n    const used = new Array(chars.length).fill(false);\n    function backtrack(path) {\n        if (path.length === chars.length) { res.push(path.join('')); return; }\n        for (let i = 0; i < chars.length; i++) {\n            if (used[i]) continue;\n            if (i > 0 && chars[i] === chars[i - 1] && !used[i - 1]) continue;\n            used[i] = true;\n            path.push(chars[i]);\n            backtrack(path);\n            path.pop();\n            used[i] = false;\n        }\n    }\n    backtrack([]);\n    return res;\n}",
  "# Solution for Lexicographical Permutations of a String\ndef solve(s):\n    # Write your solution here\n    pass",
  "// Solution for Lexicographical Permutations of a String\n#include <string>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<string> solve(string s) {\n    // Write your solution here\n    return {};\n}",
  "// Solution for Lexicographical Permutations of a String\nimport java.util.*;\nclass Solution {\n    public List<String> solve(String s) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
  "// Solution for Lexicographical Permutations of a String\nfunction solve(s) {\n    // Write your solution here\n    return [];\n}")

with open('scratch/strings_questions.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2)

print(f"Strings generated: {len(questions)} questions.")
