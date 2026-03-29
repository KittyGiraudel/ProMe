'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import type { FormInstance } from 'antd'
import type {
  CharacterMapCell,
  CharacterMapState,
  HexCoordinate,
} from '@/lib/character/types'
import { type BiomeId } from '@/lib/types'
import {
  formatDisplayedCellReference,
  parseDisplayedCellReference,
  getGlobalFromDisplayedCellLabel,
  toHexKey,
  type SheetCoordinate,
} from '@/lib/hex/coordinates'
import { normalizeMapState } from '@/lib/character/mapState'

export type CharacterCellData = {
  ref: string
  coord: HexCoordinate
  sheet: SheetCoordinate
  biome: BiomeId | 'unexplored'
  icon?: string
}

type CellRef =
  ReturnType<typeof parseDisplayedCellReference> extends infer T
    ? Exclude<T, null>
    : never

type CharacterContextValue = {
  getCharacterValue: <T = unknown>(
    path: string | (string | number)[]
  ) => T | undefined
  getCellData: (ref: CellRef | string) => CharacterCellData | null
  onKill: () => void
  onExport: () => void
  onRevive: () => void
  onDelete: () => void
  isDead: boolean
}

const CharacterContext = createContext<CharacterContextValue | null>(null)

export function CharacterProvider({
  form,
  children,
  onKill,
  onExport,
  onRevive,
  onDelete,
  isDead,
}: {
  form: FormInstance
  children: ReactNode
  onKill: VoidFunction
  onExport: VoidFunction
  onRevive: VoidFunction
  onDelete: VoidFunction
  isDead: boolean
}) {
  const getCharacterValue = useCallback(
    <T,>(path: string | (string | number)[]): T | undefined =>
      form.getFieldValue(path) as T | undefined,
    [form]
  )

  const mapState = useMemo(
    () =>
      normalizeMapState(
        form.getFieldValue('map') as CharacterMapState | undefined
      ),
    [form]
  )
  const cellsByKey = useMemo(
    () =>
      new Map<string, CharacterMapCell>(
        mapState.cells.map(cell => [toHexKey(cell), cell])
      ),
    [mapState.cells]
  )
  const getCellData = useCallback(
    (rawRef: CellRef | string): CharacterCellData | null => {
      const parsed =
        typeof rawRef === 'string'
          ? parseDisplayedCellReference(rawRef)
          : rawRef
      if (!parsed) return null

      const coord = getGlobalFromDisplayedCellLabel(
        { sheetQ: parsed.sheetQ, sheetR: parsed.sheetR },
        parsed.label
      )
      if (!coord) return null

      const existing = cellsByKey.get(toHexKey(coord))
      const ref = formatDisplayedCellReference(coord)

      return {
        ref,
        coord,
        sheet: { sheetQ: parsed.sheetQ, sheetR: parsed.sheetR },
        biome: existing?.biome ?? 'unexplored',
        icon: existing?.icon,
      }
    },
    [cellsByKey]
  )

  const value = useMemo<CharacterContextValue>(
    () => ({
      getCharacterValue,
      getCellData,
      onKill,
      onExport,
      onRevive,
      onDelete,
      isDead,
    }),
    [
      getCharacterValue,
      getCellData,
      onKill,
      onExport,
      onRevive,
      onDelete,
      isDead,
    ]
  )

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  )
}

export function useCharacterContext(): CharacterContextValue {
  const context = useContext(CharacterContext)
  if (!context) {
    throw new Error(
      'useCharacterContext must be used within a CharacterProvider'
    )
  }
  return context
}
