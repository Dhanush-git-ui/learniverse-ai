import os
import requests
import re
from rag.prompts import TEACHER_PROMPT, PEER_PROMPT
from config import GEMINI_MODEL_NAME

RAG_PROMPT_TEMPLATE = """
You are a helpful learning assistant. Answer the question using the context provided.
If the answer cannot be found in the context, say "I could not find this information in the textbook."

Context:
{context}

Question:
{question}

Answer:
"""

def _strip_code_fences(text: str) -> str:
    if not text:
        return text
    # Remove triple backtick fences
    text = re.sub(r"```[\s\S]*?```", lambda m: re.sub(r"^```[a-zA-Z0-9_-]*\n?|```$", "", m.group(0), flags=re.MULTILINE), text)
    # Remove inline backticks
    text = re.sub(r"`([^`]*)`", r"\1", text)
    return text.strip()

class OpenRouterModel:
    def __init__(self, model_name: str = GEMINI_MODEL_NAME, api_key: str | None = None):
        self.model_name = model_name
        self.api_key = api_key or os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY or GOOGLE_API_KEY must be set in environment")

    def generate_content(self, prompt: str, generation_config: dict | None = None) -> str:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        temperature = 1.0
        if generation_config and "temperature" in generation_config:
            temperature = generation_config["temperature"]

        payload = {
            "model": self.model_name,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": temperature,
        }

        try:
            resp = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=payload,
                timeout=45,
            )
            resp.raise_for_status()
            data = resp.json()
            if "error" in data:
                raise RuntimeError(f"OpenRouter API Error: {data['error']}")
            text = data["choices"][0]["message"]["content"]
            return _strip_code_fences(text)
        except Exception as e:
            raise RuntimeError(f"OpenRouter generation failed: {e}")

def format_history(history_list) -> str:
    if not history_list:
        return "No previous messages."
    formatted = []
    for msg in history_list:
        if isinstance(msg, dict):
            role = msg.get("role", "user")
            content = msg.get("content", "")
        else:
            role = getattr(msg, "role", "user")
            content = getattr(msg, "content", "")
        role_label = "Student" if role == "user" else ("Teacher" if role == "teacher" else "Peer")
        formatted.append(f"{role_label}: {content}")
    return "\n".join(formatted)

def get_model() -> OpenRouterModel:
    key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not key:
        raise ValueError("Error: GEMINI_API_KEY is not configured on the backend.")
    return OpenRouterModel(GEMINI_MODEL_NAME, api_key=key)

def generate_answer(question: str, context: str) -> str:
    try:
        model = get_model()
        prompt = RAG_PROMPT_TEMPLATE.format(context=context, question=question)
        return model.generate_content(prompt)
    except Exception as e:
        return f"Error during generation: {str(e)}"

def generate_teacher_answer(query, topic_questions, history=None, topic="General"):
    try:
        model = get_model()
        history_str = format_history(history)
        prompt = TEACHER_PROMPT.format(topic_questions=topic_questions, query=query, history=history_str, topic=topic)
        return model.generate_content(prompt)
    except Exception as e:
        return f"Error during teacher generation: {str(e)}"

def generate_peer_answer(query, topic_questions, history=None, topic="General"):
    try:
        model = get_model()
        history_str = format_history(history)
        prompt = PEER_PROMPT.format(topic_questions=topic_questions, query=query, history=history_str, topic=topic)
        return model.generate_content(prompt, generation_config={"temperature": 0.7})
    except Exception as e:
        return f"Error during peer generation: {str(e)}"
