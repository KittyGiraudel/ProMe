import { AppConfig } from 'next-intl'
import { CharacterLibraryClient } from './CharacterLibraryClient'
import { getTranslations } from 'next-intl/server'

type Props = { params: Promise<{ locale: AppConfig['Locale'] }> }

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
