import type { Metadata } from 'next'
import { CharacterCreateClient } from './CharacterCreateClient'
import { copy } from '@/messages/fr'

export const metadata: Metadata = {
  title: copy.characters.createPageTitle,
  description: copy.characters.createPageDescription,
}

export default function CharacterCreatePage() {
  return <CharacterCreateClient />
}
