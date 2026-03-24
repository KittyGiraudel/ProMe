import { createCharacter } from '@/lib/character/model'
import type {
  Archetype,
  Character,
  CharacterInput,
  CharacterMapState,
  JournalEntry,
} from '@/lib/character/types'
import type { Gender } from '@/lib/types'

export type CharacterIdentityInput = {
  name: string
  archetype: Archetype
  gender?: Gender
}

type CharacterMemoryInheritance = Pick<Character, 'map' | 'journalEntries'>

function cloneMapState(map: CharacterMapState): CharacterMapState {
  return {
    currentPosition: { ...map.currentPosition },
    cells: map.cells.map(cell => ({ ...cell })),
  }
}

function cloneJournalEntries(entries: JournalEntry[]): JournalEntry[] {
  return entries.map(entry => ({ ...entry }))
}

function createInheritedMemoryInput(
  inheritedMemories?: CharacterMemoryInheritance,
): Pick<CharacterInput, 'map' | 'journalEntries'> | undefined {
  if (!inheritedMemories) return undefined

  return {
    map: cloneMapState(inheritedMemories.map),
    journalEntries: cloneJournalEntries(inheritedMemories.journalEntries),
  }
}

export function createCharacterFromIdentity(
  identity: CharacterIdentityInput,
  inheritedMemories?: CharacterMemoryInheritance,
): Character {
  return createCharacter({
    ...identity,
    ...createInheritedMemoryInput(inheritedMemories),
  })
}
