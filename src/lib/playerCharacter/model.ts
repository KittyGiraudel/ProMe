import {
  BIOME_IDS,
  type BiomeId,
  type CharacterMapCell,
  type CharacterMapState,
  PLAYER_CHARACTER_SCHEMA_VERSION,
  type CharacterClock,
  type CharacterImportMode,
  type InventoryItem,
  type PlayerCharacter,
  type PlayerCharacterInput,
  type SpellEntry,
  type PlayerArchetype,
  type StatPool,
} from './types'

const MAX_INVENTORY_ITEMS = 30
const MAX_SPELLBOOK_ITEMS = 6
const MAX_MAP_ICON_LENGTH = 1

const DEFAULT_MONEY = 100
export const CORE_Q = 6
export const CORE_R = 0

function normalizeArchetype(
  value: unknown,
  fallback: PlayerArchetype,
): PlayerArchetype {
  if (value === 'warrior' || value === 'pilgrim' || value === 'bard') return value
  return fallback
}

export function randomId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
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
  return (BIOME_IDS as readonly string[]).includes(value) ? (value as BiomeId) : undefined
}

function normalizeHexCoordinate(
  value: unknown,
  fallback: { q: number; r: number },
): { q: number; r: number } {
  const source = value as Partial<{ q: number; r: number }> | undefined
  return {
    q: asInt(source?.q, fallback.q),
    r: asInt(source?.r, fallback.r),
  }
}

function normalizeMapIcon(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const icon = value.trim()
  if (!icon) return undefined
  return Array.from(icon).slice(0, MAX_MAP_ICON_LENGTH).join('')
}

function normalizeCharacterMapCell(value: unknown): CharacterMapCell | null {
  const raw = value as Partial<CharacterMapCell> | undefined
  if (!raw || typeof raw !== 'object') return null
  const q = asInt(raw.q, Number.NaN)
  const r = asInt(raw.r, Number.NaN)
  if (!Number.isFinite(q) || !Number.isFinite(r)) return null

  const icon = normalizeMapIcon(raw.icon)
  const biome = q === CORE_Q && r === CORE_R ? undefined : normalizeBiome(raw.biome)

  return {
    q,
    r,
    biome,
    icon,
  }
}

export function normalizeCharacterMapState(value: unknown): CharacterMapState {
  const raw = value as Partial<CharacterMapState> | undefined
  const currentPosition = normalizeHexCoordinate(raw?.currentPosition, {
    q: CORE_Q,
    r: CORE_R,
  })

  const byCoord = new Map<string, CharacterMapCell>()
  if (Array.isArray(raw?.cells)) {
    for (const entry of raw.cells) {
      const normalized = normalizeCharacterMapCell(entry)
      if (!normalized) continue
      byCoord.set(`${normalized.q},${normalized.r}`, normalized)
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

export function computeClockSegmentsPerHalfFromStamina(
  staminaCurrent: number,
): number {
  return Math.max(1, Math.trunc(staminaCurrent))
}

export function computeClockTotalSegmentsFromStamina(
  staminaCurrent: number,
): number {
  return computeClockSegmentsPerHalfFromStamina(staminaCurrent) * 2
}

function normalizeClockPosition(position: unknown, totalSegments: number): number {
  const asInteger = asInt(position, 0)
  if (totalSegments <= 0) return 0
  if (asInteger < 0) return 0
  if (asInteger >= totalSegments) return totalSegments - 1
  return asInteger
}

export function remapClockPositionForTotalSegments(
  position: number,
  fromTotalSegments: number,
  toTotalSegments: number,
): number {
  if (toTotalSegments <= 0) return 0
  if (fromTotalSegments <= 0) return normalizeClockPosition(position, toTotalSegments)
  const normalizedFrom = normalizeClockPosition(position, fromTotalSegments)
  const ratio = normalizedFrom / fromTotalSegments
  const remapped = Math.floor(ratio * toTotalSegments)
  return normalizeClockPosition(remapped, toTotalSegments)
}

export function normalizeCharacterClock(
  value: unknown,
  staminaCurrent: number,
): CharacterClock {
  const source = value as Partial<CharacterClock> | undefined
  const totalSegments = computeClockTotalSegmentsFromStamina(staminaCurrent)
  return {
    position: normalizeClockPosition(source?.position, totalSegments),
  }
}

function defaultPoolsForArchetype(archetype: PlayerArchetype): {
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

export function getDefaultPoolsForArchetype(archetype: PlayerArchetype): {
  health: StatPool
  courage: StatPool
  stamina: StatPool
} {
  return defaultPoolsForArchetype(archetype)
}

export function createDefaultPlayerCharacterInput(
  archetype: PlayerArchetype = 'warrior',
): PlayerCharacterInput {
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
    clock: { position: 0 },
    map: {
      currentPosition: { q: CORE_Q, r: CORE_R },
      cells: [],
    },
    inventory: [],
    spellbook: [],
    notes: '',
  }
}

export function normalizePlayerCharacterInput(
  input: Partial<PlayerCharacterInput> | null | undefined,
): PlayerCharacterInput {
  const fallbackArchetype: PlayerArchetype = 'warrior'
  const baseArchetype = normalizeArchetype(input?.archetype, fallbackArchetype)
  const base = createDefaultPlayerCharacterInput(baseArchetype)
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

  const stamina = normalizeStatPool(
    source.stamina,
    base.stamina.max,
  )
  const map = normalizeCharacterMapState(source.map)

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
    health: normalizeStatPool(
      source.health,
      base.health.max,
    ),
    courage: normalizeStatPool(source.courage, base.courage.max),
    stamina,
    clock: normalizeCharacterClock(source.clock, stamina.current),
    map,
    inventory,
    spellbook,
    notes: typeof source.notes === 'string' ? source.notes : base.notes,
  }
}

export function createPlayerCharacter(
  input?: Partial<PlayerCharacterInput>,
): PlayerCharacter {
  const now = new Date().toISOString()
  return {
    id: randomId(),
    schemaVersion: PLAYER_CHARACTER_SCHEMA_VERSION,
    createdAt: now,
    updatedAt: now,
    ...normalizePlayerCharacterInput(input),
  }
}

export function normalizePlayerCharacter(
  value: unknown,
): PlayerCharacter | null {
  const raw = value as Partial<PlayerCharacter> | undefined
  if (!raw || typeof raw !== 'object' || typeof raw.id !== 'string' || !raw.id) {
    return null
  }
  const normalizedInput = normalizePlayerCharacterInput(raw)
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
    schemaVersion: PLAYER_CHARACTER_SCHEMA_VERSION,
    createdAt,
    updatedAt,
    ...normalizedInput,
  }
}

export function touchPlayerCharacter(
  character: PlayerCharacter,
): PlayerCharacter {
  return { ...character, updatedAt: new Date().toISOString() }
}

export function validatePlayerCharacterForPersistence(
  character: PlayerCharacter,
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
      `inventory must have <= ${inventoryCap} items (based on Stamina)`,
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

  const totalSegments = computeClockTotalSegmentsFromStamina(character.stamina.current)
  if (character.clock.position < 0 || character.clock.position >= totalSegments) {
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

    if (cell.biome && !(BIOME_IDS as readonly string[]).includes(cell.biome)) {
      errors.push('map cell biome is invalid')
      break
    }
    if (typeof cell.icon === 'string' && cell.icon.length > MAX_MAP_ICON_LENGTH) {
      errors.push(`map cell icon length must be <= ${MAX_MAP_ICON_LENGTH}`)
      break
    }
    if (cell.q === CORE_Q && cell.r === CORE_R && cell.biome) {
      errors.push('core map cell cannot have a biome')
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

export function computeInventoryCap(character: PlayerCharacter): number {
  return Math.max(0, character.stamina.current) * 6
}

export function normalizeImportMode(value: unknown): CharacterImportMode {
  return value === 'replace' ? 'replace' : 'upsert'
}
