import { describe, expect, it } from 'vitest'
import {
  FIRST_VISIT,
  isEligibleVisit,
  VISIT_WINDOW,
} from './usePWAInstallPrompt'

describe('isEligibleVisit', () => {
  it('returns false before the window opens', () => {
    expect(isEligibleVisit(1)).toBe(false)
  })

  it('returns true on the first eligible visit', () => {
    expect(isEligibleVisit(FIRST_VISIT)).toBe(true)
  })

  it('returns true on the last eligible visit', () => {
    expect(isEligibleVisit(FIRST_VISIT + VISIT_WINDOW - 1)).toBe(true)
  })

  it('returns false after the window closes', () => {
    expect(isEligibleVisit(FIRST_VISIT + VISIT_WINDOW)).toBe(false)
  })
})
