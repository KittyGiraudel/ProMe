'use client'

import { useCallback, useMemo, useState } from 'react'

function getLocalStorage(): Storage | null {
  if (typeof globalThis === 'undefined' || !('localStorage' in globalThis)) {
    return null
  }
  return globalThis.localStorage
}

export function useDismissed(key: string) {
  const storageKey = `prome:dismissed:${key}`
  const [dismissed, setDismissed] = useState(
    getLocalStorage()?.getItem(storageKey) != null
  )

  const dismiss = useCallback(() => {
    getLocalStorage()?.setItem(storageKey, '1')
    setDismissed(true)
  }, [storageKey])

  return useMemo(() => ({ dismissed, dismiss }), [dismissed, dismiss])
}
