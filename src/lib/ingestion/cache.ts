interface CacheEntry<T> {
  expiresAt: number;
  value: T;
}

const cache = new Map<string, CacheEntry<unknown>>();

export function getCachedValue<T>(key: string) {
  const entry = cache.get(key) as CacheEntry<T> | undefined;

  if (!entry) return null;
  if (entry.expiresAt < Date.now()) {
    cache.delete(key);
    return null;
  }

  return entry.value;
}

export function setCachedValue<T>(key: string, value: T, ttlMs: number) {
  cache.set(key, {
    expiresAt: Date.now() + ttlMs,
    value,
  });
}

export function cacheKey(parts: Record<string, string | number | string[]>) {
  return Object.entries(parts)
    .map(([key, value]) => {
      const normalized = Array.isArray(value) ? value.join("|") : String(value);
      return `${key}:${normalized.toLowerCase()}`;
    })
    .sort()
    .join("::");
}
