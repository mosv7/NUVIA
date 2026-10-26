# Canonical NUVIA API

`backend/` is the product's only Node/Express/Mongoose API. It preserves the second backend's `BusinessOwner`, `Business`, `Branch`, `Survey`, `Question` and `QuestionOption` identities and collections. No data from the retired `apps/api` is imported or deleted. Unsupported product features remain under development.

From the repository root, install with `pnpm install --frozen-lockfile`, configure the root `.env`, and run `pnpm dev`. Node >=22.13 and pnpm 11.25.0 are required. MongoDB must be a replica set or Atlas because password reset and onboarding setup use transactions.

Configuration: `MONGODB_URI`, `MONGODB_DATABASE`, `JWT_SECRET` (at least 32 random characters), `APP_ORIGIN` (default `http://127.0.0.1:5173`), and `PORT` (default 3001). Process environment takes precedence over the root `.env`; production reads process environment only. Legacy `MONGO_URI` remains a fallback. `HOST` defaults to loopback and may be set explicitly by container orchestration. Startup requires transaction capability and creates declared indexes additively, without dropping existing indexes. Production requires HTTPS for secure cookies. Never commit actual credentials or mailbox files.

## Browser account contract

1. `GET /api/auth/session` is anonymous-safe and returns `{user,workspace,csrfToken}`. An absent, expired or revoked cookie returns null identity. Responses are private/non-cacheable. The CSRF token is retained in frontend memory only.
2. Browser JSON mutations include same-origin cookies and `X-CSRF-Token`; the server requires exact `Origin === APP_ORIGIN`. Cookies are HttpOnly, SameSite=Lax and Secure in production. Neither JWTs nor credentials belong in local/session storage.
3. `POST /api/auth/register` accepts `{name,email,password,passwordConfirmation,phone?,preferredLanguage?}` and immediately signs in the owner. `POST /api/auth/login` accepts `{email,password}`. Both retain `{message,data:{user,token}}` for explicit Bearer clients and issue the browser cookie.
4. `POST /api/auth/logout` revokes all current owner tokens, including Bearer tokens, and clears the cookie. Password reset also revokes all owner tokens. Token expiry is seven days; protected requests return 401 when authentication is unavailable. Invalid credentials return 401 with `error.code: INVALID_CREDENTIALS`.

Explicit Bearer clients remain supported. Requests without cookies or browser Origin may register/login directly; protected requests use `Authorization: Bearer ...`. Resource ownership is derived from the current account's Business relationship, never a client-selected business ID.

Email verification and resend are unavailable. User DTOs report `emailVerificationAvailable:false`; registration does not pretend to verify email. Team membership, Google OAuth and billing are under development.

## Workspace mapping

Session `workspace` is null before saving a Business. It then exposes `{id,businessName,industry,locale,reportingTimezone,branchType,primaryBranchId,onboardingStep,branches}`:

- `businessName = Business.name`, `industry = Business.type`, `locale = Business.reportLanguage` (EN/AR), and `reportingTimezone = UTC` because this backend has no configurable timezone field.
- `branchType` derives from `hasMultipleBranches` once an active branch exists. `primaryBranchId` is the oldest active Branch by creation time/ID; no separate persisted primary flag is invented.
- `onboardingStep` is `branches` without an active branch, `welcome` with a branch before completion, or `complete` after `onboardingCompleted`.
- Branch DTOs carry saved name, country, city, address, status, archivedAt and a derived isPrimary flag. No sample branch is returned.

Routes: `PUT /api/onboarding/business {name,type}`, `PUT /api/onboarding/setup {hasMultipleBranches,primaryBranchName?}`, `POST /api/onboarding/complete {}`. Business save retains its Bearer token response and rotates the browser cookie. `GET /api/business` and `/api/branches` use this same persisted scope. Branch creation and archive transactions serialize through the existing Business version counter, preserving at least one active branch under concurrent archives. Archive retains branch documents and history; a failed creation rolls back its branch and business flag together.

## Recovery and feature scope

`POST /api/auth/forgot-password {email}` returns a generic message. `POST /api/auth/verify-reset-token {token}` and `POST /api/auth/reset-password {token,password,passwordConfirmation}` handle hashed, expiring, transactionally single-use reset tokens. `MAIL_MODE=file` in development writes private JSON `{to,subject,html,text}` directly into root `.local/mail`; there is no worker. Reset URLs use `APP_ORIGIN/#/reset?token=...`. Real SMTP requires `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` and provider acceptance testing. File delivery is not inbox delivery.

Authenticated survey/template/question CRUD and publish endpoints are implemented, including `POST /api/surveys/:id/questions` and `GET /api/surveys/summary`. Public response collection, sharing/QR routes and live response analytics remain under development; statistics contain empty counts until collection exists.

Health: `GET /api/health/live`, `GET /api/health/ready`. `pnpm --filter @nuvia/api test` uses an isolated synthetic MongoDB replica set and temporary mailbox; it never reads configured customer database credentials. Set `MONGOMS_SYSTEM_BINARY` to reuse a local MongoDB binary, or the runner downloads one.
