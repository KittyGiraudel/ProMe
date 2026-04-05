'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { preloadSoundtracksForVariant } from '@/lib/sounds/cachePreload'
import type { SoundVariant } from '@/lib/sounds/catalog'

export type SoundtrackPreloadState = {
  isPreloading: boolean
  preloadError: string | null
  retryPreload: () => void
}

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
}): SoundtrackPreloadState {
  const [isPreloading, setIsPreloading] = useState(false)
  const [preloadError, setPreloadError] = useState<string | null>(null)
  const [preloadAttempt, setPreloadAttempt] = useState(0)

  useEffect(() => {
    if (!enabled) return setIsPreloading(false)
    if (typeof caches === 'undefined') return setIsPreloading(false)

    let cancelled = false
    setIsPreloading(true)
    setPreloadError(null)

    void preloadSoundtracksForVariant(variant)
      .catch(err => {
        if (!cancelled) setPreloadError(String(err))
      })
      .finally(() => {
        if (!cancelled) setIsPreloading(false)
      })

    return () => {
      cancelled = true
    }
  }, [enabled, variant, preloadAttempt])

  const retryPreload = useCallback(() => {
    setPreloadError(null)
    setPreloadAttempt(n => n + 1)
  }, [])

  return useMemo(
    () => ({ isPreloading, preloadError, retryPreload }),
    [isPreloading, preloadError, retryPreload]
  )
}
