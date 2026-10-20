import { defineSchema, text, date, reference } from './schema.mjs';

export const branchSchema = defineSchema('branches', {
  workspaceId: reference('Workspace'),
  name: { ...text, maxlength: 120 },
  normalizedName: text,
  archivedAt: Date,
  createdAt: date,
  updatedAt: date,
});
branchSchema.index(
  { workspaceId: 1, normalizedName: 1 },
  {
    unique: true,
    partialFilterExpression: { archivedAt: null },
  },
);
