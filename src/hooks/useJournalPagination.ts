'use client'

import type { FormListFieldData } from 'antd/es/form'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { PAGE_SIZE } from '@/hooks/useJournalActions'

export function useJournalPagination({
  fields,
  searchTerm,
}: {
  fields: FormListFieldData[]
  searchTerm: string
}) {
  const { settings } = useSettings()
  const [currentPage, setCurrentPage] = useState(1)
  const reverseChronological = settings.journal.timelineReverseChronological

  useEffect(
    function resetPageOnSearch() {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentPage(1)
    },
    [searchTerm]
  )

  const pagedFields = useMemo(() => {
    if (reverseChronological) {
      const total = fields.length
      const start = Math.max(0, total - currentPage * PAGE_SIZE)
      const end = total - (currentPage - 1) * PAGE_SIZE
      return fields.slice(start, end)
    }
    return fields.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  }, [fields, currentPage, reverseChronological])

  const onPageChange = useCallback((page: number) => {
    setCurrentPage(page)
    document.getElementById('journal')?.scrollIntoView({ block: 'center' })
  }, [])

  return useMemo(
    () => ({ currentPage, setCurrentPage, pagedFields, onPageChange }),
    [currentPage, pagedFields, onPageChange]
  )
}
