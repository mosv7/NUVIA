import { defineSchema, text, date, locale, positiveInteger } from './schema.mjs';

export const userSchema = defineSchema('users', {
  name: { ...text, maxlength: 120 },
  email: { ...text, maxlength: 254 },
  locale,
  passwordHash: text,
  credentialsVersion: positiveInteger,
  verifiedAt: Date,
  termsAcceptedAt: date,
  createdAt: date,
  updatedAt: date,
});
userSchema.index({ email: 1 }, { unique: true });
