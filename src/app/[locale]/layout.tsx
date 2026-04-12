import { notFound } from 'next/navigation'
import { AppConfig, hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { NetworkStatusMonitor } from '@/components/AppProviders/NetworkStatusMonitor'
import { routing } from '@/i18n/routing'
import { AuthProvider } from '@/lib/auth/context'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const t = await getTranslations({ locale: locale as AppConfig['Locale'] })

  return {
    title: {
      default: t('metadata.title'),
      template: `%s — ${t('metadata.tab_brand')}`,
    },
    description: t('metadata.description'),
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(locale)

  return (
    <NextIntlClientProvider>
      <NetworkStatusMonitor />
      <AuthProvider>{children}</AuthProvider>
    </NextIntlClientProvider>
  )
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}
