'use client'

import { App } from 'antd'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { useRouter } from '@/i18n/navigation'
import { createCharacterFromIdentity } from '@/lib/character/createFromIdentity'
import { getCharacterStore } from '@/lib/character/store'
import type { Archetype } from '@/lib/character/types'
import type { Gender } from '@/lib/types'
import { useCharacterLink } from '../PageCharacterSheet/useCharacterLink'

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
  const getCharacterLink = useCharacterLink({
    tabId: 'identity',
  })

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
      source ?? undefined
    )
    const saved = store.save(created)
    message.success(t('new_character.create_success'))
    router.push(getCharacterLink({ characterId: saved.id }))
  }

  return { handleCreate }
}
