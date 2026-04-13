'use client'

import ArrowsAltOutlined from '@ant-design/icons/lib/icons/ArrowsAltOutlined'
import MinusOutlined from '@ant-design/icons/lib/icons/MinusOutlined'
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import { Card, Form, Input, Tooltip } from 'antd'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/Button/Button'

import './JournalEntryFloatingEditor.css'
import { useHydration } from '@/hooks/useHydration'

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
  const hydrated = useHydration()

  useEffect(
    function handleOpenChange() {
      if (open) setIsCollapsed(false)
    },
    [open]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== 'Enter') return
      if (!e.metaKey && !e.ctrlKey) return
      e.preventDefault()
      onSave()
    },
    [onSave]
  )

  if (!hydrated || !open) return null

  return createPortal(
    <Card
      title={t('characters.journal.floating_editor_title')}
      className='JournalFloatingEditor'
      role='region'
      data-collapsed={isCollapsed}
      aria-label={t('characters.journal.floating_editor_title')}
      extra={[
        <Tooltip
          title={t('characters.journal.floating_editor_expand')}
          key='expand'>
          <Button
            type='text'
            size='small'
            htmlType='button'
            aria-label={t('characters.journal.floating_editor_expand')}
            onClick={e => {
              e.stopPropagation()
              onExpand()
            }}>
            <ArrowsAltOutlined />
          </Button>
        </Tooltip>,
        <Tooltip
          title={
            isCollapsed
              ? t('common.actions.expand')
              : t('common.actions.collapse')
          }
          key='collapse'>
          <Button
            type='text'
            size='small'
            htmlType='button'
            aria-label={
              isCollapsed
                ? t('common.actions.expand')
                : t('common.actions.collapse')
            }
            onClick={e => {
              e.stopPropagation()
              setIsCollapsed(c => !c)
            }}>
            {isCollapsed ? <PlusOutlined /> : <MinusOutlined />}
          </Button>
        </Tooltip>,
      ]}
      actions={[
        <Button key='cancel' htmlType='button' onClick={onCancel}>
          {t('common.actions.cancel')}
        </Button>,
        <Button key='save' type='primary' htmlType='button' onClick={onSave}>
          {t('common.actions.finish')}
        </Button>,
      ]}>
      <Form.Item
        name={[fieldName, 'content']}
        className='JournalFloatingEditor__field'>
        <Input.TextArea
          autoSize={{ minRows: 4, maxRows: 8 }}
          placeholder={t('characters.journal.entry_content_placeholder')}
          onKeyDown={handleKeyDown}
        />
      </Form.Item>
    </Card>,
    document.body
  )
}
