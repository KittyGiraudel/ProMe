import type { Metadata } from 'next'
import { characterSheetMetadataTitle } from '../characterSheetTitle'
import { IdentityTabSection } from '../tabs/IdentityTabSection'

export const metadata: Metadata = {
  title: characterSheetMetadataTitle('identity'),
}

export default function CharacterSheetIdentityPage() {
  return <IdentityTabSection />
}
