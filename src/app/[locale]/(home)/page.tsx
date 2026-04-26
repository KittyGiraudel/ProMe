import { AppConfig } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { use } from 'react'
import { LandingPage } from '@/components/LandingPage/LandingPage'
import { routing } from '@/i18n/routing'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as AppConfig['Locale'] })

  return {
    title: { absolute: t('metadata.title') },
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
      title: t('metadata.title'),
      description: t('metadata.description'),
      url: `/${locale}`,
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
