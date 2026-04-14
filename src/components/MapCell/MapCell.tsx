import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { MapCellContextMenu } from '@/components/MapCellContextMenu/MapCellContextMenu'
import type { MapDisplayProps } from '@/components/MapDisplay/MapDisplay'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { useWatchedJournal } from '@/hooks/useCharacterSheetDerived'
import {
  formatDisplayedCellReference,
  getGlobalFromSheetCell,
} from '@/lib/map/coordinates'
import { useCellState } from './useCellState'

import './MapCell.css'

export type MapCellProps = MapDisplayProps & {
  ri: number
  ci: number
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
            ? t('biomes.core.name')
            : t(`biomes.${biome ?? 'unexplored'}.name`),
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
