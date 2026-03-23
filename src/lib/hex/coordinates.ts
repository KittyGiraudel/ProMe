import type { HexCoordinate } from '@/lib/playerCharacter/types'

export const MAP_ROWS = 9
export const MAP_COLS = 12

// This is the position *in the rendered map* where the *origin* (0, 0) exists:
// in the 4th row (E) at the 6th column (13).
export const ORIGIN_POSITION = { r: 4, q: 6 }

export type SheetCoordinate = {
  sheetQ: number
  sheetR: number
}

export type SheetCellAddress = SheetCoordinate & {
  rowIndex: number
  colIndex: number
  rowLabel: string
  colLabel: string
  localLabel: string
  global: HexCoordinate
}

export const AXIAL_DIRECTIONS: readonly HexCoordinate[] = [
  { q: 1, r: 0 },
  { q: 1, r: -1 },
  { q: 0, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: 0, r: 1 },
] as const

function floorDiv(value: number, base: number): number {
  return Math.floor(value / base)
}

function positiveMod(value: number, base: number): number {
  return ((value % base) + base) % base
}

export function toHexKey(coord: HexCoordinate): string {
  return `${coord.q},${coord.r}`
}

export function fromHexKey(key: string): HexCoordinate | null {
  const [qRaw, rRaw] = key.split(',')
  const q = Number.parseInt(qRaw ?? '', 10)
  const r = Number.parseInt(rRaw ?? '', 10)
  if (!Number.isFinite(q) || !Number.isFinite(r)) return null
  return { q, r }
}

export function axialNeighbor(
  coord: HexCoordinate,
  direction: number,
): HexCoordinate {
  const delta = AXIAL_DIRECTIONS[positiveMod(direction, AXIAL_DIRECTIONS.length)]
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

export function getSheetCoordinate(coord: HexCoordinate): SheetCoordinate {
  const absoluteRow = coord.r + ORIGIN_POSITION.r
  const absoluteCol = coord.q + ORIGIN_POSITION.q
  return {
    sheetQ: floorDiv(absoluteCol, MAP_COLS),
    sheetR: floorDiv(absoluteRow, MAP_ROWS),
  }
}

export function getGlobalFromSheetCell(
  sheet: SheetCoordinate,
  rowIndex: number,
  colIndex: number,
): HexCoordinate {
  const absoluteRow = sheet.sheetR * MAP_ROWS + rowIndex
  const absoluteCol = sheet.sheetQ * MAP_COLS + colIndex
  return {
    q: absoluteCol - ORIGIN_POSITION.q,
    r: absoluteRow - ORIGIN_POSITION.r,
  }
}

export function getSheetCellAddress(coord: HexCoordinate): SheetCellAddress {
  const absoluteRow = coord.r + ORIGIN_POSITION.r
  const absoluteCol = coord.q + ORIGIN_POSITION.q
  const sheetR = floorDiv(absoluteRow, MAP_ROWS)
  const sheetQ = floorDiv(absoluteCol, MAP_COLS)
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

export function getDisplayedCellLabel(coord: HexCoordinate): string {
  const address = getSheetCellAddress(coord)
  const displayColIndex =
    address.rowIndex % 2 === 0 ? address.colIndex * 2 : address.colIndex * 2 + 1
  return `${address.rowLabel}${colLabelFromIndex(displayColIndex)}`
}

export function buildSheetViewport(sheet: SheetCoordinate): SheetCellAddress[] {
  const cells: SheetCellAddress[] = []
  for (let rowIndex = 0; rowIndex < MAP_ROWS; rowIndex += 1) {
    for (let colIndex = 0; colIndex < MAP_COLS; colIndex += 1) {
      const global = getGlobalFromSheetCell(sheet, rowIndex, colIndex)
      cells.push(getSheetCellAddress(global))
    }
  }
  return cells
}


export function isSameHex(a: HexCoordinate, b: HexCoordinate): boolean {
  return a.q === b.q && a.r === b.r
}
