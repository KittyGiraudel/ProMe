import type { Gender } from '@/lib/types'

export const CHARACTER_SCHEMA_VERSION = 1 as const

export type Archetype = 'warrior' | 'pilgrim' | 'bard'

export const ARCHETYPES: readonly Archetype[] = [
  'warrior',
  'pilgrim',
  'bard',
] as const

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

export type CharacterClock = {
  position: number
}

export type BiomeId =
  | 'shadowForest'
  | 'floodedPlains'
  | 'mushroomJungle'
  | 'fieldSea'
  | 'silentDesert'
  | 'giganticGardens'

export const BIOME_IDS: readonly BiomeId[] = [
  'shadowForest',
  'floodedPlains',
  'mushroomJungle',
  'fieldSea',
  'silentDesert',
  'giganticGardens',
] as const

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
  clock: CharacterClock
  map: CharacterMapState
  inventory: InventoryItem[]
  spellbook: SpellEntry[]
  notes: string
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
