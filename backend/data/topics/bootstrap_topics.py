# backend/bootstrap_topics.py
import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

TOPICS = [
    "Sorting Algorithms",
    "Searching Algorithms",
    "Binary Trees",
    "Graph Algorithms",
    "Hash Tables",
    "Stack & Queue",
    "Linked Lists",
    "Dynamic Programming",
    "Greedy Algorithms",
    "Complexity Analysis",
    "Graph Theory",
    "Statistics"
]

DATA_DIR = os.path.dirname(os.path.abspath(__file__))
os.makedirs(DATA_DIR, exist_ok=True)

BOOTSTRAP_PROMPT = """
You are Learniverse DSA Content Creator. Generate a comprehensive learning pack for "{topic}".
You MUST return the response ONLY as a valid JSON object. Do not wrap it in markdown code block ticks.

Structure the JSON exactly as follows:
{{
  "topic": "{topic}",
  "overview": {{
    "what_is_it": "One-line definition.",
    "why_it_matters": "One-line practical value.",
    "core_idea": "One-line intuition.",
    "time_complexity": "Time Complexity snapshot...",
    "space_complexity": "Space Complexity snapshot...",
    "when_to_use": ["Scenario 1", "Scenario 2"],
    "common_mistakes": ["Mistake 1", "Mistake 2"]
  }},
  "pseudocode": "Clean, syntax-independent pseudocode",
  "real_world_usage": [
    {{"use_case": "Use Case 1", "description": "Description 1..."}},
    {{"use_case": "Use Case 2", "description": "Description 2..."}}
  ],
  "recognition_guide": {{
    "keywords": ["key1", "key2"],
    "patterns": ["pattern1", "pattern2"],
    "constraints": ["constraint1"]
  }},
  "mcqs": [
    {{
      "id": "mcq_1",
      "question": "Deep conceptual question...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option A",
      "hint_teacher": "Formal academic hint...",
      "hint_peer": "Casual student-like hint...",
      "explanation_teacher": "Detailed conceptual explanation...",
      "explanation_peer": "Simple analogy or shortcut..."
    }}
  ],
  "coding_problems": [
    {{
      "id": "easy_1",
      "title": "Problem Title",
      "difficulty": "Easy",
      "statement": "Leetcode-style statement...",
      "examples": [
        {{"input": "in", "output": "out", "explanation": "why"}}
      ],
      "constraints": ["constraints..."],
      "hint1_teacher": "Formal hint 1...",
      "hint1_peer": "Peer hint 1...",
      "hint2_teacher": "Formal hint 2...",
      "hint2_peer": "Peer hint 2...",
      "solution_regular": {{
        "approach": "Approach desc...",
        "code": "python code...",
        "time": "O(...)",
        "space": "O(...)"
      }},
      "solution_optimal": {{
        "approach": "Optimal approach...",
        "code": "optimized python...",
        "time": "O(...)",
        "space": "O(...)"
      }}
    }}
  ]
}}
Ensure you generate exactly 15 MCQs and 2 coding problems (1 Easy, 1 Medium) inside the arrays.
"""

def generate_topic_data(topic):
    api_key = os.getenv("GEMINI_API_KEY")
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "nex-agi/nex-n2-pro:free",
        "messages": [{"role": "user", "content": BOOTSTRAP_PROMPT.format(topic=topic)}],
        "temperature": 0.2
    }
    
    print(f"Generating preloaded content for: {topic}...")
    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()
    
    text = response.json()["choices"][0]["message"]["content"].strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
            
    # Save directly to file
    file_name = f"{topic.lower().replace(' ', '_')}.json"
    file_path = os.path.join(DATA_DIR, file_name)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(text)
    print(f"[SUCCESS] Saved to {file_path}")

if __name__ == "__main__":
    for topic in TOPICS:
        file_name = f"{topic.lower().replace(' ', '_')}.json"
        file_path = os.path.join(DATA_DIR, file_name)
        if os.path.exists(file_path):
            print(f"[SKIP] {topic} already exists.")
            continue
        try:
            generate_topic_data(topic)
        except Exception as e:
            print(f"Failed to generate {topic}: {e}")
