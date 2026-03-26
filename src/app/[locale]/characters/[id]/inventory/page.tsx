import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Space } from 'antd'
import { InventoryCard } from '@/components/CharacterSheet/InventoryCard'
import { SpellbookCard } from '@/components/CharacterSheet/SpellbookCard'

type Props = { params: Promise<{ locale: AppConfig['Locale'] }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('characters.inventory.title'),
  }
}

export default function CharacterSheetInventoryPage() {
  return (
    <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
      <InventoryCard />
      <SpellbookCard />
    </Space>
  )
}
