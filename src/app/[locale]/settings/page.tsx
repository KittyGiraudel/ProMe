import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { buildAlternates } from '@/app/metadataRoute'
import { Settings } from '@/components/PageSettings/Settings'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale: localeAsString } = await params
  const locale = localeAsString as AppConfig['Locale']
  const t = await getTranslations({ locale })
  const alternates = buildAlternates('settings', locale)

  return {
    title: t('settings.title'),
    alternates,
    openGraph: {
      title: t('settings.title'),
      url: alternates.languages[locale],
    },
  }
}

export default function SettingsPage() {
  return <Settings />
}
