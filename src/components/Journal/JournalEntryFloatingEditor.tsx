'use client'

import { Form, Input } from 'antd'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/Button/Button'

import './JournalEntryFloatingEditor.css'

type JournalEntryFloatingEditorProps = {
  open: boolean
  fieldName: number
  onSave: () => void
  onCancel: () => void
  onExpand: () => void
}

export function JournalEntryFloatingEditor({
  open,
  fieldName,
  onSave,
  onCancel,
  onExpand,
}: JournalEntryFloatingEditorProps) {
  const t = useTranslations()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (open) setIsCollapsed(false)
  }, [open])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== 'Enter') return
      if (!e.metaKey && !e.ctrlKey) return
      e.preventDefault()
      onSave()
    },
    [onSave]
  )

  if (!isMounted || !open) return null

  const bodyClass = `JournalFloatingEditor__body${isCollapsed ? ' JournalFloatingEditor__body--collapsed' : ''}`
  const footerClass = `JournalFloatingEditor__footer${isCollapsed ? ' JournalFloatingEditor__footer--collapsed' : ''}`

  return createPortal(
    <div
      className='JournalFloatingEditor'
      role='dialog'
      aria-label={t('characters.journal.floating_editor_title')}>
      <div
        className='JournalFloatingEditor__header'
        onClick={() => setIsCollapsed(c => !c)}>
        <span className='JournalFloatingEditor__title'>
          {t('characters.journal.floating_editor_title')}
        </span>
        <span className='JournalFloatingEditor__actions'>
          <Button
            type='text'
            size='small'
            htmlType='button'
            title={t('characters.journal.floating_editor_expand')}
            aria-label={t('characters.journal.floating_editor_expand')}
            onClick={e => {
              e.stopPropagation()
              onExpand()
            }}>
            ⤢
          </Button>
          <Button
            type='text'
            size='small'
            htmlType='button'
            title={
              isCollapsed
                ? t('characters.journal.floating_editor_restore')
                : t('characters.journal.floating_editor_collapse')
            }
            aria-label={
              isCollapsed
                ? t('characters.journal.floating_editor_restore')
                : t('characters.journal.floating_editor_collapse')
            }
            onClick={e => {
              e.stopPropagation()
              setIsCollapsed(c => !c)
            }}>
            {isCollapsed ? '+' : '−'}
          </Button>
        </span>
      </div>
      <div className={bodyClass}>
        <Form.Item
          name={[fieldName, 'content']}
          className='JournalFloatingEditor__field'>
          <Input.TextArea
            autoSize={{ minRows: 4, maxRows: 8 }}
            placeholder={t('characters.journal.entry_content_placeholder')}
            onKeyDown={handleKeyDown}
          />
        </Form.Item>
      </div>
      <div className={footerClass}>
        <Button htmlType='button' onClick={onCancel}>
          {t('common.actions.cancel')}
        </Button>
        <Button type='primary' htmlType='button' onClick={onSave}>
          {t('common.actions.finish')}
        </Button>
      </div>
    </div>,
    document.body
  )
}
