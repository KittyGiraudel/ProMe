import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { PageMarkdown } from '@/components/PageMarkdown/PageMarkdown'
import { routing } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }> }

const VIDEO_ID = 'd0VSQF5TAkQ'

const videoJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: 'The Protector’s Memories — Review by Salt and Sass Games',
  description:
    'Salt and Sass Games reviews The Protector’s Memories solo TTRPG on YouTube.',
  embedUrl: `https://www.youtube.com/embed/${VIDEO_ID}`,
  url: `https://www.youtube.com/watch?v=${VIDEO_ID}`,
  thumbnailUrl: `https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`,
}

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
  const videoTitle = t('about.video_title')

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
      />
      <PageMarkdown
        title={t('about.title')}
        breadcrumb={{ title: t('nav.about'), path: '/about' }}
        content={content}
        bannerBiome='titanGarden'>
        <>
          <hr />
          <h2>{videoTitle}</h2>
          <div className='PageMarkdown__video-embed'>
            <iframe
              src={`https://www.youtube.com/embed/${VIDEO_ID}`}
              title={videoTitle}
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
              loading='lazy'
            />
          </div>
        </>
      </PageMarkdown>
    </>
  )
}
