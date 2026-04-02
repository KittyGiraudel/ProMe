import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { useCharacters } from '@/hooks/useCharacters'
import type { Character } from '@/lib/character/types'

export type InheritanceCandidate = {
  id: string
  label: string
  character: Character
}

export function useInheritanceCandidates() {
  const characters = useCharacters()
  const t = useTranslations()

  return useMemo<InheritanceCandidate[]>(
    () =>
      characters.map(character => ({
        id: character.id,
        character,
        label: character.name.trim() || t('characters_list.unnamed'),
      })),
    [characters, t]
  )
}
