'use client'

import type { CharacterMapState } from '@/lib/character/types'
import type { ReactNode } from 'react'
import { cloneElement, isValidElement } from 'react'
import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import { createJournalMarkdownRendererConfig } from '@/lib/markdown/journalMarkdown'
import {
  tokenizeJournalInlineText,
  type JournalInlineTokenRule,
} from '@/lib/markdown/journalInlineTokens'
import { buildJournalCoordinateTokenData } from '@/lib/markdown/journalCoordinateTokens'
import { getInhabitantSummaryFromUrl } from '@/lib/markdown/inhabitantLinkSummary'
import { getVillageSummaryFromUrl } from '@/lib/markdown/villageLinkSummary'
import { BIOME_ROLL_TABLE } from '@/lib/constants/biomeRollTable'
import { copy } from '@/messages/fr'
import { DICE, SUITS } from '@/lib/constants/misc'
import { suitIsRed } from '@/lib/suitGlyphs'
import type { Suit } from '@/lib/types'
import './JournalMarkdown.css'
import { BiomeTag } from '../BiomeTag/BiomeTag'
import { CoordChip } from '../CoordChip/CoordChip'

const BIOME_ENTRIES = BIOME_ROLL_TABLE.map(biome => ({
  label: copy.characters.mapBiomes[biome.biome],
  biomeId: biome.biome,
}))

const SUIT_ENTRIES = Object.entries(SUITS).map(([suitId, label]) => ({
  label,
  suitId,
}))

const DICE_ENTRIES = DICE.map((label, index) => ({
  label,
  value: index + 1,
}))

const SYMBOL_ALIAS_RULES: JournalInlineTokenRule[] = [
  ...DICE_ENTRIES.map(entry => ({
    key: `symbol:${entry.value}`,
    match: `{${entry.value}}`,
  })),
  { key: 'symbol:spades', match: '{S}' },
  { key: 'symbol:hearts', match: '{H}' },
  { key: 'symbol:diamonds', match: '{D}' },
  { key: 'symbol:clubs', match: '{C}' },
]

const STATIC_TOKEN_RULES: JournalInlineTokenRule[] = [
  ...BIOME_ENTRIES.map(entry => ({
    key: `biome:${entry.biomeId}`,
    match: entry.label,
    wordBoundary: true,
  })),
  {
    key: 'word:success',
    match: copy.common.checkSuccessWord,
    wordBoundary: true,
  },
  {
    key: 'word:failure',
    match: copy.common.checkFailureWord,
    wordBoundary: true,
  },
  { key: 'symbol:sun', match: '☼' },
  { key: 'symbol:moon', match: '☾' },
  ...SUIT_ENTRIES.map(entry => ({
    key: `symbol:${entry.suitId}`,
    match: entry.label,
  })),
  ...DICE_ENTRIES.map(entry => ({
    key: `symbol:${entry.value}`,
    match: entry.label,
  })),
  ...SYMBOL_ALIAS_RULES,
]

const BIOME_BY_TOKEN_KEY = new Map<string, (typeof BIOME_ENTRIES)[number]>(
  BIOME_ENTRIES.map(entry => [`biome:${entry.biomeId}`, entry])
)

const TOKEN_RENDERER_ENTRIES: Array<
  [string, (value: string, key: string) => ReactNode]
> = [
  [
    'word:success',
    (value, key) => (
      <span key={key} style={{ '--color': 'green' } as React.CSSProperties}>
        {value}
      </span>
    ),
  ],
  [
    'word:failure',
    (value, key) => (
      <span key={key} style={{ '--color': 'red' } as React.CSSProperties}>
        {value}
      </span>
    ),
  ],
  [
    'symbol:sun',
    (value, key) => (
      <span key={key} style={{ '--color': '#d4a017' } as React.CSSProperties}>
        {value}
      </span>
    ),
  ],
  [
    'symbol:moon',
    (value, key) => (
      <span key={key} style={{ '--color': '#1f3f8b' } as React.CSSProperties}>
        {value}
      </span>
    ),
  ],
  ...SUIT_ENTRIES.map(
    (entry): [string, (value: string, key: string) => ReactNode] => [
      `symbol:${entry.suitId}`,
      (_value: string, key: string) => (
        <span
          key={key}
          data-zoom
          style={
            {
              '--color': suitIsRed(entry.suitId as Suit) ? 'red' : 'black',
            } as React.CSSProperties
          }>
          {entry.label}
        </span>
      ),
    ]
  ),
  ...DICE_ENTRIES.map(
    (entry): [string, (value: string, key: string) => ReactNode] => [
      `symbol:${entry.value}`,
      (_value: string, key: string) => (
        <span key={key} data-zoom>
          {entry.label}
        </span>
      ),
    ]
  ),
]

const TOKEN_RENDERERS = new Map<
  string,
  (value: string, key: string) => ReactNode
>(TOKEN_RENDERER_ENTRIES)

export function JournalMarkdown({
  markdown,
  mapState,
}: {
  markdown: string
  mapState?: CharacterMapState | null
}) {
  const coordTokenData = buildJournalCoordinateTokenData(mapState)
  const tokenRules = [...STATIC_TOKEN_RULES, ...coordTokenData.rules]

  const renderTokenSegment = (
    tokenKey: string,
    value: string,
    key: string
  ): ReactNode => {
    const biome = BIOME_BY_TOKEN_KEY.get(tokenKey)
    if (biome) {
      return <BiomeTag key={key} biome={biome.biomeId} />
    }

    const coordBiome = coordTokenData.biomeByTokenKey.get(tokenKey)
    if (coordBiome) {
      return <CoordChip key={key} biome={coordBiome} value={value} />
    }

    const renderer = TOKEN_RENDERERS.get(tokenKey)
    if (!renderer) return value
    return renderer(value, key)
  }

  const renderHighlightedText = (text: string): ReactNode => {
    if (!text) return text

    const segments = tokenizeJournalInlineText(text, tokenRules)
    const output: ReactNode[] = segments.map((segment, index) => {
      if (segment.type === 'text') return segment.value
      return renderTokenSegment(segment.key, segment.value, `token-${index}`)
    })
    if (output.length === 1 && output[0] === text) return text
    return output
  }

  const renderWithHighlights = (node: ReactNode): ReactNode => {
    if (typeof node === 'string') return renderHighlightedText(node)
    if (Array.isArray(node)) return node.map(renderWithHighlights)
    if (!isValidElement<{ children?: ReactNode }>(node)) return node
    if (!node.props.children) return node

    return cloneElement(
      node,
      undefined,
      renderWithHighlights(node.props.children)
    )
  }

  const markdownComponents: Components = {
    p: ({ children, node: _node, ...props }) => (
      <p {...props}>{renderWithHighlights(children)}</p>
    ),
    li: ({ children, node: _node, ...props }) => (
      <li {...props}>{renderWithHighlights(children)}</li>
    ),
    blockquote: ({ children, node: _node, ...props }) => (
      <blockquote {...props}>{renderWithHighlights(children)}</blockquote>
    ),
    h1: ({ children, node: _node, ...props }) => (
      <h1 {...props}>{renderWithHighlights(children)}</h1>
    ),
    h2: ({ children, node: _node, ...props }) => (
      <h2 {...props}>{renderWithHighlights(children)}</h2>
    ),
    h3: ({ children, node: _node, ...props }) => (
      <h3 {...props}>{renderWithHighlights(children)}</h3>
    ),
    h4: ({ children, node: _node, ...props }) => (
      <h4 {...props}>{renderWithHighlights(children)}</h4>
    ),
    a: ({ children, node: _node, href, ...props }) => {
      const inhabitantSummary = href ? getInhabitantSummaryFromUrl(href) : null
      const villageSummary =
        !inhabitantSummary && href ? getVillageSummaryFromUrl(href) : null
      return (
        <a {...props} href={href}>
          {inhabitantSummary ??
            villageSummary ??
            renderWithHighlights(children)}
        </a>
      )
    },
  }

  const rendererConfig = createJournalMarkdownRendererConfig({
    components: markdownComponents,
  })

  return (
    <div className='journal-markdown'>
      <ReactMarkdown
        remarkPlugins={rendererConfig.remarkPlugins}
        components={rendererConfig.components}>
        {rendererConfig.transform(markdown)}
      </ReactMarkdown>
    </div>
  )
}
