# RAG evaluation

**Reviewed:** 2026-11-08.

## Active request path

`POST /api/chat` → `backend/rag/rag_pipeline.py` → `backend/rag/retriever.py` → Chroma `dsa_books` query using Gemini embeddings → score-filtered/deduplicated context → teacher and peer prompts → OpenRouter generation. Source metadata is returned from the selected chunks. Provider keys are distinct: `GEMINI_API_KEY` for embeddings and `OPENROUTER_API_KEY` for generation.

## Implemented controls

- Retrieval is invoked by the active route and executes off the asyncio event loop.
- Invalid, negative, nonnumeric, and over-threshold scores are rejected; duplicate chunks are removed and context is capped at 12,000 characters.
- Missing context is explicitly represented to the model; prompts instruct it not to invent textbook citations. Only selected retrieved metadata is returned as sources.
- Retrieval exceptions produce no sources and are logged without returning source claims.

## Evidence and limits

The regression suite verifies score filtering, deduplication, source metadata and empty retrieval selection. No actual Chroma corpus/provider call, relevance dataset, prompt-injection evaluation, overflow test, concurrency test, or model-quality evaluation was run. The configured similarity threshold and Chroma distance metric must be calibrated against real indexed material; a threshold alone does not prove relevance. Teacher, Peer and Socratic quality remain unvalidated independently, and the pipeline still makes two model requests per chat.

**Evaluation status:** pipeline connected; grounding has unit-level coverage, not corpus-level validation.
