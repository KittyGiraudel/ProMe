'use client'

import {
  Card,
  ConfigProvider,
  Divider,
  Empty,
  Form,
  FormListFieldData,
  Space,
} from 'antd'
import { useSettings } from '@/app/[locale]/contexts/SettingsContext'
import { Button } from '@/components/Button/Button'
import { Journal } from '@/components/Journal/Journal'
import { useTranslations } from 'next-intl'
import { randomId } from '@/lib/character/model'

export const JournalCard = () => {
  return (
    <Form.List name='journalEntries'>
      {(fields, { add, remove }) => (
        <JournalCardInner
          fields={fields}
          onAddEntry={() =>
            add({
              id: randomId(),
              content: '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })
          }
          onRemoveEntry={(index: number | number[]) => remove(index)}
        />
      )}
    </Form.List>
  )
}

export function JournalCardInner({
  fields,
  onAddEntry,
  onRemoveEntry,
}: {
  fields: FormListFieldData[]
  onAddEntry: () => void
  onRemoveEntry: (index: number | number[]) => void
}) {
  const { settings } = useSettings()
  const t = useTranslations()
  const { componentDisabled } = ConfigProvider.useConfig()
  const form = Form.useFormInstance()
  const journalReverseChronological =
    settings.journal.timelineReverseChronological

  const addEntryButton = (
    <Button type='dashed' onClick={onAddEntry} htmlType='button'>
      {t('characters.journal.add_journal_entry')}
    </Button>
  )

  return (
    <Card
      title={t('characters.journal.notes_section')}
      extra={
        !componentDisabled && journalReverseChronological
          ? addEntryButton
          : undefined
      }>
      <div>
        {fields.length === 0 ? (
          <Empty description={t('characters.journal.empty')} />
        ) : (
          <Journal fields={fields} form={form} deleteEntry={onRemoveEntry} />
        )}
      </div>

      {!componentDisabled && !journalReverseChronological && (
        <>
          <Divider />
          <Space
            wrap
            align='end'
            style={{ width: '100%' }}
            orientation='vertical'>
            {addEntryButton}
          </Space>
        </>
      )}
    </Card>
  )
}
