import { Space } from 'antd'
import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { ClockCard } from '@/components/PageCharacterSheet/ClockCard'
import { MapCard } from '@/components/PageCharacterSheet/MapCard'

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
    <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
      <MapCard />
      <ClockCard />
    </Space>
  )
}
