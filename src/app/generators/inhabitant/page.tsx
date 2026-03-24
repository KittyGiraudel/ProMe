import { Suspense } from 'react'
import { Layout } from '@/components/Layout/Layout'
import { InhabitantGeneratorClient } from './InhabitantGeneratorClient'
import { copy } from '@/messages/fr'

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
