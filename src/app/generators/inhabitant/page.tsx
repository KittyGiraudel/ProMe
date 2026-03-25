import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Layout } from '@/components/Layout/Layout'
import { InhabitantGeneratorClient } from './InhabitantGeneratorClient'
import { getMessages } from '@/messages/locales'

const copy = getMessages()

export const metadata: Metadata = {
  title: copy.inhabitant.pageTitle,
  description: copy.inhabitant.pageDescription,
}

function InhabitantGeneratorFallback() {
  return (
    <Layout title={copy.inhabitant.pageTitle} pageCoverBiome='fieldSea'>
      <p>{copy.common.loading}</p>
    </Layout>
  )
}

export default function InhabitantGeneratorPage() {
  return (
    <Suspense fallback={<InhabitantGeneratorFallback />}>
      <InhabitantGeneratorClient />
    </Suspense>
  )
}
