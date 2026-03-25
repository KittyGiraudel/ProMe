import { useEffect, useMemo, useState } from 'react'
import { getCharacterStore } from '@/lib/character/store'
import type { Character } from '@/lib/character/types'
import { useTranslations } from 'next-intl'

export type InheritanceCandidate = {
  id: string
  label: string
  character: Character
}

export function useInheritanceCandidates() {
  const store = useMemo(() => getCharacterStore(), [])
  const [characters, setCharacters] = useState<Character[]>([])
  const t = useTranslations()

  useEffect(() => {
    setCharacters(store.list())
  }, [store])

  const candidates: InheritanceCandidate[] = useMemo(
    () =>
      characters.map(character => ({
        id: character.id,
        character,
        label: character.name.trim() || t('characters.unnamed'),
      })),
    [characters, t],
  )

  return { candidates }
}
