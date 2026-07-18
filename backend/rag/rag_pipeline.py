# backend/rag/rag_pipeline.py
import os
import json
import logging
from dotenv import load_dotenv
import sys

logger = logging.getLogger("rag_pipeline")

# Force load the .env file from the backend directory
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
dotenv_path = os.path.join(backend_dir, ".env")
load_dotenv(dotenv_path=dotenv_path)

if not os.getenv("GEMINI_API_KEY"):
    print(f"[ERROR] CRITICAL: GEMINI_API_KEY could not be read from {dotenv_path}")
else:
    print("[SUCCESS] GEMINI_API_KEY found and loaded successfully.")

if __name__ == "__main__" or not __package__:
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from rag.generator import generate_teacher_answer, generate_peer_answer
import concurrent.futures

def get_topic_questions(topic_name: str) -> list:
    try:
        rag_dir = os.path.dirname(os.path.abspath(__file__))
        backend_dir = os.path.dirname(rag_dir)
        topics_dir = os.path.join(backend_dir, "data", "topics")
        
        # Merge Stack & Queue special case if topic is "Stack & Queue"
        if topic_name == "Stack & Queue":
            stack_path = os.path.join(topics_dir, "stack.json")
            queue_path = os.path.join(topics_dir, "queue.json")
            questions = []
            if os.path.exists(stack_path):
                with open(stack_path, "r", encoding="utf-8") as f:
                    questions.extend(json.load(f).get("questions", []))
            if os.path.exists(queue_path):
                with open(queue_path, "r", encoding="utf-8") as f:
                    questions.extend(json.load(f).get("questions", []))
            return questions
            
        topic_file_map = {
            "Linked Lists": "linked_lists.json",
            "Sorting Algorithms": "sorting_algorithms.json",
            "Searching Algorithms": "searching_algorithms.json",
            "Binary Trees": "binary_trees.json",
            "Graph Algorithms": "graph_algorithms.json",
        }
        
        file_name = topic_file_map.get(topic_name, f"{topic_name.lower().replace(' ', '_')}.json")
        file_path = os.path.join(topics_dir, file_name)
        if os.path.exists(file_path):
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                return data.get("questions", [])
    except Exception as e:
        print(f"Error loading topic questions for {topic_name}: {e}")
    return []

def run_rag_pipeline(query: str, topic: str, category: str, history: list = None):
    """
    Coordinates topic questions memory assembly and dual-persona text generation.
    Retrieval context is disabled as requested by the user.
    """
    logger.debug(f"--- Running Socratic Pipeline ---")
    logger.debug(f"Query: {query} | Topic: {topic} | Category: {category}")
    
    # 1. Load preloaded Socratic questions for memory
    questions = get_topic_questions(topic)
    if questions:
        q_strs = []
        for idx, q in enumerate(questions):
            q_strs.append(f"Question {idx + 1}: {q.get('prompt', '')}")
        questions_block = "\n".join(q_strs)
    else:
        questions_block = "No preloaded questions in memory for this topic."
    
    # 2. Fire the topic questions and query into prompt generator concurrently using ThreadPoolExecutor
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
        future_teacher = executor.submit(generate_teacher_answer, query=query, topic_questions=questions_block, history=history, topic=topic)
        future_peer = executor.submit(generate_peer_answer, query=query, topic_questions=questions_block, history=history, topic=topic)
        
        try:
            teacher_ans = future_teacher.result()
        except Exception as e:
            print(f"[RAG] Error generating teacher answer: {e}")
            teacher_ans = "I apologize, but I encountered an error generating my response. Please check your topic or try again shortly."
            
        try:
            peer_ans = future_peer.result()
        except Exception as e:
            print(f"[RAG] Error generating peer answer: {e}")
            peer_ans = "Hey! Sorry, my brain is a bit scrambled right now trying to process this. Can you try asking that again?"
    
    return {
        "teacher_answer": teacher_ans,
        "peer_answer": peer_ans,
        "sources": []
    }

if __name__ == "__main__":
    test_query = "Explain bubble sort to me."
    result = run_rag_pipeline(test_query, topic="Sorting Algorithms", category="DSA")
    
    print("\n" + "=" * 50)
    print("TEACHER ANSWER")
    print("=" * 50)
    print(result["teacher_answer"])
