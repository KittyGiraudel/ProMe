import type { Character } from '@/lib/character/types'
import { normalizeCharacter, touchCharacter } from '@/lib/character/model'

const DRAFT_STORAGE_PREFIX = 'lsdp:characterDraft:v1:'

function getDraftKey(draftId: string): string {
  return `${DRAFT_STORAGE_PREFIX}${draftId}`
}

export function saveDraft(draft: Character): void {
  if (typeof window === 'undefined') return
  try {
    const normalized = normalizeCharacter(draft)
    if (!normalized) return
    const touched = touchCharacter(normalized)
    window.sessionStorage.setItem(
      getDraftKey(draft.id),
      JSON.stringify(touched)
    )
  } catch {
    // ignore (private mode / quota)
  }
}

export function loadDraft(draftId: string): Character | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(getDraftKey(draftId))
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    return normalizeCharacter(parsed)
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
