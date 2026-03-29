import { BIOME_IDS } from '../constants/misc'
import { type BiomeId } from '../types'
import { countClockSegments, normalizeClock } from './clock'
import { normalizeLifeStatus } from './lifeStatus'
import {
  type Archetype,
  CHARACTER_SCHEMA_VERSION,
  type Character,
  type CharacterImportMode,
  type CharacterInput,
  type CharacterMapCell,
  type CharacterMapState,
  HexCoordinate,
  type InventoryItem,
  type JournalEntry,
  type SpellEntry,
  type StatPool,
} from './types'

const MAX_INVENTORY_ITEMS = 30
const MAX_SPELLBOOK_ITEMS = 6
const MAX_MAP_ICON_LENGTH = 1

const DEFAULT_MONEY = 100
export const DEFAULT_MAP_POSITION: HexCoordinate = { q: 0, r: 0 }

function normalizeArchetype(value: unknown, fallback: Archetype): Archetype {
  if (value === 'warrior' || value === 'pilgrim' || value === 'bard')
    return value
  return fallback
}

export function randomId(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function asInt(value: unknown, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback
  return Math.trunc(value)
}

function normalizeStatPool(value: unknown, fallbackMax = 1): StatPool {
  const source = value as Partial<StatPool> | undefined
  const max = Math.max(0, asInt(source?.max, fallbackMax))
  const current = Math.min(max, Math.max(0, asInt(source?.current, max)))
  return { current, max }
}

function normalizeBiome(value: unknown): BiomeId | undefined {
  if (typeof value !== 'string') return undefined
  return (BIOME_IDS as readonly string[]).includes(value)
    ? (value as BiomeId)
    : undefined
}

function normalizeHexCoordinate(
  value: unknown,
  fallback: { q: number; r: number }
): { q: number; r: number } {
  const source = value as Partial<{ q: number; r: number }> | undefined
  return {
    q: asInt(source?.q, fallback.q),
    r: asInt(source?.r, fallback.r),
  }
}

function splitGraphemes(value: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter(undefined, {
      granularity: 'grapheme',
    })
    return Array.from(segmenter.segment(value), part => part.segment)
  }
  return Array.from(value)
}

function normalizeMapIcon(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const icon = value.trim()
  if (!icon) return undefined
  return splitGraphemes(icon).slice(0, MAX_MAP_ICON_LENGTH).join('')
}

function normalizeCharacterMapCell(value: unknown): CharacterMapCell | null {
  const raw = value as Partial<CharacterMapCell> | undefined
  if (!raw || typeof raw !== 'object') return null
  const q = asInt(raw.q, Number.NaN)
  const r = asInt(raw.r, Number.NaN)
  if (!Number.isFinite(q) || !Number.isFinite(r)) return null

  const icon = normalizeMapIcon(raw.icon)
  const biome = normalizeBiome(raw.biome)

  return {
    q,
    r,
    biome,
    icon,
  }
}

export function normalizeCharacterMapState(value: unknown): CharacterMapState {
  const raw = value as Partial<CharacterMapState> | undefined
  const currentPosition = normalizeHexCoordinate(
    raw?.currentPosition,
    DEFAULT_MAP_POSITION
  )

  const byCoord = new Map<string, CharacterMapCell>()
  if (Array.isArray(raw?.cells)) {
    for (const entry of raw.cells) {
      const normalized = normalizeCharacterMapCell(entry)
      if (!normalized) continue
      const atCore =
        normalized.q === DEFAULT_MAP_POSITION.q &&
        normalized.r === DEFAULT_MAP_POSITION.r
      const cell = atCore ? { ...normalized, biome: undefined } : normalized
      byCoord.set(`${cell.q},${cell.r}`, cell)
    }
  }

  return {
    currentPosition,
    cells: Array.from(byCoord.values()),
  }
}

function normalizeInventoryItem(value: unknown): InventoryItem | null {
  const item = value as Partial<InventoryItem> | undefined
  if (!item || typeof item.label !== 'string') return null
  const label = item.label.trim()
  return {
    id: typeof item.id === 'string' && item.id ? item.id : randomId(),
    label,
    quantity: Math.max(1, asInt(item.quantity, 1)),
    note: typeof item.note === 'string' ? item.note : undefined,
  }
}

function normalizeSpellEntry(value: unknown): SpellEntry | null {
  const item = value as Partial<SpellEntry> | undefined
  if (!item || typeof item.name !== 'string') return null
  const name = item.name.trim()
  return {
    id: typeof item.id === 'string' && item.id ? item.id : randomId(),
    name,
    note: typeof item.note === 'string' ? item.note : undefined,
  }
}

function normalizeJournalEntry(value: unknown): JournalEntry | null {
  const item = value as Partial<JournalEntry> | undefined
  if (!item || typeof item !== 'object') return null
  const content = typeof item.content === 'string' ? item.content : ''
  const now = new Date().toISOString()
  return {
    id: typeof item.id === 'string' && item.id ? item.id : randomId(),
    content,
    createdAt:
      typeof item.createdAt === 'string' && item.createdAt
        ? item.createdAt
        : now,
    updatedAt:
      typeof item.updatedAt === 'string' && item.updatedAt
        ? item.updatedAt
        : now,
  }
}

function normalizeJournalEntries(
  source: Partial<CharacterInput> | Partial<Character>
) {
  if (Array.isArray(source.journalEntries)) {
    return source.journalEntries
      .map(normalizeJournalEntry)
      .filter((entry): entry is JournalEntry => entry !== null)
  }

  // Legacy migration path for older payloads that still have a single "notes" string.
  const legacyNotes = (source as { notes?: unknown }).notes
  if (typeof legacyNotes === 'string' && legacyNotes.trim()) {
    const now = new Date().toISOString()
    return [
      {
        id: randomId(),
        content: legacyNotes,
        createdAt: now,
        updatedAt: now,
      },
    ]
  }
  return []
}

function defaultPoolsForArchetype(archetype: Archetype): {
  health: StatPool
  courage: StatPool
  stamina: StatPool
} {
  switch (archetype) {
    case 'warrior':
      return {
        health: { current: 2, max: 2 },
        courage: { current: 4, max: 4 },
        stamina: { current: 3, max: 3 },
      }
    case 'pilgrim':
      return {
        health: { current: 3, max: 3 },
        courage: { current: 2, max: 2 },
        stamina: { current: 4, max: 4 },
      }
    case 'bard':
      return {
        health: { current: 4, max: 4 },
        courage: { current: 3, max: 3 },
        stamina: { current: 2, max: 2 },
      }
    default: {
      const _exhaustive: never = archetype
      return _exhaustive
    }
  }
}

export function getDefaultPoolsForArchetype(archetype: Archetype): {
  health: StatPool
  courage: StatPool
  stamina: StatPool
} {
  return defaultPoolsForArchetype(archetype)
}

export function createDefaultCharacterInput(
  archetype: Archetype = 'warrior'
): CharacterInput {
  const pools = defaultPoolsForArchetype(archetype)
  return {
    name: '',
    archetype,
    gender: undefined,
    honor: 0,
    inspiration: 0,
    money: DEFAULT_MONEY,
    health: pools.health,
    courage: pools.courage,
    stamina: pools.stamina,
    clock: 0,
    map: {
      currentPosition: DEFAULT_MAP_POSITION,
      cells: [],
    },
    inventory: [],
    spellbook: [],
    journalEntries: [],
    lifeStatus: 'alive',
  }
}

export function normalizeCharacterInput(
  input: Partial<CharacterInput> | null | undefined
): CharacterInput {
  const fallbackArchetype: Archetype = 'warrior'
  const baseArchetype = normalizeArchetype(input?.archetype, fallbackArchetype)
  const base = createDefaultCharacterInput(baseArchetype)
  const source = input ?? {}
  const inventory = Array.isArray(source.inventory)
    ? source.inventory
        .map(normalizeInventoryItem)
        .filter((item): item is InventoryItem => item !== null)
        .slice(0, MAX_INVENTORY_ITEMS)
    : base.inventory

  const spellbook = Array.isArray(source.spellbook)
    ? source.spellbook
        .map(normalizeSpellEntry)
        .filter((item): item is SpellEntry => item !== null)
        .slice(0, MAX_SPELLBOOK_ITEMS)
    : base.spellbook

  const stamina = normalizeStatPool(source.stamina, base.stamina.max)
  const map = normalizeCharacterMapState(source.map)
  const journalEntries = normalizeJournalEntries(source)

  return {
    name: typeof source.name === 'string' ? source.name : base.name,
    archetype: normalizeArchetype(source.archetype, base.archetype),
    gender:
      source.gender === 'man' ||
      source.gender === 'woman' ||
      source.gender === 'nonBinary' ||
      source.gender === 'indeterminate'
        ? source.gender
        : undefined,
    honor: asInt(source.honor, base.honor),
    inspiration: asInt(source.inspiration, base.inspiration),
    money: Math.max(0, asInt(source.money, base.money)),
    health: normalizeStatPool(source.health, base.health.max),
    courage: normalizeStatPool(source.courage, base.courage.max),
    stamina,
    clock: normalizeClock(source.clock, stamina.current),
    map,
    inventory,
    spellbook,
    journalEntries,
    lifeStatus: normalizeLifeStatus(source.lifeStatus),
  }
}

export function createCharacter(input?: Partial<CharacterInput>): Character {
  const now = new Date().toISOString()
  return {
    id: randomId(),
    schemaVersion: CHARACTER_SCHEMA_VERSION,
    createdAt: now,
    updatedAt: now,
    ...normalizeCharacterInput(input),
  }
}

export function normalizeCharacter(value: unknown): Character | null {
  const raw = value as Partial<Character> | undefined
  if (
    !raw ||
    typeof raw !== 'object' ||
    typeof raw.id !== 'string' ||
    !raw.id
  ) {
    return null
  }
  const normalizedInput = normalizeCharacterInput(raw)
  const createdAt =
    typeof raw.createdAt === 'string' && raw.createdAt
      ? raw.createdAt
      : new Date().toISOString()
  const updatedAt =
    typeof raw.updatedAt === 'string' && raw.updatedAt
      ? raw.updatedAt
      : createdAt

  return {
    id: raw.id,
    schemaVersion: CHARACTER_SCHEMA_VERSION,
    createdAt,
    updatedAt,
    ...normalizedInput,
  }
}

export function touchCharacter(character: Character): Character {
  return { ...character, updatedAt: new Date().toISOString() }
}

export function validateCharacterForPersistence(
  character: Character
): { ok: true } | { ok: false; errors: string[] } {
  const errors: string[] = []

  if (!Number.isFinite(character.money) || character.money < 0) {
    errors.push('pieces must be >= 0')
  }

  const inventoryCap = Math.max(0, character.stamina.current) * 6

  if (character.inventory.length > MAX_INVENTORY_ITEMS) {
    errors.push(`inventory must have <= ${MAX_INVENTORY_ITEMS} items`)
  }
  if (character.inventory.length > inventoryCap) {
    errors.push(
      `inventory must have <= ${inventoryCap} items (based on Stamina)`
    )
  }
  if (character.spellbook.length > MAX_SPELLBOOK_ITEMS) {
    errors.push(`spellbook must have <= ${MAX_SPELLBOOK_ITEMS} spells`)
  }

  if (character.health.current > character.health.max)
    errors.push('health.current <= health.max')
  if (character.courage.current > character.courage.max)
    errors.push('courage.current <= courage.max')
  if (character.stamina.current > character.stamina.max)
    errors.push('stamina.current <= stamina.max')

  const totalSegments = countClockSegments(character.stamina.current)
  if (character.clock < 0 || character.clock >= totalSegments) {
    errors.push(`clock.position must be between 0 and ${totalSegments - 1}`)
  }

  if (
    !Number.isFinite(character.map.currentPosition.q) ||
    !Number.isFinite(character.map.currentPosition.r)
  ) {
    errors.push('map.currentPosition must be finite')
  }

  const seenCoords = new Set<string>()
  for (const cell of character.map.cells) {
    if (!Number.isFinite(cell.q) || !Number.isFinite(cell.r)) {
      errors.push('map cell coordinates must be finite')
      break
    }
    const key = `${cell.q},${cell.r}`
    if (seenCoords.has(key)) {
      errors.push('map cells must have unique coordinates')
      break
    }
    seenCoords.add(key)

    if (
      cell.q === DEFAULT_MAP_POSITION.q &&
      cell.r === DEFAULT_MAP_POSITION.r &&
      cell.biome !== undefined
    ) {
      errors.push('core map cell must not have a biome')
      break
    }
    if (cell.biome && !(BIOME_IDS as readonly string[]).includes(cell.biome)) {
      errors.push('map cell biome is invalid')
      break
    }
    if (
      typeof cell.icon === 'string' &&
      splitGraphemes(cell.icon).length > MAX_MAP_ICON_LENGTH
    ) {
      errors.push(`map cell icon length must be <= ${MAX_MAP_ICON_LENGTH}`)
      break
    }
  }

  for (const [idx, item] of character.inventory.entries()) {
    if (!item.label.trim()) {
      errors.push(`inventory item #${idx + 1} must have a non-empty name`)
      break
    }
  }

  for (const [idx, spell] of character.spellbook.entries()) {
    if (!spell.name.trim()) {
      errors.push(`spell #${idx + 1} must have a non-empty name`)
      break
    }
  }

  return errors.length === 0 ? { ok: true } : { ok: false, errors }
}

export function computeInventoryCap(character: Character): number {
  return Math.max(0, character.stamina.current) * 6
}

export function normalizeImportMode(value: unknown): CharacterImportMode {
  return value === 'replace' ? 'replace' : 'upsert'
}
