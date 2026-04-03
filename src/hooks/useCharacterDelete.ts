import { App } from 'antd'
import { useTranslations } from 'next-intl'
import { useCallback, useMemo } from 'react'
import { useRouter } from '@/i18n/navigation'
import { getCharacterStore } from '@/lib/character/store'

export function useCharacterDelete(characterId: string) {
  const store = useMemo(() => getCharacterStore(), [])
  const router = useRouter()
  const { message, modal } = App.useApp()
  const t = useTranslations()

  const onDelete = useCallback(() => {
    store.delete(characterId)
    message.success(t('characters.actions.delete_success'))
    // Programmatic navigation is intentionally not routed through the
    // unsaved-changes blocker (which is used by `BlockedLink`).
    router.push('/characters')
  }, [t, message, router, store])

  const deleteWithConfirmation = () => {
    modal.confirm({
      title: t('characters.actions.delete_confirm_title'),
      content: t('characters.actions.delete_confirm_description'),
      okText: t('common.actions.delete'),
      cancelText: t('common.actions.cancel'),
      okButtonProps: { danger: true, type: 'primary' },
      onOk: onDelete,
    })
  }

  return useMemo(
    () => ({ delete: onDelete, deleteWithConfirmation }),
    [onDelete, deleteWithConfirmation]
  )
}
