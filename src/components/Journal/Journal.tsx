'use client'

import { Timeline } from 'antd'
import type { FormListFieldData } from 'antd/es/form'
import { useMemo } from 'react'
import { JournalEntry } from '@/components/Journal/JournalEntry'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { TimelineIcon } from '@/components/TimelineIcon/TimelineIcon'
import { useWatchedJournal } from '@/hooks/useCharacterSheetDerived'
import type { JournalEntryPhase } from '@/lib/character/types'

import './Journal.css'

export function Journal({
  fields,
  editEntry,
  isEditorOpen,
}: {
  fields: FormListFieldData[]
  editEntry: (fieldKey: number) => void
  isEditorOpen: boolean
}) {
  const { settings } = useSettings()
  const { getEntry } = useWatchedJournal()

  const items = useMemo(
    () =>
      fields.map(field => {
        const entry = getEntry(field.name)

        return {
          key: String(field.key),
          icon: entry?.phase ? (
            <TimelineIcon
              phase={entry.phase as JournalEntryPhase}
              slice={entry?.slice as number}
            />
          ) : undefined,
          content: (
            <JournalEntry
              field={field}
              editEntry={editEntry}
              isEditorOpen={isEditorOpen}
            />
          ),
        }
      }),
    [fields, editEntry, isEditorOpen, getEntry]
  )

  return (
    <Timeline
      className='Journal'
      reverse={settings.journal.timelineReverseChronological}
      items={items}
    />
  )
}
