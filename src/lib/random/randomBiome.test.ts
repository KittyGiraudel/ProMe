import { describe, expect, it } from 'vitest'
import { getRandomBiomeResult } from './randomBiome'

describe('getRandomBiomeResult', () => {
  const fromValue = (value: number) => getRandomBiomeResult(() => value)

  it('maps each 1d6 bucket to the expected biome', () => {
    expect(fromValue(0.0).biome).toBe('shadowForest')
    expect(fromValue(0.2).biome).toBe('floodedPlains')
    expect(fromValue(0.4).biome).toBe('mushroomJungle')
    expect(fromValue(0.6).biome).toBe('fieldSea')
    expect(fromValue(0.8).biome).toBe('silentDesert')
    expect(fromValue(0.99).biome).toBe('giganticGardens')
  })

  it('returns the additional tile count guidance', () => {
    expect(fromValue(0.0)).toMatchObject({
      totalTiles: 3,
      additionalTilesToMark: 2,
    })
    expect(fromValue(0.4)).toMatchObject({
      totalTiles: 2,
      additionalTilesToMark: 1,
    })
  })
})
