import type { _Translator } from 'next-intl'
import {
  clampClockSliceIndex,
  computeClockMoveFromRawTarget,
  countClockSegments,
  countHalfClockSegments,
  isClockDayPhase,
} from '@/lib/character/clock'
import type { JournalEntryPhase } from '@/lib/character/types'

export type AutoJournalClockAnchor = {
  phase: JournalEntryPhase
  /** 1-based slice index for {@link JournalEntry.slice} */
  slice: number
  currentClampedIndex: number
  nextClampedIndex: number
}

/**
 * Journal entries created after a map move target the **next** clock slice (current + 1, wrapped).
 */
export function computeAutoJournalClockAnchor(
  staminaCurrent: number,
  clockRaw: unknown
): AutoJournalClockAnchor {
  const position = clampClockSliceIndex(staminaCurrent, clockRaw)
  const { wrapped } = computeClockMoveFromRawTarget(
    staminaCurrent,
    position,
    position + 1
  )
  const segmentsPerHalf = countHalfClockSegments(staminaCurrent)
  const phase: JournalEntryPhase = isClockDayPhase(wrapped, segmentsPerHalf)
    ? 'day'
    : 'night'

  return {
    phase,
    slice: wrapped + 1,
    currentClampedIndex: position,
    nextClampedIndex: wrapped,
  }
}
