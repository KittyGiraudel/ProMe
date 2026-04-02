import { Space } from 'antd'
import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { CharacteristicsCard } from '@/components/CharacteristicsCard/CharacteristicsCard'
import { IdentityCard } from '@/components/IdentityCard/IdentityCard'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as AppConfig['Locale'] })

  return {
    title: t('characters.identity.title'),
  }
}

export default function CharacterIdentityPage() {
  return (
    <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
      <IdentityCard isArchetypeReadonly />
      <CharacteristicsCard />
    </Space>
  )
}
