'use client'

import ArrowsAltOutlined from '@ant-design/icons/lib/icons/ArrowsAltOutlined'
import MinusOutlined from '@ant-design/icons/lib/icons/MinusOutlined'
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import { Button, Card, Form, Input, Tooltip } from 'antd'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'

import './JournalEntryFloatingEditor.css'

type JournalEntryFloatingEditorProps = {
  fieldName: number
  onSave: () => void
  onCancel: () => void
  onExpand: () => void
}

export function JournalEntryFloatingEditor({
  fieldName,
  onSave,
  onCancel,
  onExpand,
}: JournalEntryFloatingEditorProps) {
  const t = useTranslations()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== 'Enter') return
      if (!e.metaKey && !e.ctrlKey) return
      e.preventDefault()
      onSave()
    },
    [onSave]
  )

  return (
    <Card
      title={<h2>{t('characters.journal.floating_editor_title')}</h2>}
      className='JournalFloatingEditor'
      role='region'
      data-collapsed={isCollapsed}
      aria-label={t('characters.journal.floating_editor_title')}
      extra={[
        <Tooltip
          trigger={['hover', 'focus']}
          title={t('characters.journal.floating_editor_expand')}
          key='expand'>
          <Button
            type='text'
            size='small'
            aria-label={t('characters.journal.floating_editor_expand')}
            onClick={() => onExpand()}
            icon={<ArrowsAltOutlined />}
          />
        </Tooltip>,
        <Tooltip
          title={
            isCollapsed
              ? t('common.actions.expand')
              : t('common.actions.collapse')
          }
          trigger={['hover', 'focus']}
          key='collapse'>
          <Button
            type='text'
            size='small'
            aria-label={
              isCollapsed
                ? t('common.actions.expand')
                : t('common.actions.collapse')
            }
            onClick={() => setIsCollapsed(c => !c)}
            icon={isCollapsed ? <PlusOutlined /> : <MinusOutlined />}
          />
        </Tooltip>,
      ]}
      actions={[
        <Button key='cancel' type='link' onClick={onCancel}>
          {t('common.actions.cancel')}
        </Button>,
        <Button key='save' type='primary' onClick={onSave}>
          {t('common.actions.finish')}
        </Button>,
      ]}>
      <Form.Item
        name={[fieldName, 'content']}
        className='JournalFloatingEditor__field'>
        <Input.TextArea
          autoFocus
          autoSize={{ minRows: 4, maxRows: 8 }}
          placeholder={t('characters.journal.entry_content_placeholder')}
          onKeyDown={handleKeyDown}
        />
      </Form.Item>
    </Card>
  )
}
