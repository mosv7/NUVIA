# NUVIA

Arabic/English customer-feedback product under development. React/Vite lives in `apps/web`; **`backend/` is the only Node/Express/Mongoose product backend**. The former `apps/api` implementation has been removed. FastAPI in `apps/ai-service` remains an independent health-only scaffold (`analysis_available: false`).

The backend provides owner registration/login, browser cookie sessions, password recovery, business/onboarding, branches, survey management/questions and templates. Settings APIs persist profile/avatar/language/notification preferences, manage devices, change passwords/emails and enroll TOTP with one-use recovery codes. The browser handles second-factor sign-in and explicit email-change confirmation; full settings-screen integration remains under development. Public survey GET exposes published questions/branch availability only, not response submission. Survey publishing here changes backend survey state; it does not establish public response collection, live analytics, AI inference or complete frontend survey integration. Team administration, Google OAuth and billing remain future work. Connected account pages show saved data and honest empty/unavailable states; illustrative data belongs under `/preview/`.

## Local development

Use Node >=22.13 and pnpm 11.25.0. Python and Docker are optional.

```sh
pnpm install --frozen-lockfile
pnpm setup:local
# Configure private root .env before proceeding.
pnpm db:check
pnpm db:setup
pnpm dev
```

`setup:local` creates a root `.env` with a random `JWT_SECRET` only if the file does not exist. Existing values are preserved. Check `JWT_SECRET`, `MONGODB_URI` and **the intended `MONGODB_DATABASE`** explicitly when reusing older configuration. Use Atlas or a local replica set for transactions; the setup does not create or select a replacement database. Process environment overrides root `.env`; production uses process environment. Legacy `MONGO_URI` / `MONGODB_DB_NAME` aliases are fallback inputs. Private credentials files from the removed API are not automatically loaded.

`db:check` checks connectivity and replica-set capability without changing application data. `db:setup` adds the backend's declared indexes; it never drops indexes or rewrites records. **Old auth/workspace accounts, collections and UUID IDs are not automatically compatible with the ObjectId backend models.** No account/data migration is provided. Keep the original database intact and review the selected database before writing.

Open [the local app](http://127.0.0.1:5173/). `pnpm dev` owns web + backend processes on 5173/3001 and stops its own group on Ctrl+C or a service failure. It checks occupied ports and never terminates unrelated processes. For separate terminals use `pnpm dev:web` and `pnpm dev:api` (alias `dev:backend`). There is no mail worker. `START-LAPTOP.cmd` installs/configures and starts the same group. `pnpm dev:network` exposes the frontend only; connected LAN use needs matching backend/origin configuration.

Browser requests use same-origin `/api` through Vite/nginx. Keep `APP_ORIGIN=http://127.0.0.1:5173` exact unless configuring another origin. Registration signs in directly; email verification/resend is unavailable. With development `MAIL_MODE=file`, password-reset requests write private JSON messages directly to root `.local/mail`; follow the corresponding `text` URL locally. These files are not inbox delivery. SMTP requires provider configuration and separate acceptance testing.

## Preview, tests and optional services

Use `pnpm dev:web` and `/preview/#/dashboard`, `/preview/#/feedbacks` or `/preview/#/customer-feedback` for design samples. Preview behavior does not establish working survey collection or AI. `pnpm build` builds `apps/web/dist`; `pnpm preview` serves that build without starting the backend.

```sh
pnpm format:check
pnpm lint
pnpm test
pnpm build
pnpm test:backend:unit
pnpm test:proxy
pnpm test:e2e:accounts
```

Backend tests live in `backend/tests`, web tests in `apps/web/tests`, and cross-app browser tests in `tests/e2e`. Integration checks use isolated replica sets/synthetic accounts, never a configured customer database. Browser checks need Edge, `PLAYWRIGHT_CHROMIUM_EXECUTABLE`, or installed Playwright Chromium. Actual run results and limits belong in the PR; source code or health checks do not prove full product acceptance.

For Python: `uv sync --project apps/ai-service --locked`, `pnpm dev:ai`, `pnpm test:ai`. Only `/api/v1/health/live` exists there; no analysis integration is implemented.

Optional `docker compose up --build -d` runs web/backend with a **separate local MongoDB volume** and file mailbox. Configure `JWT_SECRET` first. Add the scaffold with `--profile ai`. Stop with `docker compose --profile ai down`; adding `--volumes` deletes the compose database. This is local development infrastructure, not production deployment or Atlas migration. Never print resolved compose secrets; use `docker compose config --quiet`.

Read [architecture](docs/architecture/architecture.md), [module boundaries](docs/development/module-boundaries.md), [API](docs/api/README.md), [backend operations](docs/development/backend.md), [design context](DESIGN.md), and [repository guidelines](AGENTS.md). The [feature map](docs/product/feature-list.md) describes the full planned product; older validation reports and archived proposals are historical evidence. No open-source license has been selected.
