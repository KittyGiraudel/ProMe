'use client'

import { App } from 'antd'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'
import { computeClockMoveFromRawTarget } from './clock'
import { useParams } from 'next/navigation'
import { Link } from '@/i18n/navigation'

/**
 * Hook for character-sheet clock changes: updates the stored slice and surfaces feedback.
 * Same-phase ticks use a short `message` toast; day/night boundary crossings use `notification.warning`.
 *
 * @param updateClock - Writes the new wrapped slice index (e.g. `form.setFieldValue('clock', …)`).
 * @returns Callback — call with stamina, current clamped slice, and **unwrapped** next index
 * (e.g. `position + 1` / `position - 1`). Wrapping and phase detection use {@link computeClockMoveFromRawTarget}.
 */
export function useSetClockToRawTargetWithToast({
  updateClock,
}: {
  updateClock: (wrapped: number) => void
}) {
  const { message, notification } = App.useApp()
  const t = useTranslations()
  const { id: characterId } = useParams()

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
        notification.warning({
          title: t(
            nextIsDay
              ? 'characters.map.clock_phase_shift_day'
              : 'characters.map.clock_phase_shift_night'
          ),
          description:
            t('characters.map.clock_phase_shift_description') +
            '\n' +
            t('characters.map.clock_slice', {
              position: wrapped + 1,
              total: totalSegments,
            }),
          placement: 'bottomRight',
          duration: 4,
          actions: (
            <Link href={`/characters/${characterId}/inventory`}>
              {t('common.go_to', {
                destination: t('characters.inventory.title'),
              })}
            </Link>
          ),
        })
        return
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
