import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { buildAlternates } from '@/app/metadataRoute'
import { PageMarkdown } from '@/components/PageMarkdown/PageMarkdown'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale: localeAsString } = await params
  const locale = localeAsString as AppConfig['Locale']
  const t = await getTranslations({ locale })
  const alternates = buildAlternates('privacy', locale)

  return {
    title: t('privacy.title'),
    alternates,
    openGraph: {
      title: t('privacy.title'),
      url: alternates.languages[locale],
    },
  }
}

export default async function PrivacyPage({ params }: Props) {
  const { locale: localeAsString } = await params
  const locale = localeAsString as AppConfig['Locale']
  const filePath = join(process.cwd(), 'messages', `privacy.${locale}.md`)
  const content = readFileSync(filePath, 'utf-8')

  const t = await getTranslations({ locale })

  return (
    <PageMarkdown
      title={t('privacy.title')}
      breadcrumb={{ title: t('nav.privacy'), to: { route: 'privacy' } }}
      content={content}
      bannerBiome='prairieSea'
    />
  )
}
