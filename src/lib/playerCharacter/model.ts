import {
  PLAYER_CHARACTER_SCHEMA_VERSION,
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

const DEFAULT_PIECES = 100

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

function defaultPoolsForArchetype(archetype: PlayerArchetype): {
  ame: StatPool
  courage: StatPool
  endurance: StatPool
} {
  switch (archetype) {
    case 'guerrier':
      return {
        ame: { current: 2, max: 2 },
        courage: { current: 4, max: 4 },
        endurance: { current: 3, max: 3 },
      }
    case 'pelerin':
      return {
        ame: { current: 3, max: 3 },
        courage: { current: 2, max: 2 },
        endurance: { current: 4, max: 4 },
      }
    case 'troubadour':
      return {
        ame: { current: 4, max: 4 },
        courage: { current: 3, max: 3 },
        endurance: { current: 2, max: 2 },
      }
    default: {
      const _exhaustive: never = archetype
      return _exhaustive
    }
  }
}

export function getDefaultPoolsForArchetype(archetype: PlayerArchetype): {
  ame: StatPool
  courage: StatPool
  endurance: StatPool
} {
  return defaultPoolsForArchetype(archetype)
}

export function createDefaultPlayerCharacterInput(
  archetype: PlayerArchetype = 'guerrier',
): PlayerCharacterInput {
  const pools = defaultPoolsForArchetype(archetype)
  return {
    name: '',
    archetype,
    gender: undefined,
    honneur: 0,
    inspiration: 0,
    pieces: DEFAULT_PIECES,
    ame: pools.ame,
    courage: pools.courage,
    endurance: pools.endurance,
    inventory: [],
    spellbook: [],
    notes: '',
    tags: [],
  }
}

export function normalizePlayerCharacterInput(
  input: Partial<PlayerCharacterInput> | null | undefined,
): PlayerCharacterInput {
  const validArchetypes: PlayerArchetype[] = [
    'guerrier',
    'pelerin',
    'troubadour',
  ]
  const baseArchetype = input?.archetype
    ? (validArchetypes.includes(input.archetype as PlayerArchetype)
        ? (input.archetype as PlayerArchetype)
        : 'guerrier')
    : 'guerrier'
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

  return {
    name: typeof source.name === 'string' ? source.name : base.name,
    archetype:
      source.archetype === 'guerrier' ||
      source.archetype === 'pelerin' ||
      source.archetype === 'troubadour'
        ? source.archetype
        : base.archetype,
    gender:
      source.gender === 'man' ||
      source.gender === 'woman' ||
      source.gender === 'nonBinary' ||
      source.gender === 'indeterminate'
        ? source.gender
        : undefined,
    honneur: asInt(source.honneur, base.honneur),
    inspiration: asInt(source.inspiration, base.inspiration),
    pieces: Math.max(0, asInt(source.pieces, base.pieces)),
    ame: normalizeStatPool(source.ame, base.ame.max),
    courage: normalizeStatPool(source.courage, base.courage.max),
    endurance: normalizeStatPool(source.endurance, base.endurance.max),
    inventory,
    spellbook,
    notes: typeof source.notes === 'string' ? source.notes : base.notes,
    tags: Array.isArray(source.tags)
      ? source.tags
          .filter((tag): tag is string => typeof tag === 'string')
          .map(tag => tag.trim())
          .filter(Boolean)
      : base.tags,
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

  if (!Number.isFinite(character.pieces) || character.pieces < 0) {
    errors.push('pieces must be >= 0')
  }

  const inventoryCap = Math.max(0, character.endurance.current) * 6

  if (character.inventory.length > MAX_INVENTORY_ITEMS) {
    errors.push(`inventory must have <= ${MAX_INVENTORY_ITEMS} items`)
  }
  if (character.inventory.length > inventoryCap) {
    errors.push(
      `inventory must have <= ${inventoryCap} items (based on Endurance)`,
    )
  }
  if (character.spellbook.length > MAX_SPELLBOOK_ITEMS) {
    errors.push(`spellbook must have <= ${MAX_SPELLBOOK_ITEMS} spells`)
  }

  if (character.ame.current > character.ame.max) errors.push('ame.current <= ame.max')
  if (character.courage.current > character.courage.max)
    errors.push('courage.current <= courage.max')
  if (character.endurance.current > character.endurance.max)
    errors.push('endurance.current <= endurance.max')

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
  return Math.max(0, character.endurance.current) * 6
}

export function normalizeImportMode(value: unknown): CharacterImportMode {
  return value === 'replace' ? 'replace' : 'upsert'
}
