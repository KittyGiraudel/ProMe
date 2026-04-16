import { DEFAULT_MAP_POSITION } from '@/lib/character/model'
import type { CellCoordinate } from '@/lib/character/types'

export const MAP_ROWS = 9
export const MAP_COLS = 12

// This is the position *in the rendered map* where the *origin* (0, 0) exists:
// in the 4th row (E) at the 6th column (13).
export const ORIGIN_POSITION = { r: 4, q: 6 }

const DISPLAYED_CELL_REFERENCE_PARSE_PATTERN =
  /^([A-I][0-9]{2})(?:@(-?\d+),(-?\d+))?$/iu
const DISPLAYED_CELL_REFERENCE_EXTRACT_PATTERN =
  /([A-I][0-9]{2}(?:@-?\d+,-?\d+)?)/giu

export type SheetCoordinate = {
  sheetQ: number
  sheetR: number
}

export type SheetCoordinateWithLabel = SheetCoordinate & { label: string }

export type SheetCellAddress = SheetCoordinate & {
  rowIndex: number
  colIndex: number
  rowLabel: string
  colLabel: string
  localLabel: string
  global: CellCoordinate
}

// See: https://www.redblobgames.com/grids/hexagons/#neighbors-axial
export const AXIAL_DIRECTIONS: readonly CellCoordinate[] = [
  { q: 1, r: 0 },
  { q: 1, r: -1 },
  { q: 0, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: 0, r: 1 },
] as const

function positiveMod(value: number, base: number): number {
  return ((value % base) + base) % base
}

export function toCellKey(coord: CellCoordinate): string {
  return `${coord.q},${coord.r}`
}

export function fromCellKey(key: string): CellCoordinate | null {
  const [qRaw, rRaw] = key.split(',')
  const q = Number.parseInt(qRaw ?? '', 10)
  const r = Number.parseInt(rRaw ?? '', 10)
  if (!Number.isFinite(q) || !Number.isFinite(r)) return null
  return { q, r }
}

export function axialNeighbor(
  coord: CellCoordinate,
  direction: number
): CellCoordinate {
  const delta =
    AXIAL_DIRECTIONS[positiveMod(direction, AXIAL_DIRECTIONS.length)]
  return { q: coord.q + delta.q, r: coord.r + delta.r }
}

export function rowLabelFromIndex(index: number): string {
  const clamped = Math.max(0, Math.min(MAP_ROWS - 1, index))
  return String.fromCharCode(65 + clamped)
}

export function colLabelFromIndex(index: number): string {
  const oneBased = index + 1
  return oneBased.toString().padStart(2, '0')
}

export function getSheetCoordinate(coord: CellCoordinate): SheetCoordinate {
  const absoluteRow = coord.r + ORIGIN_POSITION.r
  const absoluteCol = coord.q + ORIGIN_POSITION.q
  return {
    sheetQ: Math.floor(absoluteCol / MAP_COLS),
    sheetR: Math.floor(absoluteRow / MAP_ROWS),
  }
}

export function getGlobalFromSheetCell(
  sheet: SheetCoordinate,
  rowIndex: number,
  colIndex: number
): CellCoordinate {
  const absoluteRow = sheet.sheetR * MAP_ROWS + rowIndex
  const absoluteCol = sheet.sheetQ * MAP_COLS + colIndex
  return {
    q: absoluteCol - ORIGIN_POSITION.q,
    r: absoluteRow - ORIGIN_POSITION.r,
  }
}

export function getSheetCellAddress(coord: CellCoordinate): SheetCellAddress {
  const absoluteRow = coord.r + ORIGIN_POSITION.r
  const absoluteCol = coord.q + ORIGIN_POSITION.q
  const sheetR = Math.floor(absoluteRow / MAP_ROWS)
  const sheetQ = Math.floor(absoluteCol / MAP_COLS)
  const rowIndex = positiveMod(absoluteRow, MAP_ROWS)
  const colIndex = positiveMod(absoluteCol, MAP_COLS)
  const rowLabel = rowLabelFromIndex(rowIndex)
  const colLabel = colLabelFromIndex(colIndex)
  return {
    sheetQ,
    sheetR,
    rowIndex,
    colIndex,
    rowLabel,
    colLabel,
    localLabel: `${rowLabel}${colLabel}`,
    global: coord,
  }
}

export function getDisplayedCellLabel(coord: CellCoordinate): string {
  const address = getSheetCellAddress(coord)
  const displayColIndex =
    address.rowIndex % 2 === 0 ? address.colIndex * 2 : address.colIndex * 2 + 1
  return `${address.rowLabel}${colLabelFromIndex(displayColIndex)}`
}

/**
 * Parses a displayed cell label (for example `E13`) into row/display-column
 * indices within a sheet.
 *
 * Returns `null` when the label format is invalid, out of range, or does not
 * match the odd/even row parity used by displayed map labels.
 */
export function parseDisplayedCellLabel(label: string): {
  rowIndex: number
  displayColIndex: number
} | null {
  const trimmed = label.trim().toUpperCase()
  const match = /^([A-I])([0-9]{2})$/u.exec(trimmed)
  if (!match) return null

  const rowIndex = match[1].charCodeAt(0) - 65
  const displayCol = Number.parseInt(match[2], 10)
  if (!Number.isFinite(displayCol)) return null

  const displayColIndex = displayCol - 1
  const maxDisplayColIndex = MAP_COLS * 2 - 1
  if (displayColIndex < 0 || displayColIndex > maxDisplayColIndex) return null

  const expectsEven = rowIndex % 2 === 0
  const hasEvenParity = displayColIndex % 2 === 0
  if (expectsEven !== hasEvenParity) return null

  return { rowIndex, displayColIndex }
}

/**
 * Resolves a displayed cell label (for example `E13`) to a global map
 * coordinate for a given sheet.
 *
 * The label itself is sheet-local; pass the target `sheet` to disambiguate.
 */
export function getGlobalFromDisplayedCellLabel(
  sheet: SheetCoordinate,
  label: string
): CellCoordinate | null {
  const parsed = parseDisplayedCellLabel(label)
  if (!parsed) return null

  const colIndex =
    parsed.rowIndex % 2 === 0
      ? parsed.displayColIndex / 2
      : (parsed.displayColIndex - 1) / 2

  if (!Number.isInteger(colIndex) || colIndex < 0 || colIndex >= MAP_COLS) {
    return null
  }

  return getGlobalFromSheetCell(sheet, parsed.rowIndex, colIndex)
}

/**
 * Parses a cell reference in `LABEL` or `LABEL@sheetQ,sheetR` format.
 *
 * Examples:
 * - `E13` -> `{ label: 'E13', sheetQ: 0, sheetR: 0 }`
 * - `E13@1,-2` -> `{ label: 'E13', sheetQ: 1, sheetR: -2 }`
 */
export function parseDisplayedCellReference(value: string): {
  label: string
  sheetQ: number
  sheetR: number
} | null {
  const match = DISPLAYED_CELL_REFERENCE_PARSE_PATTERN.exec(value.trim())
  if (!match) return null

  const label = (match[1] ?? '').toUpperCase()
  const sheetQ = Number.parseInt(match[2] ?? '0', 10)
  const sheetR = Number.parseInt(match[3] ?? '0', 10)
  if (!Number.isFinite(sheetQ) || !Number.isFinite(sheetR)) return null
  if (!parseDisplayedCellLabel(label)) return null

  return { label, sheetQ, sheetR }
}

function normalizeDisplayedCellReference(parts: {
  label: string
  sheetQ: number
  sheetR: number
}): string {
  if (parts.sheetQ === 0 && parts.sheetR === 0) return parts.label
  return `${parts.label}@${parts.sheetQ},${parts.sheetR}`
}

/**
 * Finds and normalizes all valid displayed cell references contained in text.
 *
 * Returned references are unique and preserve first-seen order.
 */
export function extractDisplayedCellReferences(text: string): string[] {
  const matches = new Set<string>()

  for (const match of text.matchAll(DISPLAYED_CELL_REFERENCE_EXTRACT_PATTERN)) {
    const raw = (match[1] ?? '').toUpperCase()
    const parsed = parseDisplayedCellReference(raw)
    if (!parsed) continue

    matches.add(normalizeDisplayedCellReference(parsed))
  }

  return Array.from(matches)
}

/**
 * Formats a global coordinate as a displayed cell reference.
 *
 * By default, sheet `(0,0)` is omitted (`E13`). Set `includeDefaultSheet` to
 * include it explicitly (`E13@0,0`).
 */
export function formatDisplayedCellReference(
  coord: CellCoordinate,
  options?: { includeDefaultSheet?: boolean }
): string {
  const label = getDisplayedCellLabel(coord)
  const sheet = getSheetCoordinate(coord)
  if (
    !options?.includeDefaultSheet &&
    sheet.sheetQ === 0 &&
    sheet.sheetR === 0
  ) {
    return label
  }
  return `${label}@${sheet.sheetQ},${sheet.sheetR}`
}

/**
 * Resolves a displayed cell reference (`E13` or `E13@sheetQ,sheetR`) to a
 * global coordinate.
 */
export function resolveDisplayedCellReference(
  value: string
): CellCoordinate | null {
  const parsed = parseDisplayedCellReference(value)
  if (!parsed) return null
  return getGlobalFromDisplayedCellLabel(
    { sheetQ: parsed.sheetQ, sheetR: parsed.sheetR },
    parsed.label
  )
}

export function isSameCell(a: CellCoordinate, b: CellCoordinate): boolean {
  return a.q === b.q && a.r === b.r
}

/**
 * True when `to` is exactly one step away from `from` on the rendered
 * odd/even-row offset cell grid used by the map sheet.
 */
export function areCellsNeighbors(
  from: CellCoordinate,
  to: CellCoordinate
): boolean {
  const isEvenRow = from.r % 2 === 0
  const deltas: readonly CellCoordinate[] = isEvenRow
    ? [
        { q: -1, r: 0 },
        { q: 1, r: 0 },
        { q: -1, r: -1 },
        { q: 0, r: -1 },
        { q: -1, r: 1 },
        { q: 0, r: 1 },
      ]
    : [
        { q: -1, r: 0 },
        { q: 1, r: 0 },
        { q: 0, r: -1 },
        { q: 1, r: -1 },
        { q: 0, r: 1 },
        { q: 1, r: 1 },
      ]
  for (const d of deltas) {
    if (from.q + d.q === to.q && from.r + d.r === to.r) return true
  }
  return false
}

export function isCoreCell(coord: CellCoordinate): boolean {
  return (
    coord.q === DEFAULT_MAP_POSITION.q && coord.r === DEFAULT_MAP_POSITION.r
  )
}
