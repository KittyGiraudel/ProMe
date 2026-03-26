import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { CharacterCreate } from '@/components/PageCharacterCreate/CharacterCreate'

type Props = { params: Promise<{ locale: AppConfig['Locale'] }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('new_character.title'),
  }
}

export default function CharacterCreatePage() {
  return <CharacterCreate />
}
