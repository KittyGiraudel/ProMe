'use client'

import { getCharacterStore } from '@/lib/character/store'
import type { Character } from '@/lib/character/types'
import { type QueryResult, useQuery } from './useQuery'

type UseCharactersQueryOptions = {
  limit?: number
}

export function useCharactersQuery({
  limit = Infinity,
}: UseCharactersQueryOptions = {}): QueryResult<Character[]> {
  return useQuery(() =>
    Promise.resolve(getCharacterStore().list().slice(0, limit))
  )
}
