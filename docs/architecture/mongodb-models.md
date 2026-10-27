# Current MongoDB models

Executable schemas live only in `backend/src/models`; Mongoose uses ObjectId IDs/references. Models register against the backend Mongoose connection. The old connection-scoped UUID models from `apps/api` are removed, with no automatic data migration or ID conversion.

| Model            | Main responsibility / declared indexes                                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BusinessOwner`  | Owner identity, password hash, language/status; unique email                                                                                      |
| `Business`       | One business per owner, type/report language, slug and onboarding state; unique ownerId and slug                                                  |
| `Branch`         | Business-scoped name/slug, location, status/archive time; unique business/name and partial business/slug                                          |
| `PasswordReset`  | Email and hashed single-use token, expiry; unique token hash, expiry TTL                                                                          |
| `Survey`         | Business-scoped draft/published survey metadata, languages, branch references and short code; unique shortCode and business/status/update indexes |
| `Question`       | Survey reference, Arabic/English text, type/settings/required/order; survey/order index                                                           |
| `QuestionOption` | Question reference, bilingual labels/order; question reference index                                                                              |

Model source is authoritative for fields, options and enum values. `backend/src/models/index.js` registers these seven models. `pnpm db:setup` calls additive `createIndexes()`; it does not drop/synchronize indexes or migrate records. Services enforce business ownership; references alone do not provide isolation. Multi-document transactions require Atlas/a replica set.

Old `users`, `sessions`, `auth_tokens`, `workspaces`, mailbox/schema-version records and UUID branches are not automatically compatible. Do not delete them or repoint to another database implicitly. Any migration needs its own reviewed mapping and recovery plan. No public feedback-response or AI/embedding persistence is implemented. Mongoose validates Node writes only; future external writers require a shared storage contract.

### Settings additions

`businessowners` adds private profile/avatar/preferences, email verification state and encrypted TOTP secrets/hashed recovery codes, preserving tokenVersion and existing IDs. `sessions` records ownerId/device metadata, created/last-active/expires/revoked timestamps with an expiresAt TTL index. `emailchanges` has unique ownerId/tokenHash and an expiresAt TTL index. TTL cleanup is asynchronous; reads explicitly filter expiry. Secret/avatar data remain excluded from ordinary owner projections. Index setup remains additive.
