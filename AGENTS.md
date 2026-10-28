# Repository Guidelines

## Current product and stack

NUVIA is an Arabic/English customer-feedback product under development. `backend/` is the **only** public product backend; the former `apps/api` has been removed by explicit user direction. Do not restore or maintain two backends.

- Web: React/Vite, JavaScript/JSX in `apps/web`.
- API: Node.js/Express/Mongoose, CommonJS `.js` in `backend` (`@nuvia/api`).
- Implemented backend areas: owner auth/browser sessions/recovery, business/onboarding, branches, survey/questions/templates and survey publishing state. Settings/security APIs and public survey reads are implemented; browser second-factor sign-in/email-change confirmation reuse the auth shell. Complete settings/survey frontend integration, public response collection and live analytics are still under development.
- AI: optional internal FastAPI in `apps/ai-service`, called only by protected Node `/api/ai` routes. Model-independent contracts and local Qwen/DeBERTa adapters exist. Owner-authorized `AI_BASELINE_MODE=true` enables all five configured operations with explicit baseline/quality-unaccepted metadata; default strict mode retains assessment gates. Never turn baseline permission into a passing assessment or bypass hashes/auth/source/schema validation. No MongoDB writes, RAG or connected AI UI. See `docs/api/ai.md` and `docs/development/local-ai-validation.md`; liveness alone is not acceptance.
- Email verification/resend is unavailable; registration signs in directly. Team administration, Google OAuth and billing remain future work.

Read [README](README.md), [architecture](docs/architecture/architecture.md), [module boundaries](docs/development/module-boundaries.md), [DESIGN.md](DESIGN.md) and [API](docs/api/README.md) before product changes. The feature map is full planned scope, not authorization to implement later features. Archived proposals and older validation/plans are historical evidence.

## Ownership

- `apps/web/src/app`: composition, hash router/access policy and providers. Account markup belongs in `features/auth`.
- Web `features`, shared `components/ui`, `components/layout`, `hooks`, `lib` and `styles`: reuse existing feature adapters, controls, geometry, transport/i18n and tokens; no parallel theme/router/global store.
- `backend/app.js`, `server.js`: API composition, root configuration, database/startup. `backend/src/routes`, `controllers`, `services`, `middlewares`, `validations`: HTTP/business/security behavior. `backend/src/models`: executable MongoDB schemas/indexes.
- `backend/tests`, `apps/web/tests`: package checks; root `tests/e2e` owns cross-app tests; root `scripts` owns setup/database/dev orchestration.
- `packages/shared-types`: public DTO declarations/constants only, never schemas/secrets/Node-only imports.
- `apps/ai-service`: separate Python dependencies, local model adapters, contracts and tests. Optional inference dependencies/weights are not required for account development. AI models are not MongoDB models; artifacts and assessments stay in ignored local storage.
- `infra`/`compose.yaml`: optional local containers/replica set/nginx, not production/CD.
- `.local`: ignored credentials, private mail, logs, binaries and data; never assume it exists in another checkout.

Each package owns dependencies/tests. Root `pnpm-workspace.yaml` and `pnpm-lock.yaml` define the JavaScript graph. Do not add npm lockfiles or convert to TypeScript without a request.

## Development and data safety

Use Node >=22.13 and pnpm 11.25.0:

```sh
pnpm install --frozen-lockfile
pnpm setup:local
# Review private root configuration before database commands.
pnpm db:check
pnpm db:setup
pnpm dev
```

Use Atlas or a replica set for transactions. Process environment overrides root `.env` during development; production uses environment only. Setup preserves existing `.env`, secrets and database selection. Require a strong `JWT_SECRET`, private `MONGODB_URI`, intended `MONGODB_DATABASE` and exact `APP_ORIGIN`; legacy `MONGO_URI`/`MONGODB_DB_NAME` are fallback aliases. Removed-API private credential files are not automatically loaded.

**Old UUID auth/workspace collections/accounts are not automatically compatible with backend ObjectId models.** Do not delete/migrate data, rewrite IDs, select another database or drop/sync indexes implicitly. `db:check` reads connectivity/replica capability; `db:setup` adds declared indexes only. Migration is separate explicitly reviewed work.

`pnpm dev` owns web/backend on default 5173/3001 and stops its own group. Never terminate unrelated processes or silently switch databases. Separate commands are `dev:web` and `dev:api` (`dev:backend` alias); do not run them alongside the same group. `START-LAPTOP.cmd` starts this flow. `dev:network` exposes frontend previews; connected LAN use needs exact origin/backend configuration.

Browser traffic uses `/api` through Vite/nginx. Cookie mutations require exact Origin/CSRF; bearer authentication remains for API clients. There is no mail worker. Development `MAIL_MODE=file` password recovery writes private JSON `{text}` directly to root `.local/mail`; follow the correct local link. This is not inbox delivery. SMTP needs explicit configuration and acceptance testing.

Python >=3.11 / uv 0.12.15 are optional: `uv sync --project apps/ai-service --locked`, `pnpm dev:ai`. Compose uses a separate local database volume, no Atlas import. Never print resolved compose secrets; use `docker compose config --quiet`.

## Coding, UI and security

Preserve EN/AR, RTL, mobile, focus/keyboard and loading/error/empty behavior. Account routes show saved identity and honest unavailable states. Synthetic metrics/feedback/assistant replies belong under `/preview/`. Reuse reviewed Feedback empty layout, sample navigation and unavailable notices. Preserve request cancellation/generation, stale-session and token-consumption guards. Do not overwrite approved PNGs to hide regressions.

Keep password hashing, hashed single-use tokens, protected cookies, Origin/CSRF, strict validation, owner isolation, explicit transaction sessions and branch history/invariants. Keep `.env`, Atlas credentials, mailbox/customer data, binaries and model artifacts out of Git/images. Never disable TLS/certificate checks or change networking implicitly. Mongoose does not validate future Python/native writers; define a shared storage contract first.

## Validation and delivery

Run relevant checks: `pnpm format:check`, `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm test:backend:unit`, `pnpm test:proxy`, `pnpm test:e2e:accounts`. Python changes also need `test:ai` and uv Ruff check/format. Integration/browser checks use isolated replica sets/synthetic identities, never configured customer databases. UI changes require desktop/narrow EN/AR rendered checks and affected interactions. Report actual Atlas/SMTP/Docker limits; health/screenshots do not establish product acceptance.

Inspect branch/worktrees/status/remotes first and preserve unrelated work. Never use `codex/` branch names; use descriptive task names. Run `git diff --cached --check` before focused imperative commits. Push task branches and create/update PRs against `main`; merge/direct main pushes only on explicit request. No force pushes/history rewrites without authorization. PRs describe resulting behavior, actual validation, limits and UI evidence. Verify current remote head/CI before claiming success. Keep architecture/API/setup docs and shared consumers aligned.
