'use client'

import { Timeline } from 'antd'
import type { FormListFieldData } from 'antd/es/form'
import type { FormInstance } from 'antd'
import { useSettings } from '@/app/[locale]/contexts/SettingsContext'
import { JournalEntry } from '@/components/Journal/JournalEntry'
import '@/components/Journal/Journal.css'

export function Journal({
  fields,
  form,
  isEditing,
  setEditingMode,
  onConfirmDelete,
}: {
  fields: FormListFieldData[]
  form: FormInstance
  isEditing: (fieldKey: number) => boolean
  setEditingMode: (fieldKey: number, isEditing: boolean) => void
  onConfirmDelete: (entryIndex: number, hasContent: boolean) => void
}) {
  const { settings } = useSettings()

  return (
    <Timeline
      className='journal'
      reverse={settings.journal.timelineReverseChronological}
      items={fields.map(field => ({
        key: String(field.key),
        content: (
          <JournalEntry
            field={field}
            form={form}
            editing={isEditing(field.key)}
            setEditingMode={setEditingMode}
            onConfirmDelete={onConfirmDelete}
          />
        ),
      }))}
    />
  )
}
