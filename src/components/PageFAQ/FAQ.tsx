'use client'

import { Typography } from 'antd'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/Layout/Layout'
import './FAQ.css'
import { TranslationKey } from '@/lib/types'

const ENTRY_COUNT = 4

export function FAQ() {
  const t = useTranslations()

  return (
    <Layout
      title={t('faq.title')}
      bannerBiome='mushroomJungle'
      breadcrumbs={[
        { title: t('nav.home'), path: '/' },
        { title: t('nav.faq'), path: '/faq' },
      ]}
      className='FAQ'>
      {Array.from({ length: ENTRY_COUNT }, (_, i) => (
        <Entry index={i + 1} key={i + 1} />
      ))}
    </Layout>
  )
}

function Entry({ index }: { index: number }) {
  const t = useTranslations()
  return (
    <>
      <Typography.Title level={2}>
        {t(`faq.question_${index}` as TranslationKey)}
      </Typography.Title>
      <Paragraphs translation={t(`faq.answer_${index}` as TranslationKey)} />
    </>
  )
}

function Paragraphs({ translation }: { translation: string }) {
  return translation.split(/\n/g).map((paragraph, index, paragraphs) => (
    <Typography.Paragraph
      key={index}
      style={{ marginBottom: paragraphs.length - 1 === index ? 0 : 12 }}>
      {paragraph}
    </Typography.Paragraph>
  ))
}
