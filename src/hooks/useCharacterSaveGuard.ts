import { App, FormInstance } from 'antd'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'
import { SheetFormValues, toFormValues } from '@/lib/character/toFormValues'
import { Character } from '@/lib/character/types'
import { useUnsavedChangesGuard } from './useUnsavedChangesGuard'

export function useCharacterSaveGuard({
  form,
  character,
}: {
  form: FormInstance
  character: Character | null
}) {
  const { modal } = App.useApp()
  const t = useTranslations()

  const confirmUnsavedLeave = useCallback(
    ({ onLeave, onStay }: { onLeave: VoidFunction; onStay: VoidFunction }) => {
      modal.confirm({
        title: t('common.unsaved_changes_warning.title'),
        content: t('common.unsaved_changes_warning.description'),
        okText: t('common.unsaved_changes_warning.leave'),
        cancelText: t('common.unsaved_changes_warning.stay'),
        onOk: onLeave,
        onCancel: onStay,
      })
    },
    [modal, t]
  )

  const isFormDirty = useCallback(() => {
    if (!character) return false
    // We don't short-circuit on form.isFieldsTouched() here: since we sync form
    // values via setFieldsValue (rather than remounting the form), the touched
    // state isn't cleared after saving and would produce false positives. The
    // value comparison is the reliable source of truth.
    const values = form.getFieldsValue(true) as SheetFormValues
    return !sheetFormMatchesSavedCharacter(values, character)
  }, [character, form])

  useUnsavedChangesGuard({
    isDirty: isFormDirty,
    confirmLeave: confirmUnsavedLeave,
  })
}

/** Compares live form values to the last saved character (for guards; not tied
 * to Ant Design "touched"). Key-order-insensitive to handle Ant Design
 * Form.List reconstructing objects in field-registration order. */
function sheetFormMatchesSavedCharacter(
  values: SheetFormValues,
  saved: Character
): boolean {
  return stableStringify(values) === stableStringify(toFormValues(saved))
}

function stableStringify(value: unknown): string {
  return JSON.stringify(value, (_, v) => {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      return Object.keys(v)
        .sort()
        .reduce<Record<string, unknown>>((o, k) => {
          o[k] = (v as Record<string, unknown>)[k]
          return o
        }, {})
    }
    return v
  })
}
