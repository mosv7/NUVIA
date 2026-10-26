# Monorepo development

Use Node >=22.13 and pnpm 11.25.0. Root `pnpm-workspace.yaml` includes `apps/web`, `backend`, and `packages/*`; root `pnpm-lock.yaml` is the sole JavaScript lockfile. The sole API package is `@nuvia/api` in `backend/`; `apps/api` has been removed. React/Vite stays JavaScript/JSX, backend stays CommonJS `.js`, and root orchestration uses `.mjs`.

| Command                                      | Purpose                                                                    |
| -------------------------------------------- | -------------------------------------------------------------------------- |
| `pnpm setup:local`                           | Create private root .env only when absent; preserve existing configuration |
| `pnpm db:check` / `pnpm db:setup`            | Check selected replica database / add declared indexes                     |
| `pnpm dev`                                   | Run owned web/backend group on default 5173/3001                           |
| `pnpm dev:web` / `pnpm dev:api`              | Run web/backend separately                                                 |
| `pnpm dev:ai`                                | Optional health-only Python scaffold                                       |
| `pnpm test`                                  | Web/backend package tests                                                  |
| `pnpm test:backend:unit`                     | Backend test script                                                        |
| `pnpm test:proxy` / `pnpm test:e2e:accounts` | Isolated connected transport/browser scenarios                             |
| `pnpm lint` / `pnpm format:check`            | Source checks                                                              |
| `pnpm build` / `pnpm preview`                | Build/serve web only                                                       |

Root `.env` is development configuration regardless of package cwd. Process environment overrides it; production uses process environment only. Set a private replica-set/Atlas URI, explicit intended `MONGODB_DATABASE`, strong `JWT_SECRET` and exact `APP_ORIGIN`. Legacy private credential files are not automatically loaded. Old UUID account/workspace collections are not automatically migrated to this backend.

There is no mail worker: password reset writes development mailbox files directly. Read [backend operations](backend.md), [module boundaries](module-boundaries.md) and [the API](../api/README.md). Do not kill unrelated port owners or switch databases to bypass startup failures. Keep each app's dependencies/tests with its package; public contracts cannot import Node/database code.

Backend/browser integration checks use isolated databases and synthetic accounts. Browser checks require Edge, an explicit browser executable or installed Playwright Chromium. Review UI at desktop/narrow EN/AR sizes; temporary evidence stays outside tracked source and approved PNGs must not be overwritten to hide regressions.

Python >=3.11 with uv 0.12.15 is optional (`uv sync --project apps/ai-service --locked`). No inference is implemented. Optional compose runs a separate local database volume. Use `docker compose config --quiet` to avoid printing secrets; runtime needs a Docker daemon. Actual validation belongs in the PR; [older validation records](backend-validation.md) describe the removed implementation and do not verify the new backend.
