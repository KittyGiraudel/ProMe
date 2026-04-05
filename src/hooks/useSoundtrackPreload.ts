'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { preloadSoundtracksForVariant } from '@/lib/sounds/cachePreload'
import type { SoundVariant } from '@/lib/sounds/catalog'

export type SoundtrackPreloadStatus = 'idle' | 'loading' | 'ready' | 'error'

export type SoundtrackPreloadState = {
  status: SoundtrackPreloadStatus
  /** Set when `status` is `'error'`. */
  errorMessage: string | null
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
  const [status, setStatus] = useState<SoundtrackPreloadStatus>(() =>
    enabled ? 'loading' : 'idle'
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [preloadAttempt, setPreloadAttempt] = useState(0)

  useEffect(() => {
    if (!enabled) {
      setStatus('idle')
      setErrorMessage(null)
      return
    }

    if (typeof caches === 'undefined') {
      setStatus('ready')
      setErrorMessage(null)
      return
    }

    let cancelled = false
    setStatus('loading')
    setErrorMessage(null)

    void preloadSoundtracksForVariant(variant)
      .then(() => {
        if (!cancelled) {
          setErrorMessage(null)
          setStatus('ready')
        }
      })
      .catch(err => {
        if (!cancelled) {
          setErrorMessage(String(err))
          setStatus('error')
        }
      })

    return () => {
      cancelled = true
    }
  }, [enabled, variant, preloadAttempt])

  const retryPreload = useCallback(() => {
    setErrorMessage(null)
    setPreloadAttempt(n => n + 1)
  }, [])

  return useMemo(
    () => ({ status, errorMessage, retryPreload }),
    [status, errorMessage, retryPreload]
  )
}
