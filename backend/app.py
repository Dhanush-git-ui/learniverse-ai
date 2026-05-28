import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Import RAG helpers
from rag.retriever import retrieve_context
from rag.generator import generate_answer
from rag.calculus_pipeline import run_rag_pipeline


app = FastAPI(title="Learniverse AI RAG Backend")

# Add CORS Middleware to allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev environments. Can be restricted to localhost:8080
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    role: str
    content:str

class ChatRequest(BaseModel):  
    message: str
    topic: str = "General"
    category: str  = "DSA"
    history: List[ChatMessage] = []


@app.post("/api/chat")
async def chat(request: ChatRequest):

    try:
        # 5. Hand the payload over to your operational RAG orchestrator
        response_bundle = run_rag_pipeline(
            query=request.message, 
            topic=request.topic, 
            category=request.category,
            history=request.history
        )
        
        # This will return the structured JSON payload containing:
        # - teacher_answer
        # - peer_answer
        # - sources (metadata array)
        return response_bundle
        
    except Exception as e:
        print(f"Error handling chat endpoint request execution: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

    
@app.get("/")
def home():
    return {"message": "Learniverse Backend Running"}




