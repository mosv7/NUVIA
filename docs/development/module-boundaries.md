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

Summary Gemini/Groq/Ollama adapters also belong in `apps/ai-service`.
Private server configuration chooses the provider; Node remains the sole public
authorization boundary. The offline comparison CLI can use local Qwen summaries;
product summary routes cannot. ABSA stays on the local DeBERTa pipeline. Provider
keys never enter local worker settings, responses or assessment reports.

The independently configured Groq answers adapter also belongs in Python. Node
`assistant.service` owns bounded retrieval, privacy redaction, source mapping and
whole-scope metrics; Python receives transient excerpts only. Shared assistant
UI state lives under `features/ai-analysis`; connected source details consume
existing owned feedback reads. See [assistant operation](groq-assistant.md).

`response.service` owns anonymous answer validation and transactional persistence, `publicSurvey.service` owns read availability/customer form shape, and survey/question/branch services coordinate mutations with the shared business transaction helper. Node response persistence and the analysis worker are the only CustomerResponse writers; Counter remains submission-owned. The UI must preserve the GET formVersion until submission and refresh on stale409. The Node analysis worker owns claim/lease/recovery and stored results; it reuses the existing internal AI transport and never treats baseline permission as quality acceptance. Feedback services only read owned stored records or atomically request retries. No Python writer is introduced.
