'use client'

import { useEffect, useRef } from 'react'
import { Timeline } from 'antd'
import type { FormListFieldData } from 'antd/es/form'
import type { FormInstance } from 'antd'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { JournalEntry } from '@/components/Journal/JournalEntry'
import { useJournalEntryViewModes } from '@/components/PageCharacterSheet/useJournalEntryViewModes'
import './Journal.css'

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

  // Automatically turn on the edit mode for the newly created entry
  useEffect(() => {
    if (fields.length > previousFieldCountRef.current) {
      const latest = fields[fields.length - 1]
      if (latest) setEditingMode(latest.key, true)
      previousFieldCountRef.current = fields.length
    }
  }, [fields, setEditingMode])

  return (
    <Timeline
      className='Journal'
      reverse={settings.journal.timelineReverseChronological}
      items={fields.map(field => ({
        key: String(field.key),
        content: (
          <JournalEntry
            field={field}
            form={form}
            editing={isEditing(field.key)}
            setEditingMode={setEditingMode}
            deleteEntry={deleteEntry}
          />
        ),
      }))}
    />
  )
}
