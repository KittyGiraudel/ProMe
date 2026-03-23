import { describe, expect, it } from 'vitest'
import {
  createDefaultPlayerCharacterInput,
  createPlayerCharacter,
  getDefaultPoolsForArchetype,
  normalizePlayerCharacter,
  validatePlayerCharacterForPersistence,
} from './model'

describe('playerCharacter/model', () => {
  it('default pools match archetype mapping', () => {
    expect(getDefaultPoolsForArchetype('warrior')).toEqual({
      health: { current: 2, max: 2 },
      courage: { current: 4, max: 4 },
      stamina: { current: 3, max: 3 },
    })
    expect(getDefaultPoolsForArchetype('pilgrim')).toEqual({
      health: { current: 3, max: 3 },
      courage: { current: 2, max: 2 },
      stamina: { current: 4, max: 4 },
    })
    expect(getDefaultPoolsForArchetype('bard')).toEqual({
      health: { current: 4, max: 4 },
      courage: { current: 3, max: 3 },
      stamina: { current: 2, max: 2 },
    })
  })

  it('createDefaultPlayerCharacterInput sets money=100 and archetype pools', () => {
    const input = createDefaultPlayerCharacterInput('pilgrim')
    expect(input.money).toBe(100)
    expect(input.health).toEqual({ current: 3, max: 3 })
    expect(input.courage).toEqual({ current: 2, max: 2 })
    expect(input.stamina).toEqual({ current: 4, max: 4 })
    expect(input.honor).toBe(0)
    expect(input.inspiration).toBe(0)
  })

  it('validate rejects empty inventory item labels', () => {
    const pc = createPlayerCharacter({
      inventory: [{ id: 'i1', label: '', quantity: 1 }],
      spellbook: [{ id: 's1', name: 'Feu' }],
    })

    const result = validatePlayerCharacterForPersistence(pc)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.join(';')).toMatch(/inventory item/i)
    }
  })

  it('validate rejects empty spell names', () => {
    const pc = createPlayerCharacter({
      inventory: [{ id: 'i1', label: 'Potion', quantity: 1 }],
      spellbook: [{ id: 's1', name: '' }],
    })

    const result = validatePlayerCharacterForPersistence(pc)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.join(';')).toMatch(/spell/i)
    }
  })

  it('validate accepts non-empty inventory and spells', () => {
    const pc = createPlayerCharacter({
      inventory: [
        { id: 'i1', label: 'Potion', quantity: 1 },
        { id: 'i2', label: 'Bois', quantity: 2 },
      ],
      spellbook: [{ id: 's1', name: 'Feu' }],
    })

    const result = validatePlayerCharacterForPersistence(pc)
    expect(result.ok).toBe(true)
  })

  it('validate rejects inventory above Endurance-based cap', () => {
    const inventory = Array.from({ length: 7 }, (_, i) => ({
      id: `i${i}`,
      label: `Obj${i}`,
      quantity: 1,
    }))

    const pc = createPlayerCharacter({
      stamina: { current: 1, max: 1 },
      inventory,
      spellbook: [{ id: 's1', name: 'Feu' }],
    })

    const result = validatePlayerCharacterForPersistence(pc)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.join(';')).toMatch(/Stamina/i)
    }
  })

  it('validate accepts inventory at Endurance-based cap', () => {
    const cap = 6 // stamina.current=1 => cap=6
    const inventory = Array.from({ length: cap }, (_, i) => ({
      id: `i${i}`,
      label: `Obj${i}`,
      quantity: 1,
    }))

    const pc = createPlayerCharacter({
      stamina: { current: 1, max: 1 },
      inventory,
      spellbook: [{ id: 's1', name: 'Feu' }],
    })

    const result = validatePlayerCharacterForPersistence(pc)
    expect(result.ok).toBe(true)
  })

  it('defaults map to sparse unexplored state at core position', () => {
    const pc = createPlayerCharacter()
    expect(pc.map.currentPosition).toEqual({ q: 0, r: 0 })
    expect(pc.map.cells).toEqual([])
  })

  it('normalize map deduplicates by coordinates and trims icon', () => {
    const normalized = normalizePlayerCharacter({
      id: 'pc-1',
      name: 'Test',
      archetype: 'warrior',
      map: {
        currentPosition: { q: 1.9, r: -2.2 },
        cells: [
          { q: 3.7, r: 4.1, biome: 'shadowForest', icon: '  🌳  ' },
          {
            q: 3,
            r: 4,
            biome: 'silentDesert',
            icon: '😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀',
          },
        ],
      },
    })
    expect(normalized).not.toBeNull()
    if (!normalized) return
    expect(normalized.map.currentPosition).toEqual({ q: 1, r: -2 })
    expect(normalized.map.cells).toHaveLength(1)
    expect(normalized.map.cells[0]).toEqual({
      q: 3,
      r: 4,
      biome: 'silentDesert',
      icon: '😀',
    })
  })

  it('normalize drops invalid biome and keeps core non-biome', () => {
    const normalized = normalizePlayerCharacter({
      id: 'pc-2',
      name: 'Test',
      archetype: 'pilgrim',
      map: {
        currentPosition: { q: 0, r: 0 },
        cells: [
          { q: 0, r: 0, biome: 'shadowForest', icon: '🏠' },
          { q: 2, r: 1, biome: 'invalidBiome', icon: '🧭' },
        ],
      },
    })
    expect(normalized).not.toBeNull()
    if (!normalized) return
    expect(normalized.map.cells).toEqual([
      { q: 0, r: 0, biome: undefined, icon: '🏠' },
      { q: 2, r: 1, biome: undefined, icon: '🧭' },
    ])
  })

  it('validate rejects core biome assignment', () => {
    const pc = createPlayerCharacter()
    pc.map.cells = [{ q: 0, r: 0, biome: 'shadowForest' }]
    const result = validatePlayerCharacterForPersistence(pc)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.join(';')).toMatch(/core map cell/i)
    }
  })
})

