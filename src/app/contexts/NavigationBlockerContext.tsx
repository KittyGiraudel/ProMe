'use client'

import type { ReactNode } from 'react'
import { createContext, useContext, useState } from 'react'

export type NavigationBlockerHandler = ((navigate: () => void) => void) | null

type NavigationBlockerContextValue = {
  handler: NavigationBlockerHandler
  setHandler: (handler: NavigationBlockerHandler) => void
}

const NavigationBlockerContext = createContext<NavigationBlockerContextValue>({
  handler: null,
  setHandler: () => {},
})

export function NavigationBlockerProvider({
  children,
}: {
  children: ReactNode
}) {
  const [handler, setHandler] = useState<NavigationBlockerHandler>(null)
  return (
    <NavigationBlockerContext.Provider value={{ handler, setHandler }}>
      {children}
    </NavigationBlockerContext.Provider>
  )
}

export function useNavigationBlocker() {
  return useContext(NavigationBlockerContext)
}
