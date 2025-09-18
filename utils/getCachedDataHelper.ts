import type { NuxtApp } from '#app'

// default ttl = 1 hour = 1 * 60 * 60 * 1000 ms
// if ttl = 0 ms then not using the cache
export function getCachedDataHelper(
  key: string,
  nuxtApp: NuxtApp,
  { ttl }: { ttl: number } = { ttl: 1 * 60 * 60 * 1000 },
) {
  if (!ttl) return null

  const cached = nuxtApp.payload.data[key] || nuxtApp.static.data[key]

  if (!cached) return null

  const isExpired = Date.now() - cached._fetchedAt > ttl

  return isExpired ? null : cached
}
