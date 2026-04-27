import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { buildAlternates } from '@/app/metadataRoute'
import { PageLogin } from '@/components/PageLogin/PageLogin'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale: localeAsString } = await params
  const locale = localeAsString as AppConfig['Locale']
  const t = await getTranslations({ locale })
  const alternates = buildAlternates('login', locale)

  return {
    title: t('auth.title'),
    alternates,
    openGraph: {
      title: t('auth.title'),
      url: alternates.languages[locale],
    },
  }
}

export default function LoginPage() {
  return <PageLogin />
}
