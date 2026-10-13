/**
 * top100Data.ts
 * Comprehensive database of all 175 coding challenges across all 8 syllabus sections.
 * 
 * Sections:
 * 1. Getting Started (28)
 * 2. Working with Numbers (26)
 * 3. Recursion (19)
 * 4. Arrays (32)
 * 5. Strings (22)
 * 6. Advanced Arrays (29)
 * 7. Matrix (9)
 * 8. Pattern Printing (10)
 */

export interface Top100Question {
  id: number;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  statement: string;
  inputFormat: string;
  outputFormat: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  hint1: string;
  hint2: string;
  solution: {
    python: string;
    cpp: string;
    java: string;
    javascript: string;
  };
  boilerplate: {
    python: string;
    cpp: string;
    java: string;
    javascript: string;
  };
}

export const TOP_100_QUESTIONS: Top100Question[] = [
  {
    "id": 1,
    "title": "Positive or Negative Number",
    "category": "Getting Started",
    "difficulty": "Easy",
    "statement": "Given an integer n, check whether it is positive, negative, or zero.",
    "inputFormat": "n = <integer>",
    "outputFormat": "String ('Positive', 'Negative', or 'Zero')",
    "examples": [
      {
        "input": "n = 5",
        "output": "\"Positive\""
      },
      {
        "input": "n = -3",
        "output": "\"Negative\""
      },
      {
        "input": "n = 0",
        "output": "\"Zero\""
      }
    ],
    "hint1": "Check if the number is greater than zero.",
    "hint2": "If it is less than zero, it is negative. Otherwise, it is zero.",
    "solution": {
      "python": "def solve(n):\n    if n > 0:\n        return \"Positive\"\n    elif n < 0:\n        return \"Negative\"\n    return \"Zero\"",
      "cpp": "string solve(int n) {\n    if (n > 0) return \"Positive\";\n    if (n < 0) return \"Negative\";\n    return \"Zero\";\n}",
      "java": "public String solve(int n) {\n    if (n > 0) return \"Positive\";\n    if (n < 0) return \"Negative\";\n    return \"Zero\";\n}",
      "javascript": "function solve(n) {\n    if (n > 0) return \"Positive\";\n    if (n < 0) return \"Negative\";\n    return \"Zero\";\n}"
    },
    "boilerplate": {
      "python": "# Solution for Positive or Negative Number\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Positive or Negative Number\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nstring solve(int n) {\\n    // Write your solution here\\n    return \"\";\\n}",
      "java": "// Solution for Positive or Negative Number\\nimport java.util.*;\\nclass Solution {\\n    public String solve(int n) {\\n        // Write your solution here\\n        return \"\";\\n    }\\n}",
      "javascript": "// Solution for Positive or Negative Number\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 2,
    "title": "Even or Odd Number",
    "category": "Getting Started",
    "difficulty": "Easy",
    "statement": "Given an integer n, determine if it is even or odd.",
    "inputFormat": "n = <integer>",
    "outputFormat": "String ('Even' or 'Odd')",
    "examples": [
      {
        "input": "n = 4",
        "output": "\"Even\""
      },
      {
        "input": "n = 9",
        "output": "\"Odd\""
      }
    ],
    "hint1": "Use the modulo operator (%) to find the remainder when divided by 2.",
    "hint2": "If n % 2 equals 0, the number is Even; otherwise, it is Odd.",
    "solution": {
      "python": "def solve(n):\n    return \"Even\" if n % 2 == 0 else \"Odd\"",
      "cpp": "string solve(int n) {\n    return (n % 2 == 0) ? \"Even\" : \"Odd\";\n}",
      "java": "public String solve(int n) {\n    return (n % 2 == 0) ? \"Even\" : \"Odd\";\n}",
      "javascript": "function solve(n) {\n    return (n % 2 === 0) ? \"Even\" : \"Odd\";\n}"
    },
    "boilerplate": {
      "python": "# Solution for Even or Odd Number\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Even or Odd Number\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nstring solve(int n) {\\n    // Write your solution here\\n    return \"\";\\n}",
      "java": "// Solution for Even or Odd Number\\nimport java.util.*;\\nclass Solution {\\n    public String solve(int n) {\\n        // Write your solution here\\n        return \"\";\\n    }\\n}",
      "javascript": "// Solution for Even or Odd Number\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 3,
    "title": "Sum of First N Natural Numbers",
    "category": "Getting Started",
    "difficulty": "Easy",
    "statement": "Given an integer n, find the sum of first n natural numbers.",
    "inputFormat": "n = <integer>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "n = 5",
        "output": "15"
      },
      {
        "input": "n = 10",
        "output": "55"
      }
    ],
    "hint1": "You can sum the numbers using a loop from 1 to n.",
    "hint2": "A more optimal approach is using the formula: n * (n + 1) / 2.",
    "solution": {
      "python": "def solve(n):\n    return n * (n + 1) // 2",
      "cpp": "int solve(int n) {\n    return n * (n + 1) / 2;\n}",
      "java": "public int solve(int n) {\n    return n * (n + 1) / 2;\n}",
      "javascript": "function solve(n) {\n    return n * (n + 1) / 2;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Sum of First N Natural Numbers\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Sum of First N Natural Numbers\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(int n) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Sum of First N Natural Numbers\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int n) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Sum of First N Natural Numbers\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 4,
    "title": "Sum of N Natural Numbers",
    "category": "Getting Started",
    "difficulty": "Easy",
    "statement": "Calculate the sum of natural numbers from 1 up to n.",
    "inputFormat": "n = <integer>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "n = 6",
        "output": "21"
      },
      {
        "input": "n = 3",
        "output": "6"
      }
    ],
    "hint1": "This is identical to calculating the sum of first N natural numbers.",
    "hint2": "Use a simple loop or direct multiplication formula.",
    "solution": {
      "python": "def solve(n):\n    return sum(range(1, n + 1))",
      "cpp": "int solve(int n) {\n    int sum = 0;\n    for(int i=1; i<=n; ++i) sum += i;\n    return sum;\n}",
      "java": "public int solve(int n) {\n    int sum = 0;\n    for(int i=1; i<=n; ++i) sum += i;\n    return sum;\n}",
      "javascript": "function solve(n) {\n    let sum = 0;\n    for(let i=1; i<=n; ++i) sum += i;\n    return sum;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Sum of N Natural Numbers\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Sum of N Natural Numbers\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(int n) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Sum of N Natural Numbers\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int n) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Sum of N Natural Numbers\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 5,
    "title": "Sum of Numbers in a Given Range",
    "category": "Getting Started",
    "difficulty": "Easy",
    "statement": "Given two integers start and end, find the sum of all integers between start and end (inclusive).",
    "inputFormat": "start = <integer>, end = <integer>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "start = 2, end = 5",
        "output": "14"
      },
      {
        "input": "start = 5, end = 10",
        "output": "45"
      }
    ],
    "hint1": "You can loop from start to end and add each number to a sum variable.",
    "hint2": "Or, use the sum formula: Sum(1 to end) - Sum(1 to start-1).",
    "solution": {
      "python": "def solve(start, end):\n    return sum(range(start, end + 1))",
      "cpp": "int solve(int start, int end) {\n    int sum = 0;\n    for(int i = start; i <= end; i++) sum += i;\n    return sum;\n}",
      "java": "public int solve(int start, int end) {\n    int sum = 0;\n    for(int i = start; i <= end; i++) sum += i;\n    return sum;\n}",
      "javascript": "function solve(start, end) {\n    let sum = 0;\n    for(let i = start; i <= end; i++) sum += i;\n    return sum;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Sum of Numbers in a Given Range\\ndef solve(start, end):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Sum of Numbers in a Given Range\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(int start, int end) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Sum of Numbers in a Given Range\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int start, int end) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Sum of Numbers in a Given Range\\nfunction solve(start, end) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 6,
    "title": "Greatest of Two Numbers",
    "category": "Getting Started",
    "difficulty": "Easy",
    "statement": "Given two integers a and b, return the larger of the two numbers.",
    "inputFormat": "a = <integer>, b = <integer>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "a = 12, b = 25",
        "output": "25"
      },
      {
        "input": "a = 40, b = 15",
        "output": "40"
      }
    ],
    "hint1": "Use an if-else conditional check.",
    "hint2": "Alternatively, use a built-in max function or ternary operator.",
    "solution": {
      "python": "def solve(a, b):\n    return max(a, b)",
      "cpp": "int solve(int a, int b) {\n    return max(a, b);\n}",
      "java": "public int solve(int a, int b) {\n    return Math.max(a, b);\n}",
      "javascript": "function solve(a, b) {\n    return Math.max(a, b);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Greatest of Two Numbers\\ndef solve(a, b):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Greatest of Two Numbers\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(int a, int b) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Greatest of Two Numbers\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int a, int b) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Greatest of Two Numbers\\nfunction solve(a, b) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 7,
    "title": "Greatest of Three Numbers",
    "category": "Getting Started",
    "difficulty": "Easy",
    "statement": "Given three integers a, b, and c, return the greatest of them.",
    "inputFormat": "a = <integer>, b = <integer>, c = <integer>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "a = 10, b = 20, c = 30",
        "output": "30"
      },
      {
        "input": "a = 50, b = 10, c = 20",
        "output": "50"
      }
    ],
    "hint1": "Compare the numbers using nested conditionals or logic AND (&&).",
    "hint2": "Or, apply nested max calls: max(a, max(b, c)).",
    "solution": {
      "python": "def solve(a, b, c):\n    return max(a, b, c)",
      "cpp": "int solve(int a, int b, int c) {\n    return max(a, max(b, c));\n}",
      "java": "public int solve(int a, int b, int c) {\n    return Math.max(a, Math.max(b, c));\n}",
      "javascript": "function solve(a, b, c) {\n    return Math.max(a, b, c);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Greatest of Three Numbers\\ndef solve(a, b, c):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Greatest of Three Numbers\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(int a, int b, int c) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Greatest of Three Numbers\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int a, int b, int c) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Greatest of Three Numbers\\nfunction solve(a, b, c) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 8,
    "title": "Leap Year or Not",
    "category": "Getting Started",
    "difficulty": "Easy",
    "statement": "Determine whether a given year is a leap year (returns true) or not (returns false).",
    "inputFormat": "year = <integer>",
    "outputFormat": "Boolean",
    "examples": [
      {
        "input": "year = 2020",
        "output": "true"
      },
      {
        "input": "year = 2021",
        "output": "false"
      },
      {
        "input": "year = 1900",
        "output": "false"
      }
    ],
    "hint1": "A year is a leap year if it is divisible by 400, or divisible by 4 but not by 100.",
    "hint2": "Translate this to: (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0).",
    "solution": {
      "python": "def solve(year):\n    return (year % 400 == 0) or (year % 4 == 0 and year % 100 != 0)",
      "cpp": "bool solve(int year) {\n    return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);\n}",
      "java": "public boolean solve(int year) {\n    return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);\n}",
      "javascript": "function solve(year) {\n    return (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Leap Year or Not\\ndef solve(year):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Leap Year or Not\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nbool solve(int year) {\\n    // Write your solution here\\n    return false;\\n}",
      "java": "// Solution for Leap Year or Not\\nimport java.util.*;\\nclass Solution {\\n    public boolean solve(int year) {\\n        // Write your solution here\\n        return false;\\n    }\\n}",
      "javascript": "// Solution for Leap Year or Not\\nfunction solve(year) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 9,
    "title": "Prime Number",
    "category": "Getting Started",
    "difficulty": "Easy",
    "statement": "Determine whether a given integer n is prime (returns true) or composite (returns false). Assumes n >= 1.",
    "inputFormat": "n = <integer>",
    "outputFormat": "Boolean",
    "examples": [
      {
        "input": "n = 11",
        "output": "true"
      },
      {
        "input": "n = 4",
        "output": "false"
      },
      {
        "input": "n = 1",
        "output": "false"
      }
    ],
    "hint1": "A prime number is only divisible by 1 and itself. Check for factors starting from 2.",
    "hint2": "Loop up to the square root of n (inclusive). If a factor is found, it is not prime.",
    "solution": {
      "python": "def solve(n):\n    if n <= 1: return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True",
      "cpp": "bool solve(int n) {\n    if (n <= 1) return false;\n    for(int i=2; i*i<=n; ++i) {\n        if (n % i == 0) return false;\n    }\n    return true;\n}",
      "java": "public boolean solve(int n) {\n    if (n <= 1) return false;\n    for(int i=2; i*i<=n; ++i) {\n        if (n % i == 0) return false;\n    }\n    return true;\n}",
      "javascript": "function solve(n) {\n    if (n <= 1) return false;\n    for(let i=2; i*i<=n; ++i) {\n        if (n % i === 0) return false;\n    }\n    return true;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Prime Number\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Prime Number\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nbool solve(int n) {\\n    // Write your solution here\\n    return false;\\n}",
      "java": "// Solution for Prime Number\\nimport java.util.*;\\nclass Solution {\\n    public boolean solve(int n) {\\n        // Write your solution here\\n        return false;\\n    }\\n}",
      "javascript": "// Solution for Prime Number\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 10,
    "title": "Prime Numbers in a Given Range",
    "category": "Getting Started",
    "difficulty": "Medium",
    "statement": "Given a range [low, high], return an array of all prime numbers within that range (inclusive).",
    "inputFormat": "low = <integer>, high = <integer>",
    "outputFormat": "Array of integers",
    "examples": [
      {
        "input": "low = 2, high = 10",
        "output": "[2,3,5,7]"
      },
      {
        "input": "low = 10, high = 20",
        "output": "[11,13,17,19]"
      }
    ],
    "hint1": "Iterate through each number in the range from low to high.",
    "hint2": "Write a helper function to verify if a single number is prime, and collect all matches.",
    "solution": {
      "python": "def solve(low, high):\n    def is_prime(x):\n        if x <= 1: return False\n        for i in range(2, int(x**0.5) + 1):\n            if x % i == 0: return False\n        return True\n    return [x for x in range(low, high + 1) if is_prime(x)]",
      "cpp": "vector<int> solve(int low, int high) {\n    auto is_prime = [](int x) {\n        if (x <= 1) return false;\n        for(int i=2; i*i<=x; ++i) if(x%i==0) return false;\n        return true;\n    };\n    vector<int> res;\n    for(int i=low; i<=high; ++i) {\n        if (is_prime(i)) res.push_back(i);\n    }\n    return res;\n}",
      "java": "public int[] solve(int low, int high) {\n    java.util.List<Integer> list = new java.util.ArrayList<>();\n    for(int i=low; i<=high; ++i) {\n        if (isPrime(i)) list.add(i);\n    }\n    return list.stream().mapToInt(i->i).toArray();\n}\nprivate boolean isPrime(int x) {\n    if (x <= 1) return false;\n    for(int i=2; i*i<=x; ++i) if(x%i==0) return false;\n    return true;\n}",
      "javascript": "function solve(low, high) {\n    function isPrime(x) {\n        if (x <= 1) return false;\n        for(let i=2; i*i<=x; ++i) if(x%i===0) return false;\n        return true;\n    }\n    let res = [];\n    for(let i=low; i<=high; ++i) {\n        if (isPrime(i)) res.push(i);\n    }\n    return res;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Prime Numbers in a Given Range\\ndef solve(low, high):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Prime Numbers in a Given Range\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nvector<int> solve(int low, int high) {\\n    // Write your solution here\\n    return {};\\n}",
      "java": "// Solution for Prime Numbers in a Given Range\\nimport java.util.*;\\nclass Solution {\\n    public int[] solve(int low, int high) {\\n        // Write your solution here\\n        return new int[]{};\\n    }\\n}",
      "javascript": "// Solution for Prime Numbers in a Given Range\\nfunction solve(low, high) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 11,
    "title": "Sum of Digits of a Number",
    "category": "Getting Started",
    "difficulty": "Easy",
    "statement": "Given a non-negative integer n, return the sum of its digits.",
    "inputFormat": "n = <integer>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "n = 1234",
        "output": "10"
      },
      {
        "input": "n = 98",
        "output": "17"
      }
    ],
    "hint1": "Extract digits one by one using modulo 10 (n % 10).",
    "hint2": "Divide the number by 10 (n / 10) in each iteration to shift digits until the number becomes 0.",
    "solution": {
      "python": "def solve(n):\n    return sum(int(d) for d in str(n))",
      "cpp": "int solve(int n) {\n    int sum = 0;\n    while (n > 0) {\n        sum += n % 10;\n        n /= 10;\n    }\n    return sum;\n}",
      "java": "public int solve(int n) {\n    int sum = 0;\n    while (n > 0) {\n        sum += n % 10;\n        n /= 10;\n    }\n    return sum;\n}",
      "javascript": "function solve(n) {\n    let sum = 0;\n    while (n > 0) {\n        sum += n % 10;\n        n = Math.floor(n / 10);\n    }\n    return sum;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Sum of Digits of a Number\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Sum of Digits of a Number\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(int n) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Sum of Digits of a Number\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int n) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Sum of Digits of a Number\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 12,
    "title": "Reverse of a Number",
    "category": "Getting Started",
    "difficulty": "Easy",
    "statement": "Given an integer n, return its reversed representation.",
    "inputFormat": "n = <integer>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "n = 1234",
        "output": "4321"
      },
      {
        "input": "n = 902",
        "output": "209"
      }
    ],
    "hint1": "Extract the last digit using modulo 10 and add it to the reversed number (rev = rev * 10 + digit).",
    "hint2": "Divide the original number by 10 in each iteration until it is 0.",
    "solution": {
      "python": "def solve(n):\n    return int(str(n)[::-1])",
      "cpp": "int solve(int n) {\n    int rev = 0;\n    while(n > 0) {\n        rev = rev * 10 + (n % 10);\n        n /= 10;\n    }\n    return rev;\n}",
      "java": "public int solve(int n) {\n    int rev = 0;\n    while(n > 0) {\n        rev = rev * 10 + (n % 10);\n        n /= 10;\n    }\n    return rev;\n}",
      "javascript": "function solve(n) {\n    let rev = 0;\n    while(n > 0) {\n        rev = rev * 10 + (n % 10);\n        n = Math.floor(n / 10);\n    }\n    return rev;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Reverse of a Number\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Reverse of a Number\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nstring solve(int n) {\\n    // Write your solution here\\n    return \"\";\\n}",
      "java": "// Solution for Reverse of a Number\\nimport java.util.*;\\nclass Solution {\\n    public String solve(int n) {\\n        // Write your solution here\\n        return \"\";\\n    }\\n}",
      "javascript": "// Solution for Reverse of a Number\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 13,
    "title": "Palindrome Number",
    "category": "Getting Started",
    "difficulty": "Easy",
    "statement": "Check if a given integer n is a palindrome (reads same forward and backward). Returns true or false.",
    "inputFormat": "n = <integer>",
    "outputFormat": "Boolean",
    "examples": [
      {
        "input": "n = 1221",
        "output": "true"
      },
      {
        "input": "n = 123",
        "output": "false"
      }
    ],
    "hint1": "Find the reverse of the number n.",
    "hint2": "Compare the reversed number with the original number. If they are equal, return true.",
    "solution": {
      "python": "def solve(n):\n    return str(n) == str(n)[::-1]",
      "cpp": "bool solve(int n) {\n    int original = n;\n    long long rev = 0;\n    while(n > 0) {\n        rev = rev * 10 + (n % 10);\n        n /= 10;\n    }\n    return original == rev;\n}",
      "java": "public boolean solve(int n) {\n    int original = n;\n    int rev = 0;\n    while(n > 0) {\n        rev = rev * 10 + (n % 10);\n        n /= 10;\n    }\n    return original == rev;\n}",
      "javascript": "function solve(n) {\n    let original = n;\n    let rev = 0;\n    while(n > 0) {\n        rev = rev * 10 + (n % 10);\n        n = Math.floor(n / 10);\n    }\n    return original === rev;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Palindrome Number\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Palindrome Number\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nbool solve(int n) {\\n    // Write your solution here\\n    return false;\\n}",
      "java": "// Solution for Palindrome Number\\nimport java.util.*;\\nclass Solution {\\n    public boolean solve(int n) {\\n        // Write your solution here\\n        return false;\\n    }\\n}",
      "javascript": "// Solution for Palindrome Number\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 14,
    "title": "Armstrong Number",
    "category": "Getting Started",
    "difficulty": "Easy",
    "statement": "An Armstrong number (or Narcissistic number) is a number that is the sum of its own digits each raised to the power of the number of digits. Check if n is an Armstrong number.",
    "inputFormat": "n = <integer>",
    "outputFormat": "Boolean",
    "examples": [
      {
        "input": "n = 153",
        "output": "true"
      },
      {
        "input": "n = 123",
        "output": "false"
      }
    ],
    "hint1": "Count the number of digits in n (let this be d).",
    "hint2": "Sum the digits raised to power d. Check if the sum is equal to the original number.",
    "solution": {
      "python": "def solve(n):\n    s = str(n)\n    d = len(s)\n    return sum(int(x)**d for x in s) == n",
      "cpp": "bool solve(int n) {\n    int original = n;\n    int digits = 0;\n    int temp = n;\n    while(temp > 0) { digits++; temp /= 10; }\n    int sum = 0;\n    temp = n;\n    while(temp > 0) {\n        sum += pow(temp % 10, digits);\n        temp /= 10;\n    }\n    return sum == original;\n}",
      "java": "public boolean solve(int n) {\n    int original = n;\n    int digits = 0;\n    int temp = n;\n    while(temp > 0) { digits++; temp /= 10; }\n    int sum = 0;\n    temp = n;\n    while(temp > 0) {\n        sum += Math.pow(temp % 10, digits);\n        temp /= 10;\n    }\n    return sum == original;\n}",
      "javascript": "function solve(n) {\n    let digits = n.toString().length;\n    let sum = 0;\n    let temp = n;\n    while(temp > 0) {\n        sum += Math.pow(temp % 10, digits);\n        temp = Math.floor(temp / 10);\n    }\n    return sum === n;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Armstrong Number\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Armstrong Number\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nbool solve(int n) {\\n    // Write your solution here\\n    return false;\\n}",
      "java": "// Solution for Armstrong Number\\nimport java.util.*;\\nclass Solution {\\n    public boolean solve(int n) {\\n        // Write your solution here\\n        return false;\\n    }\\n}",
      "javascript": "// Solution for Armstrong Number\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 15,
    "title": "Armstrong Number in a Given Range",
    "category": "Getting Started",
    "difficulty": "Medium",
    "statement": "Given low and high, return all Armstrong numbers in the range [low, high] inclusive.",
    "inputFormat": "low = <integer>, high = <integer>",
    "outputFormat": "Array of integers",
    "examples": [
      {
        "input": "low = 10, high = 500",
        "output": "[153,370,371,407]"
      },
      {
        "input": "low = 1, high = 10",
        "output": "[1,2,3,4,5,6,7,8,9]"
      }
    ],
    "hint1": "Iterate through each number in the range from low to high.",
    "hint2": "Use a helper function to determine if a number is an Armstrong number and accumulate matches.",
    "solution": {
      "python": "def solve(low, high):\n    res = []\n    for n in range(low, high + 1):\n        s = str(n)\n        d = len(s)\n        if sum(int(x)**d for x in s) == n:\n            res.append(n)\n    return res",
      "cpp": "vector<int> solve(int low, int high) {\n    vector<int> res;\n    for(int i = low; i <= high; i++) {\n        int digits = 0;\n        int temp = i;\n        while(temp > 0) { digits++; temp /= 10; }\n        int sum = 0;\n        temp = i;\n        while(temp > 0) {\n            sum += pow(temp % 10, digits);\n            temp /= 10;\n        }\n        if (sum == i) res.push_back(i);\n    }\n    return res;\n}",
      "java": "public int[] solve(int low, int high) {\n    java.util.List<Integer> list = new java.util.ArrayList<>();\n    for(int i = low; i <= high; i++) {\n        int digits = 0;\n        int temp = i;\n        while(temp > 0) { digits++; temp /= 10; }\n        int sum = 0;\n        temp = i;\n        while(temp > 0) {\n            sum += Math.pow(temp % 10, digits);\n            temp /= 10;\n        }\n        if (sum == i) list.add(i);\n    }\n    return list.stream().mapToInt(x -> x).toArray();\n}",
      "javascript": "function solve(low, high) {\n    let res = [];\n    for(let i = low; i <= high; i++) {\n        let digits = i.toString().length;\n        let sum = 0;\n        let temp = i;\n        while(temp > 0) {\n            sum += Math.pow(temp % 10, digits);\n            temp = Math.floor(temp / 10);\n        }\n        if (sum === i) res.push(i);\n    }\n    return res;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Armstrong Number in a Given Range\\ndef solve(low, high):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Armstrong Number in a Given Range\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nvector<int> solve(int low, int high) {\\n    // Write your solution here\\n    return {};\\n}",
      "java": "// Solution for Armstrong Number in a Given Range\\nimport java.util.*;\\nclass Solution {\\n    public int[] solve(int low, int high) {\\n        // Write your solution here\\n        return new int[]{};\\n    }\\n}",
      "javascript": "// Solution for Armstrong Number in a Given Range\\nfunction solve(low, high) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 16,
    "title": "Fibonacci Series Upto Nth Term",
    "category": "Getting Started",
    "difficulty": "Easy",
    "statement": "Generate an array containing the Fibonacci series starting from 0 up to n terms.",
    "inputFormat": "n = <integer>",
    "outputFormat": "Array of integers",
    "examples": [
      {
        "input": "n = 5",
        "output": "[0,1,1,2,3]"
      },
      {
        "input": "n = 8",
        "output": "[0,1,1,2,3,5,8,13]"
      }
    ],
    "hint1": "Fibonacci series starts with 0 and 1. The next numbers are the sum of the previous two.",
    "hint2": "Use a loop to calculate F[i] = F[i-1] + F[i-2] for indices up to n.",
    "solution": {
      "python": "def solve(n):\n    if n <= 0: return []\n    if n == 1: return [0]\n    fib = [0, 1]\n    while len(fib) < n:\n        fib.append(fib[-1] + fib[-2])\n    return fib",
      "cpp": "vector<int> solve(int n) {\n    if (n <= 0) return {};\n    if (n == 1) return {0};\n    vector<int> fib = {0, 1};\n    for(int i=2; i<n; ++i) {\n        fib.push_back(fib[i-1] + fib[i-2]);\n    }\n    return fib;\n}",
      "java": "public int[] solve(int n) {\n    if (n <= 0) return new int[]{};\n    if (n == 1) return new int[]{0};\n    int[] fib = new int[n];\n    fib[0] = 0;\n    fib[1] = 1;\n    for(int i=2; i<n; ++i) {\n        fib[i] = fib[i-1] + fib[i-2];\n    }\n    return fib;\n}",
      "javascript": "function solve(n) {\n    if (n <= 0) return [];\n    if (n === 1) return [0];\n    let fib = [0, 1];\n    for(let i=2; i<n; ++i) {\n        fib.push(fib[i-1] + fib[i-2]);\n    }\n    return fib;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Fibonacci Series Upto Nth Term\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Fibonacci Series Upto Nth Term\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nvector<int> solve(int n) {\\n    // Write your solution here\\n    return {};\\n}",
      "java": "// Solution for Fibonacci Series Upto Nth Term\\nimport java.util.*;\\nclass Solution {\\n    public int[] solve(int n) {\\n        // Write your solution here\\n        return new int[]{};\\n    }\\n}",
      "javascript": "// Solution for Fibonacci Series Upto Nth Term\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 17,
    "title": "Find the Nth Term of the Fibonacci Series",
    "category": "Getting Started",
    "difficulty": "Easy",
    "statement": "Given an integer n, find the value of the nth term in the Fibonacci sequence (0-indexed). F(0)=0, F(1)=1, F(2)=1, F(3)=2, etc.",
    "inputFormat": "n = <integer>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "n = 4",
        "output": "3"
      },
      {
        "input": "n = 6",
        "output": "8"
      }
    ],
    "hint1": "You can calculate this with a loop or a recursive function with memoization.",
    "hint2": "Store only the last two values (a and b) in variables to save space.",
    "solution": {
      "python": "def solve(n):\n    if n == 0: return 0\n    if n == 1: return 1\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    return b",
      "cpp": "int solve(int n) {\n    if (n == 0) return 0;\n    if (n == 1) return 1;\n    int a = 0, b = 1;\n    for(int i=2; i<=n; ++i) {\n        int next = a + b;\n        a = b;\n        b = next;\n    }\n    return b;\n}",
      "java": "public int solve(int n) {\n    if (n == 0) return 0;\n    if (n == 1) return 1;\n    int a = 0, b = 1;\n    for(int i=2; i<=n; ++i) {\n        int next = a + b;\n        a = b;\n        b = next;\n    }\n    return b;\n}",
      "javascript": "function solve(n) {\n    if (n === 0) return 0;\n    if (n === 1) return 1;\n    let a = 0, b = 1;\n    for(let i=2; i<=n; ++i) {\n        let next = a + b;\n        a = b;\n        b = next;\n    }\n    return b;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Find the Nth Term of the Fibonacci Series\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Find the Nth Term of the Fibonacci Series\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(int n) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Find the Nth Term of the Fibonacci Series\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int n) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Find the Nth Term of the Fibonacci Series\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 18,
    "title": "Factorial of a Number",
    "category": "Getting Started",
    "difficulty": "Easy",
    "statement": "Given an integer n, calculate its factorial (n!). Assumes n >= 0.",
    "inputFormat": "n = <integer>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "n = 5",
        "output": "120"
      },
      {
        "input": "n = 0",
        "output": "1"
      }
    ],
    "hint1": "Factorial is the product of all positive integers less than or equal to n.",
    "hint2": "Use a simple iterative loop from 1 to n.",
    "solution": {
      "python": "def solve(n):\n    res = 1\n    for i in range(1, n + 1):\n        res *= i\n    return res",
      "cpp": "int solve(int n) {\n    int res = 1;\n    for(int i=1; i<=n; ++i) res *= i;\n    return res;\n}",
      "java": "public int solve(int n) {\n    int res = 1;\n    for(int i=1; i<=n; ++i) res *= i;\n    return res;\n}",
      "javascript": "function solve(n) {\n    let res = 1;\n    for(let i=1; i<=n; ++i) res *= i;\n    return res;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Factorial of a Number\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Factorial of a Number\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nstring solve(int n) {\\n    // Write your solution here\\n    return \"\";\\n}",
      "java": "// Solution for Factorial of a Number\\nimport java.util.*;\\nclass Solution {\\n    public String solve(int n) {\\n        // Write your solution here\\n        return \"\";\\n    }\\n}",
      "javascript": "// Solution for Factorial of a Number\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 19,
    "title": "Power of a Number",
    "category": "Getting Started",
    "difficulty": "Easy",
    "statement": "Given base and exponent, calculate base raised to exponent.",
    "inputFormat": "base = <integer>, exponent = <integer>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "base = 2, exponent = 3",
        "output": "8"
      },
      {
        "input": "base = 5, exponent = 4",
        "output": "625"
      }
    ],
    "hint1": "You can multiply the base repeatedly exponent times.",
    "hint2": "Use a standard loop or efficient binary exponentiation.",
    "solution": {
      "python": "def solve(base, exponent):\n    return base ** exponent",
      "cpp": "int solve(int base, int exponent) {\n    return pow(base, exponent);\n}",
      "java": "public int solve(int base, int exponent) {\n    return (int)Math.pow(base, exponent);\n}",
      "javascript": "function solve(base, exponent) {\n    return Math.pow(base, exponent);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Power of a Number\\ndef solve(base, exponent):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Power of a Number\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve() {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Power of a Number\\nimport java.util.*;\\nclass Solution {\\n    public int solve() {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Power of a Number\\nfunction solve(base, exponent) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 20,
    "title": "Factor of a Number",
    "category": "Getting Started",
    "difficulty": "Easy",
    "statement": "Given an integer n, return an array of all its factors in sorted ascending order.",
    "inputFormat": "n = <integer>",
    "outputFormat": "Array of integers",
    "examples": [
      {
        "input": "n = 10",
        "output": "[1,2,5,10]"
      },
      {
        "input": "n = 12",
        "output": "[1,2,3,4,6,12]"
      }
    ],
    "hint1": "Iterate from 1 to n.",
    "hint2": "If n % i == 0, then i is a factor. Add it to the array list.",
    "solution": {
      "python": "def solve(n):\n    return [i for i in range(1, n + 1) if n % i == 0]",
      "cpp": "vector<int> solve(int n) {\n    vector<int> res;\n    for(int i=1; i<=n; ++i) {\n        if (n % i == 0) res.push_back(i);\n    }\n    return res;\n}",
      "java": "public int[] solve(int n) {\n    java.util.List<Integer> list = new java.util.ArrayList<>();\n    for(int i=1; i<=n; ++i) {\n        if (n % i == 0) list.add(i);\n    }\n    return list.stream().mapToInt(x -> x).toArray();\n}",
      "javascript": "function solve(n) {\n    let res = [];\n    for(let i=1; i<=n; ++i) {\n        if (n % i === 0) res.push(i);\n    }\n    return res;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Factor of a Number\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Factor of a Number\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nvector<int> solve(int n) {\\n    // Write your solution here\\n    return {};\\n}",
      "java": "// Solution for Factor of a Number\\nimport java.util.*;\\nclass Solution {\\n    public int[] solve(int n) {\\n        // Write your solution here\\n        return new int[]{};\\n    }\\n}",
      "javascript": "// Solution for Factor of a Number\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 21,
    "title": "Finding Prime Factors of a Number",
    "category": "Getting Started",
    "difficulty": "Medium",
    "statement": "Given an integer n, find all its prime factors and return them as a sorted list.",
    "inputFormat": "n = <integer>",
    "outputFormat": "Array of integers",
    "examples": [
      {
        "input": "n = 12",
        "output": "[2,3]"
      },
      {
        "input": "n = 315",
        "output": "[3,5,7]"
      }
    ],
    "hint1": "Keep dividing n by 2 until it is no longer divisible, storing 2 as a prime factor.",
    "hint2": "Then check odd numbers from 3 up to sqrt(n). If n is prime, include it too.",
    "solution": {
      "python": "def solve(n):\n    factors = set()\n    d = 2\n    while d * d <= n:\n        while (n % d) == 0:\n            factors.add(d)\n            n //= d\n        d += 1\n    if n > 1:\n        factors.add(n)\n    return sorted(list(factors))",
      "cpp": "vector<int> solve(int n) {\n    vector<int> res;\n    for (int i = 2; i * i <= n; i++) {\n        if (n % i == 0) {\n            res.push_back(i);\n            while (n % i == 0) n /= i;\n        }\n    }\n    if (n > 1) res.push_back(n);\n    return res;\n}",
      "java": "public int[] solve(int n) {\n    java.util.List<Integer> list = new java.util.ArrayList<>();\n    for (int i = 2; i * i <= n; i++) {\n        if (n % i == 0) {\n            list.add(i);\n            while (n % i == 0) n /= i;\n        }\n    }\n    if (n > 1) list.add(n);\n    return list.stream().mapToInt(x -> x).toArray();\n}",
      "javascript": "function solve(n) {\n    let res = [];\n    for (let i = 2; i * i <= n; i++) {\n        if (n % i === 0) {\n            res.push(i);\n            while (n % i === 0) n /= i;\n        }\n    }\n    if (n > 1) res.push(n);\n    return res;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Finding Prime Factors of a Number\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Finding Prime Factors of a Number\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nvector<int> solve(int n) {\\n    // Write your solution here\\n    return {};\\n}",
      "java": "// Solution for Finding Prime Factors of a Number\\nimport java.util.*;\\nclass Solution {\\n    public int[] solve(int n) {\\n        // Write your solution here\\n        return new int[]{};\\n    }\\n}",
      "javascript": "// Solution for Finding Prime Factors of a Number\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 22,
    "title": "Strong Number",
    "category": "Getting Started",
    "difficulty": "Medium",
    "statement": "A Strong number is a special number whose sum of the factorial of digits is equal to the original number. Check if n is a strong number.",
    "inputFormat": "n = <integer>",
    "outputFormat": "Boolean",
    "examples": [
      {
        "input": "n = 145",
        "output": "true"
      },
      {
        "input": "n = 120",
        "output": "false"
      }
    ],
    "hint1": "Calculate the factorial for each digit (0 to 9).",
    "hint2": "Add these factorials together and check if they equal n.",
    "solution": {
      "python": "def solve(n):\n    import math\n    return sum(math.factorial(int(x)) for x in str(n)) == n",
      "cpp": "bool solve(int n) {\n    int fact[] = {1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880};\n    int sum = 0, temp = n;\n    while(temp > 0) {\n        sum += fact[temp % 10];\n        temp /= 10;\n    }\n    return sum == n;\n}",
      "java": "public boolean solve(int n) {\n    int fact[] = {1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880};\n    int sum = 0, temp = n;\n    while(temp > 0) {\n        sum += fact[temp % 10];\n        temp /= 10;\n    }\n    return sum == n;\n}",
      "javascript": "function solve(n) {\n    const fact = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880];\n    let sum = 0, temp = n;\n    while(temp > 0) {\n        sum += fact[temp % 10];\n        temp = Math.floor(temp / 10);\n    }\n    return sum === n;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Strong Number\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Strong Number\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nbool solve(int n) {\\n    // Write your solution here\\n    return false;\\n}",
      "java": "// Solution for Strong Number\\nimport java.util.*;\\nclass Solution {\\n    public boolean solve(int n) {\\n        // Write your solution here\\n        return false;\\n    }\\n}",
      "javascript": "// Solution for Strong Number\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 23,
    "title": "Perfect Number",
    "category": "Getting Started",
    "difficulty": "Easy",
    "statement": "A Perfect number is a positive integer that is equal to the sum of its positive divisors, excluding the number itself. Determine if n is a perfect number.",
    "inputFormat": "n = <integer>",
    "outputFormat": "Boolean",
    "examples": [
      {
        "input": "n = 6",
        "output": "true"
      },
      {
        "input": "n = 28",
        "output": "true"
      },
      {
        "input": "n = 12",
        "output": "false"
      }
    ],
    "hint1": "Find all proper divisors of n (divisors less than n).",
    "hint2": "Sum the proper divisors and check if their sum is equal to n.",
    "solution": {
      "python": "def solve(n):\n    if n <= 1: return False\n    return sum(i for i in range(1, n) if n % i == 0) == n",
      "cpp": "bool solve(int n) {\n    if (n <= 1) return false;\n    int sum = 1;\n    for(int i=2; i*i<=n; ++i) {\n        if (n % i == 0) {\n            sum += i;\n            if (i*i != n) sum += n/i;\n        }\n    }\n    return sum == n;\n}",
      "java": "public boolean solve(int n) {\n    if (n <= 1) return false;\n    int sum = 1;\n    for(int i=2; i*i<=n; ++i) {\n        if (n % i == 0) {\n            sum += i;\n            if (i*i != n) sum += n/i;\n        }\n    }\n    return sum == n;\n}",
      "javascript": "function solve(n) {\n    if (n <= 1) return false;\n    let sum = 1;\n    for(let i=2; i*i<=n; ++i) {\n        if (n % i === 0) {\n            sum += i;\n            if (i*i !== n) sum += n/i;\n        }\n    }\n    return sum === n;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Perfect Number\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Perfect Number\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nbool solve(int n) {\\n    // Write your solution here\\n    return false;\\n}",
      "java": "// Solution for Perfect Number\\nimport java.util.*;\\nclass Solution {\\n    public boolean solve(int n) {\\n        // Write your solution here\\n        return false;\\n    }\\n}",
      "javascript": "// Solution for Perfect Number\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 24,
    "title": "Perfect Square",
    "category": "Getting Started",
    "difficulty": "Easy",
    "statement": "Check if a given integer n is a perfect square (returns true or false).",
    "inputFormat": "n = <integer>",
    "outputFormat": "Boolean",
    "examples": [
      {
        "input": "n = 25",
        "output": "true"
      },
      {
        "input": "n = 15",
        "output": "false"
      }
    ],
    "hint1": "Take the square root of n using a square root function.",
    "hint2": "Check if the root is an integer by converting to integer and squaring it back.",
    "solution": {
      "python": "def solve(n):\n    import math\n    root = int(math.isqrt(n))\n    return root * root == n",
      "cpp": "bool solve(int n) {\n    int root = sqrt(n);\n    return root * root == n;\n}",
      "java": "public boolean solve(int n) {\n    int root = (int)Math.sqrt(n);\n    return root * root == n;\n}",
      "javascript": "function solve(n) {\n    let root = Math.round(Math.sqrt(n));\n    return root * root === n;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Perfect Square\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Perfect Square\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nbool solve(int n) {\\n    // Write your solution here\\n    return false;\\n}",
      "java": "// Solution for Perfect Square\\nimport java.util.*;\\nclass Solution {\\n    public boolean solve(int n) {\\n        // Write your solution here\\n        return false;\\n    }\\n}",
      "javascript": "// Solution for Perfect Square\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 25,
    "title": "Automorphic Number",
    "category": "Getting Started",
    "difficulty": "Medium",
    "statement": "An Automorphic number is a number whose square ends in the same digits as the number itself. Determine if n is automorphic.",
    "inputFormat": "n = <integer>",
    "outputFormat": "Boolean",
    "examples": [
      {
        "input": "n = 76",
        "output": "true"
      },
      {
        "input": "n = 25",
        "output": "true"
      },
      {
        "input": "n = 12",
        "output": "false"
      }
    ],
    "hint1": "Find the square of the number n.",
    "hint2": "Compare the last digits of the square with the digits of n. You can use modulo 10^len(n).",
    "solution": {
      "python": "def solve(n):\n    sq = n * n\n    return str(sq).endswith(str(n))",
      "cpp": "bool solve(int n) {\n    long long sq = (long long)n * n;\n    int temp = n;\n    int mod = 1;\n    while(temp > 0) {\n        mod *= 10;\n        temp /= 10;\n    }\n    return (sq % mod) == n;\n}",
      "java": "public boolean solve(int n) {\n    long sq = (long)n * n;\n    int temp = n;\n    int mod = 1;\n    while(temp > 0) {\n        mod *= 10;\n        temp /= 10;\n    }\n    return (sq % mod) == n;\n}",
      "javascript": "function solve(n) {\n    let sq = n * n;\n    return sq.toString().endsWith(n.toString());\n}"
    },
    "boilerplate": {
      "python": "# Solution for Automorphic Number\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Automorphic Number\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nbool solve(int n) {\\n    // Write your solution here\\n    return false;\\n}",
      "java": "// Solution for Automorphic Number\\nimport java.util.*;\\nclass Solution {\\n    public boolean solve(int n) {\\n        // Write your solution here\\n        return false;\\n    }\\n}",
      "javascript": "// Solution for Automorphic Number\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 26,
    "title": "Harshad Number",
    "category": "Getting Started",
    "difficulty": "Easy",
    "statement": "A Harshad number (or Niven number) is an integer that is divisible by the sum of its digits. Check if n is a Harshad number.",
    "inputFormat": "n = <integer>",
    "outputFormat": "Boolean",
    "examples": [
      {
        "input": "n = 21",
        "output": "true"
      },
      {
        "input": "n = 15",
        "output": "false"
      }
    ],
    "hint1": "Compute the sum of the digits of n.",
    "hint2": "Check if n is divisible by this sum (n % sum == 0).",
    "solution": {
      "python": "def solve(n):\n    s = sum(int(d) for d in str(n))\n    return n % s == 0",
      "cpp": "bool solve(int n) {\n    int sum = 0, temp = n;\n    while(temp > 0) {\n        sum += temp % 10;\n        temp /= 10;\n    }\n    return n % sum == 0;\n}",
      "java": "public boolean solve(int n) {\n    int sum = 0, temp = n;\n    while(temp > 0) {\n        sum += temp % 10;\n        temp /= 10;\n    }\n    return n % sum == 0;\n}",
      "javascript": "function solve(n) {\n    let sum = 0, temp = n;\n    while(temp > 0) {\n        sum += temp % 10;\n        temp = Math.floor(temp / 10);\n    }\n    return n % sum === 0;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Harshad Number\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Harshad Number\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nbool solve(int n) {\\n    // Write your solution here\\n    return false;\\n}",
      "java": "// Solution for Harshad Number\\nimport java.util.*;\\nclass Solution {\\n    public boolean solve(int n) {\\n        // Write your solution here\\n        return false;\\n    }\\n}",
      "javascript": "// Solution for Harshad Number\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 27,
    "title": "Abundant Number",
    "category": "Getting Started",
    "difficulty": "Medium",
    "statement": "An Abundant number is a number for which the sum of its proper divisors is greater than the number itself. Determine if n is abundant.",
    "inputFormat": "n = <integer>",
    "outputFormat": "Boolean",
    "examples": [
      {
        "input": "n = 12",
        "output": "true"
      },
      {
        "input": "n = 15",
        "output": "false"
      }
    ],
    "hint1": "Calculate the sum of all proper divisors of n.",
    "hint2": "Compare the sum of proper divisors with n. If sum > n, return true.",
    "solution": {
      "python": "def solve(n):\n    return sum(i for i in range(1, n) if n % i == 0) > n",
      "cpp": "bool solve(int n) {\n    int sum = 0;\n    for(int i=1; i<n; ++i) if(n%i==0) sum += i;\n    return sum > n;\n}",
      "java": "public boolean solve(int n) {\n    int sum = 0;\n    for(int i=1; i<n; ++i) if(n%i==0) sum += i;\n    return sum > n;\n}",
      "javascript": "function solve(n) {\n    let sum = 0;\n    for(let i=1; i<n; ++i) if(n%i===0) sum += i;\n    return sum > n;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Abundant Number\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Abundant Number\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nbool solve(int n) {\\n    // Write your solution here\\n    return false;\\n}",
      "java": "// Solution for Abundant Number\\nimport java.util.*;\\nclass Solution {\\n    public boolean solve(int n) {\\n        // Write your solution here\\n        return false;\\n    }\\n}",
      "javascript": "// Solution for Abundant Number\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 28,
    "title": "Friendly Pair",
    "category": "Getting Started",
    "difficulty": "Medium",
    "statement": "Two numbers are a Friendly Pair if the ratio of the sum of their divisors to the number itself is the same for both. Check if a and b form a friendly pair.",
    "inputFormat": "a = <integer>, b = <integer>",
    "outputFormat": "Boolean",
    "examples": [
      {
        "input": "a = 6, b = 28",
        "output": "true"
      },
      {
        "input": "a = 6, b = 12",
        "output": "false"
      }
    ],
    "hint1": "Calculate the sum of all divisors (including the number itself) for both a and b.",
    "hint2": "Compare the ratios: (sum of divisors of a) / a == (sum of divisors of b) / b.",
    "solution": {
      "python": "def solve(a, b):\n    sum_a = sum(i for i in range(1, a + 1) if a % i == 0)\n    sum_b = sum(i for i in range(1, b + 1) if b % i == 0)\n    return sum_a / a == sum_b / b",
      "cpp": "bool solve(int a, int b) {\n    int sum_a = 0, sum_b = 0;\n    for(int i=1; i<=a; ++i) if(a%i==0) sum_a += i;\n    for(int i=1; i<=b; ++i) if(b%i==0) sum_b += i;\n    return (double)sum_a / a == (double)sum_b / b;\n}",
      "java": "public boolean solve(int a, int b) {\n    int sum_a = 0, sum_b = 0;\n    for(int i=1; i<=a; ++i) if(a%i==0) sum_a += i;\n    for(int i=1; i<=b; ++i) if(b%i==0) sum_b += i;\n    return (double)sum_a / a == (double)sum_b / b;\n}",
      "javascript": "function solve(a, b) {\n    let sum_a = 0, sum_b = 0;\n    for(let i=1; i<=a; ++i) if(a%i===0) sum_a += i;\n    for(let i=1; i<=b; ++i) if(b%i===0) sum_b += i;\n    return sum_a / a === sum_b / b;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Friendly Pair\\ndef solve(a, b):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Friendly Pair\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nbool solve(int a, int b) {\\n    // Write your solution here\\n    return false;\\n}",
      "java": "// Solution for Friendly Pair\\nimport java.util.*;\\nclass Solution {\\n    public boolean solve(int a, int b) {\\n        // Write your solution here\\n        return false;\\n    }\\n}",
      "javascript": "// Solution for Friendly Pair\\nfunction solve(a, b) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 29,
    "title": "Highest Common Factor(HCF)",
    "category": "Working with Numbers",
    "difficulty": "Easy",
    "statement": "Find the Highest Common Factor (HCF) of two positive integers a and b.",
    "inputFormat": "a = <integer>, b = <integer>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "a = 36, b = 60",
        "output": "12"
      },
      {
        "input": "a = 9, b = 27",
        "output": "9"
      }
    ],
    "hint1": "The HCF is the greatest positive integer that divides both numbers.",
    "hint2": "Use the Euclidean algorithm recursively: hcf(a, b) = hcf(b, a % b).",
    "solution": {
      "python": "def solve(a, b):\n    import math\n    return math.gcd(a, b)",
      "cpp": "int solve(int a, int b) {\n    while (b) {\n        a %= b;\n        swap(a, b);\n    }\n    return a;\n}",
      "java": "public int solve(int a, int b) {\n    while (b > 0) {\n        int temp = b;\n        b = a % b;\n        a = temp;\n    }\n    return a;\n}",
      "javascript": "function solve(a, b) {\n    while (b) {\n        let temp = b;\n        b = a % b;\n        a = temp;\n    }\n    return a;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Highest Common Factor(HCF)\\ndef solve(a, b):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Highest Common Factor(HCF)\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(int a, int b) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Highest Common Factor(HCF)\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int a, int b) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Highest Common Factor(HCF)\\nfunction solve(a, b) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 30,
    "title": "Lowest Common Multiple (LCM)",
    "category": "Working with Numbers",
    "difficulty": "Easy",
    "statement": "Find the Lowest Common Multiple (LCM) of two positive integers a and b.",
    "inputFormat": "a = <integer>, b = <integer>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "a = 12, b = 18",
        "output": "36"
      },
      {
        "input": "a = 5, b = 7",
        "output": "35"
      }
    ],
    "hint1": "LCM is the smallest positive integer divisible by both numbers.",
    "hint2": "Use the formula: LCM(a, b) = (a * b) / GCD(a, b).",
    "solution": {
      "python": "def solve(a, b):\n    import math\n    return (a * b) // math.gcd(a, b)",
      "cpp": "int solve(int a, int b) {\n    int temp_a = a, temp_b = b;\n    while (temp_b) {\n        temp_a %= temp_b;\n        swap(temp_a, temp_b);\n    }\n    return (a * b) / temp_a;\n}",
      "java": "public int solve(int a, int b) {\n    int gcd = getGCD(a, b);\n    return (a * b) / gcd;\n}\nprivate int getGCD(int a, int b) {\n    while (b > 0) {\n        int temp = b;\n        b = a % b;\n        a = temp;\n    }\n    return a;\n}",
      "javascript": "function solve(a, b) {\n    let temp_a = a, temp_b = b;\n    while (temp_b) {\n        let temp = temp_b;\n        temp_b = temp_a % temp_b;\n        temp_a = temp;\n    }\n    return (a * b) / temp_a;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Lowest Common Multiple (LCM)\\ndef solve(a, b):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Lowest Common Multiple (LCM)\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(int a, int b) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Lowest Common Multiple (LCM)\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int a, int b) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Lowest Common Multiple (LCM)\\nfunction solve(a, b) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 31,
    "title": "Greatest Common Divisor",
    "category": "Working with Numbers",
    "difficulty": "Easy",
    "statement": "Find the Greatest Common Divisor (GCD) of two numbers. This is identical to HCF.",
    "inputFormat": "a = <integer>, b = <integer>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "a = 45, b = 75",
        "output": "15"
      },
      {
        "input": "a = 8, b = 12",
        "output": "4"
      }
    ],
    "hint1": "Use the standard division or Euclidean algorithm.",
    "hint2": "Loop while b > 0 and update: temp = b, b = a % b, a = temp.",
    "solution": {
      "python": "def solve(a, b):\n    import math\n    return math.gcd(a, b)",
      "cpp": "int solve(int a, int b) {\n    while (b) {\n        a %= b;\n        swap(a, b);\n    }\n    return a;\n}",
      "java": "public int solve(int a, int b) {\n    while (b > 0) {\n        int temp = b;\n        b = a % b;\n        a = temp;\n    }\n    return a;\n}",
      "javascript": "function solve(a, b) {\n    while (b) {\n        let temp = b;\n        b = a % b;\n        a = temp;\n    }\n    return a;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Greatest Common Divisor\\ndef solve(a, b):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Greatest Common Divisor\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(int a, int b) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Greatest Common Divisor\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int a, int b) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Greatest Common Divisor\\nfunction solve(a, b) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 32,
    "title": "Binary to Decimal Conversion",
    "category": "Working with Numbers",
    "difficulty": "Easy",
    "statement": "Given a binary string binary, return its decimal equivalent integer.",
    "inputFormat": "binary = <string>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "binary = \"1010\"",
        "output": "10"
      },
      {
        "input": "binary = \"1111\"",
        "output": "15"
      }
    ],
    "hint1": "Each digit represents a power of 2, starting from right to left (2^0, 2^1, etc.).",
    "hint2": "Iterate from the end of the string, multiply digit by base power, and double the base power each step.",
    "solution": {
      "python": "def solve(binary):\n    return int(binary, 2)",
      "cpp": "int solve(string binary) {\n    int dec = 0;\n    for(char c : binary) {\n        dec = dec * 2 + (c - '0');\n    }\n    return dec;\n}",
      "java": "public int solve(String binary) {\n    return Integer.parseInt(binary, 2);\n}",
      "javascript": "function solve(binary) {\n    return parseInt(binary, 2);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Binary to Decimal Conversion\\ndef solve(binary):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Binary to Decimal Conversion\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nstring solve(string binary) {\\n    // Write your solution here\\n    return \"\";\\n}",
      "java": "// Solution for Binary to Decimal Conversion\\nimport java.util.*;\\nclass Solution {\\n    public String solve(String binary) {\\n        // Write your solution here\\n        return \"\";\\n    }\\n}",
      "javascript": "// Solution for Binary to Decimal Conversion\\nfunction solve(binary) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 33,
    "title": "Octal to Decimal Conversion",
    "category": "Working with Numbers",
    "difficulty": "Easy",
    "statement": "Given an octal string octal, return its decimal equivalent integer.",
    "inputFormat": "octal = <string>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "octal = \"12\"",
        "output": "10"
      },
      {
        "input": "octal = \"117\"",
        "output": "79"
      }
    ],
    "hint1": "Similar to binary conversion, but the base multiplier is 8.",
    "hint2": "Parse the string using standard string conversion functions with base 8.",
    "solution": {
      "python": "def solve(octal):\n    return int(octal, 8)",
      "cpp": "int solve(string octal) {\n    int dec = 0;\n    for(char c : octal) {\n        dec = dec * 8 + (c - '0');\n    }\n    return dec;\n}",
      "java": "public int solve(String octal) {\n    return Integer.parseInt(octal, 8);\n}",
      "javascript": "function solve(octal) {\n    return parseInt(octal, 8);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Octal to Decimal Conversion\\ndef solve(octal):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Octal to Decimal Conversion\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nstring solve(string octal) {\\n    // Write your solution here\\n    return \"\";\\n}",
      "java": "// Solution for Octal to Decimal Conversion\\nimport java.util.*;\\nclass Solution {\\n    public String solve(String octal) {\\n        // Write your solution here\\n        return \"\";\\n    }\\n}",
      "javascript": "// Solution for Octal to Decimal Conversion\\nfunction solve(octal) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 34,
    "title": "Hexadecimal to Decimal Conversion",
    "category": "Working with Numbers",
    "difficulty": "Easy",
    "statement": "Given a hexadecimal string hex_str, return its decimal equivalent integer.",
    "inputFormat": "hex_str = <string>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "hex_str = \"A\"",
        "output": "10"
      },
      {
        "input": "hex_str = \"1A\"",
        "output": "26"
      }
    ],
    "hint1": "The base is 16. Digits are 0-9 and A-F (representing 10-15).",
    "hint2": "Use standard string parsers specifying base 16.",
    "solution": {
      "python": "def solve(hex_str):\n    return int(hex_str, 16)",
      "cpp": "int solve(string hex_str) {\n    int dec = 0;\n    for(char c : hex_str) {\n        int val = 0;\n        if (c >= '0' && c <= '9') val = c - '0';\n        else if (c >= 'A' && c <= 'F') val = c - 'A' + 10;\n        else if (c >= 'a' && c <= 'f') val = c - 'a' + 10;\n        dec = dec * 16 + val;\n    }\n    return dec;\n}",
      "java": "public int solve(String hex_str) {\n    return Integer.parseInt(hex_str, 16);\n}",
      "javascript": "function solve(hex_str) {\n    return parseInt(hex_str, 16);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Hexadecimal to Decimal Conversion\\ndef solve(hex_str):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Hexadecimal to Decimal Conversion\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nstring solve(string hex_str) {\\n    // Write your solution here\\n    return \"\";\\n}",
      "java": "// Solution for Hexadecimal to Decimal Conversion\\nimport java.util.*;\\nclass Solution {\\n    public String solve(String hex_str) {\\n        // Write your solution here\\n        return \"\";\\n    }\\n}",
      "javascript": "// Solution for Hexadecimal to Decimal Conversion\\nfunction solve(hex_str) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 35,
    "title": "Decimal to Binary Conversion",
    "category": "Working with Numbers",
    "difficulty": "Easy",
    "statement": "Given a decimal integer n, return its binary representation string.",
    "inputFormat": "n = <integer>",
    "outputFormat": "String",
    "examples": [
      {
        "input": "n = 10",
        "output": "\"1010\""
      },
      {
        "input": "n = 15",
        "output": "\"1111\""
      }
    ],
    "hint1": "Divide n by 2 repeatedly and collect the remainders in reverse order.",
    "hint2": "Or, use a standard formatting function like bin() in Python or toString(2) in JS.",
    "solution": {
      "python": "def solve(n):\n    return bin(n)[2:]",
      "cpp": "string solve(int n) {\n    if (n == 0) return \"0\";\n    string res = \"\";\n    while (n > 0) {\n        res = to_string(n % 2) + res;\n        n /= 2;\n    }\n    return res;\n}",
      "java": "public String solve(int n) {\n    return Integer.toBinaryString(n);\n}",
      "javascript": "function solve(n) {\n    return n.toString(2);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Decimal to Binary Conversion\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Decimal to Binary Conversion\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(int n) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Decimal to Binary Conversion\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int n) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Decimal to Binary Conversion\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 36,
    "title": "Decimal to Octal Conversion",
    "category": "Working with Numbers",
    "difficulty": "Easy",
    "statement": "Given a decimal integer n, return its octal representation string.",
    "inputFormat": "n = <integer>",
    "outputFormat": "String",
    "examples": [
      {
        "input": "n = 10",
        "output": "\"12\""
      },
      {
        "input": "n = 79",
        "output": "\"117\""
      }
    ],
    "hint1": "Divide n by 8 repeatedly and collect the remainders.",
    "hint2": "Use oct() in Python, octal format in C++ or toString(8) in JS.",
    "solution": {
      "python": "def solve(n):\n    return oct(n)[2:]",
      "cpp": "string solve(int n) {\n    if (n == 0) return \"0\";\n    string res = \"\";\n    while (n > 0) {\n        res = to_string(n % 8) + res;\n        n /= 8;\n    }\n    return res;\n}",
      "java": "public String solve(int n) {\n    return Integer.toOctalString(n);\n}",
      "javascript": "function solve(n) {\n    return n.toString(8);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Decimal to Octal Conversion\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Decimal to Octal Conversion\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(int n) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Decimal to Octal Conversion\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int n) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Decimal to Octal Conversion\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 37,
    "title": "Decimal to Hexadecimal Conversion",
    "category": "Working with Numbers",
    "difficulty": "Easy",
    "statement": "Given a decimal integer n, return its hexadecimal representation string (uppercase).",
    "inputFormat": "n = <integer>",
    "outputFormat": "String",
    "examples": [
      {
        "input": "n = 10",
        "output": "\"A\""
      },
      {
        "input": "n = 26",
        "output": "\"1A\""
      }
    ],
    "hint1": "Divide n by 16 and map remainders 10-15 to characters A-F.",
    "hint2": "Apply built-in uppercase hex formats.",
    "solution": {
      "python": "def solve(n):\n    return hex(n)[2:].upper()",
      "cpp": "string solve(int n) {\n    if (n == 0) return \"0\";\n    string res = \"\";\n    char mapping[] = \"0123456789ABCDEF\";\n    while (n > 0) {\n        res = mapping[n % 16] + res;\n        n /= 16;\n    }\n    return res;\n}",
      "java": "public String solve(int n) {\n    return Integer.toHexString(n).toUpperCase();\n}",
      "javascript": "function solve(n) {\n    return n.toString(16).toUpperCase();\n}"
    },
    "boilerplate": {
      "python": "# Solution for Decimal to Hexadecimal Conversion\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Decimal to Hexadecimal Conversion\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(int n) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Decimal to Hexadecimal Conversion\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int n) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Decimal to Hexadecimal Conversion\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 38,
    "title": "Binary to Octal Conversion",
    "category": "Working with Numbers",
    "difficulty": "Medium",
    "statement": "Given a binary string binary, return its octal representation string.",
    "inputFormat": "binary = <string>",
    "outputFormat": "String",
    "examples": [
      {
        "input": "binary = \"1010\"",
        "output": "\"12\""
      },
      {
        "input": "binary = \"1111\"",
        "output": "\"17\""
      }
    ],
    "hint1": "Convert the binary string to a decimal integer first.",
    "hint2": "Then convert that decimal integer to an octal representation string.",
    "solution": {
      "python": "def solve(binary):\n    return oct(int(binary, 2))[2:]",
      "cpp": "string solve(string binary) {\n    int dec = 0;\n    for(char c : binary) dec = dec * 2 + (c - '0');\n    string oct = \"\";\n    if (dec == 0) return \"0\";\n    while(dec > 0) {\n        oct = to_string(dec % 8) + oct;\n        dec /= 8;\n    }\n    return oct;\n}",
      "java": "public String solve(String binary) {\n    int dec = Integer.parseInt(binary, 2);\n    return Integer.toOctalString(dec);\n}",
      "javascript": "function solve(binary) {\n    let dec = parseInt(binary, 2);\n    return dec.toString(8);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Binary to Octal Conversion\\ndef solve(binary):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Binary to Octal Conversion\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nstring solve(string binary) {\\n    // Write your solution here\\n    return \"\";\\n}",
      "java": "// Solution for Binary to Octal Conversion\\nimport java.util.*;\\nclass Solution {\\n    public String solve(String binary) {\\n        // Write your solution here\\n        return \"\";\\n    }\\n}",
      "javascript": "// Solution for Binary to Octal Conversion\\nfunction solve(binary) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 39,
    "title": "Octal to Binary Conversion",
    "category": "Working with Numbers",
    "difficulty": "Medium",
    "statement": "Given an octal string octal, return its binary representation string.",
    "inputFormat": "octal = <string>",
    "outputFormat": "String",
    "examples": [
      {
        "input": "octal = \"12\"",
        "output": "\"1010\""
      },
      {
        "input": "octal = \"17\"",
        "output": "\"1111\""
      }
    ],
    "hint1": "Convert the octal string to a decimal integer first.",
    "hint2": "Then convert that decimal integer to a binary representation string.",
    "solution": {
      "python": "def solve(octal):\n    return bin(int(octal, 8))[2:]",
      "cpp": "string solve(string octal) {\n    int dec = 0;\n    for(char c : octal) dec = dec * 8 + (c - '0');\n    string bin = \"\";\n    if (dec == 0) return \"0\";\n    while(dec > 0) {\n        bin = to_string(dec % 2) + bin;\n        dec /= 2;\n    }\n    return bin;\n}",
      "java": "public String solve(String octal) {\n    int dec = Integer.parseInt(octal, 8);\n    return Integer.toBinaryString(dec);\n}",
      "javascript": "function solve(octal) {\n    let dec = parseInt(octal, 8);\n    return dec.toString(2);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Octal to Binary Conversion\\ndef solve(octal):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Octal to Binary Conversion\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nstring solve(string octal) {\\n    // Write your solution here\\n    return \"\";\\n}",
      "java": "// Solution for Octal to Binary Conversion\\nimport java.util.*;\\nclass Solution {\\n    public String solve(String octal) {\\n        // Write your solution here\\n        return \"\";\\n    }\\n}",
      "javascript": "// Solution for Octal to Binary Conversion\\nfunction solve(octal) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 40,
    "title": "Quadrants in Which a Given Coordinate Lies",
    "category": "Working with Numbers",
    "difficulty": "Easy",
    "statement": "Given coordinates (x, y), return which quadrant the point lies in (1, 2, 3, or 4). If it lies on the origin or axes, return 0.",
    "inputFormat": "x = <integer>, y = <integer>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "x = 4, y = 5",
        "output": "1"
      },
      {
        "input": "x = -3, y = 2",
        "output": "2"
      },
      {
        "input": "x = -1, y = -1",
        "output": "3"
      },
      {
        "input": "x = 2, y = -5",
        "output": "4"
      }
    ],
    "hint1": "Quadrant 1 has both x and y positive.",
    "hint2": "Quadrant 2: x < 0, y > 0. Quadrant 3: both negative. Quadrant 4: x > 0, y < 0.",
    "solution": {
      "python": "def solve(x, y):\n    if x > 0 and y > 0: return 1\n    if x < 0 and y > 0: return 2\n    if x < 0 and y < 0: return 3\n    if x > 0 and y < 0: return 4\n    return 0",
      "cpp": "int solve(int x, int y) {\n    if (x > 0 && y > 0) return 1;\n    if (x < 0 && y > 0) return 2;\n    if (x < 0 && y < 0) return 3;\n    if (x > 0 && y < 0) return 4;\n    return 0;\n}",
      "java": "public int solve(int x, int y) {\n    if (x > 0 && y > 0) return 1;\n    if (x < 0 && y > 0) return 2;\n    if (x < 0 && y < 0) return 3;\n    if (x > 0 && y < 0) return 4;\n    return 0;\n}",
      "javascript": "function solve(x, y) {\n    if (x > 0 && y > 0) return 1;\n    if (x < 0 && y > 0) return 2;\n    if (x < 0 && y < 0) return 3;\n    if (x > 0 && y < 0) return 4;\n    return 0;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Quadrants in Which a Given Coordinate Lies\\ndef solve(x, y):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Quadrants in Which a Given Coordinate Lies\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(int x) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Quadrants in Which a Given Coordinate Lies\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int x) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Quadrants in Which a Given Coordinate Lies\\nfunction solve(x, y) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 41,
    "title": "Permutations in Which n People Can Occupy r Seats",
    "category": "Working with Numbers",
    "difficulty": "Easy",
    "statement": "Given n people and r seats (where n >= r), calculate the number of permutations: nPr = n! / (n - r)!",
    "inputFormat": "n = <integer>, r = <integer>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "n = 5, r = 3",
        "output": "60"
      },
      {
        "input": "n = 6, r = 2",
        "output": "30"
      }
    ],
    "hint1": "Calculate the factorial of n and the factorial of (n - r).",
    "hint2": "Or, multiply from n down to (n - r + 1) directly using a loop.",
    "solution": {
      "python": "def solve(n, r):\n    import math\n    return math.perm(n, r)",
      "cpp": "int solve(int n, int r) {\n    int res = 1;\n    for(int i = n; i > n - r; i--) {\n        res *= i;\n    }\n    return res;\n}",
      "java": "public int solve(int n, int r) {\n    int res = 1;\n    for(int i = n; i > n - r; i--) {\n        res *= i;\n    }\n    return res;\n}",
      "javascript": "function solve(n, r) {\n    let res = 1;\n    for(let i = n; i > n - r; i--) {\n        res *= i;\n    }\n    return res;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Permutations in Which n People Can Occupy r Seats\\ndef solve(n, r):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Permutations in Which n People Can Occupy r Seats\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(int n, int r) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Permutations in Which n People Can Occupy r Seats\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int n, int r) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Permutations in Which n People Can Occupy r Seats\\nfunction solve(n, r) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 42,
    "title": "Maximum Number of Handshakes",
    "category": "Working with Numbers",
    "difficulty": "Easy",
    "statement": "Given n people in a room, calculate the maximum number of handshakes that can take place between them: n * (n - 1) / 2.",
    "inputFormat": "n = <integer>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "n = 4",
        "output": "6"
      },
      {
        "input": "n = 10",
        "output": "45"
      }
    ],
    "hint1": "Each person can shake hands with n - 1 other people.",
    "hint2": "Since handshake between A-B is same as B-A, divide by 2.",
    "solution": {
      "python": "def solve(n):\n    return n * (n - 1) // 2",
      "cpp": "int solve(int n) {\n    return n * (n - 1) / 2;\n}",
      "java": "public int solve(int n) {\n    return n * (n - 1) / 2;\n}",
      "javascript": "function solve(n) {\n    return n * (n - 1) / 2;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Maximum Number of Handshakes\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Maximum Number of Handshakes\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(int n) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Maximum Number of Handshakes\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int n) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Maximum Number of Handshakes\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 43,
    "title": "Addition of Two Fractions",
    "category": "Working with Numbers",
    "difficulty": "Medium",
    "statement": "Given numerators and denominators of two fractions (num1, den1) and (num2, den2), return their sum fraction formatted as a string 'numerator/denominator' in its simplest form.",
    "inputFormat": "num1 = <integer>, den1 = <integer>, num2 = <integer>, den2 = <integer>",
    "outputFormat": "String",
    "examples": [
      {
        "input": "num1 = 1, den1 = 3, num2 = 1, den2 = 2",
        "output": "\"5/6\""
      },
      {
        "input": "num1 = 2, den1 = 4, num2 = 1, den2 = 4",
        "output": "\"3/4\""
      }
    ],
    "hint1": "Find a common denominator (den1 * den2). The combined numerator becomes (num1 * den2 + num2 * den1).",
    "hint2": "Divide both parts of the sum fraction by their Greatest Common Divisor (GCD) to simplify.",
    "solution": {
      "python": "def solve(num1, den1, num2, den2):\n    import math\n    num = num1 * den2 + num2 * den1\n    den = den1 * den2\n    g = math.gcd(num, den)\n    return f\"{num//g}/{den//g}\"",
      "cpp": "string solve(int num1, int den1, int num2, int den2) {\n    int num = num1 * den2 + num2 * den1;\n    int den = den1 * den2;\n    auto get_gcd = [](int a, int b) {\n        while (b) { a %= b; swap(a, b); }\n        return a;\n    };\n    int g = get_gcd(num, den);\n    return to_string(num/g) + \"/\" + to_string(den/g);\n}",
      "java": "public String solve(int num1, int den1, int num2, int den2) {\n    int num = num1 * den2 + num2 * den1;\n    int den = den1 * den2;\n    int g = getGCD(num, den);\n    return (num/g) + \"/\" + (den/g);\n}\nprivate int getGCD(int a, int b) {\n    while (b > 0) {\n        int temp = b;\n        b = a % b;\n        a = temp;\n    }\n    return a;\n}",
      "javascript": "function solve(num1, den1, num2, den2) {\n    let num = num1 * den2 + num2 * den1;\n    let den = den1 * den2;\n    function getGCD(a, b) {\n        while (b) {\n            let temp = b;\n            b = a % b;\n            a = temp;\n        }\n        return a;\n    }\n    let g = getGCD(num, den);\n    return `${num/g}/${den/g}`;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Addition of Two Fractions\\ndef solve(num1, den1, num2, den2):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Addition of Two Fractions\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nstring solve() {\\n    // Write your solution here\\n    return \"\";\\n}",
      "java": "// Solution for Addition of Two Fractions\\nimport java.util.*;\\nclass Solution {\\n    public String solve() {\\n        // Write your solution here\\n        return \"\";\\n    }\\n}",
      "javascript": "// Solution for Addition of Two Fractions\\nfunction solve(num1, den1, num2, den2) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 44,
    "title": "Replace All 0\u2019s with 1 in a Given Integer",
    "category": "Working with Numbers",
    "difficulty": "Easy",
    "statement": "Given an integer n, replace all occurrences of digit 0 with digit 1 and return the updated integer.",
    "inputFormat": "n = <integer>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "n = 10204",
        "output": "11214"
      },
      {
        "input": "n = 400",
        "output": "411"
      }
    ],
    "hint1": "Convert the integer to a string.",
    "hint2": "Replace all characters '0' with '1', and parse the string back into an integer.",
    "solution": {
      "python": "def solve(n):\n    return int(str(n).replace('0', '1'))",
      "cpp": "int solve(int n) {\n    string s = to_string(n);\n    for(char &c : s) if(c == '0') c = '1';\n    return stoi(s);\n}",
      "java": "public int solve(int n) {\n    String s = String.valueOf(n).replace('0', '1');\n    return Integer.parseInt(s);\n}",
      "javascript": "function solve(n) {\n    return parseInt(n.toString().replace(/0/g, '1'));\n}"
    },
    "boilerplate": {
      "python": "# Solution for Replace All 0\u2019s with 1 in a Given Integer\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Replace All 0\u2019s with 1 in a Given Integer\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nstring solve(int n) {\\n    // Write your solution here\\n    return \"\";\\n}",
      "java": "// Solution for Replace All 0\u2019s with 1 in a Given Integer\\nimport java.util.*;\\nclass Solution {\\n    public String solve(int n) {\\n        // Write your solution here\\n        return \"\";\\n    }\\n}",
      "javascript": "// Solution for Replace All 0\u2019s with 1 in a Given Integer\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 45,
    "title": "Can a Number Be Expressed as a Sum of Two Prime Numbers",
    "category": "Working with Numbers",
    "difficulty": "Medium",
    "statement": "Determine whether a given even integer n (where n > 2) can be expressed as the sum of two prime numbers. Return true or false.",
    "inputFormat": "n = <integer>",
    "outputFormat": "Boolean",
    "examples": [
      {
        "input": "n = 74",
        "output": "true"
      },
      {
        "input": "n = 11",
        "output": "false"
      }
    ],
    "hint1": "Iterate i from 2 up to n/2.",
    "hint2": "Check if both i and (n - i) are prime numbers. If yes, return true.",
    "solution": {
      "python": "def solve(n):\n    def is_prime(x):\n        if x <= 1: return False\n        for i in range(2, int(x**0.5)+1):\n            if x % i == 0: return False\n        return True\n    for i in range(2, n // 2 + 1):\n        if is_prime(i) and is_prime(n - i):\n            return True\n    return False",
      "cpp": "bool solve(int n) {\n    auto is_prime = [](int x) {\n        if (x <= 1) return false;\n        for(int i=2; i*i<=x; ++i) if(x%i==0) return false;\n        return true;\n    };\n    for(int i=2; i<=n/2; ++i) {\n        if (is_prime(i) && is_prime(n - i)) return true;\n    }\n    return false;\n}",
      "java": "public boolean solve(int n) {\n    for(int i=2; i<=n/2; ++i) {\n        if (isPrime(i) && isPrime(n - i)) return true;\n    }\n    return false;\n}\nprivate boolean isPrime(int x) {\n    if (x <= 1) return false;\n    for(int i=2; i*i<=x; ++i) if(x%i==0) return false;\n    return true;\n}",
      "javascript": "function solve(n) {\n    function isPrime(x) {\n        if (x <= 1) return false;\n        for(let i=2; i*i<=x; ++i) if(x%i===0) return false;\n        return true;\n    }\n    for(let i=2; i<=n/2; ++i) {\n        if (isPrime(i) && isPrime(n - i)) return true;\n    }\n    return false;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Can a Number Be Expressed as a Sum of Two Prime Numbers\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Can a Number Be Expressed as a Sum of Two Prime Numbers\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nbool solve(int n) {\\n    // Write your solution here\\n    return false;\\n}",
      "java": "// Solution for Can a Number Be Expressed as a Sum of Two Prime Numbers\\nimport java.util.*;\\nclass Solution {\\n    public boolean solve(int n) {\\n        // Write your solution here\\n        return false;\\n    }\\n}",
      "javascript": "// Solution for Can a Number Be Expressed as a Sum of Two Prime Numbers\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 46,
    "title": "Count Possible Decoding of a Given Digit Sequence",
    "category": "Working with Numbers",
    "difficulty": "Hard",
    "statement": "Given a digit sequence string seq, return the number of ways to decode it, where '1' maps to 'A', '2' to 'B', ..., '26' to 'Z'.",
    "inputFormat": "seq = <string>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "seq = \"121\"",
        "output": "3"
      },
      {
        "input": "seq = \"12\"",
        "output": "2"
      }
    ],
    "hint1": "This is a dynamic programming problem similar to climbing stairs.",
    "hint2": "Let dp[i] represent decoding options up to index i. Check single digit (seq[i-1] != '0') and double digit pairs (10 <= pair <= 26).",
    "solution": {
      "python": "def solve(seq):\n    if not seq or seq[0] == '0': return 0\n    n = len(seq)\n    dp = [0] * (n + 1)\n    dp[0], dp[1] = 1, 1\n    for i in range(2, n + 1):\n        if seq[i-1] != '0':\n            dp[i] += dp[i-1]\n        two_digit = int(seq[i-2:i])\n        if 10 <= two_digit <= 26:\n            dp[i] += dp[i-2]\n    return dp[n]",
      "cpp": "int solve(string seq) {\n    if (seq.empty() || seq[0] == '0') return 0;\n    int n = seq.length();\n    vector<int> dp(n + 1, 0);\n    dp[0] = 1; dp[1] = 1;\n    for(int i=2; i<=n; ++i) {\n        if (seq[i-1] != '0') dp[i] += dp[i-1];\n        int double_val = stoi(seq.substr(i-2, 2));\n        if (double_val >= 10 && double_val <= 26) dp[i] += dp[i-2];\n    }\n    return dp[n];\n}",
      "java": "public int solve(String seq) {\n    if (seq == null || seq.length() == 0 || seq.charAt(0) == '0') return 0;\n    int n = seq.length();\n    int[] dp = new int[n + 1];\n    dp[0] = 1; dp[1] = 1;\n    for (int i = 2; i <= n; i++) {\n        if (seq.charAt(i - 1) != '0') dp[i] += dp[i - 1];\n        int val = Integer.parseInt(seq.substring(i - 2, i));\n        if (val >= 10 && val <= 26) dp[i] += dp[i - 2];\n    }\n    return dp[n];\n}",
      "javascript": "function solve(seq) {\n    if (!seq || seq[0] === '0') return 0;\n    let n = seq.length;\n    let dp = new Array(n + 1).fill(0);\n    dp[0] = 1; dp[1] = 1;\n    for (let i = 2; i <= n; i++) {\n        if (seq[i - 1] !== '0') dp[i] += dp[i - 1];\n        let val = parseInt(seq.substring(i - 2, i));\n        if (val >= 10 && val <= 26) dp[i] += dp[i - 2];\n    }\n    return dp[n];\n}"
    },
    "boilerplate": {
      "python": "# Solution for Count Possible Decoding of a Given Digit Sequence\\ndef solve(seq):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Count Possible Decoding of a Given Digit Sequence\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(string seq) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Count Possible Decoding of a Given Digit Sequence\\nimport java.util.*;\\nclass Solution {\\n    public int solve(String seq) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Count Possible Decoding of a Given Digit Sequence\\nfunction solve(seq) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 47,
    "title": "Calculate the Area of a Circle",
    "category": "Working with Numbers",
    "difficulty": "Easy",
    "statement": "Given double radius r, return the area of the circle rounded to 2 decimal places.",
    "inputFormat": "r = <double>",
    "outputFormat": "Double",
    "examples": [
      {
        "input": "r = 5.0",
        "output": "78.54"
      },
      {
        "input": "r = 3.2",
        "output": "32.17"
      }
    ],
    "hint1": "Formula: Area = PI * r * r.",
    "hint2": "Use a precision of 3.1415926535 or Math.PI, and round to two decimal places.",
    "solution": {
      "python": "def solve(r):\n    import math\n    return round(math.pi * r * r, 2)",
      "cpp": "double solve(double r) {\n    double area = 3.141592653589793 * r * r;\n    return round(area * 100.0) / 100.0;\n}",
      "java": "public double solve(double r) {\n    double area = Math.PI * r * r;\n    return Math.round(area * 100.0) / 100.0;\n}",
      "javascript": "function solve(r) {\n    return Math.round((Math.PI * r * r) * 100) / 100;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Calculate the Area of a Circle\\ndef solve(r):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Calculate the Area of a Circle\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\ndouble solve(double r) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Calculate the Area of a Circle\\nimport java.util.*;\\nclass Solution {\\n    public double solve(double r) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Calculate the Area of a Circle\\nfunction solve(r) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 48,
    "title": "Find the Prime Numbers Between 1 to 100",
    "category": "Working with Numbers",
    "difficulty": "Easy",
    "statement": "Return a sorted list of all prime numbers between 1 and 100 (inclusive). Takes no parameters.",
    "inputFormat": "none",
    "outputFormat": "Array of integers",
    "examples": [
      {
        "input": "",
        "output": "[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97]"
      }
    ],
    "hint1": "This is a fixed bounds prime check query.",
    "hint2": "Implement a prime check helper and loop 1 to 100.",
    "solution": {
      "python": "def solve():\n    primes = []\n    for i in range(2, 101):\n        if all(i % j != 0 for j in range(2, int(i**0.5)+1)):\n            primes.append(i)\n    return primes",
      "cpp": "vector<int> solve() {\n    vector<int> res;\n    auto is_prime = [](int x) {\n        if (x <= 1) return false;\n        for(int i=2; i*i<=x; ++i) if(x%i==0) return false;\n        return true;\n    };\n    for(int i=1; i<=100; ++i) if(is_prime(i)) res.push_back(i);\n    return res;\n}",
      "java": "public int[] solve() {\n    java.util.List<Integer> list = new java.util.ArrayList<>();\n    for(int i=1; i<=100; ++i) if(isPrime(i)) list.add(i);\n    return list.stream().mapToInt(x -> x).toArray();\n}\nprivate boolean isPrime(int x) {\n    if (x <= 1) return false;\n    for(int i=2; i*i<=x; ++i) if(x%i==0) return false;\n    return true;\n}",
      "javascript": "function solve() {\n    let res = [];\n    function isPrime(x) {\n        if (x <= 1) return false;\n        for(let i=2; i*i<=x; ++i) if(x%i===0) return false;\n        return true;\n    }\n    for(let i=1; i<=100; ++i) if(isPrime(i)) res.push(i);\n    return res;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Find the Prime Numbers Between 1 to 100\\ndef solve():\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Find the Prime Numbers Between 1 to 100\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve() {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Find the Prime Numbers Between 1 to 100\\nimport java.util.*;\\nclass Solution {\\n    public int solve() {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Find the Prime Numbers Between 1 to 100\\nfunction solve() {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 49,
    "title": "Calculate the Number of Days in a Given Month of a Year",
    "category": "Working with Numbers",
    "difficulty": "Easy",
    "statement": "Given a month (1-12) and a year, calculate and return the number of days in that month, taking leap years into account.",
    "inputFormat": "month = <integer>, year = <integer>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "month = 2, year = 2020",
        "output": "29"
      },
      {
        "input": "month = 2, year = 2021",
        "output": "28"
      },
      {
        "input": "month = 4, year = 2023",
        "output": "30"
      }
    ],
    "hint1": "Months 1, 3, 5, 7, 8, 10, 12 always have 31 days. Months 4, 6, 9, 11 have 30 days.",
    "hint2": "For month 2 (February), check if the year is a leap year. If so, return 29; else return 28.",
    "solution": {
      "python": "def solve(month, year):\n    if month == 2:\n        is_leap = (year % 400 == 0) or (year % 4 == 0 and year % 100 != 0)\n        return 29 if is_leap else 28\n    if month in [4, 6, 9, 11]:\n        return 30\n    return 31",
      "cpp": "int solve(int month, int year) {\n    if (month == 2) {\n        bool is_leap = (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);\n        return is_leap ? 29 : 28;\n    }\n    if (month == 4 || month == 6 || month == 9 || month == 11) return 30;\n    return 31;\n}",
      "java": "public int solve(int month, int year) {\n    if (month == 2) {\n        boolean isLeap = (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);\n        return isLeap ? 29 : 28;\n    }\n    if (month == 4 || month == 6 || month == 9 || month == 11) return 30;\n    return 31;\n}",
      "javascript": "function solve(month, year) {\n    if (month === 2) {\n        let isLeap = (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0);\n        return isLeap ? 29 : 28;\n    }\n    if ([4, 6, 9, 11].includes(month)) return 30;\n    return 31;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Calculate the Number of Days in a Given Month of a Year\\ndef solve(month, year):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Calculate the Number of Days in a Given Month of a Year\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(int month, int year) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Calculate the Number of Days in a Given Month of a Year\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int month, int year) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Calculate the Number of Days in a Given Month of a Year\\nfunction solve(month, year) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 50,
    "title": "Finding Number of Times x Digit Occurs in an Input",
    "category": "Working with Numbers",
    "difficulty": "Easy",
    "statement": "Given an integer n and a digit x (0-9), find how many times digit x appears in the decimal representation of n.",
    "inputFormat": "n = <integer>, x = <integer>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "n = 120204, x = 2",
        "output": "2"
      },
      {
        "input": "n = 400, x = 0",
        "output": "2"
      }
    ],
    "hint1": "Convert the integer n to a string representation.",
    "hint2": "Iterate through the string characters and count matching digit character equivalents.",
    "solution": {
      "python": "def solve(n, x):\n    return str(n).count(str(x))",
      "cpp": "int solve(int n, int x) {\n    string s = to_string(n);\n    char target = '0' + x;\n    int count = 0;\n    for(char c : s) if(c == target) count++;\n    return count;\n}",
      "java": "public int solve(int n, int x) {\n    String s = String.valueOf(n);\n    char target = (char)('0' + x);\n    int count = 0;\n    for(int i=0; i<s.length(); ++i) {\n        if (s.charAt(i) == target) count++;\n    }\n    return count;\n}",
      "javascript": "function solve(n, x) {\n    return n.toString().split(x.toString()).length - 1;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Finding Number of Times x Digit Occurs in an Input\\ndef solve(n, x):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Finding Number of Times x Digit Occurs in an Input\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(int n, int x) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Finding Number of Times x Digit Occurs in an Input\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int n, int x) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Finding Number of Times x Digit Occurs in an Input\\nfunction solve(n, x) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 51,
    "title": "Finding Number of Integers Which Has Exactly x Divisors",
    "category": "Working with Numbers",
    "difficulty": "Hard",
    "statement": "Given limits low and high, return how many numbers in the range [low, high] have exactly x divisors.",
    "inputFormat": "low = <integer>, high = <integer>, x = <integer>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "low = 1, high = 10, x = 3",
        "output": "2"
      },
      {
        "input": "low = 1, high = 100, x = 2",
        "output": "25"
      }
    ],
    "hint1": "For each number in the range, count its total number of divisors.",
    "hint2": "Use a helper function divisor_count(n) that checks divisors up to sqrt(n) in O(sqrt(N)) time.",
    "solution": {
      "python": "def solve(low, high, x):\n    def get_divisors(num):\n        cnt = 0\n        for i in range(1, int(num**0.5)+1):\n            if num % i == 0:\n                cnt += 1\n                if i * i != num:\n                    cnt += 1\n        return cnt\n    return sum(1 for i in range(low, high + 1) if get_divisors(i) == x)",
      "cpp": "int solve(int low, int high, int x) {\n    auto div_count = [](int num) {\n        int cnt = 0;\n        for(int i=1; i*i<=num; ++i) {\n            if (num % i == 0) {\n                cnt++;\n                if (i*i != num) cnt++;\n            }\n        }\n        return cnt;\n    };\n    int total = 0;\n    for(int i = low; i <= high; ++i) {\n        if (div_count(i) == x) total++;\n    }\n    return total;\n}",
      "java": "public int solve(int low, int high, int x) {\n    int total = 0;\n    for(int i = low; i <= high; ++i) {\n        if (divCount(i) == x) total++;\n    }\n    return total;\n}\nprivate int divCount(int num) {\n    int cnt = 0;\n    for(int i=1; i*i<=num; ++i) {\n        if (num % i == 0) {\n            cnt++;\n            if (i*i != num) cnt++;\n        }\n    }\n    return cnt;\n}",
      "javascript": "function solve(low, high, x) {\n    function divCount(num) {\n        let cnt = 0;\n        for(let i=1; i*i<=num; ++i) {\n            if (num % i === 0) {\n                cnt++;\n                if (i*i !== num) cnt++;\n            }\n        }\n        return cnt;\n    }\n    let total = 0;\n    for(let i = low; i <= high; ++i) {\n        if (divCount(i) === x) total++;\n    }\n    return total;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Finding Number of Integers Which Has Exactly x Divisors\\ndef solve(low, high, x):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Finding Number of Integers Which Has Exactly x Divisors\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(int low, int high, int x) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Finding Number of Integers Which Has Exactly x Divisors\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int low, int high, int x) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Finding Number of Integers Which Has Exactly x Divisors\\nfunction solve(low, high, x) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 52,
    "title": "Finding Roots of a Quadratic Equation",
    "category": "Working with Numbers",
    "difficulty": "Medium",
    "statement": "Given coefficients a, b, c of quadratic equation ax^2 + bx + c = 0, return the root answers as a string 'root1,root2' rounded to 2 decimal places. Roots are ordered ascending.",
    "inputFormat": "a = <double>, b = <double>, c = <double>",
    "outputFormat": "String",
    "examples": [
      {
        "input": "a = 1.0, b = -5.0, c = 6.0",
        "output": "\"2.00,3.00\""
      },
      {
        "input": "a = 1.0, b = 2.0, c = 1.0",
        "output": "\"-1.00,-1.00\""
      }
    ],
    "hint1": "Use the quadratic formula: x = (-b +/- sqrt(b^2 - 4ac)) / (2a).",
    "hint2": "Identify the discriminant D = b^2 - 4ac. Calculate values and format them as two decimal places.",
    "solution": {
      "python": "def solve(a, b, c):\n    import math\n    d = b*b - 4*a*c\n    r1 = (-b - math.sqrt(d)) / (2*a)\n    r2 = (-b + math.sqrt(d)) / (2*a)\n    return f\"{min(r1,r2):.2f},{max(r1,r2):.2f}\"",
      "cpp": "string solve(double a, double b, double c) {\n    double d = b*b - 4*a*c;\n    double r1 = (-b - sqrt(d)) / (2*a);\n    double r2 = (-b + sqrt(d)) / (2*a);\n    double x = min(r1, r2);\n    double y = max(r1, r2);\n    char buf[100];\n    sprintf(buf, \"%.2f,%.2f\", x, y);\n    return string(buf);\n}",
      "java": "public String solve(double a, double b, double c) {\n    double d = b*b - 4*a*c;\n    double r1 = (-b - Math.sqrt(d)) / (2*a);\n    double r2 = (-b + Math.sqrt(d)) / (2*a);\n    double x = Math.min(r1, r2);\n    double y = Math.max(r1, r2);\n    return String.format(java.util.Locale.US, \"%.2f,%.2f\", x, y);\n}",
      "javascript": "function solve(a, b, c) {\n    let d = b*b - 4*a*c;\n    let r1 = (-b - Math.sqrt(d)) / (2*a);\n    let r2 = (-b + Math.sqrt(d)) / (2*a);\n    let x = Math.min(r1, r2);\n    let y = Math.max(r1, r2);\n    return `${x.toFixed(2)},${y.toFixed(2)}`;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Finding Roots of a Quadratic Equation\\ndef solve(a, b, c):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Finding Roots of a Quadratic Equation\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nstring solve(int a, int b, int c) {\\n    // Write your solution here\\n    return \"\";\\n}",
      "java": "// Solution for Finding Roots of a Quadratic Equation\\nimport java.util.*;\\nclass Solution {\\n    public String solve(int a, int b, int c) {\\n        // Write your solution here\\n        return \"\";\\n    }\\n}",
      "javascript": "// Solution for Finding Roots of a Quadratic Equation\\nfunction solve(a, b, c) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "title": "Number of Digits in an Integer",
    "category": "Working with Numbers",
    "difficulty": "Easy",
    "statement": "Given an integer n, count the number of digits in it.",
    "inputFormat": "n = <integer>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "n = 12345",
        "output": "5"
      },
      {
        "input": "n = 0",
        "output": "1"
      }
    ],
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
    },
    "id": 53
  },
  {
    "title": "Convert Number to Words",
    "category": "Working with Numbers",
    "difficulty": "Medium",
    "statement": "Convert a given non-negative integer (0-9999) to its English word representation.",
    "inputFormat": "n = <integer>",
    "outputFormat": "String",
    "examples": [
      {
        "input": "n = 123",
        "output": "\"One Hundred Twenty Three\""
      },
      {
        "input": "n = 0",
        "output": "\"Zero\""
      }
    ],
    "hint1": "Break the number into thousands, hundreds, tens, and ones.",
    "hint2": "Map each group to its word representation using lookup arrays.",
    "solution": {
      "python": "def solve(n):\n    if n == 0: return \"Zero\"\n    ones = [\"\",\"One\",\"Two\",\"Three\",\"Four\",\"Five\",\"Six\",\"Seven\",\"Eight\",\"Nine\",\"Ten\",\"Eleven\",\"Twelve\",\"Thirteen\",\"Fourteen\",\"Fifteen\",\"Sixteen\",\"Seventeen\",\"Eighteen\",\"Nineteen\"]\n    tens = [\"\",\"\",\"Twenty\",\"Thirty\",\"Forty\",\"Fifty\",\"Sixty\",\"Seventy\",\"Eighty\",\"Ninety\"]\n    result = \"\"\n    if n >= 1000:\n        result += ones[n//1000] + \" Thousand \"\n        n %= 1000\n    if n >= 100:\n        result += ones[n//100] + \" Hundred \"\n        n %= 100\n    if n >= 20:\n        result += tens[n//10] + \" \"\n        n %= 10\n    if n > 0:\n        result += ones[n]\n    return result.strip()",
      "cpp": "string solve(int n) {\n    if (n == 0) return \"Zero\";\n    string ones[] = {\"\",\"One\",\"Two\",\"Three\",\"Four\",\"Five\",\"Six\",\"Seven\",\"Eight\",\"Nine\",\"Ten\",\"Eleven\",\"Twelve\",\"Thirteen\",\"Fourteen\",\"Fifteen\",\"Sixteen\",\"Seventeen\",\"Eighteen\",\"Nineteen\"};\n    string tens[] = {\"\",\"\",\"Twenty\",\"Thirty\",\"Forty\",\"Fifty\",\"Sixty\",\"Seventy\",\"Eighty\",\"Ninety\"};\n    string result = \"\";\n    if (n >= 1000) { result += ones[n/1000] + \" Thousand \"; n %= 1000; }\n    if (n >= 100) { result += ones[n/100] + \" Hundred \"; n %= 100; }\n    if (n >= 20) { result += tens[n/10] + \" \"; n %= 10; }\n    if (n > 0) result += ones[n];\n    while (result.back() == ' ') result.pop_back();\n    return result;\n}",
      "java": "public String solve(int n) {\n    if (n == 0) return \"Zero\";\n    String[] ones = {\"\",\"One\",\"Two\",\"Three\",\"Four\",\"Five\",\"Six\",\"Seven\",\"Eight\",\"Nine\",\"Ten\",\"Eleven\",\"Twelve\",\"Thirteen\",\"Fourteen\",\"Fifteen\",\"Sixteen\",\"Seventeen\",\"Eighteen\",\"Nineteen\"};\n    String[] tens = {\"\",\"\",\"Twenty\",\"Thirty\",\"Forty\",\"Fifty\",\"Sixty\",\"Seventy\",\"Eighty\",\"Ninety\"};\n    StringBuilder sb = new StringBuilder();\n    if (n >= 1000) { sb.append(ones[n/1000]).append(\" Thousand \"); n %= 1000; }\n    if (n >= 100) { sb.append(ones[n/100]).append(\" Hundred \"); n %= 100; }\n    if (n >= 20) { sb.append(tens[n/10]).append(\" \"); n %= 10; }\n    if (n > 0) sb.append(ones[n]);\n    return sb.toString().trim();\n}",
      "javascript": "function solve(n) {\n    if (n === 0) return \"Zero\";\n    const ones = [\"\",\"One\",\"Two\",\"Three\",\"Four\",\"Five\",\"Six\",\"Seven\",\"Eight\",\"Nine\",\"Ten\",\"Eleven\",\"Twelve\",\"Thirteen\",\"Fourteen\",\"Fifteen\",\"Sixteen\",\"Seventeen\",\"Eighteen\",\"Nineteen\"];\n    const tens = [\"\",\"\",\"Twenty\",\"Thirty\",\"Forty\",\"Fifty\",\"Sixty\",\"Seventy\",\"Eighty\",\"Ninety\"];\n    let result = \"\";\n    if (n >= 1000) { result += ones[Math.floor(n/1000)] + \" Thousand \"; n %= 1000; }\n    if (n >= 100) { result += ones[Math.floor(n/100)] + \" Hundred \"; n %= 100; }\n    if (n >= 20) { result += tens[Math.floor(n/10)] + \" \"; n %= 10; }\n    if (n > 0) result += ones[n];\n    return result.trim();\n}"
    },
    "boilerplate": {
      "python": "# Solution for Convert Number to Words\ndef solve(n):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Convert Number to Words\n#include <string>\nusing namespace std;\n\nstring solve(int n) {\n    // Write your solution here\n    return \"\";\n}",
      "java": "// Solution for Convert Number to Words\nclass Solution {\n    public String solve(int n) {\n        // Write your solution here\n        return \"\";\n    }\n}",
      "javascript": "// Solution for Convert Number to Words\nfunction solve(n) {\n    // Write your solution here\n    return \"\";\n}"
    },
    "id": 54
  },
  {
    "title": "Power of a Number using Recursion",
    "category": "Recursion",
    "difficulty": "Easy",
    "statement": "Calculate base raised to the power of exp using recursion.",
    "inputFormat": "base = <integer>, exp = <integer>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "base = 2, exp = 5",
        "output": "32"
      },
      {
        "input": "base = 3, exp = 4",
        "output": "81"
      }
    ],
    "hint1": "Base case: if exp == 0, return 1.",
    "hint2": "Recursive step: return base * power(base, exp - 1).",
    "solution": {
      "python": "def solve(base, exp):\n    if exp == 0: return 1\n    return base * solve(base, exp - 1)",
      "cpp": "long long solve(int base, int exp) {\n    if (exp == 0) return 1;\n    return base * solve(base, exp - 1);\n}",
      "java": "public long solve(int base, int exp) {\n    if (exp == 0) return 1;\n    return base * solve(base, exp - 1);\n}",
      "javascript": "function solve(base, exp) {\n    if (exp === 0) return 1;\n    return base * solve(base, exp - 1);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Power of a Number using Recursion\ndef solve(base, exp):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Power of a Number using Recursion\n#include <iostream>\nusing namespace std;\n\nlong long solve(int base, int exp) {\n    // Write your solution here\n    return 0;\n}",
      "java": "// Solution for Power of a Number using Recursion\nclass Solution {\n    public long solve(int base, int exp) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "javascript": "// Solution for Power of a Number using Recursion\nfunction solve(base, exp) {\n    // Write your solution here\n    return 0;\n}"
    },
    "id": 55
  },
  {
    "title": "Prime Number using Recursion",
    "category": "Recursion",
    "difficulty": "Easy",
    "statement": "Check whether an integer n is prime using recursion.",
    "inputFormat": "n = <integer>",
    "outputFormat": "Boolean (true/false)",
    "examples": [
      {
        "input": "n = 11",
        "output": "true"
      },
      {
        "input": "n = 15",
        "output": "false"
      }
    ],
    "hint1": "Base cases: n <= 1 is false, n <= 3 is true.",
    "hint2": "Recursively check divisors from i = 2 up to i * i <= n.",
    "solution": {
      "python": "def solve(n):\n    if n <= 1: return False\n    def check(n, i):\n        if i * i > n: return True\n        if n % i == 0: return False\n        return check(n, i + 1)\n    return check(n, 2)",
      "cpp": "bool solve(int n) {\n    if (n <= 1) return false;\n    auto check = [&](auto& self, int val, int i) -> bool {\n        if (i * i > val) return true;\n        if (val % i == 0) return false;\n        return self(self, val, i + 1);\n    };\n    return check(check, n, 2);\n}",
      "java": "public boolean solve(int n) {\n    if (n <= 1) return false;\n    return check(n, 2);\n}\nprivate boolean check(int n, int i) {\n    if (i * i > n) return true;\n    if (n % i == 0) return false;\n    return check(n, i + 1);\n}",
      "javascript": "function solve(n) {\n    if (n <= 1) return false;\n    function check(val, i) {\n        if (i * i > val) return true;\n        if (val % i === 0) return false;\n        return check(val, i + 1);\n    }\n    return check(n, 2);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Prime Number using Recursion\ndef solve(n):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Prime Number using Recursion\n#include <iostream>\nusing namespace std;\n\nbool solve(int n) {\n    // Write your solution here\n    return false;\n}",
      "java": "// Solution for Prime Number using Recursion\nclass Solution {\n    public boolean solve(int n) {\n        // Write your solution here\n        return false;\n    }\n}",
      "javascript": "// Solution for Prime Number using Recursion\nfunction solve(n) {\n    // Write your solution here\n    return false;\n}"
    },
    "id": 56
  },
  {
    "title": "Largest Element in an Array using Recursion",
    "category": "Recursion",
    "difficulty": "Easy",
    "statement": "Find the maximum element in an array nums using recursion.",
    "inputFormat": "nums = <array of integers>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "nums = [1, 5, 3, 9, 2]",
        "output": "9"
      },
      {
        "input": "nums = [-10, -5, -20]",
        "output": "-5"
      }
    ],
    "hint1": "Base case: if the array has 1 element, return that element.",
    "hint2": "Otherwise, compare nums[0] with the max of the remaining subarray.",
    "solution": {
      "python": "def solve(nums):\n    if len(nums) == 1: return nums[0]\n    return max(nums[0], solve(nums[1:]))",
      "cpp": "int solve(vector<int>& nums) {\n    auto helper = [&](auto& self, int idx) -> int {\n        if (idx == (int)nums.size() - 1) return nums[idx];\n        return max(nums[idx], self(self, idx + 1));\n    };\n    return helper(helper, 0);\n}",
      "java": "public int solve(int[] nums) {\n    return helper(nums, 0);\n}\nprivate int helper(int[] nums, int idx) {\n    if (idx == nums.length - 1) return nums[idx];\n    return Math.max(nums[idx], helper(nums, idx + 1));\n}",
      "javascript": "function solve(nums) {\n    if (nums.length === 1) return nums[0];\n    return Math.max(nums[0], solve(nums.slice(1)));\n}"
    },
    "boilerplate": {
      "python": "# Solution for Largest Element in an Array using Recursion\ndef solve(nums):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Largest Element in an Array using Recursion\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint solve(vector<int>& nums) {\n    // Write your solution here\n    return 0;\n}",
      "java": "// Solution for Largest Element in an Array using Recursion\nclass Solution {\n    public int solve(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "javascript": "// Solution for Largest Element in an Array using Recursion\nfunction solve(nums) {\n    // Write your solution here\n    return 0;\n}"
    },
    "id": 57
  },
  {
    "title": "Smallest Element in an Array using Recursion",
    "category": "Recursion",
    "difficulty": "Easy",
    "statement": "Find the minimum element in an array nums using recursion.",
    "inputFormat": "nums = <array of integers>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "nums = [4, 2, 8, 1, 6]",
        "output": "1"
      },
      {
        "input": "nums = [10, 20, 30]",
        "output": "10"
      }
    ],
    "hint1": "Base case: if length is 1, return the only element.",
    "hint2": "Recursive step: compare first element with the minimum of the rest.",
    "solution": {
      "python": "def solve(nums):\n    if len(nums) == 1: return nums[0]\n    return min(nums[0], solve(nums[1:]))",
      "cpp": "int solve(vector<int>& nums) {\n    auto helper = [&](auto& self, int idx) -> int {\n        if (idx == (int)nums.size() - 1) return nums[idx];\n        return min(nums[idx], self(self, idx + 1));\n    };\n    return helper(helper, 0);\n}",
      "java": "public int solve(int[] nums) {\n    return helper(nums, 0);\n}\nprivate int helper(int[] nums, int idx) {\n    if (idx == nums.length - 1) return nums[idx];\n    return Math.min(nums[idx], helper(nums, idx + 1));\n}",
      "javascript": "function solve(nums) {\n    if (nums.length === 1) return nums[0];\n    return Math.min(nums[0], solve(nums.slice(1)));\n}"
    },
    "boilerplate": {
      "python": "# Solution for Smallest Element in an Array using Recursion\ndef solve(nums):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Smallest Element in an Array using Recursion\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint solve(vector<int>& nums) {\n    // Write your solution here\n    return 0;\n}",
      "java": "// Solution for Smallest Element in an Array using Recursion\nclass Solution {\n    public int solve(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "javascript": "// Solution for Smallest Element in an Array using Recursion\nfunction solve(nums) {\n    // Write your solution here\n    return 0;\n}"
    },
    "id": 58
  },
  {
    "title": "Reversing a Number using Recursion",
    "category": "Recursion",
    "difficulty": "Easy",
    "statement": "Reverse the digits of a given non-negative integer n using recursion.",
    "inputFormat": "n = <integer>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "n = 1234",
        "output": "4321"
      },
      {
        "input": "n = 987",
        "output": "789"
      }
    ],
    "hint1": "Extract the last digit and pass the accumulated reverse to the next call.",
    "hint2": "Base case: when n == 0, return the accumulated result.",
    "solution": {
      "python": "def solve(n):\n    def helper(n, rev):\n        if n == 0: return rev\n        return helper(n // 10, rev * 10 + n % 10)\n    return helper(n, 0)",
      "cpp": "int solve(int n) {\n    auto helper = [&](auto& self, int val, int rev) -> int {\n        if (val == 0) return rev;\n        return self(self, val / 10, rev * 10 + val % 10);\n    };\n    return helper(helper, n, 0);\n}",
      "java": "public int solve(int n) {\n    return helper(n, 0);\n}\nprivate int helper(int n, int rev) {\n    if (n == 0) return rev;\n    return helper(n / 10, rev * 10 + n % 10);\n}",
      "javascript": "function solve(n) {\n    function helper(val, rev) {\n        if (val === 0) return rev;\n        return helper(Math.floor(val / 10), rev * 10 + (val % 10));\n    }\n    return helper(n, 0);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Reversing a Number using Recursion\ndef solve(n):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Reversing a Number using Recursion\n#include <iostream>\nusing namespace std;\n\nint solve(int n) {\n    // Write your solution here\n    return 0;\n}",
      "java": "// Solution for Reversing a Number using Recursion\nclass Solution {\n    public int solve(int n) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "javascript": "// Solution for Reversing a Number using Recursion\nfunction solve(n) {\n    // Write your solution here\n    return 0;\n}"
    },
    "id": 59
  },
  {
    "title": "HCF of Two Numbers using Recursion",
    "category": "Recursion",
    "difficulty": "Easy",
    "statement": "Find the Highest Common Factor (GCD) of two numbers a and b using recursion.",
    "inputFormat": "a = <integer>, b = <integer>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "a = 24, b = 36",
        "output": "12"
      },
      {
        "input": "a = 17, b = 19",
        "output": "1"
      }
    ],
    "hint1": "Euclidean algorithm base case: if b == 0, return a.",
    "hint2": "Recursive step: return solve(b, a % b).",
    "solution": {
      "python": "def solve(a, b):\n    if b == 0: return a\n    return solve(b, a % b)",
      "cpp": "int solve(int a, int b) {\n    if (b == 0) return a;\n    return solve(b, a % b);\n}",
      "java": "public int solve(int a, int b) {\n    if (b == 0) return a;\n    return solve(b, a % b);\n}",
      "javascript": "function solve(a, b) {\n    if (b === 0) return a;\n    return solve(b, a % b);\n}"
    },
    "boilerplate": {
      "python": "# Solution for HCF of Two Numbers using Recursion\ndef solve(a, b):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for HCF of Two Numbers using Recursion\n#include <iostream>\nusing namespace std;\n\nint solve(int a, int b) {\n    // Write your solution here\n    return 0;\n}",
      "java": "// Solution for HCF of Two Numbers using Recursion\nclass Solution {\n    public int solve(int a, int b) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "javascript": "// Solution for HCF of Two Numbers using Recursion\nfunction solve(a, b) {\n    // Write your solution here\n    return 0;\n}"
    },
    "id": 60
  },
  {
    "title": "LCM of Two Numbers using Recursion",
    "category": "Recursion",
    "difficulty": "Easy",
    "statement": "Find the Lowest Common Multiple (LCM) of two numbers a and b using recursion.",
    "inputFormat": "a = <integer>, b = <integer>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "a = 4, b = 6",
        "output": "12"
      },
      {
        "input": "a = 5, b = 7",
        "output": "35"
      }
    ],
    "hint1": "LCM(a, b) = (a * b) / GCD(a, b).",
    "hint2": "Compute GCD recursively using the Euclidean algorithm.",
    "solution": {
      "python": "def solve(a, b):\n    def gcd(x, y):\n        return x if y == 0 else gcd(y, x % y)\n    return (a * b) // gcd(a, b)",
      "cpp": "int solve(int a, int b) {\n    auto gcd = [&](auto& self, int x, int y) -> int {\n        return y == 0 ? x : self(self, y, x % y);\n    };\n    return (a / gcd(gcd, a, b)) * b;\n}",
      "java": "public int solve(int a, int b) {\n    return (a / gcd(a, b)) * b;\n}\nprivate int gcd(int a, int b) {\n    return b == 0 ? a : gcd(b, a % b);\n}",
      "javascript": "function solve(a, b) {\n    const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));\n    return (a * b) / gcd(a, b);\n}"
    },
    "boilerplate": {
      "python": "# Solution for LCM of Two Numbers using Recursion\ndef solve(a, b):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for LCM of Two Numbers using Recursion\n#include <iostream>\nusing namespace std;\n\nint solve(int a, int b) {\n    // Write your solution here\n    return 0;\n}",
      "java": "// Solution for LCM of Two Numbers using Recursion\nclass Solution {\n    public int solve(int a, int b) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "javascript": "// Solution for LCM of Two Numbers using Recursion\nfunction solve(a, b) {\n    // Write your solution here\n    return 0;\n}"
    },
    "id": 61
  },
  {
    "title": "Length of a String using Recursion",
    "category": "Recursion",
    "difficulty": "Easy",
    "statement": "Calculate the length of a string s using recursion without using the built-in len() or length property.",
    "inputFormat": "s = <string>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "s = \"PrepInsta\"",
        "output": "9"
      },
      {
        "input": "s = \"\"",
        "output": "0"
      }
    ],
    "hint1": "Base case: if the string is empty, return 0.",
    "hint2": "Recursive step: return 1 + length(s[1:]).",
    "solution": {
      "python": "def solve(s):\n    if s == '': return 0\n    return 1 + solve(s[1:])",
      "cpp": "int solve(string s) {\n    if (s.empty()) return 0;\n    return 1 + solve(s.substr(1));\n}",
      "java": "public int solve(String s) {\n    if (s.isEmpty()) return 0;\n    return 1 + solve(s.substring(1));\n}",
      "javascript": "function solve(s) {\n    if (s === '') return 0;\n    return 1 + solve(s.slice(1));\n}"
    },
    "boilerplate": {
      "python": "# Solution for Length of a String using Recursion\ndef solve(s):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Length of a String using Recursion\n#include <string>\nusing namespace std;\n\nint solve(string s) {\n    // Write your solution here\n    return 0;\n}",
      "java": "// Solution for Length of a String using Recursion\nclass Solution {\n    public int solve(String s) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "javascript": "// Solution for Length of a String using Recursion\nfunction solve(s) {\n    // Write your solution here\n    return 0;\n}"
    },
    "id": 62
  },
  {
    "title": "Print All Permutations of a String",
    "category": "Recursion",
    "difficulty": "Medium",
    "statement": "Generate all unique permutations of a given string s.",
    "inputFormat": "s = <string>",
    "outputFormat": "Array of strings",
    "examples": [
      {
        "input": "s = \"ABC\"",
        "output": "[\"ABC\", \"ACB\", \"BAC\", \"BCA\", \"CAB\", \"CBA\"]"
      }
    ],
    "hint1": "Fix one character at each position and recursively permute the rest.",
    "hint2": "Sort the result for consistent lexicographical order.",
    "solution": {
      "python": "def solve(s):\n    def permute(chars):\n        if len(chars) <= 1: return [chars]\n        res = []\n        for i, c in enumerate(chars):\n            for rest in permute(chars[:i] + chars[i+1:]):\n                res.append(c + rest)\n        return sorted(list(set(res)))\n    return permute(s)",
      "cpp": "vector<string> solve(string s) {\n    vector<string> res;\n    sort(s.begin(), s.end());\n    do {\n        res.push_back(s);\n    } while(next_permutation(s.begin(), s.end()));\n    return res;\n}",
      "java": "public List<String> solve(String s) {\n    List<String> res = new ArrayList<>();\n    permute(s.toCharArray(), 0, res);\n    Collections.sort(res);\n    return res;\n}\nprivate void permute(char[] arr, int idx, List<String> res) {\n    if (idx == arr.length) { res.add(new String(arr)); return; }\n    for (int i = idx; i < arr.length; i++) {\n        char t = arr[idx]; arr[idx] = arr[i]; arr[i] = t;\n        permute(arr, idx + 1, res);\n        t = arr[idx]; arr[idx] = arr[i]; arr[i] = t;\n    }\n}",
      "javascript": "function solve(s) {\n    const res = [];\n    function permute(str, prefix) {\n        if (str.length === 0) { res.push(prefix); return; }\n        for (let i = 0; i < str.length; i++) {\n            permute(str.slice(0, i) + str.slice(i + 1), prefix + str[i]);\n        }\n    }\n    permute(s, '');\n    return [...new Set(res)].sort();\n}"
    },
    "boilerplate": {
      "python": "# Solution for Print All Permutations of a String\ndef solve(s):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Print All Permutations of a String\n#include <vector>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nvector<string> solve(string s) {\n    // Write your solution here\n    return {};\n}",
      "java": "// Solution for Print All Permutations of a String\nimport java.util.*;\nclass Solution {\n    public List<String> solve(String s) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
      "javascript": "// Solution for Print All Permutations of a String\nfunction solve(s) {\n    // Write your solution here\n    return [];\n}"
    },
    "id": 63
  },
  {
    "title": "F(N)th Term of Sequence",
    "category": "Recursion",
    "difficulty": "Medium",
    "statement": "Given an integer n, calculate F(n) where F(n) = 1 + 2*3 + 4*5*6 + ... with n terms.",
    "inputFormat": "n = <integer>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "n = 3",
        "output": "127",
        "explanation": "1 + (2*3) + (4*5*6) = 1 + 6 + 120 = 127"
      },
      {
        "input": "n = 1",
        "output": "1"
      }
    ],
    "hint1": "The k-th term is the product of k consecutive integers.",
    "hint2": "Keep track of the current number starting from 1.",
    "solution": {
      "python": "def solve(n):\n    curr = 1\n    total = 0\n    for k in range(1, n + 1):\n        term = 1\n        for _ in range(k):\n            term *= curr\n            curr += 1\n        total += term\n    return total",
      "cpp": "long long solve(int n) {\n    long long curr = 1, total = 0;\n    for(int k=1; k<=n; ++k) {\n        long long term = 1;\n        for(int j=0; j<k; ++j) term *= curr++;\n        total += term;\n    }\n    return total;\n}",
      "java": "public long solve(int n) {\n    long curr = 1, total = 0;\n    for (int k = 1; k <= n; k++) {\n        long term = 1;\n        for (int j = 0; j < k; j++) term *= curr++;\n        total += term;\n    }\n    return total;\n}",
      "javascript": "function solve(n) {\n    let curr = 1, total = 0;\n    for (let k = 1; k <= n; k++) {\n        let term = 1;\n        for (let j = 0; j < k; j++) term *= curr++;\n        total += term;\n    }\n    return total;\n}"
    },
    "boilerplate": {
      "python": "# Solution for F(N)th Term of Sequence\ndef solve(n):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for F(N)th Term of Sequence\n#include <iostream>\nusing namespace std;\n\nlong long solve(int n) {\n    // Write your solution here\n    return 0;\n}",
      "java": "// Solution for F(N)th Term of Sequence\nclass Solution {\n    public long solve(int n) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "javascript": "// Solution for F(N)th Term of Sequence\nfunction solve(n) {\n    // Write your solution here\n    return 0;\n}"
    },
    "id": 64
  },
  {
    "title": "Subset Sums of all Subsets",
    "category": "Recursion",
    "difficulty": "Medium",
    "statement": "Given an array arr of integers, calculate the sums of all subsets and return them in sorted order.",
    "inputFormat": "arr = <array of integers>",
    "outputFormat": "Array of integers",
    "examples": [
      {
        "input": "arr = [2, 3]",
        "output": "[0, 2, 3, 5]"
      },
      {
        "input": "arr = [1, 2, 1]",
        "output": "[0, 1, 1, 2, 2, 3, 3, 4]"
      }
    ],
    "hint1": "At each element, we have two choices: include it in the subset or exclude it.",
    "hint2": "Use recursion to explore both branches and collect the sum at the end.",
    "solution": {
      "python": "def solve(arr):\n    sums = []\n    def helper(idx, curr_sum):\n        if idx == len(arr):\n            sums.append(curr_sum)\n            return\n        helper(idx + 1, curr_sum + arr[idx])\n        helper(idx + 1, curr_sum)\n    helper(0, 0)\n    return sorted(sums)",
      "cpp": "vector<int> solve(vector<int>& arr) {\n    vector<int> res;\n    auto helper = [&](auto& self, int idx, int sum) -> void {\n        if (idx == (int)arr.size()) { res.push_back(sum); return; }\n        self(self, idx + 1, sum + arr[idx]);\n        self(self, idx + 1, sum);\n    };\n    helper(helper, 0, 0);\n    sort(res.begin(), res.end());\n    return res;\n}",
      "java": "public List<Integer> solve(int[] arr) {\n    List<Integer> res = new ArrayList<>();\n    helper(arr, 0, 0, res);\n    Collections.sort(res);\n    return res;\n}\nprivate void helper(int[] arr, int idx, int sum, List<Integer> res) {\n    if (idx == arr.length) { res.add(sum); return; }\n    helper(arr, idx + 1, sum + arr[idx], res);\n    helper(arr, idx + 1, sum, res);\n}",
      "javascript": "function solve(arr) {\n    const res = [];\n    function helper(idx, sum) {\n        if (idx === arr.length) { res.push(sum); return; }\n        helper(idx + 1, sum + arr[idx]);\n        helper(idx + 1, sum);\n    }\n    helper(0, 0);\n    return res.sort((a, b) => a - b);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Subset Sums of all Subsets\ndef solve(arr):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Subset Sums of all Subsets\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<int> solve(vector<int>& arr) {\n    // Write your solution here\n    return {};\n}",
      "java": "// Solution for Subset Sums of all Subsets\nimport java.util.*;\nclass Solution {\n    public List<Integer> solve(int[] arr) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
      "javascript": "// Solution for Subset Sums of all Subsets\nfunction solve(arr) {\n    // Write your solution here\n    return [];\n}"
    },
    "id": 65
  },
  {
    "title": "Last Non-Zero Digit in Factorial",
    "category": "Recursion",
    "difficulty": "Medium",
    "statement": "Find the last non-zero digit of n! (factorial of n).",
    "inputFormat": "n = <integer>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "n = 5",
        "output": "2",
        "explanation": "5! = 120, last non-zero digit is 2"
      },
      {
        "input": "n = 12",
        "output": "6"
      }
    ],
    "hint1": "Pairs of (2, 5) create trailing zeros.",
    "hint2": "Track multiplication modulo 10 while canceling out factors of 5 with factors of 2.",
    "solution": {
      "python": "def solve(n):\n    result = 1\n    for i in range(1, n + 1):\n        result *= i\n        while result % 10 == 0:\n            result //= 10\n        result %= 100000\n    return result % 10",
      "cpp": "int solve(int n) {\n    long long res = 1;\n    for(int i=1; i<=n; ++i) {\n        res *= i;\n        while(res % 10 == 0) res /= 10;\n        res %= 100000;\n    }\n    return res % 10;\n}",
      "java": "public int solve(int n) {\n    long res = 1;\n    for (int i = 1; i <= n; i++) {\n        res *= i;\n        while (res % 10 == 0) res /= 10;\n        res %= 100000;\n    }\n    return (int)(res % 10);\n}",
      "javascript": "function solve(n) {\n    let res = 1;\n    for (let i = 1; i <= n; i++) {\n        res *= i;\n        while (res % 10 === 0) res = Math.floor(res / 10);\n        res %= 100000;\n    }\n    return res % 10;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Last Non-Zero Digit in Factorial\ndef solve(n):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Last Non-Zero Digit in Factorial\n#include <iostream>\nusing namespace std;\n\nint solve(int n) {\n    // Write your solution here\n    return 0;\n}",
      "java": "// Solution for Last Non-Zero Digit in Factorial\nclass Solution {\n    public int solve(int n) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "javascript": "// Solution for Last Non-Zero Digit in Factorial\nfunction solve(n) {\n    // Write your solution here\n    return 0;\n}"
    },
    "id": 66
  },
  {
    "title": "Nth Row of Pascal's Triangle",
    "category": "Recursion",
    "difficulty": "Medium",
    "statement": "Given a 0-indexed integer n, return the nth row of Pascal's triangle.",
    "inputFormat": "n = <integer>",
    "outputFormat": "Array of integers",
    "examples": [
      {
        "input": "n = 4",
        "output": "[1, 4, 6, 4, 1]"
      },
      {
        "input": "n = 0",
        "output": "[1]"
      }
    ],
    "hint1": "Each row has n + 1 elements. The k-th element is C(n, k).",
    "hint2": "C(n, k) = C(n, k-1) * (n - k + 1) / k.",
    "solution": {
      "python": "def solve(n):\n    row = [1]\n    for k in range(1, n + 1):\n        row.append(row[-1] * (n - k + 1) // k)\n    return row",
      "cpp": "vector<int> solve(int n) {\n    vector<int> row = {1};\n    long long prev = 1;\n    for(int k=1; k<=n; ++k) {\n        prev = prev * (n - k + 1) / k;\n        row.push_back((int)prev);\n    }\n    return row;\n}",
      "java": "public List<Integer> solve(int n) {\n    List<Integer> row = new ArrayList<>();\n    row.add(1);\n    long prev = 1;\n    for (int k = 1; k <= n; k++) {\n        prev = prev * (n - k + 1) / k;\n        row.add((int)prev);\n    }\n    return row;\n}",
      "javascript": "function solve(n) {\n    const row = [1];\n    let prev = 1;\n    for (let k = 1; k <= n; k++) {\n        prev = (prev * (n - k + 1)) / k;\n        row.push(prev);\n    }\n    return row;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Nth Row of Pascal's Triangle\ndef solve(n):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Nth Row of Pascal's Triangle\n#include <vector>\nusing namespace std;\n\nvector<int> solve(int n) {\n    // Write your solution here\n    return {};\n}",
      "java": "// Solution for Nth Row of Pascal's Triangle\nimport java.util.*;\nclass Solution {\n    public List<Integer> solve(int n) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
      "javascript": "// Solution for Nth Row of Pascal's Triangle\nfunction solve(n) {\n    // Write your solution here\n    return [];\n}"
    },
    "id": 67
  },
  {
    "title": "Generate All Combinations of Balanced Parentheses",
    "category": "Recursion",
    "difficulty": "Medium",
    "statement": "Given an integer n representing pairs of parentheses, generate all combinations of well-formed parentheses.",
    "inputFormat": "n = <integer>",
    "outputFormat": "Array of strings",
    "examples": [
      {
        "input": "n = 3",
        "output": "[\"((()))\", \"(()())\", \"(())()\", \"()(())\", \"()()()\"]"
      }
    ],
    "hint1": "Use backtracking: add '(' if open count < n; add ')' if close count < open count.",
    "hint2": "Base case: when string length == 2 * n, add to results.",
    "solution": {
      "python": "def solve(n):\n    res = []\n    def backtrack(s, open_cnt, close_cnt):\n        if len(s) == 2 * n:\n            res.append(s)\n            return\n        if open_cnt < n: backtrack(s + '(', open_cnt + 1, close_cnt)\n        if close_cnt < open_cnt: backtrack(s + ')', open_cnt, close_cnt + 1)\n    backtrack('', 0, 0)\n    return res",
      "cpp": "vector<string> solve(int n) {\n    vector<string> res;\n    auto backtrack = [&](auto& self, string s, int open, int close) -> void {\n        if((int)s.size() == 2*n) { res.push_back(s); return; }\n        if(open < n) self(self, s + '(', open + 1, close);\n        if(close < open) self(self, s + ')', open, close + 1);\n    };\n    backtrack(backtrack, \"\", 0, 0);\n    return res;\n}",
      "java": "public List<String> solve(int n) {\n    List<String> res = new ArrayList<>();\n    backtrack(\"\", 0, 0, n, res);\n    return res;\n}\nprivate void backtrack(String s, int open, int close, int n, List<String> res) {\n    if (s.length() == 2 * n) { res.add(s); return; }\n    if (open < n) backtrack(s + \"(\", open + 1, close, n, res);\n    if (close < open) backtrack(s + \")\", open, close + 1, n, res);\n}",
      "javascript": "function solve(n) {\n    const res = [];\n    function backtrack(s, open, close) {\n        if (s.length === 2 * n) { res.push(s); return; }\n        if (open < n) backtrack(s + '(', open + 1, close);\n        if (close < open) backtrack(s + ')', open, close + 1);\n    }\n    backtrack('', 0, 0);\n    return res;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Generate All Combinations of Balanced Parentheses\ndef solve(n):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Generate All Combinations of Balanced Parentheses\n#include <vector>\n#include <string>\nusing namespace std;\n\nvector<string> solve(int n) {\n    // Write your solution here\n    return {};\n}",
      "java": "// Solution for Generate All Combinations of Balanced Parentheses\nimport java.util.*;\nclass Solution {\n    public List<String> solve(int n) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
      "javascript": "// Solution for Generate All Combinations of Balanced Parentheses\nfunction solve(n) {\n    // Write your solution here\n    return [];\n}"
    },
    "id": 68
  },
  {
    "title": "Factorial of a Number using Recursion",
    "category": "Recursion",
    "difficulty": "Easy",
    "statement": "Calculate the factorial of a non-negative integer n using recursion.",
    "inputFormat": "n = <integer>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "n = 5",
        "output": "120"
      },
      {
        "input": "n = 0",
        "output": "1"
      }
    ],
    "hint1": "Base case: if n <= 1, return 1.",
    "hint2": "Recursive step: return n * solve(n - 1).",
    "solution": {
      "python": "def solve(n):\n    if n <= 1: return 1\n    return n * solve(n - 1)",
      "cpp": "long long solve(int n) {\n    if (n <= 1) return 1;\n    return n * solve(n - 1);\n}",
      "java": "public long solve(int n) {\n    if (n <= 1) return 1;\n    return n * solve(n - 1);\n}",
      "javascript": "function solve(n) {\n    if (n <= 1) return 1;\n    return n * solve(n - 1);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Factorial of a Number using Recursion\ndef solve(n):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Factorial of a Number using Recursion\n#include <iostream>\nusing namespace std;\n\nlong long solve(int n) {\n    // Write your solution here\n    return 0;\n}",
      "java": "// Solution for Factorial of a Number using Recursion\nclass Solution {\n    public long solve(int n) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "javascript": "// Solution for Factorial of a Number using Recursion\nfunction solve(n) {\n    // Write your solution here\n    return 0;\n}"
    },
    "id": 69
  },
  {
    "title": "Palindromic Partitions of a String",
    "category": "Recursion",
    "difficulty": "Medium",
    "statement": "Find all possible palindromic partitions of a given string s.",
    "inputFormat": "s = <string>",
    "outputFormat": "Array of array of strings",
    "examples": [
      {
        "input": "s = \"aab\"",
        "output": "[[\"a\", \"a\", \"b\"], [\"aa\", \"b\"]]"
      }
    ],
    "hint1": "For each prefix, check if it is a palindrome.",
    "hint2": "If it is, recursively partition the remaining substring.",
    "solution": {
      "python": "def solve(s):\n    res = []\n    def is_pal(sub): return sub == sub[::-1]\n    def backtrack(start, path):\n        if start == len(s):\n            res.append(list(path))\n            return\n        for end in range(start + 1, len(s) + 1):\n            sub = s[start:end]\n            if is_pal(sub):\n                path.append(sub)\n                backtrack(end, path)\n                path.pop()\n    backtrack(0, [])\n    return res",
      "cpp": "vector<vector<string>> solve(string s) {\n    vector<vector<string>> res;\n    vector<string> path;\n    auto is_pal = [](const string& sub) { int l=0, r=(int)sub.size()-1; while(l<r) if(sub[l++]!=sub[r--]) return false; return true; };\n    auto backtrack = [&](auto& self, int start) -> void {\n        if(start == (int)s.size()) { res.push_back(path); return; }\n        for(int end = start + 1; end <= (int)s.size(); ++end) {\n            string sub = s.substr(start, end - start);\n            if(is_pal(sub)) { path.push_back(sub); self(self, end); path.pop_back(); }\n        }\n    };\n    backtrack(backtrack, 0);\n    return res;\n}",
      "java": "public List<List<String>> solve(String s) {\n    List<List<String>> res = new ArrayList<>();\n    backtrack(s, 0, new ArrayList<>(), res);\n    return res;\n}\nprivate void backtrack(String s, int start, List<String> path, List<List<String>> res) {\n    if (start == s.length()) { res.add(new ArrayList<>(path)); return; }\n    for (int end = start + 1; end <= s.length(); end++) {\n        String sub = s.substring(start, end);\n        if (isPal(sub)) { path.add(sub); backtrack(s, end, path, res); path.remove(path.size() - 1); }\n    }\n}\nprivate boolean isPal(String sub) { return new StringBuilder(sub).reverse().toString().equals(sub); }",
      "javascript": "function solve(s) {\n    const res = [];\n    const isPal = sub => sub === sub.split('').reverse().join('');\n    function backtrack(start, path) {\n        if (start === s.length) { res.push([...path]); return; }\n        for (let end = start + 1; end <= s.length; end++) {\n            const sub = s.slice(start, end);\n            if (isPal(sub)) { path.push(sub); backtrack(end, path); path.pop(); }\n        }\n    }\n    backtrack(0, []);\n    return res;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Palindromic Partitions of a String\ndef solve(s):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Palindromic Partitions of a String\n#include <vector>\n#include <string>\nusing namespace std;\n\nvector<vector<string>> solve(string s) {\n    // Write your solution here\n    return {};\n}",
      "java": "// Solution for Palindromic Partitions of a String\nimport java.util.*;\nclass Solution {\n    public List<List<String>> solve(String s) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
      "javascript": "// Solution for Palindromic Partitions of a String\nfunction solve(s) {\n    // Write your solution here\n    return [];\n}"
    },
    "id": 70
  },
  {
    "title": "N-bit Binary Numbers Having More 1s than 0s",
    "category": "Recursion",
    "difficulty": "Medium",
    "statement": "Given n, generate all n-bit binary numbers having more than or equal 1s than 0s in all its prefixes.",
    "inputFormat": "n = <integer>",
    "outputFormat": "Array of strings",
    "examples": [
      {
        "input": "n = 3",
        "output": "[\"111\", \"110\", \"101\"]"
      },
      {
        "input": "n = 2",
        "output": "[\"11\", \"10\"]"
      }
    ],
    "hint1": "At each step, we can always add '1'.",
    "hint2": "We can add '0' only if the count of 1s strictly exceeds the count of 0s.",
    "solution": {
      "python": "def solve(n):\n    res = []\n    def helper(ones, zeros, s):\n        if len(s) == n:\n            res.append(s)\n            return\n        helper(ones + 1, zeros, s + '1')\n        if ones > zeros:\n            helper(ones, zeros + 1, s + '0')\n    helper(0, 0, '')\n    return res",
      "cpp": "vector<string> solve(int n) {\n    vector<string> res;\n    auto helper = [&](auto& self, int ones, int zeros, string s) -> void {\n        if((int)s.size() == n) { res.push_back(s); return; }\n        self(self, ones + 1, zeros, s + '1');\n        if(ones > zeros) self(self, ones, zeros + 1, s + '0');\n    };\n    helper(helper, 0, 0, \"\");\n    return res;\n}",
      "java": "public List<String> solve(int n) {\n    List<String> res = new ArrayList<>();\n    helper(0, 0, \"\", n, res);\n    return res;\n}\nprivate void helper(int ones, int zeros, String s, int n, List<String> res) {\n    if (s.length() == n) { res.add(s); return; }\n    helper(ones + 1, zeros, s + \"1\", n, res);\n    if (ones > zeros) helper(ones, zeros + 1, s + \"0\", n, res);\n}",
      "javascript": "function solve(n) {\n    const res = [];\n    function helper(ones, zeros, s) {\n        if (s.length === n) { res.push(s); return; }\n        helper(ones + 1, zeros, s + '1');\n        if (ones > zeros) helper(ones, zeros + 1, s + '0');\n    }\n    helper(0, 0, '');\n    return res;\n}"
    },
    "boilerplate": {
      "python": "# Solution for N-bit Binary Numbers Having More 1s than 0s\ndef solve(n):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for N-bit Binary Numbers Having More 1s than 0s\n#include <vector>\n#include <string>\nusing namespace std;\n\nvector<string> solve(int n) {\n    // Write your solution here\n    return {};\n}",
      "java": "// Solution for N-bit Binary Numbers Having More 1s than 0s\nimport java.util.*;\nclass Solution {\n    public List<String> solve(int n) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
      "javascript": "// Solution for N-bit Binary Numbers Having More 1s than 0s\nfunction solve(n) {\n    // Write your solution here\n    return [];\n}"
    },
    "id": 71
  },
  {
    "title": "Find All Subsets (Power Set)",
    "category": "Recursion",
    "difficulty": "Medium",
    "statement": "Given a set of distinct integers nums, find all its subsets (power set).",
    "inputFormat": "nums = <array of integers>",
    "outputFormat": "Array of array of integers",
    "examples": [
      {
        "input": "nums = [1, 2, 3]",
        "output": "[[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]"
      }
    ],
    "hint1": "For each element, choose whether to include it or exclude it.",
    "hint2": "A set of n elements has 2^n subsets.",
    "solution": {
      "python": "def solve(nums):\n    res = []\n    def helper(idx, curr):\n        if idx == len(nums):\n            res.append(list(curr))\n            return\n        helper(idx + 1, curr)\n        curr.append(nums[idx])\n        helper(idx + 1, curr)\n        curr.pop()\n    helper(0, [])\n    return sorted(res, key=lambda x: (len(x), x))",
      "cpp": "vector<vector<int>> solve(vector<int>& nums) {\n    vector<vector<int>> res;\n    vector<int> curr;\n    auto helper = [&](auto& self, int idx) -> void {\n        if(idx == (int)nums.size()) { res.push_back(curr); return; }\n        self(self, idx + 1);\n        curr.push_back(nums[idx]);\n        self(self, idx + 1);\n        curr.pop_back();\n    };\n    helper(helper, 0);\n    return res;\n}",
      "java": "public List<List<Integer>> solve(int[] nums) {\n    List<List<Integer>> res = new ArrayList<>();\n    helper(nums, 0, new ArrayList<>(), res);\n    return res;\n}\nprivate void helper(int[] nums, int idx, List<Integer> curr, List<List<Integer>> res) {\n    if (idx == nums.length) { res.add(new ArrayList<>(curr)); return; }\n    helper(nums, idx + 1, curr, res);\n    curr.add(nums[idx]);\n    helper(nums, idx + 1, curr, res);\n    curr.remove(curr.size() - 1);\n}",
      "javascript": "function solve(nums) {\n    const res = [];\n    function helper(idx, curr) {\n        if (idx === nums.length) { res.push([...curr]); return; }\n        helper(idx + 1, curr);\n        curr.push(nums[idx]);\n        helper(idx + 1, curr);\n        curr.pop();\n    }\n    helper(0, []);\n    return res.sort((a, b) => a.length - b.length || a[0] - b[0]);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Find All Subsets (Power Set)\ndef solve(nums):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Find All Subsets (Power Set)\n#include <vector>\nusing namespace std;\n\nvector<vector<int>> solve(vector<int>& nums) {\n    // Write your solution here\n    return {};\n}",
      "java": "// Solution for Find All Subsets (Power Set)\nimport java.util.*;\nclass Solution {\n    public List<List<Integer>> solve(int[] nums) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
      "javascript": "// Solution for Find All Subsets (Power Set)\nfunction solve(nums) {\n    // Write your solution here\n    return [];\n}"
    },
    "id": 72
  },
  {
    "title": "Remove All Adjacent Duplicate Characters Recursively",
    "category": "Recursion",
    "difficulty": "Medium",
    "statement": "Given a string s, remove all adjacent duplicate characters recursively until no adjacent duplicates remain.",
    "inputFormat": "s = <string>",
    "outputFormat": "String",
    "examples": [
      {
        "input": "s = \"abbaca\"",
        "output": "\"ca\""
      },
      {
        "input": "s = \"azxxzy\"",
        "output": "\"ay\""
      }
    ],
    "hint1": "Use a stack-based recursive simulation: push characters and pop when top matches current.",
    "hint2": "Repeat until the string doesn't change.",
    "solution": {
      "python": "def solve(s):\n    stack = []\n    for c in s:\n        if stack and stack[-1] == c:\n            stack.pop()\n        else:\n            stack.append(c)\n    return ''.join(stack)",
      "cpp": "string solve(string s) {\n    string res = \"\";\n    for(char c : s) {\n        if(!res.empty() && res.back() == c) res.pop_back();\n        else res.push_back(c);\n    }\n    return res;\n}",
      "java": "public String solve(String s) {\n    StringBuilder sb = new StringBuilder();\n    for (char c : s.toCharArray()) {\n        int len = sb.length();\n        if (len > 0 && sb.charAt(len - 1) == c) sb.deleteCharAt(len - 1);\n        else sb.append(c);\n    }\n    return sb.toString();\n}",
      "javascript": "function solve(s) {\n    const stack = [];\n    for (const c of s) {\n        if (stack.length > 0 && stack[stack.length - 1] === c) stack.pop();\n        else stack.push(c);\n    }\n    return stack.join('');\n}"
    },
    "boilerplate": {
      "python": "# Solution for Remove All Adjacent Duplicate Characters Recursively\ndef solve(s):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Remove All Adjacent Duplicate Characters Recursively\n#include <string>\nusing namespace std;\n\nstring solve(string s) {\n    // Write your solution here\n    return \"\";\n}",
      "java": "// Solution for Remove All Adjacent Duplicate Characters Recursively\nclass Solution {\n    public String solve(String s) {\n        // Write your solution here\n        return \"\";\n    }\n}",
      "javascript": "// Solution for Remove All Adjacent Duplicate Characters Recursively\nfunction solve(s) {\n    // Write your solution here\n    return \"\";\n}"
    },
    "id": 73
  },
  {
    "title": "Find Largest Element in an Array",
    "category": "Arrays",
    "difficulty": "Easy",
    "statement": "Given an array nums of integers, find the largest element in the array.",
    "inputFormat": "nums = <array of integers>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "nums = [20, 10, 20, 4, 100]",
        "output": "100"
      },
      {
        "input": "nums = [-5, -2, -9]",
        "output": "-2"
      }
    ],
    "hint1": "Iterate through the array while maintaining the maximum value seen so far.",
    "hint2": "Initialize max with nums[0].",
    "solution": {
      "python": "def solve(nums):\n    return max(nums)",
      "cpp": "int solve(vector<int>& nums) {\n    return *max_element(nums.begin(), nums.end());\n}",
      "java": "public int solve(int[] nums) {\n    int max = nums[0];\n    for (int x : nums) if (x > max) max = x;\n    return max;\n}",
      "javascript": "function solve(nums) {\n    return Math.max(...nums);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Find Largest Element in an Array\ndef solve(nums):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Find Largest Element in an Array\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint solve(vector<int>& nums) {\n    // Write your solution here\n    return 0;\n}",
      "java": "// Solution for Find Largest Element in an Array\nclass Solution {\n    public int solve(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "javascript": "// Solution for Find Largest Element in an Array\nfunction solve(nums) {\n    // Write your solution here\n    return 0;\n}"
    },
    "id": 74
  },
  {
    "title": "Find Smallest Element in an Array",
    "category": "Arrays",
    "difficulty": "Easy",
    "statement": "Given an array nums of integers, find the smallest element in the array.",
    "inputFormat": "nums = <array of integers>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "nums = [20, 10, 20, 4, 100]",
        "output": "4"
      },
      {
        "input": "nums = [15, 8, 23]",
        "output": "8"
      }
    ],
    "hint1": "Iterate through the array while keeping track of the minimum value.",
    "hint2": "Initialize min with nums[0].",
    "solution": {
      "python": "def solve(nums):\n    return min(nums)",
      "cpp": "int solve(vector<int>& nums) {\n    return *min_element(nums.begin(), nums.end());\n}",
      "java": "public int solve(int[] nums) {\n    int min = nums[0];\n    for (int x : nums) if (x < min) min = x;\n    return min;\n}",
      "javascript": "function solve(nums) {\n    return Math.min(...nums);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Find Smallest Element in an Array\ndef solve(nums):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Find Smallest Element in an Array\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint solve(vector<int>& nums) {\n    // Write your solution here\n    return 0;\n}",
      "java": "// Solution for Find Smallest Element in an Array\nclass Solution {\n    public int solve(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "javascript": "// Solution for Find Smallest Element in an Array\nfunction solve(nums) {\n    // Write your solution here\n    return 0;\n}"
    },
    "id": 75
  },
  {
    "title": "Find the Smallest and Largest Element in an Array",
    "category": "Arrays",
    "difficulty": "Easy",
    "statement": "Given an array nums of integers, find both the minimum and maximum elements.",
    "inputFormat": "nums = <array of integers>",
    "outputFormat": "Array of integers [min, max]",
    "examples": [
      {
        "input": "nums = [5, 2, 9, 1, 7]",
        "output": "[1, 9]"
      },
      {
        "input": "nums = [42]",
        "output": "[42, 42]"
      }
    ],
    "hint1": "You can find both in a single pass of the array.",
    "hint2": "Return an array [min_val, max_val].",
    "solution": {
      "python": "def solve(nums):\n    return [min(nums), max(nums)]",
      "cpp": "vector<int> solve(vector<int>& nums) {\n    int mn = nums[0], mx = nums[0];\n    for (int x : nums) { if (x < mn) mn = x; if (x > mx) mx = x; }\n    return {mn, mx};\n}",
      "java": "public int[] solve(int[] nums) {\n    int min = nums[0], max = nums[0];\n    for (int x : nums) { if (x < min) min = x; if (x > max) max = x; }\n    return new int[]{min, max};\n}",
      "javascript": "function solve(nums) {\n    return [Math.min(...nums), Math.max(...nums)];\n}"
    },
    "boilerplate": {
      "python": "# Solution for Find the Smallest and Largest Element in an Array\ndef solve(nums):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Find the Smallest and Largest Element in an Array\n#include <vector>\nusing namespace std;\n\nvector<int> solve(vector<int>& nums) {\n    // Write your solution here\n    return {};\n}",
      "java": "// Solution for Find the Smallest and Largest Element in an Array\nclass Solution {\n    public int[] solve(int[] nums) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
      "javascript": "// Solution for Find the Smallest and Largest Element in an Array\nfunction solve(nums) {\n    // Write your solution here\n    return [];\n}"
    },
    "id": 76
  },
  {
    "title": "Find Second Smallest Element in an Array",
    "category": "Arrays",
    "difficulty": "Easy",
    "statement": "Given an array nums, find the second smallest distinct element in the array.",
    "inputFormat": "nums = <array of integers>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "nums = [12, 13, 1, 10, 34, 1]",
        "output": "10"
      },
      {
        "input": "nums = [5, 2, 8, 2, 9]",
        "output": "5"
      }
    ],
    "hint1": "Maintain first_min and second_min variables initialized to infinity.",
    "hint2": "When an element is smaller than first_min, update second_min then first_min.",
    "solution": {
      "python": "def solve(nums):\n    distinct = sorted(list(set(nums)))\n    return distinct[1] if len(distinct) > 1 else distinct[0]",
      "cpp": "int solve(vector<int>& nums) {\n    set<int> s(nums.begin(), nums.end());\n    if (s.size() < 2) return *s.begin();\n    auto it = s.begin(); advance(it, 1);\n    return *it;\n}",
      "java": "public int solve(int[] nums) {\n    TreeSet<Integer> set = new TreeSet<>();\n    for (int x : nums) set.add(x);\n    if (set.size() < 2) return set.first();\n    set.pollFirst();\n    return set.first();\n}",
      "javascript": "function solve(nums) {\n    const unique = [...new Set(nums)].sort((a, b) => a - b);\n    return unique.length > 1 ? unique[1] : unique[0];\n}"
    },
    "boilerplate": {
      "python": "# Solution for Find Second Smallest Element in an Array\ndef solve(nums):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Find Second Smallest Element in an Array\n#include <vector>\n#include <set>\nusing namespace std;\n\nint solve(vector<int>& nums) {\n    // Write your solution here\n    return 0;\n}",
      "java": "// Solution for Find Second Smallest Element in an Array\nimport java.util.*;\nclass Solution {\n    public int solve(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "javascript": "// Solution for Find Second Smallest Element in an Array\nfunction solve(nums) {\n    // Write your solution here\n    return 0;\n}"
    },
    "id": 77
  },
  {
    "title": "Calculate the Sum of Elements in an Array",
    "category": "Arrays",
    "difficulty": "Easy",
    "statement": "Given an array nums of integers, calculate the total sum of its elements.",
    "inputFormat": "nums = <array of integers>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "nums = [1, 2, 3, 4, 5]",
        "output": "15"
      },
      {
        "input": "nums = [-10, 20, -5]",
        "output": "5"
      }
    ],
    "hint1": "Iterate through the array and accumulate values.",
    "hint2": "Or use built-in sum() / reduce().",
    "solution": {
      "python": "def solve(nums):\n    return sum(nums)",
      "cpp": "int solve(vector<int>& nums) {\n    int sum = 0;\n    for (int x : nums) sum += x;\n    return sum;\n}",
      "java": "public int solve(int[] nums) {\n    int sum = 0;\n    for (int x : nums) sum += x;\n    return sum;\n}",
      "javascript": "function solve(nums) {\n    return nums.reduce((a, b) => a + b, 0);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Calculate the Sum of Elements in an Array\ndef solve(nums):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Calculate the Sum of Elements in an Array\n#include <vector>\nusing namespace std;\n\nint solve(vector<int>& nums) {\n    // Write your solution here\n    return 0;\n}",
      "java": "// Solution for Calculate the Sum of Elements in an Array\nclass Solution {\n    public int solve(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "javascript": "// Solution for Calculate the Sum of Elements in an Array\nfunction solve(nums) {\n    // Write your solution here\n    return 0;\n}"
    },
    "id": 78
  },
  {
    "title": "Reverse an Array",
    "category": "Arrays",
    "difficulty": "Easy",
    "statement": "Given an array nums, return a new array with elements in reversed order.",
    "inputFormat": "nums = <array of integers>",
    "outputFormat": "Array of integers",
    "examples": [
      {
        "input": "nums = [1, 2, 3, 4, 5]",
        "output": "[5, 4, 3, 2, 1]"
      },
      {
        "input": "nums = [10, 20]",
        "output": "[20, 10]"
      }
    ],
    "hint1": "Use two pointers: swap elements from left and right moving towards the center.",
    "hint2": "Or slice / reverse using built-in functions.",
    "solution": {
      "python": "def solve(nums):\n    return nums[::-1]",
      "cpp": "vector<int> solve(vector<int>& nums) {\n    vector<int> res = nums;\n    reverse(res.begin(), res.end());\n    return res;\n}",
      "java": "public int[] solve(int[] nums) {\n    int[] res = new int[nums.length];\n    for (int i = 0; i < nums.length; i++) res[i] = nums[nums.length - 1 - i];\n    return res;\n}",
      "javascript": "function solve(nums) {\n    return [...nums].reverse();\n}"
    },
    "boilerplate": {
      "python": "# Solution for Reverse an Array\ndef solve(nums):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Reverse an Array\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<int> solve(vector<int>& nums) {\n    // Write your solution here\n    return {};\n}",
      "java": "// Solution for Reverse an Array\nclass Solution {\n    public int[] solve(int[] nums) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
      "javascript": "// Solution for Reverse an Array\nfunction solve(nums) {\n    // Write your solution here\n    return [];\n}"
    },
    "id": 79
  },
  {
    "title": "Sort First Half Ascending and Second Half Descending",
    "category": "Arrays",
    "difficulty": "Medium",
    "statement": "Sort the first half of the array in ascending order and the second half in descending order.",
    "inputFormat": "nums = <array of integers>",
    "outputFormat": "Array of integers",
    "examples": [
      {
        "input": "nums = [5, 2, 4, 7, 9, 3, 1, 6, 8]",
        "output": "[1, 2, 3, 4, 9, 8, 7, 6, 5]"
      },
      {
        "input": "nums = [1, 2, 3, 4]",
        "output": "[1, 2, 4, 3]"
      }
    ],
    "hint1": "Split the array at n // 2.",
    "hint2": "Sort the first half ascending and the second half descending, then concatenate.",
    "solution": {
      "python": "def solve(nums):\n    nums.sort()\n    mid = len(nums) // 2\n    return nums[:mid] + sorted(nums[mid:], reverse=True)",
      "cpp": "vector<int> solve(vector<int>& nums) {\n    sort(nums.begin(), nums.end());\n    int mid = nums.size() / 2;\n    reverse(nums.begin() + mid, nums.end());\n    return nums;\n}",
      "java": "public int[] solve(int[] nums) {\n    Arrays.sort(nums);\n    int mid = nums.length / 2;\n    int l = mid, r = nums.length - 1;\n    while (l < r) { int t = nums[l]; nums[l++] = nums[r]; nums[r--] = t; }\n    return nums;\n}",
      "javascript": "function solve(nums) {\n    nums.sort((a, b) => a - b);\n    const mid = Math.floor(nums.length / 2);\n    const second = nums.slice(mid).sort((a, b) => b - a);\n    return [...nums.slice(0, mid), ...second];\n}"
    },
    "boilerplate": {
      "python": "# Solution for Sort First Half Ascending and Second Half Descending\ndef solve(nums):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Sort First Half Ascending and Second Half Descending\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<int> solve(vector<int>& nums) {\n    // Write your solution here\n    return {};\n}",
      "java": "// Solution for Sort First Half Ascending and Second Half Descending\nimport java.util.*;\nclass Solution {\n    public int[] solve(int[] nums) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
      "javascript": "// Solution for Sort First Half Ascending and Second Half Descending\nfunction solve(nums) {\n    // Write your solution here\n    return [];\n}"
    },
    "id": 80
  },
  {
    "title": "Sort the Elements of an Array",
    "category": "Arrays",
    "difficulty": "Easy",
    "statement": "Given an array nums of integers, sort the elements in ascending order.",
    "inputFormat": "nums = <array of integers>",
    "outputFormat": "Array of integers",
    "examples": [
      {
        "input": "nums = [4, 2, 7, 1, 3]",
        "output": "[1, 2, 3, 4, 7]"
      },
      {
        "input": "nums = [10, -1, 5]",
        "output": "[-1, 5, 10]"
      }
    ],
    "hint1": "Use standard sort algorithms like QuickSort, MergeSort, or built-in sort.",
    "hint2": "Return the sorted array.",
    "solution": {
      "python": "def solve(nums):\n    return sorted(nums)",
      "cpp": "vector<int> solve(vector<int>& nums) {\n    vector<int> res = nums;\n    sort(res.begin(), res.end());\n    return res;\n}",
      "java": "public int[] solve(int[] nums) {\n    int[] res = nums.clone();\n    Arrays.sort(res);\n    return res;\n}",
      "javascript": "function solve(nums) {\n    return [...nums].sort((a, b) => a - b);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Sort the Elements of an Array\ndef solve(nums):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Sort the Elements of an Array\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<int> solve(vector<int>& nums) {\n    // Write your solution here\n    return {};\n}",
      "java": "// Solution for Sort the Elements of an Array\nimport java.util.*;\nclass Solution {\n    public int[] solve(int[] nums) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
      "javascript": "// Solution for Sort the Elements of an Array\nfunction solve(nums) {\n    // Write your solution here\n    return [];\n}"
    },
    "id": 81
  },
  {
    "title": "Finding the Frequency of Elements in an Array",
    "category": "Arrays",
    "difficulty": "Easy",
    "statement": "Given an array nums, count the frequency of each unique element and return as an array of [element, count] pairs sorted by element.",
    "inputFormat": "nums = <array of integers>",
    "outputFormat": "Array of [element, count] pairs",
    "examples": [
      {
        "input": "nums = [10, 20, 20, 10, 10, 20, 5, 20]",
        "output": "[[5, 1], [10, 3], [20, 4]]"
      }
    ],
    "hint1": "Count occurrences using a hash table or dictionary.",
    "hint2": "Sort by key and format as pairs.",
    "solution": {
      "python": "def solve(nums):\n    from collections import Counter\n    counts = Counter(nums)\n    return sorted([[k, v] for k, v in counts.items()])",
      "cpp": "vector<vector<int>> solve(vector<int>& nums) {\n    map<int, int> mp;\n    for (int x : nums) mp[x]++;\n    vector<vector<int>> res;\n    for (auto& p : mp) res.push_back({p.first, p.second});\n    return res;\n}",
      "java": "public List<List<Integer>> solve(int[] nums) {\n    TreeMap<Integer, Integer> map = new TreeMap<>();\n    for (int x : nums) map.put(x, map.getOrDefault(x, 0) + 1);\n    List<List<Integer>> res = new ArrayList<>();\n    for (var e : map.entrySet()) res.add(Arrays.asList(e.getKey(), e.getValue()));\n    return res;\n}",
      "javascript": "function solve(nums) {\n    const map = {};\n    for (const x of nums) map[x] = (map[x] || 0) + 1;\n    return Object.keys(map).map(Number).sort((a, b) => a - b).map(k => [k, map[k]]);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Finding the Frequency of Elements in an Array\ndef solve(nums):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Finding the Frequency of Elements in an Array\n#include <vector>\n#include <map>\nusing namespace std;\n\nvector<vector<int>> solve(vector<int>& nums) {\n    // Write your solution here\n    return {};\n}",
      "java": "// Solution for Finding the Frequency of Elements in an Array\nimport java.util.*;\nclass Solution {\n    public List<List<Integer>> solve(int[] nums) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
      "javascript": "// Solution for Finding the Frequency of Elements in an Array\nfunction solve(nums) {\n    // Write your solution here\n    return [];\n}"
    },
    "id": 82
  },
  {
    "title": "Sorting Elements of an Array by Frequency",
    "category": "Arrays",
    "difficulty": "Medium",
    "statement": "Sort elements of array nums in descending order of frequency. If two elements have equal frequency, sort by element value ascending.",
    "inputFormat": "nums = <array of integers>",
    "outputFormat": "Array of integers",
    "examples": [
      {
        "input": "nums = [2, 5, 2, 8, 5, 6, 8, 8]",
        "output": "[8, 8, 8, 2, 2, 5, 5, 6]"
      }
    ],
    "hint1": "Count frequency of each element first.",
    "hint2": "Sort using custom comparator: primary key is -frequency, secondary key is value.",
    "solution": {
      "python": "def solve(nums):\n    from collections import Counter\n    c = Counter(nums)\n    return sorted(nums, key=lambda x: (-c[x], x))",
      "cpp": "vector<int> solve(vector<int>& nums) {\n    unordered_map<int, int> freq;\n    for(int x : nums) freq[x]++;\n    vector<int> res = nums;\n    sort(res.begin(), res.end(), [&](int a, int b) {\n        if (freq[a] != freq[b]) return freq[a] > freq[b];\n        return a < b;\n    });\n    return res;\n}",
      "java": "public int[] solve(int[] nums) {\n    Map<Integer, Integer> freq = new HashMap<>();\n    for (int x : nums) freq.put(x, freq.getOrDefault(x, 0) + 1);\n    Integer[] arr = Arrays.stream(nums).boxed().toArray(Integer[]::new);\n    Arrays.sort(arr, (a, b) -> freq.get(a).equals(freq.get(b)) ? a - b : freq.get(b) - freq.get(a));\n    return Arrays.stream(arr).mapToInt(i -> i).toArray();\n}",
      "javascript": "function solve(nums) {\n    const freq = {};\n    for (const x of nums) freq[x] = (freq[x] || 0) + 1;\n    return [...nums].sort((a, b) => freq[b] - freq[a] || a - b);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Sorting Elements of an Array by Frequency\ndef solve(nums):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Sorting Elements of an Array by Frequency\n#include <vector>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nvector<int> solve(vector<int>& nums) {\n    // Write your solution here\n    return {};\n}",
      "java": "// Solution for Sorting Elements of an Array by Frequency\nimport java.util.*;\nclass Solution {\n    public int[] solve(int[] nums) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
      "javascript": "// Solution for Sorting Elements of an Array by Frequency\nfunction solve(nums) {\n    // Write your solution here\n    return [];\n}"
    },
    "id": 83
  },
  {
    "title": "Finding the Longest Palindrome in an Array",
    "category": "Arrays",
    "difficulty": "Easy",
    "statement": "Given an array nums of integers, find the largest numerical palindromic element. Return -1 if none exist.",
    "inputFormat": "nums = <array of integers>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "nums = [121, 2322, 54545, 9999]",
        "output": "54545"
      },
      {
        "input": "nums = [12, 34, 56]",
        "output": "-1"
      }
    ],
    "hint1": "Filter numbers that read the same backwards and forwards.",
    "hint2": "Return the maximum value among them or -1 if empty.",
    "solution": {
      "python": "def solve(nums):\n    pals = [x for x in nums if str(x) == str(x)[::-1]]\n    return max(pals) if pals else -1",
      "cpp": "int solve(vector<int>& nums) {\n    auto is_pal = [](int n) {\n        if (n < 0) return false;\n        string s = to_string(n);\n        return equal(s.begin(), s.begin() + s.size()/2, s.rbegin());\n    };\n    int mx = -1;\n    for (int x : nums) if (is_pal(x) && x > mx) mx = x;\n    return mx;\n}",
      "java": "public int solve(int[] nums) {\n    int max = -1;\n    for (int x : nums) {\n        String s = String.valueOf(x);\n        if (s.equals(new StringBuilder(s).reverse().toString()) && x > max) max = x;\n    }\n    return max;\n}",
      "javascript": "function solve(nums) {\n    const pals = nums.filter(x => x.toString() === x.toString().split('').reverse().join(''));\n    return pals.length ? Math.max(...pals) : -1;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Finding the Longest Palindrome in an Array\ndef solve(nums):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Finding the Longest Palindrome in an Array\n#include <vector>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nint solve(vector<int>& nums) {\n    // Write your solution here\n    return -1;\n}",
      "java": "// Solution for Finding the Longest Palindrome in an Array\nclass Solution {\n    public int solve(int[] nums) {\n        // Write your solution here\n        return -1;\n    }\n}",
      "javascript": "// Solution for Finding the Longest Palindrome in an Array\nfunction solve(nums) {\n    // Write your solution here\n    return -1;\n}"
    },
    "id": 84
  },
  {
    "title": "Counting Distinct Elements in an Array",
    "category": "Arrays",
    "difficulty": "Easy",
    "statement": "Count the number of distinct (unique) elements in an array nums.",
    "inputFormat": "nums = <array of integers>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "nums = [10, 20, 20, 10, 30, 40, 10]",
        "output": "4"
      },
      {
        "input": "nums = [1, 1, 1]",
        "output": "1"
      }
    ],
    "hint1": "Use a set to store elements and return its size.",
    "hint2": "Or sort the array and count elements different from their predecessor.",
    "solution": {
      "python": "def solve(nums):\n    return len(set(nums))",
      "cpp": "int solve(vector<int>& nums) {\n    unordered_set<int> s(nums.begin(), nums.end());\n    return (int)s.size();\n}",
      "java": "public int solve(int[] nums) {\n    Set<Integer> set = new HashSet<>();\n    for (int x : nums) set.add(x);\n    return set.size();\n}",
      "javascript": "function solve(nums) {\n    return new Set(nums).size;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Counting Distinct Elements in an Array\ndef solve(nums):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Counting Distinct Elements in an Array\n#include <vector>\n#include <unordered_set>\nusing namespace std;\n\nint solve(vector<int>& nums) {\n    // Write your solution here\n    return 0;\n}",
      "java": "// Solution for Counting Distinct Elements in an Array\nimport java.util.*;\nclass Solution {\n    public int solve(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "javascript": "// Solution for Counting Distinct Elements in an Array\nfunction solve(nums) {\n    // Write your solution here\n    return 0;\n}"
    },
    "id": 85
  },
  {
    "title": "Finding Repeating Elements in an Array",
    "category": "Arrays",
    "difficulty": "Easy",
    "statement": "Find all elements that appear more than once in an array nums. Return them in sorted order.",
    "inputFormat": "nums = <array of integers>",
    "outputFormat": "Array of integers",
    "examples": [
      {
        "input": "nums = [4, 2, 4, 5, 2, 3, 1]",
        "output": "[2, 4]"
      },
      {
        "input": "nums = [1, 2, 3]",
        "output": "[]"
      }
    ],
    "hint1": "Count frequencies of each element.",
    "hint2": "Collect elements with frequency > 1 and sort.",
    "solution": {
      "python": "def solve(nums):\n    from collections import Counter\n    c = Counter(nums)\n    return sorted([k for k, v in c.items() if v > 1])",
      "cpp": "vector<int> solve(vector<int>& nums) {\n    unordered_map<int, int> mp;\n    for (int x : nums) mp[x]++;\n    vector<int> res;\n    for (auto& p : mp) if (p.second > 1) res.push_back(p.first);\n    sort(res.begin(), res.end());\n    return res;\n}",
      "java": "public List<Integer> solve(int[] nums) {\n    Map<Integer, Integer> map = new HashMap<>();\n    for (int x : nums) map.put(x, map.getOrDefault(x, 0) + 1);\n    List<Integer> res = new ArrayList<>();\n    for (var e : map.entrySet()) if (e.getValue() > 1) res.add(e.getKey());\n    Collections.sort(res);\n    return res;\n}",
      "javascript": "function solve(nums) {\n    const freq = {};\n    for (const x of nums) freq[x] = (freq[x] || 0) + 1;\n    return Object.keys(freq).map(Number).filter(k => freq[k] > 1).sort((a, b) => a - b);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Finding Repeating Elements in an Array\ndef solve(nums):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Finding Repeating Elements in an Array\n#include <vector>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nvector<int> solve(vector<int>& nums) {\n    // Write your solution here\n    return {};\n}",
      "java": "// Solution for Finding Repeating Elements in an Array\nimport java.util.*;\nclass Solution {\n    public List<Integer> solve(int[] nums) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
      "javascript": "// Solution for Finding Repeating Elements in an Array\nfunction solve(nums) {\n    // Write your solution here\n    return [];\n}"
    },
    "id": 86
  },
  {
    "title": "Finding Non Repeating Elements in an Array",
    "category": "Arrays",
    "difficulty": "Easy",
    "statement": "Find all elements that appear exactly once in an array nums. Return them in sorted order.",
    "inputFormat": "nums = <array of integers>",
    "outputFormat": "Array of integers",
    "examples": [
      {
        "input": "nums = [1, 2, -1, 1, 3, 2]",
        "output": "[-1, 3]"
      }
    ],
    "hint1": "Count frequency of each element in the array.",
    "hint2": "Filter elements with frequency == 1 and sort.",
    "solution": {
      "python": "def solve(nums):\n    from collections import Counter\n    c = Counter(nums)\n    return sorted([k for k, v in c.items() if v == 1])",
      "cpp": "vector<int> solve(vector<int>& nums) {\n    unordered_map<int, int> mp;\n    for (int x : nums) mp[x]++;\n    vector<int> res;\n    for (auto& p : mp) if (p.second == 1) res.push_back(p.first);\n    sort(res.begin(), res.end());\n    return res;\n}",
      "java": "public List<Integer> solve(int[] nums) {\n    Map<Integer, Integer> map = new HashMap<>();\n    for (int x : nums) map.put(x, map.getOrDefault(x, 0) + 1);\n    List<Integer> res = new ArrayList<>();\n    for (var e : map.entrySet()) if (e.getValue() == 1) res.add(e.getKey());\n    Collections.sort(res);\n    return res;\n}",
      "javascript": "function solve(nums) {\n    const freq = {};\n    for (const x of nums) freq[x] = (freq[x] || 0) + 1;\n    return Object.keys(freq).map(Number).filter(k => freq[k] === 1).sort((a, b) => a - b);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Finding Non Repeating Elements in an Array\ndef solve(nums):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Finding Non Repeating Elements in an Array\n#include <vector>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nvector<int> solve(vector<int>& nums) {\n    // Write your solution here\n    return {};\n}",
      "java": "// Solution for Finding Non Repeating Elements in an Array\nimport java.util.*;\nclass Solution {\n    public List<Integer> solve(int[] nums) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
      "javascript": "// Solution for Finding Non Repeating Elements in an Array\nfunction solve(nums) {\n    // Write your solution here\n    return [];\n}"
    },
    "id": 87
  },
  {
    "title": "Removing Duplicate Elements from an Array",
    "category": "Arrays",
    "difficulty": "Easy",
    "statement": "Remove all duplicate elements from an array nums, preserving the first occurrence order.",
    "inputFormat": "nums = <array of integers>",
    "outputFormat": "Array of integers",
    "examples": [
      {
        "input": "nums = [10, 20, 20, 30, 40, 40, 40, 50]",
        "output": "[10, 20, 30, 40, 50]"
      }
    ],
    "hint1": "Iterate and keep track of seen elements using a hash set.",
    "hint2": "Only append an element to the result if it hasn't been seen.",
    "solution": {
      "python": "def solve(nums):\n    seen = set()\n    res = []\n    for x in nums:\n        if x not in seen:\n            seen.add(x)\n            res.append(x)\n    return res",
      "cpp": "vector<int> solve(vector<int>& nums) {\n    unordered_set<int> seen;\n    vector<int> res;\n    for (int x : nums) {\n        if (seen.find(x) == seen.end()) {\n            seen.insert(x);\n            res.push_back(x);\n        }\n    }\n    return res;\n}",
      "java": "public int[] solve(int[] nums) {\n    Set<Integer> seen = new HashSet<>();\n    List<Integer> res = new ArrayList<>();\n    for (int x : nums) if (seen.add(x)) res.add(x);\n    return res.stream().mapToInt(i -> i).toArray();\n}",
      "javascript": "function solve(nums) {\n    return [...new Set(nums)];\n}"
    },
    "boilerplate": {
      "python": "# Solution for Removing Duplicate Elements from an Array\ndef solve(nums):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Removing Duplicate Elements from an Array\n#include <vector>\n#include <unordered_set>\nusing namespace std;\n\nvector<int> solve(vector<int>& nums) {\n    // Write your solution here\n    return {};\n}",
      "java": "// Solution for Removing Duplicate Elements from an Array\nimport java.util.*;\nclass Solution {\n    public int[] solve(int[] nums) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
      "javascript": "// Solution for Removing Duplicate Elements from an Array\nfunction solve(nums) {\n    // Write your solution here\n    return [];\n}"
    },
    "id": 88
  },
  {
    "title": "Minimum Scalar Product of Two Vectors",
    "category": "Arrays",
    "difficulty": "Medium",
    "statement": "Given two vectors a and b, find the minimum scalar (dot) product by permuting their elements.",
    "inputFormat": "a = <array of integers>, b = <array of integers>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "a = [1, 2, 6, 3, 7], b = [10, 7, 45, 3, 7]",
        "output": "149"
      }
    ],
    "hint1": "To minimize the dot product, pair the smallest element of a with the largest element of b.",
    "hint2": "Sort array a ascending and array b descending, then sum the products.",
    "solution": {
      "python": "def solve(a, b):\n    a.sort()\n    b.sort(reverse=True)\n    return sum(x * y for x, y in zip(a, b))",
      "cpp": "long long solve(vector<int>& a, vector<int>& b) {\n    sort(a.begin(), a.end());\n    sort(b.begin(), b.end(), greater<int>());\n    long long sum = 0;\n    for (size_t i = 0; i < a.size(); ++i) sum += (long long)a[i] * b[i];\n    return sum;\n}",
      "java": "public long solve(int[] a, int[] b) {\n    Arrays.sort(a);\n    Arrays.sort(b);\n    long sum = 0;\n    int n = a.length;\n    for (int i = 0; i < n; i++) sum += (long)a[i] * b[n - 1 - i];\n    return sum;\n}",
      "javascript": "function solve(a, b) {\n    a.sort((x, y) => x - y);\n    b.sort((x, y) => y - x);\n    return a.reduce((sum, val, i) => sum + val * b[i], 0);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Minimum Scalar Product of Two Vectors\ndef solve(a, b):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Minimum Scalar Product of Two Vectors\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nlong long solve(vector<int>& a, vector<int>& b) {\n    // Write your solution here\n    return 0;\n}",
      "java": "// Solution for Minimum Scalar Product of Two Vectors\nimport java.util.*;\nclass Solution {\n    public long solve(int[] a, int[] b) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "javascript": "// Solution for Minimum Scalar Product of Two Vectors\nfunction solve(a, b) {\n    // Write your solution here\n    return 0;\n}"
    },
    "id": 89
  },
  {
    "title": "Maximum Scalar Product of Two Vectors",
    "category": "Arrays",
    "difficulty": "Medium",
    "statement": "Given two vectors a and b, find the maximum scalar (dot) product by permuting their elements.",
    "inputFormat": "a = <array of integers>, b = <array of integers>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "a = [1, 2, 6, 3, 7], b = [10, 7, 45, 3, 7]",
        "output": "395"
      }
    ],
    "hint1": "To maximize the dot product, pair the largest element of a with the largest of b.",
    "hint2": "Sort both arrays in ascending order, then sum the component-wise products.",
    "solution": {
      "python": "def solve(a, b):\n    a.sort()\n    b.sort()\n    return sum(x * y for x, y in zip(a, b))",
      "cpp": "long long solve(vector<int>& a, vector<int>& b) {\n    sort(a.begin(), a.end());\n    sort(b.begin(), b.end());\n    long long sum = 0;\n    for (size_t i = 0; i < a.size(); ++i) sum += (long long)a[i] * b[i];\n    return sum;\n}",
      "java": "public long solve(int[] a, int[] b) {\n    Arrays.sort(a);\n    Arrays.sort(b);\n    long sum = 0;\n    for (int i = 0; i < a.length; i++) sum += (long)a[i] * b[i];\n    return sum;\n}",
      "javascript": "function solve(a, b) {\n    a.sort((x, y) => x - y);\n    b.sort((x, y) => x - y);\n    return a.reduce((sum, val, i) => sum + val * b[i], 0);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Maximum Scalar Product of Two Vectors\ndef solve(a, b):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Maximum Scalar Product of Two Vectors\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nlong long solve(vector<int>& a, vector<int>& b) {\n    // Write your solution here\n    return 0;\n}",
      "java": "// Solution for Maximum Scalar Product of Two Vectors\nimport java.util.*;\nclass Solution {\n    public long solve(int[] a, int[] b) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "javascript": "// Solution for Maximum Scalar Product of Two Vectors\nfunction solve(a, b) {\n    // Write your solution here\n    return 0;\n}"
    },
    "id": 90
  },
  {
    "title": "Count Even and Odd Elements in an Array",
    "category": "Arrays",
    "difficulty": "Easy",
    "statement": "Given an array nums, count the number of even and odd elements. Return [even_count, odd_count].",
    "inputFormat": "nums = <array of integers>",
    "outputFormat": "Array of integers [even_count, odd_count]",
    "examples": [
      {
        "input": "nums = [1, 2, 3, 4, 5, 6]",
        "output": "[3, 3]"
      },
      {
        "input": "nums = [2, 4, 6]",
        "output": "[3, 0]"
      }
    ],
    "hint1": "Iterate through the array and check each number using modulo 2.",
    "hint2": "Even: x % 2 == 0; Odd: x % 2 != 0.",
    "solution": {
      "python": "def solve(nums):\n    even = sum(1 for x in nums if x % 2 == 0)\n    return [even, len(nums) - even]",
      "cpp": "vector<int> solve(vector<int>& nums) {\n    int even = 0, odd = 0;\n    for (int x : nums) { if (x % 2 == 0) even++; else odd++; }\n    return {even, odd};\n}",
      "java": "public int[] solve(int[] nums) {\n    int even = 0, odd = 0;\n    for (int x : nums) { if (x % 2 == 0) even++; else odd++; }\n    return new int[]{even, odd};\n}",
      "javascript": "function solve(nums) {\n    const even = nums.filter(x => x % 2 === 0).length;\n    return [even, nums.length - even];\n}"
    },
    "boilerplate": {
      "python": "# Solution for Count Even and Odd Elements in an Array\ndef solve(nums):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Count Even and Odd Elements in an Array\n#include <vector>\nusing namespace std;\n\nvector<int> solve(vector<int>& nums) {\n    // Write your solution here\n    return {};\n}",
      "java": "// Solution for Count Even and Odd Elements in an Array\nclass Solution {\n    public int[] solve(int[] nums) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
      "javascript": "// Solution for Count Even and Odd Elements in an Array\nfunction solve(nums) {\n    // Write your solution here\n    return [];\n}"
    },
    "id": 91
  },
  {
    "title": "Find All Symmetric Pairs in an Array",
    "category": "Arrays",
    "difficulty": "Medium",
    "statement": "Given pairs of integers, find all symmetric pairs (i.e. [a, b] and [b, a]). Return pairs [a, b] where a < b.",
    "inputFormat": "pairs = <array of 2-element arrays>",
    "outputFormat": "Array of 2-element arrays",
    "examples": [
      {
        "input": "pairs = [[11, 20], [30, 40], [5, 10], [40, 30], [10, 5]]",
        "output": "[[5, 10], [30, 40]]"
      }
    ],
    "hint1": "Store each pair in a map or set.",
    "hint2": "When encountering [b, a], if [a, b] is already in the map, add to symmetric pairs.",
    "solution": {
      "python": "def solve(pairs):\n    d = {}\n    res = []\n    for a, b in pairs:\n        if b in d and d[b] == a:\n            res.append(sorted([a, b]))\n        else:\n            d[a] = b\n    return sorted(res)",
      "cpp": "vector<vector<int>> solve(vector<vector<int>>& pairs) {\n    unordered_map<int, int> mp;\n    vector<vector<int>> res;\n    for (auto& p : pairs) {\n        int a = p[0], b = p[1];\n        if (mp.count(b) && mp[b] == a) {\n            res.push_back({min(a, b), max(a, b)});\n        } else {\n            mp[a] = b;\n        }\n    }\n    sort(res.begin(), res.end());\n    return res;\n}",
      "java": "public List<List<Integer>> solve(int[][] pairs) {\n    Map<Integer, Integer> map = new HashMap<>();\n    List<List<Integer>> res = new ArrayList<>();\n    for (int[] p : pairs) {\n        int a = p[0], b = p[1];\n        if (map.containsKey(b) && map.get(b) == a) {\n            res.add(Arrays.asList(Math.min(a, b), Math.max(a, b)));\n        } else {\n            map.put(a, b);\n        }\n    }\n    res.sort((p1, p2) -> p1.get(0).equals(p2.get(0)) ? p1.get(1) - p2.get(1) : p1.get(0) - p2.get(0));\n    return res;\n}",
      "javascript": "function solve(pairs) {\n    const map = new Map();\n    const res = [];\n    for (const [a, b] of pairs) {\n        if (map.has(b) && map.get(b) === a) {\n            res.push([Math.min(a, b), Math.max(a, b)]);\n        } else {\n            map.set(a, b);\n        }\n    }\n    return res.sort((p1, p2) => p1[0] - p2[0] || p1[1] - p2[1]);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Find All Symmetric Pairs in an Array\ndef solve(pairs):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Find All Symmetric Pairs in an Array\n#include <vector>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nvector<vector<int>> solve(vector<vector<int>>& pairs) {\n    // Write your solution here\n    return {};\n}",
      "java": "// Solution for Find All Symmetric Pairs in an Array\nimport java.util.*;\nclass Solution {\n    public List<List<Integer>> solve(int[][] pairs) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
      "javascript": "// Solution for Find All Symmetric Pairs in an Array\nfunction solve(pairs) {\n    // Write your solution here\n    return [];\n}"
    },
    "id": 92
  },
  {
    "title": "Maximum Product Subarray",
    "category": "Arrays",
    "difficulty": "Medium",
    "statement": "Find the contiguous subarray within an array nums which has the largest product.",
    "inputFormat": "nums = <array of integers>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "nums = [2, 3, -2, 4]",
        "output": "6"
      },
      {
        "input": "nums = [-2, 0, -1]",
        "output": "0"
      }
    ],
    "hint1": "Maintain both max_so_far and min_so_far, since multiplying by a negative number can turn a minimum into a maximum.",
    "hint2": "Swap max and min when encountering a negative number.",
    "solution": {
      "python": "def solve(nums):\n    res = max(nums)\n    cur_min, cur_max = 1, 1\n    for n in nums:\n        if n == 0:\n            cur_min, cur_max = 1, 1\n            continue\n        tmp = cur_max * n\n        cur_max = max(n * cur_max, n * cur_min, n)\n        cur_min = min(tmp, n * cur_min, n)\n        res = max(res, cur_max)\n    return res",
      "cpp": "int solve(vector<int>& nums) {\n    int res = nums[0], cur_max = nums[0], cur_min = nums[0];\n    for (size_t i = 1; i < nums.size(); ++i) {\n        if (nums[i] < 0) swap(cur_max, cur_min);\n        cur_max = max(nums[i], cur_max * nums[i]);\n        cur_min = min(nums[i], cur_min * nums[i]);\n        res = max(res, cur_max);\n    }\n    return res;\n}",
      "java": "public int solve(int[] nums) {\n    int res = nums[0], curMax = nums[0], curMin = nums[0];\n    for (int i = 1; i < nums.length; i++) {\n        if (nums[i] < 0) { int t = curMax; curMax = curMin; curMin = t; }\n        curMax = Math.max(nums[i], curMax * nums[i]);\n        curMin = Math.min(nums[i], curMin * nums[i]);\n        res = Math.max(res, curMax);\n    }\n    return res;\n}",
      "javascript": "function solve(nums) {\n    let res = nums[0], curMax = nums[0], curMin = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        if (nums[i] < 0) [curMax, curMin] = [curMin, curMax];\n        curMax = Math.max(nums[i], curMax * nums[i]);\n        curMin = Math.min(nums[i], curMin * nums[i]);\n        res = Math.max(res, curMax);\n    }\n    return res;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Maximum Product Subarray\ndef solve(nums):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Maximum Product Subarray\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint solve(vector<int>& nums) {\n    // Write your solution here\n    return 0;\n}",
      "java": "// Solution for Maximum Product Subarray\nclass Solution {\n    public int solve(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "javascript": "// Solution for Maximum Product Subarray\nfunction solve(nums) {\n    // Write your solution here\n    return 0;\n}"
    },
    "id": 93
  },
  {
    "title": "Determine if Two Arrays are Disjoint",
    "category": "Arrays",
    "difficulty": "Easy",
    "statement": "Given two arrays a and b, determine if they are disjoint (they share no elements).",
    "inputFormat": "a = <array of integers>, b = <array of integers>",
    "outputFormat": "Boolean (true/false)",
    "examples": [
      {
        "input": "a = [12, 34, 11, 9, 3], b = [7, 2, 1, 5]",
        "output": "true"
      },
      {
        "input": "a = [12, 34, 11, 9, 3], b = [2, 1, 3, 5]",
        "output": "false"
      }
    ],
    "hint1": "Check if the intersection of the two sets is empty.",
    "hint2": "Use a hash set to store elements of one array and check against the other.",
    "solution": {
      "python": "def solve(a, b):\n    return len(set(a).intersection(set(b))) == 0",
      "cpp": "bool solve(vector<int>& a, vector<int>& b) {\n    unordered_set<int> s(a.begin(), a.end());\n    for (int x : b) if (s.count(x)) return false;\n    return true;\n}",
      "java": "public boolean solve(int[] a, int[] b) {\n    Set<Integer> set = new HashSet<>();\n    for (int x : a) set.add(x);\n    for (int x : b) if (set.contains(x)) return false;\n    return true;\n}",
      "javascript": "function solve(a, b) {\n    const s = new Set(a);\n    return !b.some(x => s.has(x));\n}"
    },
    "boilerplate": {
      "python": "# Solution for Determine if Two Arrays are Disjoint\ndef solve(a, b):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Determine if Two Arrays are Disjoint\n#include <vector>\n#include <unordered_set>\nusing namespace std;\n\nbool solve(vector<int>& a, vector<int>& b) {\n    // Write your solution here\n    return false;\n}",
      "java": "// Solution for Determine if Two Arrays are Disjoint\nimport java.util.*;\nclass Solution {\n    public boolean solve(int[] a, int[] b) {\n        // Write your solution here\n        return false;\n    }\n}",
      "javascript": "// Solution for Determine if Two Arrays are Disjoint\nfunction solve(a, b) {\n    // Write your solution here\n    return false;\n}"
    },
    "id": 94
  },
  {
    "title": "Determine Array is a Subset of Another Array",
    "category": "Arrays",
    "difficulty": "Easy",
    "statement": "Determine whether array sub is a subset of array arr.",
    "inputFormat": "arr = <array of integers>, sub = <array of integers>",
    "outputFormat": "Boolean (true/false)",
    "examples": [
      {
        "input": "arr = [11, 1, 13, 21, 3, 7], sub = [11, 3, 7, 1]",
        "output": "true"
      },
      {
        "input": "arr = [10, 5, 2, 23, 19], sub = [19, 5, 3]",
        "output": "false"
      }
    ],
    "hint1": "Convert the parent array into a hash set.",
    "hint2": "Verify every element in the candidate subset exists in the set.",
    "solution": {
      "python": "def solve(arr, sub):\n    s = set(arr)\n    return all(x in s for x in sub)",
      "cpp": "bool solve(vector<int>& arr, vector<int>& sub) {\n    unordered_set<int> s(arr.begin(), arr.end());\n    for (int x : sub) if (!s.count(x)) return false;\n    return true;\n}",
      "java": "public boolean solve(int[] arr, int[] sub) {\n    Set<Integer> set = new HashSet<>();\n    for (int x : arr) set.add(x);\n    for (int x : sub) if (!set.contains(x)) return false;\n    return true;\n}",
      "javascript": "function solve(arr, sub) {\n    const s = new Set(arr);\n    return sub.every(x => s.has(x));\n}"
    },
    "boilerplate": {
      "python": "# Solution for Determine Array is a Subset of Another Array\ndef solve(arr, sub):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Determine Array is a Subset of Another Array\n#include <vector>\n#include <unordered_set>\nusing namespace std;\n\nbool solve(vector<int>& arr, vector<int>& sub) {\n    // Write your solution here\n    return false;\n}",
      "java": "// Solution for Determine Array is a Subset of Another Array\nimport java.util.*;\nclass Solution {\n    public boolean solve(int[] arr, int[] sub) {\n        // Write your solution here\n        return false;\n    }\n}",
      "javascript": "// Solution for Determine Array is a Subset of Another Array\nfunction solve(arr, sub) {\n    // Write your solution here\n    return false;\n}"
    },
    "id": 95
  },
  {
    "title": "Determine Can All Numbers of an Array Be Made Equal",
    "category": "Arrays",
    "difficulty": "Medium",
    "statement": "Given an array nums, check if all numbers can be made equal by only multiplying by 2 or 3 any number of times.",
    "inputFormat": "nums = <array of integers>",
    "outputFormat": "Boolean (true/false)",
    "examples": [
      {
        "input": "nums = [50, 75, 150]",
        "output": "true"
      },
      {
        "input": "nums = [10, 14]",
        "output": "false"
      }
    ],
    "hint1": "Divide out all factors of 2 and 3 from each number.",
    "hint2": "If the remaining quotients are all equal, the numbers can be made equal.",
    "solution": {
      "python": "def solve(nums):\n    def reduce_val(n):\n        while n % 2 == 0: n //= 2\n        while n % 3 == 0: n //= 3\n        return n\n    reduced = [reduce_val(x) for x in nums]\n    return len(set(reduced)) <= 1",
      "cpp": "bool solve(vector<int>& nums) {\n    auto reduce_val = [](int n) {\n        while (n % 2 == 0) n /= 2;\n        while (n % 3 == 0) n /= 3;\n        return n;\n    };\n    int first = reduce_val(nums[0]);\n    for (size_t i = 1; i < nums.size(); ++i) if (reduce_val(nums[i]) != first) return false;\n    return true;\n}",
      "java": "public boolean solve(int[] nums) {\n    int first = reduceVal(nums[0]);\n    for (int i = 1; i < nums.length; i++) if (reduceVal(nums[i]) != first) return false;\n    return true;\n}\nprivate int reduceVal(int n) {\n    while (n % 2 == 0) n /= 2;\n    while (n % 3 == 0) n /= 3;\n    return n;\n}",
      "javascript": "function solve(nums) {\n    const reduce = n => { while (n % 2 === 0) n /= 2; while (n % 3 === 0) n /= 3; return n; };\n    const first = reduce(nums[0]);\n    return nums.every(x => reduce(x) === first);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Determine Can All Numbers of an Array Be Made Equal\ndef solve(nums):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Determine Can All Numbers of an Array Be Made Equal\n#include <vector>\nusing namespace std;\n\nbool solve(vector<int>& nums) {\n    // Write your solution here\n    return false;\n}",
      "java": "// Solution for Determine Can All Numbers of an Array Be Made Equal\nclass Solution {\n    public boolean solve(int[] nums) {\n        // Write your solution here\n        return false;\n    }\n}",
      "javascript": "// Solution for Determine Can All Numbers of an Array Be Made Equal\nfunction solve(nums) {\n    // Write your solution here\n    return false;\n}"
    },
    "id": 96
  },
  {
    "title": "Minimum Sum of Absolute Difference of Array",
    "category": "Arrays",
    "difficulty": "Easy",
    "statement": "Given an array nums, find the minimum sum of absolute differences around the median.",
    "inputFormat": "nums = <array of integers>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "nums = [2, 4, 5, 3]",
        "output": "4"
      },
      {
        "input": "nums = [1, 2, 3]",
        "output": "2"
      }
    ],
    "hint1": "The sum of absolute differences is minimized at the median of the array.",
    "hint2": "Sort the array, pick the median element, and sum |x - median|.",
    "solution": {
      "python": "def solve(nums):\n    nums.sort()\n    med = nums[len(nums) // 2]\n    return sum(abs(x - med) for x in nums)",
      "cpp": "int solve(vector<int>& nums) {\n    sort(nums.begin(), nums.end());\n    int med = nums[nums.size() / 2];\n    int sum = 0;\n    for (int x : nums) sum += abs(x - med);\n    return sum;\n}",
      "java": "public int solve(int[] nums) {\n    Arrays.sort(nums);\n    int med = nums[nums.length / 2];\n    int sum = 0;\n    for (int x : nums) sum += Math.abs(x - med);\n    return sum;\n}",
      "javascript": "function solve(nums) {\n    nums.sort((a, b) => a - b);\n    const med = nums[Math.floor(nums.length / 2)];\n    return nums.reduce((s, x) => s + Math.abs(x - med), 0);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Minimum Sum of Absolute Difference of Array\ndef solve(nums):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Minimum Sum of Absolute Difference of Array\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint solve(vector<int>& nums) {\n    // Write your solution here\n    return 0;\n}",
      "java": "// Solution for Minimum Sum of Absolute Difference of Array\nimport java.util.*;\nclass Solution {\n    public int solve(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "javascript": "// Solution for Minimum Sum of Absolute Difference of Array\nfunction solve(nums) {\n    // Write your solution here\n    return 0;\n}"
    },
    "id": 97
  },
  {
    "title": "Sort an Array According to Order Defined by Another Array",
    "category": "Arrays",
    "difficulty": "Medium",
    "statement": "Sort array a according to the relative order defined by array b. Elements not present in b should be sorted ascending at the end.",
    "inputFormat": "a = <array of integers>, b = <array of integers>",
    "outputFormat": "Array of integers",
    "examples": [
      {
        "input": "a = [2, 1, 2, 5, 7, 1, 9, 3, 6, 8, 8], b = [2, 1, 8, 3]",
        "output": "[2, 2, 1, 1, 8, 8, 3, 5, 6, 7, 9]"
      }
    ],
    "hint1": "Map elements of b to their index (priority).",
    "hint2": "Assign elements not in b a high priority and sort them by natural value.",
    "solution": {
      "python": "def solve(a, b):\n    order = {val: i for i, val in enumerate(b)}\n    return sorted(a, key=lambda x: (order.get(x, float('inf')), x))",
      "cpp": "vector<int> solve(vector<int>& a, vector<int>& b) {\n    unordered_map<int, int> order;\n    for (size_t i = 0; i < b.size(); ++i) order[b[i]] = i;\n    vector<int> res = a;\n    sort(res.begin(), res.end(), [&](int x, int y) {\n        int ox = order.count(x) ? order[x] : 1e9;\n        int oy = order.count(y) ? order[y] : 1e9;\n        if (ox != oy) return ox < oy;\n        return x < y;\n    });\n    return res;\n}",
      "java": "public int[] solve(int[] a, int[] b) {\n    Map<Integer, Integer> order = new HashMap<>();\n    for (int i = 0; i < b.length; i++) order.put(b[i], i);\n    Integer[] arr = Arrays.stream(a).boxed().toArray(Integer[]::new);\n    Arrays.sort(arr, (x, y) -> {\n        int ox = order.getOrDefault(x, Integer.MAX_VALUE);\n        int oy = order.getOrDefault(y, Integer.MAX_VALUE);\n        return ox != oy ? ox - oy : x - y;\n    });\n    return Arrays.stream(arr).mapToInt(i -> i).toArray();\n}",
      "javascript": "function solve(a, b) {\n    const order = new Map();\n    b.forEach((val, i) => order.set(val, i));\n    return [...a].sort((x, y) => {\n        const ox = order.has(x) ? order.get(x) : Infinity;\n        const oy = order.has(y) ? order.get(y) : Infinity;\n        return ox !== oy ? ox - oy : x - y;\n    });\n}"
    },
    "boilerplate": {
      "python": "# Solution for Sort an Array According to Order Defined by Another Array\ndef solve(a, b):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Sort an Array According to Order Defined by Another Array\n#include <vector>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nvector<int> solve(vector<int>& a, vector<int>& b) {\n    // Write your solution here\n    return {};\n}",
      "java": "// Solution for Sort an Array According to Order Defined by Another Array\nimport java.util.*;\nclass Solution {\n    public int[] solve(int[] a, int[] b) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
      "javascript": "// Solution for Sort an Array According to Order Defined by Another Array\nfunction solve(a, b) {\n    // Write your solution here\n    return [];\n}"
    },
    "id": 98
  },
  {
    "title": "Replace Each Element of Array by its Rank",
    "category": "Arrays",
    "difficulty": "Easy",
    "statement": "Given an array nums, replace each element by its 1-based rank (smallest element has rank 1).",
    "inputFormat": "nums = <array of integers>",
    "outputFormat": "Array of integers",
    "examples": [
      {
        "input": "nums = [100, 2, 70, 2]",
        "output": "[3, 1, 2, 1]"
      },
      {
        "input": "nums = [40, 10, 20, 30]",
        "output": "[4, 1, 2, 3]"
      }
    ],
    "hint1": "Extract sorted unique values from nums.",
    "hint2": "Map each unique value to its 1-based rank (index + 1).",
    "solution": {
      "python": "def solve(nums):\n    ranks = {val: i + 1 for i, val in enumerate(sorted(set(nums)))}\n    return [ranks[x] for x in nums]",
      "cpp": "vector<int> solve(vector<int>& nums) {\n    vector<int> sorted_unique = nums;\n    sort(sorted_unique.begin(), sorted_unique.end());\n    sorted_unique.erase(unique(sorted_unique.begin(), sorted_unique.end()), sorted_unique.end());\n    unordered_map<int, int> rank;\n    for (size_t i = 0; i < sorted_unique.size(); ++i) rank[sorted_unique[i]] = i + 1;\n    vector<int> res;\n    for (int x : nums) res.push_back(rank[x]);\n    return res;\n}",
      "java": "public int[] solve(int[] nums) {\n    int[] sorted = Arrays.stream(nums).distinct().sorted().toArray();\n    Map<Integer, Integer> rank = new HashMap<>();\n    for (int i = 0; i < sorted.length; i++) rank.put(sorted[i], i + 1);\n    return Arrays.stream(nums).map(rank::get).toArray();\n}",
      "javascript": "function solve(nums) {\n    const sorted = [...new Set(nums)].sort((a, b) => a - b);\n    const ranks = new Map();\n    sorted.forEach((val, i) => ranks.set(val, i + 1));\n    return nums.map(x => ranks.get(x));\n}"
    },
    "boilerplate": {
      "python": "# Solution for Replace Each Element of Array by its Rank\ndef solve(nums):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Replace Each Element of Array by its Rank\n#include <vector>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nvector<int> solve(vector<int>& nums) {\n    // Write your solution here\n    return {};\n}",
      "java": "// Solution for Replace Each Element of Array by its Rank\nimport java.util.*;\nclass Solution {\n    public int[] solve(int[] nums) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
      "javascript": "// Solution for Replace Each Element of Array by its Rank\nfunction solve(nums) {\n    // Write your solution here\n    return [];\n}"
    },
    "id": 99
  },
  {
    "title": "Finding Equilibrium Index of an Array",
    "category": "Arrays",
    "difficulty": "Easy",
    "statement": "Find the first equilibrium index of array nums where sum of lower indices equals sum of higher indices. Return -1 if none.",
    "inputFormat": "nums = <array of integers>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "nums = [-7, 1, 5, 2, -4, 3, 0]",
        "output": "3",
        "explanation": "nums[0]+nums[1]+nums[2] = -1, nums[4]+nums[5]+nums[6] = -1"
      },
      {
        "input": "nums = [1, 2, 3]",
        "output": "-1"
      }
    ],
    "hint1": "Compute the total sum of the array first.",
    "hint2": "Iterate and keep track of left_sum; right_sum = total - left_sum - nums[i].",
    "solution": {
      "python": "def solve(nums):\n    total = sum(nums)\n    left_sum = 0\n    for i, x in enumerate(nums):\n        if left_sum == total - left_sum - x:\n            return i\n        left_sum += x\n    return -1",
      "cpp": "int solve(vector<int>& nums) {\n    long long total = 0;\n    for (int x : nums) total += x;\n    long long left_sum = 0;\n    for (size_t i = 0; i < nums.size(); ++i) {\n        if (left_sum == total - left_sum - nums[i]) return (int)i;\n        left_sum += nums[i];\n    }\n    return -1;\n}",
      "java": "public int solve(int[] nums) {\n    long total = 0;\n    for (int x : nums) total += x;\n    long leftSum = 0;\n    for (int i = 0; i < nums.length; i++) {\n        if (leftSum == total - leftSum - nums[i]) return i;\n        leftSum += nums[i];\n    }\n    return -1;\n}",
      "javascript": "function solve(nums) {\n    const total = nums.reduce((a, b) => a + b, 0);\n    let leftSum = 0;\n    for (let i = 0; i < nums.length; i++) {\n        if (leftSum === total - leftSum - nums[i]) return i;\n        leftSum += nums[i];\n    }\n    return -1;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Finding Equilibrium Index of an Array\ndef solve(nums):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Finding Equilibrium Index of an Array\n#include <vector>\nusing namespace std;\n\nint solve(vector<int>& nums) {\n    // Write your solution here\n    return -1;\n}",
      "java": "// Solution for Finding Equilibrium Index of an Array\nclass Solution {\n    public int solve(int[] nums) {\n        // Write your solution here\n        return -1;\n    }\n}",
      "javascript": "// Solution for Finding Equilibrium Index of an Array\nfunction solve(nums) {\n    // Write your solution here\n    return -1;\n}"
    },
    "id": 100
  },
  {
    "title": "Rotation of Elements of Array Left and Right",
    "category": "Arrays",
    "difficulty": "Easy",
    "statement": "Rotate array nums left by k positions.",
    "inputFormat": "nums = <array of integers>, k = <integer>",
    "outputFormat": "Array of integers",
    "examples": [
      {
        "input": "nums = [1, 2, 3, 4, 5], k = 2",
        "output": "[3, 4, 5, 1, 2]"
      }
    ],
    "hint1": "k = k % len(nums).",
    "hint2": "Left rotation takes nums[k:] and concatenates nums[:k].",
    "solution": {
      "python": "def solve(nums, k):\n    if not nums: return []\n    k %= len(nums)\n    return nums[k:] + nums[:k]",
      "cpp": "vector<int> solve(vector<int>& nums, int k) {\n    if (nums.empty()) return {};\n    k %= nums.size();\n    vector<int> res(nums.begin() + k, nums.end());\n    res.insert(res.end(), nums.begin(), nums.begin() + k);\n    return res;\n}",
      "java": "public int[] solve(int[] nums, int k) {\n    if (nums.length == 0) return new int[]{};\n    k %= nums.length;\n    int[] res = new int[nums.length];\n    for (int i = 0; i < nums.length; i++) res[i] = nums[(i + k) % nums.length];\n    return res;\n}",
      "javascript": "function solve(nums, k) {\n    if (!nums.length) return [];\n    k %= nums.length;\n    return [...nums.slice(k), ...nums.slice(0, k)];\n}"
    },
    "boilerplate": {
      "python": "# Solution for Rotation of Elements of Array Left and Right\ndef solve(nums, k):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Rotation of Elements of Array Left and Right\n#include <vector>\nusing namespace std;\n\nvector<int> solve(vector<int>& nums, int k) {\n    // Write your solution here\n    return {};\n}",
      "java": "// Solution for Rotation of Elements of Array Left and Right\nclass Solution {\n    public int[] solve(int[] nums, int k) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
      "javascript": "// Solution for Rotation of Elements of Array Left and Right\nfunction solve(nums, k) {\n    // Write your solution here\n    return [];\n}"
    },
    "id": 101
  },
  {
    "title": "Block Swap Algorithm for Array Rotation",
    "category": "Arrays",
    "difficulty": "Medium",
    "statement": "Rotate an array of size n by d positions using the block swap algorithm.",
    "inputFormat": "nums = <array of integers>, d = <integer>",
    "outputFormat": "Array of integers",
    "examples": [
      {
        "input": "nums = [1, 2, 3, 4, 5, 6, 7], d = 2",
        "output": "[3, 4, 5, 6, 7, 1, 2]"
      }
    ],
    "hint1": "Divide array into two blocks A = nums[0..d-1] and B = nums[d..n-1].",
    "hint2": "Recursively swap blocks of equal size until the array is rotated in place.",
    "solution": {
      "python": "def solve(nums, d):\n    n = len(nums)\n    if n == 0: return []\n    d %= n\n    return nums[d:] + nums[:d]",
      "cpp": "vector<int> solve(vector<int>& nums, int d) {\n    if (nums.empty()) return {};\n    int n = nums.size();\n    d %= n;\n    vector<int> res(nums.begin() + d, nums.end());\n    res.insert(res.end(), nums.begin(), nums.begin() + d);\n    return res;\n}",
      "java": "public int[] solve(int[] nums, int d) {\n    if (nums.length == 0) return new int[]{};\n    d %= nums.length;\n    int[] res = new int[nums.length];\n    for (int i = 0; i < nums.length; i++) res[i] = nums[(i + d) % nums.length];\n    return res;\n}",
      "javascript": "function solve(nums, d) {\n    if (!nums.length) return [];\n    d %= nums.length;\n    return [...nums.slice(d), ...nums.slice(0, d)];\n}"
    },
    "boilerplate": {
      "python": "# Solution for Block Swap Algorithm for Array Rotation\ndef solve(nums, d):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Block Swap Algorithm for Array Rotation\n#include <vector>\nusing namespace std;\n\nvector<int> solve(vector<int>& nums, int d) {\n    // Write your solution here\n    return {};\n}",
      "java": "// Solution for Block Swap Algorithm for Array Rotation\nclass Solution {\n    public int[] solve(int[] nums, int d) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
      "javascript": "// Solution for Block Swap Algorithm for Array Rotation\nfunction solve(nums, d) {\n    // Write your solution here\n    return [];\n}"
    },
    "id": 102
  },
  {
    "title": "Juggling Algorithm for Array Rotation",
    "category": "Arrays",
    "difficulty": "Medium",
    "statement": "Rotate array nums by k elements using the juggling algorithm (in O(n) time and O(1) space).",
    "inputFormat": "nums = <array of integers>, k = <integer>",
    "outputFormat": "Array of integers",
    "examples": [
      {
        "input": "nums = [1, 2, 3, 4, 5, 6], k = 2",
        "output": "[3, 4, 5, 6, 1, 2]"
      }
    ],
    "hint1": "Compute gcd(n, k). The array is divided into gcd sets of elements.",
    "hint2": "Shift each set circularly by moving elements one step at a time.",
    "solution": {
      "python": "def solve(nums, k):\n    n = len(nums)\n    if n == 0: return []\n    k %= n\n    return nums[k:] + nums[:k]",
      "cpp": "vector<int> solve(vector<int>& nums, int k) {\n    if (nums.empty()) return {};\n    int n = nums.size();\n    k %= n;\n    vector<int> res(nums.begin() + k, nums.end());\n    res.insert(res.end(), nums.begin(), nums.begin() + k);\n    return res;\n}",
      "java": "public int[] solve(int[] nums, int k) {\n    if (nums.length == 0) return new int[]{};\n    k %= nums.length;\n    int[] res = new int[nums.length];\n    for (int i = 0; i < nums.length; i++) res[i] = nums[(i + k) % nums.length];\n    return res;\n}",
      "javascript": "function solve(nums, k) {\n    if (!nums.length) return [];\n    k %= nums.length;\n    return [...nums.slice(k), ...nums.slice(0, k)];\n}"
    },
    "boilerplate": {
      "python": "# Solution for Juggling Algorithm for Array Rotation\ndef solve(nums, k):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Juggling Algorithm for Array Rotation\n#include <vector>\nusing namespace std;\n\nvector<int> solve(vector<int>& nums, int k) {\n    // Write your solution here\n    return {};\n}",
      "java": "// Solution for Juggling Algorithm for Array Rotation\nclass Solution {\n    public int[] solve(int[] nums, int k) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
      "javascript": "// Solution for Juggling Algorithm for Array Rotation\nfunction solve(nums, k) {\n    // Write your solution here\n    return [];\n}"
    },
    "id": 103
  },
  {
    "title": "Circular Rotation of an Array by K Positions",
    "category": "Arrays",
    "difficulty": "Easy",
    "statement": "Perform a right circular rotation of array nums by k positions.",
    "inputFormat": "nums = <array of integers>, k = <integer>",
    "outputFormat": "Array of integers",
    "examples": [
      {
        "input": "nums = [1, 2, 3, 4, 5], k = 2",
        "output": "[4, 5, 1, 2, 3]"
      }
    ],
    "hint1": "Right rotation shifts elements rightward.",
    "hint2": "Effective index for position i is (i - k) % n.",
    "solution": {
      "python": "def solve(nums, k):\n    if not nums: return []\n    k %= len(nums)\n    return nums[-k:] + nums[:-k] if k else nums",
      "cpp": "vector<int> solve(vector<int>& nums, int k) {\n    if (nums.empty()) return {};\n    int n = nums.size();\n    k %= n;\n    rotate(nums.rbegin(), nums.rbegin() + k, nums.rend());\n    return nums;\n}",
      "java": "public int[] solve(int[] nums, int k) {\n    if (nums.length == 0) return new int[]{};\n    k %= nums.length;\n    int[] res = new int[nums.length];\n    for (int i = 0; i < nums.length; i++) res[(i + k) % nums.length] = nums[i];\n    return res;\n}",
      "javascript": "function solve(nums, k) {\n    if (!nums.length) return [];\n    k %= nums.length;\n    return k ? [...nums.slice(-k), ...nums.slice(0, -k)] : nums;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Circular Rotation of an Array by K Positions\ndef solve(nums, k):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Circular Rotation of an Array by K Positions\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<int> solve(vector<int>& nums, int k) {\n    // Write your solution here\n    return {};\n}",
      "java": "// Solution for Circular Rotation of an Array by K Positions\nclass Solution {\n    public int[] solve(int[] nums, int k) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
      "javascript": "// Solution for Circular Rotation of an Array by K Positions\nfunction solve(nums, k) {\n    // Write your solution here\n    return [];\n}"
    },
    "id": 104
  },
  {
    "title": "Balanced Parenthesis Problem",
    "category": "Arrays",
    "difficulty": "Easy",
    "statement": "Given a string s containing '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    "inputFormat": "s = <string>",
    "outputFormat": "Boolean (true/false)",
    "examples": [
      {
        "input": "s = \"{[()]}\"",
        "output": "true"
      },
      {
        "input": "s = \"{[(])}\"",
        "output": "false"
      }
    ],
    "hint1": "Use a stack to track opening brackets.",
    "hint2": "When a closing bracket appears, check if it matches the stack's top.",
    "solution": {
      "python": "def solve(s):\n    stack = []\n    pairs = {')': '(', '}': '{', ']': '['}\n    for c in s:\n        if c in '({[':\n            stack.append(c)\n        elif c in pairs:\n            if not stack or stack[-1] != pairs[c]: return False\n            stack.pop()\n    return len(stack) == 0",
      "cpp": "bool solve(string s) {\n    stack<char> st;\n    for (char c : s) {\n        if (c == '(' || c == '{' || c == '[') st.push(c);\n        else {\n            if (st.empty()) return false;\n            if (c == ')' && st.top() != '(') return false;\n            if (c == '}' && st.top() != '{') return false;\n            if (c == ']' && st.top() != '[') return false;\n            st.pop();\n        }\n    }\n    return st.empty();\n}",
      "java": "public boolean solve(String s) {\n    Stack<Character> stack = new Stack<>();\n    for (char c : s.toCharArray()) {\n        if (c == '(' || c == '{' || c == '[') stack.push(c);\n        else {\n            if (stack.isEmpty()) return false;\n            char top = stack.pop();\n            if (c == ')' && top != '(') return false;\n            if (c == '}' && top != '{') return false;\n            if (c == ']' && top != '[') return false;\n        }\n    }\n    return stack.isEmpty();\n}",
      "javascript": "function solve(s) {\n    const stack = [];\n    const pairs = { ')': '(', '}': '{', ']': '[' };\n    for (const c of s) {\n        if ('({['.includes(c)) stack.push(c);\n        else if (pairs[c]) {\n            if (!stack.length || stack[stack.length - 1] !== pairs[c]) return false;\n            stack.pop();\n        }\n    }\n    return stack.length === 0;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Balanced Parenthesis Problem\ndef solve(s):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Balanced Parenthesis Problem\n#include <string>\n#include <stack>\nusing namespace std;\n\nbool solve(string s) {\n    // Write your solution here\n    return false;\n}",
      "java": "// Solution for Balanced Parenthesis Problem\nimport java.util.*;\nclass Solution {\n    public boolean solve(String s) {\n        // Write your solution here\n        return false;\n    }\n}",
      "javascript": "// Solution for Balanced Parenthesis Problem\nfunction solve(s) {\n    // Write your solution here\n    return false;\n}"
    },
    "id": 105
  },
  {
    "title": "Check whether a Character is a Vowel or Consonant",
    "category": "Strings",
    "difficulty": "Easy",
    "statement": "Given a character ch, determine whether it is a 'Vowel' or 'Consonant'.",
    "inputFormat": "ch = <string of length 1>",
    "outputFormat": "String ('Vowel' or 'Consonant')",
    "examples": [
      {
        "input": "ch = \"a\"",
        "output": "\"Vowel\""
      },
      {
        "input": "ch = \"z\"",
        "output": "\"Consonant\""
      }
    ],
    "hint1": "Convert the character to lowercase first.",
    "hint2": "Check if it is in {'a', 'e', 'i', 'o', 'u'}.",
    "solution": {
      "python": "def solve(ch):\n    return \"Vowel\" if ch.lower() in \"aeiou\" else \"Consonant\"",
      "cpp": "string solve(char ch) {\n    char c = tolower(ch);\n    if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') return \"Vowel\";\n    return \"Consonant\";\n}",
      "java": "public String solve(char ch) {\n    char c = Character.toLowerCase(ch);\n    if (\"aeiou\".indexOf(c) != -1) return \"Vowel\";\n    return \"Consonant\";\n}",
      "javascript": "function solve(ch) {\n    return \"aeiouAEIOU\".includes(ch) ? \"Vowel\" : \"Consonant\";\n}"
    },
    "boilerplate": {
      "python": "# Solution for Check whether a Character is a Vowel or Consonant\ndef solve(ch):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Check whether a Character is a Vowel or Consonant\n#include <string>\nusing namespace std;\n\nstring solve(char ch) {\n    // Write your solution here\n    return \"\";\n}",
      "java": "// Solution for Check whether a Character is a Vowel or Consonant\nclass Solution {\n    public String solve(char ch) {\n        // Write your solution here\n        return \"\";\n    }\n}",
      "javascript": "// Solution for Check whether a Character is a Vowel or Consonant\nfunction solve(ch) {\n    // Write your solution here\n    return \"\";\n}"
    },
    "id": 106
  },
  {
    "title": "Check whether a Character is an Alphabet or Not",
    "category": "Strings",
    "difficulty": "Easy",
    "statement": "Given a character ch, check whether it is an alphabet (a-z or A-Z).",
    "inputFormat": "ch = <string of length 1>",
    "outputFormat": "Boolean (true/false)",
    "examples": [
      {
        "input": "ch = \"A\"",
        "output": "true"
      },
      {
        "input": "ch = \"9\"",
        "output": "false"
      }
    ],
    "hint1": "Check if the character's ASCII value falls between 'a'-'z' or 'A'-'Z'.",
    "hint2": "Or use built-in isalpha() method.",
    "solution": {
      "python": "def solve(ch):\n    return ch.isalpha()",
      "cpp": "bool solve(char ch) {\n    return isalpha(ch);\n}",
      "java": "public boolean solve(char ch) {\n    return Character.isLetter(ch);\n}",
      "javascript": "function solve(ch) {\n    return /^[a-zA-Z]$/.test(ch);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Check whether a Character is an Alphabet or Not\ndef solve(ch):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Check whether a Character is an Alphabet or Not\n#include <cctype>\nusing namespace std;\n\nbool solve(char ch) {\n    // Write your solution here\n    return false;\n}",
      "java": "// Solution for Check whether a Character is an Alphabet or Not\nclass Solution {\n    public boolean solve(char ch) {\n        // Write your solution here\n        return false;\n    }\n}",
      "javascript": "// Solution for Check whether a Character is an Alphabet or Not\nfunction solve(ch) {\n    // Write your solution here\n    return false;\n}"
    },
    "id": 107
  },
  {
    "title": "Find the ASCII Value of a Character",
    "category": "Strings",
    "difficulty": "Easy",
    "statement": "Given a character ch, find its ASCII value.",
    "inputFormat": "ch = <string of length 1>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "ch = \"A\"",
        "output": "65"
      },
      {
        "input": "ch = \"a\"",
        "output": "97"
      }
    ],
    "hint1": "In Python use ord(), in C++/Java cast to int, in JS use charCodeAt(0).",
    "hint2": "Every character has an integer representation in the ASCII chart.",
    "solution": {
      "python": "def solve(ch):\n    return ord(ch)",
      "cpp": "int solve(char ch) {\n    return (int)ch;\n}",
      "java": "public int solve(char ch) {\n    return (int)ch;\n}",
      "javascript": "function solve(ch) {\n    return ch.charCodeAt(0);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Find the ASCII Value of a Character\ndef solve(ch):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Find the ASCII Value of a Character\n#include <iostream>\nusing namespace std;\n\nint solve(char ch) {\n    // Write your solution here\n    return 0;\n}",
      "java": "// Solution for Find the ASCII Value of a Character\nclass Solution {\n    public int solve(char ch) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "javascript": "// Solution for Find the ASCII Value of a Character\nfunction solve(ch) {\n    // Write your solution here\n    return 0;\n}"
    },
    "id": 108
  },
  {
    "title": "Length of String Without Using strlen",
    "category": "Strings",
    "difficulty": "Easy",
    "statement": "Find the length of a string s without using built-in length functions.",
    "inputFormat": "s = <string>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "s = \"Hello World\"",
        "output": "11"
      },
      {
        "input": "s = \"\"",
        "output": "0"
      }
    ],
    "hint1": "Loop over characters one by one with a counter.",
    "hint2": "Increment the counter until the end of string is reached.",
    "solution": {
      "python": "def solve(s):\n    count = 0\n    for _ in s: count += 1\n    return count",
      "cpp": "int solve(string s) {\n    int count = 0;\n    for (char c : s) count++;\n    return count;\n}",
      "java": "public int solve(String s) {\n    int count = 0;\n    for (char c : s.toCharArray()) count++;\n    return count;\n}",
      "javascript": "function solve(s) {\n    let count = 0;\n    for (let c of s) count++;\n    return count;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Length of String Without Using strlen\ndef solve(s):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Length of String Without Using strlen\n#include <string>\nusing namespace std;\n\nint solve(string s) {\n    // Write your solution here\n    return 0;\n}",
      "java": "// Solution for Length of String Without Using strlen\nclass Solution {\n    public int solve(String s) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "javascript": "// Solution for Length of String Without Using strlen\nfunction solve(s) {\n    // Write your solution here\n    return 0;\n}"
    },
    "id": 109
  },
  {
    "title": "Toggle Each Character in a String",
    "category": "Strings",
    "difficulty": "Easy",
    "statement": "Given a string s, toggle the case of each character (lowercase becomes uppercase and vice versa).",
    "inputFormat": "s = <string>",
    "outputFormat": "String",
    "examples": [
      {
        "input": "s = \"Hello World\"",
        "output": "\"hELLO wORLD\""
      },
      {
        "input": "s = \"PrepInsta\"",
        "output": "\"pREPiNSTA\""
      }
    ],
    "hint1": "Check each character: if uppercase, convert to lowercase; if lowercase, convert to uppercase.",
    "hint2": "In Python, s.swapcase() does this directly.",
    "solution": {
      "python": "def solve(s):\n    return s.swapcase()",
      "cpp": "string solve(string s) {\n    for (char& c : s) {\n        if (isupper(c)) c = tolower(c);\n        else if (islower(c)) c = toupper(c);\n    }\n    return s;\n}",
      "java": "public String solve(String s) {\n    StringBuilder sb = new StringBuilder();\n    for (char c : s.toCharArray()) {\n        if (Character.isUpperCase(c)) sb.append(Character.toLowerCase(c));\n        else if (Character.isLowerCase(c)) sb.append(Character.toUpperCase(c));\n        else sb.append(c);\n    }\n    return sb.toString();\n}",
      "javascript": "function solve(s) {\n    return s.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');\n}"
    },
    "boilerplate": {
      "python": "# Solution for Toggle Each Character in a String\ndef solve(s):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Toggle Each Character in a String\n#include <string>\nusing namespace std;\n\nstring solve(string s) {\n    // Write your solution here\n    return \"\";\n}",
      "java": "// Solution for Toggle Each Character in a String\nclass Solution {\n    public String solve(String s) {\n        // Write your solution here\n        return \"\";\n    }\n}",
      "javascript": "// Solution for Toggle Each Character in a String\nfunction solve(s) {\n    // Write your solution here\n    return \"\";\n}"
    },
    "id": 110
  },
  {
    "title": "Count the Number of Vowels in a String",
    "category": "Strings",
    "difficulty": "Easy",
    "statement": "Given a string s, count the total number of vowels present in it.",
    "inputFormat": "s = <string>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "s = \"prepinsta\"",
        "output": "3"
      },
      {
        "input": "s = \"rhythm\"",
        "output": "0"
      }
    ],
    "hint1": "Iterate through the string and check if each character is in 'aeiouAEIOU'.",
    "hint2": "Sum the matching occurrences.",
    "solution": {
      "python": "def solve(s):\n    return sum(1 for c in s.lower() if c in 'aeiou')",
      "cpp": "int solve(string s) {\n    int count = 0;\n    for (char c : s) {\n        char l = tolower(c);\n        if (l == 'a' || l == 'e' || l == 'i' || l == 'o' || l == 'u') count++;\n    }\n    return count;\n}",
      "java": "public int solve(String s) {\n    int count = 0;\n    for (char c : s.toLowerCase().toCharArray()) {\n        if (\"aeiou\".indexOf(c) != -1) count++;\n    }\n    return count;\n}",
      "javascript": "function solve(s) {\n    return (s.match(/[aeiou]/gi) || []).length;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Count the Number of Vowels in a String\ndef solve(s):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Count the Number of Vowels in a String\n#include <string>\nusing namespace std;\n\nint solve(string s) {\n    // Write your solution here\n    return 0;\n}",
      "java": "// Solution for Count the Number of Vowels in a String\nclass Solution {\n    public int solve(String s) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "javascript": "// Solution for Count the Number of Vowels in a String\nfunction solve(s) {\n    // Write your solution here\n    return 0;\n}"
    },
    "id": 111
  },
  {
    "title": "Remove Vowels from a String",
    "category": "Strings",
    "difficulty": "Easy",
    "statement": "Given a string s, remove all vowels (both lowercase and uppercase) from the string.",
    "inputFormat": "s = <string>",
    "outputFormat": "String",
    "examples": [
      {
        "input": "s = \"prepinsta\"",
        "output": "\"prpnst\""
      },
      {
        "input": "s = \"apple\"",
        "output": "\"ppl\""
      }
    ],
    "hint1": "Filter out all characters that belong to the set {'a', 'e', 'i', 'o', 'u'}.",
    "hint2": "Join the remaining characters.",
    "solution": {
      "python": "def solve(s):\n    return ''.join(c for c in s if c.lower() not in 'aeiou')",
      "cpp": "string solve(string s) {\n    string res = \"\";\n    for (char c : s) {\n        char l = tolower(c);\n        if (l != 'a' && l != 'e' && l != 'i' && l != 'o' && l != 'u') res += c;\n    }\n    return res;\n}",
      "java": "public String solve(String s) {\n    return s.replaceAll(\"(?i)[aeiou]\", \"\");\n}",
      "javascript": "function solve(s) {\n    return s.replace(/[aeiou]/gi, '');\n}"
    },
    "boilerplate": {
      "python": "# Solution for Remove Vowels from a String\ndef solve(s):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Remove Vowels from a String\n#include <string>\nusing namespace std;\n\nstring solve(string s) {\n    // Write your solution here\n    return \"\";\n}",
      "java": "// Solution for Remove Vowels from a String\nclass Solution {\n    public String solve(String s) {\n        // Write your solution here\n        return \"\";\n    }\n}",
      "javascript": "// Solution for Remove Vowels from a String\nfunction solve(s) {\n    // Write your solution here\n    return \"\";\n}"
    },
    "id": 112
  },
  {
    "title": "Check if String is Palindrome",
    "category": "Strings",
    "difficulty": "Easy",
    "statement": "Given a string s, check if it reads the same forward and backward.",
    "inputFormat": "s = <string>",
    "outputFormat": "Boolean (true/false)",
    "examples": [
      {
        "input": "s = \"racecar\"",
        "output": "true"
      },
      {
        "input": "s = \"hello\"",
        "output": "false"
      }
    ],
    "hint1": "Compare the string with its reversed version.",
    "hint2": "Or use two pointers starting at ends moving towards center.",
    "solution": {
      "python": "def solve(s):\n    return s == s[::-1]",
      "cpp": "bool solve(string s) {\n    int l = 0, r = (int)s.size() - 1;\n    while (l < r) if (s[l++] != s[r--]) return false;\n    return true;\n}",
      "java": "public boolean solve(String s) {\n    return s.equals(new StringBuilder(s).reverse().toString());\n}",
      "javascript": "function solve(s) {\n    return s === s.split('').reverse().join('');\n}"
    },
    "boilerplate": {
      "python": "# Solution for Check if String is Palindrome\ndef solve(s):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Check if String is Palindrome\n#include <string>\nusing namespace std;\n\nbool solve(string s) {\n    // Write your solution here\n    return false;\n}",
      "java": "// Solution for Check if String is Palindrome\nclass Solution {\n    public boolean solve(String s) {\n        // Write your solution here\n        return false;\n    }\n}",
      "javascript": "// Solution for Check if String is Palindrome\nfunction solve(s) {\n    // Write your solution here\n    return false;\n}"
    },
    "id": 113
  },
  {
    "title": "Reverse a String",
    "category": "Strings",
    "difficulty": "Easy",
    "statement": "Given a string s, return the string in reverse order.",
    "inputFormat": "s = <string>",
    "outputFormat": "String",
    "examples": [
      {
        "input": "s = \"PrepInsta\"",
        "output": "\"atsnIperP\""
      },
      {
        "input": "s = \"12345\"",
        "output": "\"54321\""
      }
    ],
    "hint1": "Slice backwards in Python (s[::-1]) or reverse characters in an array.",
    "hint2": "Return the reversed string.",
    "solution": {
      "python": "def solve(s):\n    return s[::-1]",
      "cpp": "string solve(string s) {\n    reverse(s.begin(), s.end());\n    return s;\n}",
      "java": "public String solve(String s) {\n    return new StringBuilder(s).reverse().toString();\n}",
      "javascript": "function solve(s) {\n    return s.split('').reverse().join('');\n}"
    },
    "boilerplate": {
      "python": "# Solution for Reverse a String\ndef solve(s):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Reverse a String\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nstring solve(string s) {\n    // Write your solution here\n    return \"\";\n}",
      "java": "// Solution for Reverse a String\nclass Solution {\n    public String solve(String s) {\n        // Write your solution here\n        return \"\";\n    }\n}",
      "javascript": "// Solution for Reverse a String\nfunction solve(s) {\n    // Write your solution here\n    return \"\";\n}"
    },
    "id": 114
  },
  {
    "title": "Remove All Characters Except Alphabets",
    "category": "Strings",
    "difficulty": "Easy",
    "statement": "Given a string s, remove all non-alphabetic characters (digits, symbols, spaces).",
    "inputFormat": "s = <string>",
    "outputFormat": "String",
    "examples": [
      {
        "input": "s = \"take12% *&u ^$#forward\"",
        "output": "\"takeuforward\""
      },
      {
        "input": "s = \"1a2b3c!\"",
        "output": "\"abc\""
      }
    ],
    "hint1": "Filter for characters where isalpha() is true.",
    "hint2": "Or use regex to remove [^a-zA-Z].",
    "solution": {
      "python": "def solve(s):\n    return ''.join(c for c in s if c.isalpha())",
      "cpp": "string solve(string s) {\n    string res = \"\";\n    for (char c : s) if (isalpha(c)) res += c;\n    return res;\n}",
      "java": "public String solve(String s) {\n    return s.replaceAll(\"[^a-zA-Z]\", \"\");\n}",
      "javascript": "function solve(s) {\n    return s.replace(/[^a-zA-Z]/g, '');\n}"
    },
    "boilerplate": {
      "python": "# Solution for Remove All Characters Except Alphabets\ndef solve(s):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Remove All Characters Except Alphabets\n#include <string>\nusing namespace std;\n\nstring solve(string s) {\n    // Write your solution here\n    return \"\";\n}",
      "java": "// Solution for Remove All Characters Except Alphabets\nclass Solution {\n    public String solve(String s) {\n        // Write your solution here\n        return \"\";\n    }\n}",
      "javascript": "// Solution for Remove All Characters Except Alphabets\nfunction solve(s) {\n    // Write your solution here\n    return \"\";\n}"
    },
    "id": 115
  },
  {
    "title": "Remove Spaces from a String",
    "category": "Strings",
    "difficulty": "Easy",
    "statement": "Given a string s, remove all whitespace characters from it.",
    "inputFormat": "s = <string>",
    "outputFormat": "String",
    "examples": [
      {
        "input": "s = \"P r e p I n s t a\"",
        "output": "\"PrepInsta\""
      },
      {
        "input": "s = \"  hello  world \"",
        "output": "\"helloworld\""
      }
    ],
    "hint1": "Filter out space characters (' ').",
    "hint2": "Or use replace(' ', '').",
    "solution": {
      "python": "def solve(s):\n    return s.replace(' ', '')",
      "cpp": "string solve(string s) {\n    string res = \"\";\n    for (char c : s) if (c != ' ') res += c;\n    return res;\n}",
      "java": "public String solve(String s) {\n    return s.replace(\" \", \"\");\n}",
      "javascript": "function solve(s) {\n    return s.replace(/\\s+/g, '');\n}"
    },
    "boilerplate": {
      "python": "# Solution for Remove Spaces from a String\ndef solve(s):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Remove Spaces from a String\n#include <string>\nusing namespace std;\n\nstring solve(string s) {\n    // Write your solution here\n    return \"\";\n}",
      "java": "// Solution for Remove Spaces from a String\nclass Solution {\n    public String solve(String s) {\n        // Write your solution here\n        return \"\";\n    }\n}",
      "javascript": "// Solution for Remove Spaces from a String\nfunction solve(s) {\n    // Write your solution here\n    return \"\";\n}"
    },
    "id": 116
  },
  {
    "title": "Remove Brackets from an Algebraic Expression",
    "category": "Strings",
    "difficulty": "Easy",
    "statement": "Given an algebraic expression s, remove all brackets '(', ')', '{', '}', '[', ']'.",
    "inputFormat": "s = <string>",
    "outputFormat": "String",
    "examples": [
      {
        "input": "s = \"(a-[b+c]*d)\"",
        "output": "\"a-b+c*d\""
      },
      {
        "input": "s = \"(a+b)=c\"",
        "output": "\"a+b=c\""
      }
    ],
    "hint1": "Filter out characters that are brackets.",
    "hint2": "Brackets set: {'(', ')', '{', '}', '[', ']'}.",
    "solution": {
      "python": "def solve(s):\n    return ''.join(c for c in s if c not in '(){}[]')",
      "cpp": "string solve(string s) {\n    string res = \"\";\n    for (char c : s) if (c != '(' && c != ')' && c != '{' && c != '}' && c != '[' && c != ']') res += c;\n    return res;\n}",
      "java": "public String solve(String s) {\n    return s.replaceAll(\"[(){}\\\\[\\\\]]\", \"\");\n}",
      "javascript": "function solve(s) {\n    return s.replace(/[(){}\\[\\]]/g, '');\n}"
    },
    "boilerplate": {
      "python": "# Solution for Remove Brackets from an Algebraic Expression\ndef solve(s):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Remove Brackets from an Algebraic Expression\n#include <string>\nusing namespace std;\n\nstring solve(string s) {\n    // Write your solution here\n    return \"\";\n}",
      "java": "// Solution for Remove Brackets from an Algebraic Expression\nclass Solution {\n    public String solve(String s) {\n        // Write your solution here\n        return \"\";\n    }\n}",
      "javascript": "// Solution for Remove Brackets from an Algebraic Expression\nfunction solve(s) {\n    // Write your solution here\n    return \"\";\n}"
    },
    "id": 117
  },
  {
    "title": "Sum of Numbers in a String",
    "category": "Strings",
    "difficulty": "Easy",
    "statement": "Given a string s, find the sum of all contiguous numbers found in the string.",
    "inputFormat": "s = <string>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "s = \"12abc20yz68\"",
        "output": "100",
        "explanation": "12 + 20 + 68 = 100"
      },
      {
        "input": "s = \"a1b2c3\"",
        "output": "6"
      }
    ],
    "hint1": "Parse consecutive sequences of digits into integers.",
    "hint2": "Sum all identified integers.",
    "solution": {
      "python": "def solve(s):\n    import re\n    return sum(int(x) for x in re.findall(r'\\d+', s))",
      "cpp": "int solve(string s) {\n    int sum = 0, curr = 0;\n    for (char c : s) {\n        if (isdigit(c)) curr = curr * 10 + (c - '0');\n        else { sum += curr; curr = 0; }\n    }\n    return sum + curr;\n}",
      "java": "public int solve(String s) {\n    int sum = 0, curr = 0;\n    for (char c : s.toCharArray()) {\n        if (Character.isDigit(c)) curr = curr * 10 + (c - '0');\n        else { sum += curr; curr = 0; }\n    }\n    return sum + curr;\n}",
      "javascript": "function solve(s) {\n    const nums = s.match(/\\d+/g);\n    return nums ? nums.reduce((a, b) => a + parseInt(b), 0) : 0;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Sum of Numbers in a String\ndef solve(s):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Sum of Numbers in a String\n#include <string>\n#include <cctype>\nusing namespace std;\n\nint solve(string s) {\n    // Write your solution here\n    return 0;\n}",
      "java": "// Solution for Sum of Numbers in a String\nclass Solution {\n    public int solve(String s) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "javascript": "// Solution for Sum of Numbers in a String\nfunction solve(s) {\n    // Write your solution here\n    return 0;\n}"
    },
    "id": 118
  },
  {
    "title": "Capitalize First and Last Character of Each Word",
    "category": "Strings",
    "difficulty": "Easy",
    "statement": "Given a sentence s, capitalize the first and last character of each word in the string.",
    "inputFormat": "s = <string>",
    "outputFormat": "String",
    "examples": [
      {
        "input": "s = \"prep insta is best\"",
        "output": "\"PreP InstA IS BesT\""
      }
    ],
    "hint1": "Split the string into words by space.",
    "hint2": "For each word, uppercase word[0] and word[-1], then rejoin.",
    "solution": {
      "python": "def solve(s):\n    words = s.split(' ')\n    res = []\n    for w in words:\n        if len(w) == 1:\n            res.append(w.upper())\n        elif len(w) > 1:\n            res.append(w[0].upper() + w[1:-1] + w[-1].upper())\n        else:\n            res.append('')\n    return ' '.join(res)",
      "cpp": "string solve(string s) {\n    int n = s.size();\n    for (int i = 0; i < n; ++i) {\n        if (i == 0 || s[i - 1] == ' ') s[i] = toupper(s[i]);\n        if (i == n - 1 || s[i + 1] == ' ') s[i] = toupper(s[i]);\n    }\n    return s;\n}",
      "java": "public String solve(String s) {\n    char[] arr = s.toCharArray();\n    int n = arr.length;\n    for (int i = 0; i < n; i++) {\n        if (i == 0 || arr[i - 1] == ' ') arr[i] = Character.toUpperCase(arr[i]);\n        if (i == n - 1 || arr[i + 1] == ' ') arr[i] = Character.toUpperCase(arr[i]);\n    }\n    return new String(arr);\n}",
      "javascript": "function solve(s) {\n    return s.split(' ').map(w => {\n        if (w.length <= 1) return w.toUpperCase();\n        return w[0].toUpperCase() + w.slice(1, -1) + w[w.length - 1].toUpperCase();\n    }).join(' ');\n}"
    },
    "boilerplate": {
      "python": "# Solution for Capitalize First and Last Character of Each Word\ndef solve(s):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Capitalize First and Last Character of Each Word\n#include <string>\n#include <cctype>\nusing namespace std;\n\nstring solve(string s) {\n    // Write your solution here\n    return \"\";\n}",
      "java": "// Solution for Capitalize First and Last Character of Each Word\nclass Solution {\n    public String solve(String s) {\n        // Write your solution here\n        return \"\";\n    }\n}",
      "javascript": "// Solution for Capitalize First and Last Character of Each Word\nfunction solve(s) {\n    // Write your solution here\n    return \"\";\n}"
    },
    "id": 119
  },
  {
    "title": "Calculate Frequency of Characters in a String",
    "category": "Strings",
    "difficulty": "Easy",
    "statement": "Count the frequency of each character in string s. Return an array of [char, count] pairs in order of first appearance.",
    "inputFormat": "s = <string>",
    "outputFormat": "Array of [string, integer] pairs",
    "examples": [
      {
        "input": "s = \"takeuforward\"",
        "output": "[[\"t\", 1], [\"a\", 2], [\"k\", 1], [\"e\", 1], [\"u\", 1], [\"f\", 1], [\"o\", 1], [\"r\", 2], [\"w\", 1], [\"d\", 1]]"
      }
    ],
    "hint1": "Iterate through the string, maintaining count and tracking insertion order.",
    "hint2": "Use OrderedDict / Map.",
    "solution": {
      "python": "def solve(s):\n    from collections import OrderedDict\n    d = OrderedDict()\n    for c in s:\n        d[c] = d.get(c, 0) + 1\n    return [[k, v] for k, v in d.items()]",
      "cpp": "vector<pair<string, int>> solve(string s) {\n    vector<pair<string, int>> res;\n    unordered_map<char, int> mp;\n    vector<char> order;\n    for (char c : s) {\n        if (mp[c] == 0) order.push_back(c);\n        mp[c]++;\n    }\n    for (char c : order) res.push_back({string(1, c), mp[c]});\n    return res;\n}",
      "java": "public List<List<Object>> solve(String s) {\n    Map<Character, Integer> map = new LinkedHashMap<>();\n    for (char c : s.toCharArray()) map.put(c, map.getOrDefault(c, 0) + 1);\n    List<List<Object>> res = new ArrayList<>();\n    for (var e : map.entrySet()) res.add(Arrays.asList(String.valueOf(e.getKey()), e.getValue()));\n    return res;\n}",
      "javascript": "function solve(s) {\n    const map = new Map();\n    for (const c of s) map.set(c, (map.get(c) || 0) + 1);\n    return Array.from(map.entries());\n}"
    },
    "boilerplate": {
      "python": "# Solution for Calculate Frequency of Characters in a String\ndef solve(s):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Calculate Frequency of Characters in a String\n#include <string>\n#include <vector>\nusing namespace std;\n\n// Write your solution here",
      "java": "// Solution for Calculate Frequency of Characters in a String\nimport java.util.*;\nclass Solution {\n    // Write your solution here\n}",
      "javascript": "// Solution for Calculate Frequency of Characters in a String\nfunction solve(s) {\n    // Write your solution here\n    return [];\n}"
    },
    "id": 120
  },
  {
    "title": "Find Non-Repeating Characters in a String",
    "category": "Strings",
    "difficulty": "Easy",
    "statement": "Find all non-repeating (frequency == 1) characters in string s in order of appearance.",
    "inputFormat": "s = <string>",
    "outputFormat": "Array of characters",
    "examples": [
      {
        "input": "s = \"google\"",
        "output": "[\"l\", \"e\"]"
      },
      {
        "input": "s = \"prepinsta\"",
        "output": "[\"e\", \"i\", \"n\", \"s\", \"t\", \"a\"]"
      }
    ],
    "hint1": "Count frequency of each character.",
    "hint2": "Filter characters with count == 1 preserving order.",
    "solution": {
      "python": "def solve(s):\n    from collections import Counter\n    c = Counter(s)\n    return [ch for ch in s if c[ch] == 1]",
      "cpp": "vector<char> solve(string s) {\n    unordered_map<char, int> mp;\n    for (char c : s) mp[c]++;\n    vector<char> res;\n    for (char c : s) if (mp[c] == 1) res.push_back(c);\n    return res;\n}",
      "java": "public List<Character> solve(String s) {\n    Map<Character, Integer> map = new HashMap<>();\n    for (char c : s.toCharArray()) map.put(c, map.getOrDefault(c, 0) + 1);\n    List<Character> res = new ArrayList<>();\n    for (char c : s.toCharArray()) if (map.get(c) == 1) res.add(c);\n    return res;\n}",
      "javascript": "function solve(s) {\n    const map = {};\n    for (const c of s) map[c] = (map[c] || 0) + 1;\n    return s.split('').filter(c => map[c] === 1);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Find Non-Repeating Characters in a String\ndef solve(s):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Find Non-Repeating Characters in a String\n#include <string>\n#include <vector>\nusing namespace std;\n\nvector<char> solve(string s) {\n    // Write your solution here\n    return {};\n}",
      "java": "// Solution for Find Non-Repeating Characters in a String\nimport java.util.*;\nclass Solution {\n    public List<Character> solve(String s) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
      "javascript": "// Solution for Find Non-Repeating Characters in a String\nfunction solve(s) {\n    // Write your solution here\n    return [];\n}"
    },
    "id": 121
  },
  {
    "title": "Check if Two Strings are Anagrams",
    "category": "Strings",
    "difficulty": "Easy",
    "statement": "Given two strings s1 and s2, check if they are anagrams of each other.",
    "inputFormat": "s1 = <string>, s2 = <string>",
    "outputFormat": "Boolean (true/false)",
    "examples": [
      {
        "input": "s1 = \"listen\", s2 = \"silent\"",
        "output": "true"
      },
      {
        "input": "s1 = \"hello\", s2 = \"world\"",
        "output": "false"
      }
    ],
    "hint1": "Two strings are anagrams if sorting their characters yields the same result.",
    "hint2": "Or check if character frequency maps are identical.",
    "solution": {
      "python": "def solve(s1, s2):\n    return sorted(s1) == sorted(s2)",
      "cpp": "bool solve(string s1, string s2) {\n    sort(s1.begin(), s1.end());\n    sort(s2.begin(), s2.end());\n    return s1 == s2;\n}",
      "java": "public boolean solve(String s1, String s2) {\n    char[] a = s1.toCharArray(), b = s2.toCharArray();\n    Arrays.sort(a); Arrays.sort(b);\n    return Arrays.equals(a, b);\n}",
      "javascript": "function solve(s1, s2) {\n    return s1.split('').sort().join('') === s2.split('').sort().join('');\n}"
    },
    "boilerplate": {
      "python": "# Solution for Check if Two Strings are Anagrams\ndef solve(s1, s2):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Check if Two Strings are Anagrams\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nbool solve(string s1, string s2) {\n    // Write your solution here\n    return false;\n}",
      "java": "// Solution for Check if Two Strings are Anagrams\nimport java.util.*;\nclass Solution {\n    public boolean solve(String s1, String s2) {\n        // Write your solution here\n        return false;\n    }\n}",
      "javascript": "// Solution for Check if Two Strings are Anagrams\nfunction solve(s1, s2) {\n    // Write your solution here\n    return false;\n}"
    },
    "id": 122
  },
  {
    "title": "Replace Substring in a String",
    "category": "Strings",
    "difficulty": "Easy",
    "statement": "Given string s, old_sub and new_sub, replace all occurrences of old_sub with new_sub.",
    "inputFormat": "s = <string>, old_sub = <string>, new_sub = <string>",
    "outputFormat": "String",
    "examples": [
      {
        "input": "s = \"hello world\", old_sub = \"world\", new_sub = \"there\"",
        "output": "\"hello there\""
      }
    ],
    "hint1": "Use built-in string replace method.",
    "hint2": "Ensure all occurrences are replaced.",
    "solution": {
      "python": "def solve(s, old_sub, new_sub):\n    return s.replace(old_sub, new_sub)",
      "cpp": "string solve(string s, string old_sub, string new_sub) {\n    size_t pos = 0;\n    while ((pos = s.find(old_sub, pos)) != string::npos) {\n        s.replace(pos, old_sub.length(), new_sub);\n        pos += new_sub.length();\n    }\n    return s;\n}",
      "java": "public String solve(String s, String oldSub, String newSub) {\n    return s.replace(oldSub, newSub);\n}",
      "javascript": "function solve(s, old_sub, new_sub) {\n    return s.split(old_sub).join(new_sub);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Replace Substring in a String\ndef solve(s, old_sub, new_sub):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Replace Substring in a String\n#include <string>\nusing namespace std;\n\nstring solve(string s, string old_sub, string new_sub) {\n    // Write your solution here\n    return \"\";\n}",
      "java": "// Solution for Replace Substring in a String\nclass Solution {\n    public String solve(String s, String oldSub, String newSub) {\n        // Write your solution here\n        return \"\";\n    }\n}",
      "javascript": "// Solution for Replace Substring in a String\nfunction solve(s, old_sub, new_sub) {\n    // Write your solution here\n    return \"\";\n}"
    },
    "id": 123
  },
  {
    "title": "Replacing Word with Another Word in a String",
    "category": "Strings",
    "difficulty": "Easy",
    "statement": "Given a sentence s, replace exact whole word old_w with new_w.",
    "inputFormat": "s = <string>, old_w = <string>, new_w = <string>",
    "outputFormat": "String",
    "examples": [
      {
        "input": "s = \"apple banana apple\", old_w = \"apple\", new_w = \"orange\"",
        "output": "\"orange banana orange\""
      }
    ],
    "hint1": "Split the sentence by spaces into individual words.",
    "hint2": "Replace matching whole words and join back with spaces.",
    "solution": {
      "python": "def solve(s, old_w, new_w):\n    words = s.split(' ')\n    return ' '.join(new_w if w == old_w else w for w in words)",
      "cpp": "string solve(string s, string old_w, string new_w) {\n    stringstream ss(s);\n    string word, res = \"\";\n    while (ss >> word) {\n        if (!res.empty()) res += \" \";\n        res += (word == old_w ? new_w : word);\n    }\n    return res;\n}",
      "java": "public String solve(String s, String oldW, String newW) {\n    String[] words = s.split(\" \");\n    for (int i = 0; i < words.length; i++) if (words[i].equals(oldW)) words[i] = newW;\n    return String.join(\" \", words);\n}",
      "javascript": "function solve(s, old_w, new_w) {\n    return s.split(' ').map(w => w === old_w ? new_w : w).join(' ');\n}"
    },
    "boilerplate": {
      "python": "# Solution for Replacing Word with Another Word in a String\ndef solve(s, old_w, new_w):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Replacing Word with Another Word in a String\n#include <string>\nusing namespace std;\n\nstring solve(string s, string old_w, string new_w) {\n    // Write your solution here\n    return \"\";\n}",
      "java": "// Solution for Replacing Word with Another Word in a String\nclass Solution {\n    public String solve(String s, String oldW, String newW) {\n        // Write your solution here\n        return \"\";\n    }\n}",
      "javascript": "// Solution for Replacing Word with Another Word in a String\nfunction solve(s, old_w, new_w) {\n    // Write your solution here\n    return \"\";\n}"
    },
    "id": 124
  },
  {
    "title": "Count Common Subsequences in Two Strings",
    "category": "Strings",
    "difficulty": "Medium",
    "statement": "Count all matching non-empty common subsequences of two strings s1 and s2.",
    "inputFormat": "s1 = <string>, s2 = <string>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "s1 = \"ajblqcpks\", s2 = \"apple\"",
        "output": "3"
      }
    ],
    "hint1": "Use 2D dynamic programming.",
    "hint2": "dp[i][j] represents common subsequences of prefixes s1[:i] and s2[:j].",
    "solution": {
      "python": "def solve(s1, s2):\n    n, m = len(s1), len(s2)\n    dp = [[0] * (m + 1) for _ in range(n + 1)]\n    for i in range(1, n + 1):\n        for j in range(1, m + 1):\n            if s1[i-1] == s2[j-1]:\n                dp[i][j] = 1 + dp[i-1][j] + dp[i][j-1]\n            else:\n                dp[i][j] = dp[i-1][j] + dp[i][j-1] - dp[i-1][j-1]\n    return dp[n][m]",
      "cpp": "int solve(string s1, string s2) {\n    int n = s1.size(), m = s2.size();\n    vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));\n    for (int i = 1; i <= n; ++i) {\n        for (int j = 1; j <= m; ++j) {\n            if (s1[i-1] == s2[j-1]) dp[i][j] = 1 + dp[i-1][j] + dp[i][j-1];\n            else dp[i][j] = dp[i-1][j] + dp[i][j-1] - dp[i-1][j-1];\n        }\n    }\n    return dp[n][m];\n}",
      "java": "public int solve(String s1, String s2) {\n    int n = s1.length(), m = s2.length();\n    int[][] dp = new int[n + 1][m + 1];\n    for (int i = 1; i <= n; i++) {\n        for (int j = 1; j <= m; j++) {\n            if (s1.charAt(i - 1) == s2.charAt(j - 1)) dp[i][j] = 1 + dp[i - 1][j] + dp[i][j - 1];\n            else dp[i][j] = dp[i - 1][j] + dp[i][j - 1] - dp[i - 1][j - 1];\n        }\n    }\n    return dp[n][m];\n}",
      "javascript": "function solve(s1, s2) {\n    const n = s1.length, m = s2.length;\n    const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));\n    for (let i = 1; i <= n; i++) {\n        for (let j = 1; j <= m; j++) {\n            if (s1[i - 1] === s2[j - 1]) dp[i][j] = 1 + dp[i - 1][j] + dp[i][j - 1];\n            else dp[i][j] = dp[i - 1][j] + dp[i][j - 1] - dp[i - 1][j - 1];\n        }\n    }\n    return dp[n][m];\n}"
    },
    "boilerplate": {
      "python": "# Solution for Count Common Subsequences in Two Strings\ndef solve(s1, s2):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Count Common Subsequences in Two Strings\n#include <string>\n#include <vector>\nusing namespace std;\n\nint solve(string s1, string s2) {\n    // Write your solution here\n    return 0;\n}",
      "java": "// Solution for Count Common Subsequences in Two Strings\nclass Solution {\n    public int solve(String s1, String s2) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "javascript": "// Solution for Count Common Subsequences in Two Strings\nfunction solve(s1, s2) {\n    // Write your solution here\n    return 0;\n}"
    },
    "id": 125
  },
  {
    "title": "Wildcard Matching",
    "category": "Strings",
    "difficulty": "Hard",
    "statement": "Check if string s matches pattern p containing wildcards '?' (matches any single character) and '*' (matches any sequence).",
    "inputFormat": "s = <string>, p = <string>",
    "outputFormat": "Boolean (true/false)",
    "examples": [
      {
        "input": "s = \"aa\", p = \"*\"",
        "output": "true"
      },
      {
        "input": "s = \"cb\", p = \"?a\"",
        "output": "false"
      }
    ],
    "hint1": "Use 2D dynamic programming dp[i][j] = matches s[:i] with p[:j].",
    "hint2": "When p[j-1] == '*', dp[i][j] = dp[i-1][j] (match 1+) or dp[i][j-1] (match 0).",
    "solution": {
      "python": "def solve(s, p):\n    n, m = len(s), len(p)\n    dp = [[False] * (m + 1) for _ in range(n + 1)]\n    dp[0][0] = True\n    for j in range(1, m + 1):\n        if p[j-1] == '*': dp[0][j] = dp[0][j-1]\n    for i in range(1, n + 1):\n        for j in range(1, m + 1):\n            if p[j-1] == '*':\n                dp[i][j] = dp[i-1][j] or dp[i][j-1]\n            elif p[j-1] == '?' or s[i-1] == p[j-1]:\n                dp[i][j] = dp[i-1][j-1]\n    return dp[n][m]",
      "cpp": "bool solve(string s, string p) {\n    int n = s.size(), m = p.size();\n    vector<vector<bool>> dp(n + 1, vector<bool>(m + 1, false));\n    dp[0][0] = true;\n    for (int j = 1; j <= m; ++j) if (p[j-1] == '*') dp[0][j] = dp[0][j-1];\n    for (int i = 1; i <= n; ++i) {\n        for (int j = 1; j <= m; ++j) {\n            if (p[j-1] == '*') dp[i][j] = dp[i-1][j] || dp[i][j-1];\n            else if (p[j-1] == '?' || s[i-1] == p[j-1]) dp[i][j] = dp[i-1][j-1];\n        }\n    }\n    return dp[n][m];\n}",
      "java": "public boolean solve(String s, String p) {\n    int n = s.length(), m = p.length();\n    boolean[][] dp = new boolean[n + 1][m + 1];\n    dp[0][0] = true;\n    for (int j = 1; j <= m; j++) if (p.charAt(j - 1) == '*') dp[0][j] = dp[0][j - 1];\n    for (int i = 1; i <= n; i++) {\n        for (int j = 1; j <= m; j++) {\n            if (p.charAt(j - 1) == '*') dp[i][j] = dp[i - 1][j] || dp[i][j - 1];\n            else if (p.charAt(j - 1) == '?' || s.charAt(i - 1) == p.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1];\n        }\n    }\n    return dp[n][m];\n}",
      "javascript": "function solve(s, p) {\n    const n = s.length, m = p.length;\n    const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(false));\n    dp[0][0] = true;\n    for (let j = 1; j <= m; j++) if (p[j - 1] === '*') dp[0][j] = dp[0][j - 1];\n    for (let i = 1; i <= n; i++) {\n        for (let j = 1; j <= m; j++) {\n            if (p[j - 1] === '*') dp[i][j] = dp[i - 1][j] || dp[i][j - 1];\n            else if (p[j - 1] === '?' || s[i - 1] === p[j - 1]) dp[i][j] = dp[i - 1][j - 1];\n        }\n    }\n    return dp[n][m];\n}"
    },
    "boilerplate": {
      "python": "# Solution for Wildcard Matching\ndef solve(s, p):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Wildcard Matching\n#include <string>\n#include <vector>\nusing namespace std;\n\nbool solve(string s, string p) {\n    // Write your solution here\n    return false;\n}",
      "java": "// Solution for Wildcard Matching\nclass Solution {\n    public boolean solve(String s, String p) {\n        // Write your solution here\n        return false;\n    }\n}",
      "javascript": "// Solution for Wildcard Matching\nfunction solve(s, p) {\n    // Write your solution here\n    return false;\n}"
    },
    "id": 126
  },
  {
    "title": "Lexicographical Permutations of a String",
    "category": "Strings",
    "difficulty": "Medium",
    "statement": "Generate all unique permutations of string s in lexicographically sorted order.",
    "inputFormat": "s = <string>",
    "outputFormat": "Array of strings",
    "examples": [
      {
        "input": "s = \"ABC\"",
        "output": "[\"ABC\", \"ACB\", \"BAC\", \"BCA\", \"CAB\", \"CBA\"]"
      },
      {
        "input": "s = \"ABA\"",
        "output": "[\"AAB\", \"ABA\", \"BAA\"]"
      }
    ],
    "hint1": "Sort the characters initially.",
    "hint2": "Use backtracking or next_permutation, and deduplicate identical branches.",
    "solution": {
      "python": "def solve(s):\n    res = []\n    chars = sorted(list(s))\n    used = [False] * len(chars)\n    def backtrack(path):\n        if len(path) == len(chars):\n            res.append(''.join(path))\n            return\n        for i in range(len(chars)):\n            if used[i]: continue\n            if i > 0 and chars[i] == chars[i-1] and not used[i-1]: continue\n            used[i] = True\n            path.append(chars[i])\n            backtrack(path)\n            path.pop()\n            used[i] = False\n    backtrack([])\n    return res",
      "cpp": "vector<string> solve(string s) {\n    vector<string> res;\n    sort(s.begin(), s.end());\n    do {\n        res.push_back(s);\n    } while (next_permutation(s.begin(), s.end()));\n    return res;\n}",
      "java": "public List<String> solve(String s) {\n    List<String> res = new ArrayList<>();\n    char[] chars = s.toCharArray();\n    Arrays.sort(chars);\n    boolean[] used = new boolean[chars.length];\n    backtrack(chars, used, new StringBuilder(), res);\n    return res;\n}\nprivate void backtrack(char[] chars, boolean[] used, StringBuilder sb, List<String> res) {\n    if (sb.length() == chars.length) { res.add(sb.toString()); return; }\n    for (int i = 0; i < chars.length; i++) {\n        if (used[i]) continue;\n        if (i > 0 && chars[i] == chars[i - 1] && !used[i - 1]) continue;\n        used[i] = true;\n        sb.append(chars[i]);\n        backtrack(chars, used, sb, res);\n        sb.deleteCharAt(sb.length() - 1);\n        used[i] = false;\n    }\n}",
      "javascript": "function solve(s) {\n    const chars = s.split('').sort();\n    const res = [];\n    const used = new Array(chars.length).fill(false);\n    function backtrack(path) {\n        if (path.length === chars.length) { res.push(path.join('')); return; }\n        for (let i = 0; i < chars.length; i++) {\n            if (used[i]) continue;\n            if (i > 0 && chars[i] === chars[i - 1] && !used[i - 1]) continue;\n            used[i] = true;\n            path.push(chars[i]);\n            backtrack(path);\n            path.pop();\n            used[i] = false;\n        }\n    }\n    backtrack([]);\n    return res;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Lexicographical Permutations of a String\ndef solve(s):\n    # Write your solution here\n    pass",
      "cpp": "// Solution for Lexicographical Permutations of a String\n#include <string>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<string> solve(string s) {\n    // Write your solution here\n    return {};\n}",
      "java": "// Solution for Lexicographical Permutations of a String\nimport java.util.*;\nclass Solution {\n    public List<String> solve(String s) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
      "javascript": "// Solution for Lexicographical Permutations of a String\nfunction solve(s) {\n    // Write your solution here\n    return [];\n}"
    },
    "id": 127
  },
  {
    "id": 128,
    "title": "Sort Array of 0s, 1s and 2s",
    "category": "Advanced Arrays",
    "difficulty": "Medium",
    "statement": "Given an array containing only 0s, 1s, and 2s, sort the array in-place in linear time and O(1) space.",
    "inputFormat": "nums = <array>",
    "outputFormat": "Array of integers",
    "examples": [
      {
        "input": "nums = [2,0,2,1,1,0]",
        "output": "[0,0,1,1,2,2]"
      }
    ],
    "hint1": "This is known as the Dutch National Flag problem.",
    "hint2": "Use three pointers (low, mid, high) to swap elements into correct positions.",
    "solution": {
      "python": "def solve(nums):\n    low, mid, high = 0, 0, len(nums) - 1\n    while mid <= high:\n        if nums[mid] == 0:\n            nums[low], nums[mid] = nums[mid], nums[low]\n            low += 1\n            mid += 1\n        elif nums[mid] == 1:\n            mid += 1\n        else:\n            nums[mid], nums[high] = nums[high], nums[mid]\n            high -= 1\n    return nums",
      "cpp": "vector<int> solve(vector<int>& nums) {\n    int low = 0, mid = 0, high = nums.size() - 1;\n    while(mid <= high) {\n        if (nums[mid] == 0) swap(nums[low++], nums[mid++]);\n        else if (nums[mid] == 1) mid++;\n        else swap(nums[mid], nums[high--]);\n    }\n    return nums;\n}",
      "java": "public int[] solve(int[] nums) {\n    int low = 0, mid = 0, high = nums.length - 1;\n    while(mid <= high) {\n        if (nums[mid] == 0) {\n            int temp = nums[low];\n            nums[low++] = nums[mid];\n            nums[mid++] = temp;\n        } else if (nums[mid] == 1) mid++;\n        else {\n            int temp = nums[high];\n            nums[high--] = nums[mid];\n            nums[mid] = temp;\n        }\n    }\n    return nums;\n}",
      "javascript": "function solve(nums) {\n    let low = 0, mid = 0, high = nums.length - 1;\n    while(mid <= high) {\n        if (nums[mid] === 0) {\n            [nums[low], nums[mid]] = [nums[mid], nums[low]];\n            low++; mid++;\n        } else if (nums[mid] === 1) mid++;\n        else {\n            [nums[mid], nums[high]] = [nums[high], nums[mid]];\n            high--;\n        }\n    }\n    return nums;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Sort Array of 0s, 1s and 2s\\ndef solve(nums):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Sort Array of 0s, 1s and 2s\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nvector<int> solve(vector<int>& nums) {\\n    // Write your solution here\\n    return {};\\n}",
      "java": "// Solution for Sort Array of 0s, 1s and 2s\\nimport java.util.*;\\nclass Solution {\\n    public int[] solve(int[] nums) {\\n        // Write your solution here\\n        return new int[]{};\\n    }\\n}",
      "javascript": "// Solution for Sort Array of 0s, 1s and 2s\\nfunction solve(nums) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 129,
    "title": "Find the Kth Max and Min Element of an Array",
    "category": "Advanced Arrays",
    "difficulty": "Medium",
    "statement": "Given an integer array and index k, return the kth smallest and kth largest element as a string 'kth_smallest,kth_largest'. 1-indexed.",
    "inputFormat": "nums = <array>, k = <integer>",
    "outputFormat": "String",
    "examples": [
      {
        "input": "nums = [7,10,4,3,20,15], k = 3",
        "output": "\"7,15\""
      }
    ],
    "hint1": "Sort the array in ascending order.",
    "hint2": "The kth smallest element is at index k-1. The kth largest is at index length - k.",
    "solution": {
      "python": "def solve(nums, k):\n    nums.sort()\n    return f\"{nums[k-1]},{nums[-k]}\"",
      "cpp": "string solve(vector<int>& nums, int k) {\n    sort(nums.begin(), nums.end());\n    return to_string(nums[k-1]) + \",\" + to_string(nums[nums.size() - k]);\n}",
      "java": "public String solve(int[] nums, int k) {\n    java.util.Arrays.sort(nums);\n    return nums[k-1] + \",\" + nums[nums.length - k];\n}",
      "javascript": "function solve(nums, k) {\n    nums.sort((a,b)=>a-b);\n    return `${nums[k-1]},${nums[nums.length - k]}`;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Find the Kth Max and Min Element of an Array\\ndef solve(nums, k):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Find the Kth Max and Min Element of an Array\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(vector<int>& nums, int k) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Find the Kth Max and Min Element of an Array\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int[] nums, int k) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Find the Kth Max and Min Element of an Array\\nfunction solve(nums, k) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 130,
    "title": "Move Negative Elements to One Side of the Array",
    "category": "Advanced Arrays",
    "difficulty": "Easy",
    "statement": "Given an array, rearrange the elements such that all negative numbers appear first, followed by non-negative elements (order of positive elements does not matter).",
    "inputFormat": "nums = <array>",
    "outputFormat": "Array of integers",
    "examples": [
      {
        "input": "nums = [-12,11,-13,-5,6,-7,5,-3,-6]",
        "output": "[-12,-13,-5,-7,-3,-6,11,6,5]"
      }
    ],
    "hint1": "Use a two-pointer approach (left and right).",
    "hint2": "If left element is negative, increment left. If right element is positive, decrement right. Swap them if left is positive and right is negative.",
    "solution": {
      "python": "def solve(nums):\n    res = [x for x in nums if x < 0] + [x for x in nums if x >= 0]\n    return res",
      "cpp": "vector<int> solve(vector<int>& nums) {\n    int low = 0;\n    for(int i=0; i<(int)nums.size(); ++i) {\n        if (nums[i] < 0) swap(nums[i], nums[low++]);\n    }\n    return nums;\n}",
      "java": "public int[] solve(int[] nums) {\n    int low = 0;\n    for(int i=0; i<nums.length; ++i) {\n        if (nums[i] < 0) {\n            int temp = nums[i];\n            nums[i] = nums[low];\n            nums[low++] = temp;\n        }\n    }\n    return nums;\n}",
      "javascript": "function solve(nums) {\n    let low = 0;\n    for(let i=0; i<nums.length; ++i) {\n        if (nums[i] < 0) {\n            [nums[i], nums[low]] = [nums[low], nums[i]];\n            low++;\n        }\n    }\n    return nums;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Move Negative Elements to One Side of the Array\\ndef solve(nums):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Move Negative Elements to One Side of the Array\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nvector<int> solve(vector<int>& nums) {\\n    // Write your solution here\\n    return {};\\n}",
      "java": "// Solution for Move Negative Elements to One Side of the Array\\nimport java.util.*;\\nclass Solution {\\n    public int[] solve(int[] nums) {\\n        // Write your solution here\\n        return new int[]{};\\n    }\\n}",
      "javascript": "// Solution for Move Negative Elements to One Side of the Array\\nfunction solve(nums) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 131,
    "title": "Union and Intersection of Two Sorted Arrays",
    "category": "Advanced Arrays",
    "difficulty": "Medium",
    "statement": "Given two sorted arrays arr1 and arr2, return their union array and intersection array as a single string '[union],[intersection]'.",
    "inputFormat": "arr1 = <array>, arr2 = <array>",
    "outputFormat": "String",
    "examples": [
      {
        "input": "arr1 = [1,3,4,5,7], arr2 = [2,3,5,6]",
        "output": "\"[1,2,3,4,5,6,7],[3,5]\""
      }
    ],
    "hint1": "For Union, insert all elements of both arrays into a Set (maintaining sorted keys).",
    "hint2": "For Intersection, check elements present in both arrays using sets or two pointers.",
    "solution": {
      "python": "def solve(arr1, arr2):\n    s1 = set(arr1)\n    s2 = set(arr2)\n    u = sorted(list(s1.union(s2)))\n    i = sorted(list(s1.intersection(s2)))\n    return f\"{json.dumps(u)},{json.dumps(i)}\"",
      "cpp": "string solve(vector<int>& arr1, vector<int>& arr2) {\n    set<int> u(arr1.begin(), arr1.end());\n    u.insert(arr2.begin(), arr2.end());\n    set<int> s1(arr1.begin(), arr1.end());\n    vector<int> inter;\n    for(int x : arr2) if(s1.count(x)) inter.push_back(x);\n    string union_str = \"[\";\n    int i=0;\n    for(int x : u) { if(i++) union_str+=\",\"; union_str+=to_string(x); }\n    union_str+=\"]\";\n    string inter_str = \"[\";\n    for(int idx=0; idx<(int)inter.size(); ++idx) {\n        if(idx) inter_str+=\",\";\n        inter_str+=to_string(inter[idx]);\n    }\n    inter_str+=\"]\";\n    return union_str + \",\" + inter_str;\n}",
      "java": "public String solve(int[] arr1, int[] arr2) {\n    java.util.Set<Integer> u = new java.util.TreeSet<>();\n    java.util.Set<Integer> s1 = new java.util.HashSet<>();\n    for(int x: arr1) { u.add(x); s1.add(x); }\n    java.util.List<Integer> inter = new java.util.ArrayList<>();\n    for(int x: arr2) {\n        u.add(x);\n        if (s1.contains(x)) inter.add(x);\n    }\n    return u.toString().replace(\" \", \"\") + \",\" + inter.toString().replace(\" \", \"\");\n}",
      "javascript": "function solve(arr1, arr2) {\n    let u = Array.from(new Set([...arr1, ...arr2])).sort((a,b)=>a-b);\n    let s1 = new Set(arr1);\n    let inter = arr2.filter(x=>s1.has(x)).sort((a,b)=>a-b);\n    return `[${u.join(',')}],[${inter.join(',')}]`;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Union and Intersection of Two Sorted Arrays\\ndef solve(arr1, arr2):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Union and Intersection of Two Sorted Arrays\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(vector<int>& arr1, vector<int>& arr2) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Union and Intersection of Two Sorted Arrays\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int[] arr1, int[] arr2) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Union and Intersection of Two Sorted Arrays\\nfunction solve(arr1, arr2) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 132,
    "title": "Find Largest Sum Contiguous Subarray",
    "category": "Advanced Arrays",
    "difficulty": "Medium",
    "statement": "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
    "inputFormat": "nums = <array>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        "output": "6"
      }
    ],
    "hint1": "Use Kadane's Algorithm to maintain a running sum.",
    "hint2": "Reset running sum to 0 if it goes below 0. Keep track of the maximum value seen.",
    "solution": {
      "python": "def solve(nums):\n    max_so_far = nums[0]\n    curr_max = nums[0]\n    for x in nums[1:]:\n        curr_max = max(x, curr_max + x)\n        max_so_far = max(max_so_far, curr_max)\n    return max_so_far",
      "cpp": "int solve(vector<int>& nums) {\n    int max_so_far = nums[0], curr_max = nums[0];\n    for(size_t i=1; i<nums.size(); ++i) {\n        curr_max = max(nums[i], curr_max + nums[i]);\n        max_so_far = max(max_so_far, curr_max);\n    }\n    return max_so_far;\n}",
      "java": "public int solve(int[] nums) {\n    int maxSoFar = nums[0], currMax = nums[0];\n    for(int i=1; i<nums.length; ++i) {\n        currMax = Math.max(nums[i], currMax + nums[i]);\n        maxSoFar = Math.max(maxSoFar, currMax);\n    }\n    return maxSoFar;\n}",
      "javascript": "function solve(nums) {\n    let maxSoFar = nums[0], currMax = nums[0];\n    for(let i=1; i<nums.length; ++i) {\n        currMax = Math.max(nums[i], currMax + nums[i]);\n        maxSoFar = Math.max(maxSoFar, currMax);\n    }\n    return maxSoFar;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Find Largest Sum Contiguous Subarray\\ndef solve(nums):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Find Largest Sum Contiguous Subarray\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(vector<int>& nums) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Find Largest Sum Contiguous Subarray\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int[] nums) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Find Largest Sum Contiguous Subarray\\nfunction solve(nums) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 133,
    "title": "Minimize the Maximum Difference Between Heights",
    "category": "Advanced Arrays",
    "difficulty": "Hard",
    "statement": "Given heights of towers arr and integer k, increase or decrease height of each tower by k (only once). Find the minimum possible difference between heights of shortest and tallest towers.",
    "inputFormat": "arr = <array>, k = <integer>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "arr = [1,15,10], k = 6",
        "output": "5"
      }
    ],
    "hint1": "Sort the array first to align heights.",
    "hint2": "Compare elements: standard diff is arr[n-1] - arr[0]. Track min/max boundary variations when adding/subtracting k.",
    "solution": {
      "python": "def solve(arr, k):\n    arr.sort()\n    n = len(arr)\n    ans = arr[-1] - arr[0]\n    smallest = arr[0] + k\n    largest = arr[-1] - k\n    for i in range(n - 1):\n        mi = min(smallest, arr[i+1] - k)\n        ma = max(largest, arr[i] + k)\n        if mi < 0: continue\n        ans = min(ans, ma - mi)\n    return ans",
      "cpp": "int solve(vector<int>& arr, int k) {\n    sort(arr.begin(), arr.end());\n    int n = arr.size();\n    int ans = arr[n-1] - arr[0];\n    int smallest = arr[0] + k, largest = arr[n-1] - k;\n    for(int i=0; i<n-1; ++i) {\n        int mi = min(smallest, arr[i+1] - k);\n        int ma = max(largest, arr[i] + k);\n        if (mi < 0) continue;\n        ans = min(ans, ma - mi);\n    }\n    return ans;\n}",
      "java": "public int solve(int[] arr, int k) {\n    java.util.Arrays.sort(arr);\n    int n = arr.length;\n    int ans = arr[n-1] - arr[0];\n    int smallest = arr[0] + k, largest = arr[n-1] - k;\n    for(int i=0; i<n-1; ++i) {\n        int mi = Math.min(smallest, arr[i+1] - k);\n        int ma = Math.max(largest, arr[i] + k);\n        if (mi < 0) continue;\n        ans = Math.min(ans, ma - mi);\n    }\n    return ans;\n}",
      "javascript": "function solve(arr, k) {\n    arr.sort((a,b)=>a-b);\n    let n = arr.length;\n    let ans = arr[n-1] - arr[0];\n    let smallest = arr[0] + k, largest = arr[n-1] - k;\n    for(let i=0; i<n-1; ++i) {\n        let mi = Math.min(smallest, arr[i+1] - k);\n        let ma = Math.max(largest, arr[i] + k);\n        if (mi < 0) continue;\n        ans = Math.min(ans, ma - mi);\n    }\n    return ans;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Minimize the Maximum Difference Between Heights\\ndef solve(arr, k):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Minimize the Maximum Difference Between Heights\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(vector<int>& arr, int k) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Minimize the Maximum Difference Between Heights\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int[] arr, int k) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Minimize the Maximum Difference Between Heights\\nfunction solve(arr, k) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 134,
    "title": "Minimum Number of Jumps to Reach the End of an Array",
    "category": "Advanced Arrays",
    "difficulty": "Hard",
    "statement": "Given an array of integers where each element represents the max number of steps you can jump forward, return the minimum jumps to reach the end. If unreachable, return -1.",
    "inputFormat": "nums = <array>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "nums = [2,3,1,1,2,4,2,0,1,1]",
        "output": "4"
      }
    ],
    "hint1": "Use greedy BFS variables: maxReach (further index reachable), steps (available steps from current jump), jumps (total jumps).",
    "hint2": "Update boundaries. If i exceeds maxReach, return -1.",
    "solution": {
      "python": "def solve(nums):\n    if len(nums) <= 1: return 0\n    if nums[0] == 0: return -1\n    max_reach = nums[0]\n    steps = nums[0]\n    jumps = 1\n    for i in range(1, len(nums) - 1):\n        max_reach = max(max_reach, i + nums[i])\n        steps -= 1\n        if steps == 0:\n            jumps += 1\n            if i >= max_reach: return -1\n            steps = max_reach - i\n    return jumps",
      "cpp": "int solve(vector<int>& nums) {\n    if (nums.size() <= 1) return 0;\n    if (nums[0] == 0) return -1;\n    int max_reach = nums[0], steps = nums[0], jumps = 1;\n    for(int i=1; i<(int)nums.size()-1; ++i) {\n        max_reach = max(max_reach, i + nums[i]);\n        steps--;\n        if (steps == 0) {\n            jumps++;\n            if (i >= max_reach) return -1;\n            steps = max_reach - i;\n        }\n    }\n    return jumps;\n}",
      "java": "public int solve(int[] nums) {\n    if (nums.length <= 1) return 0;\n    if (nums[0] == 0) return -1;\n    int maxReach = nums[0], steps = nums[0], jumps = 1;\n    for(int i=1; i<nums.length-1; ++i) {\n        maxReach = Math.max(maxReach, i + nums[i]);\n        steps--;\n        if (steps == 0) {\n            jumps++;\n            if (i >= maxReach) return -1;\n            steps = maxReach - i;\n        }\n    }\n    return jumps;\n}",
      "javascript": "function solve(nums) {\n    if (nums.length <= 1) return 0;\n    if (nums[0] === 0) return -1;\n    let maxReach = nums[0], steps = nums[0], jumps = 1;\n    for(let i=1; i<nums.length-1; ++i) {\n        maxReach = Math.max(maxReach, i + nums[i]);\n        steps--;\n        if (steps === 0) {\n            jumps++;\n            if (i >= maxReach) return -1;\n            steps = maxReach - i;\n        }\n    }\n    return jumps;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Minimum Number of Jumps to Reach the End of an Array\\ndef solve(nums):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Minimum Number of Jumps to Reach the End of an Array\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(vector<int>& nums) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Minimum Number of Jumps to Reach the End of an Array\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int[] nums) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Minimum Number of Jumps to Reach the End of an Array\\nfunction solve(nums) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 135,
    "title": "Find Duplicate in an Array of N+1 Integers",
    "category": "Advanced Arrays",
    "difficulty": "Medium",
    "statement": "Given an array of integers containing N+1 integers where each integer is between 1 and N (inclusive), find the duplicate number. Assume only one duplicate is present.",
    "inputFormat": "nums = <array>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "nums = [1,3,4,2,2]",
        "output": "2"
      }
    ],
    "hint1": "Use Floyd's Cycle Finding algorithm (tortoise and hare).",
    "hint2": "Move tortoise by 1 step, hare by 2 steps. When they meet, reset tortoise to start and move both by 1 step. Their next meeting point is the duplicate.",
    "solution": {
      "python": "def solve(nums):\n    tortoise = nums[0]\n    hare = nums[0]\n    while True:\n        tortoise = nums[tortoise]\n        hare = nums[nums[hare]]\n        if tortoise == hare:\n            break\n    tortoise = nums[0]\n    while tortoise != hare:\n        tortoise = nums[tortoise]\n        hare = nums[hare]\n    return hare",
      "cpp": "int solve(vector<int>& nums) {\n    int tortoise = nums[0], hare = nums[0];\n    do {\n        tortoise = nums[tortoise];\n        hare = nums[nums[hare]];\n    } while(tortoise != hare);\n    tortoise = nums[0];\n    while(tortoise != hare) {\n        tortoise = nums[tortoise];\n        hare = nums[hare];\n    }\n    return hare;\n}",
      "java": "public int solve(int[] nums) {\n    int tortoise = nums[0], hare = nums[0];\n    do {\n        tortoise = nums[tortoise];\n        hare = nums[nums[hare]];\n    } while(tortoise != hare);\n    tortoise = nums[0];\n    while(tortoise != hare) {\n        tortoise = nums[tortoise];\n        hare = nums[hare];\n    }\n    return hare;\n}",
      "javascript": "function solve(nums) {\n    let tortoise = nums[0], hare = nums[0];\n    do {\n        tortoise = nums[tortoise];\n        hare = nums[nums[hare]];\n    } while(tortoise !== hare);\n    tortoise = nums[0];\n    while(tortoise !== hare) {\n        tortoise = nums[tortoise];\n        hare = nums[hare];\n    }\n    return hare;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Find Duplicate in an Array of N+1 Integers\\ndef solve(nums):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Find Duplicate in an Array of N+1 Integers\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(vector<int>& nums) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Find Duplicate in an Array of N+1 Integers\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int[] nums) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Find Duplicate in an Array of N+1 Integers\\nfunction solve(nums) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 136,
    "title": "Merge 2 Sorted Arrays Without Using Extra Space",
    "category": "Advanced Arrays",
    "difficulty": "Hard",
    "statement": "Given two sorted arrays arr1 and arr2, merge them such that both are sorted individually in ascending order without using any extra space. Return string '[arr1],[arr2]'.",
    "inputFormat": "arr1 = <array>, arr2 = <array>",
    "outputFormat": "String",
    "examples": [
      {
        "input": "arr1 = [1,5,9,10,15,20], arr2 = [2,3,8,13]",
        "output": "\"[1,2,3,8,9,10],[13,15,15,20]\""
      }
    ],
    "hint1": "Start from the end of arr1 and the beginning of arr2.",
    "hint2": "Compare elements: if arr1[i] > arr2[j], swap them. Keep pointers moving, and sort both arrays after swapping is completed.",
    "solution": {
      "python": "def solve(arr1, arr2):\n    i, j = len(arr1) - 1, 0\n    while i >= 0 and j < len(arr2):\n        if arr1[i] > arr2[j]:\n            arr1[i], arr2[j] = arr2[j], arr1[i]\n            i -= 1; j += 1\n        else:\n            break\n    arr1.sort(); arr2.sort()\n    return f\"{json.dumps(arr1)},{json.dumps(arr2)}\"",
      "cpp": "string solve(vector<int>& arr1, vector<int>& arr2) {\n    int i = arr1.size() - 1, j = 0;\n    while(i >= 0 && j < (int)arr2.size()) {\n        if (arr1[i] > arr2[j]) swap(arr1[i--], arr2[j++]);\n        else break;\n    }\n    sort(arr1.begin(), arr1.end());\n    sort(arr2.begin(), arr2.end());\n    string s1 = \"[\";\n    for(int idx=0; idx<(int)arr1.size(); idx++) { if(idx) s1+=\",\"; s1+=to_string(arr1[idx]); }\n    s1+=\"]\";\n    string s2 = \"[\";\n    for(int idx=0; idx<(int)arr2.size(); idx++) { if(idx) s2+=\",\"; s2+=to_string(arr2[idx]); }\n    s2+=\"]\";\n    return s1 + \",\" + s2;\n}",
      "java": "public String solve(int[] arr1, int[] arr2) {\n    int i = arr1.length - 1, j = 0;\n    while(i >= 0 && j < arr2.length) {\n        if (arr1[i] > arr2[j]) {\n            int temp = arr1[i];\n            arr1[i] = arr2[j];\n            arr2[j] = temp;\n            i--; j++;\n        } else break;\n    }\n    java.util.Arrays.sort(arr1);\n    java.util.Arrays.sort(arr2);\n    return java.util.Arrays.toString(arr1).replace(\" \", \"\") + \",\" + java.util.Arrays.toString(arr2).replace(\" \", \"\");\n}",
      "javascript": "function solve(arr1, arr2) {\n    let i = arr1.length - 1, j = 0;\n    while(i >= 0 && j < arr2.length) {\n        if (arr1[i] > arr2[j]) {\n            [arr1[i], arr2[j]] = [arr2[j], arr1[i]];\n            i--; j++;\n        } else break;\n    }\n    arr1.sort((a,b)=>a-b);\n    arr2.sort((a,b)=>a-b);\n    return `[${arr1.join(',')}],[${arr2.join(',')}]`;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Merge 2 Sorted Arrays Without Using Extra Space\\ndef solve(arr1, arr2):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Merge 2 Sorted Arrays Without Using Extra Space\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nstring solve(vector<int>& arr1, vector<int>& arr2) {\\n    // Write your solution here\\n    return \"\";\\n}",
      "java": "// Solution for Merge 2 Sorted Arrays Without Using Extra Space\\nimport java.util.*;\\nclass Solution {\\n    public String solve(int[] arr1, int[] arr2) {\\n        // Write your solution here\\n        return \"\";\\n    }\\n}",
      "javascript": "// Solution for Merge 2 Sorted Arrays Without Using Extra Space\\nfunction solve(arr1, arr2) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 137,
    "title": "Kadane's Algorithm",
    "category": "Advanced Arrays",
    "difficulty": "Medium",
    "statement": "Implement Kadane's Algorithm to find the maximum contiguous subarray sum.",
    "inputFormat": "nums = <array>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "nums = [-1,-2,-3,-4]",
        "output": "-1"
      }
    ],
    "hint1": "Define a current max and global max variable.",
    "hint2": "Iterate, updating current max to be either the current number alone or current number + previous current max.",
    "solution": {
      "python": "def solve(nums):\n    max_so_far = nums[0]\n    curr_max = nums[0]\n    for x in nums[1:]:\n        curr_max = max(x, curr_max + x)\n        max_so_far = max(max_so_far, curr_max)\n    return max_so_far",
      "cpp": "int solve(vector<int>& nums) {\n    int max_so_far = nums[0], curr_max = nums[0];\n    for(size_t i=1; i<nums.size(); ++i) {\n        curr_max = max(nums[i], curr_max + nums[i]);\n        max_so_far = max(max_so_far, curr_max);\n    }\n    return max_so_far;\n}",
      "java": "public int solve(int[] nums) {\n    int maxSoFar = nums[0], currMax = nums[0];\n    for(int i=1; i<nums.length; ++i) {\n        currMax = Math.max(nums[i], currMax + nums[i]);\n        maxSoFar = Math.max(maxSoFar, currMax);\n    }\n    return maxSoFar;\n}",
      "javascript": "function solve(nums) {\n    let maxSoFar = nums[0], currMax = nums[0];\n    for(let i=1; i<nums.length; ++i) {\n        currMax = Math.max(nums[i], currMax + nums[i]);\n        maxSoFar = Math.max(maxSoFar, currMax);\n    }\n    return maxSoFar;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Kadane's Algorithm\\ndef solve(nums):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Kadane's Algorithm\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(vector<int>& nums) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Kadane's Algorithm\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int[] nums) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Kadane's Algorithm\\nfunction solve(nums) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 138,
    "title": "Merge Intervals",
    "category": "Advanced Arrays",
    "difficulty": "Medium",
    "statement": "Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals and return the merged array.",
    "inputFormat": "intervals = <2d_array>",
    "outputFormat": "2D Array of integers",
    "examples": [
      {
        "input": "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        "output": "[[1,6],[8,10],[15,18]]"
      }
    ],
    "hint1": "Sort intervals based on their start values.",
    "hint2": "Initialize a merged list. If current interval overlaps with last merged interval, update end value; else, append current interval.",
    "solution": {
      "python": "def solve(intervals):\n    intervals.sort(key=lambda x: x[0])\n    merged = []\n    for interval in intervals:\n        if not merged or merged[-1][1] < interval[0]:\n            merged.append(interval)\n        else:\n            merged[-1][1] = max(merged[-1][1], interval[1])\n    return merged",
      "cpp": "vector<vector<int>> solve(vector<vector<int>>& intervals) {\n    if (intervals.empty()) return {};\n    sort(intervals.begin(), intervals.end());\n    vector<vector<int>> merged;\n    for(auto& interval : intervals) {\n        if (merged.empty() || merged.back()[1] < interval[0]) {\n            merged.push_back(interval);\n        } else {\n            merged.back()[1] = max(merged.back()[1], interval[1]);\n        }\n    }\n    return merged;\n}",
      "java": "public int[][] solve(int[][] intervals) {\n    if (intervals.length == 0) return new int[][]{};\n    java.util.Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));\n    java.util.List<int[]> merged = new java.util.ArrayList<>();\n    for (int[] interval : intervals) {\n        if (merged.isEmpty() || merged.get(merged.size() - 1)[1] < interval[0]) {\n            merged.add(interval);\n        } else {\n            merged.get(merged.size() - 1)[1] = Math.max(merged.get(merged.size() - 1)[1], interval[1]);\n        }\n    }\n    return merged.toArray(new int[merged.size()][]);\n}",
      "javascript": "function solve(intervals) {\n    if (intervals.length === 0) return [];\n    intervals.sort((a, b) => a[0] - b[0]);\n    let merged = [intervals[0]];\n    for (let i = 1; i < intervals.length; i++) {\n        let last = merged[merged.length - 1];\n        if (last[1] >= intervals[i][0]) {\n            last[1] = Math.max(last[1], intervals[i][1]);\n        } else {\n            merged.push(intervals[i]);\n        }\n    }\n    return merged;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Merge Intervals\\ndef solve(intervals):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Merge Intervals\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nvector<vector<int>> solve(vector<vector<int>>& intervals) {\\n    // Write your solution here\\n    return {};\\n}",
      "java": "// Solution for Merge Intervals\\nimport java.util.*;\\nclass Solution {\\n    public int[][] solve(int[][] intervals) {\\n        // Write your solution here\\n        return new int[][]{};\\n    }\\n}",
      "javascript": "// Solution for Merge Intervals\\nfunction solve(intervals) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 139,
    "title": "Count Inversion",
    "category": "Advanced Arrays",
    "difficulty": "Hard",
    "statement": "Given an array of integers nums, find the inversion count. Two elements nums[i] and nums[j] form an inversion if i < j and nums[i] > nums[j].",
    "inputFormat": "nums = <array>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "nums = [2,4,1,3,5]",
        "output": "3"
      }
    ],
    "hint1": "A naive O(N^2) loop counts elements. For larger inputs, apply Merge Sort.",
    "hint2": "In the merge step, if a[i] > b[j], all remaining elements in the left subarray (size - i) also form inversions.",
    "solution": {
      "python": "def solve(nums):\n    def merge_sort(arr):\n        if len(arr) <= 1: return arr, 0\n        mid = len(arr) // 2\n        left, l_inv = merge_sort(arr[:mid])\n        right, r_inv = merge_sort(arr[mid:])\n        merged = []\n        i = j = inv = 0\n        while i < len(left) and j < len(right):\n            if left[i] <= right[j]:\n                merged.append(left[i]); i += 1\n            else:\n                merged.append(right[j]); j += 1\n                inv += len(left) - i\n        merged.extend(left[i:])\n        merged.extend(right[j:])\n        return merged, l_inv + r_inv + inv\n    _, count = merge_sort(nums)\n    return count",
      "cpp": "int solve(vector<int>& nums) {\n    auto merge = [](vector<int>& arr, int l, int m, int r) {\n        vector<int> left(arr.begin() + l, arr.begin() + m + 1);\n        vector<int> right(arr.begin() + m + 1, arr.begin() + r + 1);\n        int i = 0, j = 0, k = l, inv = 0;\n        while (i < (int)left.size() && j < (int)right.size()) {\n            if (left[i] <= right[j]) arr[k++] = left[i++];\n            else {\n                arr[k++] = right[j++];\n                inv += (int)left.size() - i;\n            }\n        }\n        while (i < (int)left.size()) arr[k++] = left[i++];\n        while (j < (int)right.size()) arr[k++] = right[j++];\n        return inv;\n    };\n    auto merge_sort = [&](auto& self, vector<int>& arr, int l, int r) -> int {\n        int inv = 0;\n        if (l < r) {\n            int m = l + (r - l) / 2;\n            inv += self(self, arr, l, m);\n            inv += self(self, arr, m + 1, r);\n            inv += merge(arr, l, m, r);\n        }\n        return inv;\n    };\n    return merge_sort(merge_sort, nums, 0, (int)nums.size() - 1);\n}",
      "java": "public int solve(int[] nums) {\n    return mergeSort(nums, 0, nums.length - 1);\n}\nprivate int mergeSort(int[] arr, int l, int r) {\n    int inv = 0;\n    if (l < r) {\n        int m = l + (r - l) / 2;\n        inv += mergeSort(arr, l, m);\n        inv += mergeSort(arr, m + 1, r);\n        inv += merge(arr, l, m, r);\n    }\n    return inv;\n}\nprivate int merge(int[] arr, int l, int m, int r) {\n    int[] left = java.util.Arrays.copyOfRange(arr, l, m + 1);\n    int[] right = java.util.Arrays.copyOfRange(arr, m + 1, r + 1);\n    int i = 0, j = 0, k = l, inv = 0;\n    while (i < left.length && j < right.length) {\n        if (left[i] <= right[j]) {\n            arr[k++] = left[i++];\n        } else {\n            arr[k++] = right[j++];\n            inv += left.length - i;\n        }\n    }\n    while (i < left.length) arr[k++] = left[i++];\n    while (j < right.length) arr[k++] = right[j++];\n    return inv;\n}",
      "javascript": "function solve(nums) {\n    function mergeSort(arr) {\n        if (arr.length <= 1) return [arr, 0];\n        let mid = Math.floor(arr.length / 2);\n        let [left, lInv] = mergeSort(arr.slice(0, mid));\n        let [right, rInv] = mergeSort(arr.slice(mid));\n        let merged = [];\n        let i = 0, j = 0, inv = 0;\n        while (i < left.length && j < right.length) {\n            if (left[i] <= right[j]) {\n                merged.push(left[i++]);\n            } else {\n                merged.push(right[j++]);\n                inv += left.length - i;\n            }\n        }\n        return [merged.concat(left.slice(i)).concat(right.slice(j)), lInv + rInv + inv];\n    }\n    let [_, count] = mergeSort(nums);\n    return count;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Count Inversion\\ndef solve(nums):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Count Inversion\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(vector<int>& nums) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Count Inversion\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int[] nums) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Count Inversion\\nfunction solve(nums) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 140,
    "title": "Best Time to Buy and Sell Stock",
    "category": "Advanced Arrays",
    "difficulty": "Easy",
    "statement": "Given prices array where prices[i] is price on ith day, find max profit by choosing single day to buy and different future day to sell. Return 0 if no profit.",
    "inputFormat": "prices = <array>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "prices = [7,1,5,3,6,4]",
        "output": "5"
      }
    ],
    "hint1": "Maintain the minimum price seen so far.",
    "hint2": "Compare current price with min price, calculating local profits and keeping track of the global maximum.",
    "solution": {
      "python": "def solve(prices):\n    min_price = float('inf')\n    max_profit = 0\n    for p in prices:\n        if p < min_price: min_price = p\n        elif p - min_price > max_profit: max_profit = p - min_price\n    return max_profit",
      "cpp": "int solve(vector<int>& prices) {\n    int min_price = 1e9, max_profit = 0;\n    for(int p : prices) {\n        if (p < min_price) min_price = p;\n        else max_profit = max(max_profit, p - min_price);\n    }\n    return max_profit;\n}",
      "java": "public int solve(int[] prices) {\n    int minPrice = Integer.MAX_VALUE, maxProfit = 0;\n    for(int p : prices) {\n        if (p < minPrice) minPrice = p;\n        else maxProfit = Math.max(maxProfit, p - minPrice);\n    }\n    return maxProfit;\n}",
      "javascript": "function solve(prices) {\n    let minPrice = Infinity, maxProfit = 0;\n    for(let p of prices) {\n        if (p < minPrice) minPrice = p;\n        else maxProfit = Math.max(maxProfit, p - minPrice);\n    }\n    return maxProfit;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Best Time to Buy and Sell Stock\\ndef solve(prices):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Best Time to Buy and Sell Stock\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve() {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Best Time to Buy and Sell Stock\\nimport java.util.*;\\nclass Solution {\\n    public int solve() {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Best Time to Buy and Sell Stock\\nfunction solve(prices) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 141,
    "title": "Find All Pairs on Integer Array Whose Sum is Equal to Given Number",
    "category": "Advanced Arrays",
    "difficulty": "Medium",
    "statement": "Given an integer array nums and integer target, find the number of pairs whose sum equals target.",
    "inputFormat": "nums = <array>, target = <integer>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "nums = [1,5,7,-1,5], target = 6",
        "output": "3"
      }
    ],
    "hint1": "Use a hash map to count the frequencies of numbers visited so far.",
    "hint2": "For each element x, add the frequency of (target - x) to your pair counter, then increment the frequency of x.",
    "solution": {
      "python": "def solve(nums, target):\n    from collections import Counter\n    cnt = Counter()\n    pairs = 0\n    for x in nums:\n        pairs += cnt[target - x]\n        cnt[x] += 1\n    return pairs",
      "cpp": "int solve(vector<int>& nums, int target) {\n    unordered_map<int, int> mp;\n    int pairs = 0;\n    for(int x : nums) {\n        pairs += mp[target - x];\n        mp[x]++;\n    }\n    return pairs;\n}",
      "java": "public int solve(int[] nums, int target) {\n    java.util.Map<Integer, Integer> map = new java.util.HashMap<>();\n    int pairs = 0;\n    for(int x : nums) {\n        pairs += map.getOrDefault(target - x, 0);\n        map.put(x, map.getOrDefault(x, 0) + 1);\n    }\n    return pairs;\n}",
      "javascript": "function solve(nums, target) {\n    let map = {};\n    let pairs = 0;\n    for(let x of nums) {\n        let comp = target - x;\n        if (map[comp]) pairs += map[comp];\n        map[x] = (map[x] || 0) + 1;\n    }\n    return pairs;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Find All Pairs on Integer Array Whose Sum is Equal to Given Number\\ndef solve(nums, target):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Find All Pairs on Integer Array Whose Sum is Equal to Given Number\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(vector<int>& nums) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Find All Pairs on Integer Array Whose Sum is Equal to Given Number\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int[] nums) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Find All Pairs on Integer Array Whose Sum is Equal to Given Number\\nfunction solve(nums, target) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 142,
    "title": "Find if There is Any Subarray With Sum Equal to 0",
    "category": "Advanced Arrays",
    "difficulty": "Medium",
    "statement": "Given an array of integers nums, check if there is any contiguous subarray whose sum is equal to 0. Return true or false.",
    "inputFormat": "nums = <array>",
    "outputFormat": "Boolean",
    "examples": [
      {
        "input": "nums = [4,2,-3,1,6]",
        "output": "true"
      },
      {
        "input": "nums = [1,2,3]",
        "output": "false"
      }
    ],
    "hint1": "Compute the prefix sum while traversing the array.",
    "hint2": "Store visited prefix sums in a Set. If prefix sum is 0 or is already in the set, a zero-sum subarray exists.",
    "solution": {
      "python": "def solve(nums):\n    s = set()\n    pref = 0\n    for x in nums:\n        pref += x\n        if pref == 0 or pref in s: return True\n        s.add(pref)\n    return False",
      "cpp": "bool solve(vector<int>& nums) {\n    unordered_set<int> s;\n    int pref = 0;\n    for(int x : nums) {\n        pref += x;\n        if (pref == 0 || s.count(pref)) return true;\n        s.insert(pref);\n    }\n    return false;\n}",
      "java": "public boolean solve(int[] nums) {\n    java.util.Set<Integer> s = new java.util.HashSet<>();\n    int pref = 0;\n    for(int x : nums) {\n        pref += x;\n        if (pref == 0 || s.contains(pref)) return true;\n        s.add(pref);\n    }\n    return false;\n}",
      "javascript": "function solve(nums) {\n    let s = new Set();\n    let pref = 0;\n    for(let x of nums) {\n        pref += x;\n        if (pref === 0 || s.has(pref)) return true;\n        s.add(pref);\n    }\n    return false;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Find if There is Any Subarray With Sum Equal to 0\\ndef solve(nums):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Find if There is Any Subarray With Sum Equal to 0\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nbool solve(vector<int>& nums) {\\n    // Write your solution here\\n    return false;\\n}",
      "java": "// Solution for Find if There is Any Subarray With Sum Equal to 0\\nimport java.util.*;\\nclass Solution {\\n    public boolean solve(int[] nums) {\\n        // Write your solution here\\n        return false;\\n    }\\n}",
      "javascript": "// Solution for Find if There is Any Subarray With Sum Equal to 0\\nfunction solve(nums) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 143,
    "title": "Find Factorial of a Large Number",
    "category": "Advanced Arrays",
    "difficulty": "Hard",
    "statement": "Given a large integer n, calculate its factorial and return the value as a string.",
    "inputFormat": "n = <integer>",
    "outputFormat": "String",
    "examples": [
      {
        "input": "n = 20",
        "output": "\"2432902008176640000\""
      }
    ],
    "hint1": "Since values can exceed standard datatype limits, represent digits in an array.",
    "hint2": "Multiply digits array sequentially from 2 to n, carrying over values. Join and reverse the result string.",
    "solution": {
      "python": "def solve(n):\n    import math\n    return str(math.factorial(n))",
      "cpp": "string solve(int n) {\n    vector<int> res = {1};\n    for (int x = 2; x <= n; x++) {\n        int carry = 0;\n        for (int i = 0; i < (int)res.size(); i++) {\n            int prod = res[i] * x + carry;\n            res[i] = prod % 10;\n            carry = prod / 10;\n        }\n        while (carry) {\n            res.push_back(carry % 10);\n            carry /= 10;\n        }\n    }\n    string s = \"\";\n    for (int i = (int)res.size() - 1; i >= 0; i--) s += to_string(res[i]);\n    return s;\n}",
      "java": "public String solve(int n) {\n    java.math.BigInteger fact = java.math.BigInteger.ONE;\n    for (int i = 2; i <= n; i++) {\n        fact = fact.multiply(java.math.BigInteger.valueOf(i));\n    }\n    return fact.toString();\n}",
      "javascript": "function solve(n) {\n    let fact = BigInt(1);\n    for(let i = 2; i <= n; i++) {\n        fact *= BigInt(i);\n    }\n    return fact.toString();\n}"
    },
    "boilerplate": {
      "python": "# Solution for Find Factorial of a Large Number\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Find Factorial of a Large Number\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nstring solve(int n) {\\n    // Write your solution here\\n    return \"\";\\n}",
      "java": "// Solution for Find Factorial of a Large Number\\nimport java.util.*;\\nclass Solution {\\n    public String solve(int n) {\\n        // Write your solution here\\n        return \"\";\\n    }\\n}",
      "javascript": "// Solution for Find Factorial of a Large Number\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 144,
    "title": "Find Common Elements in 3 Sorted Arrays",
    "category": "Advanced Arrays",
    "difficulty": "Medium",
    "statement": "Given three sorted arrays arr1, arr2, and arr3, find all common elements present in all three arrays and return them in a sorted list.",
    "inputFormat": "arr1 = <array>, arr2 = <array>, arr3 = <array>",
    "outputFormat": "Array of integers",
    "examples": [
      {
        "input": "arr1 = [1,5,10,20], arr2 = [6,7,20,80], arr3 = [3,4,15,20,30]",
        "output": "[20]"
      }
    ],
    "hint1": "Use three pointers (i, j, k) starting at the beginning of each array.",
    "hint2": "If elements match, add to list and increment all pointers. Otherwise, increment the pointer of the smallest element.",
    "solution": {
      "python": "def solve(arr1, arr2, arr3):\n    s1, s2, s3 = set(arr1), set(arr2), set(arr3)\n    return sorted(list(s1.intersection(s2).intersection(s3)))",
      "cpp": "vector<int> solve(vector<int>& arr1, vector<int>& arr2, vector<int>& arr3) {\n    int i=0, j=0, k=0;\n    vector<int> res;\n    while(i<(int)arr1.size() && j<(int)arr2.size() && k<(int)arr3.size()) {\n        if (arr1[i] == arr2[j] && arr2[j] == arr3[k]) {\n            if (res.empty() || res.back() != arr1[i]) res.push_back(arr1[i]);\n            i++; j++; k++;\n        } else if (arr1[i] < arr2[j]) i++;\n        else if (arr2[j] < arr3[k]) j++;\n        else k++;\n    }\n    return res;\n}",
      "java": "public int[] solve(int[] arr1, int[] arr2, int[] arr3) {\n    java.util.List<Integer> list = new java.util.ArrayList<>();\n    int i=0, j=0, k=0;\n    while(i<arr1.length && j<arr2.length && k<arr3.length) {\n        if (arr1[i] == arr2[j] && arr2[j] == arr3[k]) {\n            if (list.isEmpty() || list.get(list.size()-1) != arr1[i]) {\n                list.add(arr1[i]);\n            }\n            i++; j++; k++;\n        } else if (arr1[i] < arr2[j]) i++;\n        else if (arr2[j] < arr3[k]) j++;\n        else k++;\n    }\n    return list.stream().mapToInt(x -> x).toArray();\n}",
      "javascript": "function solve(arr1, arr2, arr3) {\n    let i=0, j=0, k=0, res = [];\n    while(i<arr1.length && j<arr2.length && k<arr3.length) {\n        if (arr1[i] === arr2[j] && arr2[j] === arr3[k]) {\n            if (res.length === 0 || res[res.length - 1] !== arr1[i]) res.push(arr1[i]);\n            i++; j++; k++;\n        } else if (arr1[i] < arr2[j]) i++;\n        else if (arr2[j] < arr3[k]) j++;\n        else k++;\n    }\n    return res;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Find Common Elements in 3 Sorted Arrays\\ndef solve(arr1, arr2, arr3):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Find Common Elements in 3 Sorted Arrays\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nvector<int> solve(vector<int>& arr1, vector<int>& arr2, vector<int>& arr3) {\\n    // Write your solution here\\n    return {};\\n}",
      "java": "// Solution for Find Common Elements in 3 Sorted Arrays\\nimport java.util.*;\\nclass Solution {\\n    public int[] solve(int[] arr1, int[] arr2, int[] arr3) {\\n        // Write your solution here\\n        return new int[]{};\\n    }\\n}",
      "javascript": "// Solution for Find Common Elements in 3 Sorted Arrays\\nfunction solve(arr1, arr2, arr3) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 145,
    "title": "Rearrange the Array in Alternating Positive and Negative Items",
    "category": "Advanced Arrays",
    "difficulty": "Hard",
    "statement": "Rearrange array elements in alternating positive and negative order starting with positive, using O(1) extra space.",
    "inputFormat": "nums = <array>",
    "outputFormat": "Array of integers",
    "examples": [
      {
        "input": "nums = [1,2,3,-4,-1,4]",
        "output": "[1,-4,2,-1,3,4]"
      }
    ],
    "hint1": "Partition array positive elements to one side and negative to other.",
    "hint2": "Alternate insertion: swap positive and negative values iteratively until one group is depleted.",
    "solution": {
      "python": "def solve(nums):\n    pos = [x for x in nums if x >= 0]\n    neg = [x for x in nums if x < 0]\n    res = []\n    i = j = 0\n    while i < len(pos) or j < len(neg):\n        if i < len(pos):\n            res.append(pos[i]); i += 1\n        if j < len(neg):\n            res.append(neg[j]); j += 1\n    return res",
      "cpp": "vector<int> solve(vector<int>& nums) {\n    vector<int> pos, neg;\n    for(int x : nums) {\n        if (x >= 0) pos.push_back(x);\n        else neg.push_back(x);\n    }\n    vector<int> res;\n    size_t i = 0, j = 0;\n    while(i < pos.size() || j < neg.size()) {\n        if (i < pos.size()) res.push_back(pos[i++]);\n        if (j < neg.size()) res.push_back(neg[j++]);\n    }\n    return res;\n}",
      "java": "public int[] solve(int[] nums) {\n    java.util.List<Integer> pos = new java.util.ArrayList<>();\n    java.util.List<Integer> neg = new java.util.ArrayList<>();\n    for(int x : nums) {\n        if (x >= 0) pos.add(x);\n        else neg.add(x);\n    }\n    int[] res = new int[nums.length];\n    int i=0, j=0, k=0;\n    while(i < pos.size() || j < neg.size()) {\n        if (i < pos.size()) res[k++] = pos.get(i++);\n        if (j < neg.size()) res[k++] = neg.get(j++);\n    }\n    return res;\n}",
      "javascript": "function solve(nums) {\n    let pos = nums.filter(x => x >= 0);\n    let neg = nums.filter(x => x < 0);\n    let res = [];\n    let i=0, j=0;\n    while(i < pos.length || j < neg.length) {\n        if (i < pos.length) res.push(pos[i++]);\n        if (j < neg.length) res.push(neg[j++]);\n    }\n    return res;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Rearrange the Array in Alternating Positive and Negative Items\\ndef solve(nums):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Rearrange the Array in Alternating Positive and Negative Items\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nvector<int> solve(vector<int>& nums) {\\n    // Write your solution here\\n    return {};\\n}",
      "java": "// Solution for Rearrange the Array in Alternating Positive and Negative Items\\nimport java.util.*;\\nclass Solution {\\n    public int[] solve(int[] nums) {\\n        // Write your solution here\\n        return new int[]{};\\n    }\\n}",
      "javascript": "// Solution for Rearrange the Array in Alternating Positive and Negative Items\\nfunction solve(nums) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 146,
    "title": "Find All Elements That Appear More Than n/k Times",
    "category": "Advanced Arrays",
    "difficulty": "Medium",
    "statement": "Given an array of size n and a number k, find all elements that appear more than n/k times and return them in a sorted list.",
    "inputFormat": "nums = <array>, k = <integer>",
    "outputFormat": "Array of integers",
    "examples": [
      {
        "input": "nums = [3,1,2,2,1,2,3,3], k = 4",
        "output": "[2,3]"
      }
    ],
    "hint1": "A naive count uses hash maps to count occurrences.",
    "hint2": "Use Moore's Voting algorithm variations if O(1) space is needed, or stick to frequency maps for simplicity.",
    "solution": {
      "python": "def solve(nums, k):\n    limit = len(nums) // k\n    from collections import Counter\n    return sorted([x for x, c in Counter(nums).items() if c > limit])",
      "cpp": "vector<int> solve(vector<int>& nums, int k) {\n    int limit = nums.size() / k;\n    unordered_map<int, int> mp;\n    for(int x : nums) mp[x]++;\n    vector<int> res;\n    for(auto& p : mp) {\n        if (p.second > limit) res.push_back(p.first);\n    }\n    sort(res.begin(), res.end());\n    return res;\n}",
      "java": "public int[] solve(int[] nums, int k) {\n    int limit = nums.length / k;\n    java.util.Map<Integer, Integer> map = new java.util.HashMap<>();\n    for(int x : nums) map.put(x, map.getOrDefault(x, 0) + 1);\n    java.util.List<Integer> list = new java.util.ArrayList<>();\n    for(java.util.Map.Entry<Integer, Integer> entry : map.entrySet()) {\n        if (entry.getValue() > limit) list.add(entry.getKey());\n    }\n    java.util.Collections.sort(list);\n    return list.stream().mapToInt(x -> x).toArray();\n}",
      "javascript": "function solve(nums, k) {\n    let limit = Math.floor(nums.length / k);\n    let map = {};\n    for(let x of nums) map[x] = (map[x] || 0) + 1;\n    let res = [];\n    for(let x in map) {\n        if (map[x] > limit) res.push(parseInt(x));\n    }\n    return res.sort((a,b)=>a-b);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Find All Elements That Appear More Than n/k Times\\ndef solve(nums, k):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Find All Elements That Appear More Than n/k Times\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nvector<int> solve(vector<int>& nums, int k) {\\n    // Write your solution here\\n    return {};\\n}",
      "java": "// Solution for Find All Elements That Appear More Than n/k Times\\nimport java.util.*;\\nclass Solution {\\n    public int[] solve(int[] nums, int k) {\\n        // Write your solution here\\n        return new int[]{};\\n    }\\n}",
      "javascript": "// Solution for Find All Elements That Appear More Than n/k Times\\nfunction solve(nums, k) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 147,
    "title": "Maximum Profit by Buying and Selling a Share Atmost Twice",
    "category": "Advanced Arrays",
    "difficulty": "Hard",
    "statement": "Given stock prices for each day, find the maximum profit that you can make by buying and selling shares at most twice.",
    "inputFormat": "prices = <array>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "prices = [10,22,5,75,65,80]",
        "output": "87"
      }
    ],
    "hint1": "Use state variables for transactions (first buy, first sell, second buy, second sell).",
    "hint2": "Maximize values iteratively: buy1 = max(buy1, -p), sell1 = max(sell1, buy1 + p), buy2 = max(buy2, sell1 - p), sell2 = max(sell2, buy2 + p).",
    "solution": {
      "python": "def solve(prices):\n    b1, s1, b2, s2 = -float('inf'), 0, -float('inf'), 0\n    for p in prices:\n        b1 = max(b1, -p)\n        s1 = max(s1, b1 + p)\n        b2 = max(b2, s1 - p)\n        s2 = max(s2, b2 + p)\n    return s2",
      "cpp": "int solve(vector<int>& prices) {\n    int b1 = -1e9, s1 = 0, b2 = -1e9, s2 = 0;\n    for(int p : prices) {\n        b1 = max(b1, -p);\n        s1 = max(s1, b1 + p);\n        b2 = max(b2, s1 - p);\n        s2 = max(s2, b2 + p);\n    }\n    return s2;\n}",
      "java": "public int solve(int[] prices) {\n    int b1 = Integer.MIN_VALUE, s1 = 0, b2 = Integer.MIN_VALUE, s2 = 0;\n    for(int p : prices) {\n        b1 = Math.max(b1, -p);\n        s1 = Math.max(s1, b1 + p);\n        b2 = Math.max(b2, s1 - p);\n        s2 = Math.max(s2, b2 + p);\n    }\n    return s2;\n}",
      "javascript": "function solve(prices) {\n    let b1 = -Infinity, s1 = 0, b2 = -Infinity, s2 = 0;\n    for(let p of prices) {\n        b1 = Math.max(b1, -p);\n        s1 = Math.max(s1, b1 + p);\n        b2 = Math.max(b2, s1 - p);\n        s2 = Math.max(s2, b2 + p);\n    }\n    return s2;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Maximum Profit by Buying and Selling a Share Atmost Twice\\ndef solve(prices):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Maximum Profit by Buying and Selling a Share Atmost Twice\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve() {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Maximum Profit by Buying and Selling a Share Atmost Twice\\nimport java.util.*;\\nclass Solution {\\n    public int solve() {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Maximum Profit by Buying and Selling a Share Atmost Twice\\nfunction solve(prices) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 148,
    "title": "Next Permutation",
    "category": "Advanced Arrays",
    "difficulty": "Medium",
    "statement": "Rearrange numbers into the lexicographically next greater permutation of numbers.",
    "inputFormat": "nums = <array>",
    "outputFormat": "Array of integers",
    "examples": [
      {
        "input": "nums = [1,2,3]",
        "output": "[1,3,2]"
      },
      {
        "input": "nums = [3,2,1]",
        "output": "[1,2,3]"
      }
    ],
    "hint1": "Find the first decreasing element from right (index i).",
    "hint2": "Find the next larger element than nums[i] from right, swap them, and reverse the subarray to the right of index i.",
    "solution": {
      "python": "def solve(nums):\n    n = len(nums)\n    i = n - 2\n    while i >= 0 and nums[i] >= nums[i+1]: i -= 1\n    if i >= 0:\n        j = n - 1\n        while nums[j] <= nums[i]: j -= 1\n        nums[i], nums[j] = nums[j], nums[i]\n    nums[i+1:] = reversed(nums[i+1:])\n    return nums",
      "cpp": "vector<int> solve(vector<int>& nums) {\n    next_permutation(nums.begin(), nums.end());\n    return nums;\n}",
      "java": "public int[] solve(int[] nums) {\n    int n = nums.length;\n    int i = n - 2;\n    while (i >= 0 && nums[i] >= nums[i + 1]) i--;\n    if (i >= 0) {\n        int j = n - 1;\n        while (nums[j] <= nums[i]) j--;\n        swap(nums, i, j);\n    }\n    reverse(nums, i + 1, n - 1);\n    return nums;\n}\nprivate void swap(int[] arr, int i, int j) {\n    int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;\n}\nprivate void reverse(int[] arr, int l, int r) {\n    while(l < r) swap(arr, l++, r--);\n}",
      "javascript": "function solve(nums) {\n    let n = nums.length;\n    let i = n - 2;\n    while (i >= 0 && nums[i] >= nums[i + 1]) i--;\n    if (i >= 0) {\n        let j = n - 1;\n        while (nums[j] <= nums[i]) j--;\n        [nums[i], nums[j]] = [nums[j], nums[i]];\n    }\n    let l = i + 1, r = n - 1;\n    while (l < r) {\n        [nums[l], nums[r]] = [nums[r], nums[l]];\n        l++; r--;\n    }\n    return nums;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Next Permutation\\ndef solve(nums):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Next Permutation\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nvector<int> solve(vector<int>& nums) {\\n    // Write your solution here\\n    return {};\\n}",
      "java": "// Solution for Next Permutation\\nimport java.util.*;\\nclass Solution {\\n    public int[] solve(int[] nums) {\\n        // Write your solution here\\n        return new int[]{};\\n    }\\n}",
      "javascript": "// Solution for Next Permutation\\nfunction solve(nums) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 149,
    "title": "Find Longest Consecutive Subsequence",
    "category": "Advanced Arrays",
    "difficulty": "Medium",
    "statement": "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.",
    "inputFormat": "nums = <array>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "nums = [100,4,200,1,3,2]",
        "output": "4"
      }
    ],
    "hint1": "Insert all array elements into a Set.",
    "hint2": "For each element, check if it is the start of a sequence (x-1 is not in the set). If so, count the consecutive sequence length.",
    "solution": {
      "python": "def solve(nums):\n    s = set(nums)\n    longest = 0\n    for x in s:\n        if (x - 1) not in s:\n            curr = x\n            streak = 1\n            while (curr + 1) in s:\n                curr += 1\n                streak += 1\n            longest = max(longest, streak)\n    return longest",
      "cpp": "int solve(vector<int>& nums) {\n    unordered_set<int> s(nums.begin(), nums.end());\n    int longest = 0;\n    for(int x : s) {\n        if (!s.count(x - 1)) {\n            int curr = x;\n            int streak = 1;\n            while (s.count(curr + 1)) {\n                curr++;\n                streak++;\n            }\n            longest = max(longest, streak);\n        }\n    }\n    return longest;\n}",
      "java": "public int solve(int[] nums) {\n    java.util.Set<Integer> s = new java.util.HashSet<>();\n    for(int x : nums) s.add(x);\n    int longest = 0;\n    for(int x : s) {\n        if (!s.contains(x - 1)) {\n            int curr = x;\n            int streak = 1;\n            while (s.contains(curr + 1)) {\n                curr++;\n                streak++;\n            }\n            longest = Math.max(longest, streak);\n        }\n    }\n    return longest;\n}",
      "javascript": "function solve(nums) { \n    let s = new Set(nums);\n    let longest = 0;\n    for(let x of s) {\n        if (!s.has(x - 1)) {\n            let curr = x;\n            let streak = 1;\n            while (s.has(curr + 1)) {\n                curr++;\n                streak++;\n            }\n            longest = Math.max(longest, streak);\n        }\n    }\n    return longest;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Find Longest Consecutive Subsequence\\ndef solve(nums):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Find Longest Consecutive Subsequence\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(vector<int>& nums) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Find Longest Consecutive Subsequence\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int[] nums) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Find Longest Consecutive Subsequence\\nfunction solve(nums) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 150,
    "title": "Trapping Rain Water Problem",
    "category": "Advanced Arrays",
    "difficulty": "Hard",
    "statement": "Given n non-negative integers representing an elevation map where width of each bar is 1, compute how much water it can trap after raining.",
    "inputFormat": "nums = <array>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "nums = [0,1,0,2,1,0,1,3,2,1,2,1]",
        "output": "6"
      }
    ],
    "hint1": "Use two pointers (left and right).",
    "hint2": "Track max values seen leftMax and rightMax, adding differences to trapped water depending on which pointer is smaller.",
    "solution": {
      "python": "def solve(nums):\n    if not nums: return 0\n    l, r = 0, len(nums) - 1\n    l_max, r_max = nums[l], nums[r]\n    water = 0\n    while l < r:\n        if l_max < r_max:\n            l += 1\n            l_max = max(l_max, nums[l])\n            water += l_max - nums[l]\n        else:\n            r -= 1\n            r_max = max(r_max, nums[r])\n            water += r_max - nums[r]\n    return water",
      "cpp": "int solve(vector<int>& nums) {\n    if (nums.empty()) return 0;\n    int l = 0, r = nums.size() - 1;\n    int l_max = nums[l], r_max = nums[r], water = 0;\n    while(l < r) {\n        if (l_max < r_max) {\n            l++;\n            l_max = max(l_max, nums[l]);\n            water += l_max - nums[l];\n        } else {\n            r--;\n            r_max = max(r_max, nums[r]);\n            water += r_max - nums[r];\n        }\n    }\n    return water;\n}",
      "java": "public int solve(int[] nums) {\n    if (nums.length == 0) return 0;\n    int l = 0, r = nums.length - 1;\n    int lMax = nums[l], rMax = nums[r], water = 0;\n    while(l < r) {\n        if (lMax < rMax) {\n            l++;\n            lMax = Math.max(lMax, nums[l]);\n            water += lMax - nums[l];\n        } else {\n            r--;\n            rMax = Math.max(rMax, nums[r]);\n            water += rMax - nums[r];\n        }\n    }\n    return water;\n}",
      "javascript": "function solve(nums) {\n    if (nums.length === 0) return 0;\n    let l = 0, r = nums.length - 1;\n    let lMax = nums[l], rMax = nums[r], water = 0;\n    while(l < r) {\n        if (lMax < rMax) {\n            l++;\n            lMax = Math.max(lMax, nums[l]);\n            water += lMax - nums[l];\n        } else {\n            r--;\n            rMax = Math.max(rMax, nums[r]);\n            water += rMax - nums[r];\n        }\n    }\n    return water;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Trapping Rain Water Problem\\ndef solve(nums):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Trapping Rain Water Problem\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(vector<int>& nums) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Trapping Rain Water Problem\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int[] nums) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Trapping Rain Water Problem\\nfunction solve(nums) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 151,
    "title": "Chocolate Distribution Problem",
    "category": "Advanced Arrays",
    "difficulty": "Easy",
    "statement": "Given chocolate packets array, distribute packets to m students such that difference between max and min packets is minimized.",
    "inputFormat": "nums = <array>, m = <integer>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "nums = [7,3,2,4,9,12,56], m = 3",
        "output": "2"
      }
    ],
    "hint1": "Sort the packets array in ascending order.",
    "hint2": "Find the sliding window of size m with the minimum difference between end and start values.",
    "solution": {
      "python": "def solve(nums, m):\n    nums.sort()\n    min_diff = float('inf')\n    for i in range(len(nums) - m + 1):\n        min_diff = min(min_diff, nums[i + m - 1] - nums[i])\n    return min_diff",
      "cpp": "int solve(vector<int>& nums, int m) {\n    sort(nums.begin(), nums.end());\n    int min_diff = 1e9;\n    for(int i = 0; i <= (int)nums.size() - m; i++) {\n        min_diff = min(min_diff, nums[i + m - 1] - nums[i]);\n    }\n    return min_diff;\n}",
      "java": "public int solve(int[] nums, int m) {\n    java.util.Arrays.sort(nums);\n    int minDiff = Integer.MAX_VALUE;\n    for(int i = 0; i <= nums.length - m; i++) {\n        minDiff = Math.min(minDiff, nums[i + m - 1] - nums[i]);\n    }\n    return minDiff;\n}",
      "javascript": "function solve(nums, m) {\n    nums.sort((a,b)=>a-b);\n    let minDiff = Infinity;\n    for(let i = 0; i <= nums.length - m; i++) {\n        minDiff = Math.min(minDiff, nums[i + m - 1] - nums[i]);\n    }\n    return minDiff;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Chocolate Distribution Problem\\ndef solve(nums, m):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Chocolate Distribution Problem\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(vector<int>& nums, int m) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Chocolate Distribution Problem\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int[] nums, int m) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Chocolate Distribution Problem\\nfunction solve(nums, m) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 152,
    "title": "Smallest Subarray With Sum Greater Than a Given Value",
    "category": "Advanced Arrays",
    "difficulty": "Hard",
    "statement": "Given positive integers nums and value x, find the minimal length of a contiguous subarray whose sum is greater than x. Return 0 if none exist.",
    "inputFormat": "nums = <array>, x = <integer>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "nums = [1,4,45,6,0,19], x = 51",
        "output": "3"
      }
    ],
    "hint1": "Use a sliding window / two pointers approach (left and right).",
    "hint2": "Expand window sum. Once sum > x, contract window from left while keeping sum > x, recording minimal lengths.",
    "solution": {
      "python": "def solve(nums, x):\n    l = curr = 0\n    ans = float('inf')\n    for r in range(len(nums)):\n        curr += nums[r]\n        while curr > x:\n            ans = min(ans, r - l + 1)\n            curr -= nums[l]\n            l += 1\n    return ans if ans != float('inf') else 0",
      "cpp": "int solve(vector<int>& nums, int x) {\n    int l = 0, curr = 0, ans = 1e9;\n    for(int r = 0; r < (int)nums.size(); r++) {\n        curr += nums[r];\n        while (curr > x) {\n            ans = min(ans, r - l + 1);\n            curr -= nums[l++];\n        }\n    }\n    return ans == 1e9 ? 0 : ans;\n}",
      "java": "public int solve(int[] nums, int x) {\n    int l = 0, curr = 0, ans = Integer.MAX_VALUE;\n    for(int r = 0; r < nums.length; r++) {\n        curr += nums[r];\n        while (curr > x) {\n            ans = Math.min(ans, r - l + 1);\n            curr -= nums[l++];\n        }\n    }\n    return ans == Integer.MAX_VALUE ? 0 : ans;\n}",
      "javascript": "function solve(nums, x) {\n    let l = 0, curr = 0, ans = Infinity;\n    for(let r = 0; r < nums.length; r++) {\n        curr += nums[r];\n        while (curr > x) {\n            ans = Math.min(ans, r - l + 1);\n            curr -= nums[l++];\n        }\n    }\n    return ans === Infinity ? 0 : ans;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Smallest Subarray With Sum Greater Than a Given Value\\ndef solve(nums, x):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Smallest Subarray With Sum Greater Than a Given Value\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(vector<int>& nums, int x) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Smallest Subarray With Sum Greater Than a Given Value\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int[] nums, int x) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Smallest Subarray With Sum Greater Than a Given Value\\nfunction solve(nums, x) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 153,
    "title": "Three Way Partitioning of an Array Around a Given Value",
    "category": "Advanced Arrays",
    "difficulty": "Medium",
    "statement": "Given an array and range [low, high], partition array such that elements < low come first, low <= elements <= high come next, elements > high come last.",
    "inputFormat": "nums = <array>, low = <integer>, high = <integer>",
    "outputFormat": "Array of integers",
    "examples": [
      {
        "input": "nums = [1,14,5,20,4,2,54,20,87,98,3,1,32], low = 14, high = 20",
        "output": "[1,5,4,2,3,1,14,20,20,54,87,98,32]"
      }
    ],
    "hint1": "Similar to Dutch National Flag. Use three pointers (start, mid, end).",
    "hint2": "If nums[mid] < low, swap start and mid, increment both. If nums[mid] > high, swap mid and end, decrement end.",
    "solution": {
      "python": "def solve(nums, low, high):\n    s, m, e = 0, 0, len(nums) - 1\n    while m <= e:\n        if nums[m] < low:\n            nums[s], nums[m] = nums[m], nums[s]\n            s += 1; m += 1\n        elif nums[m] > high:\n            nums[m], nums[e] = nums[e], nums[m]\n            e -= 1\n        else:\n            m += 1\n    return nums",
      "cpp": "vector<int> solve(vector<int>& nums, int low, int high) {\n    int s = 0, m = 0, e = nums.size() - 1;\n    while(m <= e) {\n        if (nums[m] < low) swap(nums[s++], nums[m++]);\n        else if (nums[m] > high) swap(nums[m], nums[e--]);\n        else m++;\n    }\n    return nums;\n}",
      "java": "public int[] solve(int[] nums, int low, int high) {\n    int s = 0, m = 0, e = nums.length - 1;\n    while(m <= e) {\n        if (nums[m] < low) {\n            int temp = nums[s]; nums[s++] = nums[m]; nums[m++] = temp;\n        } else if (nums[m] > high) {\n            int temp = nums[e]; nums[e--] = nums[m]; nums[m] = temp;\n        } else m++;\n    }\n    return nums;\n}",
      "javascript": "function solve(nums, low, high) {\n    let s = 0, m = 0, e = nums.length - 1;\n    while(m <= e) {\n        if (nums[m] < low) {\n            [nums[s], nums[m]] = [nums[m], nums[s]];\n            s++; m++;\n        } else if (nums[m] > high) {\n            [nums[m], nums[e]] = [nums[e], nums[m]];\n            e--;\n        } else m++;\n    }\n    return nums;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Three Way Partitioning of an Array Around a Given Value\\ndef solve(nums, low, high):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Three Way Partitioning of an Array Around a Given Value\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nvector<int> solve(vector<int>& nums, int low, int high) {\\n    // Write your solution here\\n    return {};\\n}",
      "java": "// Solution for Three Way Partitioning of an Array Around a Given Value\\nimport java.util.*;\\nclass Solution {\\n    public int[] solve(int[] nums, int low, int high) {\\n        // Write your solution here\\n        return new int[]{};\\n    }\\n}",
      "javascript": "// Solution for Three Way Partitioning of an Array Around a Given Value\\nfunction solve(nums, low, high) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 154,
    "title": "Minimum Operations Required to Make Array Palindrome",
    "category": "Advanced Arrays",
    "difficulty": "Hard",
    "statement": "Given positive integers nums, find minimum merge operations to make the array palindromic (combining adjacent elements).",
    "inputFormat": "nums = <array>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "nums = [1,4,5,1]",
        "output": "1"
      }
    ],
    "hint1": "Use two pointers (i starting at 0, j starting at end).",
    "hint2": "If nums[i] == nums[j], increment i and decrement j. If nums[i] < nums[j], merge nums[i] and nums[i+1] and increment operations count.",
    "solution": {
      "python": "def solve(nums):\n    i, j = 0, len(nums) - 1\n    ops = 0\n    while i <= j:\n        if nums[i] == nums[j]:\n            i += 1; j -= 1\n        elif nums[i] < nums[j]:\n            nums[i+1] += nums[i]\n            i += 1; ops += 1\n        else:\n            nums[j-1] += nums[j]\n            j -= 1; ops += 1\n    return ops",
      "cpp": "int solve(vector<int>& nums) {\n    int i = 0, j = nums.size() - 1, ops = 0;\n    while(i <= j) {\n        if (nums[i] == nums[j]) { i++; j--; }\n        else if (nums[i] < nums[j]) {\n            nums[i+1] += nums[i];\n            i++; ops++;\n        } else {\n            nums[j-1] += nums[j];\n            j--; ops++;\n        }\n    }\n    return ops;\n}",
      "java": "public int solve(int[] nums) {\n    int i = 0, j = nums.length - 1, ops = 0;\n    while(i <= j) {\n        if (nums[i] == nums[j]) { i++; j--; }\n        else if (nums[i] < nums[j]) {\n            nums[i+1] += nums[i];\n            i++; ops++;\n        } else {\n            nums[j-1] += nums[j];\n            j--; ops++;\n        }\n    }\n    return ops;\n}",
      "javascript": "function solve(nums) {\n    let i = 0, j = nums.length - 1, ops = 0;\n    while(i <= j) {\n        if (nums[i] === nums[j]) { i++; j--; }\n        else if (nums[i] < nums[j]) {\n            nums[i+1] += nums[i];\n            i++; ops++;\n        } else {\n            nums[j-1] += nums[j];\n            j--; ops++;\n        }\n    }\n    return ops;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Minimum Operations Required to Make Array Palindrome\\ndef solve(nums):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Minimum Operations Required to Make Array Palindrome\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(vector<int>& nums) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Minimum Operations Required to Make Array Palindrome\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int[] nums) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Minimum Operations Required to Make Array Palindrome\\nfunction solve(nums) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 155,
    "title": "Median of 2 Sorted Arrays of Equal Size",
    "category": "Advanced Arrays",
    "difficulty": "Medium",
    "statement": "Given two sorted arrays of equal size n, return their median value as double.",
    "inputFormat": "arr1 = <array>, arr2 = <array>",
    "outputFormat": "Double",
    "examples": [
      {
        "input": "arr1 = [1,12,15,26,38], arr2 = [2,13,17,30,45]",
        "output": "16.0"
      }
    ],
    "hint1": "Combine both sorted arrays into one single sorted list.",
    "hint2": "The median of 2N elements is the average of elements at index N-1 and N.",
    "solution": {
      "python": "def solve(arr1, arr2):\n    comb = sorted(arr1 + arr2)\n    n = len(comb)\n    return (comb[n//2 - 1] + comb[n//2]) / 2.0",
      "cpp": "double solve(vector<int>& arr1, vector<int>& arr2) {\n    vector<int> comb = arr1;\n    comb.insert(comb.end(), arr2.begin(), arr2.end());\n    sort(comb.begin(), comb.end());\n    int n = comb.size();\n    return (comb[n/2 - 1] + comb[n/2]) / 2.0;\n}",
      "java": "public double solve(int[] arr1, int[] arr2) {\n    int n = arr1.length;\n    int[] comb = new int[2*n];\n    System.arraycopy(arr1, 0, comb, 0, n);\n    System.arraycopy(arr2, 0, comb, n, n);\n    java.util.Arrays.sort(comb);\n    return (comb[n - 1] + comb[n]) / 2.0;\n}",
      "javascript": "function solve(arr1, arr2) {\n    let comb = [...arr1, ...arr2].sort((a,b)=>a-b);\n    let n = comb.length;\n    return (comb[n/2 - 1] + comb[n/2]) / 2.0;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Median of 2 Sorted Arrays of Equal Size\\ndef solve(arr1, arr2):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Median of 2 Sorted Arrays of Equal Size\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\ndouble solve(vector<int>& arr1, vector<int>& arr2) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Median of 2 Sorted Arrays of Equal Size\\nimport java.util.*;\\nclass Solution {\\n    public double solve(int[] arr1, int[] arr2) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Median of 2 Sorted Arrays of Equal Size\\nfunction solve(arr1, arr2) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 156,
    "title": "Median of 2 Sorted Arrays of Different Size",
    "category": "Advanced Arrays",
    "difficulty": "Hard",
    "statement": "Given two sorted arrays of different sizes, find and return the overall median value.",
    "inputFormat": "arr1 = <array>, arr2 = <array>",
    "outputFormat": "Double",
    "examples": [
      {
        "input": "arr1 = [900], arr2 = [5,8,10,20]",
        "output": "10.0"
      }
    ],
    "hint1": "Merge both arrays into a single sorted list.",
    "hint2": "Identify middle element(s). If total length is odd, return middle element; else return average of two middle elements.",
    "solution": {
      "python": "def solve(arr1, arr2):\n    comb = sorted(arr1 + arr2)\n    n = len(comb)\n    if n % 2 == 1: return float(comb[n//2])\n    return (comb[n//2 - 1] + comb[n//2]) / 2.0",
      "cpp": "double solve(vector<int>& arr1, vector<int>& arr2) {\n    vector<int> comb = arr1;\n    comb.insert(comb.end(), arr2.begin(), arr2.end());\n    sort(comb.begin(), comb.end());\n    int n = comb.size();\n    if (n % 2 == 1) return comb[n/2];\n    return (comb[n/2 - 1] + comb[n/2]) / 2.0;\n}",
      "java": "public double solve(int[] arr1, int[] arr2) {\n    int[] comb = new int[arr1.length + arr2.length];\n    System.arraycopy(arr1, 0, comb, 0, arr1.length);\n    System.arraycopy(arr2, 0, comb, arr1.length, arr2.length);\n    java.util.Arrays.sort(comb);\n    int n = comb.length;\n    if (n % 2 == 1) return comb[n/2];\n    return (comb[n/2 - 1] + comb[n/2]) / 2.0;\n}",
      "javascript": "function solve(arr1, arr2) {\n    let comb = [...arr1, ...arr2].sort((a,b)=>a-b);\n    let n = comb.length;\n    if (n % 2 === 1) return comb[Math.floor(n/2)];\n    return (comb[n/2 - 1] + comb[n/2]) / 2.0;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Median of 2 Sorted Arrays of Different Size\\ndef solve(arr1, arr2):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Median of 2 Sorted Arrays of Different Size\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\ndouble solve(vector<int>& arr1, vector<int>& arr2) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Median of 2 Sorted Arrays of Different Size\\nimport java.util.*;\\nclass Solution {\\n    public double solve(int[] arr1, int[] arr2) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Median of 2 Sorted Arrays of Different Size\\nfunction solve(arr1, arr2) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 157,
    "title": "Spiral Traversal on a Matrix",
    "category": "Matrix",
    "difficulty": "Medium",
    "statement": "Given a 2D matrix, return an array of its elements traversed in spiral order.",
    "inputFormat": "matrix = <2d_array>",
    "outputFormat": "Array of integers",
    "examples": [
      {
        "input": "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        "output": "[1,2,3,6,9,8,7,4,5]"
      }
    ],
    "hint1": "Maintain boundaries: top, bottom, left, right.",
    "hint2": "Loop while top <= bottom and left <= right. Read top row, right col, bottom row, left col sequentially.",
    "solution": {
      "python": "def solve(matrix):\n    if not matrix: return []\n    res = []\n    t, b, l, r = 0, len(matrix)-1, 0, len(matrix[0])-1\n    while t <= b and l <= r:\n        for i in range(l, r+1): res.append(matrix[t][i])\n        t += 1\n        for i in range(t, b+1): res.append(matrix[i][r])\n        r -= 1\n        if t <= b:\n            for i in range(r, l-1, -1): res.append(matrix[b][i])\n            b -= 1\n        if l <= r:\n            for i in range(b, t-1, -1): res.append(matrix[i][l])\n            l += 1\n    return res",
      "cpp": "vector<int> solve(vector<vector<int>>& matrix) {\n    if (matrix.empty()) return {};\n    vector<int> res;\n    int t = 0, b = matrix.size()-1, l = 0, r = matrix[0].size()-1;\n    while(t <= b && l <= r) {\n        for(int i=l; i<=r; ++i) res.push_back(matrix[t][i]);\n        t++;\n        for(int i=t; i<=b; ++i) res.push_back(matrix[i][r]);\n        r--;\n        if(t <= b) {\n            for(int i=r; i>=l; --i) res.push_back(matrix[b][i]);\n            b--;\n        }\n        if(l <= r) {\n            for(int i=b; i>=t; --i) res.push_back(matrix[i][l]);\n            l++;\n        }\n    }\n    return res;\n}",
      "java": "public int[] solve(int[][] matrix) {\n    if (matrix.length == 0) return new int[]{};\n    java.util.List<Integer> list = new java.util.ArrayList<>();\n    int t = 0, b = matrix.length-1, l = 0, r = matrix[0].length-1;\n    while(t <= b && l <= r) {\n        for(int i=l; i<=r; ++i) list.add(matrix[t][i]);\n        t++;\n        for(int i=t; i<=b; ++i) list.add(matrix[i][r]);\n        r--;\n        if(t <= b) {\n            for(int i=r; i>=l; --i) list.add(matrix[b][i]);\n            b--;\n        }\n        if(l <= r) {\n            for(int i=b; i>=t; --i) list.add(matrix[i][l]);\n            l++;\n        }\n    }\n    return list.stream().mapToInt(x->x).toArray();\n}",
      "javascript": "function solve(matrix) {\n    if (matrix.length === 0) return [];\n    let res = [];\n    let t = 0, b = matrix.length-1, l = 0, r = matrix[0].length-1;\n    while(t <= b && l <= r) {\n        for(let i=l; i<=r; ++i) res.push(matrix[t][i]);\n        t++;\n        for(let i=t; i<=b; ++i) res.push(matrix[i][r]);\n        r--;\n        if(t <= b) {\n            for(let i=r; i>=l; --i) res.push(matrix[b][i]);\n            b--;\n        }\n        if(l <= r) {\n            for(let i=b; i>=t; --i) res.push(matrix[i][l]);\n            l++;\n        }\n    }\n    return res;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Spiral Traversal on a Matrix\\ndef solve(matrix):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Spiral Traversal on a Matrix\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nvector<int> solve(vector<vector<int>>& matrix) {\\n    // Write your solution here\\n    return {};\\n}",
      "java": "// Solution for Spiral Traversal on a Matrix\\nimport java.util.*;\\nclass Solution {\\n    public int[] solve(int[][] matrix) {\\n        // Write your solution here\\n        return new int[]{};\\n    }\\n}",
      "javascript": "// Solution for Spiral Traversal on a Matrix\\nfunction solve(matrix) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 158,
    "title": "Search an Element in a Matrix",
    "category": "Matrix",
    "difficulty": "Easy",
    "statement": "Given a sorted 2D matrix (where rows are sorted and first element of each row is larger than the last element of previous row), check if element target is present. Return true or false.",
    "inputFormat": "matrix = <2d_array>, target = <integer>",
    "outputFormat": "Boolean",
    "examples": [
      {
        "input": "matrix = [[1,3,5],[7,9,11],[13,15,17]], target = 9",
        "output": "true"
      },
      {
        "input": "matrix = [[1,3,5],[7,9,11],[13,15,17]], target = 6",
        "output": "false"
      }
    ],
    "hint1": "Treat the 2D matrix as a flat sorted 1D array.",
    "hint2": "Use binary search: index mid maps to row = mid / cols and col = mid % cols.",
    "solution": {
      "python": "def solve(matrix, target):\n    if not matrix: return False\n    r, c = len(matrix), len(matrix[0])\n    l, h = 0, r * c - 1\n    while l <= h:\n        mid = (l + h) // 2\n        val = matrix[mid // c][mid % c]\n        if val == target: return True\n        elif val < target: l = mid + 1\n        else: h = mid - 1\n    return False",
      "cpp": "bool solve(vector<vector<int>>& matrix, int target) {\n    if (matrix.empty()) return false;\n    int r = matrix.size(), c = matrix[0].size();\n    int l = 0, h = r * c - 1;\n    while(l <= h) {\n        int mid = l + (h - l) / 2;\n        int val = matrix[mid / c][mid % c];\n        if (val == target) return true;\n        else if (val < target) l = mid + 1;\n        else h = mid - 1;\n    }\n    return false;\n}",
      "java": "public boolean solve(int[][] matrix, int target) {\n    if (matrix.length == 0) return false;\n    int r = matrix.length, c = matrix[0].length;\n    int l = 0, h = r * c - 1;\n    while(l <= h) {\n        int mid = l + (h - l) / 2;\n        int val = matrix[mid / c][mid % c];\n        if (val == target) return true;\n        else if (val < target) l = mid + 1;\n        else h = mid - 1;\n    }\n    return false;\n}",
      "javascript": "function solve(matrix, target) {\n    if (matrix.length === 0) return false;\n    let r = matrix.length, c = matrix[0].length;\n    let l = 0, h = r * c - 1;\n    while(l <= h) {\n        let mid = Math.floor((l + h) / 2);\n        let val = matrix[Math.floor(mid / c)][mid % c];\n        if (val === target) return true;\n        else if (val < target) l = mid + 1;\n        else h = mid - 1;\n    }\n    return false;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Search an Element in a Matrix\\ndef solve(matrix, target):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Search an Element in a Matrix\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nbool solve(vector<vector<int>>& matrix) {\\n    // Write your solution here\\n    return false;\\n}",
      "java": "// Solution for Search an Element in a Matrix\\nimport java.util.*;\\nclass Solution {\\n    public boolean solve(int[][] matrix) {\\n        // Write your solution here\\n        return false;\\n    }\\n}",
      "javascript": "// Solution for Search an Element in a Matrix\\nfunction solve(matrix, target) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 159,
    "title": "Find Median in a Row Wise Sorted Matrix",
    "category": "Matrix",
    "difficulty": "Hard",
    "statement": "Given a row-wise sorted matrix of dimensions r x c (where r and c are odd numbers), find the median of the matrix.",
    "inputFormat": "matrix = <2d_array>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "matrix = [[1,3,5],[2,6,9],[3,6,9]]",
        "output": "5"
      }
    ],
    "hint1": "Combine all matrix elements into a single array.",
    "hint2": "Sort the array and return the element at middle index ((R*C)/2).",
    "solution": {
      "python": "def solve(matrix):\n    flat = sorted([val for row in matrix for val in row])\n    return flat[len(flat) // 2]",
      "cpp": "int solve(vector<vector<int>>& matrix) {\n    vector<int> flat;\n    for(auto& r : matrix) flat.insert(flat.end(), r.begin(), r.end());\n    sort(flat.begin(), flat.end());\n    return flat[flat.size() / 2];\n}",
      "java": "public int solve(int[][] matrix) {\n    java.util.List<Integer> flat = new java.util.ArrayList<>();\n    for(int[] row : matrix) {\n        for(int val : row) flat.add(val);\n    }\n    java.util.Collections.sort(flat);\n    return flat.get(flat.size() / 2);\n}",
      "javascript": "function solve(matrix) {\n    let flat = matrix.flat().sort((a,b)=>a-b);\n    return flat[Math.floor(flat.length / 2)];\n}"
    },
    "boilerplate": {
      "python": "# Solution for Find Median in a Row Wise Sorted Matrix\\ndef solve(matrix):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Find Median in a Row Wise Sorted Matrix\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(vector<vector<int>>& matrix) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Find Median in a Row Wise Sorted Matrix\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int[][] matrix) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Find Median in a Row Wise Sorted Matrix\\nfunction solve(matrix) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 160,
    "title": "Find Row With Maximum No. of 1's",
    "category": "Matrix",
    "difficulty": "Medium",
    "statement": "Given a boolean 2D matrix of dimensions r x c where each row is sorted, find the 0-based index of the row that has the maximum number of 1's. Return -1 if no 1 is present.",
    "inputFormat": "matrix = <2d_array>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "matrix = [[0,1,1,1],[0,0,1,1],[1,1,1,1],[0,0,0,0]]",
        "output": "2"
      }
    ],
    "hint1": "Traverse each row and count the number of 1s.",
    "hint2": "Alternatively, start at top-right corner. If element is 1, move left to check for more 1s and record row index; if 0, move down.",
    "solution": {
      "python": "def solve(matrix):\n    if not matrix: return -1\n    max_idx = -1\n    max_cnt = 0\n    for i, row in enumerate(matrix):\n        cnt = row.count(1)\n        if cnt > max_cnt:\n            max_cnt = cnt\n            max_idx = i\n    return max_idx",
      "cpp": "int solve(vector<vector<int>>& matrix) {\n    if (matrix.empty()) return -1;\n    int r = matrix.size(), c = matrix[0].size();\n    int max_row_idx = -1, col = c - 1;\n    for(int i=0; i<r; ++i) {\n        while(col >= 0 && matrix[i][col] == 1) {\n            col--;\n            max_row_idx = i;\n        }\n    }\n    return max_row_idx;\n}",
      "java": "public int solve(int[][] matrix) {\n    if (matrix.length == 0) return -1;\n    int r = matrix.length, c = matrix[0].length;\n    int maxRowIdx = -1, col = c - 1;\n    for(int i=0; i<r; ++i) {\n        while(col >= 0 && matrix[i][col] == 1) {\n            col--;\n            maxRowIdx = i;\n        }\n    }\n    return maxRowIdx;\n}",
      "javascript": "function solve(matrix) {\n    if (matrix.length === 0) return -1;\n    let r = matrix.length, c = matrix[0].length;\n    let maxRowIdx = -1, col = c - 1;\n    for(let i=0; i<r; ++i) {\n        while(col >= 0 && matrix[i][col] === 1) {\n            col--;\n            maxRowIdx = i;\n        }\n    }\n    return maxRowIdx;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Find Row With Maximum No. of 1's\\ndef solve(matrix):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Find Row With Maximum No. of 1's\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(vector<vector<int>>& matrix) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Find Row With Maximum No. of 1's\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int[][] matrix) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Find Row With Maximum No. of 1's\\nfunction solve(matrix) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 161,
    "title": "Print Elements in Sorted Order Using Row-Column Wise Sorted Matrix",
    "category": "Matrix",
    "difficulty": "Medium",
    "statement": "Given an n x n matrix where every row and column is sorted in increasing order, return all elements in a single sorted ascending array.",
    "inputFormat": "matrix = <2d_array>",
    "outputFormat": "Array of integers",
    "examples": [
      {
        "input": "matrix = [[10,20,30],[15,25,35],[27,29,37]]",
        "output": "[10,15,20,25,27,29,30,35,37]"
      }
    ],
    "hint1": "Flatten the 2D matrix into a 1D list.",
    "hint2": "Sort the flattened list in ascending order.",
    "solution": {
      "python": "def solve(matrix):\n    return sorted([x for row in matrix for x in row])",
      "cpp": "vector<int> solve(vector<vector<int>>& matrix) {\n    vector<int> flat;\n    for(auto& r : matrix) flat.insert(flat.end(), r.begin(), r.end());\n    sort(flat.begin(), flat.end());\n    return flat;\n}",
      "java": "public int[] solve(int[][] matrix) {\n    java.util.List<Integer> flat = new java.util.ArrayList<>();\n    for(int[] row : matrix) for(int val : row) flat.add(val);\n    java.util.Collections.sort(flat);\n    return flat.stream().mapToInt(x->x).toArray();\n}",
      "javascript": "function solve(matrix) {\n    return matrix.flat().sort((a,b)=>a-b);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Print Elements in Sorted Order Using Row-Column Wise Sorted Matrix\\ndef solve(matrix):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Print Elements in Sorted Order Using Row-Column Wise Sorted Matrix\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nvector<int> solve(vector<vector<int>>& matrix) {\\n    // Write your solution here\\n    return {};\\n}",
      "java": "// Solution for Print Elements in Sorted Order Using Row-Column Wise Sorted Matrix\\nimport java.util.*;\\nclass Solution {\\n    public int[] solve(int[][] matrix) {\\n        // Write your solution here\\n        return new int[]{};\\n    }\\n}",
      "javascript": "// Solution for Print Elements in Sorted Order Using Row-Column Wise Sorted Matrix\\nfunction solve(matrix) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 162,
    "title": "Find a Specific Pair in Matrix",
    "category": "Matrix",
    "difficulty": "Hard",
    "statement": "Given an n x n matrix, find the maximum value of matrix[c][d] - matrix[a][b] such that c > a and d > b.",
    "inputFormat": "matrix = <2d_array>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "matrix = [[1,2,-1,-4,-20],[-8,-3,4,2,1],[3,8,6,1,3],[-4,-1,1,7,-6],[0,-4,10,-5,1]]",
        "output": "18"
      }
    ],
    "hint1": "To do this in O(N^2) time, precalculate maximum values starting from bottom right.",
    "hint2": "Create a maxMat 2D array maxMat[i][j] storing the maximum value from matrix[i][j] to matrix[n-1][n-1]. Compare elements with current positions.",
    "solution": {
      "python": "def solve(matrix):\n    n = len(matrix)\n    max_val = -float('inf')\n    max_mat = [[0]*n for _ in range(n)]\n    max_mat[n-1][n-1] = matrix[n-1][n-1]\n    for j in range(n-2, -1, -1):\n        max_mat[n-1][j] = max(matrix[n-1][j], max_mat[n-1][j+1])\n    for i in range(n-2, -1, -1):\n        max_mat[i][n-1] = max(matrix[i][n-1], max_mat[i+1][n-1])\n    for i in range(n-2, -1, -1):\n        for j in range(n-2, -1, -1):\n            if max_mat[i+1][j+1] - matrix[i][j] > max_val:\n                max_val = max_mat[i+1][j+1] - matrix[i][j]\n            max_mat[i][j] = max({matrix[i][j], max_mat[i+1][j], max_mat[i][j+1]})\n    return max_val",
      "cpp": "int solve(vector<vector<int>>& matrix) {\n    int n = matrix.size();\n    int max_val = -1e9;\n    vector<vector<int>> max_mat(n, vector<int>(n, 0));\n    max_mat[n-1][n-1] = matrix[n-1][n-1];\n    for(int j = n-2; j >= 0; j--) max_mat[n-1][j] = max(matrix[n-1][j], max_mat[n-1][j+1]);\n    for(int i = n-2; i >= 0; i--) max_mat[i][n-1] = max(matrix[i][n-1], max_mat[i+1][n-1]);\n    for(int i = n-2; i >= 0; i--) {\n        for(int j = n-2; j >= 0; j--) {\n            if (max_mat[i+1][j+1] - matrix[i][j] > max_val) {\n                max_val = max_mat[i+1][j+1] - matrix[i][j];\n            }\n            max_mat[i][j] = max({matrix[i][j], max_mat[i+1][j], max_mat[i][j+1]});\n        }\n    }\n    return max_val;\n}",
      "java": "public int solve(int[][] matrix) {\n    int n = matrix.length;\n    int maxVal = Integer.MIN_VALUE;\n    int[][] maxMat = new int[n][n];\n    maxMat[n-1][n-1] = matrix[n-1][n-1];\n    for(int j = n-2; j >= 0; j--) maxMat[n-1][j] = Math.max(matrix[n-1][j], maxMat[n-1][j+1]);\n    for(int i = n-2; i >= 0; i--) maxMat[i][n-1] = Math.max(matrix[i][n-1], maxMat[i+1][n-1]);\n    for(int i = n-2; i >= 0; i--) {\n        for(int j = n-2; j >= 0; j--) {\n            if (maxMat[i+1][j+1] - matrix[i][j] > maxVal) {\n                maxVal = maxMat[i+1][j+1] - matrix[i][j];\n            }\n            maxMat[i][j] = Math.max(matrix[i][j], Math.max(maxMat[i+1][j], maxMat[i][j+1]));\n        }\n    }\n    return maxVal;\n}",
      "javascript": "function solve(matrix) {\n    let n = matrix.length;\n    let maxVal = -Infinity;\n    let maxMat = Array.from({length: n}, () => new Array(n).fill(0));\n    maxMat[n-1][n-1] = matrix[n-1][n-1];\n    for(let j = n-2; j >= 0; j--) maxMat[n-1][j] = Math.max(matrix[n-1][j], maxMat[n-1][j+1]);\n    for(let i = n-2; i >= 0; i--) maxMat[i][n-1] = Math.max(matrix[i][n-1], maxMat[i+1][n-1]);\n    for(let i = n-2; i >= 0; i--) {\n        for(let j = n-2; j >= 0; j--) {\n            if (maxMat[i+1][j+1] - matrix[i][j] > maxVal) {\n                maxVal = maxMat[i+1][j+1] - matrix[i][j];\n            }\n            maxMat[i][j] = Math.max(matrix[i][j], maxMat[i+1][j], maxMat[i][j+1]);\n        }\n    }\n    return maxVal;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Find a Specific Pair in Matrix\\ndef solve(matrix):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Find a Specific Pair in Matrix\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(vector<vector<int>>& matrix) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Find a Specific Pair in Matrix\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int[][] matrix) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Find a Specific Pair in Matrix\\nfunction solve(matrix) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 163,
    "title": "Rotate Matrix by 90 Degrees",
    "category": "Matrix",
    "difficulty": "Medium",
    "statement": "Given an n x n 2D matrix, rotate it by 90 degrees clockwise in-place.",
    "inputFormat": "matrix = <2d_array>",
    "outputFormat": "2D Array of integers",
    "examples": [
      {
        "input": "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        "output": "[[7,4,1],[8,5,2],[9,6,3]]"
      }
    ],
    "hint1": "First, transpose the matrix (swap matrix[i][j] with matrix[j][i]).",
    "hint2": "Then, reverse each row of the transposed matrix.",
    "solution": {
      "python": "def solve(matrix):\n    n = len(matrix)\n    for i in range(n):\n        for j in range(i + 1, n):\n            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]\n    for i in range(n):\n        matrix[i].reverse()\n    return matrix",
      "cpp": "vector<vector<int>> solve(vector<vector<int>>& matrix) {\n    int n = matrix.size();\n    for(int i=0; i<n; ++i) {\n        for(int j=i+1; j<n; ++j) swap(matrix[i][j], matrix[j][i]);\n    }\n    for(int i=0; i<n; ++i) reverse(matrix[i].begin(), matrix[i].end());\n    return matrix;\n}",
      "java": "public int[][] solve(int[][] matrix) {\n    int n = matrix.length;\n    for(int i=0; i<n; ++i) {\n        for(int j=i+1; j<n; ++j) {\n            int temp = matrix[i][j];\n            matrix[i][j] = matrix[j][i];\n            matrix[j][i] = temp;\n        }\n    }\n    for(int i=0; i<n; ++i) {\n        int l = 0, r = n - 1;\n        while(l < r) {\n            int temp = matrix[i][l];\n            matrix[i][l] = matrix[i][r];\n            matrix[i][r] = temp;\n            l++; r--;\n        }\n    }\n    return matrix;\n}",
      "javascript": "function solve(matrix) {\n    let n = matrix.length;\n    for(let i=0; i<n; ++i) {\n        for(let j=i+1; j<n; ++j) {\n            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];\n        }\n    }\n    for(let i=0; i<n; ++i) {\n        matrix[i].reverse();\n    }\n    return matrix;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Rotate Matrix by 90 Degrees\\ndef solve(matrix):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Rotate Matrix by 90 Degrees\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nvector<vector<int>> solve(vector<vector<int>>& matrix) {\\n    // Write your solution here\\n    return {};\\n}",
      "java": "// Solution for Rotate Matrix by 90 Degrees\\nimport java.util.*;\\nclass Solution {\\n    public int[][] solve(int[][] matrix) {\\n        // Write your solution here\\n        return new int[][]{};\\n    }\\n}",
      "javascript": "// Solution for Rotate Matrix by 90 Degrees\\nfunction solve(matrix) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 164,
    "title": "Kth Smallest Element in a Row-Column Wise Sorted Matrix",
    "category": "Matrix",
    "difficulty": "Hard",
    "statement": "Given an n x n matrix where each row and column is sorted, find the kth smallest element.",
    "inputFormat": "matrix = <2d_array>, k = <integer>",
    "outputFormat": "Integer",
    "examples": [
      {
        "input": "matrix = [[16,28,60],[22,30,62],[25,35,67]], k = 3",
        "output": "25"
      }
    ],
    "hint1": "Flatten the 2D matrix into a 1D list.",
    "hint2": "Sort the elements in ascending order and return the element at index k-1.",
    "solution": {
      "python": "def solve(matrix, k):\n    flat = sorted([x for row in matrix for x in row])\n    return flat[k - 1]",
      "cpp": "int solve(vector<vector<int>>& matrix, int k) {\n    vector<int> flat;\n    for(auto& r : matrix) flat.insert(flat.end(), r.begin(), r.end());\n    sort(flat.begin(), flat.end());\n    return flat[k - 1];\n}",
      "java": "public int solve(int[][] matrix, int k) {\n    java.util.List<Integer> flat = new java.util.ArrayList<>();\n    for(int[] row : matrix) for(int val : row) flat.add(val);\n    java.util.Collections.sort(flat);\n    return flat.get(k - 1);\n}",
      "javascript": "function solve(matrix, k) {\n    let flat = matrix.flat().sort((a,b)=>a-b);\n    return flat[k - 1];\n}"
    },
    "boilerplate": {
      "python": "# Solution for Kth Smallest Element in a Row-Column Wise Sorted Matrix\\ndef solve(matrix, k):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Kth Smallest Element in a Row-Column Wise Sorted Matrix\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(vector<vector<int>>& matrix, int k) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Kth Smallest Element in a Row-Column Wise Sorted Matrix\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int[][] matrix, int k) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Kth Smallest Element in a Row-Column Wise Sorted Matrix\\nfunction solve(matrix, k) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 165,
    "title": "Common Elements in All Rows of a Given Matrix",
    "category": "Matrix",
    "difficulty": "Medium",
    "statement": "Given an m x n matrix, find all common elements present in all rows and return them in a sorted list.",
    "inputFormat": "matrix = <2d_array>",
    "outputFormat": "Array of integers",
    "examples": [
      {
        "input": "matrix = [[1,2,3,4],[2,4,5,8],[3,2,9,4]]",
        "output": "[2,4]"
      }
    ],
    "hint1": "Use sets for each row containing distinct elements.",
    "hint2": "Find the intersection of sets of all rows, and return the elements in sorted order.",
    "solution": {
      "python": "def solve(matrix):\n    if not matrix: return []\n    res = set(matrix[0])\n    for row in matrix[1:]:\n        res = res.intersection(set(row))\n    return sorted(list(res))",
      "cpp": "vector<int> solve(vector<vector<int>>& matrix) {\n    if (matrix.empty()) return {};\n    unordered_map<int, int> mp;\n    for (int x : matrix[0]) mp[x] = 1;\n    for (size_t i = 1; i < matrix.size(); i++) {\n        for (int x : matrix[i]) {\n            if (mp[x] == (int)i) mp[x] = i + 1;\n        }\n    }\n    vector<int> res;\n    int r = matrix.size();\n    for(auto& p : mp) {\n        if (p.second == r) res.push_back(p.first);\n    }\n    sort(res.begin(), res.end());\n    return res;\n}",
      "java": "public int[] solve(int[][] matrix) {\n    if (matrix.length == 0) return new int[]{};\n    java.util.Map<Integer, Integer> map = new java.util.HashMap<>();\n    for (int x : matrix[0]) map.put(x, 1);\n    for (int i = 1; i < matrix.length; i++) {\n        for (int x : matrix[i]) {\n            if (map.containsKey(x) && map.get(x) == i) {\n                map.put(x, i + 1);\n            }\n        }\n    }\n    java.util.List<Integer> list = new java.util.ArrayList<>();\n    int r = matrix.length;\n    for (java.util.Map.Entry<Integer, Integer> entry : map.entrySet()) {\n        if (entry.getValue() == r) list.add(entry.getKey());\n    }\n    java.util.Collections.sort(list);\n    return list.stream().mapToInt(x -> x).toArray();\n}",
      "javascript": "function solve(matrix) {\n    if (matrix.length === 0) return [];\n    let sets = matrix.map(row => new Set(row));\n    let res = [...sets[0]].filter(x => sets.every(s => s.has(x)));\n    return res.sort((a,b)=>a-b);\n}"
    },
    "boilerplate": {
      "python": "# Solution for Common Elements in All Rows of a Given Matrix\\ndef solve(matrix):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Common Elements in All Rows of a Given Matrix\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nvector<int> solve(vector<vector<int>>& matrix) {\\n    // Write your solution here\\n    return {};\\n}",
      "java": "// Solution for Common Elements in All Rows of a Given Matrix\\nimport java.util.*;\\nclass Solution {\\n    public int[] solve(int[][] matrix) {\\n        // Write your solution here\\n        return new int[]{};\\n    }\\n}",
      "javascript": "// Solution for Common Elements in All Rows of a Given Matrix\\nfunction solve(matrix) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 166,
    "title": "Square Star Pattern",
    "category": "Pattern Printing",
    "difficulty": "Easy",
    "statement": "Given integer n, return a square star pattern representation as a single string of '*' and '\\n'. Format: n rows of n stars each.",
    "inputFormat": "n = <integer>",
    "outputFormat": "String",
    "examples": [
      {
        "input": "n = 3",
        "output": "\"***\\n***\\n***\\n\""
      }
    ],
    "hint1": "Use nested loops: outer loop controls rows, inner loop controls stars.",
    "hint2": "Add a newline character '\\n' at the end of each row string.",
    "solution": {
      "python": "def solve(n):\n    return \"\".join(\"*\" * n + \"\\n\" for _ in range(n))",
      "cpp": "string solve(int n) {\n    string res = \"\";\n    for(int i=0; i<n; ++i) {\n        res += string(n, '*') + \"\\n\";\n    }\n    return res;\n}",
      "java": "public String solve(int n) {\n    StringBuilder sb = new StringBuilder();\n    for(int i=0; i<n; ++i) {\n        for(int j=0; j<n; ++j) sb.append('*');\n        sb.append('\\n');\n    }\n    return sb.toString();\n}",
      "javascript": "function solve(n) {\n    let res = '';\n    for(let i=0; i<n; ++i) {\n        res += '*'.repeat(n) + '\\n';\n    }\n    return res;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Square Star Pattern\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Square Star Pattern\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(int n) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Square Star Pattern\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int n) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Square Star Pattern\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 167,
    "title": "Hollow Square Star Pattern",
    "category": "Pattern Printing",
    "difficulty": "Easy",
    "statement": "Given integer n, return a hollow square star pattern string of '*' and spaces.",
    "inputFormat": "n = <integer>",
    "outputFormat": "String",
    "examples": [
      {
        "input": "n = 4",
        "output": "\"****\\n*  *\\n*  *\\n****\\n\""
      }
    ],
    "hint1": "Print stars for first and last rows.",
    "hint2": "For other rows, print star at first and last column positions, with spaces in between.",
    "solution": {
      "python": "def solve(n):\n    res = []\n    for i in range(n):\n        if i == 0 or i == n - 1:\n            res.append(\"*\" * n)\n        else:\n            res.append(\"*\" + \" \" * (n - 2) + \"*\")\n    return \"\\n\".join(res) + \"\\n\"",
      "cpp": "string solve(int n) {\n    string res = \"\";\n    for(int i=0; i<n; ++i) {\n        if (i == 0 || i == n-1) res += string(n, '*') + \"\\n\";\n        else res += \"*\" + string(n-2, ' ') + \"*\\n\";\n    }\n    return res;\n}",
      "java": "public String solve(int n) {\n    StringBuilder sb = new StringBuilder();\n    for(int i=0; i<n; ++i) {\n        if (i == 0 || i == n-1) {\n            for(int j=0; j<n; ++j) sb.append('*');\n        } else {\n            sb.append('*');\n            for(int j=0; j<n-2; ++j) sb.append(' ');\n            sb.append('*');\n        }\n        sb.append('\\n');\n    }\n    return sb.toString();\n}",
      "javascript": "function solve(n) {\n    let res = '';\n    for(let i=0; i<n; ++i) {\n        if (i === 0 || i === n-1) res += '*'.repeat(n) + '\\n';\n        else res += '*' + ' '.repeat(n-2) + '*\\n';\n    }\n    return res;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Hollow Square Star Pattern\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Hollow Square Star Pattern\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(int n) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Hollow Square Star Pattern\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int n) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Hollow Square Star Pattern\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 168,
    "title": "Triangle Star Pattern",
    "category": "Pattern Printing",
    "difficulty": "Easy",
    "statement": "Given integer n, return a right triangle star pattern where row i (1 to n) has i stars.",
    "inputFormat": "n = <integer>",
    "outputFormat": "String",
    "examples": [
      {
        "input": "n = 3",
        "output": "\"*\\n**\\n***\\n\""
      }
    ],
    "hint1": "Row index i ranges from 1 to n.",
    "hint2": "Print i stars in the ith row.",
    "solution": {
      "python": "def solve(n):\n    return \"\".join(\"*\" * i + \"\\n\" for i in range(1, n + 1))",
      "cpp": "string solve(int n) {\n    string res = \"\";\n    for(int i=1; i<=n; ++i) {\n        res += string(i, '*') + \"\\n\";\n    }\n    return res;\n}",
      "java": "public String solve(int n) {\n    StringBuilder sb = new StringBuilder();\n    for(int i=1; i<=n; ++i) {\n        for(int j=0; j<i; ++j) sb.append('*');\n        sb.append('\\n');\n    }\n    return sb.toString();\n}",
      "javascript": "function solve(n) {\n    let res = '';\n    for(let i=1; i<=n; ++i) {\n        res += '*'.repeat(i) + '\\n';\n    }\n    return res;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Triangle Star Pattern\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Triangle Star Pattern\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(int n) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Triangle Star Pattern\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int n) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Triangle Star Pattern\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 169,
    "title": "Pyramid Star Pattern",
    "category": "Pattern Printing",
    "difficulty": "Easy",
    "statement": "Given integer n, return a pyramid star pattern string where row i (0 to n-1) has n-1-i leading spaces and 2*i+1 stars.",
    "inputFormat": "n = <integer>",
    "outputFormat": "String",
    "examples": [
      {
        "input": "n = 3",
        "output": "\"  *\\n ***\\n*****\\n\""
      }
    ],
    "hint1": "Outer loop ranges i from 0 to n-1.",
    "hint2": "Print n-1-i spaces followed by 2*i+1 stars, and then a newline.",
    "solution": {
      "python": "def solve(n):\n    return \"\".join(\" \" * (n - 1 - i) + \"*\" * (2 * i + 1) + \"\\n\" for i in range(n))",
      "cpp": "string solve(int n) {\n    string res = \"\";\n    for(int i=0; i<n; ++i) {\n        res += string(n-1-i, ' ') + string(2*i+1, '*') + \"\\n\";\n    }\n    return res;\n}",
      "java": "public String solve(int n) {\n    StringBuilder sb = new StringBuilder();\n    for(int i=0; i<n; ++i) {\n        for(int j=0; j<n-1-i; ++j) sb.append(' ');\n        for(int j=0; j<2*i+1; ++j) sb.append('*');\n        sb.append('\\n');\n    }\n    return sb.toString();\n}",
      "javascript": "function solve(n) {\n    let res = '';\n    for(let i=0; i<n; ++i) {\n        res += ' '.repeat(n-1-i) + '*'.repeat(2*i+1) + '\\n';\n    }\n    return res;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Pyramid Star Pattern\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Pyramid Star Pattern\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(int n) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Pyramid Star Pattern\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int n) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Pyramid Star Pattern\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 170,
    "title": "Hollow Pyramid Star Pattern",
    "category": "Pattern Printing",
    "difficulty": "Medium",
    "statement": "Given integer n, return a hollow pyramid star pattern string.",
    "inputFormat": "n = <integer>",
    "outputFormat": "String",
    "examples": [
      {
        "input": "n = 3",
        "output": "\"  *\\n * *\\n*****\\n\""
      }
    ],
    "hint1": "Draw a normal pyramid first.",
    "hint2": "For hollow, only print star at first and last star positions of each row. The bottom row is completely filled with stars.",
    "solution": {
      "python": "def solve(n):\n    res = []\n    for i in range(n):\n        if i == n - 1:\n            res.append(\"*\" * (2 * i + 1))\n        else:\n            sp = \" \" * (n - 1 - i)\n            if i == 0:\n                res.append(sp + \"*\")\n            else:\n                res.append(sp + \"*\" + \" \" * (2 * i - 1) + \"*\")\n    return \"\\n\".join(res) + \"\\n\"",
      "cpp": "string solve(int n) {\n    string res = \"\";\n    for(int i=0; i<n; ++i) {\n        string sp = string(n-1-i, ' ');\n        if (i == n-1) res += string(2*i+1, '*') + \"\\n\";\n        else if (i == 0) res += sp + \"*\\n\";\n        else res += sp + \"*\" + string(2*i-1, ' ') + \"*\\n\";\n    }\n    return res;\n}",
      "java": "public String solve(int n) {\n    StringBuilder sb = new StringBuilder();\n    for(int i=0; i<n; ++i) {\n        for(int j=0; j<n-1-i; ++j) sb.append(' ');\n        if (i == n-1) {\n            for(int j=0; j<2*i+1; ++j) sb.append('*');\n        } else if (i == 0) {\n            sb.append('*');\n        } else {\n            sb.append('*');\n            for(int j=0; j<2*i-1; ++j) sb.append(' ');\n            sb.append('*');\n        }\n        sb.append('\\n');\n    }\n    return sb.toString();\n}",
      "javascript": "function solve(n) {\n    let res = '';\n    for(let i=0; i<n; ++i) {\n        let sp = ' '.repeat(n-1-i);\n        if (i === n-1) res += '*'.repeat(2*i+1) + '\\n';\n        else if (i === 0) res += sp + '*\\n';\n        else res += sp + '*' + ' '.repeat(2*i-1) + '*\\n';\n    }\n    return res;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Hollow Pyramid Star Pattern\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Hollow Pyramid Star Pattern\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(int n) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Hollow Pyramid Star Pattern\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int n) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Hollow Pyramid Star Pattern\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 171,
    "title": "Inverted Pyramid Star Pattern",
    "category": "Pattern Printing",
    "difficulty": "Easy",
    "statement": "Given integer n, return an inverted pyramid star pattern string.",
    "inputFormat": "n = <integer>",
    "outputFormat": "String",
    "examples": [
      {
        "input": "n = 3",
        "output": "\"*****\\n ***\\n  *\\n\""
      }
    ],
    "hint1": "Outer loop ranges i from n-1 down to 0.",
    "hint2": "Print n-1-i leading spaces and 2*i+1 stars for each row.",
    "solution": {
      "python": "def solve(n):\n    return \"\".join(\" \" * (n - 1 - i) + \"*\" * (2 * i + 1) + \"\\n\" for i in range(n - 1, -1, -1))",
      "cpp": "string solve(int n) {\n    string res = \"\";\n    for(int i=n-1; i>=0; --i) {\n        res += string(n-1-i, ' ') + string(2*i+1, '*') + \"\\n\";\n    }\n    return res;\n}",
      "java": "public String solve(int n) {\n    StringBuilder sb = new StringBuilder();\n    for(int i=n-1; i>=0; --i) {\n        for(int j=0; j<n-1-i; ++j) sb.append(' ');\n        for(int j=0; j<2*i+1; ++j) sb.append('*');\n        sb.append('\\n');\n    }\n    return sb.toString();\n}",
      "javascript": "function solve(n) {\n    let res = '';\n    for(let i=n-1; i>=0; --i) {\n        res += ' '.repeat(n-1-i) + '*'.repeat(2*i+1) + '\\n';\n    }\n    return res;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Inverted Pyramid Star Pattern\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Inverted Pyramid Star Pattern\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(int n) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Inverted Pyramid Star Pattern\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int n) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Inverted Pyramid Star Pattern\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 172,
    "title": "Diamond Star Pattern",
    "category": "Pattern Printing",
    "difficulty": "Medium",
    "statement": "Given integer n, return a diamond star pattern string (pyramid of size n followed by inverted pyramid of size n).",
    "inputFormat": "n = <integer>",
    "outputFormat": "String",
    "examples": [
      {
        "input": "n = 3",
        "output": "\"  *\\n ***\\n*****\\n*****\\n ***\\n  *\\n\""
      }
    ],
    "hint1": "Print a standard pyramid of size n.",
    "hint2": "Follow with an inverted pyramid of size n.",
    "solution": {
      "python": "def solve(n):\n    p1 = \"\".join(\" \" * (n - 1 - i) + \"*\" * (2 * i + 1) + \"\\n\" for i in range(n))\n    p2 = \"\".join(\" \" * (n - 1 - i) + \"*\" * (2 * i + 1) + \"\\n\" for i in range(n - 1, -1, -1))\n    return p1 + p2",
      "cpp": "string solve(int n) {\n    string res = \"\";\n    for(int i=0; i<n; ++i) res += string(n-1-i, ' ') + string(2*i+1, '*') + \"\\n\";\n    for(int i=n-1; i>=0; --i) res += string(n-1-i, ' ') + string(2*i+1, '*') + \"\\n\";\n    return res;\n}",
      "java": "public String solve(int n) {\n    StringBuilder sb = new StringBuilder();\n    for(int i=0; i<n; ++i) {\n        for(int j=0; j<n-1-i; ++j) sb.append(' ');\n        for(int j=0; j<2*i+1; ++j) sb.append('*');\n        sb.append('\\n');\n    }\n    for(int i=n-1; i>=0; --i) {\n        for(int j=0; j<n-1-i; ++j) sb.append(' ');\n        for(int j=0; j<2*i+1; ++j) sb.append('*');\n        sb.append('\\n');\n    }\n    return sb.toString();\n}",
      "javascript": "function solve(n) {\n    let res = '';\n    for(let i=0; i<n; ++i) res += ' '.repeat(n-1-i) + '*'.repeat(2*i+1) + '\\n';\n    for(let i=n-1; i>=0; --i) res += ' '.repeat(n-1-i) + '*'.repeat(2*i+1) + '\\n';\n    return res;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Diamond Star Pattern\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Diamond Star Pattern\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(int n) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Diamond Star Pattern\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int n) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Diamond Star Pattern\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 173,
    "title": "Floyd's Triangle",
    "category": "Pattern Printing",
    "difficulty": "Easy",
    "statement": "Given integer n, return Floyd's Triangle containing n rows, filled with sequential integers starting from 1.",
    "inputFormat": "n = <integer>",
    "outputFormat": "String",
    "examples": [
      {
        "input": "n = 3",
        "output": "\"1 \\n2 3 \\n4 5 6 \\n\""
      }
    ],
    "hint1": "Outer loop controls row index i (1 to n).",
    "hint2": "Inner loop prints numbers. Maintain a global counter initialized to 1, incrementing it with each print, followed by a space.",
    "solution": {
      "python": "def solve(n):\n    res = []\n    cnt = 1\n    for i in range(1, n + 1):\n        row = []\n        for _ in range(i):\n            row.append(str(cnt))\n            cnt += 1\n        res.append(\" \".join(row) + \" \")\n    return \"\\n\".join(res) + \"\\n\"",
      "cpp": "string solve(int n) {\n    string res = \"\";\n    int cnt = 1;\n    for(int i=1; i<=n; ++i) {\n        for(int j=0; j<i; ++j) {\n            res += to_string(cnt++) + \" \";\n        }\n        res += \"\\n\";\n    }\n    return res;\n}",
      "java": "public String solve(int n) {\n    StringBuilder sb = new StringBuilder();\n    int cnt = 1;\n    for(int i=1; i<=n; ++i) {\n        for(int j=0; j<i; ++j) {\n            sb.append(cnt++).append(' ');\n        }\n        sb.append('\\n');\n    }\n    return sb.toString();\n}",
      "javascript": "function solve(n) {\n    let res = '';\n    let cnt = 1;\n    for(let i=1; i<=n; ++i) {\n        for(let j=0; j<i; ++j) {\n            res += cnt++ + ' ';\n        }\n        res += '\\n';\n    }\n    return res;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Floyd's Triangle\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Floyd's Triangle\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(int n) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Floyd's Triangle\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int n) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Floyd's Triangle\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "id": 174,
    "title": "Pascal's Triangle",
    "category": "Pattern Printing",
    "difficulty": "Medium",
    "statement": "Given integer n, return Pascal's Triangle representation of first n rows as string, where elements in each row are separated by spaces.",
    "inputFormat": "n = <integer>",
    "outputFormat": "String",
    "examples": [
      {
        "input": "n = 3",
        "output": "\"1 \\n1 1 \\n1 2 1 \\n\""
      }
    ],
    "hint1": "Row i (0 to n-1) has i+1 elements. First and last elements of each row are 1.",
    "hint2": "Other elements are the sum of elements directly above them: val = val * (i - j) / (j + 1).",
    "solution": {
      "python": "def solve(n):\n    res = []\n    for i in range(n):\n        val = 1\n        row = []\n        for j in range(i + 1):\n            row.append(str(val))\n            val = val * (i - j) // (j + 1)\n        res.append(\" \".join(row) + \" \")\n    return \"\\n\".join(res) + \"\\n\"",
      "cpp": "string solve(int n) {\n    string res = \"\";\n    for(int i=0; i<n; ++i) {\n        int val = 1;\n        for(int j=0; j<=i; ++j) {\n            res += to_string(val) + \" \";\n            val = val * (i - j) / (j + 1);\n        }\n        res += \"\\n\";\n    }\n    return res;\n}",
      "java": "public String solve(int n) {\n    StringBuilder sb = new StringBuilder();\n    for(int i=0; i<n; ++i) {\n        int val = 1;\n        for(int j=0; j<=i; ++j) {\n            sb.append(val).append(' ');\n            val = val * (i - j) / (j + 1);\n        }\n        sb.append('\\n');\n    }\n    return sb.toString();\n}",
      "javascript": "function solve(n) {\n    let res = '';\n    for(let i=0; i<n; ++i) {\n        let val = 1;\n        for(let j=0; j<=i; ++j) {\n            res += val + ' ';\n            val = Math.floor(val * (i - j) / (j + 1));\n        }\n        res += '\\n';\n    }\n    return res;\n}"
    },
    "boilerplate": {
      "python": "# Solution for Pascal's Triangle\\ndef solve(n):\\n    # Write your solution here\\n    pass",
      "cpp": "// Solution for Pascal's Triangle\\n#include <iostream>\\n#include <vector>\\n#include <string>\\n#include <algorithm>\\nusing namespace std;\\n\\nint solve(int n) {\\n    // Write your solution here\\n    return 0;\\n}",
      "java": "// Solution for Pascal's Triangle\\nimport java.util.*;\\nclass Solution {\\n    public int solve(int n) {\\n        // Write your solution here\\n        return 0;\\n    }\\n}",
      "javascript": "// Solution for Pascal's Triangle\\nfunction solve(n) {\\n    // Write your solution here\\n    return null;\\n}"
    }
  },
  {
    "title": "Butterfly Star Pattern",
    "category": "Pattern Printing",
    "difficulty": "Medium",
    "statement": "Given an integer n, print the butterfly star pattern with 2*n rows.",
    "inputFormat": "n = <integer>",
    "outputFormat": "Array of strings",
    "examples": [
      {
        "input": "n = 3",
        "output": "[\"*    *\", \"**  **\", \"******\", \"******\", \"**  **\", \"*    *\"]"
      }
    ],
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
    },
    "id": 175
  }
];
