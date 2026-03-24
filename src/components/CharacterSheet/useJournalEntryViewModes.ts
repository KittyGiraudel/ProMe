'use client'

import { useState } from 'react'

export function useJournalEntryViewModes() {
  const [editingByFieldKey, setEditingByFieldKey] = useState<Record<number, boolean>>({})

  const setEditingMode = (fieldKey: number, isEditing: boolean) => {
    setEditingByFieldKey(previous => ({
      ...previous,
      [fieldKey]: isEditing,
    }))
  }

  const isEditing = (fieldKey: number) => Boolean(editingByFieldKey[fieldKey])

  return {
    isEditing,
    setEditingMode,
  }
}
