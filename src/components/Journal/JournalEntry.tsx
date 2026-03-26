'use client'

import { App, ConfigProvider, Form, Input, Space, Typography } from 'antd'
import type { FormListFieldData } from 'antd/es/form'
import type { FormInstance } from 'antd'
import { Button } from '@/components/Button/Button'
import { JournalMarkdown } from '@/components/JournalMarkdown/JournalMarkdown'
import { useFormatter, useTranslations } from 'next-intl'
import { useCallback } from 'react'

export function JournalEntry({
  field,
  form,
  editing,
  setEditingMode,
  deleteEntry,
}: {
  field: FormListFieldData
  form: FormInstance
  editing: boolean
  setEditingMode: (fieldKey: number, isEditing: boolean) => void
  deleteEntry: (entryIndex: number) => void
}) {
  const { modal } = App.useApp()
  const { componentDisabled } = ConfigProvider.useConfig()
  const format = useFormatter()

  const formatTimestamp = (value: string | undefined): string | null => {
    if (!value) return null
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return null
    return format.dateTime(date, { dateStyle: 'medium', timeStyle: 'short' })
  }

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

  const hasContent = Boolean(content?.trim())
  const createdLabel = formatTimestamp(createdAt)
  const updatedLabel = formatTimestamp(updatedAt)
  const entryAnchor = entryId ? `journal-entry-${entryId}` : undefined

  const handleDelete = useCallback(
    (index: number) => {
      if (!hasContent) deleteEntry(index)
      else
        modal.confirm({
          title: t('characters.journal.delete_confirm_title'),
          content: t('characters.journal.delete_confirm_description'),
          okText: t('common.delete'),
          cancelText: t('common.cancel'),
          onOk: () => deleteEntry(index),
        })
    },
    [deleteEntry, hasContent, t, modal]
  )

  return (
    <div
      id={entryAnchor}
      data-mode={editing ? 'edit' : 'preview'}
      className='Journal__entry'>
      <div className='Journal__actions'>
        {!componentDisabled && editing ? (
          <Space>
            <Button
              danger
              type='link'
              htmlType='button'
              onClick={() => handleDelete(field.name)}>
              {t('common.delete')}
            </Button>
            <Button
              htmlType='button'
              type='primary'
              onClick={() => setEditingMode(field.key, false)}>
              {t('characters.journal.done_editing')}
            </Button>
          </Space>
        ) : !componentDisabled ? (
          <Button
            className='Journal__edit'
            htmlType='button'
            onClick={() => setEditingMode(field.key, true)}>
            {t('characters.journal.edit_entry')}
          </Button>
        ) : null}
      </div>

      {editing ? (
        <>
          <Form.Item
            name={[field.name, 'content']}
            label={t('characters.journal.entry_content_label')}
            style={{ marginBottom: 0 }}
            className='Journal__editor'>
            <Input.TextArea
              rows={8}
              placeholder={t('characters.journal.entry_content_placeholder')}
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
          <div className='Journal__symbols'>
            <Typography.Text type='secondary'>
              {t('characters.journal.symbols')}{' '}
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
              {t('characters.journal.preview_empty')}
            </Typography.Text>
          )}
          <Typography.Text type='secondary' italic className='Journal__meta'>
            <a href={`#${entryAnchor}`} className='Journal__permalink'>
              {t('characters.journal.metadata', {
                createdAt: createdLabel ?? '',
                updatedAt: updatedLabel ?? '',
              })}
            </a>
          </Typography.Text>
        </>
      )}
    </div>
  )
}
