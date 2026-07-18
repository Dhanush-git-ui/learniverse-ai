import json
from pathlib import Path
import re

BACKEND_ROOT = Path(__file__).resolve().parent.parent

# Load parsed data
with open(BACKEND_ROOT / "data" / "ods_parsed.json", "r", encoding="utf-8") as f:
    data = json.load(f)

chunks = []

def extract_keywords(content, title, topic):
    keywords = set()
    
    # Extract words from title and topic
    for term in re.findall(r'[a-zA-Z\-]+', f"{title} {topic}"):
        if len(term) > 2:
            keywords.add(term.lower())
            
    # List of key DSA terms to search for in content
    dsa_terms = [
        "avl", "rotation", "balance", "balance factor", "rotations",
        "red-black", "black-height", "scapegoat", "treap", "skiplist",
        "binary search tree", "bst", "binary tree", "heapsort", "heap",
        "quicksort", "mergesort", "sorting", "hash table", "hash", "chaining",
        "linear probing", "graph", "adjacency list", "adjacency matrix",
        "bfs", "dfs", "traversal", "trie", "patricia", "b-tree", "external memory",
        "amortized", "worst-case", "average-case", "time complexity", "space complexity",
        "o(log n)", "o(n)", "o(1)", "o(n log n)", "linked list", "arraylist",
        "array", "stack", "queue", "deque", "priority queue", "root", "leaf",
        "parent", "child", "height", "depth", "bubble up", "bubbleup", "trickle down",
        "trickledown", "split", "merge", "rotation", "single rotation", "double rotation",
        "pre-order", "in-order", "post-order"
    ]
    
    content_lower = content.lower()
    for term in dsa_terms:
        if term in content_lower:
            keywords.add(term)
            
    return sorted(list(keywords))

def split_content(content, max_chars=800, overlap_chars=100):
    # Split content by paragraphs or double newlines
    paragraphs = [p.strip() for p in re.split(r'\n\n|\n', content) if p.strip()]
    if not paragraphs:
        # Fallback to splitting by sentence-like structures if no paragraphs
        paragraphs = [p.strip() for p in content.split('. ') if p.strip()]

    result_chunks = []
    current_chunk = []
    current_len = 0

    for p in paragraphs:
        if current_len + len(p) <= max_chars:
            current_chunk.append(p)
            current_len += len(p) + 2
        else:
            if current_chunk:
                result_chunks.append("\n\n".join(current_chunk))
            
            # If paragraph itself is too large, split it by sentence
            if len(p) > max_chars:
                sentences = [s.strip() for s in p.split('. ') if s.strip()]
                sub_chunk = []
                sub_len = 0
                for s in sentences:
                    if sub_len + len(s) <= max_chars:
                        sub_chunk.append(s)
                        sub_len += len(s) + 2
                    else:
                        if sub_chunk:
                            result_chunks.append(". ".join(sub_chunk) + ".")
                        sub_chunk = [s]
                        sub_len = len(s)
                if sub_chunk:
                    current_chunk = [". ".join(sub_chunk) + "."]
                    current_len = sub_len
            else:
                current_chunk = [p]
                current_len = len(p)

    if current_chunk:
        result_chunks.append("\n\n".join(current_chunk))
    return result_chunks

for item in data:
    content = item["content"]
    chapter = item["chapter"]
    section = item["section"]
    topic = item["topic"]
    source = item["source"]
    book_name = item.get("book_name", "Open Data Structures")
    subject = item.get("subject", "Data Structures and Algorithms")
    
    # Split long sections into concept chunks
    text_chunks = split_content(content)
    
    for text_chunk in text_chunks:
        # Extract keywords
        keywords = extract_keywords(text_chunk, section, topic)
        
        # Prepend structured context for retrieval precision
        enriched_content = f"""
          Book: Open Data Structures
          Subject: Data Structures and Algorithms
          Chapter: {chapter}
          Section: {section}
          Topic: {topic}

          Content:
              {text_chunk}
        """
        
        chunks.append({
            "title": topic,
            "chapter": chapter,
            "topic": topic,
            "source": source,
            "content": enriched_content,
            "keywords": keywords,
            "book_name": "Open Data Structures",
            "subject": "Data Structures and Algorithms"
        })
        

# Create output folder
(BACKEND_ROOT / "data" / "chunks").mkdir(parents=True, exist_ok=True)

# Save chunks
with open(BACKEND_ROOT / "data" / "chunks" / "dsa_chunks.json", "w", encoding="utf-8") as f:
    json.dump(chunks, f, indent=2)

print(f"Created {len(chunks)} chunks.")
