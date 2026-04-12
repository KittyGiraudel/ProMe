import { useTranslations } from 'next-intl'
import { Button } from '@/components/Button/Button'
import { Link } from '@/i18n/navigation'
import { useAuth } from '@/lib/auth/context'

export function AuthButton() {
  const { user, logout, loading } = useAuth()
  const t = useTranslations()

  if (loading) return null

  return user ? (
    <Button onClick={logout} type='link'>
      {t('nav.logout')}
    </Button>
  ) : (
    <Link href='/login'>{t('nav.login')}</Link>
  )
}
