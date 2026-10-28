# Module boundaries

| Owner                                           | Responsibility                                                                                   |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Web `app/router`, providers                     | Route access, cookie-session/workspace context and shared shell state                            |
| Web `features/*`                                | Feature screens, adapters and drafts; honest unavailable states                                  |
| Web controls/layout/hooks/lib/styles            | Reused UI, geometry, transport and localization                                                  |
| `backend/app.js`, `server.js`                   | Sole product API composition, configuration and startup                                          |
| `backend/src/routes`, `controllers`, `services` | Auth, onboarding, business, branches and survey behavior                                         |
| `backend/src/middlewares`, `validations`        | Authentication, owner/role boundaries, Origin/CSRF and input checks                              |
| `backend/src/models`                            | MongoDB models/indexes; no browser imports                                                       |
| `packages/shared-types`                         | Public constants/DTOs only; no secrets or persistence models                                     |
| `apps/ai-service`                               | Authenticated local inference contracts, model adapters/assessment; no MongoDB or browser access |
| Root scripts/tests and `infra`                  | Development lifecycle, additive index checks, isolated cross-app checks and optional containers  |

The former `apps/api` is removed. Do not recreate a parallel backend or duplicate session logic in the browser. Models and ObjectId references in `backend/` are not a migration contract for old UUID account/workspace data. Preserve owner predicates and transaction sessions in multi-document operations.

Existing product routes show account-backed data; sample analytics, feedback and assistant responses stay under `/preview/`. Backend survey endpoints do not authorize expanding unfinished frontend, collection or AI scope. Before new flows, define authorization, request/response and loading/error/empty behavior.
