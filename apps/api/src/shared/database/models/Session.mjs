import { defineSchema, text, date, reference } from './schema.mjs';

export const sessionSchema = defineSchema('sessions', {
  digest: text,
  csrfDigest: text,
  userId: reference('User', false),
  credentialsVersion: {
    type: Number,
    min: 1,
    validate: (value) => value == null || Number.isInteger(value),
  },
  createdAt: date,
  expiresAt: date,
  revokedAt: Date,
});
sessionSchema.index({ digest: 1 }, { unique: true });
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
sessionSchema.index({ userId: 1 });
