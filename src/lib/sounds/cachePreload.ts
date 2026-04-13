import { getAllTrackPaths, type SoundVariant } from './catalog'

// Must match the cache name used by Serwist's defaultCache audio strategy so
// that the service worker's CacheFirst handler finds preloaded files instead of
// re-fetching them from the network on first play.
export const SOUNDTRACK_CACHE_NAME = 'static-audio-assets'

/**
 * Ensures every track for `variant` is stored in the Cache API (fetch + put if missing).
 */
export async function preloadSoundtracksForVariant(
  variant: SoundVariant
): Promise<void> {
  if (typeof caches === 'undefined') {
    throw new Error('Cache API is not available')
  }

  const cache = await caches.open(SOUNDTRACK_CACHE_NAME)
  const paths = getAllTrackPaths(variant)

  await Promise.all(
    paths.map(async path => {
      if (await cache.match(path)) return
      const response = await fetch(path)
      if (!response.ok) throw new Error(`Failed to fetch ${path}`)
      await cache.put(path, response)
    })
  )
}
