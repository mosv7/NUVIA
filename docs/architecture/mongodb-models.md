# MongoDB models

The application uses Mongoose 9 for the existing account/workspace storage. Executable schemas and indexes live in `src/backend/models/`. They describe implemented collections, not the future survey/AI proposal.

## Model map

| Model         | Collection        | Source                                                          | Main fields                                                                                                                                        |
| ------------- | ----------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| User          | `users`           | [User.mjs](../../src/backend/models/User.mjs)                   | `_id`, name, email, locale, passwordHash, credentialsVersion, verifiedAt, termsAcceptedAt, createdAt, updatedAt                                    |
| Session       | `sessions`        | [Session.mjs](../../src/backend/models/Session.mjs)             | `_id`, digest, csrfDigest, userId, credentialsVersion, createdAt, expiresAt, revokedAt                                                             |
| AuthToken     | `auth_tokens`     | [AuthToken.mjs](../../src/backend/models/AuthToken.mjs)         | `_id`, userId, purpose (`verify`/`reset`), digest, expiresAt, createdAt                                                                            |
| Workspace     | `workspaces`      | [Workspace.mjs](../../src/backend/models/Workspace.mjs)         | `_id`, ownerUserId, name, industry, locale, reportingTimezone, branchMode, primaryBranchId, onboardingStep, version, createdAt, updatedAt          |
| Branch        | `branches`        | [Branch.mjs](../../src/backend/models/Branch.mjs)               | `_id`, workspaceId, name, normalizedName, archivedAt, createdAt, updatedAt                                                                         |
| MailOutbox    | `mail_outbox`     | [MailOutbox.mjs](../../src/backend/models/MailOutbox.mjs)       | `_id`, userId, kind, tokenDigest, encrypted payload, status, attempts, createdAt, expiresAt, nextAttemptAt, leaseId, leaseUntil, sentAt, errorCode |
| SchemaVersion | `schema_versions` | [SchemaVersion.mjs](../../src/backend/models/SchemaVersion.mjs) | `_id` (`foundation`), version, appliedAt                                                                                                           |

`User` owns one `Workspace`; a workspace has branches and an optional primary branch. Sessions, auth tokens and outgoing authentication messages reference a user. Anonymous CSRF bootstrap sessions have null `userId`/`credentialsVersion`. References are schema metadata, not foreign-key enforcement or automatic population; services enforce owner scope and transactional invariants.

Business/account IDs remain UUID strings. Auth-token IDs remain MongoDB ObjectIds, matching the original upserts; token consumption uses the digest, purpose and expiry. Dates remain BSON dates. Nullable verification/revocation/archive fields preserve their existing meaning. Mail payloads contain ciphertext, nonce and authentication tag; delivered/expired payloads can be unset.

## Connection and query ownership

[database.mjs](../../src/backend/database.mjs) creates a dedicated Mongoose connection. [createModels](../../src/backend/models/index.mjs) registers models on that connection and exposes them as `deps.models`. Models are not registered on the global default connection, so tests and separate databases do not share model bindings.

Authentication, sessions, workspaces, branches and mail use Mongoose model operations. Read queries use `lean()` to retain plain-object service results and the existing DTO boundary. HTTP routes retain Zod input validation; Mongoose adds document and update validation. The shared [schema helper](../../src/backend/models/schema.mjs) rejects unknown fields and enables validators for `updateOne`, `updateMany` and `findOneAndUpdate`. Update validators cover modified supported paths, not a full-document revalidation; service rules remain necessary, including for `$inc` operations.

The underlying MongoDB client remains available for explicit transactions; every transactional model operation receives the session. The native database handle is limited to health commands and test-fixture inspection, not a parallel application persistence path. Password hashing, token hashing, encryption, branch normalization and application timestamps remain in their current services. No persistence hooks silently replace those rules.

## Index and compatibility policy

- Schemas declare the same unique indexes for user email, session/token digests, token user/purpose, workspace owner and active branch names.
- Sessions, tokens and outbox messages retain `expireAfterSeconds: 0` indexes on `expiresAt`. Services still enforce expiry before eventual TTL removal.
- The branch unique index remains partial on `{ archivedAt: null }`, preserving archived names/history.
- `ensureSchema(models)` checks the `foundation` version, calls `createIndexes()` for declared indexes, then records version 1. It never calls `syncIndexes()` or drops indexes. Incompatible indexes/versions still fail for explicit review.
- `autoIndex`, `autoCreate` and query buffering are disabled. Connection/read-only ping does not run schema setup. Startup and `npm run db:setup` explicitly prepare indexes.
- No `__v` field, automatic timestamps, collection renaming, ID conversion or bulk data rewrite is introduced. Valid existing documents remain readable, and supplied legacy UUID/ObjectId fixtures are covered by reconnect/login/reset tests.

Mongoose is application-level enforcement. Writes from MongoDB Compass, another service, or native test fixtures bypass its validators. A future Python/FastAPI writer must share a documented storage contract and validation strategy rather than assume Mongoose validates Python writes.

The upgrade uses the existing MongoDB URI and database name. Run `npm ci`, then the normal database check/setup and three-process startup from [README](../../README.md). No data-copy migration is required for the tested existing shapes. Atlas/SMTP acceptance and deployment backup/restore remain separate from isolated test evidence.
