# Application workspace layout

Date: 2026-10-21. This updates source/dependency ownership from decisions [0002](0002-node-mongodb-foundation.md) and [0003](0003-mongoose-models.md), while preserving the Node/Express/Mongoose application contract and MongoDB storage formats.

The user requested an apps/packages/infra monorepo and explicitly chose to keep JavaScript/JSX and `.mjs`. Use `apps/web`, `apps/api` and a health-only `apps/ai-service`; app-owned source/dependencies/tests; shared public DTO/constants under `packages/shared-types`; and pinned pnpm workspaces. Python remains independently locked with uv. The API configuration remains root-relative to preserve existing private environments/mail/data when commands run from a workspace.

Keep React features separate from app routing/providers and shared UI/layout/hooks/lib. Keep Node business modules separate from middleware, integrations and shared database models. Future user/dashboard/AI boundaries are documented, without inventing product endpoints. The FastAPI scaffold only exposes liveness and explicitly reports analysis unavailable.

Add optional local compose/nginx/replica-set infrastructure and an owned-process development launcher. These improve developer setup, not production readiness or CD. Preserve previous proposals as archive evidence and make the maintained architecture/API/developer guides explicit. Do not introduce TypeScript, an extra global store/router, data migrations, new analysis or survey features in the restructuring.

Validation includes frozen dependency installation, package-local configuration, existing app/browser suites, Python scope checks, reference UI comparison and container smoke checks in CI. Local daemon availability and Atlas/SMTP acceptance remain separate limits.
