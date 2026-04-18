'use client'

import {
  Col,
  ConfigProvider,
  Empty,
  Form,
  Grid,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Tabs,
  Timeline,
} from 'antd'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/Button/Button'
import { JournalEditCheatsheet } from '@/components/Journal/JournalEditCheatsheet'
import { JournalMarkdown } from '@/components/JournalMarkdown/JournalMarkdown'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { Spacing } from '@/components/Spacing/Spacing'
import { useWatchedJournal } from '@/hooks/useCharacterSheetDerived'

import './Journal.css'

/** `autoSize` rows for the journal editor; breakpoint aligns with modal `Col lg={16}`. */
const JOURNAL_MODAL_TEXTAREA_ROWS = {
  /** Viewports below `lg` */
  compact: { minRows: 8, maxRows: 8 },
  /** `lg` and up */
  comfortable: { minRows: 12, maxRows: 12 },
} as const

type JournalEntryEditModalProps = {
  /** Form.List row index for `journalEntries`. */
  fieldName: number
  draftContent: string | undefined
  onCancel: () => void
  onSave: () => void
  onFloat: () => void
  onDelete: () => void
}

/**
 * Full-width modal: edit tab (bound to form field), live preview tab, cheatsheet column, footer actions.
 */
export function JournalEntryEditModal({
  fieldName,
  draftContent,
  onCancel,
  onSave,
  onFloat,
  onDelete,
}: JournalEntryEditModalProps) {
  const { componentDisabled } = ConfigProvider.useConfig()
  const screens = Grid.useBreakpoint()
  const t = useTranslations()
  const { settings } = useSettings()
  const { getEntry } = useWatchedJournal()
  const phase = getEntry(fieldName)?.phase
  const textareaAutoSize = screens.lg
    ? JOURNAL_MODAL_TEXTAREA_ROWS.comfortable
    : JOURNAL_MODAL_TEXTAREA_ROWS.compact

  return (
    <Modal
      open
      title={t('characters.journal.modal_title')}
      onCancel={onCancel}
      mask={{ closable: false }}
      keyboard={false}
      width='min(1200px, 96vw)'
      wrapClassName='Journal__editModalWrap'
      className='Journal__editModal'
      centered={false}
      footer={
        <div className='Journal__modalFooter'>
          <Popconfirm
            title={t('characters.journal.delete_confirm_title')}
            description={t('characters.journal.delete_confirm_description')}
            okText={t('common.actions.delete')}
            cancelText={t('common.actions.cancel')}
            onConfirm={onDelete}
            styles={{ container: { maxWidth: 300 } }}>
            <Button
              danger
              type='link'
              htmlType='button'
              disabled={componentDisabled}>
              {t('common.actions.delete')}
            </Button>
          </Popconfirm>
          <Spacing orientation='horizontal' size='small'>
            <Button htmlType='button' type='link' onClick={onFloat}>
              {t('characters.journal.floating_editor_dock')}
            </Button>
            <Button htmlType='button' onClick={onCancel}>
              {t('common.actions.cancel')}
            </Button>
            <Button
              type='primary'
              htmlType='button'
              disabled={componentDisabled}
              onClick={onSave}>
              {t('common.actions.finish')}
            </Button>
          </Spacing>
        </div>
      }
      destroyOnHidden>
      <Row gutter={[16, 16]} className='Journal__modalMain'>
        <Col xs={24} lg={16}>
          <Tabs
            defaultActiveKey='edit'
            items={[
              {
                key: 'edit',
                label: t('characters.journal.tab_edit'),
                children: (
                  <>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} lg={24}>
                        <Form.Item
                          name={[fieldName, 'content']}
                          className='Journal__modalEditor'
                          label={t('characters.journal.entry_content_label')}>
                          <Input.TextArea
                            autoFocus
                            autoSize={textareaAutoSize}
                            className='Journal__textarea'
                            placeholder={t(
                              'characters.journal.entry_content_placeholder'
                            )}
                            onKeyDown={e => {
                              if (e.key !== 'Enter') return
                              if (!e.metaKey && !e.ctrlKey) return
                              e.preventDefault()
                              onSave()
                            }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                      <Col xs={12}>
                        <Form.Item
                          name={[fieldName, 'phase']}
                          label={t('characters.journal.phase_label')}
                          style={{ marginBottom: 0 }}>
                          <Select
                            allowClear
                            options={[
                              {
                                value: 'day',
                                label: t('characters.journal.phase_day'),
                              },
                              {
                                value: 'night',
                                label: t('characters.journal.phase_night'),
                              },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={12}>
                        <Form.Item
                          name={[fieldName, 'slice']}
                          label={t('characters.journal.slice_label')}
                          style={{ marginBottom: 0 }}>
                          <InputNumber
                            min={1}
                            disabled={!phase}
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
                ),
              },
              {
                key: 'preview',
                label: t('characters.journal.preview_entry'),
                children: (
                  <div className='Journal__modalPreview'>
                    {draftContent?.trim() ? (
                      <Timeline
                        className='Journal'
                        reverse={settings.journal.timelineReverseChronological}
                        items={[
                          { key: 'prev', content: '…' },
                          {
                            key: 'preview',
                            content: (
                              <JournalMarkdown
                                markdown={draftContent}
                                interactive={false}
                              />
                            ),
                          },
                          { key: 'next', content: '…' },
                        ]}
                      />
                    ) : (
                      <Empty
                        description={t('characters.journal.entry_empty')}
                      />
                    )}
                  </div>
                ),
              },
            ]}
          />
        </Col>
        <Col xs={24} lg={8}>
          <JournalEditCheatsheet />
        </Col>
      </Row>
    </Modal>
  )
}
