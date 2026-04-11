import { decodeVillageFactionParam } from '@/lib/village/villageUrlCodec'

export type ParsedNpcGeneratorLink = {
  kind: 'npc'
  encodedId: string
}
export type ParsedVillageGeneratorLink = {
  kind: 'village'
  encodedId: string
  faction: ReturnType<typeof decodeVillageFactionParam>
}
export type ParsedGeneratorLink =
  | ParsedNpcGeneratorLink
  | ParsedVillageGeneratorLink

/** Resolve absolute URL; relative paths use a dummy origin. */
function normalizeUrl(rawUrl: string): URL | null {
  try {
    return new URL(rawUrl)
  } catch {
    try {
      // Support relative URLs pasted into markdown (e.g. `/en/generators/npc/...`).
      return new URL(rawUrl, 'https://example.invalid')
    } catch {
      return null
    }
  }
}

function pathnameSegments(pathname: string): string[] {
  return pathname.replace(/\/+$/, '').split('/').filter(Boolean)
}

/** Decode `%XX` sequences (up to twice) for generator path segments. */
function safeDecodeURIComponent(value: string): string {
  let curr = value
  // Some inputs can end up double-encoded (e.g. `%257E` instead of `%7E`).
  // Decode a couple times to be resilient without risking an infinite loop.
  for (let i = 0; i < 2; i++) {
    try {
      const next = decodeURIComponent(curr)
      if (next === curr) return curr
      curr = next
    } catch {
      return curr
    }
  }
  return curr
}

/**
 * Parse village or NPC generator share URLs (optional locale prefix, optional `?f=` for villages).
 */
export function parseGeneratorLink(rawUrl: string): ParsedGeneratorLink | null {
  const parsed = normalizeUrl(rawUrl)
  if (!parsed) return null

  const segments = pathnameSegments(parsed.pathname)
  const generatorsIndex = segments.indexOf('generators')
  if (generatorsIndex < 0) return null

  const kind = segments[generatorsIndex + 1] ?? null
  const encodedIdRaw = segments[generatorsIndex + 2] ?? null
  if (!kind || !encodedIdRaw) return null

  // URL.pathname preserves percent-encoding; the generators expect decoded payloads.
  const encodedId = safeDecodeURIComponent(encodedIdRaw)

  if (kind === 'npc') {
    return { kind: 'npc', encodedId }
  }

  if (kind === 'village') {
    return {
      kind: 'village',
      encodedId,
      faction: decodeVillageFactionParam(parsed.searchParams.get('f')),
    }
  }

  return null
}
