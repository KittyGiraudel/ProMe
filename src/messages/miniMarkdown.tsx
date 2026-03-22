import type { ReactNode } from 'react'

/**
 * Minimal inline markup: `**bold**` then `*italic*` (no nesting of `*` inside `**…**`).
 * Intended for curated game strings, not arbitrary user markdown.
 */
export function miniMarkdown(text: string): ReactNode {
  let key = 0
  const nextKey = () => key++

  const out: ReactNode[] = []
  const boldChunks = text.split(/(\*\*[^*]+\*\*)/g)

  for (const chunk of boldChunks) {
    if (chunk === '') continue
    if (/^\*\*[^*]+\*\*$/.test(chunk)) {
      const inner = chunk.slice(2, -2)
      out.push(
        <strong key={nextKey()}>
          {renderItalicInsideBold(inner, nextKey)}
        </strong>
      )
    } else {
      out.push(...renderItalicChunks(chunk, nextKey))
    }
  }

  if (out.length === 0) return null
  if (out.length === 1) return out[0]
  return out
}

function renderItalicInsideBold(
  text: string,
  nextKey: () => number
): ReactNode {
  const nodes = renderItalicChunks(text, nextKey)
  if (nodes.length === 0) return null
  if (nodes.length === 1) return nodes[0]
  return <>{nodes}</>
}

function renderItalicChunks(text: string, nextKey: () => number): ReactNode[] {
  const parts = text.split(/(\*[^*]+\*)/g)
  return parts
    .filter(p => p.length > 0)
    .map(p => {
      if (p.startsWith('*') && p.endsWith('*') && p.length > 2) {
        return <em key={nextKey()}>{p.slice(1, -1)}</em>
      }
      return p
    })
}
