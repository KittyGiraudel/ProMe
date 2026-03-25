import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { InventoryTabSection } from '../tabs/InventoryTabSection'

type Props = { params: Promise<{ locale: AppConfig['Locale'] }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('characters.inventory.title'),
  }
}

export default function CharacterSheetInventoryPage() {
  return <InventoryTabSection />
}
