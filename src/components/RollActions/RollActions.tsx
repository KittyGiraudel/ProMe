'use client'

import { Space } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import { Button } from '@/components/Button/Button'

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
    <Space orientation='horizontal'>
      {onCopyOneLiner && copyOneLinerLabel ? (
        <Button
          size='large'
          icon={<CopyOutlined />}
          onClick={() => void onCopyOneLiner()}>
          {copyOneLinerLabel}
        </Button>
      ) : null}
      <Button type='primary' size='large' onClick={onRoll}>
        {label}
      </Button>
    </Space>
  )
}
