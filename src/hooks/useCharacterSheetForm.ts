'use client'

import { Form } from 'antd'
import { useMemo } from 'react'
import { SheetFormValues } from '@/lib/character/toFormValues'
import { useCharacterQuery } from './useCharacterQuery'
import { useCharacterSave } from './useCharacterSave'
import { useCharacterSaveGuard } from './useCharacterSaveGuard'

export function useCharacterSheetForm({
  characterId,
}: {
  characterId: string
}) {
  const [form] = Form.useForm<SheetFormValues>()
  const {
    data: character,
    loading,
    refetch,
  } = useCharacterQuery({ id: characterId })
  const { saveForm, validationErrors } = useCharacterSave({
    character,
    form,
    onSave: refetch,
  })

  useCharacterSaveGuard({ form, character })

  return useMemo(
    () => ({
      form,
      character,
      hydratedFromStore: !loading,
      saveForm,
      validationErrors,
    }),
    [form, character, loading, saveForm, validationErrors]
  )
}
