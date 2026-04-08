'use client'

import { Card, Form, Popover } from 'antd'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { BiomeBubble } from '@/components/BiomeBubble/BiomeBubble'
import { BrowserWarning } from '@/components/BrowserWarning/BrowserWarning'
import { EncountersButton } from '@/components/EncountersList/EncountersButton'
import { GatheringButton } from '@/components/GatheringList/GatheringButton'
import { HelpButton } from '@/components/HelpButton/HelpButton'
import { MapDisplay } from '@/components/MapDisplay/MapDisplay'
import { MapFormValueAnchor } from '@/components/MapDisplay/MapFormValueAnchor'
import { useCellSelection } from '@/components/MapDisplay/useMapCellSelection'
import { useMapCopyPaste } from '@/components/MapDisplay/useMapCopyPaste'
import { useMapSheet } from '@/components/MapDisplay/useMapSheet'
import { useMapState } from '@/components/MapDisplay/useMapState'
import { MapSheetNavigation } from '@/components/MapSheetNavigation/MapSheetNavigation'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { SettingsHint } from '@/components/SettingsHint/SettingsHint'
import { Spacing } from '@/components/Spacing/Spacing'
import { BIOME_IDS } from '@/lib/constants/misc'
import { resolveDisplayedCellReference } from '@/lib/map/coordinates'
import { useHash } from '../Navigation/useHash'

import './MapCard.css'

export function MapCard({ isDead }: { isDead: boolean }) {
  const t = useTranslations()
  const { selectedCell, setSelectedCell, toggleSelectCell } = useCellSelection()
  const {
    mapState: { currentPosition },
    getCellState,
  } = useMapState()
  const currentBiome = getCellState(currentPosition)?.biome ?? 'unexplored'
  const { cardRef, visibleSheet, setVisibleSheet, isViewingCurrentSheet } =
    useMapSheet({ currentPosition, selectedCell, setSelectedCell })
  const hash = useHash()

  useMapCopyPaste({ selectedCell, isDead })

  useEffect(() => {
    if (!hash) return
    const coord = resolveDisplayedCellReference(hash)
    if (coord) setSelectedCell(coord)
  }, [setSelectedCell, hash])

  return (
    <>
      <Card
        title={t('characters.map.map_section')}
        actions={[
          <EncountersButton key='encounters' currentBiome={currentBiome} />,
          <GatheringButton key='gathering' currentBiome={currentBiome} />,
        ]}
        extra={
          <Popover title={t('characters.map.legend')} content={<MapLegend />}>
            <HelpButton label={t('common.tip')} />
          </Popover>
        }
        id='map'>
        <div ref={cardRef} tabIndex={-1}>
          <BrowserWarning />

          <Spacing>
            <MapSheetNavigation
              currentPosition={currentPosition}
              setVisibleSheet={setVisibleSheet}
              visibleSheet={visibleSheet}
              isViewingCurrentSheet={isViewingCurrentSheet}
            />

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

function MapLegend() {
  const t = useTranslations()
  const { settings } = useSettings()

  return (
    <ul className='MapCard__legend'>
      <li>
        <BiomeBubble
          biome='unexplored'
          style={
            {
              fontSize: '1.8em',
            } as React.CSSProperties
          }
        />
        {t('common.biomes.unexplored')}
      </li>
      {BIOME_IDS.map(biome => (
        <li key={biome}>
          <BiomeBubble
            biome={biome}
            style={{ fontSize: '1.8em' } as React.CSSProperties}
            withPattern={settings.map.showBiomeBackground}
          />
          {t(`common.biomes.${biome}`)}
        </li>
      ))}
    </ul>
  )
}
