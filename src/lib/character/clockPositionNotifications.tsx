'use client'

import { App } from 'antd'
import { useLocale, useTranslations } from 'next-intl'
import NextLink from 'next/link'
import { useCallback } from 'react'
import { useCharacterLink } from '@/components/PageCharacterSheet/useCharacterLink'
import { computeClockMoveFromRawTarget } from './clock'

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
  const locale = useLocale()
  const getCharacterLink = useCharacterLink({ tabId: 'inventory' })
  const inventoryLink = `/${locale}${getCharacterLink()}`

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
          duration: 4,
          actions: (
            <NextLink href={inventoryLink}>
              {t('common.actions.go_to', {
                destination: t('characters.inventory.title'),
              })}
            </NextLink>
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
    [message, notification, t, updateClock, inventoryLink]
  )
}
