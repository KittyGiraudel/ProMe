import { FormInstance } from 'antd'
import { useCallback } from 'react'
import type {
  Archetype,
  Character,
  CharacterMapState,
  InventoryItem,
  JournalEntry,
  SpellEntry,
  StatPool,
} from '@/lib/character/types'
import type { Gender } from '@/lib/types'

export const useCharacterFromForm = ({
  character,
  form,
}: {
  character: Character | null
  form: FormInstance
}) => {
  const getCharacterFromForm = useCallback((): Character => {
    if (!character) throw new Error('Character not loaded')
    const values = form.getFieldsValue(true) as SheetFormValues
    return { ...character, ...values }
  }, [character, form])

  return getCharacterFromForm
}

export type SheetFormValues = {
  name: string
  archetype: Archetype
  gender?: Gender
  honor: number
  inspiration: number
  money: number
  health: StatPool
  courage: StatPool
  stamina: StatPool
  clock: number
  map: CharacterMapState
  inventory: InventoryItem[]
  spellbook: SpellEntry[]
  journalEntries: JournalEntry[]
}

export function toFormValues(pc: Character): SheetFormValues {
  return {
    name: pc.name,
    archetype: pc.archetype,
    gender: pc.gender,
    honor: pc.honor,
    inspiration: pc.inspiration,
    money: pc.money,
    health: pc.health,
    courage: pc.courage,
    stamina: pc.stamina,
    clock: pc.clock,
    map: pc.map,
    inventory: pc.inventory,
    spellbook: pc.spellbook,
    journalEntries: pc.journalEntries,
  }
}
