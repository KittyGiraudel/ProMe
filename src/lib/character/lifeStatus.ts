import type { Character, LifeStatus } from '@/lib/character/types'

export function normalizeLifeStatus(value: unknown): LifeStatus {
  return value === 'dead' ? 'dead' : 'alive'
}

export function isCharacterDead(character: Character): boolean {
  return character.lifeStatus === 'dead'
}

function comparableSnapshot(
  character: Character
): Omit<Character, 'updatedAt'> {
  const { updatedAt, ...snapshot } = character
  void updatedAt
  return snapshot
}

export function canPersistCharacterUpdate(
  existing: Character | null,
  next: Character
): boolean {
  if (!existing || !isCharacterDead(existing)) return true
  if (next.lifeStatus === 'alive') {
    const revived = { ...next, lifeStatus: 'dead' as const }
    return (
      JSON.stringify(comparableSnapshot(existing)) ===
      JSON.stringify(comparableSnapshot(revived))
    )
  }
  return (
    JSON.stringify(comparableSnapshot(existing)) ===
    JSON.stringify(comparableSnapshot(next))
  )
}
