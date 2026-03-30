'use client'

import { Card, Form, Space } from 'antd'
import { useTranslations } from 'next-intl'
import { MapDisplay } from '@/components/MapDisplay/MapDisplay'
import { MapFormValueAnchor } from '@/components/MapDisplay/MapFormValueAnchor'
import { MapSheetNavigation } from '@/components/MapDisplay/MapSheetNavigation'
import { useCellSelection } from '@/components/MapDisplay/useMapCellSelection'
import { useMapSheet as useMapSheet } from '@/components/MapDisplay/useMapSheet'
import { useMapState } from '@/components/MapDisplay/useMapState'
import { SettingsHint } from '@/components/SettingsHint/SettingsHint'
import { BrowserWarning } from '../BrowserWarning/BrowserWarning'

export function MapCard() {
  const t = useTranslations()
  const { selectedCell, setSelectedCell, toggleSelectCell } = useCellSelection()
  const {
    mapState: { currentPosition },
  } = useMapState()
  const { cardRef, visibleSheet, setVisibleSheet, isViewingCurrentSheet } =
    useMapSheet({ currentPosition, selectedCell, setSelectedCell })

  return (
    <Card title={t('characters.map.map_section')}>
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
