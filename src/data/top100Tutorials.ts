/**
 * top100Tutorials.ts
 * Provides comprehensive multi-method tutorial explanations,
 * visual ASCII diagrams for pattern printing questions,
 * and smart test case output formatting.
 */

export interface MethodTutorial {
  name: string;
  badge: 'Brute Force' | 'Optimal' | 'Formula / Math' | 'Recursive' | 'Two-Pointer' | 'Iterative';
  summary: string;
  algorithm: string[];
  timeComplexity: string;
  spaceComplexity: string;
  codeSnippet?: {
    python: string;
    cpp: string;
  };
}

export interface QuestionTutorial {
  conceptTitle: string;
  conceptExplanation: string;
  conceptVisual?: string;
  methods: MethodTutorial[];
  interviewTips?: string;
}

export interface PatternInfo {
  shapeDiagram: string;
  rowRule: string;
  spaceRule?: string;
  contentRule: string;
  explanation: string;
}

// ─────────────────────────────────────────────────────────────────
// PATTERN PRINTING BLUEPRINTS & ASCII DIAGRAMS
// ─────────────────────────────────────────────────────────────────
export const PATTERN_BLUEPRINTS: Record<string, PatternInfo> = {
  "Square Star Pattern": {
    shapeDiagram: `For n = 4:
* * * *
* * * *
* * * *
* * * *`,
    rowRule: "Outer loop runs for rows i from 1 to n",
    contentRule: "Inner loop runs for columns j from 1 to n, printing '* '",
    explanation: "A simple grid with n rows and n columns of asterisks. Time Complexity: O(n²), Space Complexity: O(1)."
  },
  "Hollow Square Star Pattern": {
    shapeDiagram: `For n = 5:
* * * * *
*       *
*       *
*       *
* * * * *`,
    rowRule: "Outer loop runs for rows i from 1 to n",
    contentRule: "Print '*' if on boundary (i === 1 || i === n || j === 1 || j === n), else print space ' '",
    explanation: "Only border cells contain asterisks. Interior cells contain whitespace. Time Complexity: O(n²), Space Complexity: O(1)."
  },
  "Triangle Star Pattern": {
    shapeDiagram: `For n = 4:
*
* *
* * *
* * * *`,
    rowRule: "Outer loop runs for row i from 1 to n",
    contentRule: "Inner loop runs from 1 to i, printing '* '",
    explanation: "Row 1 has 1 star, row 2 has 2 stars, ..., row n has n stars. Time Complexity: O(n²), Space Complexity: O(1)."
  },
  "Pyramid Star Pattern": {
    shapeDiagram: `For n = 4:
      *
    * * *
  * * * * *
* * * * * * *`,
    rowRule: "Outer loop runs for row i from 0 to n - 1",
    spaceRule: "Print (n - 1 - i) leading spaces to center-align the pyramid",
    contentRule: "Print (2 * i + 1) stars in each row",
    explanation: "Each row has odd number of stars (1, 3, 5, 7...) centered by decreasing leading spaces. Time Complexity: O(n²)."
  },
  "Hollow Pyramid Star Pattern": {
    shapeDiagram: `For n = 5:
        *
      *   *
    *       *
  *           *
* * * * * * * * *`,
    rowRule: "Outer loop runs for row i from 0 to n - 1",
    spaceRule: "Print (n - 1 - i) leading spaces",
    contentRule: "In row n - 1 print all stars; in other rows print star only at first and last position with interior spaces",
    explanation: "A hollow pyramid where stars outline the triangular boundary and base. Time Complexity: O(n²)."
  },
  "Inverted Pyramid Star Pattern": {
    shapeDiagram: `For n = 4:
* * * * * * *
  * * * * *
    * * *
      *`,
    rowRule: "Outer loop runs for row i from n - 1 down to 0",
    spaceRule: "Print (n - 1 - i) leading spaces",
    contentRule: "Print (2 * i + 1) stars per row",
    explanation: "Inverse of the pyramid pattern starting with (2n - 1) stars decreasing down to 1 star. Time Complexity: O(n²)."
  },
  "Diamond Star Pattern": {
    shapeDiagram: `For n = 3:
    *
  * * *
* * * * *
* * * * *
  * * *
    *`,
    rowRule: "Upper half: Pyramid of size n. Lower half: Inverted pyramid of size n.",
    spaceRule: "Leading spaces decrease in top half and increase in bottom half",
    contentRule: "Stars increase (1, 3, 5...) in upper half, then mirror in lower half",
    explanation: "Combines an upright pyramid and an inverted pyramid. Time Complexity: O(n²)."
  },
  "Floyd's Triangle": {
    shapeDiagram: `For n = 4:
1
2  3
4  5  6
7  8  9  10`,
    rowRule: "Outer loop runs for row i from 1 to n",
    contentRule: "Maintain a running counter starting from 1. Inner loop runs i times, printing counter++",
    explanation: "Consecutive natural numbers filled in a right-angled triangle. Row i contains i consecutive integers. Total numbers printed = n(n+1)/2."
  },
  "Pascal's Triangle": {
    shapeDiagram: `For n = 5:
1
1  1
1  2  1
1  3  3  1
1  4  6  4  1`,
    rowRule: "Outer loop runs for row i from 0 to n - 1",
    contentRule: "Each value is C(i, j) = i! / (j! * (i - j)!). Next value can be derived: val = val * (i - j) / (j + 1)",
    explanation: "Each number is the sum of the two directly above it. In combination math, row i column j corresponds to i choose j."
  },
  "Butterfly Star Pattern": {
    shapeDiagram: `For n = 3:
*          *
* *      * *
* * *  * * *
* * *  * * *
* *      * *
*          *`,
    rowRule: "Upper half (i = 1 to n) and Lower half (i = n down to 1)",
    spaceRule: "Middle spaces = 2 * (n - i)",
    contentRule: "Left wing: i stars, Middle: 2*(n-i) spaces, Right wing: i stars",
    explanation: "Symmetric butterfly wings where star widths expand to touch at the equator and then symmetrically retract."
  }
};

/**
 * Parses and unescapes multi-line test outputs for clean visual display
 */
export function formatExampleOutput(raw: string): { isMultiline: boolean; text: string; lines: string[] } {
  if (!raw) return { isMultiline: false, text: '', lines: [] };
  let str = raw.trim();

  // If wrapped in outer quotes
  if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
    try {
      str = JSON.parse(str);
    } catch {
      str = str.slice(1, -1);
    }
  }

  // Replace escaped \n with actual newlines
  const text = str.replace(/\\n/g, '\n').replace(/\\t/g, '  ');
  const lines = text.split('\n').filter((l, i, arr) => !(i === arr.length - 1 && l === ''));
  const isMultiline = lines.length > 1 || (text.startsWith('[') && text.includes(',') && text.length > 30);

  return { isMultiline, text, lines };
}

/**
 * Returns comprehensive multi-method tutorial for any challenge
 */
export function getQuestionTutorial(title: string, category: string): QuestionTutorial {
  // Check if pattern
  if (category === 'Pattern Printing' && PATTERN_BLUEPRINTS[title]) {
    const pat = PATTERN_BLUEPRINTS[title];
    return {
      conceptTitle: `${title} - Visual Pattern Architecture`,
      conceptExplanation: pat.explanation,
      conceptVisual: pat.shapeDiagram,
      methods: [
        {
          name: "Method 1: Nested Loops (Standard Approach)",
          badge: "Optimal",
          summary: "Use an outer loop for rows and inner loops for spaces and characters.",
          algorithm: [
            pat.rowRule,
            ...(pat.spaceRule ? [pat.spaceRule] : []),
            pat.contentRule,
            "Print newline after completing each row"
          ],
          timeComplexity: "O(n²)",
          spaceComplexity: "O(1) extra space (excluding output string)",
          codeSnippet: {
            python: `def solve(n):\n    # Outer loop for rows\n    lines = []\n    for i in range(1, n + 1):\n        # Inner logic\n        pass\n    return "\\n".join(lines)`,
            cpp: `void solve(int n) {\n    for (int i = 1; i <= n; i++) {\n        // print row\n        cout << endl;\n    }\n}`
          }
        }
      ],
      interviewTips: "Pattern questions test your mastery over loop boundaries and coordinate geometry in 2D space. Always break each line into: (1) Leading Spaces, (2) Characters/Numbers, (3) Trailing elements."
    };
  }

  // Common challenge tutorials (Multi-Method Breakdown)
  const normTitle = title.toLowerCase();

  if (normTitle.includes('positive or negative')) {
    return {
      conceptTitle: "Number Scale Analysis (Positive, Negative, or Zero)",
      conceptExplanation: "Real integers are divided along the number line by the origin (0). Any integer greater than 0 is positive; any integer less than 0 is negative; and exactly 0 is neither positive nor negative.",
      conceptVisual: `      Negative Integers        Zero        Positive Integers
<=== [-3]  [-2]  [-1] <====== [0] ======> [+1]  [+2]  [+3] ===>
           (n < 0)                      (n > 0)`,
      methods: [
        {
          name: "Method 1: Brute Force (If-Else Ladder)",
          badge: "Brute Force",
          summary: "Evaluate three distinct mutually exclusive conditions sequentially.",
          algorithm: [
            "Check if n > 0: return 'Positive'",
            "Else check if n < 0: return 'Negative'",
            "Else: return 'Zero'"
          ],
          timeComplexity: "O(1) - Constant time comparison",
          spaceComplexity: "O(1) - No additional memory required",
          codeSnippet: {
            python: `def solve(n):\n    if n > 0: return "Positive"\n    elif n < 0: return "Negative"\n    return "Zero"`,
            cpp: `string solve(int n) {\n    if (n > 0) return "Positive";\n    if (n < 0) return "Negative";\n    return "Zero";\n}`
          }
        },
        {
          name: "Method 2: Nested Conditional Statements",
          badge: "Optimal",
          summary: "Check non-negativity first, then split into Zero and Positive.",
          algorithm: [
            "If n >= 0, check if n == 0 return 'Zero' else return 'Positive'",
            "Otherwise return 'Negative'"
          ],
          timeComplexity: "O(1)",
          spaceComplexity: "O(1)"
        },
        {
          name: "Method 3: Inline Ternary Operator",
          badge: "Formula / Math",
          summary: "Concise single-line conditional expression.",
          algorithm: [
            "Evaluate: (n == 0) ? 'Zero' : (n > 0 ? 'Positive' : 'Negative')"
          ],
          timeComplexity: "O(1)",
          spaceComplexity: "O(1)",
          codeSnippet: {
            python: `def solve(n):\n    return "Zero" if n == 0 else ("Positive" if n > 0 else "Negative")`,
            cpp: `string solve(int n) {\n    return (n == 0) ? "Zero" : (n > 0 ? "Positive" : "Negative");\n}`
          }
        }
      ],
      interviewTips: "Watch out for integer sign boundaries and edge case 0. Interviewers often ask this to verify basic conditional syntax in new languages."
    };
  }

  if (normTitle.includes('even or odd')) {
    return {
      conceptTitle: "Even vs Odd Parity Analysis",
      conceptExplanation: "An integer is even if divisible by 2 with remainder 0. In binary representation, the least significant bit (LSB) of an even number is always 0, while for an odd number it is always 1.",
      conceptVisual: `Decimal 4  = 0 1 0 0 (LSB is 0 -> EVEN)
Decimal 7  = 0 1 1 1 (LSB is 1 -> ODD)`,
      methods: [
        {
          name: "Method 1: Modulo Operator (%)",
          badge: "Brute Force",
          summary: "Compute n % 2 and check if remainder is 0.",
          algorithm: [
            "Calculate rem = n % 2",
            "If rem == 0 return 'Even', else return 'Odd'"
          ],
          timeComplexity: "O(1)",
          spaceComplexity: "O(1)"
        },
        {
          name: "Method 2: Bitwise AND Operator (&)",
          badge: "Optimal",
          summary: "Check the lowest bit: (n & 1). Highly optimal in machine code.",
          algorithm: [
            "If (n & 1) == 0, the last bit is 0 -> return 'Even'",
            "Otherwise the last bit is 1 -> return 'Odd'"
          ],
          timeComplexity: "O(1) - Single CPU bitwise operation",
          spaceComplexity: "O(1)",
          codeSnippet: {
            python: `def solve(n):\n    return "Even" if (n & 1) == 0 else "Odd"`,
            cpp: `string solve(int n) {\n    return (n & 1) ? "Odd" : "Even";\n}`
          }
        }
      ],
      interviewTips: "When asked in product company interviews (Amazon, Cisco), mention the Bitwise AND (& 1) trick—it avoids division operations at the CPU microcode level."
    };
  }

  if (normTitle.includes('sum of first n') || normTitle.includes('sum of n natural')) {
    return {
      conceptTitle: "Sum of First N Natural Numbers",
      conceptExplanation: "Sum of integers from 1 up to n: S = 1 + 2 + 3 + ... + n. Gauss discovered that pairing numbers from ends (1 + n), (2 + n-1) yields n/2 pairs of sum (n + 1).",
      conceptVisual: `1   +   2   +   3   + ... +   n
n   + (n-1) + (n-2) + ... +   1
---------------------------------
(n+1) + (n+1) + (n+1) + ... + (n+1)  = n * (n + 1)
Total Sum = n * (n + 1) / 2`,
      methods: [
        {
          name: "Method 1: Direct Formula (Gauss Formula)",
          badge: "Optimal",
          summary: "Compute directly using the closed-form equation n * (n + 1) / 2.",
          algorithm: [
            "Compute result = n * (n + 1) / 2",
            "Return result"
          ],
          timeComplexity: "O(1) - Instant arithmetic calculation",
          spaceComplexity: "O(1)",
          codeSnippet: {
            python: `def solve(n):\n    return n * (n + 1) // 2`,
            cpp: `long long solve(int n) {\n    return (long long)n * (n + 1) / 2;\n}`
          }
        },
        {
          name: "Method 2: Iterative Loop Accumulator",
          badge: "Brute Force",
          summary: "Loop from 1 to n adding each number to a sum accumulator.",
          algorithm: [
            "Initialize sum = 0",
            "For i from 1 to n: sum += i",
            "Return sum"
          ],
          timeComplexity: "O(n) - Loops n times",
          spaceComplexity: "O(1)"
        },
        {
          name: "Method 3: Recursive Approach",
          badge: "Recursive",
          summary: "Recursively define S(n) = n + S(n - 1) with base case S(1) = 1.",
          algorithm: [
            "If n <= 1 return n",
            "Return n + solve(n - 1)"
          ],
          timeComplexity: "O(n)",
          spaceComplexity: "O(n) - Call stack depth"
        }
      ],
      interviewTips: "Be careful with 32-bit integer overflow when n > 65535! Always cast n to a 64-bit integer (long long in C++, long in Java) before multiplying n * (n + 1)."
    };
  }

  if (normTitle.includes('prime number')) {
    return {
      conceptTitle: "Prime Number Determination",
      conceptExplanation: "A prime number is a natural number strictly greater than 1 with no positive divisors other than 1 and itself. A composite number must have at least one factor ≤ √n.",
      conceptVisual: `If n = a * b, both factors cannot be greater than √n.
If a > √n, then b MUST be < √n.
Therefore, testing divisors up to √n is sufficient!`,
      methods: [
        {
          name: "Method 1: Square Root Optimization (Standard)",
          badge: "Optimal",
          summary: "Check divisibility only from 2 up to √n. 100x faster than checking up to n.",
          algorithm: [
            "If n <= 1: return False",
            "Loop i from 2 while i * i <= n:",
            "  If n % i == 0: return False",
            "Return True"
          ],
          timeComplexity: "O(√n)",
          spaceComplexity: "O(1)",
          codeSnippet: {
            python: `def solve(n):\n    if n < 2: return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0: return False\n    return True`,
            cpp: `bool solve(int n) {\n    if (n < 2) return false;\n    for (int i = 2; i * i <= n; i++)\n        if (n % i == 0) return false;\n    return true;\n}`
          }
        },
        {
          name: "Method 2: 6k ± 1 Primality Test",
          badge: "Formula / Math",
          summary: "All primes greater than 3 can be expressed as 6k ± 1. Skips multiples of 2 and 3.",
          algorithm: [
            "If n <= 3 return n > 1",
            "If n % 2 == 0 or n % 3 == 0 return False",
            "Loop i from 5 by increments of 6: check i and i + 2",
            "Return True"
          ],
          timeComplexity: "O(√n / 3) - 3x faster than standard √n",
          spaceComplexity: "O(1)"
        }
      ],
      interviewTips: "Always highlight why checking up to √n is mathematically sound. If finding primes up to N in bulk, mention the Sieve of Eratosthenes (O(N log log N))."
    };
  }

  // Generic fallback for all other questions
  return {
    conceptTitle: `${title} - Algorithmic Breakdown`,
    conceptExplanation: `In-depth problem breakdown for ${title} under the ${category} module. Analyzing input constraints, algorithmic paradigms, and optimal complexity tradeoffs.`,
    methods: [
      {
        name: "Method 1: Optimal / Idiomatic Solution",
        badge: "Optimal",
        summary: "The most efficient standard approach for competitive programming and technical interviews.",
        algorithm: [
          "Parse and validate input values",
          "Apply optimal data structure / mathematical rule",
          "Return the formatted solution satisfying space and time limits"
        ],
        timeComplexity: "Optimal for problem constraints",
        spaceComplexity: "O(1) to O(N) depending on storage requirements"
      },
      {
        name: "Method 2: Iterative / Brute-Force Baseline",
        badge: "Brute Force",
        summary: "The intuitive step-by-step simulation to verify logic before applying optimizations.",
        algorithm: [
          "Simulate problem rules directly",
          "Traverse input elements sequentially",
          "Accumulate results"
        ],
        timeComplexity: "Standard baseline complexity",
        spaceComplexity: "Minimal memory footprint"
      }
    ],
    interviewTips: `Regularly tested by campus recruiters (TCS, Infosys, Wipro, Cognizant, Amazon). State your time & space complexity upfront before typing code.`
  };
}
