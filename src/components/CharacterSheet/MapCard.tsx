'use client'

import { Card, Form, Space, Tag } from 'antd'
import {
  getDisplayedCellLabel,
  getSheetCoordinate,
} from '@/lib/hex/coordinates'
import { MapDisplay } from '@/components/MapDisplay/MapDisplay'
import { MapFormValueAnchor } from './MapFormValueAnchor'
import { Button } from '@/components/Button/Button'
import { useTranslations } from 'next-intl'
import { useMapActions } from './useMapActions'
import { useMapCardSheet as useMapSheet } from './useMapSheet'
import { useCellSelection } from './useMapCellSelection'
import { useMapState } from './useMapState'

export function MapCard() {
  const t = useTranslations()
  const { selectedCell, setSelectedCell, toggleSelectCell } = useCellSelection()
  const { mapState, cellsByKey, journalIndexByCell } = useMapState()
  const { setBiomeAt, setRandomBiomeAt, moveToCell, setIconAt, clearCellAt } =
    useMapActions()
  const { cardRef, visibleSheet, setVisibleSheet, isViewingCurrentSheet } =
    useMapSheet({
      currentPosition: mapState.currentPosition,
      selectedCell,
      setSelectedCell,
    })

  return (
    <Card title={t('characters.map.map_section')}>
      <div ref={cardRef} tabIndex={-1}>
        <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
          <Space wrap>
            <Tag>
              {t('characters.map.sheet', {
                sheetQ: visibleSheet.sheetQ,
                sheetR: visibleSheet.sheetR,
              })}
            </Tag>
            <Tag>
              {t('characters.map.character_position', {
                position: getDisplayedCellLabel(mapState.currentPosition),
              })}
            </Tag>
            <Button
              htmlType='button'
              disabled={false}
              onClick={() =>
                setVisibleSheet(sheet => ({
                  ...sheet,
                  sheetR: sheet.sheetR - 1,
                }))
              }>
              ↑
            </Button>
            <Button
              htmlType='button'
              disabled={false}
              onClick={() =>
                setVisibleSheet(sheet => ({
                  ...sheet,
                  sheetR: sheet.sheetR + 1,
                }))
              }>
              ↓
            </Button>
            <Button
              htmlType='button'
              disabled={false}
              onClick={() =>
                setVisibleSheet(sheet => ({
                  ...sheet,
                  sheetQ: sheet.sheetQ - 1,
                }))
              }>
              ←
            </Button>
            <Button
              htmlType='button'
              disabled={false}
              onClick={() =>
                setVisibleSheet(sheet => ({
                  ...sheet,
                  sheetQ: sheet.sheetQ + 1,
                }))
              }>
              →
            </Button>
            {!isViewingCurrentSheet ? (
              <Button
                htmlType='button'
                disabled={false}
                onClick={() =>
                  setVisibleSheet(getSheetCoordinate(mapState.currentPosition))
                }>
                {t('characters.map.center_on_current')}
              </Button>
            ) : null}
          </Space>

          <Form.Item name='map' noStyle>
            <MapFormValueAnchor />
          </Form.Item>

          <MapDisplay
            sheet={visibleSheet}
            cellsByKey={cellsByKey}
            journalIndexByCell={journalIndexByCell}
            currentPosition={mapState.currentPosition}
            selectedPosition={selectedCell}
            onSelectCell={toggleSelectCell}
            onAssignBiome={setBiomeAt}
            onAssignRandomBiome={setRandomBiomeAt}
            onMoveTo={moveToCell}
            onSetIcon={setIconAt}
            onClearCell={clearCellAt}
          />
        </Space>
      </div>
    </Card>
  )
}
