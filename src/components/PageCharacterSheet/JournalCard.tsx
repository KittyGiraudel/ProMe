'use client'

import {
  Card,
  ConfigProvider,
  Empty,
  Form,
  FormListFieldData,
  Pagination,
} from 'antd'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/Button/Button'
import { Journal } from '@/components/Journal/Journal'
import { useJournalEntryViewModes } from '@/components/PageCharacterSheet/useJournalEntryViewModes'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { SettingsHint } from '@/components/SettingsHint/SettingsHint'
import { randomId } from '@/lib/character/model'

const PAGE_SIZE = 5

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

  const [currentPage, setCurrentPage] = useState(1)
  const { isEditing, setEditingMode } = useJournalEntryViewModes()
  const previousFieldCountRef = useRef(fields.length)

  useEffect(
    function editNewlyAddedEntry() {
      if (fields.length > previousFieldCountRef.current) {
        const latest = fields[fields.length - 1]
        if (latest) setEditingMode(latest.key, true)
      }
      previousFieldCountRef.current = fields.length
    },
    [fields, setEditingMode]
  )

  const pagedFields = useMemo(() => {
    if (settings.journal.timelineReverseChronological) {
      const total = fields.length
      const start = Math.max(0, total - currentPage * PAGE_SIZE)
      const end = total - (currentPage - 1) * PAGE_SIZE
      return fields.slice(start, end)
    }
    return fields.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  }, [fields, currentPage, settings.journal.timelineReverseChronological])

  const handleAddEntry = useCallback(() => {
    onAddEntry()
    if (settings.journal.timelineReverseChronological) {
      setCurrentPage(1)
    } else {
      const newTotalPages = Math.max(
        1,
        Math.ceil((fields.length + 1) / PAGE_SIZE)
      )
      setCurrentPage(newTotalPages)
    }
  }, [onAddEntry, settings.journal.timelineReverseChronological, fields.length])

  const handleRemoveEntry = useCallback(
    (index: number | number[]) => {
      onRemoveEntry(index)
      const removedCount = Array.isArray(index) ? index.length : 1
      const newLength = fields.length - removedCount
      const newTotalPages = Math.max(1, Math.ceil(newLength / PAGE_SIZE))
      setCurrentPage(prev => Math.min(prev, newTotalPages))
    },
    [onRemoveEntry, fields.length]
  )

  const addEntryButton = (
    <Button onClick={handleAddEntry} htmlType='button'>
      {t('characters.journal.add_journal_entry')}
    </Button>
  )

  return (
    <>
      <Card
        title={t('characters.journal.notes_section')}
        extra={canAddEntry && buttonInHeader ? addEntryButton : undefined}
        actions={canAddEntry && buttonInFooter ? [addEntryButton] : undefined}>
        {fields.length === 0 ? (
          <Empty description={t('characters.journal.empty')} />
        ) : (
          <>
            <Journal
              fields={pagedFields}
              form={form}
              deleteEntry={handleRemoveEntry}
              isEditing={isEditing}
              setEditingMode={setEditingMode}
            />
            {fields.length > PAGE_SIZE && (
              <div className='Journal__pagination'>
                <Pagination
                  current={currentPage}
                  total={fields.length}
                  pageSize={PAGE_SIZE}
                  onChange={setCurrentPage}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        )}
      </Card>
      <SettingsHint hintId='journal' />
    </>
  )
}
