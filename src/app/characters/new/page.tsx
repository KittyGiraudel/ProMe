import type { Metadata } from 'next'
import { CharacterCreateClient } from './CharacterCreateClient'
import { getMessages } from '@/messages/locales'

const copy = getMessages()

export const metadata: Metadata = {
  title: copy.characters.createPageTitle,
  description: copy.characters.createPageDescription,
}

export default function CharacterCreatePage() {
  return <CharacterCreateClient />
}
