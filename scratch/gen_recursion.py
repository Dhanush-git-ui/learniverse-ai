#!/usr/bin/env python3
"""
Generates 19 PrepInsta Recursion questions with complete solutions in 4 languages.
"""
import json

questions = []

def add_q(title, difficulty, statement, inputFmt, outputFmt, examples, hint1, hint2, sol_py, sol_cpp, sol_java, sol_js, bp_py, bp_cpp, bp_java, bp_js):
    questions.append({
        "title": title,
        "category": "Recursion",
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

# 1. Power of a Number using Recursion
add_q("Power of a Number using Recursion", "Easy",
  "Calculate base raised to the power of exp using recursion.",
  "base = <integer>, exp = <integer>", "Integer",
  [{"input": "base = 2, exp = 5", "output": "32"}, {"input": "base = 3, exp = 4", "output": "81"}],
  "Base case: if exp == 0, return 1.",
  "Recursive step: return base * power(base, exp - 1).",
  "def solve(base, exp):\n    if exp == 0: return 1\n    return base * solve(base, exp - 1)",
  "long long solve(int base, int exp) {\n    if (exp == 0) return 1;\n    return base * solve(base, exp - 1);\n}",
  "public long solve(int base, int exp) {\n    if (exp == 0) return 1;\n    return base * solve(base, exp - 1);\n}",
  "function solve(base, exp) {\n    if (exp === 0) return 1;\n    return base * solve(base, exp - 1);\n}",
  "# Solution for Power of a Number using Recursion\ndef solve(base, exp):\n    # Write your solution here\n    pass",
  "// Solution for Power of a Number using Recursion\n#include <iostream>\nusing namespace std;\n\nlong long solve(int base, int exp) {\n    // Write your solution here\n    return 0;\n}",
  "// Solution for Power of a Number using Recursion\nclass Solution {\n    public long solve(int base, int exp) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "// Solution for Power of a Number using Recursion\nfunction solve(base, exp) {\n    // Write your solution here\n    return 0;\n}")

# 2. Prime Number using Recursion
add_q("Prime Number using Recursion", "Easy",
  "Check whether an integer n is prime using recursion.",
  "n = <integer>", "Boolean (true/false)",
  [{"input": "n = 11", "output": "true"}, {"input": "n = 15", "output": "false"}],
  "Base cases: n <= 1 is false, n <= 3 is true.",
  "Recursively check divisors from i = 2 up to i * i <= n.",
  "def solve(n):\n    if n <= 1: return False\n    def check(n, i):\n        if i * i > n: return True\n        if n % i == 0: return False\n        return check(n, i + 1)\n    return check(n, 2)",
  "bool solve(int n) {\n    if (n <= 1) return false;\n    auto check = [&](auto& self, int val, int i) -> bool {\n        if (i * i > val) return true;\n        if (val % i == 0) return false;\n        return self(self, val, i + 1);\n    };\n    return check(check, n, 2);\n}",
  "public boolean solve(int n) {\n    if (n <= 1) return false;\n    return check(n, 2);\n}\nprivate boolean check(int n, int i) {\n    if (i * i > n) return true;\n    if (n % i == 0) return false;\n    return check(n, i + 1);\n}",
  "function solve(n) {\n    if (n <= 1) return false;\n    function check(val, i) {\n        if (i * i > val) return true;\n        if (val % i === 0) return false;\n        return check(val, i + 1);\n    }\n    return check(n, 2);\n}",
  "# Solution for Prime Number using Recursion\ndef solve(n):\n    # Write your solution here\n    pass",
  "// Solution for Prime Number using Recursion\n#include <iostream>\nusing namespace std;\n\nbool solve(int n) {\n    // Write your solution here\n    return false;\n}",
  "// Solution for Prime Number using Recursion\nclass Solution {\n    public boolean solve(int n) {\n        // Write your solution here\n        return false;\n    }\n}",
  "// Solution for Prime Number using Recursion\nfunction solve(n) {\n    // Write your solution here\n    return false;\n}")

# 3. Largest Element in an Array using Recursion
add_q("Largest Element in an Array using Recursion", "Easy",
  "Find the maximum element in an array nums using recursion.",
  "nums = <array of integers>", "Integer",
  [{"input": "nums = [1, 5, 3, 9, 2]", "output": "9"}, {"input": "nums = [-10, -5, -20]", "output": "-5"}],
  "Base case: if the array has 1 element, return that element.",
  "Otherwise, compare nums[0] with the max of the remaining subarray.",
  "def solve(nums):\n    if len(nums) == 1: return nums[0]\n    return max(nums[0], solve(nums[1:]))",
  "int solve(vector<int>& nums) {\n    auto helper = [&](auto& self, int idx) -> int {\n        if (idx == (int)nums.size() - 1) return nums[idx];\n        return max(nums[idx], self(self, idx + 1));\n    };\n    return helper(helper, 0);\n}",
  "public int solve(int[] nums) {\n    return helper(nums, 0);\n}\nprivate int helper(int[] nums, int idx) {\n    if (idx == nums.length - 1) return nums[idx];\n    return Math.max(nums[idx], helper(nums, idx + 1));\n}",
  "function solve(nums) {\n    if (nums.length === 1) return nums[0];\n    return Math.max(nums[0], solve(nums.slice(1)));\n}",
  "# Solution for Largest Element in an Array using Recursion\ndef solve(nums):\n    # Write your solution here\n    pass",
  "// Solution for Largest Element in an Array using Recursion\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint solve(vector<int>& nums) {\n    // Write your solution here\n    return 0;\n}",
  "// Solution for Largest Element in an Array using Recursion\nclass Solution {\n    public int solve(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "// Solution for Largest Element in an Array using Recursion\nfunction solve(nums) {\n    // Write your solution here\n    return 0;\n}")

# 4. Smallest Element in an Array using Recursion
add_q("Smallest Element in an Array using Recursion", "Easy",
  "Find the minimum element in an array nums using recursion.",
  "nums = <array of integers>", "Integer",
  [{"input": "nums = [4, 2, 8, 1, 6]", "output": "1"}, {"input": "nums = [10, 20, 30]", "output": "10"}],
  "Base case: if length is 1, return the only element.",
  "Recursive step: compare first element with the minimum of the rest.",
  "def solve(nums):\n    if len(nums) == 1: return nums[0]\n    return min(nums[0], solve(nums[1:]))",
  "int solve(vector<int>& nums) {\n    auto helper = [&](auto& self, int idx) -> int {\n        if (idx == (int)nums.size() - 1) return nums[idx];\n        return min(nums[idx], self(self, idx + 1));\n    };\n    return helper(helper, 0);\n}",
  "public int solve(int[] nums) {\n    return helper(nums, 0);\n}\nprivate int helper(int[] nums, int idx) {\n    if (idx == nums.length - 1) return nums[idx];\n    return Math.min(nums[idx], helper(nums, idx + 1));\n}",
  "function solve(nums) {\n    if (nums.length === 1) return nums[0];\n    return Math.min(nums[0], solve(nums.slice(1)));\n}",
  "# Solution for Smallest Element in an Array using Recursion\ndef solve(nums):\n    # Write your solution here\n    pass",
  "// Solution for Smallest Element in an Array using Recursion\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint solve(vector<int>& nums) {\n    // Write your solution here\n    return 0;\n}",
  "// Solution for Smallest Element in an Array using Recursion\nclass Solution {\n    public int solve(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "// Solution for Smallest Element in an Array using Recursion\nfunction solve(nums) {\n    // Write your solution here\n    return 0;\n}")

# 5. Reversing a Number using Recursion
add_q("Reversing a Number using Recursion", "Easy",
  "Reverse the digits of a given non-negative integer n using recursion.",
  "n = <integer>", "Integer",
  [{"input": "n = 1234", "output": "4321"}, {"input": "n = 987", "output": "789"}],
  "Extract the last digit and pass the accumulated reverse to the next call.",
  "Base case: when n == 0, return the accumulated result.",
  "def solve(n):\n    def helper(n, rev):\n        if n == 0: return rev\n        return helper(n // 10, rev * 10 + n % 10)\n    return helper(n, 0)",
  "int solve(int n) {\n    auto helper = [&](auto& self, int val, int rev) -> int {\n        if (val == 0) return rev;\n        return self(self, val / 10, rev * 10 + val % 10);\n    };\n    return helper(helper, n, 0);\n}",
  "public int solve(int n) {\n    return helper(n, 0);\n}\nprivate int helper(int n, int rev) {\n    if (n == 0) return rev;\n    return helper(n / 10, rev * 10 + n % 10);\n}",
  "function solve(n) {\n    function helper(val, rev) {\n        if (val === 0) return rev;\n        return helper(Math.floor(val / 10), rev * 10 + (val % 10));\n    }\n    return helper(n, 0);\n}",
  "# Solution for Reversing a Number using Recursion\ndef solve(n):\n    # Write your solution here\n    pass",
  "// Solution for Reversing a Number using Recursion\n#include <iostream>\nusing namespace std;\n\nint solve(int n) {\n    // Write your solution here\n    return 0;\n}",
  "// Solution for Reversing a Number using Recursion\nclass Solution {\n    public int solve(int n) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "// Solution for Reversing a Number using Recursion\nfunction solve(n) {\n    // Write your solution here\n    return 0;\n}")

# 6. HCF of Two Numbers using Recursion
add_q("HCF of Two Numbers using Recursion", "Easy",
  "Find the Highest Common Factor (GCD) of two numbers a and b using recursion.",
  "a = <integer>, b = <integer>", "Integer",
  [{"input": "a = 24, b = 36", "output": "12"}, {"input": "a = 17, b = 19", "output": "1"}],
  "Euclidean algorithm base case: if b == 0, return a.",
  "Recursive step: return solve(b, a % b).",
  "def solve(a, b):\n    if b == 0: return a\n    return solve(b, a % b)",
  "int solve(int a, int b) {\n    if (b == 0) return a;\n    return solve(b, a % b);\n}",
  "public int solve(int a, int b) {\n    if (b == 0) return a;\n    return solve(b, a % b);\n}",
  "function solve(a, b) {\n    if (b === 0) return a;\n    return solve(b, a % b);\n}",
  "# Solution for HCF of Two Numbers using Recursion\ndef solve(a, b):\n    # Write your solution here\n    pass",
  "// Solution for HCF of Two Numbers using Recursion\n#include <iostream>\nusing namespace std;\n\nint solve(int a, int b) {\n    // Write your solution here\n    return 0;\n}",
  "// Solution for HCF of Two Numbers using Recursion\nclass Solution {\n    public int solve(int a, int b) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "// Solution for HCF of Two Numbers using Recursion\nfunction solve(a, b) {\n    // Write your solution here\n    return 0;\n}")

# 7. LCM of Two Numbers using Recursion
add_q("LCM of Two Numbers using Recursion", "Easy",
  "Find the Lowest Common Multiple (LCM) of two numbers a and b using recursion.",
  "a = <integer>, b = <integer>", "Integer",
  [{"input": "a = 4, b = 6", "output": "12"}, {"input": "a = 5, b = 7", "output": "35"}],
  "LCM(a, b) = (a * b) / GCD(a, b).",
  "Compute GCD recursively using the Euclidean algorithm.",
  "def solve(a, b):\n    def gcd(x, y):\n        return x if y == 0 else gcd(y, x % y)\n    return (a * b) // gcd(a, b)",
  "int solve(int a, int b) {\n    auto gcd = [&](auto& self, int x, int y) -> int {\n        return y == 0 ? x : self(self, y, x % y);\n    };\n    return (a / gcd(gcd, a, b)) * b;\n}",
  "public int solve(int a, int b) {\n    return (a / gcd(a, b)) * b;\n}\nprivate int gcd(int a, int b) {\n    return b == 0 ? a : gcd(b, a % b);\n}",
  "function solve(a, b) {\n    const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));\n    return (a * b) / gcd(a, b);\n}",
  "# Solution for LCM of Two Numbers using Recursion\ndef solve(a, b):\n    # Write your solution here\n    pass",
  "// Solution for LCM of Two Numbers using Recursion\n#include <iostream>\nusing namespace std;\n\nint solve(int a, int b) {\n    // Write your solution here\n    return 0;\n}",
  "// Solution for LCM of Two Numbers using Recursion\nclass Solution {\n    public int solve(int a, int b) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "// Solution for LCM of Two Numbers using Recursion\nfunction solve(a, b) {\n    // Write your solution here\n    return 0;\n}")

# 8. Length of a String using Recursion
add_q("Length of a String using Recursion", "Easy",
  "Calculate the length of a string s using recursion without using the built-in len() or length property.",
  "s = <string>", "Integer",
  [{"input": 's = "PrepInsta"', "output": "9"}, {"input": 's = ""', "output": "0"}],
  "Base case: if the string is empty, return 0.",
  "Recursive step: return 1 + length(s[1:]).",
  "def solve(s):\n    if s == '': return 0\n    return 1 + solve(s[1:])",
  "int solve(string s) {\n    if (s.empty()) return 0;\n    return 1 + solve(s.substr(1));\n}",
  "public int solve(String s) {\n    if (s.isEmpty()) return 0;\n    return 1 + solve(s.substring(1));\n}",
  "function solve(s) {\n    if (s === '') return 0;\n    return 1 + solve(s.slice(1));\n}",
  "# Solution for Length of a String using Recursion\ndef solve(s):\n    # Write your solution here\n    pass",
  "// Solution for Length of a String using Recursion\n#include <string>\nusing namespace std;\n\nint solve(string s) {\n    // Write your solution here\n    return 0;\n}",
  "// Solution for Length of a String using Recursion\nclass Solution {\n    public int solve(String s) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "// Solution for Length of a String using Recursion\nfunction solve(s) {\n    // Write your solution here\n    return 0;\n}")

# 9. Print All Permutations of a String
add_q("Print All Permutations of a String", "Medium",
  "Generate all unique permutations of a given string s.",
  "s = <string>", "Array of strings",
  [{"input": 's = "ABC"', "output": '["ABC", "ACB", "BAC", "BCA", "CAB", "CBA"]'}],
  "Fix one character at each position and recursively permute the rest.",
  "Sort the result for consistent lexicographical order.",
  "def solve(s):\n    def permute(chars):\n        if len(chars) <= 1: return [chars]\n        res = []\n        for i, c in enumerate(chars):\n            for rest in permute(chars[:i] + chars[i+1:]):\n                res.append(c + rest)\n        return sorted(list(set(res)))\n    return permute(s)",
  "vector<string> solve(string s) {\n    vector<string> res;\n    sort(s.begin(), s.end());\n    do {\n        res.push_back(s);\n    } while(next_permutation(s.begin(), s.end()));\n    return res;\n}",
  "public List<String> solve(String s) {\n    List<String> res = new ArrayList<>();\n    permute(s.toCharArray(), 0, res);\n    Collections.sort(res);\n    return res;\n}\nprivate void permute(char[] arr, int idx, List<String> res) {\n    if (idx == arr.length) { res.add(new String(arr)); return; }\n    for (int i = idx; i < arr.length; i++) {\n        char t = arr[idx]; arr[idx] = arr[i]; arr[i] = t;\n        permute(arr, idx + 1, res);\n        t = arr[idx]; arr[idx] = arr[i]; arr[i] = t;\n    }\n}",
  "function solve(s) {\n    const res = [];\n    function permute(str, prefix) {\n        if (str.length === 0) { res.push(prefix); return; }\n        for (let i = 0; i < str.length; i++) {\n            permute(str.slice(0, i) + str.slice(i + 1), prefix + str[i]);\n        }\n    }\n    permute(s, '');\n    return [...new Set(res)].sort();\n}",
  "# Solution for Print All Permutations of a String\ndef solve(s):\n    # Write your solution here\n    pass",
  "// Solution for Print All Permutations of a String\n#include <vector>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nvector<string> solve(string s) {\n    // Write your solution here\n    return {};\n}",
  "// Solution for Print All Permutations of a String\nimport java.util.*;\nclass Solution {\n    public List<String> solve(String s) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
  "// Solution for Print All Permutations of a String\nfunction solve(s) {\n    // Write your solution here\n    return [];\n}")

# 10. F(N)th Term of Sequence
add_q("F(N)th Term of Sequence", "Medium",
  "Given an integer n, calculate F(n) where F(n) = 1 + 2*3 + 4*5*6 + ... with n terms.",
  "n = <integer>", "Integer",
  [{"input": "n = 3", "output": "127", "explanation": "1 + (2*3) + (4*5*6) = 1 + 6 + 120 = 127"}, {"input": "n = 1", "output": "1"}],
  "The k-th term is the product of k consecutive integers.",
  "Keep track of the current number starting from 1.",
  "def solve(n):\n    curr = 1\n    total = 0\n    for k in range(1, n + 1):\n        term = 1\n        for _ in range(k):\n            term *= curr\n            curr += 1\n        total += term\n    return total",
  "long long solve(int n) {\n    long long curr = 1, total = 0;\n    for(int k=1; k<=n; ++k) {\n        long long term = 1;\n        for(int j=0; j<k; ++j) term *= curr++;\n        total += term;\n    }\n    return total;\n}",
  "public long solve(int n) {\n    long curr = 1, total = 0;\n    for (int k = 1; k <= n; k++) {\n        long term = 1;\n        for (int j = 0; j < k; j++) term *= curr++;\n        total += term;\n    }\n    return total;\n}",
  "function solve(n) {\n    let curr = 1, total = 0;\n    for (let k = 1; k <= n; k++) {\n        let term = 1;\n        for (let j = 0; j < k; j++) term *= curr++;\n        total += term;\n    }\n    return total;\n}",
  "# Solution for F(N)th Term of Sequence\ndef solve(n):\n    # Write your solution here\n    pass",
  "// Solution for F(N)th Term of Sequence\n#include <iostream>\nusing namespace std;\n\nlong long solve(int n) {\n    // Write your solution here\n    return 0;\n}",
  "// Solution for F(N)th Term of Sequence\nclass Solution {\n    public long solve(int n) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "// Solution for F(N)th Term of Sequence\nfunction solve(n) {\n    // Write your solution here\n    return 0;\n}")

# 11. Subset Sums of all Subsets
add_q("Subset Sums of all Subsets", "Medium",
  "Given an array arr of integers, calculate the sums of all subsets and return them in sorted order.",
  "arr = <array of integers>", "Array of integers",
  [{"input": "arr = [2, 3]", "output": "[0, 2, 3, 5]"}, {"input": "arr = [1, 2, 1]", "output": "[0, 1, 1, 2, 2, 3, 3, 4]"}],
  "At each element, we have two choices: include it in the subset or exclude it.",
  "Use recursion to explore both branches and collect the sum at the end.",
  "def solve(arr):\n    sums = []\n    def helper(idx, curr_sum):\n        if idx == len(arr):\n            sums.append(curr_sum)\n            return\n        helper(idx + 1, curr_sum + arr[idx])\n        helper(idx + 1, curr_sum)\n    helper(0, 0)\n    return sorted(sums)",
  "vector<int> solve(vector<int>& arr) {\n    vector<int> res;\n    auto helper = [&](auto& self, int idx, int sum) -> void {\n        if (idx == (int)arr.size()) { res.push_back(sum); return; }\n        self(self, idx + 1, sum + arr[idx]);\n        self(self, idx + 1, sum);\n    };\n    helper(helper, 0, 0);\n    sort(res.begin(), res.end());\n    return res;\n}",
  "public List<Integer> solve(int[] arr) {\n    List<Integer> res = new ArrayList<>();\n    helper(arr, 0, 0, res);\n    Collections.sort(res);\n    return res;\n}\nprivate void helper(int[] arr, int idx, int sum, List<Integer> res) {\n    if (idx == arr.length) { res.add(sum); return; }\n    helper(arr, idx + 1, sum + arr[idx], res);\n    helper(arr, idx + 1, sum, res);\n}",
  "function solve(arr) {\n    const res = [];\n    function helper(idx, sum) {\n        if (idx === arr.length) { res.push(sum); return; }\n        helper(idx + 1, sum + arr[idx]);\n        helper(idx + 1, sum);\n    }\n    helper(0, 0);\n    return res.sort((a, b) => a - b);\n}",
  "# Solution for Subset Sums of all Subsets\ndef solve(arr):\n    # Write your solution here\n    pass",
  "// Solution for Subset Sums of all Subsets\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<int> solve(vector<int>& arr) {\n    // Write your solution here\n    return {};\n}",
  "// Solution for Subset Sums of all Subsets\nimport java.util.*;\nclass Solution {\n    public List<Integer> solve(int[] arr) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
  "// Solution for Subset Sums of all Subsets\nfunction solve(arr) {\n    // Write your solution here\n    return [];\n}")

# 12. Last Non-Zero Digit in Factorial
add_q("Last Non-Zero Digit in Factorial", "Medium",
  "Find the last non-zero digit of n! (factorial of n).",
  "n = <integer>", "Integer",
  [{"input": "n = 5", "output": "2", "explanation": "5! = 120, last non-zero digit is 2"}, {"input": "n = 12", "output": "6"}],
  "Pairs of (2, 5) create trailing zeros.",
  "Track multiplication modulo 10 while canceling out factors of 5 with factors of 2.",
  "def solve(n):\n    result = 1\n    for i in range(1, n + 1):\n        result *= i\n        while result % 10 == 0:\n            result //= 10\n        result %= 100000\n    return result % 10",
  "int solve(int n) {\n    long long res = 1;\n    for(int i=1; i<=n; ++i) {\n        res *= i;\n        while(res % 10 == 0) res /= 10;\n        res %= 100000;\n    }\n    return res % 10;\n}",
  "public int solve(int n) {\n    long res = 1;\n    for (int i = 1; i <= n; i++) {\n        res *= i;\n        while (res % 10 == 0) res /= 10;\n        res %= 100000;\n    }\n    return (int)(res % 10);\n}",
  "function solve(n) {\n    let res = 1;\n    for (let i = 1; i <= n; i++) {\n        res *= i;\n        while (res % 10 === 0) res = Math.floor(res / 10);\n        res %= 100000;\n    }\n    return res % 10;\n}",
  "# Solution for Last Non-Zero Digit in Factorial\ndef solve(n):\n    # Write your solution here\n    pass",
  "// Solution for Last Non-Zero Digit in Factorial\n#include <iostream>\nusing namespace std;\n\nint solve(int n) {\n    // Write your solution here\n    return 0;\n}",
  "// Solution for Last Non-Zero Digit in Factorial\nclass Solution {\n    public int solve(int n) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "// Solution for Last Non-Zero Digit in Factorial\nfunction solve(n) {\n    // Write your solution here\n    return 0;\n}")

# 13. Nth Row of Pascal's Triangle
add_q("Nth Row of Pascal's Triangle", "Medium",
  "Given a 0-indexed integer n, return the nth row of Pascal's triangle.",
  "n = <integer>", "Array of integers",
  [{"input": "n = 4", "output": "[1, 4, 6, 4, 1]"}, {"input": "n = 0", "output": "[1]"}],
  "Each row has n + 1 elements. The k-th element is C(n, k).",
  "C(n, k) = C(n, k-1) * (n - k + 1) / k.",
  "def solve(n):\n    row = [1]\n    for k in range(1, n + 1):\n        row.append(row[-1] * (n - k + 1) // k)\n    return row",
  "vector<int> solve(int n) {\n    vector<int> row = {1};\n    long long prev = 1;\n    for(int k=1; k<=n; ++k) {\n        prev = prev * (n - k + 1) / k;\n        row.push_back((int)prev);\n    }\n    return row;\n}",
  "public List<Integer> solve(int n) {\n    List<Integer> row = new ArrayList<>();\n    row.add(1);\n    long prev = 1;\n    for (int k = 1; k <= n; k++) {\n        prev = prev * (n - k + 1) / k;\n        row.add((int)prev);\n    }\n    return row;\n}",
  "function solve(n) {\n    const row = [1];\n    let prev = 1;\n    for (let k = 1; k <= n; k++) {\n        prev = (prev * (n - k + 1)) / k;\n        row.push(prev);\n    }\n    return row;\n}",
  "# Solution for Nth Row of Pascal's Triangle\ndef solve(n):\n    # Write your solution here\n    pass",
  "// Solution for Nth Row of Pascal's Triangle\n#include <vector>\nusing namespace std;\n\nvector<int> solve(int n) {\n    // Write your solution here\n    return {};\n}",
  "// Solution for Nth Row of Pascal's Triangle\nimport java.util.*;\nclass Solution {\n    public List<Integer> solve(int n) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
  "// Solution for Nth Row of Pascal's Triangle\nfunction solve(n) {\n    // Write your solution here\n    return [];\n}")

# 14. Generate All Combinations of Balanced Parentheses
add_q("Generate All Combinations of Balanced Parentheses", "Medium",
  "Given an integer n representing pairs of parentheses, generate all combinations of well-formed parentheses.",
  "n = <integer>", "Array of strings",
  [{"input": "n = 3", "output": '["((()))", "(()())", "(())()", "()(())", "()()()"]'}],
  "Use backtracking: add '(' if open count < n; add ')' if close count < open count.",
  "Base case: when string length == 2 * n, add to results.",
  "def solve(n):\n    res = []\n    def backtrack(s, open_cnt, close_cnt):\n        if len(s) == 2 * n:\n            res.append(s)\n            return\n        if open_cnt < n: backtrack(s + '(', open_cnt + 1, close_cnt)\n        if close_cnt < open_cnt: backtrack(s + ')', open_cnt, close_cnt + 1)\n    backtrack('', 0, 0)\n    return res",
  "vector<string> solve(int n) {\n    vector<string> res;\n    auto backtrack = [&](auto& self, string s, int open, int close) -> void {\n        if((int)s.size() == 2*n) { res.push_back(s); return; }\n        if(open < n) self(self, s + '(', open + 1, close);\n        if(close < open) self(self, s + ')', open, close + 1);\n    };\n    backtrack(backtrack, \"\", 0, 0);\n    return res;\n}",
  "public List<String> solve(int n) {\n    List<String> res = new ArrayList<>();\n    backtrack(\"\", 0, 0, n, res);\n    return res;\n}\nprivate void backtrack(String s, int open, int close, int n, List<String> res) {\n    if (s.length() == 2 * n) { res.add(s); return; }\n    if (open < n) backtrack(s + \"(\", open + 1, close, n, res);\n    if (close < open) backtrack(s + \")\", open, close + 1, n, res);\n}",
  "function solve(n) {\n    const res = [];\n    function backtrack(s, open, close) {\n        if (s.length === 2 * n) { res.push(s); return; }\n        if (open < n) backtrack(s + '(', open + 1, close);\n        if (close < open) backtrack(s + ')', open, close + 1);\n    }\n    backtrack('', 0, 0);\n    return res;\n}",
  "# Solution for Generate All Combinations of Balanced Parentheses\ndef solve(n):\n    # Write your solution here\n    pass",
  "// Solution for Generate All Combinations of Balanced Parentheses\n#include <vector>\n#include <string>\nusing namespace std;\n\nvector<string> solve(int n) {\n    // Write your solution here\n    return {};\n}",
  "// Solution for Generate All Combinations of Balanced Parentheses\nimport java.util.*;\nclass Solution {\n    public List<String> solve(int n) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
  "// Solution for Generate All Combinations of Balanced Parentheses\nfunction solve(n) {\n    // Write your solution here\n    return [];\n}")

# 15. Factorial of a Number using Recursion
add_q("Factorial of a Number using Recursion", "Easy",
  "Calculate the factorial of a non-negative integer n using recursion.",
  "n = <integer>", "Integer",
  [{"input": "n = 5", "output": "120"}, {"input": "n = 0", "output": "1"}],
  "Base case: if n <= 1, return 1.",
  "Recursive step: return n * solve(n - 1).",
  "def solve(n):\n    if n <= 1: return 1\n    return n * solve(n - 1)",
  "long long solve(int n) {\n    if (n <= 1) return 1;\n    return n * solve(n - 1);\n}",
  "public long solve(int n) {\n    if (n <= 1) return 1;\n    return n * solve(n - 1);\n}",
  "function solve(n) {\n    if (n <= 1) return 1;\n    return n * solve(n - 1);\n}",
  "# Solution for Factorial of a Number using Recursion\ndef solve(n):\n    # Write your solution here\n    pass",
  "// Solution for Factorial of a Number using Recursion\n#include <iostream>\nusing namespace std;\n\nlong long solve(int n) {\n    // Write your solution here\n    return 0;\n}",
  "// Solution for Factorial of a Number using Recursion\nclass Solution {\n    public long solve(int n) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "// Solution for Factorial of a Number using Recursion\nfunction solve(n) {\n    // Write your solution here\n    return 0;\n}")

# 16. Palindromic Partitions of a String
add_q("Palindromic Partitions of a String", "Medium",
  "Find all possible palindromic partitions of a given string s.",
  "s = <string>", "Array of array of strings",
  [{"input": 's = "aab"', "output": '[["a", "a", "b"], ["aa", "b"]]'}],
  "For each prefix, check if it is a palindrome.",
  "If it is, recursively partition the remaining substring.",
  "def solve(s):\n    res = []\n    def is_pal(sub): return sub == sub[::-1]\n    def backtrack(start, path):\n        if start == len(s):\n            res.append(list(path))\n            return\n        for end in range(start + 1, len(s) + 1):\n            sub = s[start:end]\n            if is_pal(sub):\n                path.append(sub)\n                backtrack(end, path)\n                path.pop()\n    backtrack(0, [])\n    return res",
  "vector<vector<string>> solve(string s) {\n    vector<vector<string>> res;\n    vector<string> path;\n    auto is_pal = [](const string& sub) { int l=0, r=(int)sub.size()-1; while(l<r) if(sub[l++]!=sub[r--]) return false; return true; };\n    auto backtrack = [&](auto& self, int start) -> void {\n        if(start == (int)s.size()) { res.push_back(path); return; }\n        for(int end = start + 1; end <= (int)s.size(); ++end) {\n            string sub = s.substr(start, end - start);\n            if(is_pal(sub)) { path.push_back(sub); self(self, end); path.pop_back(); }\n        }\n    };\n    backtrack(backtrack, 0);\n    return res;\n}",
  "public List<List<String>> solve(String s) {\n    List<List<String>> res = new ArrayList<>();\n    backtrack(s, 0, new ArrayList<>(), res);\n    return res;\n}\nprivate void backtrack(String s, int start, List<String> path, List<List<String>> res) {\n    if (start == s.length()) { res.add(new ArrayList<>(path)); return; }\n    for (int end = start + 1; end <= s.length(); end++) {\n        String sub = s.substring(start, end);\n        if (isPal(sub)) { path.add(sub); backtrack(s, end, path, res); path.remove(path.size() - 1); }\n    }\n}\nprivate boolean isPal(String sub) { return new StringBuilder(sub).reverse().toString().equals(sub); }",
  "function solve(s) {\n    const res = [];\n    const isPal = sub => sub === sub.split('').reverse().join('');\n    function backtrack(start, path) {\n        if (start === s.length) { res.push([...path]); return; }\n        for (let end = start + 1; end <= s.length; end++) {\n            const sub = s.slice(start, end);\n            if (isPal(sub)) { path.push(sub); backtrack(end, path); path.pop(); }\n        }\n    }\n    backtrack(0, []);\n    return res;\n}",
  "# Solution for Palindromic Partitions of a String\ndef solve(s):\n    # Write your solution here\n    pass",
  "// Solution for Palindromic Partitions of a String\n#include <vector>\n#include <string>\nusing namespace std;\n\nvector<vector<string>> solve(string s) {\n    // Write your solution here\n    return {};\n}",
  "// Solution for Palindromic Partitions of a String\nimport java.util.*;\nclass Solution {\n    public List<List<String>> solve(String s) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
  "// Solution for Palindromic Partitions of a String\nfunction solve(s) {\n    // Write your solution here\n    return [];\n}")

# 17. N-bit Binary Numbers Having More 1s than 0s
add_q("N-bit Binary Numbers Having More 1s than 0s", "Medium",
  "Given n, generate all n-bit binary numbers having more than or equal 1s than 0s in all its prefixes.",
  "n = <integer>", "Array of strings",
  [{"input": "n = 3", "output": '["111", "110", "101"]'}, {"input": "n = 2", "output": '["11", "10"]'}],
  "At each step, we can always add '1'.",
  "We can add '0' only if the count of 1s strictly exceeds the count of 0s.",
  "def solve(n):\n    res = []\n    def helper(ones, zeros, s):\n        if len(s) == n:\n            res.append(s)\n            return\n        helper(ones + 1, zeros, s + '1')\n        if ones > zeros:\n            helper(ones, zeros + 1, s + '0')\n    helper(0, 0, '')\n    return res",
  "vector<string> solve(int n) {\n    vector<string> res;\n    auto helper = [&](auto& self, int ones, int zeros, string s) -> void {\n        if((int)s.size() == n) { res.push_back(s); return; }\n        self(self, ones + 1, zeros, s + '1');\n        if(ones > zeros) self(self, ones, zeros + 1, s + '0');\n    };\n    helper(helper, 0, 0, \"\");\n    return res;\n}",
  "public List<String> solve(int n) {\n    List<String> res = new ArrayList<>();\n    helper(0, 0, \"\", n, res);\n    return res;\n}\nprivate void helper(int ones, int zeros, String s, int n, List<String> res) {\n    if (s.length() == n) { res.add(s); return; }\n    helper(ones + 1, zeros, s + \"1\", n, res);\n    if (ones > zeros) helper(ones, zeros + 1, s + \"0\", n, res);\n}",
  "function solve(n) {\n    const res = [];\n    function helper(ones, zeros, s) {\n        if (s.length === n) { res.push(s); return; }\n        helper(ones + 1, zeros, s + '1');\n        if (ones > zeros) helper(ones, zeros + 1, s + '0');\n    }\n    helper(0, 0, '');\n    return res;\n}",
  "# Solution for N-bit Binary Numbers Having More 1s than 0s\ndef solve(n):\n    # Write your solution here\n    pass",
  "// Solution for N-bit Binary Numbers Having More 1s than 0s\n#include <vector>\n#include <string>\nusing namespace std;\n\nvector<string> solve(int n) {\n    // Write your solution here\n    return {};\n}",
  "// Solution for N-bit Binary Numbers Having More 1s than 0s\nimport java.util.*;\nclass Solution {\n    public List<String> solve(int n) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
  "// Solution for N-bit Binary Numbers Having More 1s than 0s\nfunction solve(n) {\n    // Write your solution here\n    return [];\n}")

# 18. Find All Subsets (Power Set)
add_q("Find All Subsets (Power Set)", "Medium",
  "Given a set of distinct integers nums, find all its subsets (power set).",
  "nums = <array of integers>", "Array of array of integers",
  [{"input": "nums = [1, 2, 3]", "output": "[[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]"}],
  "For each element, choose whether to include it or exclude it.",
  "A set of n elements has 2^n subsets.",
  "def solve(nums):\n    res = []\n    def helper(idx, curr):\n        if idx == len(nums):\n            res.append(list(curr))\n            return\n        helper(idx + 1, curr)\n        curr.append(nums[idx])\n        helper(idx + 1, curr)\n        curr.pop()\n    helper(0, [])\n    return sorted(res, key=lambda x: (len(x), x))",
  "vector<vector<int>> solve(vector<int>& nums) {\n    vector<vector<int>> res;\n    vector<int> curr;\n    auto helper = [&](auto& self, int idx) -> void {\n        if(idx == (int)nums.size()) { res.push_back(curr); return; }\n        self(self, idx + 1);\n        curr.push_back(nums[idx]);\n        self(self, idx + 1);\n        curr.pop_back();\n    };\n    helper(helper, 0);\n    return res;\n}",
  "public List<List<Integer>> solve(int[] nums) {\n    List<List<Integer>> res = new ArrayList<>();\n    helper(nums, 0, new ArrayList<>(), res);\n    return res;\n}\nprivate void helper(int[] nums, int idx, List<Integer> curr, List<List<Integer>> res) {\n    if (idx == nums.length) { res.add(new ArrayList<>(curr)); return; }\n    helper(nums, idx + 1, curr, res);\n    curr.add(nums[idx]);\n    helper(nums, idx + 1, curr, res);\n    curr.remove(curr.size() - 1);\n}",
  "function solve(nums) {\n    const res = [];\n    function helper(idx, curr) {\n        if (idx === nums.length) { res.push([...curr]); return; }\n        helper(idx + 1, curr);\n        curr.push(nums[idx]);\n        helper(idx + 1, curr);\n        curr.pop();\n    }\n    helper(0, []);\n    return res.sort((a, b) => a.length - b.length || a[0] - b[0]);\n}",
  "# Solution for Find All Subsets (Power Set)\ndef solve(nums):\n    # Write your solution here\n    pass",
  "// Solution for Find All Subsets (Power Set)\n#include <vector>\nusing namespace std;\n\nvector<vector<int>> solve(vector<int>& nums) {\n    // Write your solution here\n    return {};\n}",
  "// Solution for Find All Subsets (Power Set)\nimport java.util.*;\nclass Solution {\n    public List<List<Integer>> solve(int[] nums) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
  "// Solution for Find All Subsets (Power Set)\nfunction solve(nums) {\n    // Write your solution here\n    return [];\n}")

# 19. Remove All Adjacent Duplicate Characters Recursively
add_q("Remove All Adjacent Duplicate Characters Recursively", "Medium",
  "Given a string s, remove all adjacent duplicate characters recursively until no adjacent duplicates remain.",
  "s = <string>", "String",
  [{"input": 's = "abbaca"', "output": '"ca"'}, {"input": 's = "azxxzy"', "output": '"ay"'}],
  "Use a stack-based recursive simulation: push characters and pop when top matches current.",
  "Repeat until the string doesn't change.",
  "def solve(s):\n    stack = []\n    for c in s:\n        if stack and stack[-1] == c:\n            stack.pop()\n        else:\n            stack.append(c)\n    return ''.join(stack)",
  "string solve(string s) {\n    string res = \"\";\n    for(char c : s) {\n        if(!res.empty() && res.back() == c) res.pop_back();\n        else res.push_back(c);\n    }\n    return res;\n}",
  "public String solve(String s) {\n    StringBuilder sb = new StringBuilder();\n    for (char c : s.toCharArray()) {\n        int len = sb.length();\n        if (len > 0 && sb.charAt(len - 1) == c) sb.deleteCharAt(len - 1);\n        else sb.append(c);\n    }\n    return sb.toString();\n}",
  "function solve(s) {\n    const stack = [];\n    for (const c of s) {\n        if (stack.length > 0 && stack[stack.length - 1] === c) stack.pop();\n        else stack.push(c);\n    }\n    return stack.join('');\n}",
  "# Solution for Remove All Adjacent Duplicate Characters Recursively\ndef solve(s):\n    # Write your solution here\n    pass",
  "// Solution for Remove All Adjacent Duplicate Characters Recursively\n#include <string>\nusing namespace std;\n\nstring solve(string s) {\n    // Write your solution here\n    return \"\";\n}",
  "// Solution for Remove All Adjacent Duplicate Characters Recursively\nclass Solution {\n    public String solve(String s) {\n        // Write your solution here\n        return \"\";\n    }\n}",
  "// Solution for Remove All Adjacent Duplicate Characters Recursively\nfunction solve(s) {\n    // Write your solution here\n    return \"\";\n}")

with open('scratch/recursion_questions.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2)

print(f"Recursion generated: {len(questions)} questions.")
