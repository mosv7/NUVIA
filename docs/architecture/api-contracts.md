# API contracts

[Product API](../api/README.md) documents the sole `backend/` Node `/api` routes: auth/session/recovery, onboarding, business, branches, survey management/questions/templates and health. The removed `/api/v1` product API is not a compatibility endpoint. Shared public wire types/constants live in `packages/shared-types`.

Backend survey publishing does not establish public response collection, frontend completion or live analytics. FastAPI exposes only its separate `/api/v1/health/live` scaffold endpoint with `analysis_available: false`. Archived platform proposals describe future scope rather than delivered services.
