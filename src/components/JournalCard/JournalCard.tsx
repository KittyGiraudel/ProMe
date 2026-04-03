'use client'

import {
  Card,
  ConfigProvider,
  Empty,
  Form,
  FormListFieldData,
  Input,
  Pagination,
} from 'antd'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/Button/Button'
import { useCharacterContext } from '@/components/CharacterContext/CharacterContext'
import { Journal } from '@/components/Journal/Journal'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { SettingsHint } from '@/components/SettingsHint/SettingsHint'
import { PAGE_SIZE, useJournalActions } from '@/hooks/useJournalActions'
import { useJournalEntryViewModes } from '@/hooks/useJournalEntryViewModes'
import { useJournalSearch } from '@/hooks/useJournalSearch'
import { randomId } from '@/lib/character/model'

export function JournalCard() {
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
  const { isDead } = useCharacterContext()
  const { componentDisabled } = ConfigProvider.useConfig()
  const { settings } = useSettings()
  const t = useTranslations()
  const [currentPage, setCurrentPage] = useState(1)
  const totalCount = fields.length

  const { isEditing, setEditingMode } = useJournalEntryViewModes(fields)
  const { addEntry, removeEntry } = useJournalActions({
    count: totalCount,
    setCurrentPage,
    onAddEntry,
    onRemoveEntry,
  })
  const {
    searchTerm,
    setSearchTerm,
    fields: filteredFields,
  } = useJournalSearch(fields)

  const buttonInHeader = settings.journal.timelineReverseChronological
  const buttonInFooter = !buttonInHeader
  const canAddEntry = !componentDisabled

  useEffect(
    function resetPageOnSearch() {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentPage(1)
    },
    [searchTerm]
  )

  const pagedFields = useMemo(() => {
    if (buttonInHeader) {
      const total = filteredFields.length
      const start = Math.max(0, total - currentPage * PAGE_SIZE)
      const end = total - (currentPage - 1) * PAGE_SIZE
      return filteredFields.slice(start, end)
    }
    return filteredFields.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE
    )
  }, [filteredFields, currentPage, buttonInHeader])

  const addEntryButton = (
    <Button onClick={addEntry} htmlType='button'>
      {t('characters.journal.add_journal_entry')}
    </Button>
  )

  return (
    <>
      <Card
        title={t('characters.journal.notes_section')}
        extra={canAddEntry && buttonInHeader ? addEntryButton : undefined}
        actions={canAddEntry && buttonInFooter ? [addEntryButton] : undefined}
        id='journal'>
        {totalCount === 0 ? (
          <Empty description={t('characters.journal.empty')} />
        ) : (
          <>
            <Input.Search
              allowClear
              aria-label={t('characters.journal.search_placeholder')}
              placeholder={t('characters.journal.search_placeholder')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onSearch={setSearchTerm}
              style={{ marginBottom: 24 }}
            />

            {filteredFields.length === 0 ? (
              <Empty description={t('characters.journal.search_empty')} />
            ) : (
              <>
                <Journal
                  fields={pagedFields}
                  deleteEntry={removeEntry}
                  isEditing={isEditing}
                  setEditingMode={setEditingMode}
                />

                {filteredFields.length > PAGE_SIZE && (
                  <div className='Journal__pagination'>
                    <Pagination
                      current={currentPage}
                      total={filteredFields.length}
                      pageSize={PAGE_SIZE}
                      onChange={setCurrentPage}
                      showSizeChanger={false}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </Card>
      {!isDead && <SettingsHint hintId='journal' />}
    </>
  )
}
