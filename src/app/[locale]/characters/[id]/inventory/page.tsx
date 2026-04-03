import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { InventoryCard } from '@/components/InventoryCard/InventoryCard'
import { Spacing } from '@/components/Spacing/Spacing'
import { SpellbookCard } from '@/components/SpellbookCard/SpellbookCard'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as AppConfig['Locale'] })

  return {
    title: t('characters.inventory.title'),
  }
}

export default function CharacterInventoryPage() {
  return (
    <Spacing>
      <InventoryCard />
      <SpellbookCard />
    </Spacing>
  )
}
