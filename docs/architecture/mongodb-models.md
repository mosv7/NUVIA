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

Model source is authoritative for fields, options and enum values. `backend/src/models/index.js` registers the current models, including Session, EmailChange, CustomerResponse and Counter. `pnpm db:setup` calls additive `createIndexes()`; it does not drop/synchronize indexes or migrate records. Services enforce business ownership; references alone do not provide isolation. Multi-document transactions require Atlas/a replica set.

Old `users`, `sessions`, `auth_tokens`, `workspaces`, mailbox/schema-version records and UUID branches are not automatically compatible. Do not delete them or repoint to another database implicitly. Any migration needs its own reviewed mapping and recovery plan. CustomerResponse stores accepted feedback and waiting/skipped analysis metadata; no automatic AI result or embedding persistence is implemented. Mongoose validates Node writes only; future external writers require a shared storage contract.

### Settings additions

`businessowners` adds private profile/avatar/preferences, email verification state and encrypted TOTP secrets/hashed recovery codes, preserving tokenVersion and existing IDs. `sessions` records ownerId/device metadata, created/last-active/expires/revoked timestamps with an expiresAt TTL index. `emailchanges` has unique ownerId/tokenHash and an expiresAt TTL index. TTL cleanup is asynchronous; reads explicitly filter expiry. Secret/avatar data remain excluded from ordinary owner projections. Index setup remains additive.

### Customer responses and counters

CustomerResponse stores owner-business/survey/branch ObjectId attribution, business-scoped number, submission timestamp/channel/language, normalized answer snapshots, immutable formVersion and full formSnapshot including the resolved branch. Anonymous submissions never store respondent name/email. Written feedback is limited to10,000 characters. Unique indexes cover businessId/number and surveyId/submissionId (only string IDs); additional indexes support scoped counts/history and future analysis lifecycle reads. The analysis fields are reserved storage shape, not evidence of a running worker or assessed results.

Counter has a string `_id` (`feedback:<businessId>`) and atomic sequence. Allocation occurs in the same explicit transaction as response persistence, so failed acceptance does not leave a partial response or counter write. No collection is dropped or existing ID rewritten; index installation remains additive. Response acceptance and relevant survey/question/branch mutations serialize through the existing Business version counter.
