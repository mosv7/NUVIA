# Monorepo restructuring plan

Date: 2026-10-21. User-requested structure: `apps/web`, `apps/api`, `apps/ai-service`, shared packages, infrastructure and current documentation. The user explicitly chose to retain JavaScript/JSX and `.mjs`; TypeScript conversion is separate.

## Goal and constraints

Preserve the implemented Mongoose account/workspace API, database formats/indexes, private root configuration, EN/AR screens and preview boundaries while making each application own its source, dependencies and tests. Use a pinned pnpm workspace for JavaScript applications. The FastAPI app is a health-only development scaffold; no analysis, ingestion, team management or billing is introduced.

The Mongoose migration is not merged yet; this restructuring continues that delivery and the final PR must describe the combined result. Do not merge main or modify the separate cinematic worktree. Preserve private mail/database files and never expose resolved compose secrets.

## Tasks

- [x] Move the web code into feature folders, shared UI/layout and app routing/providers; move API code into config/modules/middleware/integrations/shared. Rebase imports, tests and scripts together.
- [x] Split package ownership, add the shared public DTO/constants package, pin pnpm and make root/package commands work independently of the caller's directory. Add root-relative API configuration regression coverage.
- [x] Add a minimal FastAPI health service and tests, explicit future extension locations, optional local MongoDB/container infrastructure, and a cross-platform development command with owned-process cleanup.
- [x] Refresh current architecture/API/development docs and repository guidelines. Preserve older proposals as clearly marked archive evidence; do not present scaffolding as completed product features.
- [x] Validate frozen dependency installation, formatting/lint, backend/frontend/browser flows, health-only Python tests and Docker configuration. Review changes independently, commit/push and verify the current PR head in CI.

## Review focus

- Package-local scripts must find root private `.env`, mailbox and local test binaries without changing existing credentials.
- pnpm symlink resolution must not introduce duplicate React or undeclared cross-package runtime dependencies.
- Owner isolation, transaction sessions, legacy IDs, retained indexes and same-origin CSRF remain unchanged.
- Dev and compose startup must not silently target a different database or leave unrelated processes terminated.
- Route/asset/screenshots and Arabic/mobile behavior must survive moves; preserve reference gallery files.

## Delivery evidence

The implementation is in [PR #6](https://github.com/mosv7/NUVIA/pull/6) on `refactor-monorepo`, replacing #5 after the remote branch rename. Independent review findings were fixed and re-reviewed. The [implementation CI run](https://github.com/mosv7/NUVIA/actions/runs/39509384961) passed web/accounts/AI/container jobs. See [validation](../development/backend-validation.md) for local clean-install/browser evidence and remaining Atlas/SMTP limits. No merge or production deployment was performed.
