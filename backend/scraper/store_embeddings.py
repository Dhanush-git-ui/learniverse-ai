import json
import chromadb
from pathlib import Path

# Calculate paths relative to backend root (grandparent of this script)
BACKEND_ROOT = Path(__file__).resolve().parent.parent

# Load embeddings
with open(BACKEND_ROOT / "data" / "embeddings" / "ods_embeddings.json", "r") as f:
    data = json.load(f)

# Create Chroma client
client = chromadb.PersistentClient(path=str(BACKEND_ROOT / "chroma_db"))

# Reset and create collection to avoid duplicates or metadata mismatches
try:
    client.delete_collection("dsa_books")
    print("Deleted old collection.")
except Exception:
    pass

collection = client.get_or_create_collection(
    name="dsa_books"
)

# Add embeddings with metadata
print("Storing embeddings in ChromaDB...")
for idx, item in enumerate(data):
    metadata = {
        "title": item.get("title", ""),
        "chapter": item.get("chapter", ""),
        "topic": item.get("topic", ""),
        "source": item.get("source", ""),
        "keywords": ", ".join(item.get("keywords", []))
    }
    
    collection.add(
        ids=[str(idx)],
        embeddings=[item["embedding"]],
        documents=[item["content"]],
        metadatas=[metadata]
    )

print("Embeddings stored successfully!")