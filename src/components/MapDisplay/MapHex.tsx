import { useMemo } from 'react'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import {
  areHexNeighbors,
  formatDisplayedCellReference,
  getDisplayedCellLabel,
  getGlobalFromSheetCell,
} from '@/lib/hex/coordinates'
import { BiomeId, TranslationKey } from '@/lib/types'
import { MapCellContextMenu } from './MapCellContextMenu'
import type { MapDisplayProps } from './MapDisplay'
import { useJournalIndex, useMapState } from './useMapState'
import './MapHex.css'
import { useTranslations } from 'next-intl'
import { isCoreHex } from '@/lib/map/movement'

type MapHexProps = MapDisplayProps & {
  ri: number
  ci: number
}

type MapHexState = {
  label: string
  isCurrent: boolean
  isSelected: boolean
  isReachable: boolean
  isCore: boolean
  icon: string | undefined
  biome: BiomeId | 'unexplored' | undefined
}

const useHexState = ({
  ri,
  ci,
  selectedCell,
  sheet,
}: {
  selectedCell: MapDisplayProps['selectedCell']
  sheet: MapDisplayProps['sheet']
  ri: MapHexProps['ri']
  ci: MapHexProps['ci']
}): MapHexState => {
  const { mapState, getCellState } = useMapState()
  const global = useMemo(
    () => getGlobalFromSheetCell(sheet, ri, ci),
    [sheet, ri, ci]
  )
  const { currentPosition } = mapState
  const isCurrent =
    currentPosition.q === global.q && currentPosition.r === global.r
  const isSelected =
    selectedCell?.q === global.q && selectedCell?.r === global.r
  const isReachable = useMemo(
    () => areHexNeighbors(currentPosition, global),
    [currentPosition, global]
  )
  const { icon, biome } = getCellState(global)
  const label = useMemo(() => getDisplayedCellLabel(global), [global])
  const isCore = useMemo(() => isCoreHex(global), [global])

  return useMemo(
    () => ({
      isSelected,
      isCurrent,
      isReachable,
      isCore,
      icon,
      biome,
      label,
    }),
    [isSelected, isCurrent, isReachable, icon, biome, label]
  )
}

export function MapHex({
  ri,
  ci,
  sheet,
  selectedCell,
  selectCell,
}: MapHexProps) {
  const t = useTranslations()
  const { settings } = useSettings()
  const { getLinksForCell } = useJournalIndex()
  const { isCurrent, isSelected, isReachable, isCore, icon, biome, label } =
    useHexState({
      ri,
      ci,
      sheet,
      selectedCell,
    })
  const global = useMemo(
    () => getGlobalFromSheetCell(sheet, ri, ci),
    [sheet, ri, ci]
  )
  const journalRefCount = getLinksForCell(global).length
  const id = useMemo(() => formatDisplayedCellReference(global), [global])
  const status = useMemo(() => {
    if (isCurrent) return 'current'
    if (isSelected) return 'selected'
    if (isReachable) return 'reachable'
    return 'other'
  }, [isCurrent, isSelected, isReachable, label])

  return (
    <div
      id={id}
      className={`MapHex ${settings.map.showBiomeBackground ? ' Pattern' : ''}`}
      data-q={global.q}
      data-r={global.r}
      data-coord={label}
      data-biome={biome ?? 'unexplored'}
      data-icon={icon ?? ''}
      data-current={isCurrent}
      data-selected={isSelected}
      data-reachable={isReachable}>
      <MapCellContextMenu
        coord={global}
        isReachable={isReachable}
        label={t('characters.map.cell', {
          coord: label,
          biome: isCore
            ? t('characters.map.core')
            : t(`common.biomes.${biome ?? 'unexplored'}` as TranslationKey),
          status,
        })}
        coordLabel={label}
        selectCell={selectCell}
      />
      {journalRefCount > 0 ? (
        <span className='MapHex__JournalCount'>{journalRefCount}</span>
      ) : null}
      {icon && <span className='MapHex__Icon'>{icon}</span>}
    </div>
  )
}
