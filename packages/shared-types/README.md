# Public contracts

`@nuvia/shared-types` owns the shared API prefix, supported locales and public response DTO declarations. The web and API import its runtime constants via `workspace:*`; JavaScript editors can reference its `.d.ts` types through JSDoc. This is not a TypeScript application migration.

Do not export Mongoose models, password hashes, session/token digests, encrypted outbox data or server configuration. Zod validates requests and Mongoose validates Node persistence writes; declarations do not perform runtime validation. Update consumers, contracts and integration tests together when the wire format changes.
