import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { PageMarkdown } from '@/components/PageMarkdown/PageMarkdown'
import { routing } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as AppConfig['Locale'] })

  return {
    title: t('privacy.title'),
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: {
        en: '/en/privacy',
        fr: '/fr/privacy',
        'x-default': `/${routing.defaultLocale}/privacy`,
      },
    },
    openGraph: {
      title: t('privacy.title'),
      url: `/${locale}/privacy`,
    },
  }
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params
  const filePath = join(process.cwd(), 'messages', `privacy.${locale}.md`)
  const content = readFileSync(filePath, 'utf-8')

  const t = await getTranslations({ locale: locale as AppConfig['Locale'] })

  return (
    <PageMarkdown
      title={t('privacy.title')}
      breadcrumb={{ title: t('nav.privacy'), path: '/privacy' }}
      content={content}
      bannerBiome='prairieSea'
    />
  )
}
