import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Layout } from '@/components/Layout/Layout'
import { copy } from '@/messages/fr'
import { VillageGeneratorClient } from './VillageGeneratorClient'

export const metadata: Metadata = {
  title: copy.village.pageTitle,
  description: copy.village.pageDescription,
}

function VillageGeneratorFallback() {
  return (
    <Layout title={copy.village.pageTitle} pageCoverBiome='shadowForest'>
      <p>{copy.common.loading}</p>
    </Layout>
  )
}

export default function VillageGeneratorPage() {
  return (
    <Suspense fallback={<VillageGeneratorFallback />}>
      <VillageGeneratorClient />
    </Suspense>
  )
}
