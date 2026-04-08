'use client'

import { FormListFieldData } from 'antd'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export function useJournalEntryViewModes(fields: FormListFieldData[]) {
  const [editingByFieldKey, setEditingByFieldKey] = useState<
    Record<number, boolean>
  >({})
  const [floatingFieldKey, setFloatingFieldKey] = useState<number | null>(null)
  const previousFieldCountRef = useRef(fields.length)

  const setEditingMode = useCallback((fieldKey: number, isEditing: boolean) => {
    setEditingByFieldKey(previous => ({
      ...previous,
      [fieldKey]: isEditing,
    }))
  }, [])

  const isEditing = useCallback(
    (fieldKey: number) => Boolean(editingByFieldKey[fieldKey]),
    [editingByFieldKey]
  )

  const setFloatingMode = useCallback((fieldKey: number | null) => {
    setFloatingFieldKey(fieldKey)
  }, [])

  const isFloating = useCallback(
    (fieldKey: number) => floatingFieldKey === fieldKey,
    [floatingFieldKey]
  )

  const anyEditingActive = useMemo(
    () =>
      floatingFieldKey !== null ||
      Object.values(editingByFieldKey).some(Boolean),
    [floatingFieldKey, editingByFieldKey]
  )

  useEffect(
    function editNewlyAddedEntry() {
      if (fields.length > previousFieldCountRef.current) {
        const latest = fields[fields.length - 1]
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (latest) setFloatingMode(latest.key)
      }
      previousFieldCountRef.current = fields.length
    },
    [fields, setFloatingMode]
  )

  return useMemo(
    () => ({
      isEditing,
      setEditingMode,
      isFloating,
      setFloatingMode,
      anyEditingActive,
    }),
    [isEditing, setEditingMode, isFloating, setFloatingMode, anyEditingActive]
  )
}
