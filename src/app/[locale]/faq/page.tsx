import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { FAQ } from '@/components/PageFAQ/FAQ'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as AppConfig['Locale'] })

  return {
    title: t('faq.title'),
  }
}

export default async function FAQPage({ params }: Props) {
  const { locale } = await params
  const filePath = join(process.cwd(), 'messages', `faq.${locale}.md`)
  const content = readFileSync(filePath, 'utf-8')

  return <FAQ content={content} />
}
