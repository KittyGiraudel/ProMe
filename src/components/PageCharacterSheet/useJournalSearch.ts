'use client'

import { FormListFieldData } from 'antd'
import { useMemo, useState } from 'react'
import { JournalEntry } from '@/lib/character/types'

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

export function useJournalSearch(
  fields: FormListFieldData[],
  journal: JournalEntry[]
) {
  const [searchTerm, setSearchTerm] = useState('')
  const filteredFields = filterJournalFields(fields, journal, searchTerm)

  return useMemo(
    () => ({ searchTerm, setSearchTerm, filteredFields }),
    [searchTerm, filteredFields]
  )
}
