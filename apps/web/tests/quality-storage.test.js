import { describe, it, expect } from 'vitest';
import { createSafeStorage, STORAGE_VERSION } from '../src/lib/storage.js';
function backing() {
  const map = new Map();
  return {
    get length() {
      return map.size;
    },
    key: (i) => [...map.keys()][i] ?? null,
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => map.set(k, v),
    removeItem: (k) => map.delete(k),
  };
}
describe('versioned safe storage', () => {
  it('round-trips strings and enumerates logical keys', () => {
    const native = backing();
    const s = createSafeStorage(() => native);
    s.setItem('draft', 'hello');
    expect(s.getItem('draft')).toBe('hello');
    expect(s.length).toBe(1);
    expect(s.key(0)).toBe('draft');
    s.removeItem('draft');
    expect(s.getItem('draft')).toBeNull();
  });
  it('ignores older unversioned drafts', () => {
    const n = backing();
    n.setItem('draft', 'obsolete');
    expect(createSafeStorage(() => n).getItem('draft')).toBeNull();
  });
  it.each([
    'broken',
    JSON.stringify({ version: STORAGE_VERSION - 1, value: 'old' }),
    JSON.stringify({ version: STORAGE_VERSION, value: { bad: true } }),
  ])('rejects malformed stored data %s', (value) => {
    const n = backing();
    n.setItem(`nuvia:v${STORAGE_VERSION}:draft`, value);
    expect(createSafeStorage(() => n).getItem('draft')).toBeNull();
  });
  it('works in memory when storage access is blocked', () => {
    const s = createSafeStorage(() => {
      throw new Error('blocked');
    });
    s.setItem('draft', 'a');
    expect(s.getItem('draft')).toBe('a');
    expect(s.length).toBe(1);
    s.removeItem('draft');
    expect(s.getItem('draft')).toBeNull();
  });
  it('keeps edits when quota is exhausted', () => {
    const n = backing();
    n.setItem = () => {
      throw new Error('quota');
    };
    const s = createSafeStorage(() => n);
    s.setItem('draft', 'a');
    expect(s.getItem('draft')).toBe('a');
  });
});
