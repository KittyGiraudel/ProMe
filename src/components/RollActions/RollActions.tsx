'use client'

import { Button } from '@/components/Button/Button'
import { CopyDropdown } from '@/components/CopyDropdown/CopyDropdown'
import { Spacing } from '@/components/Spacing/Spacing'

type RollActionsProps = {
  onRoll: () => void
  label: string
  copy?: {
    description: string
    journalBrace: string
  } | null
}

export function RollActions({ onRoll, label, copy }: RollActionsProps) {
  return (
    <Spacing orientation='horizontal' size='small'>
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
    </Spacing>
  )
}
