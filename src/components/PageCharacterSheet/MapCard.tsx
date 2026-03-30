'use client'

import { Card, Form, Popover, Space } from 'antd'
import { useTranslations } from 'next-intl'
import { MapDisplay } from '@/components/MapDisplay/MapDisplay'
import { MapFormValueAnchor } from '@/components/MapDisplay/MapFormValueAnchor'
import { MapSheetNavigation } from '@/components/MapDisplay/MapSheetNavigation'
import { useCellSelection } from '@/components/MapDisplay/useMapCellSelection'
import { useMapSheet as useMapSheet } from '@/components/MapDisplay/useMapSheet'
import { useMapState } from '@/components/MapDisplay/useMapState'
import { SettingsHint } from '@/components/SettingsHint/SettingsHint'
import { BIOME_IDS } from '@/lib/constants/misc'
import { BiomeBubble } from '../BiomeBubble/BiomeBubble'
import { BrowserWarning } from '../BrowserWarning/BrowserWarning'
import { HelpButton } from '../HelpButton/HelpButton'
import './MapCard.css'
import { useSettings } from '../PageSettings/SettingsContext'

export function MapCard() {
  const t = useTranslations()
  const { selectedCell, setSelectedCell, toggleSelectCell } = useCellSelection()
  const {
    mapState: { currentPosition },
  } = useMapState()
  const { cardRef, visibleSheet, setVisibleSheet, isViewingCurrentSheet } =
    useMapSheet({ currentPosition, selectedCell, setSelectedCell })

  return (
    <Card
      title={t('characters.map.map_section')}
      extra={
        <Popover title={t('characters.map.legend')} content={<MapLegend />}>
          <HelpButton label={t('rulebook.information')} />
        </Popover>
      }>
      <div ref={cardRef} tabIndex={-1}>
        <BrowserWarning />

        <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
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
        </Space>
      </div>
      <SettingsHint hintId='map' />
    </Card>
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
