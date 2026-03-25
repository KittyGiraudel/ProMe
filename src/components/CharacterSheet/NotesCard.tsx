'use client'

import { App, Card, ConfigProvider, Divider, Empty, Form, Space } from 'antd'
import type { FormListFieldData } from 'antd/es/form'
import { useEffect, useRef } from 'react'
import { useSettings } from '@/app/[locale]/contexts/SettingsContext'
import { Button } from '@/components/Button/Button'
import { Journal } from '@/components/Journal/Journal'
import { useJournalEntryViewModes } from './useJournalEntryViewModes'
import { useTranslations } from 'next-intl'

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
  const t = useTranslations()
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

  const addEntryButton =
    !componentDisabled && journalReverseChronological ? (
      <Button type='dashed' onClick={onAddEntry} htmlType='button'>
        {t('characters.add_journal_entry')}
      </Button>
    ) : undefined

  return (
    <Card title={t('characters.notes_section')} extra={addEntryButton}>
      <div>
        {fields.length === 0 ? (
          <Empty description={t('characters.journal_empty')} />
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
              title: t('characters.journal_delete_confirm_title'),
              content: t('characters.journal_delete_confirm_description'),
              okText: t('characters.delete'),
              cancelText: t('characters.cancel'),
              onOk: () => onRemoveEntry(entryIndex),
            })
          }}
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
              {t('characters.add_journal_entry')}
            </Button>
          </Space>
        </>
      )}
    </Card>
  )
}
