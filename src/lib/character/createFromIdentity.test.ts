import { describe, expect, it } from 'vitest'
import { createCharacterFromIdentity } from './createFromIdentity'

describe('character/createFromIdentity', () => {
  it('creates a character from identity fields and keeps default sheet values', () => {
    const created = createCharacterFromIdentity({
      name: 'Ariane',
      archetype: 'pilgrim',
      gender: 'woman',
    })

    expect(created.name).toBe('Ariane')
    expect(created.archetype).toBe('pilgrim')
    expect(created.gender).toBe('woman')
    expect(created.inventory).toEqual([])
    expect(created.spellbook).toEqual([])
    expect(created.journalEntries).toEqual([])
  })
})
