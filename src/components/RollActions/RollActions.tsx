'use client'

import { CopyOutlined } from '@ant-design/icons'
import { Button } from '@/components/Button/Button'
import './RollActions.css'

type RollActionsProps = {
  onRoll: () => void
  label: string
  onCopyOneLiner?: () => void | Promise<void>
  copyOneLinerLabel?: string
}

export function RollActions({
  onRoll,
  label,
  onCopyOneLiner,
  copyOneLinerLabel,
}: RollActionsProps) {
  return (
    <div className='roll-actions'>
      <Button type='primary' size='large' onClick={onRoll}>
        {label}
      </Button>
      {onCopyOneLiner && copyOneLinerLabel ? (
        <Button
          size='large'
          icon={<CopyOutlined />}
          onClick={() => void onCopyOneLiner()}>
          {copyOneLinerLabel}
        </Button>
      ) : null}
    </div>
  )
}
