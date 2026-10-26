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
