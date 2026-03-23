import { describe, expect, it } from 'vitest'
import {
  createDefaultPlayerCharacterInput,
  createPlayerCharacter,
  getDefaultPoolsForArchetype,
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
})

