import type { Metadata } from 'next'
import { characterSheetMetadataTitle } from '../characterSheetTitle'
import { MapTabSection } from '../tabs/MapTabSection'

export const metadata: Metadata = {
  title: characterSheetMetadataTitle('map'),
}

export default function CharacterSheetMapPage() {
  return <MapTabSection />
}
