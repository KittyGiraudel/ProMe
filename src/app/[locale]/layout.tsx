import { notFound } from 'next/navigation'
import { AppConfig, hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'

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
  const title = t('metadata.title')
  const description = t('metadata.description')
  const template = `%s — ${t('metadata.tab_brand')}`

  return {
    applicationName: title,
    title: {
      default: title,
      template: template,
    },
    description: description,
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: title,
    },
    formatDetection: { telephone: false },
    openGraph: {
      type: 'website',
      siteName: title,
      title: { default: title, template: template },
      description: description,
    },
    twitter: {
      card: 'summary',
      title: { default: title, template: template },
      description: description,
    },
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

  return <NextIntlClientProvider>{children}</NextIntlClientProvider>
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}
