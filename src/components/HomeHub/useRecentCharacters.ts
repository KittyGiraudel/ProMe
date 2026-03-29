import { useEffect, useMemo, useState } from 'react'
import { getCharacterStore } from '@/lib/character/store'
import { Character } from '@/lib/character/types'

export const useRecentCharacters = () => {
  const store = useMemo(() => getCharacterStore(), [])
  const [recentCharacters, setRecentCharacters] = useState<Character[]>([])

  useEffect(
    () =>
      setRecentCharacters(
        [...store.list()]
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
          .slice(0, 3)
      ),
    [store]
  )

  return recentCharacters
}
