import { getAllTrackPaths, type SoundVariant } from './catalog'

export const SOUNDTRACK_CACHE_NAME = 'prome-sounds-v1'

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
