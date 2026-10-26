# Local infrastructure

`compose.yaml` builds the React web and sole `backend/` API, runs a local MongoDB replica set and proxies same-origin `/api` through nginx. `apps/api` and its mail worker are removed. Password-reset file messages are written directly by the API to root `.local/mail`.

Run `pnpm setup:local` and configure `JWT_SECRET` before `docker compose up --build -d`. The compose database selection is explicitly `nuvia_development` in its separate `mongo-data` volume; host Atlas data is never imported. MongoDB is internal to the compose network. The browser origin is loopback HTTP `http://127.0.0.1:5173`; this is development infrastructure, not production deployment.

Use `docker compose config --quiet` for safe validation. Add the independent AI health scaffold with `--profile ai`. Stop with `docker compose --profile ai down`; `--volumes` explicitly deletes compose data. Do not delete existing volumes as routine setup. A Docker daemon is required for build/runtime validation. Read the root README for database incompatibility and migration limits.
