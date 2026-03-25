'use client'

import { App, Card, ConfigProvider, Divider, Empty, Form, Space } from 'antd'
import type { FormListFieldData } from 'antd/es/form'
import { useEffect, useRef } from 'react'
import { useSettings } from '@/app/contexts/SettingsContext'
import { Button } from '@/components/Button/Button'
import { Journal } from '@/components/Journal/Journal'
import { useJournalEntryViewModes } from './useJournalEntryViewModes'
import { useLocalize } from '@/app/contexts/LocalizationContext'

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
  const { settings } = useSettings()
  const localize = useLocalize()
  const { componentDisabled } = ConfigProvider.useConfig()
  const form = Form.useFormInstance()
  const journalReverseChronological =
    settings.journal.timelineReverseChronological
  const { isEditing, setEditingMode } = useJournalEntryViewModes()
  const previousFieldCountRef = useRef(fields.length)

  useEffect(() => {
    if (fields.length > previousFieldCountRef.current) {
      const latest = fields[fields.length - 1]
      if (latest) setEditingMode(latest.key, true)
    }
    previousFieldCountRef.current = fields.length
  }, [fields, setEditingMode])

  const formatTimestamp = (value: string | undefined) => localize.date(value)
  const addEntryButton =
    !componentDisabled && journalReverseChronological ? (
      <Button type='dashed' onClick={onAddEntry} htmlType='button'>
        {localize.string('characters.addJournalEntry')}
      </Button>
    ) : undefined

  return (
    <Card
      title={localize.string('characters.notesSection')}
      extra={addEntryButton}>
      <div>
        {fields.length === 0 ? (
          <Empty description={localize.string('characters.journalEmpty')} />
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
              title: localize.string('characters.journalDeleteConfirmTitle'),
              content: localize.string(
                'characters.journalDeleteConfirmDescription'
              ),
              okText: localize.string('characters.delete'),
              cancelText: localize.string('characters.cancel'),
              onOk: () => onRemoveEntry(entryIndex),
            })
          }}
          formatTimestamp={formatTimestamp}
        />
      </div>
      {!componentDisabled && !journalReverseChronological && (
        <>
          <Divider />
          <Space
            wrap
            align='end'
            style={{ width: '100%' }}
            orientation='vertical'>
            <Button type='dashed' onClick={onAddEntry} htmlType='button'>
              {localize.string('characters.addJournalEntry')}
            </Button>
          </Space>
        </>
      )}
    </Card>
  )
}
