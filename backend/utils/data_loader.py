import os
import json
from utils.cache_manager import topic_cache

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "topics")

def load_preloaded_topic(topic_name: str) -> dict:
    cache_key = f"topic_data_{topic_name}"
    cached_data = topic_cache.get(cache_key)
    if cached_data:
        return cached_data

    if topic_name == "Stack & Queue":
        # Load stack.json and queue.json and merge them
        stack_data = {}
        queue_data = {}
        stack_path = os.path.join(DATA_DIR, "stack.json")
        queue_path = os.path.join(DATA_DIR, "queue.json")
        
        if os.path.exists(stack_path):
            try:
                with open(stack_path, "r", encoding="utf-8") as f:
                    stack_data = json.load(f)
            except Exception as e:
                print(f"Error loading stack.json: {e}")
        if os.path.exists(queue_path):
            try:
                with open(queue_path, "r", encoding="utf-8") as f:
                    queue_data = json.load(f)
            except Exception as e:
                print(f"Error loading queue.json: {e}")
                
        # Merge them
        merged = {
            "topic": "Stack & Queue",
            "overview": stack_data.get("overview", queue_data.get("overview", {
                "what_is_it": "Stacks and Queues are basic linear data structures.",
                "why_it_matters": "They manage data in LIFO and FIFO orders respectively.",
                "core_idea": "LIFO vs FIFO storage.",
                "time_complexity": "O(1) average for push/pop/enqueue/dequeue",
                "space_complexity": "O(N) total",
                "when_to_use": ["LIFO order operations", "FIFO order operations"],
                "common_mistakes": ["Stack overflow", "Queue underflow"]
            })),
            "pseudocode": stack_data.get("pseudocode", "") + "\n\n" + queue_data.get("pseudocode", ""),
            "real_world_usage": stack_data.get("real_world_usage", []) + queue_data.get("real_world_usage", []),
            "recognition_guide": {
                "keywords": list(set(stack_data.get("recognition_guide", {}).get("keywords", []) + queue_data.get("recognition_guide", {}).get("keywords", []))),
                "patterns": list(set(stack_data.get("recognition_guide", {}).get("patterns", []) + queue_data.get("recognition_guide", {}).get("patterns", []))),
                "constraints": list(set(stack_data.get("recognition_guide", {}).get("constraints", []) + queue_data.get("recognition_guide", {}).get("constraints", [])))
            },
            "mcqs": stack_data.get("mcqs", []) + queue_data.get("mcqs", []),
            "coding_problems": stack_data.get("coding_problems", []) + queue_data.get("coding_problems", []),
            "questions": stack_data.get("questions", []) + queue_data.get("questions", [])
        }
        topic_cache.set(cache_key, merged, 3600 * 24) # Cache for 24 hours
        return merged

    # Map other topic names if they differ from filenames
    topic_file_map = {
        "Linked Lists": "linked_lists.json",
        "Sorting Algorithms": "sorting_algorithms.json",
        "Searching Algorithms": "searching_algorithms.json",
        "Binary Trees": "binary_trees.json",
        "Graph Algorithms": "graph_algorithms.json",
    }
    
    file_name = topic_file_map.get(topic_name, f"{topic_name.lower().replace(' ', '_')}.json")
    file_path = os.path.join(DATA_DIR, file_name)
    
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            topic_cache.set(cache_key, data, 3600 * 24)
            return data
    else:
        empty_data = {
            "topic": topic_name,
            "overview": {
                "what_is_it": "Topic data is currently being preloaded.",
                "why_it_matters": "Check back soon.",
                "core_idea": "No description available.",
                "time_complexity": "N/A",
                "space_complexity": "N/A",
                "when_to_use": [],
                "common_mistakes": []
            },
            "pseudocode": "// Code coming soon",
            "real_world_usage": [],
            "recognition_guide": {"keywords": [], "patterns": [], "constraints": []},
            "mcqs": [],
            "coding_problems": [],
            "questions": []
        }
        return empty_data

def get_test_cases_for_problem(problem_id: str) -> tuple[list, dict, dict]:
    from app import parse_examples_into_test_cases # Import here to avoid circular dep if needed, or move parse_examples_into_test_cases
    # Wait, let's keep get_test_cases_for_problem inside app.py or move it completely?
    # I'll just keep it here and copy parse_examples_into_test_cases or import it
    pass
