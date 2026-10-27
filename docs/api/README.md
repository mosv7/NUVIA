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

Publishing persists survey status; **public response collection, complete frontend survey integration, analytics and AI are not delivered by these endpoints**. Survey management CSV is not a feedback/analysis export. The FastAPI scaffold keeps its separate `/api/v1/health/live` path and cannot analyze feedback.

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

Email links use `APP_ORIGIN/#/confirm-email?token=...`; the browser removes the token from the address and requires an explicit confirmation click. Changing sign-in email verifies only the new address, not arbitrary signup addresses. Full settings screens remain under development; the added APIs do not imply complete UI or notification delivery. Public survey reads do not collect responses.
