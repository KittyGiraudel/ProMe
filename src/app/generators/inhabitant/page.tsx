import { Suspense } from 'react'
import { GeneratorPageShell } from '@/components/GeneratorPageShell/GeneratorPageShell'
import { InhabitantGeneratorClient } from './InhabitantGeneratorClient'
import { copy } from '@/messages/fr'

function InhabitantGeneratorFallback() {
  return (
    <GeneratorPageShell
      title={copy.inhabitant.pageTitle}
      description={copy.inhabitant.pageDescription}
      backHref='/'
      backLabel={copy.nav.backHome}>
      <p>{copy.common.loading}</p>
    </GeneratorPageShell>
  )
}

export default function InhabitantGeneratorPage() {
  return (
    <Suspense fallback={<InhabitantGeneratorFallback />}>
      <InhabitantGeneratorClient />
    </Suspense>
  )
}
