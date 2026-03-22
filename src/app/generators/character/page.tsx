import { Suspense } from 'react'
import { GeneratorPageShell } from '@/components/GeneratorPageShell/GeneratorPageShell'
import { CharacterGeneratorClient } from './CharacterGeneratorClient'
import { fr } from '@/messages/fr'

function CharacterGeneratorFallback() {
  return (
    <GeneratorPageShell
      title={fr.character.pageTitle}
      description={fr.character.pageDescription}
      backHref='/'
      backLabel={fr.nav.backHome}>
      <p>{fr.common.loading}</p>
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
