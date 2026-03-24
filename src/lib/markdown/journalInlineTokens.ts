export type JournalInlineTokenRule = {
  key: string
  match: string
  wordBoundary?: boolean
}

export type JournalInlineSegment =
  | {
      type: 'text'
      value: string
    }
  | {
      type: 'token'
      key: string
      value: string
    }

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function isWordChar(char: string | undefined): boolean {
  if (!char) return false
  return /[\p{L}\p{N}_]/u.test(char)
}

export function tokenizeJournalInlineText(
  text: string,
  rules: readonly JournalInlineTokenRule[]
): JournalInlineSegment[] {
  if (!text || rules.length === 0) return [{ type: 'text', value: text }]

  const byMatch = new Map<string, JournalInlineTokenRule>()
  for (const rule of rules) {
    byMatch.set(rule.match.toLocaleLowerCase(), rule)
  }

  const pattern = Array.from(byMatch.keys())
    .map(escapeRegExp)
    .sort((a, b) => b.length - a.length)
    .join('|')
  if (!pattern) return [{ type: 'text', value: text }]

  const matcher = new RegExp(pattern, 'giu')
  const output: JournalInlineSegment[] = []
  let cursor = 0

  for (const match of text.matchAll(matcher)) {
    const value = match[0]
    const rule = byMatch.get(value.toLocaleLowerCase())
    if (!rule) continue

    const start = match.index ?? 0
    const end = start + value.length
    const previousChar = start > 0 ? text[start - 1] : undefined
    const nextChar = end < text.length ? text[end] : undefined
    if (rule.wordBoundary && (isWordChar(previousChar) || isWordChar(nextChar))) {
      continue
    }

    if (start > cursor) {
      output.push({ type: 'text', value: text.slice(cursor, start) })
    }
    output.push({ type: 'token', key: rule.key, value })
    cursor = end
  }

  if (cursor < text.length) {
    output.push({ type: 'text', value: text.slice(cursor) })
  }

  return output.length > 0 ? output : [{ type: 'text', value: text }]
}
