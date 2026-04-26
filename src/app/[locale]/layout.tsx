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

const OG_IMAGE = {
  url: '/web-app-manifest-512x512.png',
  width: 512,
  height: 512,
  alt: 'ProMe',
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const t = await getTranslations({ locale: locale as AppConfig['Locale'] })
  const ogLocale = locale === 'fr' ? 'fr_FR' : 'en_US'

  return {
    title: {
      default: t('metadata.title'),
      template: `%s — ${t('metadata.tab_brand')}`,
    },
    description: t('metadata.description'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        fr: '/fr',
        'x-default': `/${routing.defaultLocale}`,
      },
    },
    openGraph: {
      siteName: 'ProMe',
      locale: ogLocale,
      type: 'website',
      title: t('metadata.title'),
      description: t('metadata.description'),
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary',
      title: t('metadata.title'),
      description: t('metadata.description'),
      images: [OG_IMAGE.url],
    },
  }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'ProMe',
  url: 'https://prome.games',
  description:
    "Game companion for The Protector's Memories: managers, Protector generators, villages, and more.",
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  author: {
    '@type': 'Person',
    name: 'Kitty Giraudel',
    url: 'https://kittygiraudel.com',
  },
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  // Ensure that the incoming `locale` is valid
  if (!hasLocale(routing.locales, locale)) notFound()

  // Enable static rendering
  setRequestLocale(locale)

  return (
    <NextIntlClientProvider>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NetworkStatusMonitor />
      <AuthProvider>{children}</AuthProvider>
    </NextIntlClientProvider>
  )
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}
