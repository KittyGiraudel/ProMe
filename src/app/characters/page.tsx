import type { Metadata } from 'next'
import { CharacterLibraryClient } from './CharacterLibraryClient'
import { getMessages } from '@/messages/locales'

const copy = getMessages()
export const metadata: Metadata = {
  title: copy.characters.pageTitle,
  description: copy.characters.pageDescription,
}

export default function CharactersPage() {
  return <CharacterLibraryClient />
}
