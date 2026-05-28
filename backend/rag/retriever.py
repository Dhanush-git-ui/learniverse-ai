import chromadb
from sentence_transformers import SentenceTransformer


# Load embedding model
embedding_model = SentenceTransformer(
    "all-mpnet-base-v2"
)

# Connect to ChromaDB
import os
from pathlib import Path
RAG_DIR = Path(__file__).resolve().parent
client = chromadb.PersistentClient(
    path=str(RAG_DIR.parent / "chroma_db")
)

collection = client.get_collection(
    name="dsa_books"
)


def retrieve_context(query, category="DSA", top_k=5, num_results=None):
    if num_results is not None:
        top_k = num_results

    # Select the collection based on category
    if category and category.lower() in ["mathematics", "math", "calculus"]:
        collection_name = "math_books"
    else:
        collection_name = "dsa_books"

    try:
        current_collection = client.get_collection(name=collection_name)
    except Exception as e:
        print(f"Error getting collection '{collection_name}': {e}. Falling back to 'dsa_books'.")
        current_collection = client.get_collection(name="dsa_books")

    # STEP 1: Convert query into embedding
    query_embedding = embedding_model.encode(
        query
    ).tolist()

    # STEP 2: Query ChromaDB
    results = current_collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )

    # STEP 3: Extract results
    documents = results["documents"][0] if results and "documents" in results and results["documents"] else []
    metadatas = results["metadatas"][0] if results and "metadatas" in results and results["metadatas"] else []
    distances = results["distances"][0] if results and "distances" in results and results["distances"] else []

    retrieved_chunks = []

    # STEP 4: Combine everything cleanly
    for doc, metadata, distance in zip(
        documents,
        metadatas,
        distances
    ):
        retrieved_chunks.append({
            "text": doc,
            "metadata": metadata,
            "score": round(distance, 4),
            # Flattened keys to support direct dict access doc['book']
            "book": metadata.get("book", "Open Data Structures") if metadata else "Open Data Structures",
            "chapter": metadata.get("chapter", "Unknown") if metadata else "Unknown",
            "topic": metadata.get("topic", "Unknown") if metadata else "Unknown"
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