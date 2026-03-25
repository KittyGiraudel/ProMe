import { useEffect, useMemo, useState } from 'react'
import { getCharacterStore } from '@/lib/character/store'
import type { Character } from '@/lib/character/types'
import { useLocalize } from '@/app/contexts/LocalizationContext'

export type InheritanceCandidate = {
  id: string
  label: string
  character: Character
}

export function useInheritanceCandidates() {
  const store = useMemo(() => getCharacterStore(), [])
  const [characters, setCharacters] = useState<Character[]>([])
  const localize = useLocalize()

  useEffect(() => {
    setCharacters(store.list())
  }, [store])

  const candidates: InheritanceCandidate[] = useMemo(
    () =>
      characters.map(character => ({
        id: character.id,
        character,
        label: character.name.trim() || localize.string('characters.unnamed'),
      })),
    [characters],
  )

  return { candidates }
}
