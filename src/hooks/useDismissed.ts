'use client'

import { useEffect, useState } from 'react'

function getLocalStorage(): Storage | null {
  if (typeof globalThis === 'undefined' || !('localStorage' in globalThis)) {
    return null
  }
  return globalThis.localStorage
}

export function useDismissed(key: string): [boolean, () => void] {
  const storageKey = `prome:dismissed:${key}`
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    setDismissed(getLocalStorage()?.getItem(storageKey) != null)
  }, [storageKey])

  const dismiss = () => {
    getLocalStorage()?.setItem(storageKey, '1')
    setDismissed(true)
  }

  return [dismissed, dismiss]
}
