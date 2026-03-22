import { Suspense } from 'react'
import { GeneratorPageShell } from '@/components/GeneratorPageShell/GeneratorPageShell'
import { CharacterGeneratorClient } from './CharacterGeneratorClient'
import { copy } from '@/messages/fr'

function CharacterGeneratorFallback() {
  return (
    <GeneratorPageShell
      title={copy.character.pageTitle}
      description={copy.character.pageDescription}
      backHref='/'
      backLabel={copy.nav.backHome}>
      <p>{copy.common.loading}</p>
    </GeneratorPageShell>
  )
}

export default function CharacterGeneratorPage() {
  return (
    <Suspense fallback={<CharacterGeneratorFallback />}>
      <CharacterGeneratorClient />
    </Suspense>
  )
}
