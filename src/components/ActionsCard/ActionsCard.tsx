'use client'

import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined'
import DownloadOutlined from '@ant-design/icons/lib/icons/DownloadOutlined'
import FrownOutlined from '@ant-design/icons/lib/icons/FrownOutlined'
import HeartOutlined from '@ant-design/icons/lib/icons/HeartOutlined'
import { App, Avatar, Card, FormInstance, List, Popconfirm } from 'antd'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/Button/Button'
import { useCharacterLifeStatusActions } from '@/hooks/useCharacterLifeStatusActions'
import { SaveForm } from '@/hooks/useCharacterSheetForm'
import { useCharacterDelete } from '@/hooks/useMutation'
import { useRouter } from '@/i18n/navigation'
import { useCharacterExport } from './useCharacterExport'

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
  const { message } = App.useApp()
  const { id: characterId } = useParams<{ id: string }>()
  const router = useRouter()

  const { onKill: killCharacter, onRevive: reviveCharacter } =
    useCharacterLifeStatusActions({ saveForm })
  const exportCharacter = useCharacterExport(characterId, form)
  const [deleteCharacter] = useCharacterDelete({
    onCompleted: () => {
      message.success(t('characters.actions.delete_success'))
      router.push('/characters')
    },
    onError: () => message.error(t('errors.delete_character')),
  })

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
        <Button htmlType='button' onClick={exportCharacter} disabled={false}>
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
                onConfirm={reviveCharacter}
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
                onConfirm={killCharacter}
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
      <ul className='ActionsCard__list'>
        {items.map(item => (
          <li
            key={item.key}
            data-variant={item.variant}
            className='ActionsCard__item'>
            <div className='ActionsCard__item-icon'>{item.icon}</div>
            <div className='ActionsCard__item-content'>
              <p className='ActionsCard__item-title'>{item.title}</p>
              <p className='ActionsCard__item-description'>
                {item.description}
              </p>
            </div>
            <div className='ActionsCard__item-action'>{item.action}</div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
