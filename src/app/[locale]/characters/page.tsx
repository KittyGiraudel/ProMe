import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { CharacterLibrary } from '@/components/PageCharacterLibrary/CharacterLibrary'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as AppConfig['Locale'] })

  return {
    title: t('characters_list.title'),
  }
}

export default function CharactersPage() {
  return <CharacterLibrary />
}
