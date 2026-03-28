'use client'

import { App, ConfigProvider, Form, Typography } from 'antd'
import type { FormListFieldData } from 'antd/es/form'
import type { FormInstance } from 'antd'
import { Button } from '@/components/Button/Button'
import { JournalEntryBodyPreview } from '@/components/Journal/JournalEntryBodyPreview'
import { JournalEntryEditModal } from '@/components/Journal/JournalEntryEditModal'
import { useFormatter, useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef } from 'react'

type JournalEntryProps = {
  field: FormListFieldData
  form: FormInstance
  editing: boolean
  setEditingMode: (fieldKey: number, isEditing: boolean) => void
  deleteEntry: (entryIndex: number) => void
}

/**
 * One timeline journal row: preview, edit affordance, and modal editor wired to
 * the character form.
 */
export function JournalEntry({
  field,
  form,
  editing,
  setEditingMode,
  deleteEntry,
}: JournalEntryProps) {
  const { modal } = App.useApp()
  const { componentDisabled } = ConfigProvider.useConfig()
  const initialContentRef = useRef<string | undefined>(undefined)
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

  const draftContent = Form.useWatch(
    ['journalEntries', field.name, 'content'],
    form
  ) as string | undefined

  const hasContent = Boolean(content?.trim())
  const entryAnchor = entryId ? `journal-entry-${entryId}` : undefined

  useEffect(() => {
    if (editing) {
      initialContentRef.current = form.getFieldValue([
        'journalEntries',
        field.name,
        'content',
      ]) as string | undefined
    }
  }, [editing, field.name, form])

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

  const handleModalSave = useCallback(() => {
    if (!componentDisabled) {
      form.setFieldValue(
        ['journalEntries', field.name, 'updatedAt'],
        new Date().toISOString()
      )
      setEditingMode(field.key, false)
    }
  }, [componentDisabled, field.key, field.name, form, setEditingMode])

  const handleModalCancel = useCallback(() => {
    form.setFieldValue(
      ['journalEntries', field.name, 'content'],
      initialContentRef.current
    )
    setEditingMode(field.key, false)
  }, [field.key, field.name, form, setEditingMode])

  return (
    <div id={entryAnchor} className='Journal__entry'>
      {!componentDisabled && !editing ? (
        <Button
          className='Journal__edit'
          htmlType='button'
          onClick={() => setEditingMode(field.key, true)}>
          {t('characters.journal.edit_entry')}
        </Button>
      ) : null}

      <JournalEntryBodyPreview
        content={content ?? ''}
        entryAnchor={entryAnchor}
        createdAt={createdAt}
        updatedAt={updatedAt}
      />

      <JournalEntryEditModal
        open={editing}
        fieldName={field.name}
        form={form}
        draftContent={draftContent}
        onCancel={handleModalCancel}
        onSave={handleModalSave}
        onDelete={() => handleDelete(field.name)}
      />
    </div>
  )
}
