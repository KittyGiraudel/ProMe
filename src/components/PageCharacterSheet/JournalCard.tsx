'use client'

import { Card, ConfigProvider, Empty, Form, FormListFieldData } from 'antd'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/Button/Button'
import { Journal } from '@/components/Journal/Journal'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { SettingsHint } from '@/components/SettingsHint/SettingsHint'
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
  const { componentDisabled } = ConfigProvider.useConfig()
  const { settings } = useSettings()
  const t = useTranslations()
  const form = Form.useFormInstance()
  const buttonInHeader = settings.journal.timelineReverseChronological
  const buttonInFooter = !buttonInHeader
  const canAddEntry = !componentDisabled

  const addEntryButton = (
    <Button onClick={onAddEntry} htmlType='button'>
      {t('characters.journal.add_journal_entry')}
    </Button>
  )

  return (
    <Card
      title={t('characters.journal.notes_section')}
      extra={canAddEntry && buttonInHeader ? addEntryButton : undefined}
      actions={canAddEntry && buttonInFooter ? [addEntryButton] : undefined}>
      <>
        {fields.length === 0 ? (
          <Empty description={t('characters.journal.empty')} />
        ) : (
          <Journal fields={fields} form={form} deleteEntry={onRemoveEntry} />
        )}
        <SettingsHint hintId='journal' />
      </>
    </Card>
  )
}
