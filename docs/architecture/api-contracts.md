# API contracts

The maintained implemented contract is [Account and workspace API](../api/README.md). It covers the current Node `/api/v1` account, session, recovery, workspace/branch and health endpoints. Shared public DTO declarations/constants live in `packages/shared-types`.

The [earlier platform API proposal](../archive/api-proposal.md) describes future surveys, feedback, analysis and reports; those routes are not implemented. FastAPI currently exposes only its internal [health-only scaffold](../../apps/ai-service/README.md), not a product analysis endpoint.
