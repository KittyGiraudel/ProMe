'use client'

import { App, Form } from 'antd'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'
import { showRandomBiomeDiscoveredNotification } from '@/components/MapCellContextMenu/mapRandomBiomeNotification'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { useWatchedMap } from '@/hooks/useCharacterSheetDerived'
import { clampClockSliceIndex } from '@/lib/character/clock'
import { useSetClockToRawTargetWithToast } from '@/lib/character/clockPositionNotifications'
import {
  normalizeMapState,
  removeCharacterMapCellAt,
  updateCharacterMapCellAt,
} from '@/lib/character/mapState'
import {
  type CellCoordinate,
  type CharacterMapState,
  type StatPool,
} from '@/lib/character/types'
import { isSameCell } from '@/lib/map/coordinates'
import { moveWithAutoBiome } from '@/lib/map/movement'
import { getRandomBiomeResult } from '@/lib/random/randomBiome'
import { type BiomeId } from '@/lib/types'

export function useMapActions() {
  const t = useTranslations()
  const { notification } = App.useApp()
  const { settings } = useSettings()
  const form = Form.useFormInstance()
  const setClockToRawTargetWithToast = useSetClockToRawTargetWithToast()
  const { updateMap } = useWatchedMap()

  const setBiomeAt = useCallback(
    (target: CellCoordinate, biome: BiomeId | undefined) => {
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
    (target: CellCoordinate) => {
      const rolled = getRandomBiomeResult()
      setBiomeAt(target, rolled.biome)
      showRandomBiomeDiscoveredNotification({ notification, t, rolled })
    },
    [notification, setBiomeAt, t]
  )

  const setIconAt = useCallback(
    (target: CellCoordinate, iconRaw: string | undefined) => {
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
    (target: CellCoordinate) => {
      updateMap(current => removeCharacterMapCellAt(current, target))
    },
    [updateMap]
  )

  const moveToCell = useCallback(
    (target: CellCoordinate) => {
      let discoveredBiome: ReturnType<typeof getRandomBiomeResult> | undefined
      let moved = false
      updateMap(current => {
        const result = moveWithAutoBiome(current, target)
        discoveredBiome = result.discoveredBiome
        moved = !isSameCell(
          current.currentPosition,
          result.next.currentPosition
        )
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
