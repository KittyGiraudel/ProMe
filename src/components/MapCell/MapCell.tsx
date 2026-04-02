import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { MapCellContextMenu } from '@/components/MapCellContextMenu/MapCellContextMenu'
import type { MapDisplayProps } from '@/components/MapDisplay/MapDisplay'
import { useMapState } from '@/components/MapDisplay/useMapState'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import {
  areCellsNeighbors,
  formatDisplayedCellReference,
  getDisplayedCellLabel,
  getGlobalFromSheetCell,
  isCoreCell,
} from '@/lib/map/coordinates'
import { PossibleBiomeId, TranslationKey } from '@/lib/types'

import './MapCell.css'
import { useWatchedJournal } from '@/hooks/useCharacterSheetDerived'

type MapCellProps = MapDisplayProps & {
  ri: number
  ci: number
}

type MapCellState = {
  label: string
  isCurrent: boolean
  isSelected: boolean
  isReachable: boolean
  isCore: boolean
  icon: string | undefined
  biome: PossibleBiomeId | undefined
}

const useCellState = ({
  ri,
  ci,
  selectedCell,
  sheet,
}: {
  selectedCell: MapDisplayProps['selectedCell']
  sheet: MapDisplayProps['sheet']
  ri: MapCellProps['ri']
  ci: MapCellProps['ci']
}): MapCellState => {
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
    () => areCellsNeighbors(currentPosition, global),
    [currentPosition, global]
  )
  const { icon, biome } = getCellState(global) ?? {
    icon: undefined,
    biome: undefined,
  }
  const label = useMemo(() => getDisplayedCellLabel(global), [global])
  const isCore = useMemo(() => isCoreCell(global), [global])

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
    [isSelected, isCurrent, isReachable, isCore, icon, biome, label]
  )
}

export function MapCell({
  ri,
  ci,
  sheet,
  selectedCell,
  selectCell,
}: MapCellProps) {
  const t = useTranslations()
  const { settings } = useSettings()
  const { getLinksForCell } = useWatchedJournal()
  const { isCurrent, isSelected, isReachable, isCore, icon, biome, label } =
    useCellState({
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
  }, [isCurrent, isSelected, isReachable])

  return (
    <div
      id={id}
      className={`MapCell ${settings.map.showBiomeBackground ? ' Pattern' : ''}`}
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
        <span className='MapCell__JournalCount'>{journalRefCount}</span>
      ) : null}
      {icon && <span className='MapCell__Icon'>{icon}</span>}
    </div>
  )
}
