import os
import sys

# Allow running this file directly as a script
if __name__ == "__main__" or not __package__:
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from rag.retriever import collection, embedding_model as model
from rag.generator import generate_teacher_answer, generate_peer_answer

def run_rag_pipeline(query: str):
    """
    Main Learniverse RAG Pipeline

    Flow:
    User Query
        ↓
    Retrieve Relevant Chunks from ChromaDB
        ↓
    Generate AI Response using Gemini
        ↓
    Return Answer + Sources
    """

    try:
        # STEP 1: Encode query and retrieve documents from ChromaDB
        query_embedding = model.encode(query).tolist()
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=3
        )

        contexts = []
        sources = []

        # STEP 2: Extract text contexts and sources
        if results and "documents" in results and results["documents"]:
            for i, doc in enumerate(results["documents"][0]):
                metadata = results["metadatas"][0][i] if results["metadatas"] else {}
                
                # Append context text chunk
                contexts.append(doc)

                # Store source info using keys in our database
                sources.append({
                    "book": metadata.get("source", "Open Data Structures"),
                    "chapter": metadata.get("chapter", "Unknown"),
                    "topic": metadata.get("topic", "Unknown")
                })

        # Safety check
        if not contexts:
            return {
                "answer": "I could not find relevant information in the textbook.",
                "sources": []
            }

        # STEP 3: Combine chunks into one context block
        final_context = "\n\n".join(contexts)

        # NEW:
        # STEP 4: Generate grounded answers using Gemini
        teacher_answer = generate_teacher_answer(
            query=query,
            context=final_context
        )
        peer_answer = generate_peer_answer(
            query=query,
            context=final_context
        )
        # STEP 5: Remove duplicate sources
        unique_sources = []
        for source in sources:
            if source not in unique_sources:
                unique_sources.append(source)
        # STEP 6: Return final response structure matching frontend expectations
        return {
            "response": teacher_answer,
            "teacher_answer": teacher_answer,
            "peer_answer": peer_answer,
            "sources": unique_sources
        }
    except Exception as e:
        return {
            "response": f"Pipeline Error: {str(e)}",
            "teacher_answer": f"Pipeline Error: {str(e)}",
            "peer_answer": f"Pipeline Error: {str(e)}",
            "sources": []
        }

if __name__ == "__main__":

    query = "What is an AVL Tree?"

    result = run_rag_pipeline(query)

    print("\n" + "=" * 50)
    print("TEACHER ANSWER")
    print("=" * 50)

    print(result["teacher_answer"])

    print("\n" + "=" * 50)
    print("PEER ANSWER")
    print("=" * 50)

    print(result["peer_answer"])
