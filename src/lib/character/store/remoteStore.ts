import { SaveError } from '@/lib/character/store/localStorageStore'
import type { CharacterStore } from '@/lib/character/store/types'
import type { Character } from '@/lib/character/types'

async function apiFetch(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  })
}

export function createRemoteCharacterStore(token: string): CharacterStore {
  return {
    async getAll() {
      const res = await apiFetch('/api/characters', token)
      if (!res.ok) throw new Error(`Failed to list characters: ${res.status}`)
      return res.json() as Promise<Character[]>
    },

    async list() {
      const characters = await this.getAll()
      return characters.toSorted((a, b) =>
        b.updatedAt.localeCompare(a.updatedAt)
      )
    },

    async get(id) {
      const res = await apiFetch(`/api/characters/${id}`, token)
      if (res.status === 404) return null
      if (!res.ok) throw new Error(`Failed to get character: ${res.status}`)
      return res.json() as Promise<Character>
    },

    async create(input) {
      // Build a partial character locally then POST it — the server normalizes it.
      const { createCharacter } = await import('@/lib/character/model')
      const character = createCharacter(input)
      const res = await apiFetch('/api/characters', token, {
        method: 'POST',
        body: JSON.stringify(character),
      })
      if (!res.ok) throw new Error(`Failed to create character: ${res.status}`)
      return res.json() as Promise<Character>
    },

    async save(character) {
      const res = await apiFetch(`/api/characters/${character.id}`, token, {
        method: 'PUT',
        body: JSON.stringify(character),
      })
      if (res.status === 409) throw new SaveError('DEAD_CHARACTER')
      if (!res.ok) throw new Error(`Failed to save character: ${res.status}`)
      return res.json() as Promise<Character>
    },

    async delete(id) {
      const res = await apiFetch(`/api/characters/${id}`, token, {
        method: 'DELETE',
      })
      if (res.status === 404) return false
      if (!res.ok) throw new Error(`Failed to delete character: ${res.status}`)
      return true
    },

    async import(json) {
      // json is the raw file content of a single exported character.
      const res = await apiFetch('/api/characters/import', token, {
        method: 'POST',
        body: JSON.stringify({ json }),
      })
      if (res.status === 422) throw new Error('INVALID_PAYLOAD')
      if (!res.ok) throw new Error(`Failed to import character: ${res.status}`)
      return res.json() as Promise<Character>
    },
  }
}
