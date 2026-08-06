// Shared helpers for the CMS mapper layer.
//
// Every mapper follows the same shape: fetch a global or collection document, then map
// each field through these helpers so the returned object is always complete. Components
// assume every field is present, so a mapper must never return a partially-populated
// object.
//
// These helpers previously existed as near-identical copies in each mapper, and the media
// resolvers had drifted between returning `string | null` and `string | undefined`. The
// contract here is `string | undefined`, which composes correctly with `??`.

export type MediaLike = {
  url?: string | null
  alt?: string | null
  filename?: string | null
  updatedAt?: string | null
}

/**
 * Returns `fallback` when the value is absent. An empty or whitespace-only string counts
 * as absent, so a field cleared in the admin panel falls back rather than rendering blank.
 */
export function withFallback<T>(value: T | null | undefined, fallback: T): T {
  if (value === null || value === undefined) return fallback
  if (typeof value === "string" && value.trim() === "") return fallback
  return value
}

/** Returns `fallback` when the array is absent or empty. */
export function mergeArray<T>(value: T[] | null | undefined, fallback: T[]): T[] {
  if (!value || value.length === 0) return fallback
  return value
}

/**
 * Resolves an upload relation to its URL. Returns `undefined` when the relation is
 * unpopulated (a bare id), absent, or carries no usable URL.
 */
export function resolveMediaUrl(media: number | MediaLike | null | undefined): string | undefined {
  if (!media || typeof media === "number") return undefined
  return typeof media.url === "string" && media.url.trim() ? media.url : undefined
}

/** Resolves an upload relation to its alt text, on the same contract as `resolveMediaUrl`. */
export function resolveMediaAlt(media: number | MediaLike | null | undefined): string | undefined {
  if (!media || typeof media === "number") return undefined
  return typeof media.alt === "string" && media.alt.trim() ? media.alt : undefined
}
