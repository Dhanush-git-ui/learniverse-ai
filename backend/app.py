import os
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List

# Ensure backend directory is in sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Import RAG helpers and config
from config import ALLOWED_ORIGINS
from rag.retriever import retrieve_context
from rag.generator import generate_answer
from rag.calculus_pipeline import run_rag_pipeline


app = FastAPI(title="Learniverse AI RAG Backend")

# Add CORS Middleware to allow requests from specific frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):  
    message: str
    topic: str = "General"
    category: str = "DSA"
    history: List[ChatMessage] = Field(default_factory=list)

class SourceInfo(BaseModel):
    book: str
    chapter: str
    topic: str
    score: float = 0.0
    content_type: str = "general"

class ChatResponse(BaseModel):
    teacher_answer: str
    peer_answer: str
    sources: List[SourceInfo]


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # Hand the payload over to our operational RAG orchestrator
        response_bundle = run_rag_pipeline(
            query=request.message, 
            topic=request.topic, 
            category=request.category,
            history=request.history
        )
        
        # Ensure all required keys exist and return ChatResponse compatible format
        return ChatResponse(
            teacher_answer=response_bundle.get("teacher_answer", ""),
            peer_answer=response_bundle.get("peer_answer", ""),
            sources=[
                SourceInfo(
                    book=src.get("book", "Unknown"),
                    chapter=src.get("chapter", "Unknown"),
                    topic=src.get("topic", "Unknown"),
                    score=src.get("score", 0.0),
                    content_type=src.get("content_type", "general")
                )
                for src in response_bundle.get("sources", [])
            ]
        )
        
    except Exception as e:
        print(f"Error handling chat endpoint request execution: {str(e)}")
        # Shield internal traceback from being exposed
        raise HTTPException(
            status_code=500,
            detail="An internal server error occurred while processing your request. Please try again later."
        )

    
@app.get("/")
def home():
    return {"message": "Learniverse Backend Running"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/api/topics")
def get_topics():
    return {
        "categories": ["DSA", "Calculus"],
        "topics": {
            "DSA": ["Array", "Linked List", "Stack", "Queue", "Tree", "BST", "AVL Tree", "Red-Black Tree", "Sorting", "Searching", "Graph"],
            "Calculus": ["Limits", "Continuity", "Derivatives", "Integrals", "Sequences", "Series"]
        }
    }





