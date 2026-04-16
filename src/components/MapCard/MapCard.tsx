'use client'

import { Card, Form, Popover } from 'antd'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { BrowserWarning } from '@/components/BrowserWarning/BrowserWarning'
import { EncountersButton } from '@/components/EncountersList/EncountersButton'
import { GatheringButton } from '@/components/GatheringList/GatheringButton'
import { HelpButton } from '@/components/HelpButton/HelpButton'
import { MapLegend } from '@/components/MacLegend/MapLegend'
import { MapCover } from '@/components/MapCover/MapCover'
import { MapDisplay } from '@/components/MapDisplay/MapDisplay'
import { MapFormValueAnchor } from '@/components/MapDisplay/MapFormValueAnchor'
import { useCellSelection } from '@/components/MapDisplay/useMapCellSelection'
import { useMapCopyPaste } from '@/components/MapDisplay/useMapCopyPaste'
import { useMapSheet } from '@/components/MapDisplay/useMapSheet'
import { useMapState } from '@/components/MapDisplay/useMapState'
import { MapSheetNavigation } from '@/components/MapSheetNavigation/MapSheetNavigation'
import { useHash } from '@/components/Navigation/useHash'
import { SettingsHint } from '@/components/SettingsHint/SettingsHint'
import { Spacing } from '@/components/Spacing/Spacing'
import {
  isCoreCell,
  resolveDisplayedCellReference,
} from '@/lib/map/coordinates'

import './MapCard.css'

export function MapCard({ isDead }: { isDead: boolean }) {
  const t = useTranslations()
  const { selectedCell, setSelectedCell, toggleSelectCell } = useCellSelection()
  const {
    mapState: { currentPosition },
    getCellState,
  } = useMapState()
  const cellState = getCellState(currentPosition)
  const currentBiome = cellState?.biome ?? 'unexplored'
  const isCore = isCoreCell(currentPosition)
  const { cardRef, visibleSheet, setVisibleSheet, isViewingCurrentSheet } =
    useMapSheet({ currentPosition, selectedCell, setSelectedCell })
  const hash = useHash()

  useMapCopyPaste({ selectedCell, isDead })

  useEffect(
    function handleHashChange() {
      if (!hash) return
      const coord = resolveDisplayedCellReference(hash)
      if (coord) setSelectedCell(coord)
    },
    [setSelectedCell, hash]
  )

  return (
    <>
      <MapCover biome={currentBiome} isCore={isCore} />
      <Card
        actions={[
          <EncountersButton key='encounters' currentBiome={currentBiome} />,
          <GatheringButton key='gathering' currentBiome={currentBiome} />,
        ]}
        id='map'>
        <div ref={cardRef} tabIndex={-1}>
          <BrowserWarning />

          <Spacing>
            <div className='MapControls'>
              <MapSheetNavigation
                currentPosition={currentPosition}
                setVisibleSheet={setVisibleSheet}
                visibleSheet={visibleSheet}
                isViewingCurrentSheet={isViewingCurrentSheet}
              />

              <div className='MapControls__right'>
                <a href='#clock' className='MapControls__skip'>
                  {t('characters.map.skip_map')}
                </a>
                <Popover
                  title={t('characters.map.legend')}
                  content={<MapLegend />}>
                  <HelpButton label={t('common.tip')} />
                </Popover>
              </div>
            </div>

            <MapDisplay
              sheet={visibleSheet}
              selectedCell={selectedCell}
              selectCell={toggleSelectCell}
            />

            <Form.Item name='map' noStyle>
              <MapFormValueAnchor />
            </Form.Item>
          </Spacing>
        </div>
      </Card>
      {!isDead && <SettingsHint hintId='map' />}
    </>
  )
}
