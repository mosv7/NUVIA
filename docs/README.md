# Documentation

## Current implementation and development

- [Start here (Arabic)](getting-started-ar.md) and [root README](../README.md): install and configure the sole `backend/` product API and connected account/setup flow. The former `apps/api` runtime was removed; remaining frontend features are under development.
- [Current architecture](architecture/architecture.md), [database overview](architecture/database.md), [Mongoose model catalog](architecture/mongodb-models.md) and [public API](api/README.md).
- [Monorepo developer guide](development/monorepo.md), [module boundaries](development/module-boundaries.md), [backend operations](development/backend.md), [frontend guide](development/frontend.md) and [historical validation evidence](development/backend-validation.md).
- [Local infrastructure](../infra/README.md), [public contracts](../packages/shared-types/README.md), [web app](../apps/web/README.md) and [health-only AI scaffold](../apps/ai-service/README.md).
- [Screen galleries](ui/frontend/README.md) and historical synthetic screenshots in `ui/backend-accounts/` from the removed backend (not acceptance evidence for its replacement).
- [Technical decisions](decisions/) and [repository guidelines](../AGENTS.md).

## Product scope and future work

- [Full feature map (Arabic)](product/feature-list.md): all 51 source features, priorities, dependencies and implementation status.
- [Product requirements](product/requirements.md) and [future AI pipeline](architecture/ai-pipeline.md): planned capabilities and acceptance targets, not completed services.
- [Team workflow](development/team-workflow.md): proposed responsibilities and delivery stages.
- [Earlier proposals](archive/README.md): preserved history, separate from the current implementation. Older implementation specs/plans remain in `superpowers/` as historical records.
- [Source documents](references/README.md) remain local and untracked.

Private configuration, development mail, runtime logs, data and temporary tools live in the ignored root `.local/` folder. The root `.env` remains the development override; changing package cwd does not select a different configuration.
