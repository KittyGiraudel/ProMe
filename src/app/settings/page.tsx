import type { Metadata } from 'next'
import { SettingsPageClient } from './SettingsPageClient'
import { getMessages } from '@/messages/locales'

const copy = getMessages()

export const metadata: Metadata = {
  title: copy.settings.pageTitle,
  description: copy.settings.pageDescription,
}

export default function SettingsPage() {
  return <SettingsPageClient />
}
