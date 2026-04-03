import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { ClockCard } from '@/components/ClockCard/ClockCard'
import { MapCard } from '@/components/MapCard/MapCard'
import { Spacing } from '@/components/Spacing/Spacing'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as AppConfig['Locale'] })

  return {
    title: t('characters.map.title'),
  }
}

export default function CharacterMapPage() {
  return (
    <Spacing>
      <MapCard />
      <ClockCard />
    </Spacing>
  )
}
