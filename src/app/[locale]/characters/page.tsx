import { CharacterLibraryClient } from './CharacterLibraryClient'
import { getTranslations } from 'next-intl/server'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('characters.page_title'),
  }
}

export default function CharactersPage() {
  return <CharacterLibraryClient />
}
