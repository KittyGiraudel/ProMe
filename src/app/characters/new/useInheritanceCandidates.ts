import { useEffect, useMemo, useState } from 'react'
import { getCharacterStore } from '@/lib/character/store'
import type { Character } from '@/lib/character/types'
import { copy } from '@/messages/fr'

export type InheritanceCandidate = {
  id: string
  label: string
  character: Character
}

export function useInheritanceCandidates() {
  const store = useMemo(() => getCharacterStore(), [])
  const [characters, setCharacters] = useState<Character[]>([])

  useEffect(() => {
    setCharacters(store.list())
  }, [store])

  const candidates: InheritanceCandidate[] = useMemo(
    () =>
      characters.map(character => ({
        id: character.id,
        character,
        label: character.name.trim() || copy.characters.unnamed,
      })),
    [characters],
  )

  return { candidates }
}
