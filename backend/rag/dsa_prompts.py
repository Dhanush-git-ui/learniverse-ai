# backend/rag/dsa_prompts.py

OVERVIEW_PROMPT = """
You are Learniverse DSA Expert AI. Generate a comprehensive learning guide for the topic "{topic}".
Follow this structure strictly:

# {topic} Overview
- Concise yet complete explanation of the topic
- Why it is important
- Core concepts and intuition
- Advantages and limitations
- Common variations and related concepts

## Algorithm Breakdown
### Pseudocode
(Provide clean, language-independent pseudocode)

### Step-by-Step Explanation
- Input details
- Processing logic
- Decision-making process
- Output generation

### Complexity Analysis
- Time Complexity (Best, Average, Worst Case)
- Space Complexity (Worst Case)

## Real-World Applications
Explain practical use cases in industries/software (e.g., Databases, Operating Systems, AI/ML, Networking, E-commerce).

## Interview Insights
### Common Interview Patterns
- Typical questions asked
- Tricks interviewers expect candidates to know
- Common mistakes candidates make

### Recognition Guide
- How to identify when this topic should be applied in coding interviews.

Provide the response in clean, beautiful Markdown format.
"""

MCQ_PROMPT = """
You are Learniverse DSA Expert AI. Generate exactly 15 high-quality, medium-to-hard multiple-choice questions about "{topic}".
Do not provide simple definition questions. Focus on deep understanding, complexity analysis, edge cases, output prediction, and common interview traps.

Return the response ONLY as a valid JSON array of objects. Do not include markdown code block formatting (like ```json).
Each object must have the following structure:
{{
  "id": "mcq_1",
  "question": "The question text...",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "answer": "The exact string from the options list representing the correct answer",
  "explanation": "Detailed explanation of why this answer is correct and others are wrong..."
}}
"""

CODING_PROMPT = """
You are Learniverse DSA Expert AI. Generate exactly 2 coding problems for "{topic}".
- Problem 1: Most popular Leetcode Easy question.
- Problem 2: Most popular Leetcode Medium question.

Return the response ONLY as a valid JSON array of 2 objects. Do not include markdown code block formatting (like ```json).
Each object must have this structure:
{{
  "title": "Problem Title",
  "difficulty": "Easy" or "Medium",
  "statement": "Detailed problem statement...",
  "examples": [
    {{
      "input": "Input description...",
      "output": "Output description...",
      "explanation": "Example explanation..."
    }}
  ],
  "constraints": ["Constraint 1", "Constraint 2"],
  "hints": ["Hint 1", "Hint 2"],
  "optimalApproach": "Optimal approach description...",
  "timeComplexity": "O(...)",
  "spaceComplexity": "O(...)"
}}
"""
