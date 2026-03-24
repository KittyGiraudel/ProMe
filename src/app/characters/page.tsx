import type { Metadata } from 'next'
import { CharacterLibraryClient } from './CharacterLibraryClient'
import { copy } from '@/messages/fr'

export const metadata: Metadata = {
  title: copy.characters.pageTitle,
  description: copy.characters.pageDescription,
}

export default function CharactersPage() {
  return <CharacterLibraryClient />
}
