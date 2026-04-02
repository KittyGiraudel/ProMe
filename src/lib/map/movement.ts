import type {
  CellCoordinate,
  CharacterMapCell,
  CharacterMapState,
} from '@/lib/character/types'
import { areCellsNeighbors, isCoreCell, toCellKey } from '@/lib/map/coordinates'
import {
  getRandomBiomeResult,
  type RandomBiomeResult,
} from '@/lib/random/randomBiome'

type MoveWithAutoBiomeResult = {
  next: CharacterMapState
  discoveredBiome?: RandomBiomeResult
}

export function moveWithAutoBiome(
  current: CharacterMapState,
  target: CellCoordinate,
  rng?: () => number
): MoveWithAutoBiomeResult {
  if (!areCellsNeighbors(current.currentPosition, target)) {
    return { next: current }
  }

  const nextByKey = new Map(current.cells.map(cell => [toCellKey(cell), cell]))
  const targetKey = toCellKey(target)
  const existing = nextByKey.get(targetKey)

  if (!existing?.biome && !isCoreCell(target)) {
    const discoveredBiome = getRandomBiomeResult(rng)
    const nextCell: CharacterMapCell = {
      q: target.q,
      r: target.r,
      biome: discoveredBiome.biome,
      icon: existing?.icon,
    }
    if (!nextCell.biome && !nextCell.icon) nextByKey.delete(targetKey)
    else nextByKey.set(targetKey, nextCell)
    return {
      next: {
        ...current,
        currentPosition: target,
        cells: Array.from(nextByKey.values()),
      },
      discoveredBiome,
    }
  }

  return {
    next: { ...current, currentPosition: target },
  }
}
