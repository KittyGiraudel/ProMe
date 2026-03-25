'use client'

import { App, Avatar, Card, List } from 'antd'
import { useTranslations } from 'next-intl'
import {
  DownloadOutlined,
  FrownOutlined,
  HeartOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { Button } from '@/components/Button/Button'
import { useCharacterContext } from '@/components/CharacterSheet/CharacterContext'
import './ActionsTabSection.css'

export function ActionsTabSection() {
  const t = useTranslations()
  const { onKill, onExport, onRevive, onDelete, isDead } = useCharacterContext()
  const { modal } = App.useApp()

  const handleRequestDelete = () => {
    modal.confirm({
      title: t('characters.delete_confirm_title'),
      content: t('characters.delete_confirm_description'),
      okText: t('common.delete'),
      cancelText: t('common.cancel'),
      okButtonProps: { danger: true, type: 'primary' },
      onOk: onDelete,
    })
  }

  const handleRequestRevive = () => {
    modal.confirm({
      title: t('characters.revive_confirm_title'),
      content: t('characters.revive_confirm_description'),
      okText: t('characters.revive_action'),
      cancelText: t('common.cancel'),
      onOk: onRevive,
    })
  }

  const handleRequestMarkAsDead = () => {
    modal.confirm({
      title: t('characters.mark_dead_confirm_title'),
      content: t('characters.mark_dead_confirm_description'),
      okText: t('characters.mark_dead_action'),
      cancelText: t('common.cancel'),
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
      title: t('characters.export'),
      description: t('characters.export_help'),
      action: (
        <Button htmlType='button' onClick={onExport} disabled={false}>
          {t('characters.export')}
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
            title: t('characters.revive_action'),
            description: t('characters.revive_confirm_description'),
            action: (
              <Button
                type='primary'
                htmlType='button'
                onClick={handleRequestRevive}
                disabled={false}>
                {t('characters.revive_action')}
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
            title: t('characters.mark_dead_action'),
            description: t('characters.danger_mark_dead_help'),
            action: (
              <Button
                danger
                type='primary'
                htmlType='button'
                onClick={handleRequestMarkAsDead}
                disabled={false}>
                {t('characters.mark_dead_action')}
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
      title: t('characters.delete'),
      description: t('characters.delete_confirm_description'),
      action: (
        <Button
          danger
          type='primary'
          htmlType='button'
          disabled={false}
          onClick={handleRequestDelete}>
          {t('characters.delete')}
        </Button>
      ),
    },
  ]

  return (
    <Card title={t('characters.tab_actions')}>
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
