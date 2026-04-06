import { describe, expect, it } from 'vitest'
import { computeAutoJournalClockAnchor } from './autoJournalFromMapMove'

describe('computeAutoJournalClockAnchor', () => {
  it('maps current slice 0 to next day slice 1 (1-based journal slice 2)', () => {
    const stamina = 3
    const anchor = computeAutoJournalClockAnchor(stamina, 0)
    expect(anchor.currentClampedIndex).toBe(0)
    expect(anchor.nextClampedIndex).toBe(1)
    expect(anchor.phase).toBe('day')
    expect(anchor.slice).toBe(2)
  })

  it('wraps last ring slice back to the first slice', () => {
    const stamina = 2
    const total = 4
    const last = total - 1
    const anchor = computeAutoJournalClockAnchor(stamina, last)
    expect(anchor.currentClampedIndex).toBe(last)
    expect(anchor.nextClampedIndex).toBe(0)
    expect(anchor.phase).toBe('day')
    expect(anchor.slice).toBe(1)
  })
})
