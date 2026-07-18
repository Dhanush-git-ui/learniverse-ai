import json
from pathlib import Path
from sentence_transformers import SentenceTransformer

# Load embedding model
model = SentenceTransformer("all-mpnet-base-v2")

BACKEND_ROOT = Path(__file__).resolve().parent.parent

# Load parsed JSON
with open(BACKEND_ROOT / "data" / "chunks" / "dsa_chunks.json", "r", encoding="utf-8") as f:
    data = json.load(f)

embedded_data = []

# Create embeddings
for item in data:
    content = item["content"]
    embedding = model.encode(content).tolist()

    embedded_item = {
        "title": item["title"],
        "chapter": item["chapter"],
        "topic": item["topic"],
        "source": item["source"],
        "content": content,
        "keywords": item["keywords"],
        "embedding": embedding
    }

    embedded_data.append(embedded_item)
    print(f"Embedded: {item['title']} ({item['chapter']})")

# Create output folder
(BACKEND_ROOT / "data" / "embeddings").mkdir(parents=True, exist_ok=True)

# Save embeddings
with open(BACKEND_ROOT / "data" / "embeddings" / "ods_embeddings.json", "w", encoding="utf-8") as f:
    json.dump(embedded_data, f)

print("Embedding complete")
