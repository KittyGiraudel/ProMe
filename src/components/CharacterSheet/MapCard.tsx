'use client'

import { App, Card, ConfigProvider, Form, Space, Tag } from 'antd'
import { InfoCircleFilled } from '@ant-design/icons'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  type JournalEntry,
  type StatPool,
} from '@/lib/character/types'
import { useSetClockToRawTargetWithToast } from '@/lib/character/clockPositionNotifications'
import { clampClockSliceIndex } from '@/lib/character/clock'
import { DEFAULT_MAP_POSITION } from '@/lib/character/model'
import { getRandomBiomeResult } from '@/lib/map/randomBiome'
import { moveWithAutoBiome } from '@/lib/map/movement'
import { MapFormValueAnchor } from './MapFormValueAnchor'
import { Button } from '@/components/Button/Button'
import { useMapHashNavigation } from './useMapHashNavigation'
import { useTranslations } from 'next-intl'
import { buildCellReferenceToJournalEntriesIndex } from '@/lib/journal/cellReferenceIndex'
import { useSettings } from '@/app/[locale]/contexts/SettingsContext'

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
  const t = useTranslations()
  const { settings } = useSettings()
  const { notification } = App.useApp()
  const { componentDisabled } = ConfigProvider.useConfig()
  const form = Form.useFormInstance()
  const watchedMap = Form.useWatch('map', {
    form,
    preserve: true,
  }) as CharacterMapState | undefined
  const watchedJournalEntries = Form.useWatch('journalEntries', {
    form,
    preserve: true,
  }) as JournalEntry[] | undefined
  const mapState = normalizeMapState(watchedMap)
  const [selectedCell, setSelectedCell] = useState<HexCoordinate | null>(null)
  const [visibleSheet, setVisibleSheet] = useState<SheetCoordinate>(() =>
    getSheetCoordinate(mapState.currentPosition)
  )
  const updateClock = useCallback(
    (wrapped: number) => form.setFieldValue('clock', wrapped),
    [form]
  )
  const setClockToRawTargetWithToast = useSetClockToRawTargetWithToast({
    updateClock,
  })

  const hasSyncedVisibleSheetRef = useRef(false)
  const cardRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (hasSyncedVisibleSheetRef.current) return
    if (watchedMap === undefined || watchedMap === null) return
    hasSyncedVisibleSheetRef.current = true
    const normalized = normalizeMapState(watchedMap)
    setVisibleSheet(getSheetCoordinate(normalized.currentPosition))
  }, [watchedMap])

  useEffect(() => {
    if (componentDisabled) setSelectedCell(null)
  }, [componentDisabled])

  useMapHashNavigation({
    selectedCell,
    setSelectedCell,
    visibleSheet,
    setVisibleSheet,
    cardRef,
  })

  const cellsByKey = useMemo(() => {
    const next = new Map<string, CharacterMapCell>()
    for (const cell of mapState.cells) {
      next.set(toHexKey(cell), cell)
    }
    return next
  }, [mapState.cells])

  const journalIndexByCellRef = useMemo(
    () => buildCellReferenceToJournalEntriesIndex(watchedJournalEntries),
    [watchedJournalEntries]
  )

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
    const biomeName = t(`common.biomes.${rolled.biome}`)
    setBiomeAt(target, rolled.biome)
    notification.info({
      icon: (
        <span className='Map__NotificationIcon' data-biome={rolled.biome}>
          <InfoCircleFilled />
        </span>
      ),
      title: t('characters.map.random_biome_discovered_title'),
      description: t('characters.map.random_biome_discovered_description', {
        biomeName,
        additionalTilesToMark: rolled.additionalTilesToMark,
      }),
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
    let moved = false
    updateMap(current => {
      const result = moveWithAutoBiome(current, target)
      discoveredBiome = result.discoveredBiome
      moved = !isSameHex(current.currentPosition, result.next.currentPosition)
      return result.next
    })
    if (settings.map.tickClockOnMove && moved) {
      const staminaCurrent =
        (form.getFieldValue('stamina') as StatPool | undefined)?.current ?? 0
      const position = clampClockSliceIndex(
        staminaCurrent,
        form.getFieldValue('clock')
      )
      setClockToRawTargetWithToast({
        stamina: staminaCurrent,
        position,
        nextPosition: position + 1,
      })
    }
    if (discoveredBiome) {
      const biomeName = t(`common.biomes.${discoveredBiome.biome}`)
      notification.info({
        icon: (
          <span
            className='Map__NotificationIcon'
            data-biome={discoveredBiome.biome}>
            <InfoCircleFilled />
          </span>
        ),
        title: t('characters.map.random_biome_discovered_title'),
        description: t('characters.map.random_biome_discovered_description', {
          biomeName,
          additionalTilesToMark: discoveredBiome.additionalTilesToMark,
        }),
        placement: 'bottomRight',
      })
    }
  }

  const sheetForCurrentPosition = getSheetCoordinate(mapState.currentPosition)
  const isViewingCurrentSheet =
    visibleSheet.sheetQ === sheetForCurrentPosition.sheetQ &&
    visibleSheet.sheetR === sheetForCurrentPosition.sheetR

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
            journalIndexByCellRef={journalIndexByCellRef}
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
      </div>
    </Card>
  )
}
