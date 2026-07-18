# backend/config.py
import os
from pydantic import BaseModel

class Settings:
    def __init__(self):
        # Base
        self.ENV = os.environ.get("ENV", "production").lower()
        self.IS_DEV = self.ENV == "development"
        
        # Security
        self.API_SECRET_KEY = os.environ.get("API_SECRET_KEY")
        
        # APIs
        self.GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
        self.GEMINI_MODEL_NAME = os.environ.get("GEMINI_MODEL_NAME", "tencent/hy3:free")
        
        # Database
        self.DATABASE_URL = os.environ.get("DATABASE_URL")
        self.DB_POOL_MIN_CONNS = int(os.environ.get("DB_POOL_MIN_CONNS", "2"))
        self.DB_POOL_MAX_CONNS = int(os.environ.get("DB_POOL_MAX_CONNS", "10"))
        
        # RAG Configuration
        self.SIMILARITY_THRESHOLD = float(os.environ.get("RAG_SIMILARITY_THRESHOLD", "0.8"))
        self.RAG_NUM_RESULTS = 4
        
        # Compiler
        self.ALLOW_LOCAL_EXECUTION = os.environ.get("ALLOW_LOCAL_EXECUTION", "false").lower() == "true"
        self.JUDGE0_URL = os.environ.get("JUDGE0_URL", "").strip()
        self.JUDGE0_API_KEY = os.environ.get("JUDGE0_API_KEY", "").strip()
        
        # Assessment settings
        self.ASSESSMENT_MAX_DURATION_SECONDS = int(os.environ.get("ASSESSMENT_MAX_DURATION_SECONDS", "7200"))
        self.ASSESSMENT_GRACE_PERIOD_SECONDS = int(os.environ.get("ASSESSMENT_GRACE_PERIOD_SECONDS", "300"))
        
        # Redis
        self.REDIS_URL = os.environ.get("REDIS_URL", "")
        
        # CORS
        frontend_url = os.environ.get("FRONTEND_URL", "https://learniverse-ai.vercel.app")
        self.ALLOWED_ORIGINS = [
            "http://localhost:8080",
            "http://127.0.0.1:8080",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            frontend_url,
        ]

# Global singleton settings
settings = Settings()

# Backward compatibility for direct imports
ALLOWED_ORIGINS = settings.ALLOWED_ORIGINS
SIMILARITY_THRESHOLD = settings.SIMILARITY_THRESHOLD
RAG_NUM_RESULTS = settings.RAG_NUM_RESULTS
GEMINI_MODEL_NAME = settings.GEMINI_MODEL_NAME
DB_POOL_MIN_CONNS = settings.DB_POOL_MIN_CONNS
DB_POOL_MAX_CONNS = settings.DB_POOL_MAX_CONNS


