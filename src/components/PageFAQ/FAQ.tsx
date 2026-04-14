'use client'

import { useTranslations } from 'next-intl'
import { Layout } from '@/components/Layout/Layout'
import { RichText } from '@/components/RichText/RichText'

import './FAQ.css'

export function FAQ({ content }: { content: string }) {
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
      <RichText text={content} headingIds />
    </Layout>
  )
}
