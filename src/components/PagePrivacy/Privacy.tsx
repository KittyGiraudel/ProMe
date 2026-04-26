'use client'

import { useTranslations } from 'next-intl'
import { Layout } from '@/components/Layout/Layout'
import { RichText } from '@/components/RichText/RichText'

export function Privacy({ content }: { content: string }) {
  const t = useTranslations()

  return (
    <Layout
      title={t('privacy.title')}
      bannerBiome='prairieSea'
      breadcrumbs={[
        { title: t('nav.home'), path: '/' },
        { title: t('nav.privacy'), path: '/privacy' },
      ]}
      className='Privacy'>
      <RichText text={content} headingIds />
    </Layout>
  )
}
