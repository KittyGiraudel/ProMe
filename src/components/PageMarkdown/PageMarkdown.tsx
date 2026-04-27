'use client'

import { useTranslations } from 'next-intl'
import { Layout } from '@/components/Layout/Layout'
import { RichText } from '@/components/RichText/RichText'
import { PossibleBiomeId } from '@/lib/types'

import './PageMarkdown.css'

export type PageMarkdownProps = {
  title: string
  breadcrumb: { title: string; path: string }
  content: string
  bannerBiome: PossibleBiomeId
}

export function PageMarkdown({
  title,
  breadcrumb,
  content,
  bannerBiome,
}: PageMarkdownProps) {
  const t = useTranslations()

  return (
    <Layout
      title={title}
      bannerBiome={bannerBiome}
      breadcrumbs={[{ title: t('nav.home'), path: '/' }, breadcrumb]}
      className='PageMarkdown'>
      <RichText text={content} headingIds />
    </Layout>
  )
}
