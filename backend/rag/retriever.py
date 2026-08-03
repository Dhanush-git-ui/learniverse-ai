import os
import chromadb
from pathlib import Path
import google.generativeai as genai

# Important: This assumes config is imported/available, but retriever might be 
# imported from inside app.py which already set up path, or from terminal directly.
# Let's ensure backend_dir is in path.
import sys
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from config import settings

gemini_key = settings.GEMINI_API_KEY
if gemini_key:
    genai.configure(api_key=gemini_key)

# Connect to ChromaDB
RAG_DIR = Path(__file__).resolve().parent

# [FIX H-6] Lazy load ChromaDB connection
_chroma_client = None
_dsa_collection = None

def get_chroma_collection():
    # ponytail: ceiling=local Chroma SQLite vector DB scan, upgrade=Qdrant / Pinecone distributed cluster
    global _chroma_client, _dsa_collection
    if _chroma_client is None:
        _chroma_client = chromadb.PersistentClient(path=str(RAG_DIR.parent / "chroma_db"))
        _dsa_collection = _chroma_client.get_collection(name="dsa_books")
    return _chroma_client, _dsa_collection

def get_gemini_embedding(text: str):
    """Fetches embedding via Google Gemini API without using local PyTorch RAM."""
    current_key = settings.GEMINI_API_KEY
    if current_key:
        genai.configure(api_key=current_key)
    
    response = genai.embed_content(
        model="models/text-embedding-004",
        content=text,
        task_type="retrieval_query"
    )
    return response["embedding"]

def retrieve_context(query, category="DSA", top_k=5, num_results=None):
    if num_results is not None:
        top_k = num_results
    try:
        _, current_collection = get_chroma_collection()
    except Exception as e:
        print(f"Error getting collection dsa_books: {e}")
        return []
    # STEP 1: Convert query into embedding via Gemini API
    query_embedding = get_gemini_embedding(query)
    # STEP 2: Query ChromaDB
    results = current_collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )

    # STEP 3: Extract results
    documents = results["documents"][0] if results and "documents" in results and results["documents"] else []
    metadatas = results["metadatas"][0] if results and "metadatas" in results and results["metadatas"] else []
    distances = results["distances"][0] if results and "distances" in results and results["distances"] else []

    # Import SIMILARITY_THRESHOLD from centralized settings
    SIMILARITY_THRESHOLD = settings.SIMILARITY_THRESHOLD

    retrieved_chunks = []

    # STEP 4: Combine everything cleanly
    for doc, metadata, distance in zip(
        documents,
        metadatas,
        distances
    ):
        # Ignore chunks that are not similar enough (distance above threshold)
        if distance > SIMILARITY_THRESHOLD:
            continue

        retrieved_chunks.append({
            "text": doc,
            "metadata": metadata,
            "score": round(distance, 4),
            # Flattened keys to support direct dict access doc['book']
            "book": metadata.get("book", "Open Data Structures") if metadata else "Open Data Structures",
            "chapter": metadata.get("chapter", "Unknown") if metadata else "Unknown",
            "topic": metadata.get("topic", "Unknown") if metadata else "Unknown",
            "content_type": metadata.get("content_type", "general") if metadata else "general"
        })

    return retrieved_chunks

if __name__ == "__main__":

    query = "What is an AVL Tree?"

    results = retrieve_context(query)

    for item in results:

        print("=" * 50)

        print("SCORE:", item["score"])

        print("METADATA:")
        print(item["metadata"])

        print("\nTEXT:")
        print(item["text"][:500])