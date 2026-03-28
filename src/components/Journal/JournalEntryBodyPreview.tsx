'use client'

import { Typography } from 'antd'
import { JournalMarkdown } from '@/components/JournalMarkdown/JournalMarkdown'
import { useFormatter, useTranslations } from 'next-intl'

type JournalEntryBodyPreviewProps = {
  content: string
  entryAnchor: string | undefined
  createdAt: string | undefined
  updatedAt: string | undefined
}

/**
 * Read-only journal body: rendered markdown plus permalink metadata.
 */
export function JournalEntryBodyPreview({
  content,
  entryAnchor,
  createdAt,
  updatedAt,
}: JournalEntryBodyPreviewProps) {
  const t = useTranslations()
  const format = useFormatter()
  const formatTimestamp = (value: string | undefined): string | null => {
    if (!value) return null
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return null
    return format.dateTime(date, { dateStyle: 'medium', timeStyle: 'short' })
  }
  const createdLabel = formatTimestamp(createdAt) ?? ''
  const updatedLabel = formatTimestamp(updatedAt) ?? ''

  return (
    <>
      {content ? (
        <JournalMarkdown markdown={content} />
      ) : (
        <Typography.Text type='secondary'>
          {t('characters.journal.entry_empty')}
        </Typography.Text>
      )}

      <Typography.Text type='secondary' italic className='Journal__meta'>
        {entryAnchor ? (
          <a href={`#${entryAnchor}`} className='Journal__permalink'>
            {t('characters.journal.metadata', {
              createdAt: createdLabel,
              updatedAt: updatedLabel,
            })}
          </a>
        ) : (
          <span className='Journal__permalink'>
            {t('characters.journal.metadata', {
              createdAt: createdLabel,
              updatedAt: updatedLabel,
            })}
          </span>
        )}
      </Typography.Text>
    </>
  )
}
