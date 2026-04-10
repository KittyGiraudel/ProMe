'use client'

import { getCharacterStore } from '@/lib/character/store'
import type { Character } from '@/lib/character/types'
import { type QueryResult, useQuery } from './useQuery'

type UseCharacterQueryOptions = {
  id: string
}

export function useCharacterQuery({
  id,
}: UseCharacterQueryOptions): QueryResult<Character | null> {
  return useQuery(() => Promise.resolve(getCharacterStore().get(id)))
}
