import type { JournalEntry } from '@/lib/character/types'
import { extractDisplayedCellReferences } from '@/lib/hex/coordinates'

export type JournalEntryLink = {
  entryId: string
  createdAt?: string
  content?: string
}

export function buildCellReferenceToJournalEntriesIndex(
  entries: JournalEntry[] | undefined | null
): Map<string, JournalEntryLink[]> {
  const index = new Map<string, JournalEntryLink[]>()
  if (!entries || entries.length === 0) return index

  for (const entry of entries) {
    const entryId = entry.id
    if (!entryId) continue

    const content = entry.content ?? ''
    const refs = extractDisplayedCellReferences(content)
    if (refs.length === 0) continue

    const link: JournalEntryLink = {
      entryId,
      createdAt: entry.createdAt,
      content: entry.content,
    }

    for (const ref of refs) {
      const existing = index.get(ref)
      if (existing) existing.push(link)
      else index.set(ref, [link])
    }
  }

  for (const [ref, links] of index) {
    links.sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return bTime - aTime
    })
    index.set(ref, links)
  }

  return index
}
