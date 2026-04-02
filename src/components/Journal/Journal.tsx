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
  deleteEntry,
  isEditing,
  setEditingMode,
}: {
  fields: FormListFieldData[]
  deleteEntry: (entryIndex: number) => void
  isEditing: (fieldKey: number) => boolean
  setEditingMode: (fieldKey: number, isEditing: boolean) => void
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
              editing={isEditing(field.key)}
              setEditingMode={setEditingMode}
              deleteEntry={deleteEntry}
            />
          ),
        }
      }),
    [fields, isEditing, setEditingMode, deleteEntry]
  )

  return (
    <Timeline
      className='Journal'
      reverse={settings.journal.timelineReverseChronological}
      items={items}
    />
  )
}
