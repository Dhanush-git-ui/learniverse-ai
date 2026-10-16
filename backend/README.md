# Backend

The backend is the Python/FastAPI service. Application composition starts in `app.py`; route modules are mounted there.

## Main areas

- `auth.py`, `auth_service.py`, and `auth_api.py` — identity validation, token handling, and authentication routes.
- `institutional_api.py` and `cdc_integration.py` — institutional identity and CDC/placement endpoints.
- `placement_assessment_system/` — assessment routes, persistence, scoring, and session handling.
- `analytics_api.py` and `analytics_service.py` — protected analytics endpoints and aggregation.
- `rag/` and `scraper/` — textbook ingestion and retrieval-augmented answer generation.
- `tests/` — backend API, authorization, and regression tests.
- `migrations/` — database migration documentation and scripts.

## Local setup

From this directory, create and activate a virtual environment, install `requirements.txt`, and configure values from `.env.example` in a local `.env` file. Start the service with:

```sh
python -m uvicorn app:app --reload --port 8000
```

Run backend tests from this directory with:

```sh
python -m pytest tests
```

See the root [README](../README.md) for frontend setup and [deployment documentation](../docs/README.md) for operational guidance. Never commit `.env` files, credentials, or real student records.
