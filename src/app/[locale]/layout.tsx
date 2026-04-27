import { notFound } from 'next/navigation'
import { AppConfig, hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildAlternates } from '@/app/metadataRoute'
import { NetworkStatusMonitor } from '@/components/AppProviders/NetworkStatusMonitor'
import { routing } from '@/i18n/routing'
import { AuthProvider } from '@/lib/auth/context'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

const OG_IMAGE = {
  url: '/favicon.svg',
  type: 'image/svg+xml',
  alt: 'ProMe favicon',
}

export async function generateMetadata({ params }: Props) {
  const { locale: localeAsString } = await params
  const locale = localeAsString as AppConfig['Locale']

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const t = await getTranslations({ locale })
  const ogLocale = locale === 'fr' ? 'fr_FR' : 'en_US'

  return {
    title: {
      default: t('metadata.title'),
      template: `%s — ${t('metadata.tab_brand')}`,
    },
    description: t('metadata.description'),
    alternates: buildAlternates('home', locale),
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
    sameAs: ['https://github.com/KittyGiraudel'],
  },
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: localeAsString } = await params
  const locale = localeAsString as AppConfig['Locale']

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
