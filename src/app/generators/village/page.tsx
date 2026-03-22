import { Suspense } from 'react'
import { GeneratorPageShell } from '@/components/GeneratorPageShell/GeneratorPageShell'
import { fr } from '@/messages/fr'
import { VillageGeneratorClient } from './VillageGeneratorClient'

function VillageGeneratorFallback() {
  return (
    <GeneratorPageShell
      title={fr.village.pageTitle}
      description={fr.village.pageDescription}
      backHref='/'
      backLabel={fr.nav.backHome}>
      <p>{fr.common.loading}</p>
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
