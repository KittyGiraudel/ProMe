import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import { NpcGeneratorFallback } from '@/components/PageGeneratorNpc/Fallback'
import { NpcGenerator } from '@/components/PageGeneratorNpc/NpcGenerator'
import { routing } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as AppConfig['Locale'] })

  return {
    title: t('inhabitant.title'),
    alternates: {
      canonical: `/${locale}/generators/npc`,
      languages: {
        en: '/en/generators/npc',
        fr: '/fr/generators/npc',
        'x-default': `/${routing.defaultLocale}/generators/npc`,
      },
    },
    openGraph: {
      title: t('inhabitant.title'),
      url: `/${locale}/generators/npc`,
    },
  }
}

export default function NpcGeneratorPage() {
  return (
    <Suspense fallback={<NpcGeneratorFallback />}>
      <NpcGenerator initialRoll={null} />
    </Suspense>
  )
}
