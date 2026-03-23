import type { Gender } from '@/lib/types'

export const PLAYER_CHARACTER_SCHEMA_VERSION = 1 as const

export type PlayerArchetype = 'warrior' | 'pilgrim' | 'bard'

export const PLAYER_ARCHETYPES: readonly PlayerArchetype[] = [
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

export type PlayerCharacter = {
  id: string
  schemaVersion: typeof PLAYER_CHARACTER_SCHEMA_VERSION
  createdAt: string
  updatedAt: string
  name: string
  archetype: PlayerArchetype
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

export type PlayerCharacterInput = Omit<
  PlayerCharacter,
  'id' | 'createdAt' | 'updatedAt' | 'schemaVersion'
>

export type CharacterImportMode = 'upsert' | 'replace'

export type CharacterImportResult = {
  totalRead: number
  created: number
  updated: number
  discarded: number
}
