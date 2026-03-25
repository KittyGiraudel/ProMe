import type { Metadata } from 'next'
import { HomeHub } from '@/components/HomeHub/HomeHub'
import { getMessages } from '@/messages/locales'

export const metadata: Metadata = {
  title: getMessages().hub.title,
}

export default function Home() {
  return <HomeHub />
}
