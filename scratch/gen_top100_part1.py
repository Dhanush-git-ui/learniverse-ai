#!/usr/bin/env python3
"""
Generator for PrepInsta Top 100 Codes dataset.
Produces a complete top100Data.ts with all questions across 8 categories,
each with: statement, inputFormat, outputFormat, examples, hints, solutions (4 langs), boilerplates.
"""
import json, textwrap

# ─────────────────────────────────────────────────────────────────
# QUESTION DEFINITIONS — organized exactly per PrepInsta categories
# ─────────────────────────────────────────────────────────────────

questions = []
qid = 0

def Q(title, category, difficulty, statement, inputFmt, outputFmt, examples, hint1, hint2, sol_py, sol_cpp, sol_java, sol_js, bp_py=None, bp_cpp=None, bp_java=None, bp_js=None):
    global qid
    qid += 1
    if bp_py is None:
        bp_py = f"# Solution for {title}\\ndef solve(*args):\\n    # Write your solution here\\n    pass"
    if bp_cpp is None:
        bp_cpp = f"// Solution for {title}\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\n// Write your solution here"
    if bp_java is None:
        bp_java = f"// Solution for {title}\\nimport java.util.*;\\nclass Solution {{\\n    // Write your solution here\\n}}"
    if bp_js is None:
        bp_js = f"// Solution for {title}\\nfunction solve() {{\\n    // Write your solution here\\n    return null;\\n}}"
    questions.append({
        "id": qid,
        "title": title,
        "category": category,
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

# ═══════════════════════════════════════════════════════════════
# CATEGORY 1: GETTING STARTED  (28 questions)
# ═══════════════════════════════════════════════════════════════
CAT = "Getting Started"

Q("Positive or Negative Number", CAT, "Easy",
  "Given an integer n, check whether it is positive, negative, or zero.",
  "n = <integer>", "String ('Positive', 'Negative', or 'Zero')",
  [{"input": "n = 5", "output": '"Positive"'}, {"input": "n = -3", "output": '"Negative"'}, {"input": "n = 0", "output": '"Zero"'}],
  "Check if the number is greater than zero.",
  "If it is less than zero, it is negative. Otherwise, it is zero.",
  "def solve(n):\n    if n > 0:\n        return \"Positive\"\n    elif n < 0:\n        return \"Negative\"\n    return \"Zero\"",
  'string solve(int n) {\n    if (n > 0) return "Positive";\n    if (n < 0) return "Negative";\n    return "Zero";\n}',
  'public String solve(int n) {\n    if (n > 0) return "Positive";\n    if (n < 0) return "Negative";\n    return "Zero";\n}',
  'function solve(n) {\n    if (n > 0) return "Positive";\n    if (n < 0) return "Negative";\n    return "Zero";\n}')

Q("Even or Odd Number", CAT, "Easy",
  "Given an integer n, determine if it is even or odd.",
  "n = <integer>", "String ('Even' or 'Odd')",
  [{"input": "n = 4", "output": '"Even"'}, {"input": "n = 9", "output": '"Odd"'}],
  "Use the modulo operator (%) to find the remainder when divided by 2.",
  "If n % 2 equals 0, the number is Even; otherwise, it is Odd.",
  'def solve(n):\n    return "Even" if n % 2 == 0 else "Odd"',
  'string solve(int n) {\n    return (n % 2 == 0) ? "Even" : "Odd";\n}',
  'public String solve(int n) {\n    return (n % 2 == 0) ? "Even" : "Odd";\n}',
  'function solve(n) {\n    return (n % 2 === 0) ? "Even" : "Odd";\n}')

Q("Sum of First N Natural Numbers", CAT, "Easy",
  "Given an integer n, find the sum of first n natural numbers.",
  "n = <integer>", "Integer",
  [{"input": "n = 5", "output": "15"}, {"input": "n = 10", "output": "55"}],
  "You can sum the numbers using a loop from 1 to n.",
  "A more optimal approach is using the formula: n * (n + 1) / 2.",
  "def solve(n):\n    return n * (n + 1) // 2",
  "int solve(int n) {\n    return n * (n + 1) / 2;\n}",
  "public int solve(int n) {\n    return n * (n + 1) / 2;\n}",
  "function solve(n) {\n    return n * (n + 1) / 2;\n}")

Q("Sum of N Natural Numbers", CAT, "Easy",
  "Calculate the sum of natural numbers from 1 up to n using a loop-based approach.",
  "n = <integer>", "Integer",
  [{"input": "n = 6", "output": "21"}, {"input": "n = 3", "output": "6"}],
  "This is identical to calculating the sum of first N natural numbers.",
  "Use a simple loop or the direct multiplication formula.",
  "def solve(n):\n    return sum(range(1, n + 1))",
  "int solve(int n) {\n    int sum = 0;\n    for(int i=1; i<=n; ++i) sum += i;\n    return sum;\n}",
  "public int solve(int n) {\n    int sum = 0;\n    for(int i=1; i<=n; ++i) sum += i;\n    return sum;\n}",
  "function solve(n) {\n    let sum = 0;\n    for(let i=1; i<=n; ++i) sum += i;\n    return sum;\n}")

Q("Sum of Numbers in a Given Range", CAT, "Easy",
  "Given two integers start and end, find the sum of all integers between start and end (inclusive).",
  "start = <integer>, end = <integer>", "Integer",
  [{"input": "start = 2, end = 5", "output": "14"}, {"input": "start = 5, end = 10", "output": "45"}],
  "You can loop from start to end and add each number to a sum variable.",
  "Or, use the sum formula: Sum(1 to end) - Sum(1 to start-1).",
  "def solve(start, end):\n    return sum(range(start, end + 1))",
  "int solve(int start, int end) {\n    int sum = 0;\n    for(int i=start; i<=end; ++i) sum += i;\n    return sum;\n}",
  "public int solve(int start, int end) {\n    int sum = 0;\n    for(int i=start; i<=end; ++i) sum += i;\n    return sum;\n}",
  "function solve(start, end) {\n    let sum = 0;\n    for(let i=start; i<=end; ++i) sum += i;\n    return sum;\n}")

Q("Greatest of Two Numbers", CAT, "Easy",
  "Given two integers a and b, find the greater of the two.",
  "a = <integer>, b = <integer>", "Integer",
  [{"input": "a = 10, b = 20", "output": "20"}, {"input": "a = 7, b = 3", "output": "7"}],
  "Compare a and b using an if-else statement.",
  "Return the larger value directly using the ternary operator or max function.",
  "def solve(a, b):\n    return max(a, b)",
  "int solve(int a, int b) {\n    return (a > b) ? a : b;\n}",
  "public int solve(int a, int b) {\n    return Math.max(a, b);\n}",
  "function solve(a, b) {\n    return Math.max(a, b);\n}")

Q("Greatest of Three Numbers", CAT, "Easy",
  "Given three integers a, b, and c, find the greatest among them.",
  "a = <integer>, b = <integer>, c = <integer>", "Integer",
  [{"input": "a = 10, b = 20, c = 15", "output": "20"}, {"input": "a = 99, b = 50, c = 75", "output": "99"}],
  "Compare a with b, then compare the result with c.",
  "Use nested conditionals or the max() function with all three values.",
  "def solve(a, b, c):\n    return max(a, b, c)",
  "int solve(int a, int b, int c) {\n    return max({a, b, c});\n}",
  "public int solve(int a, int b, int c) {\n    return Math.max(a, Math.max(b, c));\n}",
  "function solve(a, b, c) {\n    return Math.max(a, b, c);\n}")

Q("Leap Year or Not", CAT, "Easy",
  "Given a year, check whether it is a leap year or not.",
  "year = <integer>", "Boolean (true/false)",
  [{"input": "year = 2024", "output": "true"}, {"input": "year = 1900", "output": "false"}, {"input": "year = 2000", "output": "true"}],
  "A year divisible by 4 is generally a leap year.",
  "However, century years must also be divisible by 400 to be a leap year.",
  "def solve(year):\n    return (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)",
  "bool solve(int year) {\n    return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);\n}",
  "public boolean solve(int year) {\n    return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);\n}",
  "function solve(year) {\n    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);\n}")

Q("Prime Number", CAT, "Easy",
  "Given an integer n, check whether it is a prime number or not.",
  "n = <integer>", "Boolean (true/false)",
  [{"input": "n = 7", "output": "true"}, {"input": "n = 10", "output": "false"}, {"input": "n = 1", "output": "false"}],
  "A prime number is divisible only by 1 and itself.",
  "Check divisibility from 2 to sqrt(n) for efficiency.",
  "def solve(n):\n    if n < 2:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True",
  "bool solve(int n) {\n    if (n < 2) return false;\n    for(int i=2; i*i<=n; ++i)\n        if (n % i == 0) return false;\n    return true;\n}",
  "public boolean solve(int n) {\n    if (n < 2) return false;\n    for(int i=2; i*i<=n; ++i)\n        if (n % i == 0) return false;\n    return true;\n}",
  "function solve(n) {\n    if (n < 2) return false;\n    for(let i=2; i*i<=n; ++i)\n        if (n % i === 0) return false;\n    return true;\n}")

Q("Prime Numbers in a Given Range", CAT, "Easy",
  "Given two integers start and end, find all prime numbers in that range (inclusive).",
  "start = <integer>, end = <integer>", "Array of integers",
  [{"input": "start = 10, end = 30", "output": "[11, 13, 17, 19, 23, 29]"}],
  "Write a helper function to check if a number is prime.",
  "Iterate through the range and collect all primes using the helper.",
  "def solve(start, end):\n    def is_prime(n):\n        if n < 2: return False\n        for i in range(2, int(n**0.5)+1):\n            if n % i == 0: return False\n        return True\n    return [x for x in range(start, end+1) if is_prime(x)]",
  "vector<int> solve(int start, int end) {\n    vector<int> res;\n    for(int n=start; n<=end; ++n) {\n        bool prime = n >= 2;\n        for(int i=2; i*i<=n; ++i)\n            if(n%i==0) { prime=false; break; }\n        if(prime) res.push_back(n);\n    }\n    return res;\n}",
  "public List<Integer> solve(int start, int end) {\n    List<Integer> res = new ArrayList<>();\n    for(int n=start; n<=end; ++n) {\n        boolean prime = n >= 2;\n        for(int i=2; i*i<=n; ++i)\n            if(n%i==0) { prime=false; break; }\n        if(prime) res.add(n);\n    }\n    return res;\n}",
  "function solve(start, end) {\n    const res = [];\n    for(let n=start; n<=end; ++n) {\n        let prime = n >= 2;\n        for(let i=2; i*i<=n; ++i)\n            if(n%i===0) { prime=false; break; }\n        if(prime) res.push(n);\n    }\n    return res;\n}")

Q("Sum of Digits of a Number", CAT, "Easy",
  "Given a non-negative integer n, find the sum of its digits.",
  "n = <integer>", "Integer",
  [{"input": "n = 1234", "output": "10"}, {"input": "n = 9999", "output": "36"}],
  "Extract the last digit using n % 10, then remove it using n // 10.",
  "Repeat until n becomes 0, accumulating the sum of extracted digits.",
  "def solve(n):\n    s = 0\n    n = abs(n)\n    while n > 0:\n        s += n % 10\n        n //= 10\n    return s",
  "int solve(int n) {\n    int s = 0;\n    n = abs(n);\n    while(n > 0) {\n        s += n % 10;\n        n /= 10;\n    }\n    return s;\n}",
  "public int solve(int n) {\n    int s = 0;\n    n = Math.abs(n);\n    while(n > 0) {\n        s += n % 10;\n        n /= 10;\n    }\n    return s;\n}",
  "function solve(n) {\n    let s = 0;\n    n = Math.abs(n);\n    while(n > 0) {\n        s += n % 10;\n        n = Math.floor(n / 10);\n    }\n    return s;\n}")

Q("Reverse of a Number", CAT, "Easy",
  "Given an integer n, reverse its digits and return the reversed number.",
  "n = <integer>", "Integer",
  [{"input": "n = 1234", "output": "4321"}, {"input": "n = 900", "output": "9"}],
  "Extract digits one by one from the end using modulo.",
  "Build the reversed number by multiplying the current result by 10 and adding the extracted digit.",
  "def solve(n):\n    rev = 0\n    neg = n < 0\n    n = abs(n)\n    while n > 0:\n        rev = rev * 10 + n % 10\n        n //= 10\n    return -rev if neg else rev",
  "int solve(int n) {\n    int rev = 0;\n    bool neg = n < 0;\n    n = abs(n);\n    while(n > 0) {\n        rev = rev * 10 + n % 10;\n        n /= 10;\n    }\n    return neg ? -rev : rev;\n}",
  "public int solve(int n) {\n    int rev = 0;\n    boolean neg = n < 0;\n    n = Math.abs(n);\n    while(n > 0) {\n        rev = rev * 10 + n % 10;\n        n /= 10;\n    }\n    return neg ? -rev : rev;\n}",
  "function solve(n) {\n    let rev = 0;\n    const neg = n < 0;\n    n = Math.abs(n);\n    while(n > 0) {\n        rev = rev * 10 + n % 10;\n        n = Math.floor(n / 10);\n    }\n    return neg ? -rev : rev;\n}")

Q("Palindrome Number", CAT, "Easy",
  "Given an integer n, check whether it is a palindrome number (reads the same forwards and backwards).",
  "n = <integer>", "Boolean (true/false)",
  [{"input": "n = 121", "output": "true"}, {"input": "n = 123", "output": "false"}],
  "Reverse the number and compare with the original.",
  "Negative numbers are never palindromes.",
  "def solve(n):\n    if n < 0: return False\n    return str(n) == str(n)[::-1]",
  "bool solve(int n) {\n    if(n < 0) return false;\n    int orig = n, rev = 0;\n    while(n > 0) { rev = rev*10 + n%10; n /= 10; }\n    return orig == rev;\n}",
  "public boolean solve(int n) {\n    if(n < 0) return false;\n    int orig = n, rev = 0;\n    while(n > 0) { rev = rev*10 + n%10; n /= 10; }\n    return orig == rev;\n}",
  "function solve(n) {\n    if(n < 0) return false;\n    const s = n.toString();\n    return s === s.split('').reverse().join('');\n}")

Q("Armstrong Number", CAT, "Easy",
  "Given a number n, check if it is an Armstrong number. An Armstrong number of k digits is a number where the sum of each digit raised to the power k equals the number itself.",
  "n = <integer>", "Boolean (true/false)",
  [{"input": "n = 153", "output": "true", "explanation": "1^3 + 5^3 + 3^3 = 1 + 125 + 27 = 153"}, {"input": "n = 370", "output": "true"}, {"input": "n = 123", "output": "false"}],
  "Count the number of digits first, then compute the sum of each digit raised to that power.",
  "Compare the computed sum with the original number.",
  "def solve(n):\n    digits = str(abs(n))\n    k = len(digits)\n    return sum(int(d)**k for d in digits) == abs(n)",
  "bool solve(int n) {\n    if(n < 0) return false;\n    int orig = n, k = 0, temp = n;\n    while(temp > 0) { k++; temp /= 10; }\n    long long sum = 0;\n    temp = n;\n    while(temp > 0) {\n        int d = temp % 10;\n        long long p = 1;\n        for(int i=0; i<k; ++i) p *= d;\n        sum += p;\n        temp /= 10;\n    }\n    return sum == orig;\n}",
  "public boolean solve(int n) {\n    if(n < 0) return false;\n    String s = String.valueOf(n);\n    int k = s.length();\n    long sum = 0;\n    for(char c : s.toCharArray())\n        sum += Math.pow(c - '0', k);\n    return sum == n;\n}",
  "function solve(n) {\n    if(n < 0) return false;\n    const s = n.toString();\n    const k = s.length;\n    const sum = s.split('').reduce((acc, d) => acc + Math.pow(parseInt(d), k), 0);\n    return sum === n;\n}")

Q("Armstrong Numbers in a Given Range", CAT, "Easy",
  "Given two integers start and end, find all Armstrong numbers in that range.",
  "start = <integer>, end = <integer>", "Array of integers",
  [{"input": "start = 1, end = 500", "output": "[1, 2, 3, 4, 5, 6, 7, 8, 9, 153, 370, 371, 407]"}],
  "Reuse the Armstrong number check for each number in the range.",
  "Iterate from start to end and collect all matching numbers.",
  "def solve(start, end):\n    def is_armstrong(n):\n        digits = str(n)\n        k = len(digits)\n        return sum(int(d)**k for d in digits) == n\n    return [x for x in range(start, end+1) if is_armstrong(x)]",
  "vector<int> solve(int start, int end) {\n    vector<int> res;\n    for(int n=start; n<=end; ++n) {\n        int orig=n, k=0, temp=n;\n        while(temp>0){k++;temp/=10;}\n        long long sum=0; temp=n;\n        while(temp>0){int d=temp%10;long long p=1;for(int i=0;i<k;++i)p*=d;sum+=p;temp/=10;}\n        if(sum==orig) res.push_back(n);\n    }\n    return res;\n}",
  "public List<Integer> solve(int start, int end) {\n    List<Integer> res = new ArrayList<>();\n    for(int n=start; n<=end; ++n) {\n        String s = String.valueOf(n);\n        int k = s.length();\n        long sum = 0;\n        for(char c : s.toCharArray()) sum += Math.pow(c-'0', k);\n        if(sum == n) res.add(n);\n    }\n    return res;\n}",
  "function solve(start, end) {\n    const res = [];\n    for(let n=start; n<=end; ++n) {\n        const s = n.toString();\n        const k = s.length;\n        const sum = s.split('').reduce((a,d) => a + Math.pow(+d,k), 0);\n        if(sum === n) res.push(n);\n    }\n    return res;\n}")

Q("Fibonacci Series up to N Terms", CAT, "Easy",
  "Given an integer n, print the Fibonacci series up to the nth term.",
  "n = <integer>", "Array of integers",
  [{"input": "n = 7", "output": "[0, 1, 1, 2, 3, 5, 8]"}],
  "Start with 0 and 1, then each subsequent number is the sum of the previous two.",
  "Use a loop and keep track of the last two numbers.",
  "def solve(n):\n    if n <= 0: return []\n    if n == 1: return [0]\n    fib = [0, 1]\n    for i in range(2, n):\n        fib.append(fib[-1] + fib[-2])\n    return fib",
  "vector<int> solve(int n) {\n    if(n<=0) return {};\n    vector<int> fib = {0};\n    if(n==1) return fib;\n    fib.push_back(1);\n    for(int i=2;i<n;++i) fib.push_back(fib[i-1]+fib[i-2]);\n    return fib;\n}",
  "public List<Integer> solve(int n) {\n    List<Integer> fib = new ArrayList<>();\n    if(n<=0) return fib;\n    fib.add(0);\n    if(n==1) return fib;\n    fib.add(1);\n    for(int i=2;i<n;++i) fib.add(fib.get(i-1)+fib.get(i-2));\n    return fib;\n}",
  "function solve(n) {\n    if(n<=0) return [];\n    const fib = [0];\n    if(n===1) return fib;\n    fib.push(1);\n    for(let i=2;i<n;++i) fib.push(fib[i-1]+fib[i-2]);\n    return fib;\n}")

Q("Find the Nth Fibonacci Number", CAT, "Easy",
  "Given an integer n, find the Nth term of the Fibonacci series (0-indexed: F(0)=0, F(1)=1).",
  "n = <integer>", "Integer",
  [{"input": "n = 6", "output": "8"}, {"input": "n = 10", "output": "55"}],
  "Build the Fibonacci sequence iteratively up to n.",
  "Only keep track of the last two values to save memory.",
  "def solve(n):\n    if n <= 0: return 0\n    if n == 1: return 1\n    a, b = 0, 1\n    for _ in range(2, n+1):\n        a, b = b, a+b\n    return b",
  "int solve(int n) {\n    if(n<=0) return 0;\n    if(n==1) return 1;\n    int a=0, b=1;\n    for(int i=2;i<=n;++i) { int t=a+b; a=b; b=t; }\n    return b;\n}",
  "public int solve(int n) {\n    if(n<=0) return 0;\n    if(n==1) return 1;\n    int a=0, b=1;\n    for(int i=2;i<=n;++i) { int t=a+b; a=b; b=t; }\n    return b;\n}",
  "function solve(n) {\n    if(n<=0) return 0;\n    if(n===1) return 1;\n    let a=0, b=1;\n    for(let i=2;i<=n;++i) { [a,b] = [b, a+b]; }\n    return b;\n}")

Q("Factorial of a Number", CAT, "Easy",
  "Given a non-negative integer n, calculate its factorial (n!).",
  "n = <integer>", "Integer",
  [{"input": "n = 5", "output": "120"}, {"input": "n = 0", "output": "1"}],
  "Factorial of n = n * (n-1) * (n-2) * ... * 1.",
  "Use a loop multiplying from 1 to n, or use recursion.",
  "def solve(n):\n    result = 1\n    for i in range(2, n+1):\n        result *= i\n    return result",
  "long long solve(int n) {\n    long long result = 1;\n    for(int i=2; i<=n; ++i) result *= i;\n    return result;\n}",
  "public long solve(int n) {\n    long result = 1;\n    for(int i=2; i<=n; ++i) result *= i;\n    return result;\n}",
  "function solve(n) {\n    let result = 1;\n    for(let i=2; i<=n; ++i) result *= i;\n    return result;\n}")

Q("Power of a Number", CAT, "Easy",
  "Given a base and an exponent, calculate base raised to the power of exponent.",
  "base = <integer>, exp = <integer>", "Integer",
  [{"input": "base = 2, exp = 10", "output": "1024"}, {"input": "base = 3, exp = 4", "output": "81"}],
  "Multiply base by itself exp times.",
  "For efficiency, use fast exponentiation: if exp is even, square the base and halve exp.",
  "def solve(base, exp):\n    return base ** exp",
  "long long solve(int base, int exp) {\n    long long result = 1;\n    for(int i=0; i<exp; ++i) result *= base;\n    return result;\n}",
  "public long solve(int base, int exp) {\n    return (long)Math.pow(base, exp);\n}",
  "function solve(base, exp) {\n    return Math.pow(base, exp);\n}")

Q("Factors of a Number", CAT, "Easy",
  "Given a positive integer n, find all factors of n.",
  "n = <integer>", "Array of integers",
  [{"input": "n = 12", "output": "[1, 2, 3, 4, 6, 12]"}, {"input": "n = 7", "output": "[1, 7]"}],
  "A factor of n is any number that divides n evenly.",
  "Check all numbers from 1 to n, or optimize by checking up to sqrt(n).",
  "def solve(n):\n    factors = []\n    for i in range(1, n+1):\n        if n % i == 0:\n            factors.append(i)\n    return factors",
  "vector<int> solve(int n) {\n    vector<int> factors;\n    for(int i=1; i<=n; ++i)\n        if(n%i==0) factors.push_back(i);\n    return factors;\n}",
  "public List<Integer> solve(int n) {\n    List<Integer> factors = new ArrayList<>();\n    for(int i=1; i<=n; ++i)\n        if(n%i==0) factors.add(i);\n    return factors;\n}",
  "function solve(n) {\n    const factors = [];\n    for(let i=1; i<=n; ++i)\n        if(n%i===0) factors.push(i);\n    return factors;\n}")

Q("Prime Factors of a Number", CAT, "Easy",
  "Given a positive integer n, find all its prime factors.",
  "n = <integer>", "Array of integers",
  [{"input": "n = 12", "output": "[2, 3]"}, {"input": "n = 30", "output": "[2, 3, 5]"}],
  "Divide n by 2 repeatedly, then check odd numbers up to sqrt(n).",
  "Each time n is divisible, that divisor is a prime factor. Add it and keep dividing.",
  "def solve(n):\n    factors = []\n    d = 2\n    while d * d <= n:\n        if n % d == 0:\n            factors.append(d)\n            while n % d == 0:\n                n //= d\n        d += 1\n    if n > 1:\n        factors.append(n)\n    return factors",
  "vector<int> solve(int n) {\n    vector<int> factors;\n    for(int d=2; d*d<=n; ++d) {\n        if(n%d==0) {\n            factors.push_back(d);\n            while(n%d==0) n/=d;\n        }\n    }\n    if(n>1) factors.push_back(n);\n    return factors;\n}",
  "public List<Integer> solve(int n) {\n    List<Integer> factors = new ArrayList<>();\n    for(int d=2; d*d<=n; ++d) {\n        if(n%d==0) {\n            factors.add(d);\n            while(n%d==0) n/=d;\n        }\n    }\n    if(n>1) factors.add(n);\n    return factors;\n}",
  "function solve(n) {\n    const factors = [];\n    for(let d=2; d*d<=n; ++d) {\n        if(n%d===0) {\n            factors.push(d);\n            while(n%d===0) n = Math.floor(n/d);\n        }\n    }\n    if(n>1) factors.push(n);\n    return factors;\n}")

Q("Strong Number", CAT, "Easy",
  "A Strong Number is a number whose sum of factorial of digits equals the number itself. Check if n is a Strong Number.",
  "n = <integer>", "Boolean (true/false)",
  [{"input": "n = 145", "output": "true", "explanation": "1! + 4! + 5! = 1 + 24 + 120 = 145"}, {"input": "n = 123", "output": "false"}],
  "Compute the factorial of each digit and sum them up.",
  "Compare the sum with the original number.",
  "def solve(n):\n    import math\n    return sum(math.factorial(int(d)) for d in str(n)) == n",
  "bool solve(int n) {\n    int orig = n, sum = 0;\n    while(n > 0) {\n        int d = n%10, f = 1;\n        for(int i=2;i<=d;++i) f*=i;\n        sum += f;\n        n /= 10;\n    }\n    return sum == orig;\n}",
  "public boolean solve(int n) {\n    int orig = n, sum = 0;\n    while(n > 0) {\n        int d = n%10, f = 1;\n        for(int i=2;i<=d;++i) f*=i;\n        sum += f;\n        n /= 10;\n    }\n    return sum == orig;\n}",
  "function solve(n) {\n    const factorial = d => { let f=1; for(let i=2;i<=d;++i) f*=i; return f; };\n    const sum = n.toString().split('').reduce((a,d) => a + factorial(+d), 0);\n    return sum === n;\n}")

Q("Perfect Number", CAT, "Easy",
  "A Perfect Number equals the sum of its proper divisors (excluding itself). Check if n is perfect.",
  "n = <integer>", "Boolean (true/false)",
  [{"input": "n = 28", "output": "true", "explanation": "1+2+4+7+14=28"}, {"input": "n = 12", "output": "false"}],
  "Find all divisors of n except n itself.",
  "Sum them up and check if the sum equals n.",
  "def solve(n):\n    if n <= 1: return False\n    return sum(i for i in range(1, n) if n % i == 0) == n",
  "bool solve(int n) {\n    if(n<=1) return false;\n    int sum=1;\n    for(int i=2;i*i<=n;++i)\n        if(n%i==0) { sum+=i; if(i!=n/i) sum+=n/i; }\n    return sum==n;\n}",
  "public boolean solve(int n) {\n    if(n<=1) return false;\n    int sum=1;\n    for(int i=2;i*i<=n;++i)\n        if(n%i==0) { sum+=i; if(i!=n/i) sum+=n/i; }\n    return sum==n;\n}",
  "function solve(n) {\n    if(n<=1) return false;\n    let sum=1;\n    for(let i=2;i*i<=n;++i)\n        if(n%i===0) { sum+=i; if(i!==n/i) sum+=n/i; }\n    return sum===n;\n}")

Q("Perfect Square", CAT, "Easy",
  "Check whether a given number n is a perfect square.",
  "n = <integer>", "Boolean (true/false)",
  [{"input": "n = 25", "output": "true"}, {"input": "n = 14", "output": "false"}],
  "Find the integer square root and check if squaring it gives n.",
  "Use math.isqrt() or cast sqrt to int and verify.",
  "def solve(n):\n    if n < 0: return False\n    r = int(n**0.5)\n    return r*r == n",
  "bool solve(int n) {\n    if(n<0) return false;\n    int r = (int)sqrt(n);\n    return r*r == n;\n}",
  "public boolean solve(int n) {\n    if(n<0) return false;\n    int r = (int)Math.sqrt(n);\n    return r*r == n;\n}",
  "function solve(n) {\n    if(n<0) return false;\n    const r = Math.floor(Math.sqrt(n));\n    return r*r === n;\n}")

Q("Automorphic Number", CAT, "Easy",
  "An Automorphic Number is a number whose square ends with the number itself. Check if n is automorphic.",
  "n = <integer>", "Boolean (true/false)",
  [{"input": "n = 25", "output": "true", "explanation": "25^2 = 625, ends with 25"}, {"input": "n = 7", "output": "false"}],
  "Calculate n*n and check if it ends with n.",
  "Convert to string and use endswith, or use modular arithmetic.",
  "def solve(n):\n    sq = n * n\n    return str(sq).endswith(str(n))",
  "bool solve(int n) {\n    long long sq = (long long)n * n;\n    int digits = 1, temp = n;\n    while(temp > 0) { digits *= 10; temp /= 10; }\n    return sq % digits == n;\n}",
  "public boolean solve(int n) {\n    long sq = (long)n * n;\n    return String.valueOf(sq).endsWith(String.valueOf(n));\n}",
  "function solve(n) {\n    const sq = n * n;\n    return sq.toString().endsWith(n.toString());\n}")

Q("Harshad Number", CAT, "Easy",
  "A Harshad (Niven) Number is divisible by the sum of its digits. Check if n is a Harshad Number.",
  "n = <integer>", "Boolean (true/false)",
  [{"input": "n = 18", "output": "true", "explanation": "1+8=9, 18/9=2"}, {"input": "n = 14", "output": "false"}],
  "Compute the sum of digits of n.",
  "Check if n is divisible by that sum.",
  "def solve(n):\n    if n <= 0: return False\n    digit_sum = sum(int(d) for d in str(n))\n    return n % digit_sum == 0",
  "bool solve(int n) {\n    if(n<=0) return false;\n    int sum=0, temp=n;\n    while(temp>0) { sum+=temp%10; temp/=10; }\n    return n%sum==0;\n}",
  "public boolean solve(int n) {\n    if(n<=0) return false;\n    int sum=0, temp=n;\n    while(temp>0) { sum+=temp%10; temp/=10; }\n    return n%sum==0;\n}",
  "function solve(n) {\n    if(n<=0) return false;\n    const sum = n.toString().split('').reduce((a,d) => a + +d, 0);\n    return n % sum === 0;\n}")

Q("Abundant Number", CAT, "Easy",
  "An Abundant Number is a number where the sum of its proper divisors is greater than the number itself. Check if n is abundant.",
  "n = <integer>", "Boolean (true/false)",
  [{"input": "n = 12", "output": "true", "explanation": "1+2+3+4+6=16 > 12"}, {"input": "n = 15", "output": "false"}],
  "Find all proper divisors (divisors less than n).",
  "Sum them and check if the sum exceeds n.",
  "def solve(n):\n    if n <= 1: return False\n    s = sum(i for i in range(1, n) if n % i == 0)\n    return s > n",
  "bool solve(int n) {\n    if(n<=1) return false;\n    int sum=1;\n    for(int i=2;i*i<=n;++i)\n        if(n%i==0) { sum+=i; if(i!=n/i) sum+=n/i; }\n    return sum>n;\n}",
  "public boolean solve(int n) {\n    if(n<=1) return false;\n    int sum=1;\n    for(int i=2;i*i<=n;++i)\n        if(n%i==0) { sum+=i; if(i!=n/i) sum+=n/i; }\n    return sum>n;\n}",
  "function solve(n) {\n    if(n<=1) return false;\n    let sum=1;\n    for(let i=2;i*i<=n;++i)\n        if(n%i===0) { sum+=i; if(i!==n/i) sum+=n/i; }\n    return sum>n;\n}")

Q("Friendly Pair", CAT, "Medium",
  "Two numbers are a Friendly Pair if the ratio of the sum of divisors to the number is the same for both. Check if (a, b) is a friendly pair.",
  "a = <integer>, b = <integer>", "Boolean (true/false)",
  [{"input": "a = 6, b = 28", "output": "true", "explanation": "σ(6)/6 = 12/6 = 2, σ(28)/28 = 56/28 = 2"}, {"input": "a = 3, b = 5", "output": "false"}],
  "Calculate σ(n) — the sum of ALL divisors including n — for both numbers.",
  "Check if σ(a)/a equals σ(b)/b. Use cross-multiplication to avoid floating point: σ(a)*b == σ(b)*a.",
  "def solve(a, b):\n    def sigma(n):\n        s = 0\n        for i in range(1, n+1):\n            if n % i == 0: s += i\n        return s\n    return sigma(a) * b == sigma(b) * a",
  "bool solve(int a, int b) {\n    auto sigma = [](int n) {\n        int s=0;\n        for(int i=1;i<=n;++i) if(n%i==0) s+=i;\n        return s;\n    };\n    return (long long)sigma(a)*b == (long long)sigma(b)*a;\n}",
  "public boolean solve(int a, int b) {\n    int sa = 0, sb = 0;\n    for(int i=1;i<=a;++i) if(a%i==0) sa+=i;\n    for(int i=1;i<=b;++i) if(b%i==0) sb+=i;\n    return (long)sa*b == (long)sb*a;\n}",
  "function solve(a, b) {\n    const sigma = n => { let s=0; for(let i=1;i<=n;++i) if(n%i===0) s+=i; return s; };\n    return sigma(a)*b === sigma(b)*a;\n}")

print(f"[CAT 1] Getting Started: {qid} questions")

# ═══════════════════════════════════════════════════════════════
# CATEGORY 2: WORKING WITH NUMBERS  (26 questions)
# ═══════════════════════════════════════════════════════════════
CAT = "Working with Numbers"

Q("Highest Common Factor (HCF)", CAT, "Easy",
  "Given two integers a and b, find their Highest Common Factor (HCF) / Greatest Common Divisor (GCD).",
  "a = <integer>, b = <integer>", "Integer",
  [{"input": "a = 12, b = 18", "output": "6"}, {"input": "a = 7, b = 13", "output": "1"}],
  "The HCF is the largest number that divides both a and b.",
  "Use the Euclidean algorithm: HCF(a,b) = HCF(b, a%b) until b becomes 0.",
  "def solve(a, b):\n    while b:\n        a, b = b, a % b\n    return a",
  "int solve(int a, int b) {\n    while(b) { int t = b; b = a%b; a = t; }\n    return a;\n}",
  "public int solve(int a, int b) {\n    while(b != 0) { int t = b; b = a%b; a = t; }\n    return a;\n}",
  "function solve(a, b) {\n    while(b) { [a, b] = [b, a%b]; }\n    return a;\n}")

Q("Lowest Common Multiple (LCM)", CAT, "Easy",
  "Given two integers a and b, find their Lowest Common Multiple (LCM).",
  "a = <integer>, b = <integer>", "Integer",
  [{"input": "a = 4, b = 6", "output": "12"}, {"input": "a = 3, b = 7", "output": "21"}],
  "LCM(a, b) = (a * b) / GCD(a, b).",
  "First compute GCD using the Euclidean algorithm, then derive LCM.",
  "def solve(a, b):\n    def gcd(x, y):\n        while y: x, y = y, x%y\n        return x\n    return a * b // gcd(a, b)",
  "int solve(int a, int b) {\n    int x=a, y=b;\n    while(y) { int t=y; y=x%y; x=t; }\n    return a / x * b;\n}",
  "public int solve(int a, int b) {\n    int x=a, y=b;\n    while(y!=0) { int t=y; y=x%y; x=t; }\n    return a / x * b;\n}",
  "function solve(a, b) {\n    let x=a, y=b;\n    while(y) { [x,y] = [y, x%y]; }\n    return a / x * b;\n}")

Q("Greatest Common Divisor", CAT, "Easy",
  "Given two positive integers, find the GCD using the Euclidean algorithm.",
  "a = <integer>, b = <integer>", "Integer",
  [{"input": "a = 54, b = 24", "output": "6"}, {"input": "a = 100, b = 75", "output": "25"}],
  "Repeatedly replace the larger number with the remainder of dividing the two.",
  "When one number becomes 0, the other is the GCD.",
  "def solve(a, b):\n    while b:\n        a, b = b, a % b\n    return abs(a)",
  "int solve(int a, int b) {\n    a = abs(a); b = abs(b);\n    while(b) { int t=b; b=a%b; a=t; }\n    return a;\n}",
  "public int solve(int a, int b) {\n    a = Math.abs(a); b = Math.abs(b);\n    while(b != 0) { int t=b; b=a%b; a=t; }\n    return a;\n}",
  "function solve(a, b) {\n    a = Math.abs(a); b = Math.abs(b);\n    while(b) { [a,b] = [b, a%b]; }\n    return a;\n}")

Q("Binary to Decimal Conversion", CAT, "Easy",
  "Convert a binary number (given as a string) to its decimal equivalent.",
  "binary = <string>", "Integer",
  [{"input": 'binary = "1010"', "output": "10"}, {"input": 'binary = "11111"', "output": "31"}],
  "Each digit in binary represents a power of 2, starting from the rightmost digit.",
  "Multiply each digit by 2^position and sum them up.",
  "def solve(binary):\n    return int(binary, 2)",
  'int solve(string binary) {\n    int result = 0;\n    for(char c : binary) result = result*2 + (c-\'0\');\n    return result;\n}',
  "public int solve(String binary) {\n    return Integer.parseInt(binary, 2);\n}",
  "function solve(binary) {\n    return parseInt(binary, 2);\n}")

Q("Octal to Decimal Conversion", CAT, "Easy",
  "Convert an octal number (given as a string) to its decimal equivalent.",
  "octal = <string>", "Integer",
  [{"input": 'octal = "17"', "output": "15"}, {"input": 'octal = "77"', "output": "63"}],
  "Each digit in octal represents a power of 8.",
  "Multiply each digit by 8^position and sum them up.",
  "def solve(octal):\n    return int(octal, 8)",
  "int solve(string octal) {\n    int result = 0;\n    for(char c : octal) result = result*8 + (c-'0');\n    return result;\n}",
  "public int solve(String octal) {\n    return Integer.parseInt(octal, 8);\n}",
  "function solve(octal) {\n    return parseInt(octal, 8);\n}")

Q("Hexadecimal to Decimal Conversion", CAT, "Easy",
  "Convert a hexadecimal number (given as a string) to its decimal equivalent.",
  "hex = <string>", "Integer",
  [{"input": 'hex = "1A"', "output": "26"}, {"input": 'hex = "FF"', "output": "255"}],
  "Each hex digit represents a power of 16. A=10, B=11, ..., F=15.",
  "Use built-in parsing or manual computation with powers of 16.",
  "def solve(hex_str):\n    return int(hex_str, 16)",
  "int solve(string hex) {\n    int result = 0;\n    for(char c : hex) {\n        result *= 16;\n        if(c>='0'&&c<='9') result += c-'0';\n        else if(c>='A'&&c<='F') result += c-'A'+10;\n        else if(c>='a'&&c<='f') result += c-'a'+10;\n    }\n    return result;\n}",
  "public int solve(String hex) {\n    return Integer.parseInt(hex, 16);\n}",
  "function solve(hex) {\n    return parseInt(hex, 16);\n}")

Q("Decimal to Binary Conversion", CAT, "Easy",
  "Convert a decimal integer to its binary string representation.",
  "n = <integer>", "String",
  [{"input": "n = 10", "output": '"1010"'}, {"input": "n = 255", "output": '"11111111"'}],
  "Repeatedly divide by 2 and collect remainders.",
  "Reverse the collected remainders to get the binary representation.",
  "def solve(n):\n    if n == 0: return '0'\n    result = ''\n    while n > 0:\n        result = str(n % 2) + result\n        n //= 2\n    return result",
  "string solve(int n) {\n    if(n==0) return \"0\";\n    string result = \"\";\n    while(n>0) { result = char('0'+n%2) + result; n/=2; }\n    return result;\n}",
  "public String solve(int n) {\n    return Integer.toBinaryString(n);\n}",
  "function solve(n) {\n    return n.toString(2);\n}")

Q("Decimal to Octal Conversion", CAT, "Easy",
  "Convert a decimal integer to its octal string representation.",
  "n = <integer>", "String",
  [{"input": "n = 15", "output": '"17"'}, {"input": "n = 100", "output": '"144"'}],
  "Repeatedly divide by 8 and collect remainders.",
  "Reverse the collected remainders to get the octal representation.",
  "def solve(n):\n    if n == 0: return '0'\n    result = ''\n    while n > 0:\n        result = str(n % 8) + result\n        n //= 8\n    return result",
  "string solve(int n) {\n    if(n==0) return \"0\";\n    string result = \"\";\n    while(n>0) { result = char('0'+n%8) + result; n/=8; }\n    return result;\n}",
  "public String solve(int n) {\n    return Integer.toOctalString(n);\n}",
  "function solve(n) {\n    return n.toString(8);\n}")

Q("Decimal to Hexadecimal Conversion", CAT, "Easy",
  "Convert a decimal integer to its hexadecimal string representation.",
  "n = <integer>", "String",
  [{"input": "n = 255", "output": '"FF"'}, {"input": "n = 26", "output": '"1A"'}],
  "Repeatedly divide by 16 and map remainders to hex digits.",
  "0-9 stay the same, 10=A, 11=B, ..., 15=F.",
  "def solve(n):\n    if n == 0: return '0'\n    digits = '0123456789ABCDEF'\n    result = ''\n    while n > 0:\n        result = digits[n % 16] + result\n        n //= 16\n    return result",
  "string solve(int n) {\n    if(n==0) return \"0\";\n    string hex = \"0123456789ABCDEF\", result = \"\";\n    while(n>0) { result = hex[n%16] + result; n/=16; }\n    return result;\n}",
  "public String solve(int n) {\n    return Integer.toHexString(n).toUpperCase();\n}",
  "function solve(n) {\n    return n.toString(16).toUpperCase();\n}")

Q("Binary to Octal Conversion", CAT, "Easy",
  "Convert a binary string to its octal string representation.",
  "binary = <string>", "String",
  [{"input": 'binary = "110101"', "output": '"65"'}, {"input": 'binary = "1010"', "output": '"12"'}],
  "First convert binary to decimal, then decimal to octal.",
  "Or group binary digits in sets of 3 from the right and convert each group.",
  "def solve(binary):\n    decimal = int(binary, 2)\n    if decimal == 0: return '0'\n    result = ''\n    while decimal > 0:\n        result = str(decimal % 8) + result\n        decimal //= 8\n    return result",
  "string solve(string binary) {\n    int dec = 0;\n    for(char c : binary) dec = dec*2 + (c-'0');\n    if(dec==0) return \"0\";\n    string result = \"\";\n    while(dec>0) { result = char('0'+dec%8) + result; dec/=8; }\n    return result;\n}",
  "public String solve(String binary) {\n    int dec = Integer.parseInt(binary, 2);\n    return Integer.toOctalString(dec);\n}",
  "function solve(binary) {\n    return parseInt(binary, 2).toString(8);\n}")

Q("Octal to Binary Conversion", CAT, "Easy",
  "Convert an octal string to its binary string representation.",
  "octal = <string>", "String",
  [{"input": 'octal = "17"', "output": '"1111"'}, {"input": 'octal = "65"', "output": '"110101"'}],
  "Convert octal to decimal first, then decimal to binary.",
  "Or convert each octal digit to a 3-digit binary group.",
  "def solve(octal):\n    decimal = int(octal, 8)\n    if decimal == 0: return '0'\n    return bin(decimal)[2:]",
  "string solve(string octal) {\n    int dec = 0;\n    for(char c : octal) dec = dec*8 + (c-'0');\n    if(dec==0) return \"0\";\n    string result = \"\";\n    while(dec>0) { result = char('0'+dec%2) + result; dec/=2; }\n    return result;\n}",
  "public String solve(String octal) {\n    int dec = Integer.parseInt(octal, 8);\n    return Integer.toBinaryString(dec);\n}",
  "function solve(octal) {\n    return parseInt(octal, 8).toString(2);\n}")

Q("Quadrants of a Coordinate", CAT, "Easy",
  "Given x and y coordinates, determine which quadrant the point lies in (1-4), or if it is on an axis.",
  "x = <integer>, y = <integer>", "String",
  [{"input": "x = 3, y = 5", "output": '"Quadrant 1"'}, {"input": "x = -2, y = 3", "output": '"Quadrant 2"'}],
  "Quadrant 1: x>0 and y>0. Quadrant 2: x<0 and y>0.",
  "Quadrant 3: x<0 and y<0. Quadrant 4: x>0 and y<0. If x or y is 0, it's on an axis.",
  'def solve(x, y):\n    if x == 0 or y == 0: return "Origin or Axis"\n    if x > 0 and y > 0: return "Quadrant 1"\n    if x < 0 and y > 0: return "Quadrant 2"\n    if x < 0 and y < 0: return "Quadrant 3"\n    return "Quadrant 4"',
  'string solve(int x, int y) {\n    if(x==0||y==0) return "Origin or Axis";\n    if(x>0&&y>0) return "Quadrant 1";\n    if(x<0&&y>0) return "Quadrant 2";\n    if(x<0&&y<0) return "Quadrant 3";\n    return "Quadrant 4";\n}',
  'public String solve(int x, int y) {\n    if(x==0||y==0) return "Origin or Axis";\n    if(x>0&&y>0) return "Quadrant 1";\n    if(x<0&&y>0) return "Quadrant 2";\n    if(x<0&&y<0) return "Quadrant 3";\n    return "Quadrant 4";\n}',
  'function solve(x, y) {\n    if(x===0||y===0) return "Origin or Axis";\n    if(x>0&&y>0) return "Quadrant 1";\n    if(x<0&&y>0) return "Quadrant 2";\n    if(x<0&&y<0) return "Quadrant 3";\n    return "Quadrant 4";\n}')

Q("Permutations (nPr)", CAT, "Easy",
  "Given n people and r seats, find the number of ways n people can occupy r seats (nPr = n! / (n-r)!).",
  "n = <integer>, r = <integer>", "Integer",
  [{"input": "n = 5, r = 3", "output": "60"}, {"input": "n = 10, r = 2", "output": "90"}],
  "nPr = n! / (n-r)!. This counts ordered arrangements.",
  "You can compute this by multiplying n * (n-1) * ... * (n-r+1).",
  "def solve(n, r):\n    result = 1\n    for i in range(n, n-r, -1):\n        result *= i\n    return result",
  "long long solve(int n, int r) {\n    long long result = 1;\n    for(int i=n; i>n-r; --i) result *= i;\n    return result;\n}",
  "public long solve(int n, int r) {\n    long result = 1;\n    for(int i=n; i>n-r; --i) result *= i;\n    return result;\n}",
  "function solve(n, r) {\n    let result = 1;\n    for(let i=n; i>n-r; --i) result *= i;\n    return result;\n}")

Q("Maximum Number of Handshakes", CAT, "Easy",
  "Given n people in a room, find the maximum number of handshakes possible if every person shakes hands with every other person exactly once.",
  "n = <integer>", "Integer",
  [{"input": "n = 5", "output": "10"}, {"input": "n = 10", "output": "45"}],
  "Each person shakes hands with (n-1) others, but each handshake is counted twice.",
  "Formula: n * (n - 1) / 2 (this is nC2).",
  "def solve(n):\n    return n * (n - 1) // 2",
  "int solve(int n) {\n    return n * (n - 1) / 2;\n}",
  "public int solve(int n) {\n    return n * (n - 1) / 2;\n}",
  "function solve(n) {\n    return n * (n - 1) / 2;\n}")

Q("Addition of Two Fractions", CAT, "Medium",
  "Given two fractions a/b and c/d, find their sum as a simplified fraction.",
  "a = <int>, b = <int>, c = <int>, d = <int>", "String (e.g. '5/6')",
  [{"input": "a=1, b=2, c=1, d=3", "output": '"5/6"'}, {"input": "a=1, b=4, c=1, d=4", "output": '"1/2"'}],
  "Cross multiply: numerator = a*d + c*b, denominator = b*d.",
  "Simplify by dividing both numerator and denominator by their GCD.",
  "def solve(a, b, c, d):\n    from math import gcd\n    num = a*d + c*b\n    den = b*d\n    g = gcd(abs(num), abs(den))\n    return f'{num//g}/{den//g}'",
  'string solve(int a, int b, int c, int d) {\n    int num = a*d + c*b, den = b*d;\n    int g = __gcd(abs(num), abs(den));\n    return to_string(num/g) + "/" + to_string(den/g);\n}',
  'public String solve(int a, int b, int c, int d) {\n    int num = a*d + c*b, den = b*d;\n    int g = gcd(Math.abs(num), Math.abs(den));\n    return (num/g) + "/" + (den/g);\n}\nprivate int gcd(int a, int b) { while(b!=0){int t=b;b=a%b;a=t;} return a; }',
  "function solve(a, b, c, d) {\n    let num = a*d + c*b, den = b*d;\n    const gcd = (x,y) => { while(y) { [x,y]=[y,x%y]; } return x; };\n    const g = gcd(Math.abs(num), Math.abs(den));\n    return `${num/g}/${den/g}`;\n}")

Q("Replace All 0s with 1 in a Number", CAT, "Easy",
  "Given an integer n, replace all occurrences of digit 0 with digit 1.",
  "n = <integer>", "Integer",
  [{"input": "n = 102030", "output": "112131"}, {"input": "n = 1000", "output": "1111"}],
  "Convert the number to a string, replace '0' with '1'.",
  "Convert back to integer.",
  "def solve(n):\n    return int(str(n).replace('0', '1'))",
  'int solve(int n) {\n    string s = to_string(n);\n    for(auto& c : s) if(c==\'0\') c=\'1\';\n    return stoi(s);\n}',
  "public int solve(int n) {\n    return Integer.parseInt(String.valueOf(n).replace('0', '1'));\n}",
  "function solve(n) {\n    return parseInt(n.toString().replace(/0/g, '1'));\n}")

Q("Sum of Two Prime Numbers", CAT, "Medium",
  "Check if a given even number can be expressed as the sum of two prime numbers (Goldbach's Conjecture).",
  "n = <integer>", "Boolean (true/false)",
  [{"input": "n = 10", "output": "true", "explanation": "10 = 3 + 7 or 5 + 5"}, {"input": "n = 3", "output": "false"}],
  "For each prime p less than n, check if n-p is also prime.",
  "Only even numbers >= 4 can potentially satisfy this.",
  "def solve(n):\n    def is_prime(x):\n        if x < 2: return False\n        for i in range(2, int(x**0.5)+1):\n            if x % i == 0: return False\n        return True\n    for i in range(2, n):\n        if is_prime(i) and is_prime(n - i):\n            return True\n    return False",
  "bool solve(int n) {\n    auto is_prime = [](int x) {\n        if(x<2) return false;\n        for(int i=2;i*i<=x;++i) if(x%i==0) return false;\n        return true;\n    };\n    for(int i=2;i<n;++i)\n        if(is_prime(i) && is_prime(n-i)) return true;\n    return false;\n}",
  "public boolean solve(int n) {\n    for(int i=2;i<n;++i)\n        if(isPrime(i) && isPrime(n-i)) return true;\n    return false;\n}\nprivate boolean isPrime(int x) {\n    if(x<2) return false;\n    for(int i=2;i*i<=x;++i) if(x%i==0) return false;\n    return true;\n}",
  "function solve(n) {\n    const isPrime = x => { if(x<2) return false; for(let i=2;i*i<=x;++i) if(x%i===0) return false; return true; };\n    for(let i=2;i<n;++i) if(isPrime(i) && isPrime(n-i)) return true;\n    return false;\n}")

Q("Count Possible Decodings of a Digit Sequence", CAT, "Medium",
  "Given a digit string, count the number of ways to decode it where 'A'=1, 'B'=2, ..., 'Z'=26.",
  "digits = <string>", "Integer",
  [{"input": 'digits = "12"', "output": "2", "explanation": "'AB' (1,2) or 'L' (12)"}, {"input": 'digits = "226"', "output": "3"}],
  "Use dynamic programming. dp[i] = number of ways to decode the first i characters.",
  "At each position, try decoding one digit (1-9) and two digits (10-26).",
  "def solve(digits):\n    if not digits or digits[0] == '0': return 0\n    n = len(digits)\n    dp = [0] * (n + 1)\n    dp[0] = dp[1] = 1\n    for i in range(2, n+1):\n        if digits[i-1] != '0': dp[i] += dp[i-1]\n        two = int(digits[i-2:i])\n        if 10 <= two <= 26: dp[i] += dp[i-2]\n    return dp[n]",
  "int solve(string digits) {\n    int n = digits.size();\n    if(n==0 || digits[0]=='0') return 0;\n    vector<int> dp(n+1, 0);\n    dp[0]=dp[1]=1;\n    for(int i=2;i<=n;++i) {\n        if(digits[i-1]!='0') dp[i]+=dp[i-1];\n        int two = stoi(digits.substr(i-2,2));\n        if(two>=10&&two<=26) dp[i]+=dp[i-2];\n    }\n    return dp[n];\n}",
  "public int solve(String digits) {\n    int n = digits.length();\n    if(n==0||digits.charAt(0)=='0') return 0;\n    int[] dp = new int[n+1];\n    dp[0]=dp[1]=1;\n    for(int i=2;i<=n;++i) {\n        if(digits.charAt(i-1)!='0') dp[i]+=dp[i-1];\n        int two = Integer.parseInt(digits.substring(i-2,i));\n        if(two>=10&&two<=26) dp[i]+=dp[i-2];\n    }\n    return dp[n];\n}",
  "function solve(digits) {\n    const n = digits.length;\n    if(!n||digits[0]==='0') return 0;\n    const dp = new Array(n+1).fill(0);\n    dp[0]=dp[1]=1;\n    for(let i=2;i<=n;++i) {\n        if(digits[i-1]!=='0') dp[i]+=dp[i-1];\n        const two = parseInt(digits.substring(i-2,i));\n        if(two>=10&&two<=26) dp[i]+=dp[i-2];\n    }\n    return dp[n];\n}")

Q("Area of a Circle", CAT, "Easy",
  "Given the radius of a circle, calculate its area.",
  "radius = <number>", "Number (rounded to 2 decimal places)",
  [{"input": "radius = 5", "output": "78.54"}, {"input": "radius = 7", "output": "153.94"}],
  "Area = π × r².",
  "Use Math.PI or 3.14159265358979 for π.",
  "def solve(radius):\n    import math\n    return round(math.pi * radius * radius, 2)",
  "double solve(double radius) {\n    return round(M_PI * radius * radius * 100) / 100.0;\n}",
  "public double solve(double radius) {\n    return Math.round(Math.PI * radius * radius * 100.0) / 100.0;\n}",
  "function solve(radius) {\n    return Math.round(Math.PI * radius * radius * 100) / 100;\n}")

Q("Prime Numbers Between 1 to 100", CAT, "Easy",
  "Find all prime numbers between 1 and 100.",
  "None", "Array of integers",
  [{"input": "None", "output": "[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]"}],
  "Use the Sieve of Eratosthenes for efficiency.",
  "Mark multiples of each prime starting from 2 as composite.",
  "def solve():\n    sieve = [True] * 101\n    sieve[0] = sieve[1] = False\n    for i in range(2, 11):\n        if sieve[i]:\n            for j in range(i*i, 101, i):\n                sieve[j] = False\n    return [i for i in range(101) if sieve[i]]",
  "vector<int> solve() {\n    vector<bool> sieve(101, true);\n    sieve[0]=sieve[1]=false;\n    for(int i=2;i<=10;++i) if(sieve[i]) for(int j=i*i;j<=100;j+=i) sieve[j]=false;\n    vector<int> res;\n    for(int i=2;i<=100;++i) if(sieve[i]) res.push_back(i);\n    return res;\n}",
  "public List<Integer> solve() {\n    boolean[] sieve = new boolean[101];\n    Arrays.fill(sieve, true);\n    sieve[0]=sieve[1]=false;\n    for(int i=2;i<=10;++i) if(sieve[i]) for(int j=i*i;j<=100;j+=i) sieve[j]=false;\n    List<Integer> res = new ArrayList<>();\n    for(int i=2;i<=100;++i) if(sieve[i]) res.add(i);\n    return res;\n}",
  "function solve() {\n    const sieve = new Array(101).fill(true);\n    sieve[0]=sieve[1]=false;\n    for(let i=2;i<=10;++i) if(sieve[i]) for(let j=i*i;j<=100;j+=i) sieve[j]=false;\n    return sieve.reduce((a,v,i) => v ? [...a,i] : a, []);\n}")

Q("Number of Digits in an Integer", CAT, "Easy",
  "Given an integer n, count the number of digits in it.",
  "n = <integer>", "Integer",
  [{"input": "n = 12345", "output": "5"}, {"input": "n = 0", "output": "1"}],
  "Convert to string and return length, or divide by 10 repeatedly.",
  "Handle negative numbers by taking absolute value first.",
  "def solve(n):\n    return len(str(abs(n)))",
  "int solve(int n) {\n    if(n==0) return 1;\n    int count = 0;\n    n = abs(n);\n    while(n>0) { count++; n/=10; }\n    return count;\n}",
  "public int solve(int n) {\n    return String.valueOf(Math.abs(n)).length();\n}",
  "function solve(n) {\n    return Math.abs(n).toString().length;\n}")

Q("Convert Number to Words", CAT, "Medium",
  "Convert a given integer (0-9999) to its English word representation.",
  "n = <integer>", "String",
  [{"input": "n = 123", "output": '"One Hundred Twenty Three"'}, {"input": "n = 0", "output": '"Zero"'}],
  "Break the number into thousands, hundreds, tens, and ones.",
  "Map each group to its word representation using lookup arrays.",
  'def solve(n):\n    if n == 0: return "Zero"\n    ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"]\n    tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"]\n    result = ""\n    if n >= 1000:\n        result += ones[n//1000] + " Thousand "\n        n %= 1000\n    if n >= 100:\n        result += ones[n//100] + " Hundred "\n        n %= 100\n    if n >= 20:\n        result += tens[n//10] + " "\n        n %= 10\n    if n > 0:\n        result += ones[n]\n    return result.strip()',
  'string solve(int n) {\n    if(n==0) return "Zero";\n    string ones[] = {"","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"};\n    string tens[] = {"","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"};\n    string result = "";\n    if(n>=1000){result+=ones[n/1000]+" Thousand ";n%=1000;}\n    if(n>=100){result+=ones[n/100]+" Hundred ";n%=100;}\n    if(n>=20){result+=tens[n/10]+" ";n%=10;}\n    if(n>0) result+=ones[n];\n    while(result.back()==\' \') result.pop_back();\n    return result;\n}',
  'public String solve(int n) {\n    if(n==0) return "Zero";\n    String[] ones = {"","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"};\n    String[] tens = {"","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"};\n    StringBuilder sb = new StringBuilder();\n    if(n>=1000){sb.append(ones[n/1000]).append(" Thousand ");n%=1000;}\n    if(n>=100){sb.append(ones[n/100]).append(" Hundred ");n%=100;}\n    if(n>=20){sb.append(tens[n/10]).append(" ");n%=10;}\n    if(n>0) sb.append(ones[n]);\n    return sb.toString().trim();\n}',
  'function solve(n) {\n    if(n===0) return "Zero";\n    const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];\n    const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];\n    let result = "";\n    if(n>=1000){result+=ones[Math.floor(n/1000)]+" Thousand ";n%=1000;}\n    if(n>=100){result+=ones[Math.floor(n/100)]+" Hundred ";n%=100;}\n    if(n>=20){result+=tens[Math.floor(n/10)]+" ";n%=10;}\n    if(n>0) result+=ones[n];\n    return result.trim();\n}')

Q("Count Days in a Month", CAT, "Easy",
  "Given a month (1-12) and year, return the number of days in that month.",
  "month = <integer>, year = <integer>", "Integer",
  [{"input": "month = 2, year = 2024", "output": "29"}, {"input": "month = 1, year = 2023", "output": "31"}],
  "Most months have fixed day counts. February depends on leap year status.",
  "Months with 31 days: 1,3,5,7,8,10,12. With 30: 4,6,9,11. Feb: 28 or 29.",
  "def solve(month, year):\n    if month in [1,3,5,7,8,10,12]: return 31\n    if month in [4,6,9,11]: return 30\n    return 29 if (year%4==0 and year%100!=0) or year%400==0 else 28",
  "int solve(int month, int year) {\n    int days[] = {31,28,31,30,31,30,31,31,30,31,30,31};\n    if(month==2 && ((year%4==0&&year%100!=0)||year%400==0)) return 29;\n    return days[month-1];\n}",
  "public int solve(int month, int year) {\n    int[] days = {31,28,31,30,31,30,31,31,30,31,30,31};\n    if(month==2 && ((year%4==0&&year%100!=0)||year%400==0)) return 29;\n    return days[month-1];\n}",
  "function solve(month, year) {\n    const days = [31,28,31,30,31,30,31,31,30,31,30,31];\n    if(month===2 && ((year%4===0&&year%100!==0)||year%400===0)) return 29;\n    return days[month-1];\n}")

Q("Frequency of a Digit in a Number", CAT, "Easy",
  "Given an integer n and a digit d (0-9), count how many times d appears in n.",
  "n = <integer>, d = <integer>", "Integer",
  [{"input": "n = 122333, d = 3", "output": "3"}, {"input": "n = 1000, d = 0", "output": "3"}],
  "Convert the number to a string and count occurrences of the digit.",
  "Or extract digits one by one using modulo and compare.",
  "def solve(n, d):\n    return str(abs(n)).count(str(d))",
  "int solve(int n, int d) {\n    if(n==0 && d==0) return 1;\n    int count=0;\n    n = abs(n);\n    while(n>0) { if(n%10==d) count++; n/=10; }\n    return count;\n}",
  "public int solve(int n, int d) {\n    String s = String.valueOf(Math.abs(n));\n    return (int)s.chars().filter(c -> c == '0'+d).count();\n}",
  "function solve(n, d) {\n    return Math.abs(n).toString().split('').filter(c => +c === d).length;\n}")

Q("Integers with Exactly X Divisors", CAT, "Medium",
  "Given integers n (upper range) and x, find how many integers from 1 to n have exactly x divisors.",
  "n = <integer>, x = <integer>", "Integer",
  [{"input": "n = 10, x = 2", "output": "4", "explanation": "Primes: 2,3,5,7 each have exactly 2 divisors"}, {"input": "n = 20, x = 4", "output": "5"}],
  "For each number from 1 to n, count its divisors.",
  "If the count equals x, increment the result counter.",
  "def solve(n, x):\n    count = 0\n    for i in range(1, n+1):\n        divisors = sum(1 for j in range(1, i+1) if i % j == 0)\n        if divisors == x: count += 1\n    return count",
  "int solve(int n, int x) {\n    int count = 0;\n    for(int i=1;i<=n;++i) {\n        int div=0;\n        for(int j=1;j<=i;++j) if(i%j==0) div++;\n        if(div==x) count++;\n    }\n    return count;\n}",
  "public int solve(int n, int x) {\n    int count = 0;\n    for(int i=1;i<=n;++i) {\n        int div=0;\n        for(int j=1;j<=i;++j) if(i%j==0) div++;\n        if(div==x) count++;\n    }\n    return count;\n}",
  "function solve(n, x) {\n    let count = 0;\n    for(let i=1;i<=n;++i) {\n        let div=0;\n        for(let j=1;j<=i;++j) if(i%j===0) div++;\n        if(div===x) count++;\n    }\n    return count;\n}")

Q("Roots of a Quadratic Equation", CAT, "Medium",
  "Given coefficients a, b, c of ax²+bx+c=0, find the roots of the quadratic equation.",
  "a = <number>, b = <number>, c = <number>", "Array of numbers or String",
  [{"input": "a = 1, b = -3, c = 2", "output": "[2.0, 1.0]"}, {"input": "a = 1, b = 2, c = 1", "output": "[-1.0, -1.0]"}],
  "Use the quadratic formula: x = (-b ± √(b²-4ac)) / (2a).",
  "Check the discriminant (b²-4ac): if positive → 2 real roots, zero → 1 repeated root, negative → complex roots.",
  "def solve(a, b, c):\n    import math\n    disc = b*b - 4*a*c\n    if disc < 0:\n        return 'Complex Roots'\n    r1 = (-b + math.sqrt(disc)) / (2*a)\n    r2 = (-b - math.sqrt(disc)) / (2*a)\n    return [round(r1, 2), round(r2, 2)]",
  'string solve(double a, double b, double c) {\n    double disc = b*b - 4*a*c;\n    if(disc < 0) return "Complex Roots";\n    double r1 = (-b + sqrt(disc)) / (2*a);\n    double r2 = (-b - sqrt(disc)) / (2*a);\n    return to_string(r1) + ", " + to_string(r2);\n}',
  'public String solve(double a, double b, double c) {\n    double disc = b*b - 4*a*c;\n    if(disc < 0) return "Complex Roots";\n    double r1 = (-b + Math.sqrt(disc)) / (2*a);\n    double r2 = (-b - Math.sqrt(disc)) / (2*a);\n    return r1 + ", " + r2;\n}',
  'function solve(a, b, c) {\n    const disc = b*b - 4*a*c;\n    if(disc < 0) return "Complex Roots";\n    const r1 = (-b + Math.sqrt(disc)) / (2*a);\n    const r2 = (-b - Math.sqrt(disc)) / (2*a);\n    return [Math.round(r1*100)/100, Math.round(r2*100)/100];\n}')

cnt2 = qid - 28
print(f"[CAT 2] Working with Numbers: {cnt2} questions (total: {qid})")

# Continue in Part 2...
# Save progress
with open(r'c:\Users\dhanu\OneDrive\Desktop\learn\learniverse-ai\scratch\gen_progress.json', 'w') as f:
    json.dump({"questions_so_far": qid, "data": questions}, f, indent=2)

print(f"\nPart 1 complete. {qid} questions generated so far.")
print("Categories covered: Getting Started, Working with Numbers")
