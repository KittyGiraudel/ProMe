'use client'

import { Form } from 'antd'
import { useMemo } from 'react'
import { SheetFormValues } from '@/lib/character/toFormValues'
import { useCharacterSave } from './useCharacterSave'
import { useCharacterSaveGuard } from './useCharacterSaveGuard'
import { useCharacterQuery } from './useQuery'

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
      loading,
      saveForm,
      validationErrors,
    }),
    [form, character, loading, saveForm, validationErrors]
  )
}
