'use client'

import type { FormInstance } from 'antd'
import { Form, Timeline } from 'antd'
import type { FormListFieldData } from 'antd/es/form'
import { useEffect, useMemo, useRef } from 'react'
import { JournalEntry } from '@/components/Journal/JournalEntry'
import { useJournalEntryViewModes } from '@/components/PageCharacterSheet/useJournalEntryViewModes'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import type {
  JournalEntryPhase,
  JournalEntry as JournalEntryType,
} from '@/lib/character/types'
import './Journal.css'
import { TimelineIcon } from './TimelineIcon'

export function Journal({
  fields,
  form,
  deleteEntry,
}: {
  fields: FormListFieldData[]
  form: FormInstance
  deleteEntry: (entryIndex: number) => void
}) {
  const { settings } = useSettings()
  const { isEditing, setEditingMode } = useJournalEntryViewModes()
  const previousFieldCountRef = useRef(fields.length)
  const journalEntries = Form.useWatch('journalEntries', {
    form,
    preserve: true,
  }) as JournalEntryType[] | undefined

  // Automatically turn on the edit mode for the newly created entry
  useEffect(() => {
    if (fields.length > previousFieldCountRef.current) {
      const latest = fields[fields.length - 1]
      if (latest) setEditingMode(latest.key, true)
      previousFieldCountRef.current = fields.length
    }
  }, [fields, setEditingMode])

  const items = useMemo(
    () =>
      fields.map(field => {
        const entry = journalEntries?.[field.name]

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
    [fields, journalEntries, isEditing, setEditingMode, deleteEntry]
  )

  return (
    <Timeline
      className='Journal'
      reverse={settings.journal.timelineReverseChronological}
      items={items}
    />
  )
}
