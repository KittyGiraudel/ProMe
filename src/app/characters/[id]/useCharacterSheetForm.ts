'use client'

import { App, Form } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { useUnsavedChangesGuard } from '@/hooks/useUnsavedChangesGuard'
import { getCharacterStore } from '@/lib/character/store'
import type { Character } from '@/lib/character/types'
import { copy } from '@/messages/fr'
import type { SheetFormValues } from './characterSheetForm'

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

  const isFormDirty = useCallback(() => form.isFieldsTouched(), [form])
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

  useUnsavedChangesGuard({
    isDirty: isFormDirty,
    confirmLeave: confirmUnsavedLeave,
    resetToken: `${characterId}|${character?.updatedAt ?? ''}`,
  })

  const getCharacterFromForm = useCallback((): Character => {
    if (!character) {
      throw new Error('Character not loaded')
    }
    const values = form.getFieldsValue(true) as SheetFormValues
    return { ...character, ...values }
  }, [character, form])

  const onSaved = useCallback((saved: Character) => setCharacter(saved), [])

  return {
    form,
    character,
    hydratedFromStore,
    saveErrors,
    setSaveErrors,
    getCharacterFromForm,
    onSaved,
  }
}
