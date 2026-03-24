import type { BiomeId, CharacterMapState } from '@/lib/character/types'
import {
  buildSheetViewport,
  getDisplayedCellLabel,
  getSheetCoordinate,
} from '@/lib/hex/coordinates'
import type { JournalInlineTokenRule } from './journalInlineTokens'

export type JournalCoordinateTokenData = {
  rules: JournalInlineTokenRule[]
  biomeByTokenKey: Map<string, BiomeId | 'unexplored'>
}

export function buildJournalCoordinateTokenData(
  mapState?: CharacterMapState | null
): JournalCoordinateTokenData {
  if (!mapState) {
    return { rules: [], biomeByTokenKey: new Map() }
  }

  const currentSheet = getSheetCoordinate(mapState.currentPosition)
  const byLabel = new Map<string, BiomeId | 'unexplored'>()

  for (const addr of buildSheetViewport(currentSheet)) {
    const label = getDisplayedCellLabel(addr.global).toUpperCase()
    byLabel.set(label, 'unexplored')
  }

  for (const cell of mapState.cells) {
    const cellSheet = getSheetCoordinate(cell)
    if (
      cellSheet.sheetQ !== currentSheet.sheetQ ||
      cellSheet.sheetR !== currentSheet.sheetR
    ) {
      continue
    }

    const label = getDisplayedCellLabel(cell).toUpperCase()
    byLabel.set(label, cell.biome ?? 'unexplored')
  }

  const currentLabel = getDisplayedCellLabel(mapState.currentPosition).toUpperCase()
  if (!byLabel.has(currentLabel)) byLabel.set(currentLabel, 'unexplored')

  const rules: JournalInlineTokenRule[] = Array.from(byLabel.keys()).map(label => ({
    key: `coord:${label}`,
    match: label,
    wordBoundary: true,
  }))

  const biomeByTokenKey = new Map<string, BiomeId | 'unexplored'>(
    Array.from(byLabel.entries()).map(([label, biome]) => [`coord:${label}`, biome])
  )

  return { rules, biomeByTokenKey }
}
