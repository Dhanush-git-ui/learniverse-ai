# backend/rag/calculus_pipeline.py
import os
from dotenv import load_dotenv
import sys

# Force load the .env file from the backend directory
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
dotenv_path = os.path.join(backend_dir, ".env")
load_dotenv(dotenv_path=dotenv_path)

# Quick sanity check print to verify it's working before running the RAG pipeline
if not os.getenv("GEMINI_API_KEY"):
    print(f"[ERROR] CRITICAL: GEMINI_API_KEY could not be read from {dotenv_path}")
else:
    print("[SUCCESS] GEMINI_API_KEY found and loaded successfully.")

# Allow running this file directly as a script
if __name__ == "__main__" or not __package__:
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from rag.retriever import retrieve_context
from rag.generator import generate_teacher_answer, generate_peer_answer

import concurrent.futures

def run_rag_pipeline(query: str, topic: str, category: str, history: list = None):
    """
    Coordinates context retrieval and dual-persona text generation.
    """
    print(f"--- Running RAG Pipeline ---")
    print(f"Query: {query} | Topic: {topic} | Category: {category}")
    
    # 1. Fetch relevant chunks dynamically based on the subject category string
    context_chunks = retrieve_context(query=query, category=category, num_results=4)
    
    # 2. Compile text fragments into a single context block for the LLM
    context_str = "\n\n".join([f"Source [{doc['book']} - {doc['chapter']} - {doc['topic']}]: {doc['text']}" for doc in context_chunks])
    
    # 3. Fire the context into your Gemini API prompt generator concurrently using ThreadPoolExecutor
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
        future_teacher = executor.submit(generate_teacher_answer, query=query, context=context_str, history=history)
        future_peer = executor.submit(generate_peer_answer, query=query, context=context_str, history=history)
        
        teacher_ans = future_teacher.result()
        peer_ans = future_peer.result()
    
    # 4. Format sources to return matching metadata (including score and content_type) to the React UI components
    formatted_sources = []
    for doc in context_chunks:
        source_entry = {
            "book": doc["book"],
            "chapter": doc["chapter"],
            "topic": doc["topic"],
            "score": doc["score"],
            "content_type": doc["content_type"]
        }
        if source_entry not in formatted_sources:
            formatted_sources.append(source_entry)
    
    return {
        "teacher_answer": teacher_ans,
        "peer_answer": peer_ans,
        "sources": formatted_sources
    }

if __name__ == "__main__":
    # Test the pipeline with a calculus query
    test_query = "What is the limit definition of the derivative?"
    result = run_rag_pipeline(test_query, topic="Calculus", category="Mathematics")
    
    print("\n" + "=" * 50)
    print("TEACHER ANSWER")
    print("=" * 50)
    print(result["teacher_answer"])
    
    print("\n" + "=" * 50)
    print("PEER ANSWER")
    print("=" * 50)
    print(result["peer_answer"])
    
    print("\n" + "=" * 50)
    print("SOURCES")
    print("=" * 50)
    print(result["sources"])