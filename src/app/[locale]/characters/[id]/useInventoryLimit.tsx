import { useCharacterContext } from '@/components/CharacterSheet/CharacterContext'
import { StatPool } from '@/lib/character/types'
import { useMemo } from 'react'

export function useInventoryLimit() {
  const { getCharacterValue } = useCharacterContext()
  const stamina = useMemo(() => {
    return getCharacterValue('stamina') as StatPool | undefined
  }, [getCharacterValue])
  const inventoryCap = Math.max(0, stamina?.current ?? 0) * 6
  const inventoryLimit = Math.min(30, inventoryCap)

  return inventoryLimit
}
