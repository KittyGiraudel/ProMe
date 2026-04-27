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
    title: t('about.title'),
    alternates: {
      canonical: `/${locale}/about`,
      languages: {
        en: '/en/about',
        fr: '/fr/about',
        'x-default': `/${routing.defaultLocale}/about`,
      },
    },
    openGraph: {
      title: t('about.title'),
      url: `/${locale}/about`,
    },
  }
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  const filePath = join(process.cwd(), 'messages', `about.${locale}.md`)
  const content = readFileSync(filePath, 'utf-8')

  const t = await getTranslations({ locale: locale as AppConfig['Locale'] })

  return (
    <PageMarkdown
      title={t('about.title')}
      breadcrumb={{ title: t('nav.about'), path: '/about' }}
      content={content}
      bannerBiome='titanGarden'
    />
  )
}
