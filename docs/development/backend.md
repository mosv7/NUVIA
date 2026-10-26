# Backend operations

The only product backend is `backend/` (`@nuvia/api`, CommonJS Express/Mongoose). `apps/api` and its mail worker were removed. Root `pnpm dev:api`/`dev:backend` and `start:backend` target this package.

Run root `pnpm setup:local`; this preserves an existing `.env`. Review `MONGODB_URI`, `MONGODB_DATABASE`, `JWT_SECRET`, `APP_ORIGIN`, `HOST` and `PORT` explicitly. A new file gets a random JWT secret and empty URI. Existing secrets/database selection are never rewritten. Process environment overrides root `.env`; production reads environment only. `MONGO_URI`/`MONGODB_DB_NAME` are fallback aliases; removed-API private credential files are not loaded. Keep production secrets outside Git and frontend variables.

`pnpm db:check` requires an Atlas/replica-set database and checks it without application writes. `pnpm db:setup` creates declared backend indexes additively; it does not sync/drop indexes, rewrite IDs or migrate data. Multi-document operations require a replica set. Never use customer/application databases in integration tests.

The old User/Workspace/Session/AuthToken collections and UUID IDs are not automatically compatible with `backend/src/models`. There is no automatic account migration. Check database selection before the new backend writes; preserve old records and plan any migration separately.

Browser sessions use protected cookies and `/api/auth/session`; cookie mutations require exact Origin plus CSRF. API clients can use bearer authentication. Registration signs in directly; email verification/resend is unavailable. Password reset writes private JSON `{text}` to root `.local/mail` in development file mode, without a worker. Follow the matching reset URL locally. SMTP requires explicit provider settings (`SMTP_*`, `MAIL_FROM`) and acceptance testing; file mail does not prove inbox delivery.

`pnpm dev` starts web/backend on default 5173/3001 and stops its own group. Configure `APP_ORIGIN` exactly. Health is `/api/health/live` and `/api/health/ready`. Read [the API](../api/README.md). Backend test scripts use `node --test tests/*.test.js`; root `pnpm test:backend` and `test:backend:unit` invoke them. See the PR for actual validation outcomes.
