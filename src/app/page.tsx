import type { Metadata } from 'next'
import { HomeHub } from '@/components/HomeHub/HomeHub'
import { copy } from '@/messages/fr'

export const metadata: Metadata = {
  title: copy.hub.title,
}

export default function Home() {
  return <HomeHub />
}
