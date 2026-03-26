import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Space } from 'antd'
import { InventoryCard } from '@/components/PageCharacterSheet/InventoryCard'
import { SpellbookCard } from '@/components/PageCharacterSheet/SpellbookCard'

type Props = { params: Promise<{ locale: AppConfig['Locale'] }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('characters.inventory.title'),
  }
}

export default function CharacterInventoryPage() {
  return (
    <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
      <InventoryCard />
      <SpellbookCard />
    </Space>
  )
}
