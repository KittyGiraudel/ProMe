import type { PlayerCharacter } from '@/lib/playerCharacter/types'
import { normalizePlayerCharacter, touchPlayerCharacter } from '@/lib/playerCharacter/model'

const DRAFT_STORAGE_PREFIX = 'lsdp:playerCharacterDraft:v1:'

function getDraftKey(draftId: string): string {
  return `${DRAFT_STORAGE_PREFIX}${draftId}`
}

export function saveDraft(draft: PlayerCharacter): void {
  if (typeof window === 'undefined') return
  try {
    const normalized = normalizePlayerCharacter(draft)
    if (!normalized) return
    const touched = touchPlayerCharacter(normalized)
    window.sessionStorage.setItem(getDraftKey(draft.id), JSON.stringify(touched))
  } catch {
    // ignore (private mode / quota)
  }
}

export function loadDraft(draftId: string): PlayerCharacter | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(getDraftKey(draftId))
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    return normalizePlayerCharacter(parsed)
  } catch {
    return null
  }
}

export function clearDraft(draftId: string): void {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.removeItem(getDraftKey(draftId))
  } catch {
    // ignore
  }
}

