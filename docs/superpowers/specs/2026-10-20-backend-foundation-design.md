# Backend foundation: accounts and business setup

Status: proposed implementation design for user review. No backend is implemented by this document.

## Agreed outcome

Make the completed account and business-onboarding screens operate against persistent data. An owner can register, verify their email, sign in and out, recover their password, save a business and its primary branch, and resume after reloading or returning later. Keep the approved English/Arabic layouts and existing protections against stale asynchronous responses.

The user selected Node.js for the application backend, MongoDB for storage, and Python with FastAPI for the later AI service. These decisions replace the earlier proposed FastAPI application backend and PostgreSQL design for this slice. The supplied Features List and User Stories is the product requirements reference. Its Manager/Viewer roles replace the older analyst terminology when team access is implemented.

## Scope and delivery boundary

- Implement registration, email verification and resend, password login, current-session lookup, logout, forgot-password, and password reset.
- Save and restore the existing business information, single/multiple branch choice, and primary branch name. Support updating these values without creating duplicate businesses or branches.
- Deliver owner-authorized branch list/create/rename/archive endpoints; do not invent a team-management screen. Existing onboarding uses only the primary branch.
- Protect product routes. After setup, enter the existing empty Overview instead of presenting synthetic metrics as the owner's results.
- Keep design/demo previews explicitly separated from authenticated product data, under `/preview/` routes. They must not create accounts, save business data, or masquerade as real analytics.
- Questionnaire collection, real feedback/analytics APIs, AI analysis, reports, the assistant, Google OAuth, subscriptions, and Manager/Viewer membership flows are subsequent slices. Existing controls for undelivered actions must explain their availability instead of reporting success.

## Architecture and tradeoff

Use one Express 5 application with focused modules for configuration, database access, authentication, mail, and workspaces. Use native JavaScript ES modules (`.mjs`) under `src/backend/`, the official MongoDB Node driver, and the existing root npm lockfile. This avoids adding a second package manager or a backend transpilation step to the JavaScript prototype. Backend behavior tests live under `tests/backend/` and use Node's test runner.

An external identity provider would reduce password-management work but introduces an unselected account/provider dependency. A heavier application framework adds conventions and tooling before the project needs them. Express plus MongoDB fits the requested first slice and keeps the later Python AI boundary independent.

The frontend calls `/api/v1` through Vite's development proxy. Production serves the frontend and API on the same origin. The browser never connects directly to MongoDB or the later AI service. Development binds to loopback unless explicitly configured for LAN use.

## Configuration and startup

- Use Node.js 22.12 or later, matching the frontend prerequisite; verify the installed runtime with the actual chosen dependency versions.
- Read local `.local/config/atlas-credentials.env` only in development, with normal process environment variables taking precedence. Commit only a placeholder `.env.example`; never log connection strings, passwords, reset tokens, verification links, or session cookies.
- Backend configuration includes `MONGODB_URI`, `MONGODB_DATABASE`, `PORT`, `APP_ORIGIN`, `MAIL_MODE`, `MAIL_ENCRYPTION_KEY`, SMTP settings, and optional `MONGODB_DNS_SERVERS` / `MONGODB_TLS_MAX_VERSION`. Generate a private local mail encryption key during developer setup; do not commit it.
- DNS/TLS workarounds must be explicit, validated configuration. Use the normal system resolver and TLS negotiation by default. The prior diagnostic needed an alternate DNS resolver and TLS 1.2; repeat the connection check before deciding local values. Do not hard-code Atlas node IPs, DNS servers, or disable certificate validation.
- Validate required settings and create indexes before accepting traffic. Shutdown closes the HTTP listener and MongoDB client.
- Liveness verifies the process; readiness performs a bounded database ping and returns 503 when storage is unavailable.

## Identity and sessions

Store UUID string IDs and UTC dates. Normalize email by trimming and lowercasing, and enforce a unique database index. Validate the name, email, terms acceptance, locale, and password server-side. Passwords accept 8-128 characters with at least one ASCII letter and one digit, matching the current UI baseline.

Use Node crypto scrypt with a random 16-byte salt, N=32768, r=8, p=1, a 64-byte derived key, and a sufficient bounded memory allowance. Store the algorithm parameters with the hash. Use constant-time comparison and a dummy hash verification for unknown login identities. Never store plaintext passwords.

Issue a random 32-byte opaque session token; store only its SHA-256 digest. Send it in an HttpOnly, SameSite=Lax cookie, with Secure in production and Path=/. Session expiry is 24 hours, or 30 days with Remember me. Recheck expiry and revocation on every request; a TTL index is cleanup, not authorization. Logout revokes the session before clearing its cookie.

Protect mutating requests with a session-bound CSRF token sent in a custom header and strict Origin validation. Auth bootstrap provides an anonymous CSRF context for signup/login; successful authentication rotates that context. Anonymous contexts have no user ID and never grant authenticated access. Limit authentication requests and input sizes. Return stable error codes and localized frontend messages without echoing secrets. Production proxy trust must be explicitly configured, not enabled for arbitrary forwarding headers.

Registration does not create an authenticated session. Unverified login returns a verification-required error; the verification view permits resend with the entered email, without granting access to a workspace. Password reset revokes existing sessions. Neither verification nor recovery automatically logs the user in.

## Verification, recovery, and mail

Use random 32-byte tokens and store only digests, purpose, user ID and expiry. Verification tokens expire after 24 hours; reset tokens after 30 minutes. Resend replaces the earlier token for the same purpose. Token consumption is single-use and enforced atomically; verification or password change and token consumption must commit together in a MongoDB transaction. Concurrent use of a token must allow at most one successful operation.

Forgot-password always returns the same accepted response for known and unknown addresses. Invalid, expired, or consumed tokens produce the same safe error. Apply per-address and per-client limits to login, signup, resend and recovery.

Provide an SMTP adapter for real delivery and a development-only file mailbox under ignored `.local/mail/`. Development tests inspect synthetic messages locally. Do not return recovery links in public API responses or logs. Refuse the file adapter in production. Persist mail intent so failed delivery can be retried: encrypt token/link material with AES-256-GCM using a separate 32-byte `MAIL_ENCRYPTION_KEY`, a random nonce per message and an authentication tag. Delete encrypted payloads after delivery or token expiry. Failed delivery must not falsely claim the email was sent; the application reports that a request was received. No real SMTP account has been supplied: live email delivery remains an explicit external validation limit, while token flows are testable through the local mailbox.

## MongoDB model and invariants

| Collection    | Fields and required constraints                                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `users`       | ID, canonical email (unique), name, locale, password hash, verified timestamp, terms acceptance timestamp, created/updated timestamps             |
| `sessions`    | Token digest (unique), user ID (null for anonymous CSRF contexts), CSRF digest, created/expiry/revoked timestamps; expiry TTL index               |
| `auth_tokens` | User ID, purpose, digest, expiry; unique user/purpose and token digest; expiry TTL index                                                          |
| `mail_outbox` | Recipient user ID, kind, delivery state, retry metadata, AES-GCM payload/nonce/tag, expiry; encrypted payload removed after sending or expiry     |
| `workspaces`  | ID, owner user ID (unique in this slice), name, industry, locale, reporting timezone, branch mode, primary branch ID, onboarding step, timestamps |
| `branches`    | ID, workspace ID, normalized name, display name, archived timestamp, timestamps; unique active normalized name per workspace                      |

Workspace ownership is resolved from the authenticated session, never from a submitted owner/user ID. Every branch query includes an authorized workspace ID. Foreign workspace/branch IDs return 404. Reject unknown JSON fields and invalid identifiers before database access.

Creating/updating the initial workspace and primary branch uses a transaction and the unique owner constraint, so double clicks, network retries and parallel requests cannot create duplicate workspaces or orphaned branches. Store business information before proceeding to branch setup so reload resumes at the correct step. A single-branch business still has a concrete primary branch; its display name defaults to the business name without adding a field to the current screen. Multiple branches require the entered primary branch name. Switching mode must not delete branches or history; reject a switch to single mode while another active branch exists. The primary branch cannot be archived before another active branch is selected.

MongoDB Atlas supports transactions; local integration/CI tests must also use a replica set. Introduce versioned, repeatable database setup/index commands; fail visibly on incompatible existing data instead of silently dropping or rewriting it.

## HTTP contract

All payloads use JSON, UUID string IDs, locale `ar`/`en`, and ISO 8601 UTC timestamps. Validation errors use `{error:{code,message,details},request_id}`. Responses never serialize authentication internals.

| Method and path                                      | Behavior                                                                                                  |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| GET `/api/v1/auth/session`                           | CSRF bootstrap and safe current user/workspace/setup metadata; anonymous state contains no identity       |
| POST `/api/v1/auth/register`                         | Validate fields, create an unverified account and verification mail intent; return 201 safe user metadata |
| POST `/api/v1/auth/verify-email`                     | Consume verification token atomically; return 200                                                         |
| POST `/api/v1/auth/resend-verification`              | Rate-limited generic 202 response; replace token and queue delivery when applicable                       |
| POST `/api/v1/auth/login`                            | Verify credentials and email status, rotate session and set cookie; return 200 safe user/setup metadata   |
| POST `/api/v1/auth/logout`                           | Revoke session and clear cookie; return 204                                                               |
| POST `/api/v1/auth/forgot-password`                  | Generic 202; queue recovery delivery for an eligible account                                              |
| POST `/api/v1/auth/reset-password`                   | Consume reset token, change password and revoke sessions atomically; return 200                           |
| GET `/api/v1/workspace`                              | Return the verified owner's workspace and setup state, or 404 if not created                              |
| PUT `/api/v1/workspace`                              | Save business name, industry, locale and reporting timezone; create once or update owned workspace        |
| PUT `/api/v1/workspace/setup`                        | Save branch mode/name and mark setup complete transactionally; return workspace and primary branch        |
| GET/POST `/api/v1/workspaces/{id}/branches`          | List/create owned branches; archived records available with an explicit filter                            |
| PATCH `/api/v1/workspaces/{id}/branches/{branch_id}` | Rename, archive, or select the primary branch while preserving invariants                                 |
| GET `/api/v1/health/live` and `/api/v1/health/ready` | Process liveness and database readiness                                                                   |

Use 401 for invalid/missing sessions, 403 for email verification requirements, 404 for unavailable or foreign resources, 409 for duplicate email/branch or branch-state conflicts, 422 for validation, 429 for limits, and 503 for unavailable storage. Do not leak database/SMTP errors to the browser.

## Existing UI integration

Replace `submitDemo` with a shared API client that includes cookies, CSRF headers, cancellation and safe error mapping. Keep generation checks so an older request cannot overwrite a newer route or session. Clear passwords on successful auth and reset, and on route changes; never write credentials or session tokens to browser storage.

Add a small bilingual email-verification status view with resend and return-to-login actions. Consume verification/reset links from URL fragments; remove token-bearing URLs from browser history after processing. An invalid reset link must show a recoverable error, not a working password form that cannot succeed. Preserve language choice and support keyboard/screen-reader status messages.

Bootstrap the session before rendering protected content. Anonymous product navigation goes to login. Incomplete setup goes to the last persisted step; completed setup goes to the existing empty Overview. Product Overview/Feedback must not show hard-coded sample records or canned AI answers. Preserve those screens in explicit preview mode for design review. Connect workspace/branch labels to the saved workspace; show an unavailable action state for undelivered functionality.

Replace demo notices only on connected flows. Provide loading, failed-save and retry behavior; preserve non-secret input on recoverable errors. Allow logout from the authenticated shell and ensure logout clears cached owner/workspace state before another user signs in.

## Acceptance and validation

1. With a synthetic user and local mailbox: register, verify, sign in, save the business and primary branch, reload, sign out, sign in again, and recover the same saved workspace.
2. Exercise single/multiple branch setup, interrupted onboarding, duplicate submits, edits, and branch archive/rename conflicts against real MongoDB storage.
3. Prove user A cannot read or write user B's workspace or branch, including direct API calls, forged IDs and hostile payload fields.
4. Reject wrong passwords, duplicate canonical email, expired/reused tokens, concurrent reset consumption, expired/revoked sessions, invalid CSRF and foreign origins. Reset must invalidate earlier sessions.
5. Verify passwords/tokens never appear in API payloads, browser storage, tracked files or application logs. The dev mailbox is intentionally private local data.
6. Run backend unit/integration tests on an isolated replica-set database; require a test database name and prevent tests from targeting the development database. Clean up only resources created by that test run. CI uses synthetic credentials and its own replica set, not Atlas secrets.
7. Run existing frontend format/lint/tests/build, add connected-flow/error/race regressions, and inspect English/Arabic desktop/mobile auth/onboarding and guarded empty-state navigation in a browser.
8. Verify readiness failure and saving during database unavailability. Never advance onboarding after a failed write.
9. Record actual Atlas smoke-test evidence, tested commands, and any unavailable SMTP/browser/CI checks. A ping alone does not prove the account/onboarding flows.

## Delivery

Implement on `codex/backend-foundation`; keep credentials and remote chat attachments ignored. Update README, contracts and a decision record to distinguish this delivered slice from earlier architecture proposals and the future Python AI service. Commit only reviewed source/configuration/examples/tests/docs, run staged whitespace checks, and prepare a focused PR with actual validation and limitations. Do not merge into main as part of this task.
