# Backend Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace account and business-setup demos with verified owner accounts, secure sessions and persistent MongoDB workspaces/branches, preserving the approved bilingual screens.

**Architecture:** One Express application owns identity, mail delivery and workspaces. The React frontend uses same-origin cookie authentication through `/api/v1`; MongoDB transactions enforce token consumption and onboarding invariants. AI remains a later independent Python/FastAPI service.

**Tech Stack:** Node.js >=22.12, native JavaScript ES modules, Express 5, official MongoDB driver, Zod, Helmet, cookie-parser, Nodemailer, Node crypto, Node test runner, Supertest, mongodb-memory-server-core, existing React/Vite/Vitest/Playwright.

**Spec:** `docs/superpowers/specs/2026-10-20-backend-foundation-design.md`, approved in chat on 2026-10-20. Implementation awaits review of this plan and selection of execution method.

## Global Constraints

- Use `src/backend/` for `.mjs` modules and `tests/backend/` for backend behavior tests; preserve frontend JavaScript/JSX and current npm lockfile.
- Use Node.js 22.12 or later, matching the frontend prerequisite; verify the installed runtime with the actual chosen dependency versions.
- Store UUID string IDs and UTC dates. Passwords accept 8-128 characters with at least one ASCII letter and one digit, matching the current UI baseline.
- Use Node crypto scrypt with a random 16-byte salt, N=32768, r=8, p=1, a 64-byte derived key, and a sufficient bounded memory allowance.
- Session expiry is 24 hours, or 30 days with Remember me. Verification tokens expire after 24 hours; reset tokens after 30 minutes.
- Cookie: HttpOnly, SameSite=Lax, Secure in production, Path=/. No credentials or session tokens in browser storage.
- MongoDB, SMTP and mail-encryption credentials remain server-side; never print secrets. Keep `atlas-credentials.env`, `.local/` and `.codex-remote-attachments/` ignored.
- Use the normal system resolver and TLS negotiation by default. No hard-coded DNS servers/Atlas IPs and no disabled TLS verification.
- Work on `codex/backend-foundation`. Do not merge main. Commit exact files only, after staged whitespace validation.
- Every implementation task follows red -> green tests -> commit; tests must verify behavior, not reproduce internal helpers.

## Review Focus

- Reset racing a login or another reset: only one reset succeeds; no session authenticated against the old password remains valid. Task 4 owns these tests.
- Two onboarding saves or a lost response: retries update the same workspace/primary branch without orphaned branches. Task 5 owns these tests.
- Resend racing outbox delivery: expired/replaced verification links never become valid again; failed SMTP leaves a retryable message. Task 4 owns these tests.
- Route change/logout while bootstrap or save is pending: late responses cannot restore the old identity, show another owner's data, or advance onboarding. Task 6 owns these tests.
- Database unavailable on startup/readiness/save: no false-ready response, successful-looking save, or advancement to the next step. Tasks 1, 5 and 6 own these tests.

## File Structure and Interfaces

| Files                                                                                                                   | Responsibility                                                                                           |
| ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `src/backend/config.mjs`, `database.mjs`, `app.mjs`, `server.mjs`                                                       | Validated environment, MongoDB lifecycle, dependency-injected HTTP app, process startup/shutdown         |
| `src/backend/http/errors.mjs`, `security.mjs`, `validation.mjs`, `rate-limits.mjs`                                      | Safe errors/request IDs, same-origin protection/security headers, strict schemas, bounded request limits |
| `src/backend/auth/passwords.mjs`, `sessions.mjs`, `service.mjs`, `routes.mjs`                                           | Password hashing, anonymous/authenticated sessions, account/token lifecycle and HTTP boundary            |
| `src/backend/mail/crypto.mjs`, `outbox.mjs`, `adapters.mjs`, `worker.mjs`                                               | Encrypted transactional mail intent, delivery adapters, retry leases and dispatch                        |
| `src/backend/workspaces/service.mjs`, `routes.mjs`                                                                      | Owner-scoped business setup and branch invariants                                                        |
| `src/backend/scripts/setup-local.mjs`, `check-db.mjs`, `setup-db.mjs`                                                   | Generate private development settings, safe ping, repeatable indexes/schema version                      |
| `tests/backend/helpers/{database,http,mail}.mjs`, `tests/backend/run.mjs`                                               | Isolated replica set, browser-like test client, synthetic mail, test orchestration                       |
| `tests/backend/{config,passwords,sessions,auth,mail,workspaces}.test.mjs`                                               | Unit tests and real MongoDB/API integration tests                                                        |
| `src/frontend/src/services/{api,auth,workspace}.js`, `auth/{AuthProvider,VerificationPage}.jsx`, `auth/route-policy.js` | API boundary, session state, verification UX and route decisions                                         |
| Existing `App.jsx`, onboarding pages, copy dictionaries and product shell                                               | Connect current UI; preserve layout; guard account-backed routes and separate design previews            |
| `tests/frontend/{api,auth-connected,onboarding-connected,route-policy}.test.jsx`                                        | Transport errors, auth/RTL flows, persisted onboarding and stale-response regressions                    |
| `tests/e2e/accounts.spec.mjs`, `playwright.config.mjs`                                                                  | Real browser account-to-persisted-workspace flow against an isolated database                            |

Shared DTOs: `UserView={id,name,email,locale,emailVerified}`, `WorkspaceView={id,businessName,industry,locale,reportingTimezone,branchType,primaryBranchId,onboardingStep,branches}`, `BranchView={id,name,archivedAt,isPrimary}`, `SessionView={user:null|UserView,workspace:null|WorkspaceView,csrfToken}`. `onboardingStep` is `information`, `branches` or `complete`. Errors use `{error:{code,message,details},request_id}`. Dates crossing HTTP are UTC ISO strings; MongoDB dates remain Date values.

All service functions receive a dependency object `{db,client,config,now}`. `now()` returns a Date; tests inject it for expiry cases. `createApp({db,client,config,now})` returns an Express app without listening; startup and tests own listeners. Services derive identity from a session resolved on the server, never from request payload user IDs.

## Task 1: Runnable API, safe configuration and replica-set tests

**Files:** Create core/backend script/helper files above and `tests/backend/config.test.mjs`; modify `package.json`, `package-lock.json`, `eslint.config.js`, `.gitignore`; create `.env.example`.

**Interfaces:** `loadConfig(env=process.env,{rootDir}) -> Config`; `connectDatabase(config) -> Promise<{client,db,close}>`; `ensureSchema(db) -> Promise<void>`; `createApp(dependencies) -> Express`; `createTestDatabase() -> Promise<{client,db,config,cleanup}>`. Config uses lower-camel-case fields mapped from the spec environment variables.

- [ ] Write failing configuration/health tests: environment overrides local files; production never reads Atlas files; invalid URI/origin/key/DNS/TLS settings fail without revealing values; liveness 200, readiness 200 with MongoDB and 503 on a failed ping; shutdown closes storage/listener. Test DB helper refuses any supplied database name outside `nuvia_test_<uuid>` and refuses the development DB even with that prefix.
- [ ] Run `node --test tests/backend/config.test.mjs`; confirm expected missing-module failure before implementation.
- [ ] Add compatible dependencies with npm and commit the lockfile; use `mongodb-memory-server-core` to start a one-member replica set with `wiredTiger` only in the test launcher. Default tests use local temporary storage; allow an explicit replica-set `MONGODB_TEST_URI` only with a fresh generated test DB. Never read Atlas development credentials in tests. Implement strict config, startup/shutdown, safe error envelopes, request IDs, 32 KiB JSON limit, explicit trusted-proxy settings and readiness.
- [ ] Implement `ensureSchema` with a `schema_versions` record and idempotent version-1 indexes from the spec; reject incompatible version/data instead of dropping indexes/collections. `setup-local` writes missing private values with exclusive file creation, generates a 32-byte mail key and defaults to file mail; never overwrite user settings. Add `.local/` to ignore rules. Add scripts `dev:backend`, `start:backend`, `db:check`, `db:setup`, `setup:local`, `test:backend` and `test:backend:unit`. Extend ESLint to backend/test `.mjs` with Node globals.
- [ ] Run `npm run test:backend -- --test-name-pattern='configuration|health|database safety|schema'` and `npm run lint`; expect passing matching tests and no lint errors. Stage only this task's files, run `git diff --cached --check`, commit `Add Node API and isolated MongoDB test foundation`.

## Task 2: Passwords, sessions and CSRF boundary

**Files:** Create auth password/session modules and HTTP security/validation/rate-limit modules; create `tests/backend/passwords.test.mjs`, `sessions.test.mjs`; extend app and helpers.

**Interfaces:** `hashPassword(password) -> Promise<string>`; `verifyPassword(password,encodedHash) -> Promise<boolean>`; `bootstrapSession(req,res,deps) -> Promise<SessionView>`; `requireUser(req,deps) -> Promise<UserView>`; `requireVerifiedUser(req,deps) -> Promise<UserView>`; `requireCsrf(req,deps) -> Promise<void>`; `createSession(res,{userId,remember},deps) -> Promise<{csrfToken}>`; `revokeSession(req,res,deps) -> Promise<void>`. Middleware stores only resolved safe session metadata on the request.

- [ ] Write failing tests asserting same password hashes differently but verifies; malformed/oversized hashes reject; stored parameters equal the spec; anonymous bootstrap is not authenticated; cookie flags and exact 24-hour/30-day lifetimes; database-expired/revoked session rejected before TTL cleanup; rejected mutation without CSRF, wrong token or foreign/missing browser Origin; valid same-origin mutation accepted. Anonymous context must expire and rotate on login.
- [ ] Run `npm run test:backend -- --test-name-pattern='password|session|csrf'`; confirm failure on unimplemented interfaces.
- [ ] Implement scrypt with 64 MiB max memory and strict stored-parameter validation; maintain a precomputed dummy hash for unknown accounts. Use 32-byte random session values, SHA-256 digests and timing-safe checks. Bootstrap must return the same derived CSRF token for an existing valid context without persisting plaintext: derive a purpose-specific CSRF key from the configured secret with HKDF-SHA256 and `nuvia:csrf:v1` info, then HMAC-SHA256 the raw opaque session cookie. Persist only the CSRF token digest; never derive CSRF from a publicly known digest or regenerate conflicting tokens on every GET.
- [ ] Implement cookie/session rotation and origin checks; rate-limit by client and normalized address with strict field schemas. For the single-process foundation use bounded in-memory counters with limits configurable in tests, prune expired keys and cap entries. Document shared limiting as a production scaling prerequisite. Auth endpoints allow 10 attempts per 15 minutes per address and 60 per client; verification resend/forgot use 3 per hour per address and 20 per client; bootstrap allows 120 per 15 minutes per client. Return 429/Retry-After without secrets.
- [ ] Run matching tests and lint; expect all passing. Stage this task's exact files, check staged whitespace, commit `Add secure password sessions and CSRF protection`.

## Task 3: Registration, verified login and logout APIs

**Files:** Create `auth/service.mjs`, `auth/routes.mjs`, mail crypto/outbox modules and `tests/backend/auth.test.mjs`, `mail.test.mjs`; extend app/schema/helper.

**Interfaces:** `registerOwner(input,deps) -> Promise<UserView>`; `loginOwner(input,req,res,deps) -> Promise<SessionView>`; `getSessionView(req,res,deps) -> Promise<SessionView>`; `enqueueAuthMail({userId,kind,token,expiresAt},deps,mongoSession) -> Promise<void>`; `encryptPayload(value,key) -> {ciphertext,nonce,tag}`; `decryptPayload(payload,key) -> object`. Login input is `{email,password,remember}`; registration is `{name,email,password,terms,locale}`. Later Task 4 implements verification consumption; these tests seed verified state directly where login needs it.

- [ ] Write failing HTTP tests: valid registration 201 safe metadata and no authenticated session; canonical duplicate email 409 including concurrent requests; terms=false, unknown keys, object email and invalid lengths 422; unverified login 403; wrong/unknown credentials identical 401 envelope; verified login rotates cookie/context; bootstrap exposes no hash/token digest; logout 204 and old session rejected. Registration/account/outbox failure rolls back all writes.
- [ ] Run `npm run test:backend -- --test-name-pattern='registration|login|logout|mail encryption'`; confirm failing assertions.
- [ ] Implement POST register/login/logout and GET session from the approved HTTP catalog. Registration creates user, verification token and encrypted outbox intent in one transaction. Persist `credentialsVersion` on users/sessions: login binds the version from password verification; session lookup rejects mismatches so a concurrent reset cannot leave an old-password session valid. Serialize only explicit DTO fields; do not spread database records into responses.
- [ ] Implement AES-256-GCM encryption with a fresh 12-byte nonce and authentication tag. Test altered ciphertext/tag and wrong key reject; pending DB records contain no plaintext link/token/password, responses and captured safe logs contain none either. Do not send mail yet.
- [ ] Run matching tests plus Tasks 1-2 tests and lint; expect all passing. Stage exact files, check staged whitespace, commit `Implement owner registration login and logout`.

## Task 4: Single-use verification/recovery and retryable mail delivery

**Files:** Complete auth service/routes and mail adapter/worker files; extend `auth.test.mjs`, `mail.test.mjs`; add development mailbox helper and `mail:work` script.

**Interfaces:** `verifyEmail({token},deps) -> Promise<void>`; `requestVerification({email,locale},deps) -> Promise<void>`; `requestPasswordReset({email,locale},deps) -> Promise<void>`; `resetPassword({token,password},deps) -> Promise<void>`; `deliverPendingMail(deps,{limit=10}) -> Promise<{sent,failed}>`; `createMailAdapter(config) -> {send(message):Promise<void>}`. Mail job state is `pending|sending|sent|failed|expired`, with a bounded delivery lease and encrypted token payload.

- [ ] Write failing HTTP/storage tests: verify once; expire at 24 hours; replacement invalidates earlier token; reset expires at 30 minutes; concurrent verify/reset consumes at most once; password change and session revocation commit together; reset racing old-password login leaves no valid old session; known/unknown recovery and resend return the same 202; rate limits and invalid/reused token failures. Test browser fragments are used in generated links.
- [ ] Run the auth/mail tests; confirm failures correspond to missing lifecycle/delivery behavior.
- [ ] Implement token transactions and credentialsVersion increment on reset; recheck user/token state in each transaction. New token invalidates old undelivered jobs. Validate eligible token state before dispatch, and ensure a link delivered just before a concurrent resend becomes unusable afterward. Worker claims with a lease, retries up to three times with exponential delays, expires obsolete work, and removes encrypted payload after successful send/expiry. Retryable failure preserves ciphertext; redacted errors cannot include recipient/link/SMTP credentials.
- [ ] Add Nodemailer SMTP delivery and an exclusive-file development mailbox under `.local/mail/`; refuse file mode in production. Test with a fake transport and private temporary mailbox, including failure/restart/lease recovery and tampered payload. Test all token fields absent from safe API responses/logs; development mailbox alone contains the synthetic link by design. No real emails during automated tests.
- [ ] Run backend tests and lint; expect all passing. Stage exact files, check staged whitespace, commit `Add verified email and password recovery flows`.

## Task 5: Persistent owner workspace and branch APIs

**Files:** Create workspace service/routes and `tests/backend/workspaces.test.mjs`; extend schema/app/auth DTO mapping.

**Interfaces:** `getWorkspace(userId,deps) -> Promise<WorkspaceView>`; `saveWorkspace(userId,{businessName,industry,locale,reportingTimezone},deps) -> Promise<WorkspaceView>`; `completeSetup(userId,{branchType,branchName},deps) -> Promise<WorkspaceView>`; `listBranches(userId,workspaceId,{includeArchived},deps) -> Promise<BranchView[]>`; `createBranch(userId,workspaceId,{name},deps) -> Promise<BranchView>`; `updateBranch(userId,workspaceId,branchId,{name?,archived?,isPrimary?},deps) -> Promise<BranchView>`. Only verified users can call these functions through routes.

- [ ] Write failing tests for two isolated owners; missing/foreign IDs return 404; forged owner/workspace fields and MongoDB operator objects reject; unique owner workspace; exact persisted onboarding step after each save; reload preserves fields; repeated/parallel setup yields one primary branch; single branch uses business name; multiple requires branchName. Real transaction failures must leave no orphaned writes.
- [ ] Run `npm run test:backend -- --test-name-pattern='workspace|branch|onboarding'`; confirm failures on missing routes/services.
- [ ] Implement catalog routes with owner-filtered queries and transactionally enforced versioned changes. Workspace DTO maps `name` to UI `businessName`; uncreated workspace returns 404 while session DTO uses workspace=null. Persist information step as `branches`, then `complete` only after branch write commits. Use unique active normalized branch names per workspace, explicit UUID validation and normalized string limits. Transactions serialize competing branch mutations by updating a workspace version field.
- [ ] Add tests/implementation for rename conflicts, archived-name reuse, archival history, primary replacement, blocked primary archive, and blocked single mode with another active branch. Reject unsupported/no-op patch shapes. Database outage must return safe 503 and preserve last committed state. Do not delete history when changing mode.
- [ ] Run all backend tests and lint; expect all passing, including cross-owner API calls and concurrency. Stage exact files, check staged whitespace, commit `Persist owner workspaces and branch setup`.

## Task 6: Connect existing auth/onboarding screens and route guards

**Files:** Create frontend service/auth modules and frontend tests listed above; modify `App.jsx`, `BusinessOnboarding.jsx`, `BusinessInformationPage.jsx`, `SetupPage.jsx`, `GetStartedPage.jsx`, `i18n.js`, `setup-copy.js`, Vite config, existing frontend flow tests and necessary auth styles.

**Interfaces:** `apiRequest(path,{method='GET',body,signal}={}) -> Promise<JSON|undefined>` rejects with `{code,status,details}`; `authApi={session,register,verify,resend,login,logout,forgot,reset}`; `workspaceApi={get,save,completeSetup}` map exactly to backend catalog/DTOs; `AuthProvider` exposes `{status,user,workspace,refresh,login,logout,saveWorkspace,completeSetup}`. `routePolicy({route,preview,user,workspace}) -> {allow,redirect}` is pure. Token URLs are `#/verify-email?token=...` and `#/reset?token=...`; remove consumed tokens from history without triggering duplicate submissions.

- [ ] Write failing Vitest tests using mocked HTTP boundaries: registration leads to verification status; verify/resend and invalid/expired reset recover; wrong login remains on form; verified login resumes incomplete setup or empty Overview; reload restores business; failed save retains non-secret fields and blocks progress. Assert EN/AR status labels, RTL, keyboard use, no password/session token in localStorage, correct API cookie/CSRF behavior and loading/retry states.
- [ ] Run `npm test -- tests/frontend/auth-connected.test.jsx tests/frontend/onboarding-connected.test.jsx tests/frontend/api.test.jsx tests/frontend/route-policy.test.jsx`; expect assertions failing against existing demo adapters.
- [ ] Implement API bootstrap single-flight, relative same-origin URLs, credentials inclusion, CSRF header and AbortSignal support. Restrict automatic retry to safe bootstrap, never replay mutations blindly. Implement AuthProvider with generation-based invalidation on logout/route/unmount, authenticated bootstrap before protected rendering, and no authenticated cache persisting across users. Add tests where delayed bootstrap/save/login resolves after logout, route change or another login; none may restore stale identity/advance setup.
- [ ] Wire current forms and remove connected-flow demo notices; retain current layouts and local field validation with authoritative API errors. Pass disabled/busy props to existing buttons; clear passwords on successful auth/reset/navigation. Add verification status/resend view using existing auth styling. Disable Google sign-in with bilingual availability text. Configure Vite `/api` proxy to the explicit local backend port. Wire persisted onboarding and final Get Started navigation; show no success until storage confirms.
- [ ] Run frontend tests, lint and build; expect passing connected tests plus updated previous stale-login/keyboard/RTL regressions. Stage exact files, check staged whitespace, commit `Connect account and onboarding screens to the Node API`.

## Task 7: Honest product states and explicit design previews

**Files:** Modify route policy/App, `DashboardPage.jsx`, `FeedbacksPage.jsx`, `ProductContext.jsx`, `FeedbackShell.jsx`, `OverviewControls.jsx`, `OverviewDesign.jsx`, `FeedbackScreens.jsx`, `Assistant.jsx`; add product-state tests under frontend route tests; update screenshot and standalone-preview scripts.

**Interfaces:** Product views receive `{workspace,onLogout,preview=false}` through ProductProvider. Preview URLs are `/preview/#/<existing-route>`, parsed from pathname; all sample navigation stays in that namespace. Real `/` product routes use saved workspace labels/branches and empty content. `preview=true` alone may render sample metrics, feedback and canned assistant content, and is never an API authorization signal.

- [ ] Write failing tests: anonymous dashboard/feedback URLs redirect to login without flashing samples; verified incomplete setup resumes; completed owner sees saved workspace name/branches and no hard-coded counts or sample feedback. Real detail URLs without a delivered response API show an unavailable state. Logout clears owner data even if a request is pending.
- [ ] Run route/product tests; confirm current unguarded/demo behavior fails.
- [ ] Wire empty Overview and Feedback through the existing shell, real workspace/branch labels and logout. Undelivered collection/export/assistant/team actions show short bilingual availability messages; real product assistant must not generate canned business claims. Ensure empty dashboard does not execute sample-report/export logic. Preserve the existing approved layout in explicit previews without issuing account/workspace mutations.
- [ ] Keep `/preview/` auth/onboarding using an isolated demo adapter; label previews and never persist credentials or create sessions through them. Update `create-previews.mjs` and `capture-screenshots.mjs` to use explicit preview URLs. Retarget old sample-screen tests to previews; add assertions that preview navigation stays in `/preview/` and cannot mutate real data.
- [ ] Run full frontend tests, lint and build; expect passing product/preview boundaries and existing design regressions. Stage exact files, check staged whitespace, commit `Separate account-backed product routes from design previews`.

## Task 8: End-to-end evidence, CI and documentation

**Files:** Create browser test/config and `tests/e2e/run.mjs`, `.github/workflows/backend.yml`, `docs/decisions/0002-node-mongodb-foundation.md`, `docs/backend.md`; update README, architecture/database/contracts/frontend docs and existing frontend CI where required.

**Interfaces:** `npm run test:e2e:accounts` starts an isolated replica set and local API/frontend/mail worker processes, tests then shuts down only processes/storage it owns. Test mailbox remains inside that test run's temporary directory. No shared Atlas credentials in CI. `npm run test:backend` forwards runner flags after `--` and rejects unsupported arguments instead of ignoring them.

- [ ] Write failing browser scenario: register synthetic owner, obtain verification link from private test mailbox, verify, login, save business/multiple branch, reload, logout/login, verify same workspace; reset through mailbox, confirm old password/session fails and new one works. Include AR/mobile route and failed-save recovery; clear all test processes and generated data in finally blocks.
- [ ] Run browser scenario before final integration; confirm failures identify actual gaps, then repair only this slice and rerun affected tests.
- [ ] Add backend CI with Node 22 and an isolated replica set; test install/lint/unit/integration, then run frontend checks. Add browser scenario using an available supported browser with explicit setup. Document actual working clean-install, dev, mail worker, schema setup, database check and test commands; document local DNS/TLS options only if reproduced. Architecture/DB docs retain future service proposals but point to the implemented MongoDB schema and owner-only contract; avoid presenting future analytics/team/AI as delivered.
- [ ] Run `npm ci`, `npm run format:check`, `npm run lint`, `npm run test:backend`, `npm test`, `npm run build`, `npm run test:e2e:accounts` sequentially. Inspect 393x800 and 1440x900 EN/AR screens in the browser and record visible/console/network failures. Recheck Atlas with `npm run db:check`; use only read-only ping on the development DB. Inspect git status/staged files for ignored secrets, mailbox files and chat attachments without dumping their contents. Record any unavailable SMTP/browser/remote CI check as pending.
- [ ] Update validation docs with observed results, stage exact deliverables, run staged whitespace checks and commit `Document and verify the backend foundation`. Prepare a focused PR on the feature branch; do not push secrets or merge main. Completion requires actual verified account/onboarding flows, not a successful ping or green unit tests alone.

## Technical References

- Express 5 runtime/migration reference: https://expressjs.com/en/guide/migrating-5/
- MongoDB Node/runtime compatibility: https://www.mongodb.com/docs/drivers/compatibility/
- Local replica-set test tooling: https://github.com/typegoose/mongodb-memory-server

## Plan Self-Review

Every spec section maps to a task: configuration/lifecycle/schema (1), identity/CSRF/rate limits (2-3), verification/recovery/mail (3-4), ownership/setup/branches (5), connected UI and async behavior (6), guarded empty states/previews (7), browser/CI/docs/delivery (8). The five review-focus risks each have explicit tests in their owning tasks. DTO fields, service signatures and endpoint names are consistent across consumers. Live SMTP is an external validation limit rather than an unimplemented mock claimed as delivered. Implementation method remains a user selection at plan review.
