import { defineSchema, text, date, locale, reference, positiveInteger } from './schema.mjs';

export const workspaceSchema = defineSchema('workspaces', {
  ownerUserId: reference('User'),
  name: { ...text, maxlength: 120 },
  industry: { ...text, maxlength: 120 },
  locale,
  reportingTimezone: text,
  branchMode: { type: String, enum: ['single', 'multiple'], required: true },
  primaryBranchId: reference('Branch', false),
  onboardingStep: { type: String, enum: ['branches', 'complete'], required: true },
  version: positiveInteger,
  createdAt: date,
  updatedAt: date,
});
workspaceSchema.index({ ownerUserId: 1 }, { unique: true });
