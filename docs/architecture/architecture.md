# Current architecture

`backend/` is the single public Node/Express/Mongoose API. `apps/api/` has been removed. `apps/web/` is the React/Vite browser client, `packages/shared-types/` contains public contracts only, and `apps/ai-service/` is an independent FastAPI health-only scaffold.

## Runtime ownership

- `backend/app.js` composes Express routes; `backend/server.js` loads root development configuration and starts the database/server. Backend sources are CommonJS `.js`.
- `backend/src/routes`, `controllers`, `services`, `middlewares` and `validations` own public request handling, business behavior and authorization. `backend/src/models` owns Mongoose models.
- Web `app/router` and providers own access and session state. `features/*` owns screens/adapters, with reusable controls/layout/hooks/styles shared by the existing design system.
- Browser requests use same-origin `/api` through Vite/nginx. Cookie sessions require exact Origin and CSRF for mutations; bearer authentication remains for API clients. Credentials never belong in browser storage.
- Registration signs in directly. Verification/resend is unavailable. Password reset uses single-use tokens and development file mail or explicitly configured SMTP; there is no separate mail worker.
- Surveys/questions/templates have backend endpoints, including survey publishing state. Public response collection, live analytics and frontend completion remain under development.
- FastAPI reports `analysis_available: false`; no browser-to-MongoDB, browser-to-AI or Node-to-AI analysis flow is implemented.

## Configuration and data

Process environment overrides root `.env` during development; production reads process environment. Require a private MongoDB URI, explicit database selection and a strong `JWT_SECRET`. Legacy private credential files from the removed API are not loaded automatically. Startup/operations must not silently switch databases.

The backend uses ObjectId models for business owners, businesses, branches, surveys, questions, options and password resets. The removed API's UUID account/workspace collections are **not migrated or automatically compatible**. No records, IDs or databases should be deleted as part of this switch. See [models](mongodb-models.md).

`pnpm dev` owns web/backend only. Root scripts own additive index setup and read-only connectivity checks. Compose owns a separate local replica-set volume, never an Atlas import. Root `.local/` remains ignored private runtime space. See [API](../api/README.md), [backend operations](../development/backend.md) and [module boundaries](../development/module-boundaries.md).
