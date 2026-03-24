import type { HexCoordinate } from '@/lib/character/types'
import {
  formatDisplayedCellReference,
  resolveDisplayedCellReference,
} from '@/lib/hex/coordinates'

/**
 * Short URL fragment for a cell (e.g. `#E13`, `#E13@1,-2`).
 */
export function getDisplayedCellHash(coord: HexCoordinate): string {
  return `#${formatDisplayedCellReference(coord)}`
}

/**
 * Parses map cell hashes: short `#E13` / `#E13@sheetQ,sheetR`.
 */
export function parseMapCellHash(hash: string): HexCoordinate | null {
  const decoded = decodeURIComponent(hash.trim())
  const body = decoded.startsWith('#') ? decoded.slice(1) : decoded
  return resolveDisplayedCellReference(body.toUpperCase())
}
