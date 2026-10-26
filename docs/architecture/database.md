# Database ownership

MongoDB is owned by the sole `backend/` Express/Mongoose service. Use Atlas or a local replica set for multi-document transactions. Root operations require a private URI and explicit `MONGODB_DATABASE` (legacy `MONGODB_DB_NAME` fallback).

The [model catalog](mongodb-models.md) describes the current ObjectId business-owner/business/branch/survey/question/option/password-reset models. This replaces the removed `apps/api` runtime, **not its stored data**. Old UUID accounts/workspaces and collections have no automatic migration. Preserve existing databases and verify the selected name before writes.

`pnpm db:check` reads connectivity/replica capability; `pnpm db:setup` adds declared indexes without dropping indexes, deleting records or rewriting IDs. Integration tests use isolated replica sets and synthetic identities. Compose uses a separate local volume and never imports Atlas accounts. Production secrets and `.local` stay outside Git. See [operations](../development/backend.md).
