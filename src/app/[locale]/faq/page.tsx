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
  const alternates = buildAlternates('faq', locale)

  return {
    title: t('faq.title'),
    alternates,
    openGraph: {
      title: t('faq.title'),
      url: alternates.languages[locale],
    },
  }
}

function buildFaqJsonLd(content: string) {
  const sections = content.split('\n## ').slice(1)
  const mainEntity = sections.map(section => {
    const nl = section.indexOf('\n')
    const question = section.slice(0, nl).trim()
    const answer = section
      .slice(nl)
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/^[0-9]+\. /gm, '')
      .replace(/^[-*] /gm, '')
      .replace(/\n+/g, ' ')
      .trim()
    return {
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    }
  })
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity }
}

export default async function FAQPage({ params }: Props) {
  const { locale: localeAsString } = await params
  const locale = localeAsString as AppConfig['Locale']
  const filePath = join(process.cwd(), 'messages', `faq.${locale}.md`)
  const content = readFileSync(filePath, 'utf-8')
  const t = await getTranslations({ locale })

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildFaqJsonLd(content)),
        }}
      />
      <PageMarkdown
        title={t('faq.title')}
        breadcrumb={{ title: t('nav.faq'), to: { route: 'faq' } }}
        content={content}
        bannerBiome='mushroomJungle'
      />
    </>
  )
}
