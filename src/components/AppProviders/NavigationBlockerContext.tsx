'use client'

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

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
  const context = useMemo(() => ({ handler, setHandler }), [handler])

  return (
    <NavigationBlockerContext.Provider value={context}>
      {children}
    </NavigationBlockerContext.Provider>
  )
}

export function useNavigationBlocker() {
  return useContext(NavigationBlockerContext)
}
