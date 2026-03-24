'use client'

import { Timeline } from 'antd'
import type { FormListFieldData } from 'antd/es/form'
import type { FormInstance } from 'antd'
import { JournalEntry } from '@/components/Journal/JournalEntry'
import '@/components/Journal/Journal.css'

export function Journal({
  fields,
  form,
  isEditing,
  setEditingMode,
  onConfirmDelete,
  formatTimestamp,
}: {
  fields: FormListFieldData[]
  form: FormInstance
  isEditing: (fieldKey: number) => boolean
  setEditingMode: (fieldKey: number, isEditing: boolean) => void
  onConfirmDelete: (entryIndex: number, hasContent: boolean) => void
  formatTimestamp: (value: string | undefined) => string | null
}) {
  return (
    <Timeline
      className='journal'
      items={fields.map(field => ({
        key: String(field.key),
        content: (
          <JournalEntry
            field={field}
            form={form}
            editing={isEditing(field.key)}
            setEditingMode={setEditingMode}
            onConfirmDelete={onConfirmDelete}
            formatTimestamp={formatTimestamp}
          />
        ),
      }))}
    />
  )
}
