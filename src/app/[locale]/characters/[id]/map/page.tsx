import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Space } from 'antd'
import { ClockCard } from '@/components/CharacterSheet/ClockCard'
import { MapCard } from '@/components/CharacterSheet/MapCard'

type Props = { params: Promise<{ locale: AppConfig['Locale'] }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('characters.map.title'),
  }
}

export default function CharacterSheetMapPage() {
  return (
    <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
      <MapCard />
      <ClockCard />
    </Space>
  )
}
