import { describe, expect, it } from 'vitest'
import { getFeatureVisualParallax } from './featureParallax'

describe('getFeatureVisualParallax', () => {
  it('returns centered parallax when element center matches viewport center', () => {
    const result = getFeatureVisualParallax({
      rectTop: 300,
      rectHeight: 200,
      viewportHeight: 800,
      reversed: false,
    })

    expect(result.translateY).toBe(0)
    expect(result.rotateY).toBe(-10)
    expect(result.rotateX).toBe(5)
  })

  it('adds a subtle movement and tilt variation when card is above center', () => {
    const result = getFeatureVisualParallax({
      rectTop: 100,
      rectHeight: 200,
      viewportHeight: 800,
      reversed: false,
    })

    expect(result.translateY).toBe(-4.5)
    expect(result.rotateY).toBe(-9.2)
    expect(result.rotateX).toBe(4.55)
  })

  it('mirrors horizontal tilt for reversed cards', () => {
    const result = getFeatureVisualParallax({
      rectTop: 100,
      rectHeight: 200,
      viewportHeight: 800,
      reversed: true,
    })

    expect(result.rotateY).toBe(9.2)
  })
})
