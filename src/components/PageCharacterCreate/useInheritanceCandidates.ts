import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { getCharacterStore } from '@/lib/character/store'
import type { Character } from '@/lib/character/types'

export type InheritanceCandidate = {
  id: string
  label: string
  character: Character
}

export function useInheritanceCandidates() {
  const store = useMemo(() => getCharacterStore(), [])
  const [characters, setCharacters] = useState<Character[]>([])
  const t = useTranslations()

  useEffect(
    function hydrateCharactersFromStorage() {
      setCharacters(store.list())
    },
    [store]
  )

  const candidates: InheritanceCandidate[] = useMemo(
    () =>
      characters.map(character => ({
        id: character.id,
        character,
        label: character.name.trim() || t('characters_list.unnamed'),
      })),
    [characters, t]
  )

  return { candidates }
}
