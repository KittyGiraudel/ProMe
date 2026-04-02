import type {
  CharacterMapCell,
  CharacterMapState,
  HexCoordinate,
} from '@/lib/character/types'
import { areHexNeighbors, isCoreHex, toHexKey } from '@/lib/hex/coordinates'
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
  target: HexCoordinate,
  rng?: () => number
): MoveWithAutoBiomeResult {
  if (!areHexNeighbors(current.currentPosition, target)) {
    return { next: current }
  }

  const nextByKey = new Map(current.cells.map(cell => [toHexKey(cell), cell]))
  const targetKey = toHexKey(target)
  const existing = nextByKey.get(targetKey)

  if (!existing?.biome && !isCoreHex(target)) {
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
