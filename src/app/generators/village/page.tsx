import { Suspense } from 'react'
import { Layout } from '@/components/Layout/Layout'
import { copy } from '@/messages/fr'
import { VillageGeneratorClient } from './VillageGeneratorClient'

function VillageGeneratorFallback() {
  return (
    <Layout title={copy.village.pageTitle}>
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
