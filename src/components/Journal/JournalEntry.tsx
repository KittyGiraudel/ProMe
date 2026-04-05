'use client'

import EditOutlined from '@ant-design/icons/lib/icons/EditOutlined'
import { App, ConfigProvider, Form } from 'antd'
import type { FormListFieldData } from 'antd/es/form'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef } from 'react'
import { Button } from '@/components/Button/Button'
import { JournalEntryBodyPreview } from '@/components/Journal/JournalEntryBodyPreview'
import { JournalEntryEditModal } from '@/components/Journal/JournalEntryEditModal'
import { useWatchedJournal } from '@/hooks/useCharacterSheetDerived'

type JournalEntryProps = {
  field: FormListFieldData
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
  editing,
  setEditingMode,
  deleteEntry,
}: JournalEntryProps) {
  const form = Form.useFormInstance()
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

  const { getEntry, updateEntryField } = useWatchedJournal()
  const draftContent = getEntry(field.name)?.content
  const hasContent = Boolean(content?.trim())
  const entryAnchor = entryId ? `journal-${entryId}` : undefined

  useEffect(
    function storeInitialContentOnEdit() {
      if (editing) {
        initialContentRef.current = form.getFieldValue([
          'journalEntries',
          field.name,
          'content',
        ]) as string | undefined
      }
    },
    [editing, field.name, form]
  )

  const handleDelete = useCallback(
    (index: number) => {
      if (!hasContent) deleteEntry(index)
      else
        modal.confirm({
          title: t('characters.journal.delete_confirm_title'),
          content: t('characters.journal.delete_confirm_description'),
          okText: t('common.actions.delete'),
          cancelText: t('common.actions.cancel'),
          onOk: () => deleteEntry(index),
        })
    },
    [deleteEntry, hasContent, t, modal]
  )

  const handleModalSave = useCallback(() => {
    if (!componentDisabled) {
      updateEntryField(field.name, 'updatedAt', new Date().toISOString())
      setEditingMode(field.key, false)
    }
  }, [
    componentDisabled,
    field.key,
    field.name,
    updateEntryField,
    setEditingMode,
  ])

  const handleModalCancel = useCallback(() => {
    updateEntryField(field.name, 'content', initialContentRef.current)
    setEditingMode(field.key, false)
  }, [field.key, field.name, updateEntryField, setEditingMode])

  return (
    <div id={entryAnchor} className='Journal__entry'>
      {!componentDisabled && !editing ? (
        <Button
          className='Journal__edit'
          htmlType='button'
          type='link'
          icon={<EditOutlined />}
          onClick={() => setEditingMode(field.key, true)}>
          <span className='Journal__edit-label'>
            {t('common.actions.edit')}
          </span>
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
        draftContent={draftContent}
        onCancel={handleModalCancel}
        onSave={handleModalSave}
        onDelete={() => handleDelete(field.name)}
      />
    </div>
  )
}
