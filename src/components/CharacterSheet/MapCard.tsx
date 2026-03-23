'use client'

import { Button, Card, Form, Space, Tag, Typography } from 'antd'
import { useMemo, useState } from 'react'
import { MapDisplay } from '@/components/MapDisplay/MapDisplay'
import {
  toHexKey,
  getDisplayedCellLabel,
  getSheetCoordinate,
  type SheetCoordinate,
} from '@/lib/hex/coordinates'
import {
  type BiomeId,
  type CharacterMapCell,
  type CharacterMapState,
  type HexCoordinate,
} from '@/lib/playerCharacter/types'
import { copy } from '@/messages/fr'
import { DEFAULT_MAP_POSITION } from '@/lib/playerCharacter/model'
import { MapFormValueAnchor } from './MapFormValueAnchor'

function normalizeMapState(
  value: CharacterMapState | undefined
): CharacterMapState {
  if (!value) {
    return { currentPosition: DEFAULT_MAP_POSITION, cells: [] }
  }
  return {
    currentPosition: value.currentPosition ?? DEFAULT_MAP_POSITION,
    cells: Array.isArray(value.cells) ? value.cells : [],
  }
}

export function MapCard() {
  const form = Form.useFormInstance()
  const watchedMap = Form.useWatch('map', {
    form,
    preserve: true,
  }) as CharacterMapState | undefined
  const mapState = normalizeMapState(watchedMap)
  const [selectedCell, setSelectedCell] = useState<HexCoordinate>(
    mapState.currentPosition
  )
  const [visibleSheet, setVisibleSheet] = useState<SheetCoordinate>(() =>
    getSheetCoordinate(mapState.currentPosition)
  )

  const cellsByKey = useMemo(() => {
    const next = new Map<string, CharacterMapCell>()
    for (const cell of mapState.cells) {
      next.set(toHexKey(cell), cell)
    }
    return next
  }, [mapState.cells])

  const selectedCellData = cellsByKey.get(toHexKey(selectedCell))

  const updateMap = (
    updater: (current: CharacterMapState) => CharacterMapState
  ) => {
    const current = normalizeMapState(
      form.getFieldValue('map') as CharacterMapState | undefined
    )
    const next = updater(current)
    form.setFieldValue('map', next)
  }

  const setBiomeAt = (target: HexCoordinate, biome: BiomeId | undefined) => {
    updateMap(current => {
      const nextByKey = new Map(
        current.cells.map(cell => [toHexKey(cell), cell])
      )
      const key = toHexKey(target)
      const existing = nextByKey.get(key)
      const nextCell: CharacterMapCell = {
        q: target.q,
        r: target.r,
        biome,
        icon: existing?.icon,
      }
      if (!nextCell.biome && !nextCell.icon) nextByKey.delete(key)
      else nextByKey.set(key, nextCell)
      return { ...current, cells: Array.from(nextByKey.values()) }
    })
  }

  const setIconAt = (target: HexCoordinate, iconRaw: string | undefined) => {
    const icon = (iconRaw ?? '').trim()
    updateMap(current => {
      const nextByKey = new Map(
        current.cells.map(cell => [toHexKey(cell), cell])
      )
      const key = toHexKey(target)
      const existing = nextByKey.get(key)
      const nextCell: CharacterMapCell = {
        q: target.q,
        r: target.r,
        biome: existing?.biome,
        icon: icon || undefined,
      }
      if (!nextCell.biome && !nextCell.icon) nextByKey.delete(key)
      else nextByKey.set(key, nextCell)
      return { ...current, cells: Array.from(nextByKey.values()) }
    })
  }

  const clearCellAt = (target: HexCoordinate) => {
    updateMap(current => {
      const nextByKey = new Map(
        current.cells.map(cell => [toHexKey(cell), cell])
      )
      nextByKey.delete(toHexKey(target))
      return { ...current, cells: Array.from(nextByKey.values()) }
    })
  }

  const moveToCell = (target: HexCoordinate) => {
    updateMap(current => ({ ...current, currentPosition: target }))
  }

  const selectedBiome = selectedCellData?.biome

  return (
    <Card title={copy.playerCharacters.mapSection}>
      <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
        <Space wrap>
          <Tag>
            {copy.playerCharacters.mapSheet(
              visibleSheet.sheetQ,
              visibleSheet.sheetR
            )}
          </Tag>
          <Button
            htmlType='button'
            onClick={() =>
              setVisibleSheet(sheet => ({ ...sheet, sheetR: sheet.sheetR - 1 }))
            }>
            ↑
          </Button>
          <Button
            htmlType='button'
            onClick={() =>
              setVisibleSheet(sheet => ({ ...sheet, sheetR: sheet.sheetR + 1 }))
            }>
            ↓
          </Button>
          <Button
            htmlType='button'
            onClick={() =>
              setVisibleSheet(sheet => ({ ...sheet, sheetQ: sheet.sheetQ - 1 }))
            }>
            ←
          </Button>
          <Button
            htmlType='button'
            onClick={() =>
              setVisibleSheet(sheet => ({ ...sheet, sheetQ: sheet.sheetQ + 1 }))
            }>
            →
          </Button>
          <Button
            htmlType='button'
            onClick={() =>
              setVisibleSheet(getSheetCoordinate(mapState.currentPosition))
            }>
            {copy.playerCharacters.mapCenterOnCurrent}
          </Button>
        </Space>

        <Form.Item name='map' noStyle>
          <MapFormValueAnchor />
        </Form.Item>

        <MapDisplay
          sheet={visibleSheet}
          cellsByKey={cellsByKey}
          currentPosition={mapState.currentPosition}
          selectedPosition={selectedCell}
          onSelectCell={setSelectedCell}
          onAssignBiome={setBiomeAt}
          onMoveTo={moveToCell}
          onSetIcon={setIconAt}
          onClearCell={clearCellAt}
        />

        <Space direction='vertical' size='small' style={{ width: '100%' }}>
          <Typography.Text strong>
            {copy.playerCharacters.mapSelectedCell}:{' '}
            {getDisplayedCellLabel(selectedCell)}
          </Typography.Text>

          <Tag>
            {selectedBiome
              ? copy.playerCharacters.mapBiomes[selectedBiome]
              : copy.playerCharacters.mapUnexplored}
          </Tag>
        </Space>
      </Space>
    </Card>
  )
}
