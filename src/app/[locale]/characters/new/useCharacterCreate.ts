'use client'

import { App } from 'antd'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { createCharacterFromIdentity } from '@/lib/character/createFromIdentity'
import { getCharacterStore } from '@/lib/character/store'
import type { Archetype } from '@/lib/character/types'
import type { Gender } from '@/lib/types'
import { characterSheetTabHref } from '@/app/[locale]/characters/[id]/characterSheetRoutes'
import { useTranslations } from 'next-intl'

export type CharacterCreateValues = {
  name: string
  archetype: Archetype
  gender?: Gender
  inheritFromCharacterId?: string
}

export function useCharacterCreate() {
  const { message } = App.useApp()
  const router = useRouter()
  const store = useMemo(() => getCharacterStore(), [])
  const t = useTranslations()

  const handleCreate = (values: CharacterCreateValues) => {
    const source = values.inheritFromCharacterId
      ? store.get(values.inheritFromCharacterId)
      : null

    const created = createCharacterFromIdentity(
      {
        name: values.name,
        archetype: values.archetype,
        gender: values.gender,
      },
      source ?? undefined,
    )
    const saved = store.save(created)
    message.success(t('characters.createSuccess'))
    router.push(characterSheetTabHref(saved.id, 'identity'))
  }

  return { handleCreate }
}
