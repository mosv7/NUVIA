import { createHash } from 'node:crypto';
import { ApiError } from './errors.mjs';
export function createLimiter({ now, maxEntries = 10000 }) {
  const entries = new Map();
  return (key, limit, windowMs, res) => {
    const time = now().getTime();
    for (const [k, v] of entries) if (v.until <= time) entries.delete(k);
    const privateKey = createHash('sha256').update(key).digest('hex');
    let entry = entries.get(privateKey);
    if (!entry) {
      if (entries.size >= maxEntries) {
        res.set('Retry-After', '60');
        throw new ApiError(429, 'RATE_LIMITED');
      }
      entry = { count: 0, until: time + windowMs };
      entries.set(privateKey, entry);
    }
    if (++entry.count > limit) {
      res.set('Retry-After', String(Math.ceil((entry.until - time) / 1000)));
      throw new ApiError(429, 'RATE_LIMITED');
    }
  };
}
