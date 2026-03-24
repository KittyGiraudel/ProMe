import type { HexCoordinate } from '@/lib/character/types'
import {
  getDisplayedCellLabel,
  getGlobalFromDisplayedCellLabel,
  getSheetCoordinate,
} from '@/lib/hex/coordinates'

const MAP_CELL_HASH_PATTERN = /^#?map-([A-I][0-9]{2})(?:@(-?\d+),(-?\d+))?$/u

/**
 * Builds a stable DOM id for a map cell using the displayed label format.
 *
 * Examples:
 * - `map-E13` for sheet (0,0)
 * - `map-E13@1,-2` for non-default sheets
 */
export function getMapCellId(coord: HexCoordinate): string {
  const label = getDisplayedCellLabel(coord)
  const sheet = getSheetCoordinate(coord)
  if (sheet.sheetQ === 0 && sheet.sheetR === 0) {
    return `map-${label}`
  }
  return `map-${label}@${sheet.sheetQ},${sheet.sheetR}`
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

  const label = (match[1] ?? '').toUpperCase()
  const sheetQ = Number.parseInt(match[2] ?? '0', 10)
  const sheetR = Number.parseInt(match[3] ?? '0', 10)
  if (!Number.isFinite(sheetQ) || !Number.isFinite(sheetR)) return null

  return getGlobalFromDisplayedCellLabel({ sheetQ, sheetR }, label)
}

