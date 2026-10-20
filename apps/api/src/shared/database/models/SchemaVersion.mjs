import { defineSchema, date, positiveInteger } from './schema.mjs';

export const schemaVersionSchema = defineSchema('schema_versions', {
  version: positiveInteger,
  appliedAt: date,
});
