# Current architecture

NUVIA is a JavaScript/Python monorepo. Node owns the public product API and MongoDB persistence. React uses that API on one browser origin. FastAPI is currently a separate **health-only scaffold**, not an analysis backend.

## Application boundaries

| Owner                      | Path                       | Implemented responsibility                                                                                                         |
| -------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Web                        | `apps/web`                 | React/Vite, hash routing, auth/setup UI, connected empty workspaces and explicit design previews                                   |
| API                        | `apps/api`                 | Express, protected sessions/CSRF, account recovery, owner-scoped workspace/branch persistence, Mongoose models and mail processing |
| AI scaffold                | `apps/ai-service`          | FastAPI liveness with `analysis_available: false`; no inference, RAG or product integration                                        |
| Public contracts           | `packages/shared-types`    | Shared API prefix/locales and public DTO declarations; no database models or secrets                                               |
| Development infrastructure | `infra` and `compose.yaml` | Optional local replica set, same-origin nginx routing, API/mail/web images and optional AI scaffold                                |

JavaScript/JSX and `.mjs` remain in use. The source layout is ready for deliberate feature growth; there is no TypeScript, Redux, React Router or production deployment migration in this change.

## Web ownership

`src/app/App.jsx` chooses preview mode and composes providers. `app/router` owns route names/access decisions and route orchestration; `features/auth/AuthPage.jsx` owns account-screen markup. `app/providers` owns resolved account/workspace state and product shell state. Feature folders own their screen behavior, API clients and local drafts. `components/ui` and `components/layout` own shared controls, shell geometry and common CSS; `hooks`/`lib` own reusable behavior, transport, assets, localization and formatting.

Account product routes use saved identity/workspace data. `/preview/` is the only owner of synthetic metrics, sample feedback and canned assistant replies. Existing imported design variants are reference/preview code, not implemented product APIs. The shared scale hook preserves the reviewed desktop/mobile geometry.

## API ownership

`src/config` resolves the repository root and private configuration independently of package working directory. `modules/auth`, `modules/workspaces` and `modules/mail` implement existing business behavior. `middleware` contains request security, limits and safe errors. `integrations/mail` owns delivery adapters; `integrations/ai-service` is a documented future boundary. `shared/database` owns connection-scoped Mongoose models and explicit transaction handling.

The `users`, `dashboard` and `ai` module boundary documents are extension guidance, not working CRUD/analytics endpoints. The current User model stays internal to `shared/database/models`; authentication remains responsible for account creation/recovery.

## Connected request flow

1. Browser requests `/api/v1/auth/session` through Vite or nginx on the same origin.
2. Node resolves a protected cookie session and returns safe user/workspace DTOs plus CSRF context.
3. Mutations require matching Origin/CSRF and strict Zod validation.
4. Services use `deps.models`, owner predicates and explicit sessions for transactional changes.
5. Mail intent is encrypted in the outbox; a separate worker dispatches local development mail or configured SMTP.
6. The web resumes saved setup and renders honest empty/unavailable states.

No browser-to-MongoDB or browser-to-AI path exists. Future inference should cross a documented authenticated Node-to-FastAPI contract, with owner-scoped inputs and versioned/evidence-backed outputs.

## Runtime and operational boundaries

- JavaScript packages use pinned pnpm workspaces and each app declares its own dependencies. The root owns shared tooling and cross-app browser tests.
- Python dependencies/lockfile are owned by `apps/ai-service`; Python is optional for existing web/API work.
- Root `.env`, `.local/config`, `.local/mail` and test binaries remain root-relative. Production reads process environment only.
- `pnpm dev` starts and stops its own API/mail/web process group. It does not start MongoDB, switch URIs or kill occupied unrelated ports.
- Optional compose uses a separate development MongoDB volume, localhost-bound HTTP web origin and internal database network. It is not production/CD and does not import Atlas data.
- Existing UUID/ObjectId formats, Mongoose index definitions, DTOs, hashing/encryption and transaction invariants are preserved.

See [public API](../api/README.md), [models](mongodb-models.md), [developer workflow](../development/monorepo.md), [module boundaries](../development/module-boundaries.md) and [validation evidence](../development/backend-validation.md). Earlier proposals are explicitly [archived](../archive/README.md).
