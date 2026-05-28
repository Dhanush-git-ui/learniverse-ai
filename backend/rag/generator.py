import os
import google.generativeai as genai
from rag.prompts import TEACHER_PROMPT, PEER_PROMPT
# Insert after lines 1-3:
RAG_PROMPT_TEMPLATE = """
You are a helpful learning assistant. Answer the question using the context provided.
If the answer cannot be found in the context, say "I could not find this information in the textbook."

Context:
{context}

Question:
{question}

Answer:
"""
def format_history(history_list) -> str:
    if not history_list:
        return "No previous messages."
    formatted = []
    for msg in history_list:
        # Support both dictionary parsing and object attributes
        if isinstance(msg, dict):
            role = msg.get("role", "user")
            content = msg.get("content", "")
        else:
            role = getattr(msg, "role", "user")
            content = getattr(msg, "content", "")
            
        role_label = "Student" if role == "user" else ("Teacher" if role == "teacher" else "Peer")
        formatted.append(f"{role_label}: {content}")
    return "\n".join(formatted)


def get_model():
    current_key = api_key or os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not current_key:
        raise ValueError("Error: GEMINI_API_KEY is not configured on the backend.")
    genai.configure(api_key=current_key)
    return genai.GenerativeModel("gemini-2.5-flash")



# Read API keys from environment
api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")

if api_key:
    genai.configure(api_key=api_key)

def generate_answer(question: str, context: str) -> str:
    try:
        model = get_model()
        prompt = RAG_PROMPT_TEMPLATE.format(context=context, question=question)
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error during generation: {str(e)}"

def generate_teacher_answer(query, context, history=None):
    try:
        model = get_model()
        history_str = format_history(history)
        prompt = TEACHER_PROMPT.format(context=context, query=query, history=history_str)
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error during teacher generation: {str(e)}"

def generate_peer_answer(query, context, history=None):
    try:
        model = get_model()
        history_str = format_history(history)
        prompt = PEER_PROMPT.format(context=context, query=query, history=history_str)  
        response = model.generate_content(prompt, generation_config={"temperature": 0.7})

        return response.text
    except Exception as e:
        return f"Error during peer generation: {str(e)}"
