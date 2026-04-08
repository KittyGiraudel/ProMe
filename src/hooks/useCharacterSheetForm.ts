'use client'

import { Form } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { getCharacterStore } from '@/lib/character/store'
import { SheetFormValues } from '@/lib/character/toFormValues'
import type { Character } from '@/lib/character/types'
import { useCharacterSave } from './useCharacterSave'
import { useCharacterSaveGuard } from './useCharacterSaveGuard'

export function useCharacterSheetForm({
  characterId,
}: {
  characterId: string
}) {
  const [form] = Form.useForm<SheetFormValues>()
  const [character, setCharacter] = useState<Character | null>(null)
  const [hydratedFromStore, setHydratedFromStore] = useState(false)
  const { saveForm, validationErrors } = useCharacterSave({
    character,
    form,
    onSave: setCharacter,
  })

  useEffect(
    function hydrateCharacterFromStorage() {
      void Promise.resolve().then(() => {
        setHydratedFromStore(false)
        const saved = getCharacterStore().get(characterId)
        setCharacter(saved ?? null)
        setHydratedFromStore(true)
      })
    },
    [characterId]
  )

  useCharacterSaveGuard({ form, character })

  return useMemo(
    () => ({
      form,
      character,
      hydratedFromStore,
      saveForm,
      validationErrors,
    }),
    [form, character, hydratedFromStore, saveForm, validationErrors]
  )
}
