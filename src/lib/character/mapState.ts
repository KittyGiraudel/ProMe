import { DEFAULT_MAP_POSITION } from '@/lib/character/model'
import type {
  CharacterMapCell,
  CharacterMapState,
  HexCoordinate,
} from '@/lib/character/types'
import { toHexKey } from '@/lib/hex/coordinates'

export function normalizeMapState(
  value: CharacterMapState | undefined
): CharacterMapState {
  if (!value) {
    return { currentPosition: DEFAULT_MAP_POSITION, cells: [] }
  }
  return {
    currentPosition: value.currentPosition ?? DEFAULT_MAP_POSITION,
    cells: Array.isArray(value.cells) ? value.cells : [],
  }
}

export function updateCharacterMapCellAt(
  current: CharacterMapState,
  target: HexCoordinate,
  build: (existing: CharacterMapCell | undefined) => CharacterMapCell
): CharacterMapState {
  const nextByKey = new Map(current.cells.map(cell => [toHexKey(cell), cell]))
  const key = toHexKey(target)
  const existing = nextByKey.get(key)
  const nextCell = build(existing)
  if (!nextCell.biome && !nextCell.icon) nextByKey.delete(key)
  else nextByKey.set(key, nextCell)
  return { ...current, cells: Array.from(nextByKey.values()) }
}

export function removeCharacterMapCellAt(
  current: CharacterMapState,
  target: HexCoordinate
): CharacterMapState {
  const nextByKey = new Map(current.cells.map(cell => [toHexKey(cell), cell]))
  nextByKey.delete(toHexKey(target))
  return { ...current, cells: Array.from(nextByKey.values()) }
}
