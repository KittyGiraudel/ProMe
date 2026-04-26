import { describe, expect, it } from 'vitest'
import { createCharacterFromIdentity } from './createFromIdentity'
import { createCharacter } from './model'

describe('character/createFromIdentity', () => {
  it('creates a character from identity fields and keeps default sheet values', () => {
    const created = createCharacterFromIdentity({
      name: 'Ariane',
      archetype: 'wanderer',
      gender: 'woman',
    })

    expect(created.name).toBe('Ariane')
    expect(created.archetype).toBe('wanderer')
    expect(created.gender).toBe('woman')
    expect(created.inventory).toEqual([])
    expect(created.spellbook).toEqual([])
    expect(created.journalEntries).toEqual([])
  })

  it('inherits full map and journal entries from another protector', () => {
    const source = createCharacter({
      name: 'Source',
      map: {
        currentPosition: { q: 3, r: -1 },
        cells: [
          { q: 0, r: 0, biome: 'prairieSea', icon: 'x' },
          { q: 1, r: 0, biome: 'shadowWoods', icon: 'o' },
        ],
      },
      journalEntries: [
        {
          id: 'entry-1',
          content: '# Memory one',
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
        {
          id: 'entry-2',
          content: 'Second note',
          createdAt: '2026-01-02T00:00:00.000Z',
          updatedAt: '2026-01-02T00:00:00.000Z',
        },
      ],
    })

    const created = createCharacterFromIdentity(
      {
        name: 'Heir',
        archetype: 'swordbearer',
      },
      source
    )

    expect(created.map).toEqual(source.map)
    expect(created.journalEntries).toEqual(source.journalEntries)

    expect(created.map).not.toBe(source.map)
    expect(created.map.cells).not.toBe(source.map.cells)
    expect(created.journalEntries).not.toBe(source.journalEntries)
  })
})
