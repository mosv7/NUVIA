import { z } from 'zod';
import { SUPPORTED_LOCALES } from '@nuvia/shared-types';
import { ApiError } from '../middleware/errors.mjs';
export const email = z.string().trim().toLowerCase().email().max(254);
export const password = z
  .string()
  .min(8)
  .max(128)
  .regex(/[A-Za-z]/)
  .regex(/\d/);
export const locale = z.enum(SUPPORTED_LOCALES);
export const name = z.string().trim().min(1).max(120);
export const token = z.string().regex(/^[a-f0-9]{64}$/);
export function parse(schema, value) {
  const result = schema.safeParse(value);
  if (!result.success)
    throw new ApiError(
      422,
      'VALIDATION_ERROR',
      result.error.issues.map((issue) => ({ field: issue.path.join('.'), reason: issue.code })),
    );
  return result.data;
}
export function uuid(value) {
  return parse(z.uuid(), value);
}
export { z };
