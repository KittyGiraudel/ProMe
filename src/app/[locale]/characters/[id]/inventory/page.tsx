import { InventoryTabSection } from '../tabs/InventoryTabSection'
import { getTranslations } from 'next-intl/server'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('characters.inventory_title'),
  }
}

export default function CharacterSheetInventoryPage() {
  return <InventoryTabSection />
}
