# Current architecture

`backend/` is the single public Node/Express/Mongoose API. `apps/api/` has been removed. `apps/web/` is the React/Vite browser client, `packages/shared-types/` contains public contracts only, and `apps/ai-service/` is an optional internal FastAPI model service.

## Runtime ownership

- `backend/app.js` composes Express routes; `backend/server.js` loads root development configuration and starts the database/server. Backend sources are CommonJS `.js`.
- `backend/src/routes`, `controllers`, `services`, `middlewares` and `validations` own public request handling, business behavior and authorization. `backend/src/models` owns Mongoose models.
- Web `app/router` and providers own access and session state. `features/*` owns screens/adapters, with reusable controls/layout/hooks/styles shared by the existing design system.
- Browser requests use same-origin `/api` through Vite/nginx. Cookie sessions require exact Origin and CSRF for mutations; bearer authentication remains for API clients. Credentials never belong in browser storage.
- Registration signs in directly. Verification/resend is unavailable. Password reset uses single-use tokens and development file mail or explicitly configured SMTP; there is no separate mail worker.
- Surveys/questions/templates have backend endpoints, including survey publishing state. Public response collection, live analytics and frontend completion remain under development.
- Node `/api/ai` authorizes the current owner/business and calls authenticated FastAPI `/api/v1` operations. Python owns inference and provider adapters, with no MongoDB access or public browser path. A supervised serial child reuses models and enforces timeout/cancellation. Capability contracts are independent of model aliases. Default strict mode gates readiness on assessment; explicit owner-authorized baseline mode enables configured local operations with baseline warnings and quality_accepted=false. Package/hash/dependency/input-format and output/source validation remain mandatory. No UI, stored analytics or RAG is implied. See [AI contract](../api/ai.md) and [measured validation](../development/local-ai-validation.md).

## Configuration and data

Summary generation has operation-specific routing inside Python:
`AI_SUMMARY_PROVIDER=disabled|gemini|groq|ollama`. The default is disabled and a
reviewed provider/model profile is required regardless of baseline mode. Qwen
summaries are comparison-only; `/analyze` remains local DeBERTa. Local baseline
reports, surveys and answers are unchanged. See
[summary providers](../development/summary-providers.md).

Process environment overrides root `.env` during development; production reads process environment. Require a private MongoDB URI, explicit database selection and a strong `JWT_SECRET`. Legacy private credential files from the removed API are not loaded automatically. Startup/operations must not silently switch databases.

The backend uses ObjectId models for business owners, businesses, branches, surveys, questions, options and password resets. The removed API's UUID account/workspace collections are **not migrated or automatically compatible**. No records, IDs or databases should be deleted as part of this switch. See [models](mongodb-models.md).

`pnpm dev` owns web/backend only. Root scripts own additive index setup and read-only connectivity checks. Compose owns a separate local replica-set volume, never an Atlas import. Root `.local/` remains ignored private runtime space. See [API](../api/README.md), [backend operations](../development/backend.md) and [module boundaries](../development/module-boundaries.md).

## Settings and device sessions

Owner settings and encrypted authenticator material remain in BusinessOwner; Session stores owner-scoped expiring/revocable device records; EmailChange holds hashed one-use confirmation tokens with TTL. JWT authentication resolves the active owner/current business, checks credential version and requires an unexpired device session. Browser cookies/CSRF remain canonical. Settings APIs and public survey reads are backend capabilities; full settings/survey UI and response submission are still under development. Browser second-factor sign-in and explicit email-change confirmation reuse the existing auth shell.
