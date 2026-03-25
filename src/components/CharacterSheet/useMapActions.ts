'use client'

import { App, Form } from 'antd'
import { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { isSameHex } from '@/lib/hex/coordinates'
import {
  type BiomeId,
  type CharacterMapState,
  type HexCoordinate,
  type StatPool,
} from '@/lib/character/types'
import { useSetClockToRawTargetWithToast } from '@/lib/character/clockPositionNotifications'
import { clampClockSliceIndex } from '@/lib/character/clock'
import {
  normalizeMapState,
  removeCharacterMapCellAt,
  updateCharacterMapCellAt,
} from '@/lib/character/mapState'
import { getRandomBiomeResult } from '@/lib/map/randomBiome'
import { moveWithAutoBiome } from '@/lib/map/movement'
import { useSettings } from '@/app/[locale]/contexts/SettingsContext'
import { showRandomBiomeDiscoveredNotification } from './mapRandomBiomeNotification'

export function useMapActions() {
  const t = useTranslations()
  const { notification } = App.useApp()
  const { settings } = useSettings()
  const form = Form.useFormInstance()

  const updateClock = useCallback(
    (wrapped: number) => form.setFieldValue('clock', wrapped),
    [form]
  )
  const setClockToRawTargetWithToast = useSetClockToRawTargetWithToast({
    updateClock,
  })

  const updateMap = useCallback(
    (updater: (current: CharacterMapState) => CharacterMapState) => {
      const current = normalizeMapState(
        form.getFieldValue('map') as CharacterMapState | undefined
      )
      form.setFieldValue('map', updater(current))
    },
    [form]
  )

  const setBiomeAt = useCallback(
    (target: HexCoordinate, biome: BiomeId | undefined) => {
      updateMap(current =>
        updateCharacterMapCellAt(current, target, existing => ({
          q: target.q,
          r: target.r,
          biome,
          icon: existing?.icon,
        }))
      )
    },
    [updateMap]
  )

  const setRandomBiomeAt = useCallback(
    (target: HexCoordinate) => {
      const rolled = getRandomBiomeResult()
      setBiomeAt(target, rolled.biome)
      showRandomBiomeDiscoveredNotification({ notification, t, rolled })
    },
    [notification, setBiomeAt, t]
  )

  const setIconAt = useCallback(
    (target: HexCoordinate, iconRaw: string | undefined) => {
      const icon = (iconRaw ?? '').trim()
      updateMap(current =>
        updateCharacterMapCellAt(current, target, existing => ({
          q: target.q,
          r: target.r,
          biome: existing?.biome,
          icon: icon || undefined,
        }))
      )
    },
    [updateMap]
  )

  const clearCellAt = useCallback(
    (target: HexCoordinate) => {
      updateMap(current => removeCharacterMapCellAt(current, target))
    },
    [updateMap]
  )

  const moveToCell = useCallback(
    (target: HexCoordinate) => {
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
        showRandomBiomeDiscoveredNotification({
          notification,
          t,
          rolled: discoveredBiome,
        })
      }
    },
    [
      form,
      notification,
      setClockToRawTargetWithToast,
      settings.map.tickClockOnMove,
      t,
      updateMap,
    ]
  )

  return {
    updateMap,
    setBiomeAt,
    setRandomBiomeAt,
    moveToCell,
    setIconAt,
    clearCellAt,
  }
}
