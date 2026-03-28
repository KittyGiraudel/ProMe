import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { FAQ } from '@/components/PageFAQ/FAQ'

type Props = { params: Promise<{ locale: AppConfig['Locale'] }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('faq.title'),
  }
}

export default function FAQPage() {
  return <FAQ />
}
