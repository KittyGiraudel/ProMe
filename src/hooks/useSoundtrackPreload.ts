'use client'

import { useEffect, useState } from 'react'
import { preloadSoundtracksForVariant } from '@/lib/sounds/cachePreload'
import type { SoundVariant } from '@/lib/sounds/catalog'

export type SoundtrackPreloadStatus = 'idle' | 'loading' | 'ready'

/**
 * Preloads all biome soundtrack files for the given variant into the Cache API
 * when `enabled` is true. No-op when disabled or when Cache API is missing.
 */
export function useSoundtrackPreload({
  enabled,
  variant,
}: {
  enabled: boolean
  variant: SoundVariant
}): SoundtrackPreloadStatus {
  const loadKey = `${variant}`
  const [resolvedKey, setResolvedKey] = useState<string | null>(null)

  useEffect(
    function preloadRelevantVariant() {
      if (!enabled || typeof caches === 'undefined') return
      preloadSoundtracksForVariant(variant).finally(() =>
        setResolvedKey(loadKey)
      )
    },
    [enabled, variant, loadKey]
  )

  if (!enabled) return 'idle'
  if (typeof caches === 'undefined') return 'ready'
  if (resolvedKey === loadKey) return 'ready'
  return 'loading'
}
