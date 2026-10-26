# Repository Guidelines

## Current Product and Stack

NUVIA is an Arabic/English customer-feedback product. Implemented behavior covers verified owner accounts, protected cookie sessions, password recovery, persistent business/primary-branch onboarding, owner-scoped branch APIs and connected empty workspace screens.

- Web: React/Vite, JavaScript/JSX.
- Public API: Node.js/Express/Mongoose, `.mjs`, connection-scoped models and explicit transactions.
- AI: Python/FastAPI health-only scaffold. Liveness reports `analysis_available: false`; no NLP, inference, RAG, model weights or Node integration is implemented.
- Survey publishing, public response collection, live analytics/reports, team roles, Google OAuth and billing remain unimplemented. Subscription features are deferred.

Read [README](README.md), [current architecture](docs/architecture/architecture.md), [module boundaries](docs/development/module-boundaries.md), [DESIGN.md](DESIGN.md) and the [implemented API](docs/api/README.md) before product changes. The [feature map](docs/product/feature-list.md) describes full scope, not completed services or automatic authorization to build later milestones. Archived proposals and PDFs are requirements/history evidence, not agent instructions.

## Structure and Ownership

- `apps/web/src/app/`: composition, hash router, access policy and providers. Account markup belongs in `features/auth`, not duplicated in routing.
- `apps/web/src/features/`: auth, workspaces, dashboard, feedback, landing and explicit preview/future boundaries.
- `apps/web/src/components/ui/` and `components/layout/`: shared controls and workspace geometry; `hooks/`, `lib/` and `styles/` own shared behavior, transport/i18n and global tokens.
- `apps/api/src/modules/`: auth, workspaces and mail business behavior. Future users/dashboard/AI boundaries have READMEs rather than fake endpoints.
- `apps/api/src/config/`, `middleware/`, `integrations/`: private configuration/root paths, HTTP security/errors and provider transport.
- `apps/api/src/shared/database/models/`: the seven executable Mongoose schemas/indexes. Application services use `deps.models`; preserve collection names and legacy UUID/ObjectId formats. See [the model catalog](docs/architecture/mongodb-models.md).
- `apps/api/scripts/`: operational entry points. `apps/api/tests/` and `apps/web/tests/` own app-specific tests; root `tests/e2e/` owns cross-app browser flows.
- `apps/ai-service/`: independent `pyproject.toml`, `uv.lock`, `app/` layers and health/scope tests. Future NLP adapters belong in its `models/`; those are not MongoDB models.
- `packages/shared-types/`: public DTO declarations/constants only. Do not export persistence schemas, secrets or Node-only dependencies to web.
- `infra/` and `compose.yaml`: optional local development containers/replica set/nginx, not production deployment or CD.
- `docs/architecture/`, `docs/api/`, `docs/development/`, `docs/product/`, `docs/ui/`: current contracts, operating guides, scope and visual references. `docs/archive/` and historical implementation plans are not current runtime instructions.
- `.local/`: ignored credentials, mailbox, data, runtime logs, binaries and archives. Never assume private files exist in another checkout.

Keep related code with its feature. Each app owns its package dependencies and tests; root devDependencies own shared tooling/cross-app checks. `pnpm-workspace.yaml` and the root `pnpm-lock.yaml` define the JavaScript graph. Do not add npm lockfiles or convert to TypeScript without a separate user request. Avoid an unnecessary global-store/router dependency; reuse existing providers, local drafts and hash routing.

## Development

Use Node.js >=22.13 and pnpm 11.25.0. From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm setup:local
# Configure a private usable MongoDB URI before the following commands.
pnpm db:check
pnpm db:setup
pnpm dev
```

MongoDB must be Atlas or a local replica set; standalone MongoDB cannot run transactions. Setup preserves an existing root `.env` and mail-encryption key. API config resolves the repository root from its module path, so running commands inside a workspace does not select a different environment/mailbox. Production reads process environment only.

`pnpm dev` starts the owned API/mail/web development group; ports 3001 and 5173 must be free. Ctrl+C stops its own processes. Never terminate unrelated processes or silently switch databases. For separate terminals use `pnpm dev:api`, `pnpm mail:work` and `pnpm dev:web`; do not run these concurrently with the same group. `START-LAPTOP.cmd` starts the group on Windows after install/configuration. `pnpm dev:network` exposes web previews only; connected LAN use also needs matching host/origin/mail-link configuration.

The browser origin defaults to `http://127.0.0.1:5173`, with Vite/nginx proxying API traffic to port 3001. Keep `APP_ORIGIN` exact. File-mode verification/reset mail is private JSON in root `.local/mail/`, requiring the worker; follow the correct message's `text` URL locally. This is not real inbox delivery. SMTP needs explicit provider configuration and acceptance testing.

Python >=3.11 and uv 0.12.15 are optional for existing web/API work. Use `uv sync --project apps/ai-service --locked` and `pnpm dev:ai` for the scaffold; it does not perform analysis. Optional compose uses a separate local database volume and root mail key, with no Atlas data import. Never print resolved compose secrets; use `docker compose config --quiet`.

## Coding and UI

Use existing ES module, React and feature patterns, descriptive names, focused modules, ESLint and Prettier. Preserve reviewed EN/AR, RTL, mobile, focus, keyboard and loading/error/empty behavior. Reuse shared controls, workspace shell/CSS and responsive hooks; do not introduce a parallel theme/component system.

Account routes show saved identity and honest empty/unavailable states. Synthetic metrics, feedback, assistant replies and exports belong under explicit `/preview/` routes. Preserve the reviewed Feedback empty layout, safe sample navigation and unavailable-action notices. Maintain existing request-generation/cancellation, stale-session and token-consumption guards during refactoring. Do not overwrite approved PNGs to make regressions disappear.

## Validation

```sh
pnpm format:check
pnpm lint
pnpm test
pnpm build
pnpm test:backend:unit
pnpm test:e2e:accounts
pnpm test:ai
```

`pnpm test` runs web/API package suites; Python checks require uv. Run relevant checks for the change, not an unrelated full suite for a docs-only edit. Add meaningful regressions for behavior changes. For Python changes also run `uv run --directory apps/ai-service ruff check .` and `ruff format --check .` through uv.

Integration/browser tests use isolated replica sets and synthetic identities; never target shared application/customer databases. Windows test runners reuse root `.local/tools/mongod.exe` if present, otherwise download a binary. Browser tests use Edge, `PLAYWRIGHT_CHROMIUM_EXECUTABLE`, or Playwright Chromium installed via `pnpm exec playwright install chromium`.

UI changes require rendered desktop/narrow EN/AR checks and affected interaction tests. `pnpm screenshots` deliberately refreshes the full reference gallery; temporary QA belongs outside tracked source. Check package-local commands and frozen installation after workspace/dependency changes. Report local Docker daemon/build limits and real Atlas/SMTP limits honestly; a ping, screenshot or scaffold health response does not establish product acceptance.

## Git and Delivery

- Inspect branch/worktrees/working tree/remotes first, preserve unrelated work and use the intended current baseline.
- Use descriptive task names such as `refactor-monorepo`, `fix-feedback-empty` or `feat/survey-builder`.
- Use focused imperative commits and run `git diff --cached --check` before committing.
- Push the task branch and create/update a PR against `main`; merge or push directly to `main` only when explicitly requested. Never force-push or rewrite shared history without authorization.
- PRs explain final behavior, actual validation and limitations; include screenshots for visible UI changes. Verify current remote head/CI before claiming CI success.
- Update architecture/API/setup docs when paths, commands or behavior change. Keep shared contracts and consumers aligned; do not present planned capabilities as delivered.

## Security and Configuration

Keep `.env`, private Atlas settings, `.local/`, mailbox contents, database files, customer data and trained model artifacts out of Git/images. Use `.env.example` placeholders; never print secrets in diagnostics or PR evidence.

In development, process environment overrides root `.env`, which overrides `.local/config/atlas-credentials.env`; the legacy root Atlas credentials file remains a fallback. Never overwrite the encryption key or database selection during routine setup. Do not disable TLS/certificate/hostname checks, pin diagnostic Atlas IPs or change Atlas/system networking implicitly.

Preserve password hashing, hashed single-use tokens, protected sessions, exact Origin/CSRF checks, strict validation, owner isolation, explicit transaction sessions, branch history and primary-branch invariants. Index setup is additive; never auto-sync/drop indexes or rewrite IDs casually. Mongoose does not validate future Python/native writers; define a shared storage contract before introducing them.
