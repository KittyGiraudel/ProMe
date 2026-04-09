'use client'

import { App } from 'antd'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'
import { useWatchedClock } from '@/hooks/useCharacterSheetDerived'
import { computeClockMoveFromRawTarget } from './clock'

/**
 * Hook for character-sheet clock changes: updates the stored slice and surfaces feedback.
 * Same-phase ticks use a short `message` toast; day/night boundary crossings use `notification.warning`.
 *
 * @returns Callback — call with stamina, current clamped slice, and **unwrapped** next index
 * (e.g. `position + 1` / `position - 1`). Wrapping and phase detection use {@link computeClockMoveFromRawTarget}.
 */
export function useSetClockToRawTargetWithToast() {
  const { updateClock } = useWatchedClock()
  const { message, notification } = App.useApp()
  const t = useTranslations()

  return useCallback(
    ({
      stamina,
      position,
      nextPosition,
    }: {
      /** Current stamina; defines ring size. */
      stamina: number
      /** Current slice index, already clamped to the ring (`clampClockSliceIndex` in `./clock`). */
      position: number
      /** Unwrapped target index before modulo
       * (e.g. advance = `position + 1`, back = `position - 1`). */
      nextPosition: number
    }) => {
      const { wrapped, totalSegments, crossedDayNightBoundary, nextIsDay } =
        computeClockMoveFromRawTarget(stamina, position, nextPosition)

      updateClock(wrapped)

      if (crossedDayNightBoundary) {
        return notification.warning({
          title: t('characters.map.clock_phase_shift', {
            phase: nextIsDay ? 'day' : 'night',
          }),
          description:
            t('characters.map.clock_phase_shift_description') +
            '\n' +
            t('characters.map.clock_slice', {
              position: wrapped + 1,
              total: totalSegments,
            }),
          placement: 'bottomRight',
          duration: 5,
          actions: (
            <a href='#inventory'>
              {t('common.actions.go_to', {
                destination: t('characters.inventory.title'),
              })}
            </a>
          ),
        })
      }

      message.success(
        `${t('characters.map.clock_section')} : ${t(
          'characters.map.clock_slice',
          {
            position: wrapped + 1,
            total: totalSegments,
          }
        )}`,
        2
      )
    },
    [message, notification, t, updateClock]
  )
}
