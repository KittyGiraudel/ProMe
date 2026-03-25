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
import { copy } from '@/messages/fr'
import './ActionsTabSection.css'

export function ActionsTabSection() {
  const { onKill, onExport, onRevive, onDelete, isDead } = useCharacterContext()
  const { modal } = App.useApp()

  const handleRequestDelete = () => {
    modal.confirm({
      title: copy.characters.deleteConfirmTitle,
      content: copy.characters.deleteConfirmDescription,
      okText: copy.characters.delete,
      cancelText: copy.characters.cancel,
      okButtonProps: { danger: true, type: 'primary' },
      onOk: onDelete,
    })
  }

  const handleRequestRevive = () => {
    modal.confirm({
      title: copy.characters.reviveConfirmTitle,
      content: copy.characters.reviveConfirmDescription,
      okText: copy.characters.reviveAction,
      cancelText: copy.characters.cancel,
      onOk: onRevive,
    })
  }

  const handleRequestMarkAsDead = () => {
    modal.confirm({
      title: copy.characters.markDeadConfirmTitle,
      content: copy.characters.markDeadConfirmDescription,
      okText: copy.characters.markDeadAction,
      cancelText: copy.characters.cancel,
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
      title: copy.characters.export,
      description: copy.characters.exportHelp,
      action: (
        <Button htmlType='button' onClick={onExport} disabled={false}>
          {copy.characters.export}
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
            title: copy.characters.reviveAction,
            description: copy.characters.reviveConfirmDescription,
            action: (
              <Button
                type='primary'
                htmlType='button'
                onClick={handleRequestRevive}
                disabled={false}>
                {copy.characters.reviveAction}
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
            title: copy.characters.markDeadAction,
            description: copy.characters.dangerMarkDeadHelp,
            action: (
              <Button
                danger
                type='primary'
                htmlType='button'
                onClick={handleRequestMarkAsDead}
                disabled={false}>
                {copy.characters.markDeadAction}
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
      title: copy.characters.delete,
      description: copy.characters.deleteConfirmDescription,
      action: (
        <Button
          danger
          type='primary'
          htmlType='button'
          disabled={false}
          onClick={handleRequestDelete}>
          {copy.characters.delete}
        </Button>
      ),
    },
  ]

  return (
    <Card title={copy.characters.tabActions}>
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
