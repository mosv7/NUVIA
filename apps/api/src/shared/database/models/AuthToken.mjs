import { defineSchema, text, date, reference } from './schema.mjs';

// Existing token upserts use MongoDB ObjectIds; other business IDs remain strings.
export const authTokenSchema = defineSchema(
  'auth_tokens',
  {
    userId: reference('User'),
    purpose: { type: String, enum: ['verify', 'reset'], required: true },
    digest: text,
    expiresAt: date,
    createdAt: date,
  },
  { generatedId: true },
);
authTokenSchema.index({ userId: 1, purpose: 1 }, { unique: true });
authTokenSchema.index({ digest: 1 }, { unique: true });
authTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
