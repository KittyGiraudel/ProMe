'use client'

import type { FormInstance } from 'antd'
import { Timeline } from 'antd'
import type { FormListFieldData } from 'antd/es/form'
import { useMemo } from 'react'
import { JournalEntry } from '@/components/Journal/JournalEntry'
import { useWatchedJournal } from '@/components/PageCharacterSheet/useCharacterSheetDerived'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import type { JournalEntryPhase } from '@/lib/character/types'
import './Journal.css'
import { TimelineIcon } from './TimelineIcon'

export function Journal({
  fields,
  form,
  deleteEntry,
  isEditing,
  setEditingMode,
}: {
  fields: FormListFieldData[]
  form: FormInstance
  deleteEntry: (entryIndex: number) => void
  isEditing: (fieldKey: number) => boolean
  setEditingMode: (fieldKey: number, isEditing: boolean) => void
}) {
  const { settings } = useSettings()
  const journal = useWatchedJournal()

  const items = useMemo(
    () =>
      fields.map(field => {
        const entry = journal[field.name]

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
              form={form}
              editing={isEditing(field.key)}
              setEditingMode={setEditingMode}
              deleteEntry={deleteEntry}
            />
          ),
        }
      }),
    [fields, journal, isEditing, setEditingMode, deleteEntry]
  )

  return (
    <Timeline
      className='Journal'
      reverse={settings.journal.timelineReverseChronological}
      items={items}
    />
  )
}
