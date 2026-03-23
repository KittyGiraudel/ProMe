'use client'

import { Button, Card, Form, Input, Select, Space, Tag, Typography } from 'antd'
import { useMemo, useState } from 'react'
import { MapDisplay } from '@/components/MapDisplay/MapDisplay'
import {
  getSheetCellAddress,
  getSheetCoordinate,
  type SheetCoordinate,
} from '@/lib/hex/coordinates'
import {
  BIOME_IDS,
  type BiomeId,
  type CharacterMapCell,
  type CharacterMapState,
  type HexCoordinate,
} from '@/lib/playerCharacter/types'
import { copy } from '@/messages/fr'

const CORE_POSITION: HexCoordinate = { q: 0, r: 0 }

function sameHex(a: HexCoordinate, b: HexCoordinate): boolean {
  return a.q === b.q && a.r === b.r
}

function toHexKey(coord: HexCoordinate): string {
  return `${coord.q},${coord.r}`
}

function normalizeMapState(
  value: CharacterMapState | undefined
): CharacterMapState {
  if (!value) {
    return { currentPosition: CORE_POSITION, cells: [] }
  }
  return {
    currentPosition: value.currentPosition ?? CORE_POSITION,
    cells: Array.isArray(value.cells) ? value.cells : [],
  }
}

export function MapCard() {
  const form = Form.useFormInstance()
  const watchedMap = Form.useWatch('map', form) as CharacterMapState | undefined
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

  const selectedKey = toHexKey(selectedCell)
  const selectedCellData = cellsByKey.get(selectedKey)
  const selectedIsCore = sameHex(selectedCell, CORE_POSITION)
  const selectedAddress = getSheetCellAddress(selectedCell)

  const updateMap = (
    updater: (current: CharacterMapState) => CharacterMapState
  ) => {
    const current = normalizeMapState(
      form.getFieldValue('map') as CharacterMapState | undefined
    )
    const next = updater(current)
    form.setFieldValue('map', next)
  }

  const setBiome = (biome: BiomeId | undefined) => {
    updateMap(current => {
      const nextByKey = new Map(
        current.cells.map(cell => [toHexKey(cell), cell])
      )
      const key = toHexKey(selectedCell)
      const existing = nextByKey.get(key)
      const nextCell: CharacterMapCell = {
        q: selectedCell.q,
        r: selectedCell.r,
        biome: selectedIsCore ? undefined : biome,
        icon: existing?.icon,
      }
      if (!nextCell.biome && !nextCell.icon) nextByKey.delete(key)
      else nextByKey.set(key, nextCell)
      return { ...current, cells: Array.from(nextByKey.values()) }
    })
  }

  const setIcon = (iconRaw: string) => {
    const icon = iconRaw.trim()
    updateMap(current => {
      const nextByKey = new Map(
        current.cells.map(cell => [toHexKey(cell), cell])
      )
      const key = toHexKey(selectedCell)
      const existing = nextByKey.get(key)
      const nextCell: CharacterMapCell = {
        q: selectedCell.q,
        r: selectedCell.r,
        biome: existing?.biome,
        icon: icon || undefined,
      }
      if (!nextCell.biome && !nextCell.icon) nextByKey.delete(key)
      else nextByKey.set(key, nextCell)
      return { ...current, cells: Array.from(nextByKey.values()) }
    })
  }

  const clearCell = () => {
    updateMap(current => {
      const nextByKey = new Map(
        current.cells.map(cell => [toHexKey(cell), cell])
      )
      nextByKey.delete(selectedKey)
      return { ...current, cells: Array.from(nextByKey.values()) }
    })
  }

  const moveToSelected = () => {
    updateMap(current => ({ ...current, currentPosition: selectedCell }))
  }

  const selectedBiome = selectedIsCore ? undefined : selectedCellData?.biome
  const selectedIcon = selectedCellData?.icon ?? ''

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

        <MapDisplay
          sheet={visibleSheet}
          cellsByKey={cellsByKey}
          currentPosition={mapState.currentPosition}
          selectedPosition={selectedCell}
          onSelectCell={setSelectedCell}
        />

        <Space direction='vertical' size='small' style={{ width: '100%' }}>
          <Typography.Text strong>
            {copy.playerCharacters.mapSelectedCell}:{' '}
            {selectedAddress.localLabel}
          </Typography.Text>
          <Typography.Text type='secondary'>
            {copy.playerCharacters.mapSheet(
              selectedAddress.sheetQ,
              selectedAddress.sheetR
            )}
          </Typography.Text>
          {selectedIsCore ? (
            <Tag color='gold'>{copy.playerCharacters.mapCore}</Tag>
          ) : (
            <Tag>
              {selectedBiome
                ? copy.playerCharacters.mapBiomes[selectedBiome]
                : copy.playerCharacters.mapUnexplored}
            </Tag>
          )}

          <Space wrap>
            <Typography.Text>
              {copy.playerCharacters.mapBiomeLabel}
            </Typography.Text>
            <Select
              value={selectedBiome}
              onChange={value => setBiome(value)}
              allowClear
              style={{ minWidth: 260 }}
              disabled={selectedIsCore}
              options={BIOME_IDS.map(id => ({
                label: copy.playerCharacters.mapBiomes[id],
                value: id,
              }))}
            />
          </Space>

          <Space wrap>
            <Typography.Text>
              {copy.playerCharacters.mapIconLabel}
            </Typography.Text>
            <Input
              value={selectedIcon}
              onChange={e => setIcon(e.target.value)}
              placeholder={copy.playerCharacters.mapIconPlaceholder}
              style={{ width: 220 }}
            />
            <Button htmlType='button' onClick={clearCell}>
              {copy.playerCharacters.mapClearCell}
            </Button>
            <Button type='primary' htmlType='button' onClick={moveToSelected}>
              {copy.playerCharacters.mapMoveHere}
            </Button>
          </Space>
        </Space>
      </Space>
    </Card>
  )
}
