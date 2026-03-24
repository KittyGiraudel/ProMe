'use client'

import { App } from 'antd'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { createCharacterFromIdentity } from '@/lib/character/createFromIdentity'
import { getCharacterStore } from '@/lib/character/store'
import type { Archetype } from '@/lib/character/types'
import type { Gender } from '@/lib/types'
import { copy } from '@/messages/fr'

export type CharacterCreateValues = {
  name: string
  archetype: Archetype
  gender?: Gender
}

export function useCharacterCreate() {
  const { message } = App.useApp()
  const router = useRouter()
  const store = useMemo(() => getCharacterStore(), [])

  const handleCreate = (values: CharacterCreateValues) => {
    const created = createCharacterFromIdentity(values)
    const saved = store.save(created)
    message.success(copy.characters.createSuccess)
    router.push(`/characters/${saved.id}`)
  }

  return { handleCreate }
}
