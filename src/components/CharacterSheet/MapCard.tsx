'use client'

import { App, Button, Card, Form, Space, Tag } from 'antd'
import { InfoCircleFilled } from '@ant-design/icons'
import { useEffect, useMemo, useRef, useState } from 'react'
import { MapDisplay } from '@/components/MapDisplay/MapDisplay'
import {
  toHexKey,
  getDisplayedCellLabel,
  getSheetCoordinate,
  isSameHex,
  type SheetCoordinate,
} from '@/lib/hex/coordinates'
import {
  type BiomeId,
  type CharacterMapCell,
  type CharacterMapState,
  type HexCoordinate,
} from '@/lib/character/types'
import { copy } from '@/messages/fr'
import { DEFAULT_MAP_POSITION } from '@/lib/character/model'
import { getRandomBiomeResult } from '@/lib/map/randomBiome'
import { moveWithAutoBiome } from '@/lib/map/movement'
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
  const { notification } = App.useApp()
  const form = Form.useFormInstance()
  const watchedMap = Form.useWatch('map', {
    form,
    preserve: true,
  }) as CharacterMapState | undefined
  const mapState = normalizeMapState(watchedMap)
  const [selectedCell, setSelectedCell] = useState<HexCoordinate | null>(
    mapState.currentPosition
  )
  const [visibleSheet, setVisibleSheet] = useState<SheetCoordinate>(() =>
    getSheetCoordinate(mapState.currentPosition)
  )

  const hasSyncedVisibleSheetRef = useRef(false)
  useEffect(() => {
    if (hasSyncedVisibleSheetRef.current) return
    if (watchedMap === undefined || watchedMap === null) return
    hasSyncedVisibleSheetRef.current = true
    const normalized = normalizeMapState(watchedMap)
    setVisibleSheet(getSheetCoordinate(normalized.currentPosition))
  }, [watchedMap])

  const cellsByKey = useMemo(() => {
    const next = new Map<string, CharacterMapCell>()
    for (const cell of mapState.cells) {
      next.set(toHexKey(cell), cell)
    }
    return next
  }, [mapState.cells])

  const toggleSelectCell = (coord: HexCoordinate) => {
    setSelectedCell(prev => (prev && isSameHex(prev, coord) ? null : coord))
  }

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

  const assignRandomBiomeAt = (target: HexCoordinate) => {
    const rolled = getRandomBiomeResult()
    const biomeName = copy.characters.mapBiomes[rolled.biome]
    setBiomeAt(target, rolled.biome)
    notification.info({
      icon: (
        <span className='Map__NotificationIcon' data-biome={rolled.biome}>
          <InfoCircleFilled />
        </span>
      ),
      title: copy.characters.mapRandomBiomeDiscoveredTitle,
      description: copy.characters.mapRandomBiomeDiscoveredDescription(
        biomeName,
        rolled.additionalTilesToMark
      ),
      placement: 'bottomRight',
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
    let discoveredBiome: ReturnType<typeof getRandomBiomeResult> | undefined
    updateMap(current => {
      const result = moveWithAutoBiome(current, target)
      discoveredBiome = result.discoveredBiome
      return result.next
    })
    if (discoveredBiome) {
      const biomeName = copy.characters.mapBiomes[discoveredBiome.biome]
      notification.info({
        icon: (
          <span
            className='Map__NotificationIcon'
            data-biome={discoveredBiome.biome}>
            <InfoCircleFilled />
          </span>
        ),
        message: copy.characters.mapRandomBiomeDiscoveredTitle,
        description: copy.characters.mapRandomBiomeDiscoveredDescription(
          biomeName,
          discoveredBiome.additionalTilesToMark
        ),
        placement: 'bottomRight',
      })
    }
  }

  const sheetForCurrentPosition = getSheetCoordinate(mapState.currentPosition)
  const isViewingCurrentSheet =
    visibleSheet.sheetQ === sheetForCurrentPosition.sheetQ &&
    visibleSheet.sheetR === sheetForCurrentPosition.sheetR

  return (
    <Card title={copy.characters.mapSection}>
      <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
        <Space wrap>
          <Tag>
            {copy.characters.mapSheet(visibleSheet.sheetQ, visibleSheet.sheetR)}
          </Tag>
          <Tag>
            {copy.characters.mapCharacterPosition}
            {' : '}
            {getDisplayedCellLabel(mapState.currentPosition)}
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
          {!isViewingCurrentSheet ? (
            <Button
              htmlType='button'
              onClick={() =>
                setVisibleSheet(getSheetCoordinate(mapState.currentPosition))
              }>
              {copy.characters.mapCenterOnCurrent}
            </Button>
          ) : null}
        </Space>

        <Form.Item name='map' noStyle>
          <MapFormValueAnchor />
        </Form.Item>

        <MapDisplay
          sheet={visibleSheet}
          cellsByKey={cellsByKey}
          currentPosition={mapState.currentPosition}
          selectedPosition={selectedCell}
          onSelectCell={toggleSelectCell}
          onAssignBiome={setBiomeAt}
          onAssignRandomBiome={assignRandomBiomeAt}
          onMoveTo={moveToCell}
          onSetIcon={setIconAt}
          onClearCell={clearCellAt}
        />
      </Space>
    </Card>
  )
}
