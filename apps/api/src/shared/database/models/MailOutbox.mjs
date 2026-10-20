import { Schema } from 'mongoose';
import { defineSchema, text, date, reference } from './schema.mjs';

const payloadSchema = new Schema(
  { ciphertext: text, nonce: text, tag: text },
  {
    _id: false,
    strict: 'throw',
  },
);
export const mailOutboxSchema = defineSchema('mail_outbox', {
  userId: reference('User'),
  kind: { type: String, enum: ['verify', 'reset'], required: true },
  tokenDigest: text,
  payload: payloadSchema,
  expiresAt: date,
  status: {
    type: String,
    enum: ['pending', 'sending', 'sent', 'failed', 'expired'],
    required: true,
  },
  attempts: { type: Number, required: true, min: 0, validate: Number.isInteger },
  createdAt: date,
  nextAttemptAt: date,
  leaseId: String,
  leaseUntil: Date,
  sentAt: Date,
  errorCode: { type: String, enum: ['DELIVERY_FAILED'] },
});
mailOutboxSchema.index({ status: 1, nextAttemptAt: 1 });
mailOutboxSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
