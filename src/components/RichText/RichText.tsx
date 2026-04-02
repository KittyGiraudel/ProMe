'use client'

import type { CSSProperties, ReactNode } from 'react'
import { cloneElement, isValidElement } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { SUITS } from '@/lib/constants/misc'
import {
  journalLiteralRule,
  tokenizeJournalEmbellishUiRules,
} from '@/lib/markdown/journalEmbellishText'
import { suitIsRed } from '@/lib/random/suitGlyphs'
import type { Suit } from '@/lib/types'
import './RichText.css'

const SUIT_RULES = Object.entries(SUITS).map(([name, symbol]) => {
  const color = suitIsRed(name as Suit) ? 'red' : 'black'
  return journalLiteralRule(
    `symbol:${name}`,
    symbol,
    undefined,
    ({ reactKey }) => (
      <span
        key={reactKey}
        className='RichText__Accent'
        style={{ '--color': color } as CSSProperties}>
        {symbol}
      </span>
    )
  )
})

function highlighter(text: string): ReactNode {
  const segments = tokenizeJournalEmbellishUiRules(text, SUIT_RULES)
  if (segments.length === 1 && segments[0]?.type === 'text') return text
  return segments.map((segment, index) => {
    if (segment.type === 'text') return segment.value
    const rule = SUIT_RULES[segment.ruleIndex]!
    return rule.render({
      slice: segment.slice,
      refId: segment.refId,
      reactKey: `emb-${index}`,
    })
  })
}

export function renderWithHighlights(
  node: ReactNode,
  highlighter: (text: string) => ReactNode
): ReactNode {
  if (typeof node === 'string') return highlighter(node)
  if (Array.isArray(node))
    return node.map(child => renderWithHighlights(child, highlighter))
  if (!isValidElement<{ children?: ReactNode }>(node)) return node
  if (!node.props.children) return node
  // Custom components (type is not a string) call renderWithHighlights
  // themselves — don't pre-process their children here or each nesting
  // adds another wrapping.
  if (typeof node.type !== 'string') return node
  return cloneElement(
    node,
    undefined,
    renderWithHighlights(node.props.children, highlighter)
  )
}

export function RichText({ text }: { text: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      skipHtml
      components={{
        p: ({ children, node: _node, ...props }) => (
          <p {...props}>{renderWithHighlights(children, highlighter)}</p>
        ),
        li: ({ children, node: _node, ...props }) => (
          <li {...props}>{renderWithHighlights(children, highlighter)}</li>
        ),
        a: ({ children, node: _node, ...props }) => (
          <a {...props} target='_blank' rel='noreferrer'>
            {renderWithHighlights(children, highlighter)}
          </a>
        ),
      }}>
      {text}
    </ReactMarkdown>
  )
}
