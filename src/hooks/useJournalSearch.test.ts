import type { FormListFieldData } from 'antd'
import { describe, expect, it } from 'vitest'
import type { JournalEntry } from '@/lib/character/types'
import { filterJournalFields } from './useJournalSearch'

function makeField(key: number): FormListFieldData {
  return { key, name: key }
}

function makeEntry(content: string): JournalEntry {
  return { id: String(key++), content, createdAt: '', updatedAt: '' }
}

let key = 0

describe('filterJournalFields', () => {
  it('empty search returns all fields', () => {
    const fields = [makeField(0), makeField(1)]
    const journal = [makeEntry('Hello world'), makeEntry('Another entry')]
    expect(filterJournalFields(fields, journal, '')).toBe(fields)
  })

  it('non-empty search filters correctly (case-insensitive)', () => {
    const fields = [makeField(0), makeField(1), makeField(2)]
    const journal = [
      makeEntry('Hello world'),
      makeEntry('Another entry'),
      makeEntry('HELLO again'),
    ]
    const result = filterJournalFields(fields, journal, 'hello')
    expect(result).toEqual([fields[0], fields[2]])
  })

  it('search with no matches returns empty array', () => {
    const fields = [makeField(0), makeField(1)]
    const journal = [makeEntry('Hello world'), makeEntry('Another entry')]
    expect(filterJournalFields(fields, journal, 'zzz')).toEqual([])
  })
})
