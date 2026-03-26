import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Space } from 'antd'
import { IdentityCard } from '@/components/CharacterSheet/IdentityCard'
import { CharacteristicsCard } from '@/components/CharacterSheet/CharacteristicsCard'

type Props = { params: Promise<{ locale: AppConfig['Locale'] }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('characters.identity.title'),
  }
}

export default function CharacterSheetIdentityPage() {
  return (
    <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
      <IdentityCard isArchetypeReadonly />
      <CharacteristicsCard />
    </Space>
  )
}
