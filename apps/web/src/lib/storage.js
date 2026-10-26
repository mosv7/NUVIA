export const STORAGE_VERSION = 2;
const prefix = `nuvia:v${STORAGE_VERSION}:`;
// Only preferences and demonstration drafts belong here; never credentials or sessions.
export function createSafeStorage(resolveStorage) {
  const memory = new Map();
  function keys() {
    const found = new Set(memory.keys());
    try {
      const storage = resolveStorage();
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key?.startsWith(prefix)) found.add(key.slice(prefix.length));
      }
    } catch {
      /* Storage can be blocked by browser privacy settings. */
    }
    return [...found];
  }
  return {
    getItem(key) {
      try {
        const raw = resolveStorage().getItem(prefix + key);
        if (raw !== null) {
          const saved = JSON.parse(raw);
          return saved?.version === STORAGE_VERSION && typeof saved.value === 'string'
            ? saved.value
            : null;
        }
      } catch {
        /* Invalid data or denied storage falls back to this session. */
      }
      return memory.get(String(key)) ?? null;
    },
    setItem(key, value) {
      memory.set(String(key), String(value));
      try {
        resolveStorage().setItem(
          prefix + key,
          JSON.stringify({ version: STORAGE_VERSION, value: String(value) }),
        );
      } catch {
        /* Quota exhaustion does not interrupt editing. */
      }
    },
    removeItem(key) {
      memory.delete(String(key));
      try {
        resolveStorage().removeItem(prefix + key);
      } catch {
        /* Best effort. */
      }
    },
    key(index) {
      return keys()[index] ?? null;
    },
    get length() {
      return keys().length;
    },
  };
}
export const safeLocalStorage = createSafeStorage(() => globalThis.localStorage);
export const safeSessionStorage = createSafeStorage(() => globalThis.sessionStorage);
