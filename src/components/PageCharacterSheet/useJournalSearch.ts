'use client'

import { FormListFieldData } from 'antd'
import { useMemo, useState } from 'react'
import { JournalEntry } from '@/lib/character/types'
import { useWatchedJournal } from './useCharacterSheetDerived'

export function filterJournalFields(
  fields: FormListFieldData[],
  journal: JournalEntry[],
  searchTerm: string
): FormListFieldData[] {
  if (searchTerm === '') return fields
  const term = searchTerm.toLowerCase()

  return fields.filter((_, index) =>
    journal[index]?.content.toLowerCase().includes(term)
  )
}

export function useJournalSearch(fields: FormListFieldData[]) {
  const journal = useWatchedJournal()
  const [searchTerm, setSearchTerm] = useState('')
  const filtered = filterJournalFields(fields, journal, searchTerm)

  return useMemo(
    () => ({ searchTerm, setSearchTerm, fields: filtered }),
    [searchTerm, filtered]
  )
}
