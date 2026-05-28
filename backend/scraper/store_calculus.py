# backend/scraper/store_calculus.py
import json
import os
import chromadb
from sentence_transformers import SentenceTransformer

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, "..", "data"))
CHUNKS_PATH = os.path.join(DATA_DIR, "chunks", "calculus_chunks.json")
# Points exactly to your project's active Chroma storage folder
DB_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "chroma_db"))

def populate_vector_store():
    if not os.path.exists(CHUNKS_PATH):
        print(f"Error: Chunk data file missing at '{CHUNKS_PATH}'. Run chunk_calculus.py first!")
        return
        
    with open(CHUNKS_PATH, "r", encoding="utf-8") as f:
        chunks = json.load(f)
        
    print(f"Loaded {len(chunks)} calculus chunks from disk.")
    print("Loading SentenceTransformer Model (all-mpnet-base-v2)...")
    model = SentenceTransformer("all-mpnet-base-v2")
    
    # Initialize the persistent storage engine
    print(f"Connecting to ChromaDB client at: {DB_DIR}")
    client = chromadb.PersistentClient(path=DB_DIR)
    
    # Isolate calculus from dsa_books using a dedicated collection
    collection = client.get_or_create_collection(name="math_books")
    
    print(f"Embedding and uploading fragments to 'math_books' collection...")
    
    # Upload in batches of 100 to keep memory stable
    batch_size = 100
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i : i + batch_size]
        texts = [item["text"] for item in batch]
        metadatas = [item["metadata"] for item in batch]
        # Use a distinctive ID prefix to avoid overlaps
        ids = [f"calc_{idx}" for idx in range(i, i + len(batch))]
        
        # Vectorize text blocks
        embeddings = model.encode(texts).tolist()
        
        # Upsert into collection index
        collection.add(
            embeddings=embeddings,
            documents=texts,
            metadatas=metadatas,
            ids=ids
        )
        print(f"  -> Uploaded chunks {i} to {min(i + batch_size, len(chunks))}")
        
    print("\nSuccess! Your vector database is completely seeded with Calculus context data!")

if __name__ == "__main__":
    populate_vector_store()