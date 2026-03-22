'use client'

import { CopyOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import './RollActions.css'

type RollActionsProps = {
  onRollAll: () => void
  label: string
  onCopyOneLiner?: () => void | Promise<void>
  copyOneLinerLabel?: string
}

export function RollActions({
  onRollAll,
  label,
  onCopyOneLiner,
  copyOneLinerLabel,
}: RollActionsProps) {
  return (
    <div className='roll-actions'>
      <Button type='primary' size='large' onClick={onRollAll}>
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
