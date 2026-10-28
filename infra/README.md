# Local infrastructure

`compose.yaml` builds the React web and sole `backend/` API, runs a local MongoDB replica set and proxies same-origin `/api` through nginx. `apps/api` and its mail worker are removed. Password-reset file messages are written directly by the API to root `.local/mail`.

Run `pnpm setup:local` and configure `JWT_SECRET` before `docker compose up --build -d`. The compose database selection is explicitly `nuvia_development` in its separate `mongo-data` volume; host Atlas data is never imported. MongoDB is internal to the compose network. The browser origin is loopback HTTP `http://127.0.0.1:5173`; this is development infrastructure, not production deployment.

Use `docker compose config --quiet` for safe validation. Add the independent AI service with `--profile ai`; this base profile starts without model files or a host model mount and reports unavailable capabilities honestly. Stop with `docker compose --profile ai down`; `--volumes` explicitly deletes compose data. Do not delete existing volumes as routine setup. A Docker daemon is required for build/runtime validation. Read the root README for database incompatibility and migration limits.

To use prepared local model artifacts, explicitly include the read-only model override:

```sh
# First prepare .local/models, configure the private service token and set AI_INFERENCE=true.
docker compose -f compose.yaml -f compose.ai-models.yaml --profile ai config --quiet
docker compose -f compose.yaml -f compose.ai-models.yaml --profile ai up --build -d
```

The override uses `AI_MODELS_DIRECTORY` (default `./.local/models`). It refuses
missing host paths and never creates or copies model files. Omit the override
for a fresh checkout or a health-only CI run. Both modes keep models out of
images and preserve the separate MongoDB volume. `pnpm test:infra:config` checks
resolved synthetic configuration using Docker Compose CLI without requiring a
daemon or reading private root environment files; it never prints resolved secrets.
