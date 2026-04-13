'use client'

import { Form } from 'antd'
import { useTranslations } from 'next-intl'
import { useCallback, useMemo } from 'react'
import { useRandomBiomeDiscoveredNotification } from '@/components/MapCellContextMenu/useRandomBiomeDiscoveredNotification'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { useWatchedMap } from '@/hooks/useCharacterSheetDerived'
import { useSetClockToRawTargetWithToast } from '@/hooks/useSetClockToRawTargetWithToast'
import {
  removeCharacterMapCellAt,
  updateCharacterMapCellAt,
} from '@/lib/character/mapState'
import { randomId } from '@/lib/character/model'
import {
  type CellCoordinate,
  type JournalEntry,
  type StatPool,
} from '@/lib/character/types'
import { clampClockSliceIndex } from '@/lib/clock/clock'
import { computeAutoJournalClockAnchor } from '@/lib/journal/autoJournalFromMapMove'
import { formatDisplayedCellReference, isSameCell } from '@/lib/map/coordinates'
import { moveWithAutoBiome } from '@/lib/map/movement'
import { getRandomBiomeResult } from '@/lib/random/randomBiome'
import { type BiomeId } from '@/lib/types'

export function useMapActions() {
  const t = useTranslations()
  const { settings } = useSettings()
  const form = Form.useFormInstance()
  const setClockToRawTargetWithToast = useSetClockToRawTargetWithToast()
  const showNotification = useRandomBiomeDiscoveredNotification()
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
      showNotification(rolled)
    },
    [setBiomeAt, showNotification]
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
      const staminaCurrent =
        (form.getFieldValue('stamina') as StatPool | undefined)?.current ?? 0
      const clockBeforeMove = form.getFieldValue('clock')

      updateMap(current => {
        const result = moveWithAutoBiome(current, target)

        // Same cell: no move
        if (isSameCell(current.currentPosition, result.next.currentPosition))
          return result.next

        if (settings.map.tickClockOnMove) {
          const position = clampClockSliceIndex(staminaCurrent, clockBeforeMove)
          setClockToRawTargetWithToast({
            stamina: staminaCurrent,
            position,
            nextPosition: position + 1,
          })
        }

        if (settings.journal.createEntryOnMove) {
          const anchor = computeAutoJournalClockAnchor(
            staminaCurrent,
            clockBeforeMove
          )
          const prevPos = formatDisplayedCellReference(current.currentPosition)
          const newPos = formatDisplayedCellReference(target)
          const content = result.discoveredBiome
            ? t('characters.journal.auto_map_move_content_discovered', {
                biomeName: t(`common.biomes.${result.discoveredBiome.biome}`),
                curr: prevPos,
                next: newPos,
              })
            : t('characters.journal.auto_map_move_content', {
                curr: prevPos,
                next: newPos,
              })
          const now = new Date().toISOString()
          const newEntry: JournalEntry = {
            id: randomId(),
            content,
            createdAt: now,
            updatedAt: now,
            phase: anchor.phase,
            slice: anchor.slice,
          }
          const journalEntries = (form.getFieldValue('journalEntries') ??
            []) as JournalEntry[]
          form.setFieldValue('journalEntries', [...journalEntries, newEntry])
        }

        if (result.discoveredBiome) showNotification(result.discoveredBiome)

        return result.next
      })
    },
    [
      form,
      setClockToRawTargetWithToast,
      settings.journal.createEntryOnMove,
      settings.map.tickClockOnMove,
      t,
      updateMap,
      showNotification,
    ]
  )

  return useMemo(
    () => ({
      updateMap,
      setBiomeAt,
      setRandomBiomeAt,
      moveToCell,
      setIconAt,
      clearCellAt,
    }),
    [
      updateMap,
      setBiomeAt,
      setRandomBiomeAt,
      moveToCell,
      setIconAt,
      clearCellAt,
    ]
  )
}
