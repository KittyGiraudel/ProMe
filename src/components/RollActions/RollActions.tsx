'use client'

import { Space } from 'antd'
import { Button } from '@/components/Button/Button'
import { CopyDropdown } from '@/components/CopyDropdown/CopyDropdown'

export type SheetCopyPayload = {
  description: string
  journalBrace: string
}

type RollActionsProps = {
  onRoll: () => void
  label: string
  copy?: SheetCopyPayload | null
}

export function RollActions({ onRoll, label, copy }: RollActionsProps) {
  return (
    <Space orientation='horizontal'>
      {copy ? (
        <CopyDropdown
          description={copy.description}
          journalBrace={copy.journalBrace}
          size='large'
        />
      ) : null}
      <Button type='primary' size='large' onClick={onRoll}>
        {label}
      </Button>
    </Space>
  )
}
