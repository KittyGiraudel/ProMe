import { DEFAULT_MAP_POSITION } from '@/lib/character/model'
import type {
  CellCoordinate,
  CharacterMapCell,
  CharacterMapState,
} from '@/lib/character/types'
import { toCellKey } from '@/lib/map/coordinates'

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
  target: CellCoordinate,
  build: (existing: CharacterMapCell | undefined) => CharacterMapCell
): CharacterMapState {
  const nextByKey = new Map(current.cells.map(cell => [toCellKey(cell), cell]))
  const key = toCellKey(target)
  const existing = nextByKey.get(key)
  const nextCell = build(existing)
  if (!nextCell.biome && !nextCell.icon) nextByKey.delete(key)
  else nextByKey.set(key, nextCell)
  return { ...current, cells: Array.from(nextByKey.values()) }
}

export function removeCharacterMapCellAt(
  current: CharacterMapState,
  target: CellCoordinate
): CharacterMapState {
  const nextByKey = new Map(current.cells.map(cell => [toCellKey(cell), cell]))
  nextByKey.delete(toCellKey(target))
  return { ...current, cells: Array.from(nextByKey.values()) }
}
