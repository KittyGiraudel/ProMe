import { createCharacter } from '@/lib/character/model'
import type { Archetype, Character } from '@/lib/character/types'
import type { Gender } from '@/lib/types'

export type CharacterIdentityInput = {
  name: string
  archetype: Archetype
  gender?: Gender
}

export function createCharacterFromIdentity(
  identity: CharacterIdentityInput,
): Character {
  return createCharacter(identity)
}
