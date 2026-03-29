'use client'

import { useCallback, useMemo } from 'react'
import { App, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { useTranslations } from 'next-intl'
import { CopyOutlined, DownOutlined } from '@ant-design/icons'
import { useSearchParams } from 'next/navigation'
import { usePathname } from '@/i18n/navigation'
import { Button } from '@/components/Button/Button'
import type { ButtonProps } from '@/components/Button/Button'

export type SheetCopyDropdownProps = {
  description: string
  journalBrace: string
  size?: ButtonProps['size']
}

export function CopyDropdown({
  description,
  journalBrace,
  size = 'middle',
}: SheetCopyDropdownProps) {
  const t = useTranslations()
  const { message } = App.useApp()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const pageUrl = useMemo(() => {
    if (typeof window === 'undefined') return ''
    const q = searchParams.toString()
    return `${window.location.origin}${pathname}${q ? `?${q}` : ''}`
  }, [pathname, searchParams])

  const copyText = useCallback(
    async (text: string, successMessage: string) => {
      try {
        await navigator.clipboard.writeText(text)
        message.success(successMessage)
      } catch {
        message.error(t('common.copy.error'))
      }
    },
    [message, t]
  )

  const copyDescription = useCallback(
    () => copyText(description, t('common.copy.success_description')),
    [copyText, description, t]
  )

  const copyUrl = useCallback(
    () => copyText(pageUrl, t('common.copy.success_url')),
    [copyText, pageUrl, t]
  )

  const copyJournal = useCallback(
    () => copyText(journalBrace, t('common.copy.success_journal')),
    [copyText, journalBrace, t]
  )

  const items: MenuProps['items'] = useMemo(
    () => [
      {
        key: 'description',
        label: t('common.copy.description'),
        onClick: copyDescription,
      },
      { key: 'url', label: t('common.copy.url'), onClick: copyUrl },
      {
        key: 'journal',
        label: t('common.copy.journal'),
        onClick: copyJournal,
      },
    ],
    [copyDescription, copyUrl, copyJournal, t]
  )

  return (
    <Dropdown menu={{ items }} trigger={['click']}>
      <Button
        size={size}
        icon={<CopyOutlined />}
        className='CopyDropdown__trigger'>
        {t('common.copy.trigger')}
        <DownOutlined className='CopyDropdown__triggerIcon' />
      </Button>
    </Dropdown>
  )
}
