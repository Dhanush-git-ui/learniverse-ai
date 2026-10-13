#!/usr/bin/env python3
"""
Generates 32 PrepInsta Fundamental Arrays questions with complete solutions in 4 languages.
"""
import json

questions = []

def add_q(title, difficulty, statement, inputFmt, outputFmt, examples, hint1, hint2, sol_py, sol_cpp, sol_java, sol_js, bp_py, bp_cpp, bp_java, bp_js):
    questions.append({
        "title": title,
        "category": "Arrays",
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

# 1. Find Largest element in an array
add_q("Find Largest Element in an Array", "Easy",
  "Given an array nums of integers, find the largest element in the array.",
  "nums = <array of integers>", "Integer",
  [{"input": "nums = [20, 10, 20, 4, 100]", "output": "100"}, {"input": "nums = [-5, -2, -9]", "output": "-2"}],
  "Iterate through the array while maintaining the maximum value seen so far.",
  "Initialize max with nums[0].",
  "def solve(nums):\n    return max(nums)",
  "int solve(vector<int>& nums) {\n    return *max_element(nums.begin(), nums.end());\n}",
  "public int solve(int[] nums) {\n    int max = nums[0];\n    for (int x : nums) if (x > max) max = x;\n    return max;\n}",
  "function solve(nums) {\n    return Math.max(...nums);\n}",
  "# Solution for Find Largest Element in an Array\ndef solve(nums):\n    # Write your solution here\n    pass",
  "// Solution for Find Largest Element in an Array\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint solve(vector<int>& nums) {\n    // Write your solution here\n    return 0;\n}",
  "// Solution for Find Largest Element in an Array\nclass Solution {\n    public int solve(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "// Solution for Find Largest Element in an Array\nfunction solve(nums) {\n    // Write your solution here\n    return 0;\n}")

# 2. Find Smallest Element in an Array
add_q("Find Smallest Element in an Array", "Easy",
  "Given an array nums of integers, find the smallest element in the array.",
  "nums = <array of integers>", "Integer",
  [{"input": "nums = [20, 10, 20, 4, 100]", "output": "4"}, {"input": "nums = [15, 8, 23]", "output": "8"}],
  "Iterate through the array while keeping track of the minimum value.",
  "Initialize min with nums[0].",
  "def solve(nums):\n    return min(nums)",
  "int solve(vector<int>& nums) {\n    return *min_element(nums.begin(), nums.end());\n}",
  "public int solve(int[] nums) {\n    int min = nums[0];\n    for (int x : nums) if (x < min) min = x;\n    return min;\n}",
  "function solve(nums) {\n    return Math.min(...nums);\n}",
  "# Solution for Find Smallest Element in an Array\ndef solve(nums):\n    # Write your solution here\n    pass",
  "// Solution for Find Smallest Element in an Array\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint solve(vector<int>& nums) {\n    // Write your solution here\n    return 0;\n}",
  "// Solution for Find Smallest Element in an Array\nclass Solution {\n    public int solve(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "// Solution for Find Smallest Element in an Array\nfunction solve(nums) {\n    // Write your solution here\n    return 0;\n}")

# 3. Find the Smallest and largest element in an array
add_q("Find the Smallest and Largest Element in an Array", "Easy",
  "Given an array nums of integers, find both the minimum and maximum elements.",
  "nums = <array of integers>", "Array of integers [min, max]",
  [{"input": "nums = [5, 2, 9, 1, 7]", "output": "[1, 9]"}, {"input": "nums = [42]", "output": "[42, 42]"}],
  "You can find both in a single pass of the array.",
  "Return an array [min_val, max_val].",
  "def solve(nums):\n    return [min(nums), max(nums)]",
  "vector<int> solve(vector<int>& nums) {\n    int mn = nums[0], mx = nums[0];\n    for (int x : nums) { if (x < mn) mn = x; if (x > mx) mx = x; }\n    return {mn, mx};\n}",
  "public int[] solve(int[] nums) {\n    int min = nums[0], max = nums[0];\n    for (int x : nums) { if (x < min) min = x; if (x > max) max = x; }\n    return new int[]{min, max};\n}",
  "function solve(nums) {\n    return [Math.min(...nums), Math.max(...nums)];\n}",
  "# Solution for Find the Smallest and Largest Element in an Array\ndef solve(nums):\n    # Write your solution here\n    pass",
  "// Solution for Find the Smallest and Largest Element in an Array\n#include <vector>\nusing namespace std;\n\nvector<int> solve(vector<int>& nums) {\n    // Write your solution here\n    return {};\n}",
  "// Solution for Find the Smallest and Largest Element in an Array\nclass Solution {\n    public int[] solve(int[] nums) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
  "// Solution for Find the Smallest and Largest Element in an Array\nfunction solve(nums) {\n    // Write your solution here\n    return [];\n}")

# 4. Find Second Smallest Element in an Array
add_q("Find Second Smallest Element in an Array", "Easy",
  "Given an array nums, find the second smallest distinct element in the array.",
  "nums = <array of integers>", "Integer",
  [{"input": "nums = [12, 13, 1, 10, 34, 1]", "output": "10"}, {"input": "nums = [5, 2, 8, 2, 9]", "output": "5"}],
  "Maintain first_min and second_min variables initialized to infinity.",
  "When an element is smaller than first_min, update second_min then first_min.",
  "def solve(nums):\n    distinct = sorted(list(set(nums)))\n    return distinct[1] if len(distinct) > 1 else distinct[0]",
  "int solve(vector<int>& nums) {\n    set<int> s(nums.begin(), nums.end());\n    if (s.size() < 2) return *s.begin();\n    auto it = s.begin(); advance(it, 1);\n    return *it;\n}",
  "public int solve(int[] nums) {\n    TreeSet<Integer> set = new TreeSet<>();\n    for (int x : nums) set.add(x);\n    if (set.size() < 2) return set.first();\n    set.pollFirst();\n    return set.first();\n}",
  "function solve(nums) {\n    const unique = [...new Set(nums)].sort((a, b) => a - b);\n    return unique.length > 1 ? unique[1] : unique[0];\n}",
  "# Solution for Find Second Smallest Element in an Array\ndef solve(nums):\n    # Write your solution here\n    pass",
  "// Solution for Find Second Smallest Element in an Array\n#include <vector>\n#include <set>\nusing namespace std;\n\nint solve(vector<int>& nums) {\n    // Write your solution here\n    return 0;\n}",
  "// Solution for Find Second Smallest Element in an Array\nimport java.util.*;\nclass Solution {\n    public int solve(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "// Solution for Find Second Smallest Element in an Array\nfunction solve(nums) {\n    // Write your solution here\n    return 0;\n}")

# 5. Calculate the sum of elements in an array
add_q("Calculate the Sum of Elements in an Array", "Easy",
  "Given an array nums of integers, calculate the total sum of its elements.",
  "nums = <array of integers>", "Integer",
  [{"input": "nums = [1, 2, 3, 4, 5]", "output": "15"}, {"input": "nums = [-10, 20, -5]", "output": "5"}],
  "Iterate through the array and accumulate values.",
  "Or use built-in sum() / reduce().",
  "def solve(nums):\n    return sum(nums)",
  "int solve(vector<int>& nums) {\n    int sum = 0;\n    for (int x : nums) sum += x;\n    return sum;\n}",
  "public int solve(int[] nums) {\n    int sum = 0;\n    for (int x : nums) sum += x;\n    return sum;\n}",
  "function solve(nums) {\n    return nums.reduce((a, b) => a + b, 0);\n}",
  "# Solution for Calculate the Sum of Elements in an Array\ndef solve(nums):\n    # Write your solution here\n    pass",
  "// Solution for Calculate the Sum of Elements in an Array\n#include <vector>\nusing namespace std;\n\nint solve(vector<int>& nums) {\n    // Write your solution here\n    return 0;\n}",
  "// Solution for Calculate the Sum of Elements in an Array\nclass Solution {\n    public int solve(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "// Solution for Calculate the Sum of Elements in an Array\nfunction solve(nums) {\n    // Write your solution here\n    return 0;\n}")

# 6. Reverse an Array
add_q("Reverse an Array", "Easy",
  "Given an array nums, return a new array with elements in reversed order.",
  "nums = <array of integers>", "Array of integers",
  [{"input": "nums = [1, 2, 3, 4, 5]", "output": "[5, 4, 3, 2, 1]"}, {"input": "nums = [10, 20]", "output": "[20, 10]"}],
  "Use two pointers: swap elements from left and right moving towards the center.",
  "Or slice / reverse using built-in functions.",
  "def solve(nums):\n    return nums[::-1]",
  "vector<int> solve(vector<int>& nums) {\n    vector<int> res = nums;\n    reverse(res.begin(), res.end());\n    return res;\n}",
  "public int[] solve(int[] nums) {\n    int[] res = new int[nums.length];\n    for (int i = 0; i < nums.length; i++) res[i] = nums[nums.length - 1 - i];\n    return res;\n}",
  "function solve(nums) {\n    return [...nums].reverse();\n}",
  "# Solution for Reverse an Array\ndef solve(nums):\n    # Write your solution here\n    pass",
  "// Solution for Reverse an Array\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<int> solve(vector<int>& nums) {\n    // Write your solution here\n    return {};\n}",
  "// Solution for Reverse an Array\nclass Solution {\n    public int[] solve(int[] nums) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
  "// Solution for Reverse an Array\nfunction solve(nums) {\n    // Write your solution here\n    return [];\n}")

# 7. Sort first half in ascending order and second half in descending
add_q("Sort First Half Ascending and Second Half Descending", "Medium",
  "Sort the first half of the array in ascending order and the second half in descending order.",
  "nums = <array of integers>", "Array of integers",
  [{"input": "nums = [5, 2, 4, 7, 9, 3, 1, 6, 8]", "output": "[1, 2, 3, 4, 9, 8, 7, 6, 5]"}, {"input": "nums = [1, 2, 3, 4]", "output": "[1, 2, 4, 3]"}],
  "Split the array at n // 2.",
  "Sort the first half ascending and the second half descending, then concatenate.",
  "def solve(nums):\n    nums.sort()\n    mid = len(nums) // 2\n    return nums[:mid] + sorted(nums[mid:], reverse=True)",
  "vector<int> solve(vector<int>& nums) {\n    sort(nums.begin(), nums.end());\n    int mid = nums.size() / 2;\n    reverse(nums.begin() + mid, nums.end());\n    return nums;\n}",
  "public int[] solve(int[] nums) {\n    Arrays.sort(nums);\n    int mid = nums.length / 2;\n    int l = mid, r = nums.length - 1;\n    while (l < r) { int t = nums[l]; nums[l++] = nums[r]; nums[r--] = t; }\n    return nums;\n}",
  "function solve(nums) {\n    nums.sort((a, b) => a - b);\n    const mid = Math.floor(nums.length / 2);\n    const second = nums.slice(mid).sort((a, b) => b - a);\n    return [...nums.slice(0, mid), ...second];\n}",
  "# Solution for Sort First Half Ascending and Second Half Descending\ndef solve(nums):\n    # Write your solution here\n    pass",
  "// Solution for Sort First Half Ascending and Second Half Descending\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<int> solve(vector<int>& nums) {\n    // Write your solution here\n    return {};\n}",
  "// Solution for Sort First Half Ascending and Second Half Descending\nimport java.util.*;\nclass Solution {\n    public int[] solve(int[] nums) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
  "// Solution for Sort First Half Ascending and Second Half Descending\nfunction solve(nums) {\n    // Write your solution here\n    return [];\n}")

# 8. Sort the elements of an array
add_q("Sort the Elements of an Array", "Easy",
  "Given an array nums of integers, sort the elements in ascending order.",
  "nums = <array of integers>", "Array of integers",
  [{"input": "nums = [4, 2, 7, 1, 3]", "output": "[1, 2, 3, 4, 7]"}, {"input": "nums = [10, -1, 5]", "output": "[-1, 5, 10]"}],
  "Use standard sort algorithms like QuickSort, MergeSort, or built-in sort.",
  "Return the sorted array.",
  "def solve(nums):\n    return sorted(nums)",
  "vector<int> solve(vector<int>& nums) {\n    vector<int> res = nums;\n    sort(res.begin(), res.end());\n    return res;\n}",
  "public int[] solve(int[] nums) {\n    int[] res = nums.clone();\n    Arrays.sort(res);\n    return res;\n}",
  "function solve(nums) {\n    return [...nums].sort((a, b) => a - b);\n}",
  "# Solution for Sort the Elements of an Array\ndef solve(nums):\n    # Write your solution here\n    pass",
  "// Solution for Sort the Elements of an Array\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<int> solve(vector<int>& nums) {\n    // Write your solution here\n    return {};\n}",
  "// Solution for Sort the Elements of an Array\nimport java.util.*;\nclass Solution {\n    public int[] solve(int[] nums) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
  "// Solution for Sort the Elements of an Array\nfunction solve(nums) {\n    // Write your solution here\n    return [];\n}")

# 9. Finding the frequency of elements in an array
add_q("Finding the Frequency of Elements in an Array", "Easy",
  "Given an array nums, count the frequency of each unique element and return as an array of [element, count] pairs sorted by element.",
  "nums = <array of integers>", "Array of [element, count] pairs",
  [{"input": "nums = [10, 20, 20, 10, 10, 20, 5, 20]", "output": "[[5, 1], [10, 3], [20, 4]]"}],
  "Count occurrences using a hash table or dictionary.",
  "Sort by key and format as pairs.",
  "def solve(nums):\n    from collections import Counter\n    counts = Counter(nums)\n    return sorted([[k, v] for k, v in counts.items()])",
  "vector<vector<int>> solve(vector<int>& nums) {\n    map<int, int> mp;\n    for (int x : nums) mp[x]++;\n    vector<vector<int>> res;\n    for (auto& p : mp) res.push_back({p.first, p.second});\n    return res;\n}",
  "public List<List<Integer>> solve(int[] nums) {\n    TreeMap<Integer, Integer> map = new TreeMap<>();\n    for (int x : nums) map.put(x, map.getOrDefault(x, 0) + 1);\n    List<List<Integer>> res = new ArrayList<>();\n    for (var e : map.entrySet()) res.add(Arrays.asList(e.getKey(), e.getValue()));\n    return res;\n}",
  "function solve(nums) {\n    const map = {};\n    for (const x of nums) map[x] = (map[x] || 0) + 1;\n    return Object.keys(map).map(Number).sort((a, b) => a - b).map(k => [k, map[k]]);\n}",
  "# Solution for Finding the Frequency of Elements in an Array\ndef solve(nums):\n    # Write your solution here\n    pass",
  "// Solution for Finding the Frequency of Elements in an Array\n#include <vector>\n#include <map>\nusing namespace std;\n\nvector<vector<int>> solve(vector<int>& nums) {\n    // Write your solution here\n    return {};\n}",
  "// Solution for Finding the Frequency of Elements in an Array\nimport java.util.*;\nclass Solution {\n    public List<List<Integer>> solve(int[] nums) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
  "// Solution for Finding the Frequency of Elements in an Array\nfunction solve(nums) {\n    // Write your solution here\n    return [];\n}")

# 10. Sorting elements of an array by frequency
add_q("Sorting Elements of an Array by Frequency", "Medium",
  "Sort elements of array nums in descending order of frequency. If two elements have equal frequency, sort by element value ascending.",
  "nums = <array of integers>", "Array of integers",
  [{"input": "nums = [2, 5, 2, 8, 5, 6, 8, 8]", "output": "[8, 8, 8, 2, 2, 5, 5, 6]"}],
  "Count frequency of each element first.",
  "Sort using custom comparator: primary key is -frequency, secondary key is value.",
  "def solve(nums):\n    from collections import Counter\n    c = Counter(nums)\n    return sorted(nums, key=lambda x: (-c[x], x))",
  "vector<int> solve(vector<int>& nums) {\n    unordered_map<int, int> freq;\n    for(int x : nums) freq[x]++;\n    vector<int> res = nums;\n    sort(res.begin(), res.end(), [&](int a, int b) {\n        if (freq[a] != freq[b]) return freq[a] > freq[b];\n        return a < b;\n    });\n    return res;\n}",
  "public int[] solve(int[] nums) {\n    Map<Integer, Integer> freq = new HashMap<>();\n    for (int x : nums) freq.put(x, freq.getOrDefault(x, 0) + 1);\n    Integer[] arr = Arrays.stream(nums).boxed().toArray(Integer[]::new);\n    Arrays.sort(arr, (a, b) -> freq.get(a).equals(freq.get(b)) ? a - b : freq.get(b) - freq.get(a));\n    return Arrays.stream(arr).mapToInt(i -> i).toArray();\n}",
  "function solve(nums) {\n    const freq = {};\n    for (const x of nums) freq[x] = (freq[x] || 0) + 1;\n    return [...nums].sort((a, b) => freq[b] - freq[a] || a - b);\n}",
  "# Solution for Sorting Elements of an Array by Frequency\ndef solve(nums):\n    # Write your solution here\n    pass",
  "// Solution for Sorting Elements of an Array by Frequency\n#include <vector>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nvector<int> solve(vector<int>& nums) {\n    // Write your solution here\n    return {};\n}",
  "// Solution for Sorting Elements of an Array by Frequency\nimport java.util.*;\nclass Solution {\n    public int[] solve(int[] nums) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
  "// Solution for Sorting Elements of an Array by Frequency\nfunction solve(nums) {\n    // Write your solution here\n    return [];\n}")

# 11. Finding the Longest Palindrome in an Array
add_q("Finding the Longest Palindrome in an Array", "Easy",
  "Given an array nums of integers, find the largest numerical palindromic element. Return -1 if none exist.",
  "nums = <array of integers>", "Integer",
  [{"input": "nums = [121, 2322, 54545, 9999]", "output": "54545"}, {"input": "nums = [12, 34, 56]", "output": "-1"}],
  "Filter numbers that read the same backwards and forwards.",
  "Return the maximum value among them or -1 if empty.",
  "def solve(nums):\n    pals = [x for x in nums if str(x) == str(x)[::-1]]\n    return max(pals) if pals else -1",
  "int solve(vector<int>& nums) {\n    auto is_pal = [](int n) {\n        if (n < 0) return false;\n        string s = to_string(n);\n        return equal(s.begin(), s.begin() + s.size()/2, s.rbegin());\n    };\n    int mx = -1;\n    for (int x : nums) if (is_pal(x) && x > mx) mx = x;\n    return mx;\n}",
  "public int solve(int[] nums) {\n    int max = -1;\n    for (int x : nums) {\n        String s = String.valueOf(x);\n        if (s.equals(new StringBuilder(s).reverse().toString()) && x > max) max = x;\n    }\n    return max;\n}",
  "function solve(nums) {\n    const pals = nums.filter(x => x.toString() === x.toString().split('').reverse().join(''));\n    return pals.length ? Math.max(...pals) : -1;\n}",
  "# Solution for Finding the Longest Palindrome in an Array\ndef solve(nums):\n    # Write your solution here\n    pass",
  "// Solution for Finding the Longest Palindrome in an Array\n#include <vector>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nint solve(vector<int>& nums) {\n    // Write your solution here\n    return -1;\n}",
  "// Solution for Finding the Longest Palindrome in an Array\nclass Solution {\n    public int solve(int[] nums) {\n        // Write your solution here\n        return -1;\n    }\n}",
  "// Solution for Finding the Longest Palindrome in an Array\nfunction solve(nums) {\n    // Write your solution here\n    return -1;\n}")

# 12. Counting Distinct Elements in an Array
add_q("Counting Distinct Elements in an Array", "Easy",
  "Count the number of distinct (unique) elements in an array nums.",
  "nums = <array of integers>", "Integer",
  [{"input": "nums = [10, 20, 20, 10, 30, 40, 10]", "output": "4"}, {"input": "nums = [1, 1, 1]", "output": "1"}],
  "Use a set to store elements and return its size.",
  "Or sort the array and count elements different from their predecessor.",
  "def solve(nums):\n    return len(set(nums))",
  "int solve(vector<int>& nums) {\n    unordered_set<int> s(nums.begin(), nums.end());\n    return (int)s.size();\n}",
  "public int solve(int[] nums) {\n    Set<Integer> set = new HashSet<>();\n    for (int x : nums) set.add(x);\n    return set.size();\n}",
  "function solve(nums) {\n    return new Set(nums).size;\n}",
  "# Solution for Counting Distinct Elements in an Array\ndef solve(nums):\n    # Write your solution here\n    pass",
  "// Solution for Counting Distinct Elements in an Array\n#include <vector>\n#include <unordered_set>\nusing namespace std;\n\nint solve(vector<int>& nums) {\n    // Write your solution here\n    return 0;\n}",
  "// Solution for Counting Distinct Elements in an Array\nimport java.util.*;\nclass Solution {\n    public int solve(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "// Solution for Counting Distinct Elements in an Array\nfunction solve(nums) {\n    // Write your solution here\n    return 0;\n}")

# 13. Finding Repeating elements in an Array
add_q("Finding Repeating Elements in an Array", "Easy",
  "Find all elements that appear more than once in an array nums. Return them in sorted order.",
  "nums = <array of integers>", "Array of integers",
  [{"input": "nums = [4, 2, 4, 5, 2, 3, 1]", "output": "[2, 4]"}, {"input": "nums = [1, 2, 3]", "output": "[]"}],
  "Count frequencies of each element.",
  "Collect elements with frequency > 1 and sort.",
  "def solve(nums):\n    from collections import Counter\n    c = Counter(nums)\n    return sorted([k for k, v in c.items() if v > 1])",
  "vector<int> solve(vector<int>& nums) {\n    unordered_map<int, int> mp;\n    for (int x : nums) mp[x]++;\n    vector<int> res;\n    for (auto& p : mp) if (p.second > 1) res.push_back(p.first);\n    sort(res.begin(), res.end());\n    return res;\n}",
  "public List<Integer> solve(int[] nums) {\n    Map<Integer, Integer> map = new HashMap<>();\n    for (int x : nums) map.put(x, map.getOrDefault(x, 0) + 1);\n    List<Integer> res = new ArrayList<>();\n    for (var e : map.entrySet()) if (e.getValue() > 1) res.add(e.getKey());\n    Collections.sort(res);\n    return res;\n}",
  "function solve(nums) {\n    const freq = {};\n    for (const x of nums) freq[x] = (freq[x] || 0) + 1;\n    return Object.keys(freq).map(Number).filter(k => freq[k] > 1).sort((a, b) => a - b);\n}",
  "# Solution for Finding Repeating Elements in an Array\ndef solve(nums):\n    # Write your solution here\n    pass",
  "// Solution for Finding Repeating Elements in an Array\n#include <vector>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nvector<int> solve(vector<int>& nums) {\n    // Write your solution here\n    return {};\n}",
  "// Solution for Finding Repeating Elements in an Array\nimport java.util.*;\nclass Solution {\n    public List<Integer> solve(int[] nums) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
  "// Solution for Finding Repeating Elements in an Array\nfunction solve(nums) {\n    // Write your solution here\n    return [];\n}")

# 14. Finding Non Repeating elements in an Array
add_q("Finding Non Repeating Elements in an Array", "Easy",
  "Find all elements that appear exactly once in an array nums. Return them in sorted order.",
  "nums = <array of integers>", "Array of integers",
  [{"input": "nums = [1, 2, -1, 1, 3, 2]", "output": "[-1, 3]"}],
  "Count frequency of each element in the array.",
  "Filter elements with frequency == 1 and sort.",
  "def solve(nums):\n    from collections import Counter\n    c = Counter(nums)\n    return sorted([k for k, v in c.items() if v == 1])",
  "vector<int> solve(vector<int>& nums) {\n    unordered_map<int, int> mp;\n    for (int x : nums) mp[x]++;\n    vector<int> res;\n    for (auto& p : mp) if (p.second == 1) res.push_back(p.first);\n    sort(res.begin(), res.end());\n    return res;\n}",
  "public List<Integer> solve(int[] nums) {\n    Map<Integer, Integer> map = new HashMap<>();\n    for (int x : nums) map.put(x, map.getOrDefault(x, 0) + 1);\n    List<Integer> res = new ArrayList<>();\n    for (var e : map.entrySet()) if (e.getValue() == 1) res.add(e.getKey());\n    Collections.sort(res);\n    return res;\n}",
  "function solve(nums) {\n    const freq = {};\n    for (const x of nums) freq[x] = (freq[x] || 0) + 1;\n    return Object.keys(freq).map(Number).filter(k => freq[k] === 1).sort((a, b) => a - b);\n}",
  "# Solution for Finding Non Repeating Elements in an Array\ndef solve(nums):\n    # Write your solution here\n    pass",
  "// Solution for Finding Non Repeating Elements in an Array\n#include <vector>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nvector<int> solve(vector<int>& nums) {\n    // Write your solution here\n    return {};\n}",
  "// Solution for Finding Non Repeating Elements in an Array\nimport java.util.*;\nclass Solution {\n    public List<Integer> solve(int[] nums) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
  "// Solution for Finding Non Repeating Elements in an Array\nfunction solve(nums) {\n    // Write your solution here\n    return [];\n}")

# 15. Removing Duplicate elements from an array
add_q("Removing Duplicate Elements from an Array", "Easy",
  "Remove all duplicate elements from an array nums, preserving the first occurrence order.",
  "nums = <array of integers>", "Array of integers",
  [{"input": "nums = [10, 20, 20, 30, 40, 40, 40, 50]", "output": "[10, 20, 30, 40, 50]"}],
  "Iterate and keep track of seen elements using a hash set.",
  "Only append an element to the result if it hasn't been seen.",
  "def solve(nums):\n    seen = set()\n    res = []\n    for x in nums:\n        if x not in seen:\n            seen.add(x)\n            res.append(x)\n    return res",
  "vector<int> solve(vector<int>& nums) {\n    unordered_set<int> seen;\n    vector<int> res;\n    for (int x : nums) {\n        if (seen.find(x) == seen.end()) {\n            seen.insert(x);\n            res.push_back(x);\n        }\n    }\n    return res;\n}",
  "public int[] solve(int[] nums) {\n    Set<Integer> seen = new HashSet<>();\n    List<Integer> res = new ArrayList<>();\n    for (int x : nums) if (seen.add(x)) res.add(x);\n    return res.stream().mapToInt(i -> i).toArray();\n}",
  "function solve(nums) {\n    return [...new Set(nums)];\n}",
  "# Solution for Removing Duplicate Elements from an Array\ndef solve(nums):\n    # Write your solution here\n    pass",
  "// Solution for Removing Duplicate Elements from an Array\n#include <vector>\n#include <unordered_set>\nusing namespace std;\n\nvector<int> solve(vector<int>& nums) {\n    // Write your solution here\n    return {};\n}",
  "// Solution for Removing Duplicate Elements from an Array\nimport java.util.*;\nclass Solution {\n    public int[] solve(int[] nums) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
  "// Solution for Removing Duplicate Elements from an Array\nfunction solve(nums) {\n    // Write your solution here\n    return [];\n}")

# 16. Finding Minimum scalar product of two vectors
add_q("Minimum Scalar Product of Two Vectors", "Medium",
  "Given two vectors a and b, find the minimum scalar (dot) product by permuting their elements.",
  "a = <array of integers>, b = <array of integers>", "Integer",
  [{"input": "a = [1, 2, 6, 3, 7], b = [10, 7, 45, 3, 7]", "output": "149"}],
  "To minimize the dot product, pair the smallest element of a with the largest element of b.",
  "Sort array a ascending and array b descending, then sum the products.",
  "def solve(a, b):\n    a.sort()\n    b.sort(reverse=True)\n    return sum(x * y for x, y in zip(a, b))",
  "long long solve(vector<int>& a, vector<int>& b) {\n    sort(a.begin(), a.end());\n    sort(b.begin(), b.end(), greater<int>());\n    long long sum = 0;\n    for (size_t i = 0; i < a.size(); ++i) sum += (long long)a[i] * b[i];\n    return sum;\n}",
  "public long solve(int[] a, int[] b) {\n    Arrays.sort(a);\n    Arrays.sort(b);\n    long sum = 0;\n    int n = a.length;\n    for (int i = 0; i < n; i++) sum += (long)a[i] * b[n - 1 - i];\n    return sum;\n}",
  "function solve(a, b) {\n    a.sort((x, y) => x - y);\n    b.sort((x, y) => y - x);\n    return a.reduce((sum, val, i) => sum + val * b[i], 0);\n}",
  "# Solution for Minimum Scalar Product of Two Vectors\ndef solve(a, b):\n    # Write your solution here\n    pass",
  "// Solution for Minimum Scalar Product of Two Vectors\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nlong long solve(vector<int>& a, vector<int>& b) {\n    // Write your solution here\n    return 0;\n}",
  "// Solution for Minimum Scalar Product of Two Vectors\nimport java.util.*;\nclass Solution {\n    public long solve(int[] a, int[] b) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "// Solution for Minimum Scalar Product of Two Vectors\nfunction solve(a, b) {\n    // Write your solution here\n    return 0;\n}")

# 17. Finding Maximum scalar product of two vectors in an array
add_q("Maximum Scalar Product of Two Vectors", "Medium",
  "Given two vectors a and b, find the maximum scalar (dot) product by permuting their elements.",
  "a = <array of integers>, b = <array of integers>", "Integer",
  [{"input": "a = [1, 2, 6, 3, 7], b = [10, 7, 45, 3, 7]", "output": "395"}],
  "To maximize the dot product, pair the largest element of a with the largest of b.",
  "Sort both arrays in ascending order, then sum the component-wise products.",
  "def solve(a, b):\n    a.sort()\n    b.sort()\n    return sum(x * y for x, y in zip(a, b))",
  "long long solve(vector<int>& a, vector<int>& b) {\n    sort(a.begin(), a.end());\n    sort(b.begin(), b.end());\n    long long sum = 0;\n    for (size_t i = 0; i < a.size(); ++i) sum += (long long)a[i] * b[i];\n    return sum;\n}",
  "public long solve(int[] a, int[] b) {\n    Arrays.sort(a);\n    Arrays.sort(b);\n    long sum = 0;\n    for (int i = 0; i < a.length; i++) sum += (long)a[i] * b[i];\n    return sum;\n}",
  "function solve(a, b) {\n    a.sort((x, y) => x - y);\n    b.sort((x, y) => x - y);\n    return a.reduce((sum, val, i) => sum + val * b[i], 0);\n}",
  "# Solution for Maximum Scalar Product of Two Vectors\ndef solve(a, b):\n    # Write your solution here\n    pass",
  "// Solution for Maximum Scalar Product of Two Vectors\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nlong long solve(vector<int>& a, vector<int>& b) {\n    // Write your solution here\n    return 0;\n}",
  "// Solution for Maximum Scalar Product of Two Vectors\nimport java.util.*;\nclass Solution {\n    public long solve(int[] a, int[] b) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "// Solution for Maximum Scalar Product of Two Vectors\nfunction solve(a, b) {\n    // Write your solution here\n    return 0;\n}")

# 18. Counting the number of even and odd elements in an array
add_q("Count Even and Odd Elements in an Array", "Easy",
  "Given an array nums, count the number of even and odd elements. Return [even_count, odd_count].",
  "nums = <array of integers>", "Array of integers [even_count, odd_count]",
  [{"input": "nums = [1, 2, 3, 4, 5, 6]", "output": "[3, 3]"}, {"input": "nums = [2, 4, 6]", "output": "[3, 0]"}],
  "Iterate through the array and check each number using modulo 2.",
  "Even: x % 2 == 0; Odd: x % 2 != 0.",
  "def solve(nums):\n    even = sum(1 for x in nums if x % 2 == 0)\n    return [even, len(nums) - even]",
  "vector<int> solve(vector<int>& nums) {\n    int even = 0, odd = 0;\n    for (int x : nums) { if (x % 2 == 0) even++; else odd++; }\n    return {even, odd};\n}",
  "public int[] solve(int[] nums) {\n    int even = 0, odd = 0;\n    for (int x : nums) { if (x % 2 == 0) even++; else odd++; }\n    return new int[]{even, odd};\n}",
  "function solve(nums) {\n    const even = nums.filter(x => x % 2 === 0).length;\n    return [even, nums.length - even];\n}",
  "# Solution for Count Even and Odd Elements in an Array\ndef solve(nums):\n    # Write your solution here\n    pass",
  "// Solution for Count Even and Odd Elements in an Array\n#include <vector>\nusing namespace std;\n\nvector<int> solve(vector<int>& nums) {\n    // Write your solution here\n    return {};\n}",
  "// Solution for Count Even and Odd Elements in an Array\nclass Solution {\n    public int[] solve(int[] nums) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
  "// Solution for Count Even and Odd Elements in an Array\nfunction solve(nums) {\n    // Write your solution here\n    return [];\n}")

# 19. Find all Symmetric pairs in an array
add_q("Find All Symmetric Pairs in an Array", "Medium",
  "Given pairs of integers, find all symmetric pairs (i.e. [a, b] and [b, a]). Return pairs [a, b] where a < b.",
  "pairs = <array of 2-element arrays>", "Array of 2-element arrays",
  [{"input": "pairs = [[11, 20], [30, 40], [5, 10], [40, 30], [10, 5]]", "output": "[[5, 10], [30, 40]]"}],
  "Store each pair in a map or set.",
  "When encountering [b, a], if [a, b] is already in the map, add to symmetric pairs.",
  "def solve(pairs):\n    d = {}\n    res = []\n    for a, b in pairs:\n        if b in d and d[b] == a:\n            res.append(sorted([a, b]))\n        else:\n            d[a] = b\n    return sorted(res)",
  "vector<vector<int>> solve(vector<vector<int>>& pairs) {\n    unordered_map<int, int> mp;\n    vector<vector<int>> res;\n    for (auto& p : pairs) {\n        int a = p[0], b = p[1];\n        if (mp.count(b) && mp[b] == a) {\n            res.push_back({min(a, b), max(a, b)});\n        } else {\n            mp[a] = b;\n        }\n    }\n    sort(res.begin(), res.end());\n    return res;\n}",
  "public List<List<Integer>> solve(int[][] pairs) {\n    Map<Integer, Integer> map = new HashMap<>();\n    List<List<Integer>> res = new ArrayList<>();\n    for (int[] p : pairs) {\n        int a = p[0], b = p[1];\n        if (map.containsKey(b) && map.get(b) == a) {\n            res.add(Arrays.asList(Math.min(a, b), Math.max(a, b)));\n        } else {\n            map.put(a, b);\n        }\n    }\n    res.sort((p1, p2) -> p1.get(0).equals(p2.get(0)) ? p1.get(1) - p2.get(1) : p1.get(0) - p2.get(0));\n    return res;\n}",
  "function solve(pairs) {\n    const map = new Map();\n    const res = [];\n    for (const [a, b] of pairs) {\n        if (map.has(b) && map.get(b) === a) {\n            res.push([Math.min(a, b), Math.max(a, b)]);\n        } else {\n            map.set(a, b);\n        }\n    }\n    return res.sort((p1, p2) => p1[0] - p2[0] || p1[1] - p2[1]);\n}",
  "# Solution for Find All Symmetric Pairs in an Array\ndef solve(pairs):\n    # Write your solution here\n    pass",
  "// Solution for Find All Symmetric Pairs in an Array\n#include <vector>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nvector<vector<int>> solve(vector<vector<int>>& pairs) {\n    // Write your solution here\n    return {};\n}",
  "// Solution for Find All Symmetric Pairs in an Array\nimport java.util.*;\nclass Solution {\n    public List<List<Integer>> solve(int[][] pairs) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
  "// Solution for Find All Symmetric Pairs in an Array\nfunction solve(pairs) {\n    // Write your solution here\n    return [];\n}")

# 20. Find maximum product sub-array in a given array
add_q("Maximum Product Subarray", "Medium",
  "Find the contiguous subarray within an array nums which has the largest product.",
  "nums = <array of integers>", "Integer",
  [{"input": "nums = [2, 3, -2, 4]", "output": "6"}, {"input": "nums = [-2, 0, -1]", "output": "0"}],
  "Maintain both max_so_far and min_so_far, since multiplying by a negative number can turn a minimum into a maximum.",
  "Swap max and min when encountering a negative number.",
  "def solve(nums):\n    res = max(nums)\n    cur_min, cur_max = 1, 1\n    for n in nums:\n        if n == 0:\n            cur_min, cur_max = 1, 1\n            continue\n        tmp = cur_max * n\n        cur_max = max(n * cur_max, n * cur_min, n)\n        cur_min = min(tmp, n * cur_min, n)\n        res = max(res, cur_max)\n    return res",
  "int solve(vector<int>& nums) {\n    int res = nums[0], cur_max = nums[0], cur_min = nums[0];\n    for (size_t i = 1; i < nums.size(); ++i) {\n        if (nums[i] < 0) swap(cur_max, cur_min);\n        cur_max = max(nums[i], cur_max * nums[i]);\n        cur_min = min(nums[i], cur_min * nums[i]);\n        res = max(res, cur_max);\n    }\n    return res;\n}",
  "public int solve(int[] nums) {\n    int res = nums[0], curMax = nums[0], curMin = nums[0];\n    for (int i = 1; i < nums.length; i++) {\n        if (nums[i] < 0) { int t = curMax; curMax = curMin; curMin = t; }\n        curMax = Math.max(nums[i], curMax * nums[i]);\n        curMin = Math.min(nums[i], curMin * nums[i]);\n        res = Math.max(res, curMax);\n    }\n    return res;\n}",
  "function solve(nums) {\n    let res = nums[0], curMax = nums[0], curMin = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        if (nums[i] < 0) [curMax, curMin] = [curMin, curMax];\n        curMax = Math.max(nums[i], curMax * nums[i]);\n        curMin = Math.min(nums[i], curMin * nums[i]);\n        res = Math.max(res, curMax);\n    }\n    return res;\n}",
  "# Solution for Maximum Product Subarray\ndef solve(nums):\n    # Write your solution here\n    pass",
  "// Solution for Maximum Product Subarray\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint solve(vector<int>& nums) {\n    // Write your solution here\n    return 0;\n}",
  "// Solution for Maximum Product Subarray\nclass Solution {\n    public int solve(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "// Solution for Maximum Product Subarray\nfunction solve(nums) {\n    // Write your solution here\n    return 0;\n}")

# 21. Finding Arrays are disjoint or not
add_q("Determine if Two Arrays are Disjoint", "Easy",
  "Given two arrays a and b, determine if they are disjoint (they share no elements).",
  "a = <array of integers>, b = <array of integers>", "Boolean (true/false)",
  [{"input": "a = [12, 34, 11, 9, 3], b = [7, 2, 1, 5]", "output": "true"}, {"input": "a = [12, 34, 11, 9, 3], b = [2, 1, 3, 5]", "output": "false"}],
  "Check if the intersection of the two sets is empty.",
  "Use a hash set to store elements of one array and check against the other.",
  "def solve(a, b):\n    return len(set(a).intersection(set(b))) == 0",
  "bool solve(vector<int>& a, vector<int>& b) {\n    unordered_set<int> s(a.begin(), a.end());\n    for (int x : b) if (s.count(x)) return false;\n    return true;\n}",
  "public boolean solve(int[] a, int[] b) {\n    Set<Integer> set = new HashSet<>();\n    for (int x : a) set.add(x);\n    for (int x : b) if (set.contains(x)) return false;\n    return true;\n}",
  "function solve(a, b) {\n    const s = new Set(a);\n    return !b.some(x => s.has(x));\n}",
  "# Solution for Determine if Two Arrays are Disjoint\ndef solve(a, b):\n    # Write your solution here\n    pass",
  "// Solution for Determine if Two Arrays are Disjoint\n#include <vector>\n#include <unordered_set>\nusing namespace std;\n\nbool solve(vector<int>& a, vector<int>& b) {\n    // Write your solution here\n    return false;\n}",
  "// Solution for Determine if Two Arrays are Disjoint\nimport java.util.*;\nclass Solution {\n    public boolean solve(int[] a, int[] b) {\n        // Write your solution here\n        return false;\n    }\n}",
  "// Solution for Determine if Two Arrays are Disjoint\nfunction solve(a, b) {\n    // Write your solution here\n    return false;\n}")

# 22. Determine Array is a subset of another array or not
add_q("Determine Array is a Subset of Another Array", "Easy",
  "Determine whether array sub is a subset of array arr.",
  "arr = <array of integers>, sub = <array of integers>", "Boolean (true/false)",
  [{"input": "arr = [11, 1, 13, 21, 3, 7], sub = [11, 3, 7, 1]", "output": "true"}, {"input": "arr = [10, 5, 2, 23, 19], sub = [19, 5, 3]", "output": "false"}],
  "Convert the parent array into a hash set.",
  "Verify every element in the candidate subset exists in the set.",
  "def solve(arr, sub):\n    s = set(arr)\n    return all(x in s for x in sub)",
  "bool solve(vector<int>& arr, vector<int>& sub) {\n    unordered_set<int> s(arr.begin(), arr.end());\n    for (int x : sub) if (!s.count(x)) return false;\n    return true;\n}",
  "public boolean solve(int[] arr, int[] sub) {\n    Set<Integer> set = new HashSet<>();\n    for (int x : arr) set.add(x);\n    for (int x : sub) if (!set.contains(x)) return false;\n    return true;\n}",
  "function solve(arr, sub) {\n    const s = new Set(arr);\n    return sub.every(x => s.has(x));\n}",
  "# Solution for Determine Array is a Subset of Another Array\ndef solve(arr, sub):\n    # Write your solution here\n    pass",
  "// Solution for Determine Array is a Subset of Another Array\n#include <vector>\n#include <unordered_set>\nusing namespace std;\n\nbool solve(vector<int>& arr, vector<int>& sub) {\n    // Write your solution here\n    return false;\n}",
  "// Solution for Determine Array is a Subset of Another Array\nimport java.util.*;\nclass Solution {\n    public boolean solve(int[] arr, int[] sub) {\n        // Write your solution here\n        return false;\n    }\n}",
  "// Solution for Determine Array is a Subset of Another Array\nfunction solve(arr, sub) {\n    // Write your solution here\n    return false;\n}")

# 23. Determine can all numbers of an array be made equal
add_q("Determine Can All Numbers of an Array Be Made Equal", "Medium",
  "Given an array nums, check if all numbers can be made equal by only multiplying by 2 or 3 any number of times.",
  "nums = <array of integers>", "Boolean (true/false)",
  [{"input": "nums = [50, 75, 150]", "output": "true"}, {"input": "nums = [10, 14]", "output": "false"}],
  "Divide out all factors of 2 and 3 from each number.",
  "If the remaining quotients are all equal, the numbers can be made equal.",
  "def solve(nums):\n    def reduce_val(n):\n        while n % 2 == 0: n //= 2\n        while n % 3 == 0: n //= 3\n        return n\n    reduced = [reduce_val(x) for x in nums]\n    return len(set(reduced)) <= 1",
  "bool solve(vector<int>& nums) {\n    auto reduce_val = [](int n) {\n        while (n % 2 == 0) n /= 2;\n        while (n % 3 == 0) n /= 3;\n        return n;\n    };\n    int first = reduce_val(nums[0]);\n    for (size_t i = 1; i < nums.size(); ++i) if (reduce_val(nums[i]) != first) return false;\n    return true;\n}",
  "public boolean solve(int[] nums) {\n    int first = reduceVal(nums[0]);\n    for (int i = 1; i < nums.length; i++) if (reduceVal(nums[i]) != first) return false;\n    return true;\n}\nprivate int reduceVal(int n) {\n    while (n % 2 == 0) n /= 2;\n    while (n % 3 == 0) n /= 3;\n    return n;\n}",
  "function solve(nums) {\n    const reduce = n => { while (n % 2 === 0) n /= 2; while (n % 3 === 0) n /= 3; return n; };\n    const first = reduce(nums[0]);\n    return nums.every(x => reduce(x) === first);\n}",
  "# Solution for Determine Can All Numbers of an Array Be Made Equal\ndef solve(nums):\n    # Write your solution here\n    pass",
  "// Solution for Determine Can All Numbers of an Array Be Made Equal\n#include <vector>\nusing namespace std;\n\nbool solve(vector<int>& nums) {\n    // Write your solution here\n    return false;\n}",
  "// Solution for Determine Can All Numbers of an Array Be Made Equal\nclass Solution {\n    public boolean solve(int[] nums) {\n        // Write your solution here\n        return false;\n    }\n}",
  "// Solution for Determine Can All Numbers of an Array Be Made Equal\nfunction solve(nums) {\n    // Write your solution here\n    return false;\n}")

# 24. Finding Minimum sum of absolute difference of given array
add_q("Minimum Sum of Absolute Difference of Array", "Easy",
  "Given an array nums, find the minimum sum of absolute differences around the median.",
  "nums = <array of integers>", "Integer",
  [{"input": "nums = [2, 4, 5, 3]", "output": "4"}, {"input": "nums = [1, 2, 3]", "output": "2"}],
  "The sum of absolute differences is minimized at the median of the array.",
  "Sort the array, pick the median element, and sum |x - median|.",
  "def solve(nums):\n    nums.sort()\n    med = nums[len(nums) // 2]\n    return sum(abs(x - med) for x in nums)",
  "int solve(vector<int>& nums) {\n    sort(nums.begin(), nums.end());\n    int med = nums[nums.size() / 2];\n    int sum = 0;\n    for (int x : nums) sum += abs(x - med);\n    return sum;\n}",
  "public int solve(int[] nums) {\n    Arrays.sort(nums);\n    int med = nums[nums.length / 2];\n    int sum = 0;\n    for (int x : nums) sum += Math.abs(x - med);\n    return sum;\n}",
  "function solve(nums) {\n    nums.sort((a, b) => a - b);\n    const med = nums[Math.floor(nums.length / 2)];\n    return nums.reduce((s, x) => s + Math.abs(x - med), 0);\n}",
  "# Solution for Minimum Sum of Absolute Difference of Array\ndef solve(nums):\n    # Write your solution here\n    pass",
  "// Solution for Minimum Sum of Absolute Difference of Array\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint solve(vector<int>& nums) {\n    // Write your solution here\n    return 0;\n}",
  "// Solution for Minimum Sum of Absolute Difference of Array\nimport java.util.*;\nclass Solution {\n    public int solve(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "// Solution for Minimum Sum of Absolute Difference of Array\nfunction solve(nums) {\n    // Write your solution here\n    return 0;\n}")

# 25. Sort an array according to the order defined by another array
add_q("Sort an Array According to Order Defined by Another Array", "Medium",
  "Sort array a according to the relative order defined by array b. Elements not present in b should be sorted ascending at the end.",
  "a = <array of integers>, b = <array of integers>", "Array of integers",
  [{"input": "a = [2, 1, 2, 5, 7, 1, 9, 3, 6, 8, 8], b = [2, 1, 8, 3]", "output": "[2, 2, 1, 1, 8, 8, 3, 5, 6, 7, 9]"}],
  "Map elements of b to their index (priority).",
  "Assign elements not in b a high priority and sort them by natural value.",
  "def solve(a, b):\n    order = {val: i for i, val in enumerate(b)}\n    return sorted(a, key=lambda x: (order.get(x, float('inf')), x))",
  "vector<int> solve(vector<int>& a, vector<int>& b) {\n    unordered_map<int, int> order;\n    for (size_t i = 0; i < b.size(); ++i) order[b[i]] = i;\n    vector<int> res = a;\n    sort(res.begin(), res.end(), [&](int x, int y) {\n        int ox = order.count(x) ? order[x] : 1e9;\n        int oy = order.count(y) ? order[y] : 1e9;\n        if (ox != oy) return ox < oy;\n        return x < y;\n    });\n    return res;\n}",
  "public int[] solve(int[] a, int[] b) {\n    Map<Integer, Integer> order = new HashMap<>();\n    for (int i = 0; i < b.length; i++) order.put(b[i], i);\n    Integer[] arr = Arrays.stream(a).boxed().toArray(Integer[]::new);\n    Arrays.sort(arr, (x, y) -> {\n        int ox = order.getOrDefault(x, Integer.MAX_VALUE);\n        int oy = order.getOrDefault(y, Integer.MAX_VALUE);\n        return ox != oy ? ox - oy : x - y;\n    });\n    return Arrays.stream(arr).mapToInt(i -> i).toArray();\n}",
  "function solve(a, b) {\n    const order = new Map();\n    b.forEach((val, i) => order.set(val, i));\n    return [...a].sort((x, y) => {\n        const ox = order.has(x) ? order.get(x) : Infinity;\n        const oy = order.has(y) ? order.get(y) : Infinity;\n        return ox !== oy ? ox - oy : x - y;\n    });\n}",
  "# Solution for Sort an Array According to Order Defined by Another Array\ndef solve(a, b):\n    # Write your solution here\n    pass",
  "// Solution for Sort an Array According to Order Defined by Another Array\n#include <vector>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nvector<int> solve(vector<int>& a, vector<int>& b) {\n    // Write your solution here\n    return {};\n}",
  "// Solution for Sort an Array According to Order Defined by Another Array\nimport java.util.*;\nclass Solution {\n    public int[] solve(int[] a, int[] b) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
  "// Solution for Sort an Array According to Order Defined by Another Array\nfunction solve(a, b) {\n    // Write your solution here\n    return [];\n}")

# 26. Replace each element of the array by its rank in the array
add_q("Replace Each Element of Array by its Rank", "Easy",
  "Given an array nums, replace each element by its 1-based rank (smallest element has rank 1).",
  "nums = <array of integers>", "Array of integers",
  [{"input": "nums = [100, 2, 70, 2]", "output": "[3, 1, 2, 1]"}, {"input": "nums = [40, 10, 20, 30]", "output": "[4, 1, 2, 3]"}],
  "Extract sorted unique values from nums.",
  "Map each unique value to its 1-based rank (index + 1).",
  "def solve(nums):\n    ranks = {val: i + 1 for i, val in enumerate(sorted(set(nums)))}\n    return [ranks[x] for x in nums]",
  "vector<int> solve(vector<int>& nums) {\n    vector<int> sorted_unique = nums;\n    sort(sorted_unique.begin(), sorted_unique.end());\n    sorted_unique.erase(unique(sorted_unique.begin(), sorted_unique.end()), sorted_unique.end());\n    unordered_map<int, int> rank;\n    for (size_t i = 0; i < sorted_unique.size(); ++i) rank[sorted_unique[i]] = i + 1;\n    vector<int> res;\n    for (int x : nums) res.push_back(rank[x]);\n    return res;\n}",
  "public int[] solve(int[] nums) {\n    int[] sorted = Arrays.stream(nums).distinct().sorted().toArray();\n    Map<Integer, Integer> rank = new HashMap<>();\n    for (int i = 0; i < sorted.length; i++) rank.put(sorted[i], i + 1);\n    return Arrays.stream(nums).map(rank::get).toArray();\n}",
  "function solve(nums) {\n    const sorted = [...new Set(nums)].sort((a, b) => a - b);\n    const ranks = new Map();\n    sorted.forEach((val, i) => ranks.set(val, i + 1));\n    return nums.map(x => ranks.get(x));\n}",
  "# Solution for Replace Each Element of Array by its Rank\ndef solve(nums):\n    # Write your solution here\n    pass",
  "// Solution for Replace Each Element of Array by its Rank\n#include <vector>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nvector<int> solve(vector<int>& nums) {\n    // Write your solution here\n    return {};\n}",
  "// Solution for Replace Each Element of Array by its Rank\nimport java.util.*;\nclass Solution {\n    public int[] solve(int[] nums) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
  "// Solution for Replace Each Element of Array by its Rank\nfunction solve(nums) {\n    // Write your solution here\n    return [];\n}")

# 27. Finding equilibrium index of an array
add_q("Finding Equilibrium Index of an Array", "Easy",
  "Find the first equilibrium index of array nums where sum of lower indices equals sum of higher indices. Return -1 if none.",
  "nums = <array of integers>", "Integer",
  [{"input": "nums = [-7, 1, 5, 2, -4, 3, 0]", "output": "3", "explanation": "nums[0]+nums[1]+nums[2] = -1, nums[4]+nums[5]+nums[6] = -1"}, {"input": "nums = [1, 2, 3]", "output": "-1"}],
  "Compute the total sum of the array first.",
  "Iterate and keep track of left_sum; right_sum = total - left_sum - nums[i].",
  "def solve(nums):\n    total = sum(nums)\n    left_sum = 0\n    for i, x in enumerate(nums):\n        if left_sum == total - left_sum - x:\n            return i\n        left_sum += x\n    return -1",
  "int solve(vector<int>& nums) {\n    long long total = 0;\n    for (int x : nums) total += x;\n    long long left_sum = 0;\n    for (size_t i = 0; i < nums.size(); ++i) {\n        if (left_sum == total - left_sum - nums[i]) return (int)i;\n        left_sum += nums[i];\n    }\n    return -1;\n}",
  "public int solve(int[] nums) {\n    long total = 0;\n    for (int x : nums) total += x;\n    long leftSum = 0;\n    for (int i = 0; i < nums.length; i++) {\n        if (leftSum == total - leftSum - nums[i]) return i;\n        leftSum += nums[i];\n    }\n    return -1;\n}",
  "function solve(nums) {\n    const total = nums.reduce((a, b) => a + b, 0);\n    let leftSum = 0;\n    for (let i = 0; i < nums.length; i++) {\n        if (leftSum === total - leftSum - nums[i]) return i;\n        leftSum += nums[i];\n    }\n    return -1;\n}",
  "# Solution for Finding Equilibrium Index of an Array\ndef solve(nums):\n    # Write your solution here\n    pass",
  "// Solution for Finding Equilibrium Index of an Array\n#include <vector>\nusing namespace std;\n\nint solve(vector<int>& nums) {\n    // Write your solution here\n    return -1;\n}",
  "// Solution for Finding Equilibrium Index of an Array\nclass Solution {\n    public int solve(int[] nums) {\n        // Write your solution here\n        return -1;\n    }\n}",
  "// Solution for Finding Equilibrium Index of an Array\nfunction solve(nums) {\n    // Write your solution here\n    return -1;\n}")

# 28. Rotation of elements of array- left and right
add_q("Rotation of Elements of Array Left and Right", "Easy",
  "Rotate array nums left by k positions.",
  "nums = <array of integers>, k = <integer>", "Array of integers",
  [{"input": "nums = [1, 2, 3, 4, 5], k = 2", "output": "[3, 4, 5, 1, 2]"}],
  "k = k % len(nums).",
  "Left rotation takes nums[k:] and concatenates nums[:k].",
  "def solve(nums, k):\n    if not nums: return []\n    k %= len(nums)\n    return nums[k:] + nums[:k]",
  "vector<int> solve(vector<int>& nums, int k) {\n    if (nums.empty()) return {};\n    k %= nums.size();\n    vector<int> res(nums.begin() + k, nums.end());\n    res.insert(res.end(), nums.begin(), nums.begin() + k);\n    return res;\n}",
  "public int[] solve(int[] nums, int k) {\n    if (nums.length == 0) return new int[]{};\n    k %= nums.length;\n    int[] res = new int[nums.length];\n    for (int i = 0; i < nums.length; i++) res[i] = nums[(i + k) % nums.length];\n    return res;\n}",
  "function solve(nums, k) {\n    if (!nums.length) return [];\n    k %= nums.length;\n    return [...nums.slice(k), ...nums.slice(0, k)];\n}",
  "# Solution for Rotation of Elements of Array Left and Right\ndef solve(nums, k):\n    # Write your solution here\n    pass",
  "// Solution for Rotation of Elements of Array Left and Right\n#include <vector>\nusing namespace std;\n\nvector<int> solve(vector<int>& nums, int k) {\n    // Write your solution here\n    return {};\n}",
  "// Solution for Rotation of Elements of Array Left and Right\nclass Solution {\n    public int[] solve(int[] nums, int k) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
  "// Solution for Rotation of Elements of Array Left and Right\nfunction solve(nums, k) {\n    // Write your solution here\n    return [];\n}")

# 29. Block swap algorithm for array rotation
add_q("Block Swap Algorithm for Array Rotation", "Medium",
  "Rotate an array of size n by d positions using the block swap algorithm.",
  "nums = <array of integers>, d = <integer>", "Array of integers",
  [{"input": "nums = [1, 2, 3, 4, 5, 6, 7], d = 2", "output": "[3, 4, 5, 6, 7, 1, 2]"}],
  "Divide array into two blocks A = nums[0..d-1] and B = nums[d..n-1].",
  "Recursively swap blocks of equal size until the array is rotated in place.",
  "def solve(nums, d):\n    n = len(nums)\n    if n == 0: return []\n    d %= n\n    return nums[d:] + nums[:d]",
  "vector<int> solve(vector<int>& nums, int d) {\n    if (nums.empty()) return {};\n    int n = nums.size();\n    d %= n;\n    vector<int> res(nums.begin() + d, nums.end());\n    res.insert(res.end(), nums.begin(), nums.begin() + d);\n    return res;\n}",
  "public int[] solve(int[] nums, int d) {\n    if (nums.length == 0) return new int[]{};\n    d %= nums.length;\n    int[] res = new int[nums.length];\n    for (int i = 0; i < nums.length; i++) res[i] = nums[(i + d) % nums.length];\n    return res;\n}",
  "function solve(nums, d) {\n    if (!nums.length) return [];\n    d %= nums.length;\n    return [...nums.slice(d), ...nums.slice(0, d)];\n}",
  "# Solution for Block Swap Algorithm for Array Rotation\ndef solve(nums, d):\n    # Write your solution here\n    pass",
  "// Solution for Block Swap Algorithm for Array Rotation\n#include <vector>\nusing namespace std;\n\nvector<int> solve(vector<int>& nums, int d) {\n    // Write your solution here\n    return {};\n}",
  "// Solution for Block Swap Algorithm for Array Rotation\nclass Solution {\n    public int[] solve(int[] nums, int d) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
  "// Solution for Block Swap Algorithm for Array Rotation\nfunction solve(nums, d) {\n    // Write your solution here\n    return [];\n}")

# 30. Juggling algorithm for array rotation
add_q("Juggling Algorithm for Array Rotation", "Medium",
  "Rotate array nums by k elements using the juggling algorithm (in O(n) time and O(1) space).",
  "nums = <array of integers>, k = <integer>", "Array of integers",
  [{"input": "nums = [1, 2, 3, 4, 5, 6], k = 2", "output": "[3, 4, 5, 6, 1, 2]"}],
  "Compute gcd(n, k). The array is divided into gcd sets of elements.",
  "Shift each set circularly by moving elements one step at a time.",
  "def solve(nums, k):\n    n = len(nums)\n    if n == 0: return []\n    k %= n\n    return nums[k:] + nums[:k]",
  "vector<int> solve(vector<int>& nums, int k) {\n    if (nums.empty()) return {};\n    int n = nums.size();\n    k %= n;\n    vector<int> res(nums.begin() + k, nums.end());\n    res.insert(res.end(), nums.begin(), nums.begin() + k);\n    return res;\n}",
  "public int[] solve(int[] nums, int k) {\n    if (nums.length == 0) return new int[]{};\n    k %= nums.length;\n    int[] res = new int[nums.length];\n    for (int i = 0; i < nums.length; i++) res[i] = nums[(i + k) % nums.length];\n    return res;\n}",
  "function solve(nums, k) {\n    if (!nums.length) return [];\n    k %= nums.length;\n    return [...nums.slice(k), ...nums.slice(0, k)];\n}",
  "# Solution for Juggling Algorithm for Array Rotation\ndef solve(nums, k):\n    # Write your solution here\n    pass",
  "// Solution for Juggling Algorithm for Array Rotation\n#include <vector>\nusing namespace std;\n\nvector<int> solve(vector<int>& nums, int k) {\n    // Write your solution here\n    return {};\n}",
  "// Solution for Juggling Algorithm for Array Rotation\nclass Solution {\n    public int[] solve(int[] nums, int k) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
  "// Solution for Juggling Algorithm for Array Rotation\nfunction solve(nums, k) {\n    // Write your solution here\n    return [];\n}")

# 31. Finding Circular rotation of an array by K positions
add_q("Circular Rotation of an Array by K Positions", "Easy",
  "Perform a right circular rotation of array nums by k positions.",
  "nums = <array of integers>, k = <integer>", "Array of integers",
  [{"input": "nums = [1, 2, 3, 4, 5], k = 2", "output": "[4, 5, 1, 2, 3]"}],
  "Right rotation shifts elements rightward.",
  "Effective index for position i is (i - k) % n.",
  "def solve(nums, k):\n    if not nums: return []\n    k %= len(nums)\n    return nums[-k:] + nums[:-k] if k else nums",
  "vector<int> solve(vector<int>& nums, int k) {\n    if (nums.empty()) return {};\n    int n = nums.size();\n    k %= n;\n    rotate(nums.rbegin(), nums.rbegin() + k, nums.rend());\n    return nums;\n}",
  "public int[] solve(int[] nums, int k) {\n    if (nums.length == 0) return new int[]{};\n    k %= nums.length;\n    int[] res = new int[nums.length];\n    for (int i = 0; i < nums.length; i++) res[(i + k) % nums.length] = nums[i];\n    return res;\n}",
  "function solve(nums, k) {\n    if (!nums.length) return [];\n    k %= nums.length;\n    return k ? [...nums.slice(-k), ...nums.slice(0, -k)] : nums;\n}",
  "# Solution for Circular Rotation of an Array by K Positions\ndef solve(nums, k):\n    # Write your solution here\n    pass",
  "// Solution for Circular Rotation of an Array by K Positions\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<int> solve(vector<int>& nums, int k) {\n    // Write your solution here\n    return {};\n}",
  "// Solution for Circular Rotation of an Array by K Positions\nclass Solution {\n    public int[] solve(int[] nums, int k) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
  "// Solution for Circular Rotation of an Array by K Positions\nfunction solve(nums, k) {\n    // Write your solution here\n    return [];\n}")

# 32. Balanced Parenthesis Problem
add_q("Balanced Parenthesis Problem", "Easy",
  "Given a string s containing '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
  "s = <string>", "Boolean (true/false)",
  [{"input": 's = "{[()]}"', "output": "true"}, {"input": 's = "{[(])}"', "output": "false"}],
  "Use a stack to track opening brackets.",
  "When a closing bracket appears, check if it matches the stack's top.",
  "def solve(s):\n    stack = []\n    pairs = {')': '(', '}': '{', ']': '['}\n    for c in s:\n        if c in '({[':\n            stack.append(c)\n        elif c in pairs:\n            if not stack or stack[-1] != pairs[c]: return False\n            stack.pop()\n    return len(stack) == 0",
  "bool solve(string s) {\n    stack<char> st;\n    for (char c : s) {\n        if (c == '(' || c == '{' || c == '[') st.push(c);\n        else {\n            if (st.empty()) return false;\n            if (c == ')' && st.top() != '(') return false;\n            if (c == '}' && st.top() != '{') return false;\n            if (c == ']' && st.top() != '[') return false;\n            st.pop();\n        }\n    }\n    return st.empty();\n}",
  "public boolean solve(String s) {\n    Stack<Character> stack = new Stack<>();\n    for (char c : s.toCharArray()) {\n        if (c == '(' || c == '{' || c == '[') stack.push(c);\n        else {\n            if (stack.isEmpty()) return false;\n            char top = stack.pop();\n            if (c == ')' && top != '(') return false;\n            if (c == '}' && top != '{') return false;\n            if (c == ']' && top != '[') return false;\n        }\n    }\n    return stack.isEmpty();\n}",
  "function solve(s) {\n    const stack = [];\n    const pairs = { ')': '(', '}': '{', ']': '[' };\n    for (const c of s) {\n        if ('({['.includes(c)) stack.push(c);\n        else if (pairs[c]) {\n            if (!stack.length || stack[stack.length - 1] !== pairs[c]) return false;\n            stack.pop();\n        }\n    }\n    return stack.length === 0;\n}",
  "# Solution for Balanced Parenthesis Problem\ndef solve(s):\n    # Write your solution here\n    pass",
  "// Solution for Balanced Parenthesis Problem\n#include <string>\n#include <stack>\nusing namespace std;\n\nbool solve(string s) {\n    // Write your solution here\n    return false;\n}",
  "// Solution for Balanced Parenthesis Problem\nimport java.util.*;\nclass Solution {\n    public boolean solve(String s) {\n        // Write your solution here\n        return false;\n    }\n}",
  "// Solution for Balanced Parenthesis Problem\nfunction solve(s) {\n    // Write your solution here\n    return false;\n}")

with open('scratch/arrays_questions.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2)

print(f"Arrays generated: {len(questions)} questions.")
