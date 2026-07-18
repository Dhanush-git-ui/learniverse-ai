# backend/config.py
import os

# CORS Configuration
frontend_url = os.environ.get("FRONTEND_URL", "https://learniverse-ai.vercel.app")
ALLOWED_ORIGINS = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    frontend_url,
]

# RAG Configuration
# Ignored context chunk threshold (distance greater than this is discarded)
SIMILARITY_THRESHOLD = float(os.environ.get("RAG_SIMILARITY_THRESHOLD", "0.8"))
RAG_NUM_RESULTS = 4

# Gemini Model Settings
GEMINI_MODEL_NAME = os.environ.get("GEMINI_MODEL_NAME", "tencent/hy3:free")

# Assessment settings
ASSESSMENT_MAX_DURATION_SECONDS = int(os.environ.get("ASSESSMENT_MAX_DURATION_SECONDS", "7200"))
ASSESSMENT_GRACE_PERIOD_SECONDS = int(os.environ.get("ASSESSMENT_GRACE_PERIOD_SECONDS", "300"))

# Database connection pool configuration
DB_POOL_MIN_CONNS = int(os.environ.get("DB_POOL_MIN_CONNS", "2"))
DB_POOL_MAX_CONNS = int(os.environ.get("DB_POOL_MAX_CONNS", "10"))

