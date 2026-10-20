# Explicit Mongoose models for existing collections

Date: 2026-10-21. Supersedes the direct-driver application persistence choice in [0002](0002-node-mongodb-foundation.md); Node.js/Express/MongoDB and the future FastAPI boundary are unchanged.

The team requested discoverable database models and approved moving from the native MongoDB driver to Mongoose. Keeping native services plus a separate schema catalog was an alternative, but Mongoose makes document structure, validation, references and indexes executable in one maintained model layer.

Use connection-scoped models for all seven existing collections. Preserve collection names, UUID business IDs, ObjectId auth-token IDs, BSON dates, DTOs, explicit transaction sessions and application-controlled timestamps. Existing unique/TTL/partial indexes remain additive; do not auto-sync or drop indexes. Keep Zod at the HTTP boundary and use Mongoose validation for model inserts/updates. Do not use model hooks to introduce hidden password/token or workspace behavior.

The migration adds a dependency and Mongoose casting/query semantics, so compatibility is verified with raw legacy fixtures, schema validation, connection isolation, retained indexes, the backend suite and the existing browser account lifecycle. Unknown legacy shapes need explicit review; this change does not claim arbitrary documents become valid or prove real Atlas/SMTP deployment.

See the [model catalog](../architecture/mongodb-models.md) for files, fields and operational constraints. No new survey, AI, role or billing capabilities are added.
