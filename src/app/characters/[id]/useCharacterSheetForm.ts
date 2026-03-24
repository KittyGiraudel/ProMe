'use client'

import { App, Form } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { useUnsavedChangesGuard } from '@/hooks/useUnsavedChangesGuard'
import { getCharacterStore } from '@/lib/character/store'
import type { Character } from '@/lib/character/types'
import { copy } from '@/messages/fr'
import { sheetFormMatchesSavedCharacter, type SheetFormValues } from './characterSheetForm'

export function useCharacterSheetForm({ characterId }: { characterId: string }) {
  const { modal } = App.useApp()
  const [form] = Form.useForm<SheetFormValues>()
  const [character, setCharacter] = useState<Character | null>(null)
  const [hydratedFromStore, setHydratedFromStore] = useState(false)
  const [saveErrors, setSaveErrors] = useState<string[] | null>(null)

  // Avoid hydration mismatches by deferring localStorage/sessionStorage reads to the client.
  useEffect(() => {
    setHydratedFromStore(false)
    void Promise.resolve().then(() => {
      const saved = getCharacterStore().get(characterId)
      setCharacter(saved ?? null)
      setHydratedFromStore(true)
    })
  }, [characterId])

  const confirmUnsavedLeave = useCallback(
    ({ onLeave, onStay }: { onLeave: () => void; onStay: () => void }) => {
      modal.confirm({
        title: copy.characters.unsavedChangesTitle,
        content: copy.characters.unsavedChangesDescription,
        okText: copy.characters.unsavedChangesLeave,
        cancelText: copy.characters.unsavedChangesStay,
        onOk: onLeave,
        onCancel: onStay,
      })
    },
    [modal]
  )

  const isFormDirty = useCallback(() => {
    if (!character) return false
    if (form.isFieldsTouched()) return true
    const values = form.getFieldsValue(true) as SheetFormValues
    return !sheetFormMatchesSavedCharacter(values, character)
  }, [character, form])

  useUnsavedChangesGuard({
    isDirty: isFormDirty,
    confirmLeave: confirmUnsavedLeave,
    resetToken: `${characterId}|${character?.updatedAt ?? ''}`,
  })


  const onSaved = useCallback((saved: Character) => setCharacter(saved), [])

  return {
    form,
    character,
    hydratedFromStore,
    saveErrors,
    setSaveErrors,
    onSaved,
  }
}
