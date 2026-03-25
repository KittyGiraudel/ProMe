'use client'

import { App, Avatar, Card, List } from 'antd'
import {
  DownloadOutlined,
  CheckCircleFilled,
  DeleteFilled,
  ExclamationCircleFilled,
  DisconnectOutlined,
  FrownOutlined,
  HeartOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { Button } from '@/components/Button/Button'
import { useCharacterContext } from '@/components/CharacterSheet/CharacterContext'
import { useLocalize } from '@/app/contexts/LocalizationContext'
import './ActionsTabSection.css'

export function ActionsTabSection() {
  const localize = useLocalize()
  const { onKill, onExport, onRevive, onDelete, isDead } = useCharacterContext()
  const { modal } = App.useApp()

  const handleRequestDelete = () => {
    modal.confirm({
      title: localize.string('characters.deleteConfirmTitle'),
      content: localize.string('characters.deleteConfirmDescription'),
      okText: localize.string('characters.delete'),
      cancelText: localize.string('characters.cancel'),
      okButtonProps: { danger: true, type: 'primary' },
      onOk: onDelete,
    })
  }

  const handleRequestRevive = () => {
    modal.confirm({
      title: localize.string('characters.reviveConfirmTitle'),
      content: localize.string('characters.reviveConfirmDescription'),
      okText: localize.string('characters.reviveAction'),
      cancelText: localize.string('characters.cancel'),
      onOk: onRevive,
    })
  }

  const handleRequestMarkAsDead = () => {
    modal.confirm({
      title: localize.string('characters.markDeadConfirmTitle'),
      content: localize.string('characters.markDeadConfirmDescription'),
      okText: localize.string('characters.markDeadAction'),
      cancelText: localize.string('characters.cancel'),
      okButtonProps: { danger: true },
      onOk: onKill,
    })
  }

  const items = [
    {
      key: 'export',
      variant: 'neutral' as const,
      icon: (
        <DownloadOutlined className='actions-tab__icon actions-tab__icon--neutral' />
      ),
      title: localize.string('characters.export'),
      description: localize.string('characters.exportHelp'),
      action: (
        <Button htmlType='button' onClick={onExport} disabled={false}>
          {localize.string('characters.export')}
        </Button>
      ),
    },
    ...(isDead
      ? [
          {
            key: 'revive',
            variant: 'success' as const,
            icon: (
              <HeartOutlined className='actions-tab__icon actions-tab__icon--success' />
            ),
            title: localize.string('characters.reviveAction'),
            description: localize.string('characters.reviveConfirmDescription'),
            action: (
              <Button
                type='primary'
                htmlType='button'
                onClick={handleRequestRevive}
                disabled={false}>
                {localize.string('characters.reviveAction')}
              </Button>
            ),
          },
        ]
      : [
          {
            key: 'mark-dead',
            variant: 'warning' as const,
            icon: (
              <FrownOutlined className='actions-tab__icon actions-tab__icon--warning' />
            ),
            title: localize.string('characters.markDeadAction'),
            description: localize.string('characters.dangerMarkDeadHelp'),
            action: (
              <Button
                danger
                type='primary'
                htmlType='button'
                onClick={handleRequestMarkAsDead}
                disabled={false}>
                {localize.string('characters.markDeadAction')}
              </Button>
            ),
          },
        ]),
    {
      key: 'delete',
      variant: 'danger' as const,
      icon: (
        <DeleteOutlined className='actions-tab__icon actions-tab__icon--danger' />
      ),
      title: localize.string('characters.delete'),
      description: localize.string('characters.deleteConfirmDescription'),
      action: (
        <Button
          danger
          type='primary'
          htmlType='button'
          disabled={false}
          onClick={handleRequestDelete}>
          {localize.string('characters.delete')}
        </Button>
      ),
    },
  ]

  return (
    <Card title={localize.string('characters.tabActions')}>
      <List
        itemLayout='horizontal'
        dataSource={items}
        renderItem={item => (
          <List.Item data-variant={item.variant} actions={[item.action]}>
            <List.Item.Meta
              avatar={<Avatar icon={item.icon} />}
              title={item.title}
              description={item.description}
            />
          </List.Item>
        )}
      />
    </Card>
  )
}
