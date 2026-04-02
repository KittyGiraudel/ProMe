import { useMemo } from 'react'
import { getCharacterStore } from '@/lib/character/store'

export const useCharacters = (limit = Infinity) => {
  return useMemo(() => getCharacterStore().list().slice(0, limit), [limit])
}
