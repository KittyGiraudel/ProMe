import { describe, expect, it } from 'vitest'
import {
  clampClockSliceIndex,
  computeClockMoveFromRawTarget,
  isClockDayPhase,
  isClockNightPhase,
} from './clock'

describe('character/clock', () => {
  it('isClockDayPhase / isClockNightPhase split at segmentsPerHalf', () => {
    const half = 3
    expect(isClockDayPhase(0, half)).toBe(true)
    expect(isClockDayPhase(2, half)).toBe(true)
    expect(isClockNightPhase(2, half)).toBe(false)
    expect(isClockDayPhase(3, half)).toBe(false)
    expect(isClockNightPhase(3, half)).toBe(true)
  })

  it('computeClockMoveFromRawTarget wraps and detects day/night crossing', () => {
    // stamina 3 → 6 segments, day = indices 0–2
    expect(computeClockMoveFromRawTarget(3, 2, 3)).toEqual({
      wrapped: 3,
      totalSegments: 6,
      crossedDayNightBoundary: true,
      nextIsDay: false,
    })
    expect(computeClockMoveFromRawTarget(3, 5, 6)).toEqual({
      wrapped: 0,
      totalSegments: 6,
      crossedDayNightBoundary: true,
      nextIsDay: true,
    })
    expect(computeClockMoveFromRawTarget(3, 1, 2)).toEqual({
      wrapped: 2,
      totalSegments: 6,
      crossedDayNightBoundary: false,
      nextIsDay: true,
    })
  })

  it('computeClockMoveFromRawTarget handles negative raw target', () => {
    expect(computeClockMoveFromRawTarget(3, 0, -1)).toEqual({
      wrapped: 5,
      totalSegments: 6,
      crossedDayNightBoundary: true,
      nextIsDay: false,
    })
  })

  it('clampClockSliceIndex matches ring size for stamina', () => {
    expect(clampClockSliceIndex(3, 2)).toBe(2)
    expect(clampClockSliceIndex(3, 99)).toBe(5)
    expect(clampClockSliceIndex(3, -1)).toBe(0)
  })
})
