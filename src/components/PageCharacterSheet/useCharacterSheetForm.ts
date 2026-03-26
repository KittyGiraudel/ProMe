'use client'

import { useCallback, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { App, Form } from 'antd'
import { getCharacterStore } from '@/lib/character/store'
import type { Character } from '@/lib/character/types'
import { useUnsavedChangesGuard } from '@/hooks/useUnsavedChangesGuard'
import {  toFormValues, type SheetFormValues } from './characterSheetForm'
import { usePathname } from '@/i18n/navigation'
import { tabKeyFromPathname } from './useCharacterSheetDocumentTitle'

export function useCharacterSheetForm({ characterId }: { characterId: string }) {
  const { modal } = App.useApp()
  const t= useTranslations()
  const [form] = Form.useForm<SheetFormValues>()
  const [character, setCharacter] = useState<Character | null>(null)
  const [hydratedFromStore, setHydratedFromStore] = useState(false)
  const [saveErrors, setSaveErrors] = useState<string[] | null>(null)
  const pathname = usePathname()
  const activeTab = tabKeyFromPathname(pathname)

  // Avoid hydration mismatches by deferring localStorage/sessionStorage reads to the client.
  useEffect(() => {
    void Promise.resolve().then(() => {
      setHydratedFromStore(false)
      const saved = getCharacterStore().get(characterId)
      setCharacter(saved ?? null)
      setHydratedFromStore(true)
    })
  }, [characterId])

  const confirmUnsavedLeave = useCallback(
    ({ onLeave, onStay }: { onLeave: () => void; onStay: () => void }) => {
      modal.confirm({
        title: t('characters.unsaved_changes_title'),
        content: t('characters.unsaved_changes_description'),
        okText: t('characters.unsaved_changes_leave'),
        cancelText: t('characters.unsaved_changes_stay'),
        onOk: onLeave,
        onCancel: onStay,
      })
    },
    [modal, t]
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
    activeTab,
  }
}


/** Compares live form values to the last saved character (for guards; not tied
 * to Ant Design "touched"). */
function sheetFormMatchesSavedCharacter(
  values: SheetFormValues,
  saved: Character
): boolean {
  return JSON.stringify(values) === JSON.stringify(toFormValues(saved))
}