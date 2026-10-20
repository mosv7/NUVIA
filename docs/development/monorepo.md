# Monorepo development

## Tool ownership

Use Node >=22.13 and pnpm 11.25.0 from the repository root. `pnpm install --frozen-lockfile` installs the four JavaScript workspace projects (root tooling, web, API and shared public contracts). App dependencies live in each app's `package.json`; root devDependencies are shared tooling and cross-app tests. Commit only the root `pnpm-lock.yaml` for JavaScript.

Python >=3.11 and uv 0.12.15 are optional. The health-only FastAPI scaffold owns `apps/ai-service/pyproject.toml` and `uv.lock`; install it with `uv sync --project apps/ai-service --locked`.

## Daily commands

| Command                           | Purpose                                                    |
| --------------------------------- | ---------------------------------------------------------- |
| `pnpm setup:local`                | Preserve/create the private root `.env` and mail key       |
| `pnpm db:check` / `pnpm db:setup` | Check selected MongoDB / add schema indexes                |
| `pnpm dev`                        | Run API, mail worker and web as an owned development group |
| `pnpm dev:web`                    | Web-only previews without backend/Python                   |
| `pnpm dev:api` / `pnpm mail:work` | Run either backend process separately                      |
| `pnpm dev:ai`                     | Optional FastAPI scaffold on port 8000                     |
| `pnpm test`                       | API and web package tests                                  |
| `pnpm test:backend:unit`          | Fast backend checks without MongoDB                        |
| `pnpm test:e2e:accounts`          | Isolated cross-app browser account lifecycle               |
| `pnpm test:ai`                    | Python scaffold scope/health checks                        |
| `pnpm lint` / `pnpm format:check` | JavaScript/source quality checks                           |
| `pnpm build` / `pnpm preview`     | Build/serve the web bundle only                            |

Package-local commands also work, for example `pnpm --filter @nuvia/api test` and `pnpm --filter @nuvia/web test`. The API resolves the repository root from its module location, so changing cwd does not change which private environment or mailbox it uses. Production still reads environment only.

Keep ports 3001/5173 free before `pnpm dev`. A failed service stops the group; the script does not terminate unrelated port owners. Ctrl+C stops owned processes, including the API watch process tree on Windows. MongoDB and the optional AI service are separate lifecycles. Configure a real usable URI first; the launcher never silently falls back to another database.

## Adding code

Read [module boundaries](module-boundaries.md), then add behavior to an existing owner before creating a new layer. Put feature tests beside their app, transport adapters in integrations, HTTP middleware in middleware, and shared public wire contracts in `packages/shared-types`. Keep persistence models private to Node.

Do not create empty user/dashboard/AI CRUD just because a boundary folder exists. There is no extra global store: use providers and feature-local drafts until a concrete state-sharing need appears. JavaScript applications have not been converted to TypeScript; `.d.ts` describes the public contract for editor use.

When adding a dependency, use `pnpm --filter @nuvia/web add PACKAGE`, `pnpm --filter @nuvia/api add PACKAGE`, or `pnpm add -Dw PACKAGE` for shared tooling. Python additions use `uv add --directory apps/ai-service PACKAGE`. Review lockfile changes and keep unrelated upgrades out of feature work.

## Validation and infrastructure

Backend/browser runners create isolated local replica sets and synthetic accounts. They reuse `.local/tools/mongod.exe` on Windows if present, otherwise download the test binary. No test may target shared customer databases. Browser tests use installed Edge, `PLAYWRIGHT_CHROMIUM_EXECUTABLE`, or Playwright Chromium.

Compare UI changes to `docs/ui/frontend` at EN/AR and narrow/desktop sizes. Use `pnpm screenshots` deliberately; it overwrites the approved gallery, so never regenerate references to hide regressions. Temporary QA belongs outside tracked source. `pnpm previews` writes generated standalone HTML into the root ignored `previews/`.

The optional [compose stack](../../infra/README.md) is a separate database environment. Use `docker compose config --quiet` for configuration validation without printing resolved credentials. Docker runtime/build checks require a running daemon; health-only AI checks do not prove inference readiness. See [validation evidence](backend-validation.md) for what actually passed.
