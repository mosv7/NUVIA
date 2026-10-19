# Backend development

Implemented scope: verified owner registration/login/logout, password recovery, secure sessions, persistent business setup and owner-scoped branch APIs. The application API uses Node.js/Express/MongoDB. Customer-feedback ingestion, analysis/AI, reports, Google OAuth and team memberships remain later slices.

## Install and configure

Use Node.js >=22.12 and npm >=10. MongoDB must support transactions (Atlas or a local replica set). Run from the repository root:

```sh
npm ci
npm run setup:local
```

Setup creates `.env` only if absent, with a generated private 32-byte mail-encryption key. Configure `MONGODB_URI` there or use the existing ignored `atlas-credentials.env`. Process environment overrides local files; `.env` overrides Atlas-file values. Production reads process environment only. `.env.example` lists placeholders. Never commit connection credentials.

Atlas must permit the database user to access the configured database and the API machine's actual public IP to connect. The application does not modify Atlas access lists or system networking.

```sh
npm run db:check
npm run db:setup
```

The check authenticates and pings without writing data. Setup creates version-1 indexes/schema metadata and runs automatically at API startup. Unsupported schema versions, incompatible indexes and duplicate existing data fail visibly without destructive repair.

Optional `MONGODB_DNS_SERVERS` accepts comma-separated DNS server IPs; `MONGODB_TLS_MAX_VERSION` accepts `TLSv1.2` or `TLSv1.3`. Leave unset normally; configure only for a diagnosed compatibility issue. Certificate/hostname verification remains enabled; Atlas node addresses are never pinned.

## Run the connected app

Keep three terminals running:

```sh
npm run dev:backend
```

```sh
npm run mail:work
```

```sh
npm run dev
```

Open `http://127.0.0.1:5173/`. Vite proxies `/api` to port 3001. `APP_ORIGIN` must equal the exact browser origin. A custom backend port requires a corresponding Vite proxy change; explicit LAN development also requires matching origin/host configuration. Do not accept arbitrary origins or forwarded headers as a shortcut.

Register at `/#/signup`, verify, log in, save business information and primary branch, then enter the empty Overview. Reload or sign back in to resume saved setup. Product routes never present synthetic analytics as owner data. Design-only routes live at `/preview/#/dashboard`, `/preview/#/feedbacks`, etc.

Development `MAIL_MODE=file` stores messages as private JSON under ignored `.local/mail/`. Open the appropriate newest message locally and follow the URL in its `text` field. API responses/logs do not disclose tokens or links. `npm run mail:work -- --once` dispatches one batch and exits. For real mail configure `MAIL_MODE=smtp`, `SMTP_HOST`, `SMTP_FROM` and the applicable SMTP port/TLS/user/password variables; production refuses file mode. SMTP requires TLS. No real provider has been configured or verified by local mailbox tests.

`npm run start:backend` runs without watch mode. Production expects frontend/API on one HTTPS origin behind an explicitly configured proxy; Vite is development-only. `TRUST_PROXY` defaults to false and accepts only the explicitly chosen `loopback`, `linklocal` or `uniquelocal` network. Select according to the actual deployment.

## Delivered contract

Prefix `/api/v1`; UTF-8 JSON, UUID string IDs, UTC timestamps. GET `/auth/session` returns `{user,workspace,csrfToken}` with null identity when anonymous. Mutations require that cookie, `X-CSRF-Token` and exact Origin. No bearer token, credentials or MongoDB URI belongs in the frontend.

| Method   | Path                                 | Payload/result                                                          |
| -------- | ------------------------------------ | ----------------------------------------------------------------------- |
| GET      | `/auth/session`                      | Safe identity/workspace and CSRF context                                |
| POST     | `/auth/register`                     | `{name,email,password,terms:true,locale}`; 201 unverified owner         |
| POST     | `/auth/verify-email`                 | `{token}`; single-use confirmation                                      |
| POST     | `/auth/resend-verification`          | `{email}`; generic 202                                                  |
| POST     | `/auth/login`                        | `{email,password,remember?}`; rotated session and safe identity         |
| POST     | `/auth/logout`                       | `{}`; 204 after session revocation                                      |
| POST     | `/auth/forgot-password`              | `{email}`; identical 202 for known/unknown accounts                     |
| POST     | `/auth/reset-password`               | `{token,password}`; change password and revoke old sessions             |
| GET/PUT  | `/workspace`                         | Read/save `{businessName,industry,locale?,reportingTimezone?}`          |
| PUT      | `/workspace/setup`                   | `{branchType,branchName?}`; transactionally finish primary-branch setup |
| GET/POST | `/workspaces/:id/branches`           | Active branches or create `{name}`; GET supports `includeArchived=true` |
| PATCH    | `/workspaces/:id/branches/:branchId` | Nonempty `{name?,archived?,isPrimary?:true}`                            |
| GET      | `/health/live`, `/health/ready`      | Process health; database ping with 3000ms client deadline               |

Workspace DTO: `id`, `businessName`, `industry`, `locale`, `reportingTimezone`, `branchType`, `primaryBranchId`, `onboardingStep`, `branches`. Branch DTO: `id`, `name`, `archivedAt`, `isPrimary`. Information saving persists step `branches`; only a committed branch transaction marks `complete`.

Validation rejects unknown fields, operator-shaped inputs and invalid IDs. All branch access is owner/workspace-scoped; foreign resources return 404. Errors use `{error:{code,message,details},request_id}` without internal errors or secrets. Statuses: 400 invalid token/JSON, 401 authentication, 403 verification/CSRF, 404 unavailable/foreign resource, 409 uniqueness/state conflict, 413 body size, 422 validation, 429 rate limiting, 503 storage unavailable.

## Storage and guarantees

Collections: `schema_versions`, `users`, `sessions`, `auth_tokens`, `mail_outbox`, `workspaces`, `branches`. Unique indexes enforce canonical emails, token/session digests, owner workspaces and active normalized branch names. MongoDB Date values store UTC instants.

Passwords use salted scrypt (N=32768/r=8/p=1, 64-byte derived key). Opaque cookies are HttpOnly/SameSite=Lax, Secure in production, lasting 24 hours or 30 days with Remember me. Authorization checks expiry/revocation before TTL cleanup. Verification/reset tokens are hashed, expire after 24 hours/30 minutes and are consumed transactionally. Password reset advances a credential version so a racing old-password login cannot remain authorized.

Encrypted mail intent uses AES-256-GCM; payloads are removed on delivery/expiry. Leases recover interrupted jobs, with at most three delivery attempts. SMTP is at-least-once across a process crash after sending and before committing success; links remain single-use. A permanent exhausted job stays visible as failed until its retention/expiry cleanup.

Repeated onboarding cannot duplicate workspaces/primary branches. Archival preserves branch history. Primary archival requires selecting a replacement first; switching to single mode cannot discard another active branch. No Manager/Viewer permissions are implemented yet.

Rate counters are bounded and in-process for the single-process foundation. Multiple API replicas require a shared limiter before production scaling. CSRF/session errors invalidate stale frontend context and safely re-bootstrap; mutations are never silently replayed.

## Tests

```sh
npm run test:backend:unit
npm run test:backend
npm test
npm run test:e2e:accounts
npm run format:check
npm run lint
npm run build
```

Backend/browser integration runners start their own one-member MongoDB 7.0.24 replica set using `mongodb-memory-server-core`. The first run downloads the binary unless `MONGOMS_SYSTEM_BINARY` is provided; Windows also detects `.local/tools/mongod.exe`. This does not install a permanent MongoDB service. Unit-only tests need no database.

Each test gets a fresh guarded `nuvia_test_<uuid>` database and cleans up only that database. Tests never discover development Atlas credentials. An explicit external `MONGODB_TEST_URI` must target a test replica set and use a guarded database name if qualified. CI uses local replica sets and synthetic credentials.

Browser tests prefer `PLAYWRIGHT_CHROMIUM_EXECUTABLE`, installed Edge on Windows, or Playwright Chromium (`npx playwright install chromium`). They own their API/Vite listeners, temporary mailbox, and isolated database. Screenshots use synthetic data in ignored `test-results/accounts/`. Browser plugin was unavailable here; Playwright/headless Edge provided validation.

See [validation evidence](backend-validation.md) for observed results and remaining limits.
