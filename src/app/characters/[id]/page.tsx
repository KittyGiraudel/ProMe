import { CharacterSheetClient } from './CharacterSheetClient'

type CharacterPageProps = {
  params: Promise<{ id: string }>
}

export default async function CharacterSheetPage({
  params,
}: CharacterPageProps) {
  const { id } = await params
  return <CharacterSheetClient characterId={id} />
}
