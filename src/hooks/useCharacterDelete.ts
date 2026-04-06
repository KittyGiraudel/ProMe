import { App } from 'antd'
import { useTranslations } from 'next-intl'
import { useCallback, useMemo } from 'react'
import { useRouter } from '@/i18n/navigation'
import { getCharacterStore } from '@/lib/character/store'

export function useCharacterDelete(characterId: string) {
  const store = useMemo(() => getCharacterStore(), [])
  const router = useRouter()
  const { message } = App.useApp()
  const t = useTranslations()

  const onDelete = useCallback(() => {
    store.delete(characterId)
    message.success(t('characters.actions.delete_success'))
    // Programmatic navigation is intentionally not routed through the
    // unsaved-changes blocker (which is used by `BlockedLink`).
    router.push('/characters')
  }, [t, message, router, store, characterId])

  return useMemo(() => ({ delete: onDelete }), [onDelete])
}
