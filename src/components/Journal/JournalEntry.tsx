'use client'

import EditOutlined from '@ant-design/icons/lib/icons/EditOutlined'
import { Button, ConfigProvider, Form } from 'antd'
import type { FormListFieldData } from 'antd/es/form'
import { useTranslations } from 'next-intl'
import { JournalEntryBodyPreview } from '@/components/Journal/JournalEntryBodyPreview'

type JournalEntryProps = {
  field: FormListFieldData
  editEntry: (fieldKey: number) => void
  isEditorOpen: boolean
}

export function JournalEntry({
  field,
  editEntry,
  isEditorOpen,
}: JournalEntryProps) {
  const form = Form.useFormInstance()
  const { componentDisabled } = ConfigProvider.useConfig()
  const t = useTranslations()

  const content = form.getFieldValue([
    'journalEntries',
    field.name,
    'content',
  ]) as string | undefined
  const createdAt = form.getFieldValue([
    'journalEntries',
    field.name,
    'createdAt',
  ]) as string | undefined
  const updatedAt = form.getFieldValue([
    'journalEntries',
    field.name,
    'updatedAt',
  ]) as string | undefined
  const entryId = form.getFieldValue(['journalEntries', field.name, 'id']) as
    | string
    | undefined
  const entryAnchor = entryId ? `journal-${entryId}` : undefined

  return (
    <div id={entryAnchor} className='Journal__entry'>
      <Button
        className='Journal__edit'
        type='link'
        disabled={componentDisabled || isEditorOpen}
        icon={<EditOutlined />}
        onClick={() => editEntry(field.key)}>
        <span className='Journal__edit-label'>{t('common.actions.edit')}</span>
      </Button>

      <JournalEntryBodyPreview
        content={content ?? ''}
        entryAnchor={entryAnchor}
        createdAt={createdAt}
        updatedAt={updatedAt}
      />
    </div>
  )
}
