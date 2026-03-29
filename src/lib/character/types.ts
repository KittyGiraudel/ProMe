import type { BiomeId, Gender } from '@/lib/types'

export const CHARACTER_SCHEMA_VERSION = 1 as const

export type Archetype = 'warrior' | 'pilgrim' | 'bard'
export type LifeStatus = 'alive' | 'dead'

export type StatPool = {
  current: number
  max: number
}

export type InventoryItem = {
  id: string
  label: string
  quantity: number
  note?: string
}

export type SpellEntry = {
  id: string
  name: string
  note?: string
}

export type HexCoordinate = {
  q: number
  r: number
}

export type CharacterMapCell = HexCoordinate & {
  biome?: BiomeId
  icon?: string
}

export type CharacterMapState = {
  currentPosition: HexCoordinate
  cells: CharacterMapCell[]
}

export type JournalEntry = {
  id: string
  content: string
  createdAt: string
  updatedAt: string
}

export type Character = {
  id: string
  schemaVersion: typeof CHARACTER_SCHEMA_VERSION
  createdAt: string
  updatedAt: string
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
  lifeStatus: LifeStatus
}

export type CharacterInput = Omit<
  Character,
  'id' | 'createdAt' | 'updatedAt' | 'schemaVersion'
>

export type CharacterImportMode = 'upsert' | 'replace'

export type CharacterImportResult = {
  totalRead: number
  created: number
  updated: number
  discarded: number
}
