import type { ReactNode } from 'react'

/**
 * One embellishment rule: try to match at a cursor position, then render a React node.
 * All journal inline highlighting is expressed as an ordered list of these rules.
 */
export type JournalEmbellishUiRule = {
  /** Stable id (e.g. `biome:shadowWoods`, `journalRef:village`) for tests and debugging. */
  id: string
  /**
   * If this rule matches `text` starting at `pos`, return the exclusive end index and matched slice.
   * Optional `refId` is used for `{village/…}`-style captures.
   */
  matchAt(
    text: string,
    pos: number
  ): { end: number; slice: string; refId?: string } | null
  /** Turn a successful match into a React node. */
  render: (args: {
    slice: string
    refId: string | undefined
    reactKey: string
  }) => ReactNode
}

function isWordChar(char: string | undefined): boolean {
  if (!char) return false
  return /[\p{L}\p{N}_]/u.test(char)
}

/**
 * Match a case-insensitive literal starting at `pos`, with optional Unicode word boundaries.
 */
export function matchLiteralAt(
  text: string,
  pos: number,
  literal: string,
  wordBoundary: boolean | undefined
): { end: number; slice: string } | null {
  const len = literal.length
  if (len === 0 || pos + len > text.length) return null

  const slice = text.slice(pos, pos + len)
  if (slice.toLocaleLowerCase() !== literal.toLocaleLowerCase()) return null

  const prev = pos > 0 ? text[pos - 1] : undefined
  const next = pos + len < text.length ? text[pos + len] : undefined
  if (wordBoundary && (isWordChar(prev) || isWordChar(next))) {
    return null
  }

  return { end: pos + len, slice }
}

/**
 * Match a regex (with implicit `^`) against `text.slice(pos)`.
 * If `captureRefIdGroup` is set, that capture becomes `refId` when non-empty.
 */
export function matchRegexPrefixAt(
  text: string,
  pos: number,
  patternSource: string,
  flags: string | undefined,
  captureRefIdGroup: number | undefined
): { end: number; slice: string; refId?: string } | null {
  const re = new RegExp(`^(?:${patternSource})`, flags ?? 'u')
  const m = re.exec(text.slice(pos))
  if (!m) return null

  const g = captureRefIdGroup
  const refId = g != null && m[g] !== undefined ? m[g] : undefined

  return {
    end: pos + m[0].length,
    slice: m[0],
    ...(refId !== undefined && refId !== '' ? { refId } : {}),
  }
}

/**
 * Factory: literal rule with shared `matchLiteralAt` behaviour.
 */
export function journalLiteralRule(
  id: string,
  literal: string,
  wordBoundary: boolean | undefined,
  render: JournalEmbellishUiRule['render']
): JournalEmbellishUiRule {
  return {
    id,
    matchAt(text, pos) {
      const hit = matchLiteralAt(text, pos, literal, wordBoundary)
      return hit
    },
    render,
  }
}

/**
 * Factory: regex-prefix rule (pattern matched from current position only).
 */
export function journalRegexRule(
  id: string,
  patternSource: string,
  flags: string | undefined,
  captureRefIdGroup: number | undefined,
  render: JournalEmbellishUiRule['render']
): JournalEmbellishUiRule {
  return {
    id,
    matchAt(text, pos) {
      return matchRegexPrefixAt(
        text,
        pos,
        patternSource,
        flags,
        captureRefIdGroup
      )
    },
    render,
  }
}

export type JournalEmbellishUiSegment =
  | { type: 'text'; value: string }
  | {
      type: 'token'
      ruleIndex: number
      slice: string
      refId?: string
    }

/**
 * Walk `text` left-to-right. At each index, the rule with the longest `end` wins; ties go to the earlier rule in `rules`.
 */
export function tokenizeJournalEmbellishUiRules(
  text: string,
  rules: readonly JournalEmbellishUiRule[]
): JournalEmbellishUiSegment[] {
  if (!text) return []
  if (rules.length === 0) return [{ type: 'text', value: text }]

  const out: JournalEmbellishUiSegment[] = []
  let i = 0

  const pushText = (chunk: string) => {
    if (!chunk) return
    const last = out[out.length - 1]
    if (last?.type === 'text') last.value += chunk
    else out.push({ type: 'text', value: chunk })
  }

  while (i < text.length) {
    let best: {
      ruleIndex: number
      end: number
      slice: string
      refId?: string
    } | null = null

    for (let r = 0; r < rules.length; r++) {
      const hit = rules[r]!.matchAt(text, i)
      if (!hit) continue
      if (!best || hit.end > best.end) {
        best = {
          ruleIndex: r,
          end: hit.end,
          slice: hit.slice,
          ...('refId' in hit && hit.refId !== undefined && hit.refId !== ''
            ? { refId: hit.refId }
            : {}),
        }
      }
    }

    if (best) {
      out.push({
        type: 'token',
        ruleIndex: best.ruleIndex,
        slice: best.slice,
        ...(best.refId !== undefined ? { refId: best.refId } : {}),
      })
      i = best.end
    } else {
      pushText(text[i]!)
      i += 1
    }
  }

  return out.length > 0 ? out : [{ type: 'text', value: text }]
}
