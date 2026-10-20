# NUVIA

Bilingual customer feedback analytics and business intelligence for Arabic and English.

NUVIA is being built to collect customer feedback through surveys and turn it into sentiment, aspect scores, trends and recommendations. **The current implementation covers owner accounts and business/branch onboarding. Survey collection and AI analytics are not implemented yet.**

## What works now

| Area              | Current behavior                                                                                                                  |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Accounts          | Register an owner, verify email, log in/out, and recover/reset a password.                                                        |
| Sessions          | Protected cookie sessions; verification is required for private product routes. Password reset revokes existing sessions.         |
| Business setup    | Save business information and a primary branch in MongoDB; resume saved setup after refresh or signing back in.                   |
| Branch APIs       | Owner-scoped create, rename, archive and primary-branch operations. Full branch-management UI is not part of this delivery.       |
| Workspace screens | Show the saved user/business identity and reviewed empty Overview/Feedback states.                                                |
| Design previews   | Explicit `/preview/` routes show sample dashboard, feedback, response details and assistant content separately from account data. |
| Languages         | English and Arabic/RTL, with desktop and mobile layouts.                                                                          |

The application API uses **Node.js + Express + MongoDB**, with **Mongoose** schemas/models in `src/backend/models/`. The frontend uses **React + Vite**. **Python/FastAPI** is the selected stack for the future AI service; that service is not implemented. See the [current model catalog](docs/architecture/mongodb-models.md) for collections, fields, references and compatibility rules.

## Run the current app

### 1. Install dependencies

Use Node.js **22.12 or later** and npm **10 or later**. Run all commands from the repository root:

```sh
git clone https://github.com/mosv7/NUVIA.git
cd NUVIA
npm ci
npm run setup:local
```

For an existing clean checkout, switch to `main` and pull the latest changes before installing. `setup:local` creates a private `.env` with a generated mail-encryption key, and preserves an existing `.env`.

### 2. Configure MongoDB

Use an Atlas cluster, or an existing local MongoDB **replica set**. Transactions are required; a standalone MongoDB instance is insufficient. You do not need to install MongoDB on your computer when using Atlas.

Add your private connection URI to the generated `.env`, preserving the generated `MAIL_ENCRYPTION_KEY`:

```dotenv
MONGODB_URI=mongodb+srv://YOUR_DB_USER:YOUR_URL_ENCODED_PASSWORD@YOUR_CLUSTER_HOST/
MONGODB_DATABASE=nuvia
APP_ORIGIN=http://127.0.0.1:5173
MAIL_MODE=file
```

Replace the placeholders with your own database connection values. For Atlas, configure a database user with access to this database and allow the machine's current public IP in the project's network access list. The backend does not change Atlas access rules.

Private Atlas settings may alternatively live in `.local/config/atlas-credentials.env`. Process environment takes precedence over local files, and `.env` overrides that credentials file. Production reads process environment only. Credentials and generated private files are not included in the repository; each teammate must configure their own environment. See [.env.example](.env.example) for supported settings.

Check the connection, then prepare indexes:

```sh
npm run db:check
npm run db:setup
```

`db:check` authenticates and pings without writing data. `db:setup` creates the required indexes/schema metadata and also runs automatically at API startup. If the check fails, fix credentials, network access or connectivity before testing the connected account flow.

### 3. Start the three processes

Keep these running in **three separate terminals**, all from the repository root:

Terminal 1 — API on `127.0.0.1:3001`:

```sh
npm run dev:backend
```

Terminal 2 — verification/reset mail worker:

```sh
npm run mail:work
```

Terminal 3 — frontend on `127.0.0.1:5173`:

```sh
npm run dev
```

Open [the app](http://127.0.0.1:5173/). Use this exact origin; switching to `localhost` requires matching `APP_ORIGIN` configuration. Vite proxies `/api` to the backend. On Windows, `START-LAPTOP.cmd` starts the frontend only; the API and mail worker still need their own terminals.

### 4. Try the implemented flow

1. Open [Create account](http://127.0.0.1:5173/#/signup) and register with your chosen name, email and password. No shared/default login account is provided.
2. With `MAIL_MODE=file`, open the newest verification JSON in `.local/mail/`. Copy the complete URL from its `text` field into a browser on the same computer while the app is running.
3. After verification, log in with that email and password.
4. Save your business name/type and configure the primary branch, then enter Overview.
5. Refresh, or log out and back in, to check that saved setup persists.
6. Open Feedback. The current account view has six disabled filters, a zero-response state, an illustration and getting-started steps. There are no collected responses yet. Export/open-response controls are disabled; sharing reports that surveys are unavailable.
7. To test password recovery, log out, open [Forgot password](http://127.0.0.1:5173/#/forgot), request a reset and follow the reset URL in the newest corresponding local message. Reset links expire and are single-use.

An empty Overview or Feedback screen is expected at this stage. There is no implemented path for collecting real customer responses yet. Saved data belongs to the configured database; accounts created in a local database do not automatically exist in Atlas or on another teammate's machine.

### Email delivery during development

`MAIL_MODE=file` is a **private local mailbox**, not delivery to Gmail or another inbox. Keep `npm run mail:work` running and open the appropriate message in `.local/mail/` locally. Verification/reset URLs are private and should not be shared.

Real email requires `MAIL_MODE=smtp` and the provider settings documented in [the backend guide](docs/development/backend.md). Real provider delivery has not been verified. Production refuses file-mail mode.

### Review the UI without a backend

Run `npm ci` and `npm run dev`, then open:

- [Landing](http://127.0.0.1:5173/preview/#/landing)
- [Sample Overview](http://127.0.0.1:5173/preview/#/dashboard)
- [Empty Overview](http://127.0.0.1:5173/preview/#/dashboard-empty)
- [Sample Feedback](http://127.0.0.1:5173/preview/#/feedbacks)
- [Empty Feedback](http://127.0.0.1:5173/preview/#/feedbacks-empty)
- [Sample response details](http://127.0.0.1:5173/preview/#/feedback-details)

Preview records, metrics, assistant replies and sharing links are illustrative. Previews do not create a real session or demonstrate completed AI/feedback services. The account empty Feedback layout reuses the reviewed preview layout, with saved identity and availability-aware actions.

For a phone, `npm run dev:network` exposes the frontend on the local network for preview review. Connected account testing over LAN also requires matching backend host, browser origin and mail-link configuration; the default setup above is for the same computer.

## Current limits and next work

Not implemented: survey creation/publishing, public link/QR response collection, feedback ingestion, sentiment/aspect analysis, the FastAPI AI service, live analytics/reports, real assistant answers, team roles, Google OAuth or subscription billing. Visible navigation and sample screens do not establish those capabilities.

Atlas authenticated pings have succeeded, but this machine also encountered intermittent TLS failures. The latest manual review session used a persistent local development replica set. Automated account-flow tests use isolated local replica sets; they do not establish full Atlas or SMTP acceptance. Local executables, data and runtime processes are not distributed through Git.

The current rate limiter is per-process. Multiple backend replicas require a shared limiter before scaling. The development commands are not a production deployment configuration; production requires the HTTPS, cookie, mail and proxy settings in the backend guide.

## Checks and evidence

```sh
npm run format:check
npm run lint
npm test
npm run build
npm run test:backend:unit
npm run test:backend
npm run test:e2e:accounts
```

The latest validation recorded **20 backend tests** and **26 frontend tests**, plus a browser account lifecycle covering verification, failed-save recovery, persistent setup, logout/login, password reset, empty Feedback, mobile overlap/overflow and EN/AR checks. Backend coverage includes Mongoose create/update validation, model isolation, read-only connection setup, legacy UUID/ObjectId data, reconnect behavior and index preservation. Integration/browser tests use synthetic identities and isolated local databases, not your configured application database.

Integration tests may download MongoDB on the first run. An existing `.local/tools/mongod.exe` is reused when present; it is not committed. Browser tests use installed Edge on supported Windows paths, `PLAYWRIGHT_CHROMIUM_EXECUTABLE`, or Playwright's Chromium. If neither browser is available, run `npx playwright install chromium`.

GitHub Actions runs frontend and backend/account checks. The [validation record](docs/development/backend-validation.md) contains the initial delivery evidence and limitations; the counts above include the later configuration and empty-state regressions.

`npm run build` creates the frontend bundle; `npm run preview` serves that bundle locally. These commands do not start the API or mail worker. `npm run previews` creates standalone HTML review files after a build.

## Repository layout

```text
src/frontend/         React app, Vite configuration and public assets
src/backend/          Express API, authentication, mail and workspace services
src/backend/models/   Mongoose schemas, references and collection indexes
tests/frontend/       Frontend behavior and regression tests
tests/backend/        MongoDB integration and unit tests
tests/e2e/            Browser account/onboarding lifecycle
.github/workflows/    Frontend and backend/account CI
docs/product/         Product requirements
docs/architecture/    Architecture, API, database and AI proposals
docs/development/     Setup, workflow and validation evidence
docs/decisions/       Technical decisions
docs/references/      Ignored local source PDFs
docs/superpowers/     Implementation specifications and plans
docs/ui/              Screen galleries and synthetic screenshots
.local/               Ignored credentials, mail, database files and local tools
```

The source proposal and feature-list PDFs remain local. Never commit credentials, private mail, customer responses or local databases. Frontend assets live under `src/frontend/public/assets/`.

## Documentation

- [Full product feature map (Arabic)](docs/product/feature-list.md): the complete 51-feature scope, original priorities, current status and delivery dependencies.
- [Documentation index](docs/README.md) and [Arabic getting-started guide](docs/getting-started-ar.md).
- [Implemented backend setup and API contract](docs/development/backend.md).
- [Node.js/MongoDB architecture decision](docs/decisions/0002-node-mongodb-foundation.md).
- [Product requirements](docs/product/requirements.md), [architecture](docs/architecture/architecture.md), [proposed API](docs/architecture/api-contracts.md), [database](docs/architecture/database.md) and [future AI pipeline](docs/architecture/ai-pipeline.md). Proposal documents may describe later work; the implemented backend guide and status above define the current delivery.
- [Frontend development](docs/development/frontend.md), [team workflow](docs/development/team-workflow.md) and [repository guidelines](AGENTS.md).
- [Ordered screen galleries](docs/ui/frontend/README.md): mobile EN/AR and desktop EN/AR. Screenshots illustrate reviewed UI states; they do not prove backend availability.

## Contribution and licensing

Keep changes focused and document validation in pull requests. No open-source license has been selected; public repository visibility does not establish a license.
