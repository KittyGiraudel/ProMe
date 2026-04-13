/**
 * Protector clock (rulebook ring tied to stamina).
 *
 * API sketch:
 * - **Ring size** — `countHalfClockSegments`, `countClockSegments`
 * - **Slice index** — clamp or normalize a stored value onto the ring (`clampClockSliceIndex`, `normalizeClock`)
 * - **Moves** — wrap an unwrapped index and detect day/night boundary (`computeClockMoveFromRawTarget`)
 * - **Phase** — day vs night half (`isClockDayPhase`, `isClockNightPhase`)
 * - **Stamina changed** — rescale slice index when segment count changes (`remapClockPositionForTotalSegments`)
 *
 * Sheet toasts when the clock changes are handled in `clockPositionNotifications.ts` (Ant Design + i18n).
 */

/** Result of folding an unwrapped target index onto the ring and comparing day vs night. */
export type ClockMoveFromRawTarget = {
  /** Slice index after wrapping, in `0 … totalSegments - 1`. */
  wrapped: number
  /** Ring size used for the move (from stamina at move time). */
  totalSegments: number
  /** True when the new slice is on the opposite side of the day/night split. */
  crossedDayNightBoundary: boolean
  /** True when `wrapped` falls in the day half (indices `< segmentsPerHalf`). */
  nextIsDay: boolean
}

/**
 * Parses a numeric value as a truncated integer, or returns `fallback` if it is not a finite number.
 */
function asInt(value: unknown, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback
  return Math.trunc(value)
}

/**
 * Clamps a candidate slice index onto `[0, totalSegments - 1]`.
 * Non-numbers are treated as `0` after integer truncation rules in {@link asInt}.
 */
function normalizeSliceIndex(position: unknown, totalSegments: number): number {
  const asInteger = asInt(position, 0)
  if (totalSegments <= 0) return 0
  if (asInteger < 0) return 0
  if (asInteger >= totalSegments) return totalSegments - 1
  return asInteger
}

/**
 * Number of slices in the **day** half of the ring (and likewise for night), from current stamina.
 * Rulebook: at least 1 per half; uses `Math.trunc(staminaCurrent)` floored to a minimum of 1.
 */
export function countHalfClockSegments(staminaCurrent: number): number {
  return Math.max(1, Math.trunc(staminaCurrent))
}

/**
 * Total number of slices on the full ring (day half + night half) for the given stamina.
 * Always `2 ×` {@link countHalfClockSegments}.
 */
export function countClockSegments(staminaCurrent: number): number {
  return countHalfClockSegments(staminaCurrent) * 2
}

/**
 * Whether a **clamped** slice index is in the day half (`0 … segmentsPerHalf - 1`).
 * Use `segmentsPerHalf` from {@link countHalfClockSegments} (always ≥ 1 in normal play).
 */
export function isClockDayPhase(
  clampedSliceIndex: number,
  segmentsPerHalf: number
): boolean {
  return clampedSliceIndex < segmentsPerHalf
}

/**
 * Whether a clamped slice index is in the night half (`segmentsPerHalf … total - 1`).
 */
export function isClockNightPhase(
  clampedSliceIndex: number,
  segmentsPerHalf: number
): boolean {
  return clampedSliceIndex >= segmentsPerHalf
}

/**
 * Folds an **unwrapped** target index onto the clock ring, then compares day/night vs the previous slice.
 *
 * `unwrappedTargetIndex` may be any integer (e.g. `position + 1` for advance, `position - 1` for back);
 * it is reduced modulo the ring size so the stored value stays in range.
 *
 * @param staminaCurrent - Current stamina; defines ring size.
 * @param clampedPreviousPosition - Previous slice index already clamped to the ring (see {@link clampClockSliceIndex}).
 * @param unwrappedTargetIndex - Desired index before wrapping (may be negative or ≥ `totalSegments`).
 * @returns Wrapped index, ring size, and whether the move crossed the day/night boundary.
 */
export function computeClockMoveFromRawTarget(
  staminaCurrent: number,
  clampedPreviousPosition: number,
  unwrappedTargetIndex: number
): ClockMoveFromRawTarget {
  const segmentsPerHalf = countHalfClockSegments(staminaCurrent)
  const totalSegments = segmentsPerHalf * 2
  const wrapped =
    ((unwrappedTargetIndex % totalSegments) + totalSegments) % totalSegments
  const wasDay = isClockDayPhase(clampedPreviousPosition, segmentsPerHalf)
  const nextIsDay = isClockDayPhase(wrapped, segmentsPerHalf)

  return {
    wrapped,
    totalSegments,
    crossedDayNightBoundary: wasDay !== nextIsDay,
    nextIsDay,
  }
}

/**
 * Returns the current clock **slice index** on the ring for UI and move math.
 *
 * @param staminaCurrent - Defines ring size via {@link countClockSegments}.
 * @param clock - Raw stored value (form field); clamped to `0 … totalSegments - 1`.
 */
export function clampClockSliceIndex(
  staminaCurrent: number,
  clock: unknown
): number {
  return normalizeSliceIndex(clock, countClockSegments(staminaCurrent))
}

/**
 * When stamina (hence ring size) changes, maps an old slice index to the closest slice on the new ring
 * by proportional position, then clamps to valid range.
 *
 * @param position - Slice index on the **old** ring (should already be valid for `fromTotalSegments`).
 * @param fromTotalSegments - Previous ring size (0 if unknown / degenerate).
 * @param toTotalSegments - New ring size after stamina change.
 */
export function remapClockPositionForTotalSegments(
  position: number,
  fromTotalSegments: number,
  toTotalSegments: number
): number {
  if (toTotalSegments <= 0) return 0
  if (fromTotalSegments <= 0)
    return normalizeSliceIndex(position, toTotalSegments)
  const normalizedFrom = normalizeSliceIndex(position, fromTotalSegments)
  const ratio = normalizedFrom / fromTotalSegments
  const remapped = Math.floor(ratio * toTotalSegments)
  return normalizeSliceIndex(remapped, toTotalSegments)
}

/**
 * Normalizes persisted or imported clock data to a valid slice index for the given stamina.
 *
 * Accepts a plain number or legacy `{ position: number }` shape; clamps to the current ring.
 *
 * @param value - Raw clock field from storage/import.
 * @param staminaCurrent - Current stamina; defines ring size.
 */
export function normalizeClock(value: unknown, staminaCurrent: number): number {
  const source =
    typeof value === 'object' && value !== null
      ? (value as { position?: unknown })
      : undefined
  const candidatePosition =
    source && 'position' in source ? source.position : value
  const totalSegments = countClockSegments(staminaCurrent)

  return normalizeSliceIndex(candidatePosition, totalSegments)
}
