'use client'

import { App, Card, Divider, Empty, Form, Space, Typography } from 'antd'
import type { FormListFieldData } from 'antd/es/form'
import { useEffect, useRef } from 'react'
import { copy } from '@/messages/fr'
import { Button } from '@/components/Button/Button'
import { Journal } from '@/components/Journal/Journal'
import { useJournalEntryViewModes } from './useJournalEntryViewModes'

export function NotesCard({
  fields,
  onAddEntry,
  onRemoveEntry,
}: {
  fields: FormListFieldData[]
  onAddEntry: () => void
  onRemoveEntry: (index: number | number[]) => void
}) {
  const { modal } = App.useApp()
  const form = Form.useFormInstance()
  const { isEditing, setEditingMode } = useJournalEntryViewModes()
  const previousFieldCountRef = useRef(fields.length)

  useEffect(() => {
    if (fields.length > previousFieldCountRef.current) {
      const latest = fields[fields.length - 1]
      if (latest) setEditingMode(latest.key, true)
    }
    previousFieldCountRef.current = fields.length
  }, [fields, setEditingMode])

  const formatTimestamp = (value: string | undefined) => {
    if (!value) return null
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return null
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date)
  }
  return (
    <Card title={copy.characters.notesSection}>
      <div>
        {fields.length === 0 ? (
          <Empty description={copy.characters.journalEmpty} />
        ) : null}

        <Journal
          fields={fields}
          form={form}
          isEditing={isEditing}
          setEditingMode={setEditingMode}
          onConfirmDelete={(entryIndex, hasContent) => {
            if (!hasContent) {
              onRemoveEntry(entryIndex)
              return
            }

            modal.confirm({
              title: copy.characters.journalDeleteConfirmTitle,
              content: copy.characters.journalDeleteConfirmDescription,
              okText: copy.characters.delete,
              cancelText: copy.characters.cancel,
              onOk: () => onRemoveEntry(entryIndex),
            })
          }}
          formatTimestamp={formatTimestamp}
        />
      </div>
      <Divider />
      <Space wrap align='end' style={{ width: '100%' }} orientation='vertical'>
        <Button type='dashed' onClick={onAddEntry} htmlType='button'>
          {copy.characters.addJournalEntry}
        </Button>
      </Space>
    </Card>
  )
}
