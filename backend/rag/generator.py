import os
import re
import json
import logging
from rag.prompts import TEACHER_PROMPT, PEER_PROMPT, DISAGREEMENT_PROMPT, GENEALOGY_PROMPT

logger = logging.getLogger("rag.generator")
from config import settings
from utils.http_client import http_client

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
    def __init__(self, model_name: str = settings.GEMINI_MODEL_NAME, api_key: str | None = None):
        self.model_name = model_name
        self.api_key = api_key or settings.GEMINI_API_KEY
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY or GOOGLE_API_KEY must be set in environment")

    async def generate_content(self, prompt: str, generation_config: dict | None = None) -> str:
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
            resp = await http_client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=payload
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

_model_instance = None

def get_model() -> OpenRouterModel:
    global _model_instance
    if _model_instance is None:
        key = settings.GEMINI_API_KEY
        if not key:
            raise ValueError("Error: GEMINI_API_KEY is not configured on the backend.")
        _model_instance = OpenRouterModel(settings.GEMINI_MODEL_NAME, api_key=key)
    return _model_instance

async def generate_answer(question: str, context: str) -> str:
    try:
        model = get_model()
        prompt = RAG_PROMPT_TEMPLATE.format(context=context, question=question)
        return await model.generate_content(prompt)
    except Exception as e:
        logger.error(f"Error during RAG generation: {e}")
        return "I apologize, but I am currently unable to generate an answer. Please try again later."

async def generate_teacher_answer(query, topic_questions, history=None, topic="General"):
    try:
        model = get_model()
        history_str = format_history(history)
        prompt = TEACHER_PROMPT.format(topic_questions=topic_questions, query=query, history=history_str, topic=topic)
        return await model.generate_content(prompt)
    except Exception as e:
        logger.error(f"Error during teacher generation: {e}")
        return "Unable to connect to the teacher assistant at this time."

async def generate_disagreement(teacher_ans: str, peer_ans: str, query: str, topic: str = "General") -> dict:
    try:
        model = get_model()
        prompt = DISAGREEMENT_PROMPT.format(
            teacher_answer=teacher_ans[:1500],
            peer_answer=peer_ans[:1500],
            query=query,
            topic=topic
        )
        resp = await model.generate_content(prompt, generation_config={"temperature": 0.3})
        # Extract JSON
        m = re.search(r"\{[\s\S]*?\}", resp)
        if m:
            return json.loads(m.group(0))
        return {"disagree_points":"","canonical":"","better_for_beginner":"teacher","reason":""}
    except Exception as e:
        logger.error(f"Disagreement analysis failed: {e}")
        return {"disagree_points":"Could not analyze disagreement.","canonical":"","better_for_beginner":"teacher","reason":""}

async def generate_genealogy(topic: str, expected: str, actual: str) -> dict:
    """Analyze a wrong answer to trace back to missing prerequisites."""
    try:
        model = get_model()
        prompt = GENEALOGY_PROMPT.format(topic=topic, expected=expected, actual=actual)
        resp = await model.generate_content(prompt, generation_config={"temperature": 0.3})
        m = re.search(r"\{[\s\S]*?\}", resp)
        if m:
            return json.loads(m.group(0))
        return {"core_concept": topic, "missing_prereq": "", "link": "", "micro_lesson": ""}
    except Exception as e:
        logger.error(f"Genealogy analysis failed: {e}")
        return {"core_concept": topic, "missing_prereq": "", "link": "", "micro_lesson": ""}

async def generate_peer_answer(query, topic_questions, history=None, topic="General"):
    try:
        model = get_model()
        history_str = format_history(history)
        prompt = PEER_PROMPT.format(topic_questions=topic_questions, query=query, history=history_str, topic=topic)
        return await model.generate_content(prompt, generation_config={"temperature": 0.7})
    except Exception as e:
        logger.error(f"Error during peer generation: {e}")
        return "Unable to connect to the peer study assistant at this time."

