# AI service scaffold

This FastAPI application exposes only `GET /api/v1/health/live`. It deliberately reports `analysis_available: false`. There is no preprocessing, inference, RAG, trained model, MongoDB writer or integration with the Node product yet.

From the repository root, use `uv sync --project apps/ai-service --locked`, then `pnpm dev:ai` (port 8000). Run `pnpm test:ai` for health/scope tests, and `uv run --directory apps/ai-service ruff check .` for lint. Python >=3.11 and uv are optional for web/API development. The Python dependency graph is owned by this application's `pyproject.toml` and `uv.lock`, not pnpm.

Future ownership: `api/v1` for internal transport, `core` for settings/lifecycle, `schemas` for contracts, `services` for orchestration, `models` for model adapters, and `pipelines` for analysis stages. Store downloaded/trained weights in ignored local storage. Keep business authorization and public customer endpoints in Node; design the internal service contract before adding analysis.
