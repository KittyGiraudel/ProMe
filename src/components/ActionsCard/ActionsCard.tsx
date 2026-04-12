'use client'

import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined'
import DownloadOutlined from '@ant-design/icons/lib/icons/DownloadOutlined'
import FrownOutlined from '@ant-design/icons/lib/icons/FrownOutlined'
import HeartOutlined from '@ant-design/icons/lib/icons/HeartOutlined'
import { App, Avatar, Card, FormInstance, List, Popconfirm } from 'antd'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'
import { Button } from '@/components/Button/Button'
import { useCharacterLifeStatusActions } from '@/hooks/useCharacterLifeStatusActions'
import { SaveForm } from '@/hooks/useCharacterSheetForm'
import { useCharacterDelete } from '@/hooks/useMutation'
import { useRouter } from '@/i18n/navigation'
import { getCharacterStore } from '@/lib/character/store'
import { stringifyCharacter } from '@/lib/character/store/migrations'
import { ServerError } from '@/lib/character/store/remoteStore'
import {
  buildCharacterExportFileName,
  downloadJsonFile,
} from '@/lib/download/downloadJsonFile'

import './ActionsCard.css'

export function ActionsCard({
  isDead,
  saveForm,
  form,
}: {
  isDead: boolean
  saveForm: SaveForm
  form: FormInstance
}) {
  const t = useTranslations()
  const { onKill, onRevive } = useCharacterLifeStatusActions({ saveForm })
  const { message } = App.useApp()
  const params = useParams<{ id: string }>()
  const characterId = params?.id
  const router = useRouter()
  const [deleteCharacter] = useCharacterDelete({
    onCompleted: () => {
      message.success(t('characters.actions.delete_success'))
      router.push('/characters')
    },
    onError: () => message.error(t('errors.delete_character')),
  })
  const onExport = useCallback(async () => {
    // @TODO: replace this with a lazy query
    try {
      const saved = await getCharacterStore().get(characterId as string)
      const character = { ...saved, ...form.getFieldsValue(true) }
      const content = stringifyCharacter(character)

      downloadJsonFile(content, buildCharacterExportFileName(character))
      message.success(t('characters.actions.export_downloaded'))
    } catch (error) {
      console.error(error)
      if (error instanceof ServerError) {
        message.error(t('errors.get_character'))
      } else {
        message.error(t('errors.export_download'))
      }
    }
  }, [characterId, message, t, form])

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
              <Popconfirm
                title={t('characters.actions.revive_confirm_title')}
                description={t('characters.actions.revive_confirm_description')}
                okText={t('characters.actions.revive_action')}
                cancelText={t('common.actions.cancel')}
                okButtonProps={{ disabled: false }}
                cancelButtonProps={{ disabled: false }}
                onConfirm={onRevive}
                styles={{ container: { maxWidth: 300 } }}>
                <Button type='primary' htmlType='button' disabled={false}>
                  {t('characters.actions.revive_action')}
                </Button>
              </Popconfirm>
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
              <Popconfirm
                title={t('characters.actions.mark_dead_confirm_title')}
                description={t(
                  'characters.actions.mark_dead_confirm_description'
                )}
                okText={t('characters.actions.mark_dead_action')}
                cancelText={t('common.actions.cancel')}
                onConfirm={onKill}
                styles={{ container: { maxWidth: 300 } }}>
                <Button
                  danger
                  type='default'
                  htmlType='button'
                  disabled={false}>
                  {t('characters.actions.mark_dead_action')}
                </Button>
              </Popconfirm>
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
        <Popconfirm
          title={t('characters.actions.delete_confirm_title')}
          description={t('characters.actions.delete_confirm_description')}
          okText={t('common.actions.delete')}
          cancelText={t('common.actions.cancel')}
          onConfirm={() => deleteCharacter({ id: characterId as string })}
          okButtonProps={{ disabled: false }}
          cancelButtonProps={{ disabled: false }}
          styles={{ container: { maxWidth: 300 } }}>
          <Button danger type='primary' htmlType='button' disabled={false}>
            {t('common.actions.delete')}
          </Button>
        </Popconfirm>
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
