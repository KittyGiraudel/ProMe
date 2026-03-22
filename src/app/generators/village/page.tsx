import { Suspense } from 'react'
import { GeneratorPageShell } from '@/components/GeneratorPageShell/GeneratorPageShell'
import { copy } from '@/messages/fr'
import { VillageGeneratorClient } from './VillageGeneratorClient'

function VillageGeneratorFallback() {
  return (
    <GeneratorPageShell
      title={copy.village.pageTitle}
      description={copy.village.pageDescription}
      backHref='/'
      backLabel={copy.nav.backHome}>
      <p>{copy.common.loading}</p>
    </GeneratorPageShell>
  )
}

export default function VillageGeneratorPage() {
  return (
    <Suspense fallback={<VillageGeneratorFallback />}>
      <VillageGeneratorClient />
    </Suspense>
  )
}
