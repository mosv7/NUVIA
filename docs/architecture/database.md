# Current database design

The implemented database is MongoDB through connection-scoped Mongoose models, not PostgreSQL. Use Atlas or a local replica set because account/mail/workspace changes use transactions.

The [model catalog](mongodb-models.md) is the maintained field/index map. Executable schemas live in `apps/api/src/shared/database/models/`: User, Session, AuthToken, Workspace, Branch, MailOutbox and SchemaVersion. Account/business IDs remain UUID strings; auth-token IDs remain ObjectIds. Dates are BSON dates and application timestamps remain explicit.

Services enforce owner isolation, primary-branch/archive invariants, token expiry and revocation. Unique indexes prevent duplicate owner workspaces, emails, token/session digests and active normalized branch names. TTL indexes expire sessions/tokens/outbox records eventually; request authorization must still check expiry before TTL cleanup.

Setup checks version 1 and adds declared indexes without dropping existing/custom indexes. Mongoose validates Node writes, not external Python/native writes. No survey/response/analytics/embedding collections or team roles are implemented yet.

The optional compose database is separate from host MongoDB or Atlas; switching a URI does not transfer accounts. Configuration is private and root-relative. Integration tests use isolated database names and synthetic data.

The [original PostgreSQL proposal](../archive/database-proposal.md) remains historical design evidence, not the current schema. See [backend operations](../development/backend.md) for setup and guarantees.
