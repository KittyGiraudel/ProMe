import { useTranslations } from 'next-intl'
import { Button } from '@/components/Button/Button'
import { BlockedLink } from '@/components/Navigation/BlockedLink'
import { useAuth } from '@/lib/auth/context'

export function AuthButton({ className }: { className?: string }) {
  const { user, logout, loading } = useAuth()
  const t = useTranslations()

  if (loading) return null

  return user ? (
    <Button onClick={logout} type='text' className={className}>
      {t('nav.logout')}
    </Button>
  ) : (
    <BlockedLink href='/login' className={className}>
      {t('nav.login')}
    </BlockedLink>
  )
}
