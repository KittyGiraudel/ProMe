import { SaveError } from '@/lib/character/store/localStorageStore'
import type { CharacterStore } from '@/lib/character/store/types'
import type { Character } from '@/lib/character/types'

async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  })
}

export function createRemoteCharacterStore(): CharacterStore {
  return {
    async getAll() {
      const res = await apiFetch('/api/characters')
      if (res.status === 401) throw new UnauthorizedError()
      if (res.status >= 400 && res.status < 500) throw new BadRequestError(res)
      if (!res.ok) throw new ServerError(res)
      return res.json() as Promise<Character[]>
    },

    async list() {
      const characters = await this.getAll()
      return characters.toSorted((a, b) =>
        b.updatedAt.localeCompare(a.updatedAt)
      )
    },

    async get(id) {
      const res = await apiFetch(`/api/characters/${id}`)
      if (res.status === 404) return null
      if (res.status === 401) throw new UnauthorizedError()
      if (res.status >= 400 && res.status < 500) throw new BadRequestError(res)
      if (!res.ok) throw new ServerError(res)
      return res.json() as Promise<Character>
    },

    async create(input) {
      // Build a partial character locally then POST it — the server normalizes it.
      // @TODO: document why the dynamic import here
      const { createCharacter } = await import('@/lib/character/model')
      const character = createCharacter(input)
      const res = await apiFetch('/api/characters', {
        method: 'POST',
        body: JSON.stringify(character),
      })
      if (res.status === 401) throw new UnauthorizedError()
      if (res.status >= 400 && res.status < 500) throw new BadRequestError(res)
      if (!res.ok) throw new ServerError(res)
      return res.json() as Promise<Character>
    },

    async save(character) {
      const res = await apiFetch(`/api/characters/${character.id}`, {
        method: 'PUT',
        body: JSON.stringify(character),
      })
      if (res.status === 401) throw new UnauthorizedError()
      if (res.status === 409) throw new SaveError('DEAD_CHARACTER')
      if (res.status >= 400 && res.status < 500) throw new BadRequestError(res)
      if (!res.ok) throw new ServerError(res)
      return res.json() as Promise<Character>
    },

    async delete(id) {
      const res = await apiFetch(`/api/characters/${id}`, {
        method: 'DELETE',
      })
      if (res.status === 404) return false
      if (res.status === 401) throw new UnauthorizedError()
      if (res.status >= 400 && res.status < 500) throw new BadRequestError(res)
      if (!res.ok) throw new ServerError(res)
      return true
    },

    async import(json) {
      // json is the raw file content of a single exported character.
      const res = await apiFetch('/api/characters/import', {
        method: 'POST',
        body: JSON.stringify({ json }),
      })
      if (res.status === 401) throw new UnauthorizedError()
      if (res.status >= 400 && res.status < 500) throw new BadRequestError(res)
      if (!res.ok) throw new ServerError(res)
      return res.json() as Promise<Character>
    },
  }
}

export class ServerError extends Error {
  status: number | undefined
  constructor(response: Response) {
    super('SERVER_ERROR')
    this.name = 'ServerError'
    this.status = response.status
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super('UNAUTHORIZED')
    this.name = 'UnauthorizedError'
  }
}

export class BadRequestError extends Error {
  status: number
  constructor(response: Response) {
    super('BAD_REQUEST')
    this.name = 'BadRequestError'
    this.status = response.status
  }
}
