import { useTranslations } from 'next-intl'
import { Button } from '@/components/Button/Button'
import { BlockedLink } from '@/components/Navigation/BlockedLink'
import { useAuth } from '@/lib/auth/context'

export function AuthButton() {
  const { user, logout, loading } = useAuth()
  const t = useTranslations()

  if (loading) return null

  return user ? (
    <Button
      onClick={logout}
      type='text'
      style={{ color: 'inherit', padding: 0 }}>
      {t('nav.logout')}
    </Button>
  ) : (
    <BlockedLink href='/login'>{t('nav.login')}</BlockedLink>
  )
}
