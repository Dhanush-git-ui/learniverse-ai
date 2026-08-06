# backend/rag/rag_pipeline.py
import os
import json
import logging
from dotenv import load_dotenv
import sys

logger = logging.getLogger("rag_pipeline")

# Force backend_dir to be in sys.path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from config import settings

if not settings.GEMINI_API_KEY:
    print(f"[ERROR] CRITICAL: GEMINI_API_KEY could not be read")
else:
    print("[SUCCESS] GEMINI_API_KEY found and loaded successfully.")

from rag.generator import generate_teacher_answer, generate_peer_answer
import asyncio

def get_topic_questions(topic_name: str) -> list:
    from utils.cache_manager import topic_cache
    cache_key = f"rag_questions_{topic_name}"
    cached = topic_cache.get(cache_key)
    if cached is not None:
        return cached

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
            topic_cache.set(cache_key, questions, 3600*24)
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
                q = data.get("questions", [])
                topic_cache.set(cache_key, q, 3600*24)
                return q
    except Exception as e:
        print(f"Error loading topic questions for {topic_name}: {e}")
    
    topic_cache.set(cache_key, [], 3600*24)
    return []

async def run_rag_pipeline(query: str, topic: str, category: str, history: list = None):
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
    
    # 2. Fire the topic questions and query into prompt generator concurrently using asyncio
    teacher_task = generate_teacher_answer(query=query, topic_questions=questions_block, history=history, topic=topic)
    peer_task = generate_peer_answer(query=query, topic_questions=questions_block, history=history, topic=topic)
    
    results = await asyncio.gather(teacher_task, peer_task, return_exceptions=True)
    teacher_res, peer_res = results
    
    if isinstance(teacher_res, Exception):
        print(f"[RAG] Error generating teacher answer: {teacher_res}")
        teacher_ans = "I apologize, but I encountered an error generating my response. Please check your topic or try again shortly."
    else:
        teacher_ans = teacher_res
        
    if isinstance(peer_res, Exception):
        print(f"[RAG] Error generating peer answer: {peer_res}")
        peer_ans = "Hey! Sorry, my brain is a bit scrambled right now trying to process this. Can you try asking that again?"
    else:
        peer_ans = peer_res
    
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
