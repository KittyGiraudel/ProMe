'use client'

import { useEffect, useState } from 'react'

export function useModifierKey(): 'Cmd' | 'Ctrl' {
  const [key, setKey] = useState<'Cmd' | 'Ctrl'>('Ctrl')

  useEffect(() => {
    const isMac =
      navigator.platform.startsWith('Mac') || /Mac/.test(navigator.userAgent)
    setKey(isMac ? 'Cmd' : 'Ctrl')
  }, [])

  return key
}
