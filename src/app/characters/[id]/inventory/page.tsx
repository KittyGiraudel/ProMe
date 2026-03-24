import type { Metadata } from 'next'
import { characterSheetMetadataTitle } from '../characterSheetTitle'
import { InventoryTabSection } from '../tabs/InventoryTabSection'

export const metadata: Metadata = {
  title: characterSheetMetadataTitle('inventory'),
}

export default function CharacterSheetInventoryPage() {
  return <InventoryTabSection />
}
