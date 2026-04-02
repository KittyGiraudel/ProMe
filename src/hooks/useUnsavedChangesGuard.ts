'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useNavigationBlocker } from '@/components/AppProviders/NavigationBlockerContext'

type AttemptLeave = (onLeave: () => void, onStay?: () => void) => void

type UseUnsavedChangesGuardOptions = {
  isDirty: () => boolean
  confirmLeave: (args: { onLeave: () => void; onStay: () => void }) => void
}

export function useUnsavedChangesGuard({
  isDirty,
  confirmLeave,
}: UseUnsavedChangesGuardOptions) {
  const { setHandler } = useNavigationBlocker()
  const leaveConfirmingRef = useRef(false)

  const attemptLeave = useCallback<AttemptLeave>(
    (onLeave, onStay) => {
      const hasUnsavedChanges = isDirty()
      if (!hasUnsavedChanges) {
        onLeave()
        return
      }

      if (leaveConfirmingRef.current) return
      leaveConfirmingRef.current = true

      confirmLeave({
        onLeave: () => {
          leaveConfirmingRef.current = false
          onLeave()
        },
        onStay: () => {
          leaveConfirmingRef.current = false
          onStay?.()
        },
      })
    },
    [confirmLeave, isDirty]
  )

  useEffect(
    function registerLeaveGuard() {
      setHandler(() => (navigate: () => void) => {
        attemptLeave(navigate)
      })
      return () => setHandler(null)
    },
    [attemptLeave, setHandler]
  )

  useEffect(
    function registerUnloadGuard() {
      const onBeforeUnload = (e: BeforeUnloadEvent) => {
        if (!isDirty()) return
        e.preventDefault()
        e.returnValue = ''
      }

      window.addEventListener('beforeunload', onBeforeUnload)
      return () => window.removeEventListener('beforeunload', onBeforeUnload)
    },
    [isDirty]
  )
}
