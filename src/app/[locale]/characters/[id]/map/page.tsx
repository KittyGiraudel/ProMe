import { getTranslations } from 'next-intl/server'
import { MapTabSection } from '../tabs/MapTabSection'
import { AppConfig } from 'next-intl'

type Props = { params: Promise<{ locale: AppConfig['Locale'] }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('characters.map_title'),
  }
}

export default function CharacterSheetMapPage() {
  return <MapTabSection />
}
