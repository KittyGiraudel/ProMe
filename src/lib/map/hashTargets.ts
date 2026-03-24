import type { HexCoordinate } from '@/lib/character/types'
import {
  formatDisplayedCellReference,
  resolveDisplayedCellReference,
} from '@/lib/hex/coordinates'

const MAP_CELL_HASH_PATTERN = /^#?map-(.+)$/u

/**
 * Builds a stable DOM id for a map cell using the displayed label format.
 *
 * Examples:
 * - `map-E13` for sheet (0,0)
 * - `map-E13@1,-2` for non-default sheets
 */
export function getMapCellId(coord: HexCoordinate): string {
  return `map-${formatDisplayedCellReference(coord)}`
}

/**
 * Returns the URL hash for a map cell id produced by `getMapCellId`.
 */
export function getMapCellHash(coord: HexCoordinate): string {
  return `#${getMapCellId(coord)}`
}

/**
 * Parses map cell hashes in the `#map-E13` / `#map-E13@sheetQ,sheetR` format
 * and resolves them to global coordinates.
 *
 * When the sheet suffix is omitted, sheet `(0,0)` is assumed.
 */
export function parseMapCellHash(hash: string): HexCoordinate | null {
  const decodedHash = decodeURIComponent(hash)
  const match = decodedHash.match(MAP_CELL_HASH_PATTERN)
  if (!match) return null
  return resolveDisplayedCellReference((match[1] ?? '').toUpperCase())
}

