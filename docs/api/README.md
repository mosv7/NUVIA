# Account and workspace API

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

The public DTO declarations and prefix live in `packages/shared-types`. No survey, analysis or team-role endpoints are implemented. See [backend setup](../development/backend.md) for configuration and invariants.
