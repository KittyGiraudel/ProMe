'use client'

import { useTranslations } from 'next-intl'
import { PropsWithChildren } from 'react'
import { Layout } from '@/components/Layout/Layout'
import { RichText } from '@/components/RichText/RichText'
import type { AppRouteTo } from '@/i18n/navigation'
import { PossibleBiomeId } from '@/lib/types'

import './PageMarkdown.css'

export type PageMarkdownProps = PropsWithChildren<{
  title: string
  breadcrumb: { title: string; to: AppRouteTo }
  content: string
  bannerBiome: PossibleBiomeId
}>

export function PageMarkdown({
  title,
  breadcrumb,
  content,
  bannerBiome,
  children,
}: PageMarkdownProps) {
  const t = useTranslations()

  return (
    <Layout
      title={title}
      bannerBiome={bannerBiome}
      breadcrumbs={[
        { title: t('nav.home'), to: { route: 'home' } },
        breadcrumb,
      ]}
      className='PageMarkdown'>
      <RichText text={content} headingIds />
      {children}
    </Layout>
  )
}
