import { AppConfig } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { use } from 'react'
import { buildAlternates } from '@/app/metadataRoute'
import { LandingPage } from '@/components/LandingPage/LandingPage'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale: localeAsString } = await params
  const locale = localeAsString as AppConfig['Locale']
  const t = await getTranslations({ locale })
  const alternates = buildAlternates('home', locale)

  return {
    title: { absolute: t('metadata.title') },
    description: t('metadata.description'),
    alternates,
    openGraph: {
      title: t('metadata.title'),
      description: t('metadata.description'),
      url: alternates.languages[locale],
    },
  }
}

export default function Home({ params }: Props) {
  const { locale } = use(params)

  setRequestLocale(locale as AppConfig['Locale'])

  return (
    <>
      <link
        rel='preload'
        as='image'
        href='/images/home-cover.avif'
        type='image/avif'
        fetchPriority='high'
      />
      <LandingPage />
    </>
  )
}
