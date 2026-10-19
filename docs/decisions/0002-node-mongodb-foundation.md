# Node.js and MongoDB account foundation

Status: selected by the project owner on 2026-10-20; implemented for account/business setup.

- Node.js/Express owns the application API; the official MongoDB driver and MongoDB own persistence.
- Python/FastAPI remains the future AI-service boundary. The browser calls Node, not MongoDB or AI directly.
- Use native `.mjs` modules under `src/backend/`, root npm dependencies and the existing JSX frontend; no TypeScript migration.
- Same-origin cookie sessions plus CSRF protection replace the earlier proposed bearer-token/identity-provider contract for this slice.
- Deliver verified owner accounts and one owned workspace per account. Future team roles follow Owner/Manager/Viewer from the Features List, not the older analyst proposal. Team permissions are not delivered here.
- Account-backed product routes show saved identity/workspace/branches and explicit empty/unavailable states. Synthetic records, subscriptions and assistant replies belong to `/preview/`.

The older PostgreSQL/pgvector/RLS and application-FastAPI documents are historical proposals, not installed dependencies. The actual MongoDB model and HTTP catalog are in [Backend development](../backend.md). Redis, object storage, feedback analysis and reports remain separate future capabilities.

Tests use isolated local replica sets and synthetic data; CI never uses Atlas secrets. Without an SMTP provider, private local mail enables complete token-flow testing without claiming real email delivery.
