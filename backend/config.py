# backend/config.py
import os

# CORS Configuration
ALLOWED_ORIGINS = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# RAG Configuration
# Ignored context chunk threshold (distance greater than this is discarded)
SIMILARITY_THRESHOLD = 1.3
RAG_NUM_RESULTS = 4

# Gemini Model Settings
GEMINI_MODEL_NAME = "gemini-2.5-flash"
