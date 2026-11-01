# Product API

The sole backend is `backend/`. Prefix **`/api`**; JSON, ObjectId resource IDs and UTC timestamps. The previous `/api/v1` account/workspace API has been removed; it is not a compatibility route.

Browser auth uses protected cookies. GET `/auth/session` returns `{user,workspace,csrfToken}` with null identity when anonymous; browser mutations send exact `Origin` and `X-CSRF-Token`. Bearer JWT authentication remains available for API clients. Do not store browser tokens/passwords in local storage. Registration signs in directly; email verification/resend is unavailable.

| Method           | Path                                                                       | Purpose                                                                |
| ---------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| GET              | `/auth/session`, `/auth/me`                                                | Session context / authenticated profile                                |
| POST             | `/auth/register`                                                           | `{name,email,password,passwordConfirmation,phone?,preferredLanguage?}` |
| POST             | `/auth/login`, `/auth/logout`                                              | Sign in / revoke browser access                                        |
| POST             | `/auth/forgot-password`                                                    | Generic recovery response for `{email}`                                |
| POST             | `/auth/verify-reset-token`                                                 | Check `{token}`                                                        |
| POST             | `/auth/reset-password`                                                     | `{token,password,passwordConfirmation}`                                |
| GET              | `/onboarding/status`                                                       | Saved onboarding progress                                              |
| PUT              | `/onboarding/business`                                                     | Save `{name,type}` business information                                |
| PUT              | `/onboarding/setup`                                                        | Save `{hasMultipleBranches,primaryBranchName?}`                        |
| POST             | `/onboarding/complete`                                                     | Complete setup                                                         |
| GET/PUT          | `/business`                                                                | Read/edit owner business profile                                       |
| GET              | `/branches/summary`, `/branches`, `/branches/:id`, `/branches/:id/history` | Branch reads and survey history                                        |
| POST             | `/branches`, `/branches/:id/archive`                                       | Create/archive branch                                                  |
| PUT              | `/branches/:id`                                                            | Update branch                                                          |
| GET              | `/survey-templates`                                                        | Available survey templates                                             |
| GET/POST         | `/surveys`                                                                 | List/create survey                                                     |
| GET/PATCH/DELETE | `/surveys/:id`                                                             | Read/edit/delete survey                                                |
| GET              | `/surveys/summary`, `/surveys/export`                                      | Survey management summary/CSV                                          |
| PATCH            | `/surveys/:id/status`                                                      | Change status                                                          |
| POST             | `/surveys/:id/duplicate`, `/surveys/:id/publish`                           | Duplicate / publish validated survey state                             |
| POST             | `/surveys/:id/questions`                                                   | Add a validated survey question                                        |
| PUT              | `/surveys/:id/questions/reorder`                                           | Reorder questions                                                      |
| PATCH/DELETE     | `/surveys/:id/questions/:questionId`                                       | Edit/delete question                                                   |
| POST             | `/surveys/:id/questions/:questionId/duplicate`                             | Duplicate question                                                     |
| GET              | `/health/live`, `/health/ready`                                            | Process / database readiness                                           |

Request validation and business errors follow the backend route/service contracts in `backend/src`. Business/branch/survey resources are scoped through the authenticated owner's business. Role checks are present; a team membership management product is not implemented. Browser adapters translate backend fields into the existing screen model. Public DTO declarations/constants live in `packages/shared-types`.

Publishing persists survey status; **public response collection, complete frontend survey integration and live analytics are not delivered by these endpoints**. Survey management CSV is not a feedback/analysis export. [AI integration APIs](ai.md) now exist under `/api/ai`, with separate authenticated FastAPI transport; supplied capabilities remain unavailable pending acceptance, and no connected AI UI is delivered.

Reset tokens are single-use. Development file mail writes private `{text}` messages directly to root `.local/mail` without a worker. SMTP requires explicit configuration and testing. Old UUID account/workspace data is not automatically migrated into the ObjectId backend. Read [backend operations](../development/backend.md) before choosing a database.

## Settings and security

All `/settings` endpoints require the same owner-scoped cookie or explicit Bearer session. Browser writes, including raw avatar uploads, require the exact Origin and CSRF token. New access tokens require a persisted, unexpired `sid` plus the owner's current `tokenVersion`; pre-session tokens must sign in again. Onboarding retains the originating session, so refreshed tokens cannot bypass device revocation. Logout/global sign-out and password recovery revoke all devices. Password change keeps the calling device by returning a replacement token/cookie and revoking other devices.

| Method         | Path                                       | Body / result                                                                                                 |
| -------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| GET/PATCH      | `/settings/account`                        | `{name?,phone?,country?,jobTitle?}`; country is a two-letter code                                             |
| GET/PUT/DELETE | `/settings/avatar`                         | PUT raw PNG/JPEG, at most 2 MB; owner-only, no shared caching                                                 |
| GET/PUT        | `/settings/language`                       | `{displayLanguage?,region?,timeZone?,dateFormat?,timeFormat?}`; GET includes display-language options         |
| GET/PUT        | `/settings/notifications`                  | Partial `{channels,email,inApp}` preferences; no notification delivery worker is implemented                  |
| GET            | `/settings/security`                       | Email, verification state, password-change date, 2FA and active-device count                                  |
| POST           | `/settings/security/password`              | `{currentPassword,newPassword,confirmPassword}`; new password 12–64 characters with letter, number and symbol |
| POST           | `/settings/security/2fa/setup`             | Returns enrollment secret/URI/QR SVG; no factor enabled yet                                                   |
| POST           | `/settings/security/2fa/enable`            | `{code}`; returns ten recovery codes once                                                                     |
| POST           | `/settings/security/2fa/disable`           | `{password,code}`; code is an authenticator or recovery code                                                  |
| GET            | `/settings/security/sessions`              | Active, unexpired devices and `isCurrent`                                                                     |
| DELETE         | `/settings/security/sessions/:sessionId`   | Revoke another owned device                                                                                   |
| POST           | `/settings/security/sessions/sign-out-all` | Revoke all devices, including caller                                                                          |
| POST           | `/settings/security/email`                 | `{newEmail,currentPassword}`; mail a one-use 24-hour confirmation link                                        |
| GET/DELETE     | `/settings/security/email/pending`         | Read/cancel pending change                                                                                    |
| POST           | `/auth/login/2fa`                          | `{twoFactorToken,code}`; sets session cookie only after successful factor                                     |
| POST           | `/auth/confirm-email`                      | `{token}`; atomically consumes link, changes email and revokes previous credentials                           |
| GET            | `/public/surveys/:shortCode?branch=slug`   | Anonymous read of public survey state/questions; drafts/foreign branches are hidden                           |

When 2FA is enabled, password login returns `{data:{requiresTwoFactor:true,twoFactorToken}}` without an access cookie. The five-minute challenge is bound to the credential version and cannot authenticate protected routes. TOTP follows RFC 6238 (SHA-1, six digits, 30 seconds, one-step skew); each accepted step/recovery code is consumed atomically. Recovery/sign-out invalidate pending login challenges. Keep recovery codes private.

Email links use `APP_ORIGIN/#/confirm-email?token=...`; the browser removes the token from the address and requires an explicit confirmation click. Changing sign-in email verifies only the new address, not arbitrary signup addresses. Full settings screens remain under development; the added APIs do not imply complete UI or notification delivery. Public reads return a form revision for the submission contract below.

## Anonymous customer response submission

`GET /api/public/surveys/:shortCode?branch=slug` returns the existing availability state and, when open, a root `data.formVersion` (64 lowercase hexadecimal characters) plus questions. Preserve that version with the loaded form. Drafts and foreign branches remain hidden; paused/closed/archived forms cannot accept new submissions.

`POST /api/public/surveys/:shortCode/responses` is anonymous, rate-limited and JSON. Browser clients first GET `/api/auth/session` (anonymous identity is valid) to obtain the CSRF cookie/token, then send exact `Origin` and `X-CSRF-Token` with the POST. This does not require account registration. Send:

```json
{
  "formVersion": "<64-character version from GET>",
  "submissionId": "<8-64-character id generated once for this form>",
  "branch": "branch-slug",
  "language": "en",
  "channel": "short_link",
  "answers": [
    { "questionId": "<ObjectId>", "value": "Written feedback" },
    { "questionId": "<ObjectId>", "value": 4 },
    { "questionId": "<ObjectId>", "value": true },
    { "questionId": "<ObjectId>", "optionIds": ["<option ObjectId>"] }
  ]
}
```

`value` is a string for short/long text, an integer from 1 through the configured star maximum for rating, or a boolean for yes/no. Choice/dropdown answers use optionIds belonging to that question; only allowMultiple choice questions accept several options. Required, unknown, duplicate, invalid-type, option and length checks are enforced by the server. At most 50 answer entries and 10,000 written characters are accepted. Branch may be omitted only when one active branch can be resolved. `language`/`channel` are optional en/ar and short_link/qr_code; stored text language uses a character heuristic, not an assessed language model. Optional respondent `{name,email}` is stored only for non-anonymous forms.

A new response returns201; repeating the same survey/submissionId returns200 with the original thank-you message and no new row. Generate a fresh ID for a new form; never reuse one for a different customer submission. Invalid shape/version format returns400, unknown/draft form404, and stale formVersion or closed/unavailable form409. On stale409, reload and show the refreshed form; never silently reinterpret an answer against edited questions.

The server retains the version and complete customer-visible form snapshot, including the resolved branch identity, with each response. Reassigning the only branch invalidates an earlier unqualified form; feedback is never silently moved to the new branch. An existing Business write lock and explicit MongoDB transactions coordinate acceptance with survey/question edits, pause/close/delete and branch changes. Whichever operation commits first determines acceptance; a rejected attempt rolls back its response/counter writes. Old snapshots remain intact after later edits.

CustomerResponse/Counter indexes are additive through the normal database setup. There is no response-analysis worker in this change: written feedback remains `analysis.status=pending`, rating/choice-only feedback is `skipped`. Existing protected `/api/ai` operations do not write these records or automatically drain that pending state. Response collection does not imply a connected feedback dashboard, delivery queue or AI quality acceptance.
