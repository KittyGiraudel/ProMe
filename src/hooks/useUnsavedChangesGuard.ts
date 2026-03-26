'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useNavigationBlocker } from '@/components/AppProviders/NavigationBlockerContext'

type AttemptLeave = (onLeave: () => void, onStay?: () => void) => void

type UseUnsavedChangesGuardOptions = {
  isDirty: () => boolean
  confirmLeave: (args: { onLeave: () => void; onStay: () => void }) => void
  resetToken: unknown
}

export function useUnsavedChangesGuard({
  isDirty,
  confirmLeave,
  resetToken,
}: UseUnsavedChangesGuardOptions) {
  const { setHandler } = useNavigationBlocker()
  const leaveConfirmingRef = useRef(false)
  const interceptionReadyRef = useRef(false)
  const stableUrlRef = useRef('')
  const stablePathAndQueryRef = useRef('')

  const attemptLeave = useCallback<AttemptLeave>(
    (onLeave, onStay) => {
      const hasUnsavedChanges = interceptionReadyRef.current && isDirty()
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

  useEffect(() => {
    setHandler(() => (navigate: () => void) => {
      attemptLeave(navigate)
    })
    return () => setHandler(null)
  }, [attemptLeave, setHandler])

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!interceptionReadyRef.current) return
      if (!isDirty()) return
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [isDirty])

  // Mark when the form is "settled" so we don't prompt during initial hydration/setup.
  useEffect(() => {
    interceptionReadyRef.current = false
    leaveConfirmingRef.current = false
    stableUrlRef.current =
      window.location.pathname + window.location.search + window.location.hash
    stablePathAndQueryRef.current =
      window.location.pathname + window.location.search
    const t = window.setTimeout(() => {
      interceptionReadyRef.current = true
    }, 0)
    return () => window.clearTimeout(t)
  }, [resetToken])

  useEffect(() => {
    const onPopState = () => {
      if (!interceptionReadyRef.current) return
      if (!isDirty()) return
      if (leaveConfirmingRef.current) return
      const currentPathAndQuery = window.location.pathname + window.location.search
      // Hash-only navigation (permalinks/anchors) should not be blocked.
      if (currentPathAndQuery === stablePathAndQueryRef.current) {
        stableUrlRef.current =
          window.location.pathname + window.location.search + window.location.hash
        return
      }

      attemptLeave(
        () => {
          // Navigation already happened; if user confirms we do nothing.
        },
        () => {
          // Navigation was cancelled; revert URL back.
          history.pushState(null, '', stableUrlRef.current)
        }
      )
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [attemptLeave, isDirty])
}
