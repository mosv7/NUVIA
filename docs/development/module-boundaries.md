# Module boundaries

| Owner                                                    | Allowed responsibility                                       | Avoid                                                      |
| -------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------- |
| Web `app/router`                                         | Route names, access decisions and screen orchestration       | New persistence or duplicate feature UI                    |
| Web `app/providers`                                      | Session/workspace and shared shell state                     | Browser storage of passwords/tokens                        |
| Web `features/*`                                         | Feature screens, drafts, API usage and feature styles        | Importing server models or inventing unavailable responses |
| Web `components/ui`, `components/layout`, `hooks`, `lib` | Shared UI/geometry, reusable hooks, transport and formatting | Feature-specific business decisions in generic controls    |
| API `modules/auth`                                       | Account lifecycle and protected sessions                     | User/team CRUD without a permission contract               |
| API `modules/workspaces`                                 | Owner-scoped activity/branch state and invariants            | Client-selected owner scope or destructive history loss    |
| API `modules/mail`                                       | Encrypted outbox and retries                                 | Logging private links or provider credentials              |
| API `middleware`                                         | Origin/CSRF, limits and safe errors                          | Persistence/business rules                                 |
| API `integrations`                                       | Provider/transport adapters                                  | Browser dependencies or implicit data access               |
| API `shared/database`                                    | Connection-scoped Mongoose models and transactions           | Index deletion, ID rewrites or global connection models    |
| `packages/shared-types`                                  | Public DTOs, API prefix and locale constants                 | Mongo schemas, secrets, Node-only dependencies             |
| FastAPI scaffold                                         | Internal liveness and deliberate future analysis layers      | Direct public browser calls or claiming inference exists   |

The current schema location is `apps/api/src/shared/database/models`, with explicit names for the seven existing collections. Services consume `deps.models`; public API DTOs remain separate. Keep hashing/encryption/timestamps explicit in services. Foreign-key-like references do not replace owner predicates or transaction sessions.

Future modules have boundary READMEs instead of fake endpoints. Before implementing a survey, user/team or AI workflow, define its request/response contract, authorization, error/empty/loading behavior and meaningful tests. The [full feature map](../product/feature-list.md) is scope context, not authorization to implement every planned capability.

## Workspace interface modules

`apps/web/src/features/workspace/WorkspacePages.jsx` composes separate Business, Account, Notification, Security, state and dialog modules. `useWorkspaceModel.jsx` owns temporary view state and the connected workspace/branch adapter; it cancels stale reads and mutations on navigation. Unsupported account/settings operations are guarded at the boundary. Shared UI and the existing authenticated providers remain single implementations; the standalone source project is not nested or duplicated inside `apps/web`.

Heavy analytics/report/survey routes and their screens load lazily. Feature CSS is deferred with its route; it is not a separate mobile stylesheet download that must be loaded at login. The large generated feature styles remain to preserve the reviewed design; their size has not been hidden by raising the bundle warning threshold.
