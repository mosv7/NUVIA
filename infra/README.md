# Local infrastructure

`compose.yaml` is an optional **development** stack. It builds Node/API/mail and a static web bundle served by nginx, initializes a MongoDB 7.0.24 replica set, and optionally starts the health-only FastAPI scaffold with the `ai` profile.

From the root: generate private configuration with `pnpm setup:local`, ensure Docker is running, then use `docker compose up --build -d`. The root mail key is supplied as an environment value; `.dockerignore` excludes private environments, mailbox/data, attachments, dependency folders and generated output from image build contexts. Never print the resolved compose configuration; validate with `docker compose config --quiet`.

- Browser origin: `http://127.0.0.1:5173/`; nginx proxies `/api/` to Node. Browser Origin is preserved for CSRF.
- MongoDB: internal compose network only, replica set `nuvia`, database `nuvia_development`, persisted in `mongo-data`. The root `.env` Atlas URI is deliberately not used. This database is separate from host-local/Atlas data; accounts do not migrate automatically.
- Mail: `MAIL_MODE=file`, with `.local/mail/` bind-mounted on the host. Verification/reset URLs point to the browser origin and remain private.
- AI profile: `docker compose --profile ai up --build -d`, with loopback port 8000 and only `/api/v1/health/live`. Node does not call it yet.
- Stop: `docker compose --profile ai down`. Adding `--volumes` deletes the compose database and should be a deliberate reset only.

This setup uses loopback HTTP and an unauthenticated internal development MongoDB, not production TLS/authentication or CD. Container images currently prioritize reproducible developer setup over production image minimization. Establish production secrets, database auth/access, HTTPS, backups, health/rollback and deployment ownership separately.

The CI container job builds and smoke-tests the stack on an ephemeral runner with a synthetic mail key. Local configuration validation alone does not establish successful image builds or runtime behavior; report daemon/build availability honestly.
