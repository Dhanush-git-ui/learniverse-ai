# backend/scraper/chunk_calculus.py
import json
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, "..", "data"))
INPUT_JSON = os.path.join(DATA_DIR, "calculus_parsed.json")
OUTPUT_CHUNKS = os.path.join(DATA_DIR, "chunks", "calculus_chunks.json")
os.makedirs(os.path.dirname(OUTPUT_CHUNKS), exist_ok=True)

MAX_CHUNK_SIZE = 800

def split_text_into_chunks(text, max_size):
    words = text.split()
    chunks = []
    current_chunk = []
    current_length = 0
    
    for word in words:
        current_chunk.append(word)
        current_length += len(word) + 1
        if current_length >= max_size:
            chunks.append(" ".join(current_chunk))
            current_chunk = []
            current_length = 0
            
    if current_chunk:
        chunks.append(" ".join(current_chunk))
    return chunks

def build_chunks():
    if not os.path.exists(INPUT_JSON):
        print(f"Error: Missing '{INPUT_JSON}'. Execute parse_calculus.py first.")
        return

    with open(INPUT_JSON, "r", encoding="utf-8") as f:
        sections = json.load(f)
        
    all_chunks = []
    print("Slicing text structures into optimal context blocks...")
    
    for sec in sections:
        topic = sec["topic"]
        filename = sec["source_file"]
        
        # Dynamic Chapter extraction targeting both types of file naming schemes
        parts = filename.split('-')
        if "multi" in filename:
            # e.g., multi_S-10-2-... -> Chapter 10
            chapter_label = f"Chapter {parts[1]}" if len(parts) > 1 else "Multivariable Calculus"
        else:
            # e.g., single_sec-1-2-... -> Chapter 1
            chapter_label = f"Chapter {parts[1]}" if len(parts) > 1 else "Single Variable Calculus"

        for act in sec["activities"]:
            for chunk in split_text_into_chunks(act, MAX_CHUNK_SIZE):
                all_chunks.append({
                    "text": chunk,
                    "metadata": {"book": "Active Calculus", "chapter": chapter_label, "topic": topic, "content_type": "activity"}
                })
                
        for td in sec["theorems_and_definitions"]:
            for chunk in split_text_into_chunks(td, MAX_CHUNK_SIZE):
                all_chunks.append({
                    "text": chunk,
                    "metadata": {"book": "Active Calculus", "chapter": chapter_label, "topic": topic, "content_type": "theorem"}
                })
                
        for p in sec["general_paragraphs"]:
            if len(p) < 60: 
                continue 
            for chunk in split_text_into_chunks(p, MAX_CHUNK_SIZE):
                all_chunks.append({
                    "text": chunk,
                    "metadata": {"book": "Active Calculus", "chapter": chapter_label, "topic": topic, "content_type": "general"}
                })

    with open(OUTPUT_CHUNKS, "w", encoding="utf-8") as out:
        json.dump(all_chunks, out, indent=2)
        
    print(f"📊 Extraction complete! Created {len(all_chunks)} semantic chunks inside {OUTPUT_CHUNKS}")

if __name__ == "__main__":
    build_chunks()