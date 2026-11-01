# PR16 response integrity repair implementation plan

> For agentic workers: execute with superpowers:subagent-driven-development, targeted regression tests and independent read-only review.

Goal: retain response collection while preserving all working main contracts and preventing stale-form answers or submissions orphaned by survey lifecycle changes.
Architecture: main remains canonical for auth/security/AI/configuration. Public response collection adds a server-issued form revision and durable answer/form snapshots. Submission and relevant survey/question/branch mutations coordinate through explicit MongoDB transactions and a shared existing-business write lock. No new backend or customer-data migration.
Tech stack: CommonJS Express/Mongoose, React/Vite unchanged, pnpm11.25.0, MongoDB replica-set synthetic tests.
Spec: the verified PR16 findings (stale prompt/branch attribution, orphaned acceptance, restored account contracts) and response/security contracts in docs/api/README.md; latest user AGENTS instructions apply.

## Constraints and decisions

- Preserve sole backend/, current owner-derived scope, cookies/Origin/CSRF, session/version revocation, atomic reset/email proof consumption, TOTP, local file mail, health/business/AI routes and frozen dependency graph.
- Do not access/change configured customer/Atlas databases or model artifacts. All database tests use isolated replica sets.
- Public clients must submit the revision returned by GET; stale forms get a clear409 and must refresh. This endpoint has no released connected frontend consumer to preserve.
- No response-analysis worker is delivered; pending analysis is explicit waiting state.
- Preserve existing question/survey management APIs and legitimate duplicate retries.

## Tasks

- [x] Restore main runtime/configuration contracts and resolve merge conflicts while keeping new response modules and real response statistics.
- [x] Reproduce existing suite failures and add regression coverage for revoked credentials, reset/email proof invalidation and expired challenges.
- [x] Add form revision/snapshot and transactional submission with publication/branch mutation coordination. Tests must reproduce viewed/stored prompt mismatch and close/delete/archive races before passing.
- [x] Cover question types, required/foreign inputs, anonymity, language, duplicate/concurrent submissions, rollback and owner-scoped counts.
- [x] Update API/schema/architecture/setup documentation for delivered behavior; keep incomplete UI/analysis truthful.
- [x] Run local frozen install, format/lint, package tests, proxy/browser flows/build and AI checks; obtain independent final review and fix its confirmed branch-attribution case.

Delivery gate: push the existing PR branch, verify exact-head CI and merge with a head guard. The final PR/GitHub state is the authoritative delivery record.
