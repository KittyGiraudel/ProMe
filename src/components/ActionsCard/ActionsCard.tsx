'use client'

import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined'
import DownloadOutlined from '@ant-design/icons/lib/icons/DownloadOutlined'
import FrownOutlined from '@ant-design/icons/lib/icons/FrownOutlined'
import HeartOutlined from '@ant-design/icons/lib/icons/HeartOutlined'
import { App, Avatar, Card, Form, List } from 'antd'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'
import { Button } from '@/components/Button/Button'
import { useCharacterContext } from '@/components/CharacterContext/CharacterContext'
import { useCharacterDelete } from '@/hooks/useCharacterDelete'
import { stringifyCharacters } from '@/lib/character/store/migrations'
import {
  buildCharacterExportFileName,
  downloadJsonFile,
} from '@/lib/download/downloadJsonFile'

import './ActionsCard.css'

export function ActionsCard() {
  const t = useTranslations()
  const { onKill, onRevive, isDead } = useCharacterContext()
  const { modal, message } = App.useApp()
  const form = Form.useFormInstance()
  const { id: characterId } = useParams()
  const { deleteWithConfirmation } = useCharacterDelete(characterId as string)

  const onExport = useCallback(() => {
    const character = { ...form.getFieldsValue(true), id: characterId }
    const content = stringifyCharacters([character])
    try {
      downloadJsonFile(content, buildCharacterExportFileName(character))
      message.success(t('characters.actions.export_downloaded'))
    } catch (error) {
      console.error(error)
      message.error(t('characters.actions.export_download_error'))
    }
  }, [characterId, message, t])

  const handleRequestRevive = () => {
    modal.confirm({
      title: t('characters.actions.revive_confirm_title'),
      content: t('characters.actions.revive_confirm_description'),
      okText: t('characters.actions.revive_action'),
      cancelText: t('common.actions.cancel'),
      onOk: onRevive,
    })
  }

  const handleRequestMarkAsDead = () => {
    modal.confirm({
      title: t('characters.actions.mark_dead_confirm_title'),
      content: t('characters.actions.mark_dead_confirm_description'),
      okText: t('characters.actions.mark_dead_action'),
      cancelText: t('common.actions.cancel'),
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
      title: t('characters.actions.export'),
      description: t('characters.actions.export_help'),
      action: (
        <Button htmlType='button' onClick={onExport} disabled={false}>
          {t('characters.actions.export')}
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
            title: t('characters.actions.revive_action'),
            description: t('characters.actions.revive_confirm_description'),
            action: (
              <Button
                type='primary'
                htmlType='button'
                onClick={handleRequestRevive}
                disabled={false}>
                {t('characters.actions.revive_action')}
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
            title: t('characters.actions.mark_dead_action'),
            description: t('characters.actions.danger_mark_dead_help'),
            action: (
              <Button
                danger
                type='default'
                htmlType='button'
                onClick={handleRequestMarkAsDead}
                disabled={false}>
                {t('characters.actions.mark_dead_action')}
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
      title: t('common.actions.delete'),
      description: t('characters.actions.delete_confirm_description'),
      action: (
        <Button
          danger
          type='primary'
          htmlType='button'
          disabled={false}
          onClick={deleteWithConfirmation}>
          {t('common.actions.delete')}
        </Button>
      ),
    },
  ]

  return (
    <Card title={t('characters.actions.title')} id='actions'>
      <List
        className='ActionsCard__list'
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
