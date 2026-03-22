'use client'

import { Button } from 'antd'
import './RollActions.css'

type RollActionsProps = {
  onRollAll: () => void
  label: string
}

export function RollActions({ onRollAll, label }: RollActionsProps) {
  return (
    <div className='roll-actions'>
      <Button type='primary' size='large' onClick={onRollAll}>
        {label}
      </Button>
    </div>
  )
}
