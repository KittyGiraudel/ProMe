'use client'

import { ConfigProvider, Form, Input, Space, Typography } from 'antd'
import type { FormListFieldData } from 'antd/es/form'
import type { FormInstance } from 'antd'
import { Button } from '@/components/Button/Button'
import { JournalMarkdown } from '@/components/Markdown/JournalMarkdown'
import { useLocalize } from '@/app/contexts/LocalizationContext'

export function JournalEntry({
  field,
  form,
  editing,
  setEditingMode,
  onConfirmDelete,
  formatTimestamp,
}: {
  field: FormListFieldData
  form: FormInstance
  editing: boolean
  setEditingMode: (fieldKey: number, isEditing: boolean) => void
  onConfirmDelete: (entryIndex: number, hasContent: boolean) => void
  formatTimestamp: (value: string | undefined) => string | null
}) {
  const { componentDisabled } = ConfigProvider.useConfig()
  const localize = useLocalize()
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

  const hasContent = Boolean(content?.trim())
  const createdLabel = formatTimestamp(createdAt)
  const updatedLabel = formatTimestamp(updatedAt)
  const entryAnchor = entryId ? `journal-entry-${entryId}` : undefined

  return (
    <div
      id={entryAnchor}
      className={`journal__entry ${
        editing ? 'journal__entry--edit' : 'journal__entry--preview'
      }`}>
      <div className='journal__entry-actions'>
        {!componentDisabled && editing ? (
          <Space>
            <Button
              danger
              type='link'
              htmlType='button'
              onClick={() => onConfirmDelete(field.name, hasContent)}>
              {localize.string('common.delete')}
            </Button>
            <Button
              htmlType='button'
              type='primary'
              onClick={() => setEditingMode(field.key, false)}>
              {localize.string('characters.journalDoneEditing')}
            </Button>
          </Space>
        ) : !componentDisabled ? (
          <Button
            className='journal__entry-edit-button'
            htmlType='button'
            onClick={() => setEditingMode(field.key, true)}>
            {localize.string('characters.journalEditEntry')}
          </Button>
        ) : null}
      </div>

      {editing ? (
        <>
          <Form.Item
            name={[field.name, 'content']}
            label={localize.string('characters.journalEntryContentLabel')}
            style={{ marginBottom: 0 }}
            className='journal__entry-editor'>
            <Input.TextArea
              rows={8}
              placeholder={localize.string(
                'characters.journalEntryContentPlaceholder'
              )}
              onKeyDown={e => {
                if (e.key !== 'Enter') return
                if (!e.metaKey && !e.ctrlKey) return
                e.preventDefault()
                if (!componentDisabled) setEditingMode(field.key, false)
              }}
              onChange={() => {
                form.setFieldValue(
                  ['journalEntries', field.name, 'updatedAt'],
                  new Date().toISOString()
                )
              }}
            />
          </Form.Item>
          <div className='journal__entry-symbols'>
            <Typography.Text type='secondary'>
              {localize.string('characters.journalSymbols')}{' '}
              <span style={{ transform: 'scale(1.2)' }}>⚀ ⚁ ⚂ ⚃ ⚄ ⚅</span>
              <span>♠ ♥ ♦ ♣</span>
              <span style={{ transform: 'scale(0.8)' }}>☼ ☾</span>
              <span>« »</span>
            </Typography.Text>
          </div>
        </>
      ) : (
        <>
          {hasContent ? (
            <JournalMarkdown markdown={content ?? ''} />
          ) : (
            <Typography.Text type='secondary'>
              {localize.string('characters.journalPreviewEmpty')}
            </Typography.Text>
          )}
          <div className='journal__entry-meta'>
            <Typography.Text
              type='secondary'
              italic
              style={{ fontSize: '12px' }}
              className='journal__entry-meta-text'>
              <a href={`#${entryAnchor}`} className='journal__entry-permalink'>
                {createdLabel
                  ? localize.string('characters.journalCreatedAtLine', {
                      value: createdLabel,
                    })
                  : ''}
                {createdLabel && updatedLabel ? ' · ' : ''}
                {updatedLabel
                  ? localize.string('characters.journalUpdatedAtLine', {
                      value: updatedLabel,
                    })
                  : ''}
              </a>
            </Typography.Text>
          </div>
        </>
      )}
    </div>
  )
}
