import type { Metadata } from 'next'
import { CharacterCreateClient } from './CharacterCreateClient'
import { getTranslations } from 'next-intl/server'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('characters.create_page_title'),
  }
}

export default function CharacterCreatePage() {
  return <CharacterCreateClient />
}
