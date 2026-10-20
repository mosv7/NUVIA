# Backend development

Implemented scope: verified owner registration/login/logout, password recovery, secure sessions, persistent business setup and owner-scoped branch APIs. The application API uses Node.js/Express/MongoDB. Customer-feedback ingestion, analysis/AI, reports, Google OAuth and team memberships remain later slices.

## Install and configure

Use Node.js >=22.13 and pnpm 11.25.0. MongoDB must support transactions (Atlas or a local replica set). Run from the repository root:

```sh
pnpm install --frozen-lockfile
pnpm setup:local
```

Setup creates `.env` only if absent, with a generated private 32-byte mail-encryption key. Configure `MONGODB_URI` there or use the existing ignored `.local/config/atlas-credentials.env`. Process environment overrides local files; `.env` overrides Atlas-file values. Production reads process environment only. `.env.example` lists placeholders. Never commit connection credentials.

Atlas must permit the database user to access the configured database and the API machine's actual public IP to connect. The application does not modify Atlas access lists or system networking.

```sh
pnpm db:check
pnpm db:setup
```

The check authenticates and pings without writing data. Setup creates version-1 indexes/schema metadata and runs automatically at API startup. Unsupported schema versions, incompatible indexes and duplicate existing data fail visibly without destructive repair.

Optional `MONGODB_DNS_SERVERS` accepts comma-separated DNS server IPs; `MONGODB_TLS_MAX_VERSION` accepts `TLSv1.2` or `TLSv1.3`. Leave unset normally; configure only for a diagnosed compatibility issue. Certificate/hostname verification remains enabled; Atlas node addresses are never pinned.

## Run the connected app

For one development group, run `pnpm dev`. For separate terminals, use:

```sh
pnpm dev:backend
```

```sh
pnpm mail:work
```

```sh
pnpm dev:web
```

Open `http://127.0.0.1:5173/`. Vite proxies `/api` to port 3001. `APP_ORIGIN` must equal the exact browser origin. A custom backend port requires a corresponding Vite proxy change; explicit LAN development also requires matching origin/host configuration. Do not accept arbitrary origins or forwarded headers as a shortcut.

Register at `/#/signup`, verify, log in, save business information and primary branch, then enter the empty Overview. Reload or sign back in to resume saved setup. Product routes never present synthetic analytics as owner data. Design-only routes live at `/preview/#/dashboard`, `/preview/#/feedbacks`, etc.

Development `MAIL_MODE=file` stores messages as private JSON under ignored `.local/mail/`. Open the appropriate newest message locally and follow the URL in its `text` field. API responses/logs do not disclose tokens or links. `pnpm mail:work -- --once` dispatches one batch and exits. For real mail configure `MAIL_MODE=smtp`, `SMTP_HOST`, `SMTP_FROM` and the applicable SMTP port/TLS/user/password variables; production refuses file mode. SMTP requires TLS. No real provider has been configured or verified by local mailbox tests.

`pnpm start:backend` runs without watch mode. Production expects frontend/API on one HTTPS origin behind an explicitly configured proxy; Vite is development-only. `TRUST_PROXY` defaults to false and accepts only the explicitly chosen `loopback`, `linklocal` or `uniquelocal` network. Select according to the actual deployment.

## Delivered contract

See [Account and workspace API](../api/README.md) for implemented endpoints and DTOs. The public declarations are in `packages/shared-types`; Node persistence models are internal.

## Storage and guarantees

Collections: `schema_versions`, `users`, `sessions`, `auth_tokens`, `mail_outbox`, `workspaces`, `branches`. Unique indexes enforce canonical emails, token/session digests, owner workspaces and active normalized branch names. MongoDB Date values store UTC instants.

Application persistence uses connection-scoped Mongoose models under `apps/api/src/shared/database/models/`; see the [model catalog](../architecture/mongodb-models.md) and [migration decision](../decisions/0003-mongoose-models.md). HTTP inputs retain Zod validation. Model inserts and supported update paths are validated; unknown fields are rejected. Queries return lean objects for the existing DTO boundary. Transactions still pass an explicit session, and hashing/encryption/application timestamps stay in services.

Existing collection names and UUID/ObjectId storage formats are preserved. Connection setup disables automatic collection/index creation and query buffering; schema setup explicitly creates declared indexes without dropping existing ones. This upgrade does not require a bulk data rewrite. Use the existing private URI and normal setup commands after `pnpm install --frozen-lockfile`.

Passwords use salted scrypt (N=32768/r=8/p=1, 64-byte derived key). Opaque cookies are HttpOnly/SameSite=Lax, Secure in production, lasting 24 hours or 30 days with Remember me. Authorization checks expiry/revocation before TTL cleanup. Verification/reset tokens are hashed, expire after 24 hours/30 minutes and are consumed transactionally. Password reset advances a credential version so a racing old-password login cannot remain authorized.

Encrypted mail intent uses AES-256-GCM; payloads are removed on delivery/expiry. Leases recover interrupted jobs, with at most three delivery attempts. SMTP is at-least-once across a process crash after sending and before committing success; links remain single-use. A permanent exhausted job stays visible as failed until its retention/expiry cleanup.

Repeated onboarding cannot duplicate workspaces/primary branches. Archival preserves branch history. Primary archival requires selecting a replacement first; switching to single mode cannot discard another active branch. No Manager/Viewer permissions are implemented yet.

Rate counters are bounded and in-process for the single-process foundation. Multiple API replicas require a shared limiter before production scaling. CSRF/session errors invalidate stale frontend context and safely re-bootstrap; mutations are never silently replayed.

## Tests

```sh
ppnpm test:web:backend:unit
ppnpm test:web:backend
pnpm test:web
ppnpm test:web:e2e:accounts
pnpm format:check
pnpm lint
pnpm build
```

Backend/browser integration runners start their own one-member MongoDB 7.0.24 replica set using `mongodb-memory-server-core`. The first run downloads the binary unless `MONGOMS_SYSTEM_BINARY` is provided; Windows also detects `.local/tools/mongod.exe`. This does not install a permanent MongoDB service. Unit-only tests need no database.

Each test gets a fresh guarded `nuvia_test_<uuid>` database and cleans up only that database. Tests never discover development Atlas credentials. An explicit external `MONGODB_TEST_URI` must target a test replica set and use a guarded database name if qualified. CI uses local replica sets and synthetic credentials.

Browser tests prefer `PLAYWRIGHT_CHROMIUM_EXECUTABLE`, installed Edge on Windows, or Playwright Chromium (`npx playwright install chromium`). They own their API/Vite listeners, temporary mailbox, and isolated database. Screenshots use synthetic data in ignored `test-results/accounts/`. Browser plugin was unavailable here; Playwright/headless Edge provided validation.

See [validation evidence](backend-validation.md) for observed results and remaining limits.
