'use client'

import { Form, FormProps } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePathname } from '@/i18n/navigation'
import { normalizeClock } from '@/lib/character/clock'
import { getCharacterStore } from '@/lib/character/store'
import { SheetFormValues } from '@/lib/character/toFormValues'
import type { Character } from '@/lib/character/types'
import { useCharacterSave } from './useCharacterSave'
import { useCharacterSaveGuard } from './useCharacterSaveGuard'
import { useWatchedClock } from './useCharacterSheetDerived'
import { tabKeyFromPathname } from './useCharacterSheetDocumentTitle'
import { useOnFieldsChanged } from './useOnFieldsChanged'

export function useCharacterSheetForm({
  characterId,
}: {
  characterId: string
}) {
  const [form] = Form.useForm<SheetFormValues>()
  const [character, setCharacter] = useState<Character | null>(null)
  const [hydratedFromStore, setHydratedFromStore] = useState(false)
  const pathname = usePathname()
  const activeTab = tabKeyFromPathname(pathname)
  const { saveForm, validationErrors } = useCharacterSave({
    character,
    form,
    onSave: setCharacter,
  })

  // Avoid hydration mismatches by deferring localStorage/sessionStorage reads to the client.
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
      activeTab,
      validationErrors,
    }),
    [form, character, hydratedFromStore, saveForm, activeTab, validationErrors]
  )
}
