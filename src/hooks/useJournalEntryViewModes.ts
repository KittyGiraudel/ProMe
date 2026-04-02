'use client'

import { FormListFieldData } from 'antd'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export function useJournalEntryViewModes(fields: FormListFieldData[]) {
  const [editingByFieldKey, setEditingByFieldKey] = useState<
    Record<number, boolean>
  >({})
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

  useEffect(
    function editNewlyAddedEntry() {
      if (fields.length > previousFieldCountRef.current) {
        const latest = fields[fields.length - 1]
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (latest) setEditingMode(latest.key, true)
      }
      previousFieldCountRef.current = fields.length
    },
    [fields, setEditingMode]
  )

  return useMemo(
    () => ({
      isEditing,
      setEditingMode,
    }),
    [isEditing, setEditingMode]
  )
}
