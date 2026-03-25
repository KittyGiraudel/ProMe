'use client'

import type { ReactNode } from 'react'
import { cloneElement, isValidElement } from 'react'
import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import { createJournalMarkdownRendererConfig } from '@/lib/markdown/journalMarkdown'
import {
  tokenizeJournalInlineText,
  type JournalInlineTokenRule,
} from '@/lib/markdown/journalInlineTokens'
import { extractDisplayedCellReferences } from '@/lib/hex/coordinates'
import { getInhabitantSummaryFromUrl } from '@/lib/markdown/inhabitantLinkSummary'
import { getVillageSummaryFromUrl } from '@/lib/markdown/villageLinkSummary'
import { useSettings } from '@/app/[locale]/contexts/SettingsContext'
import { BIOME_ROLL_TABLE } from '@/lib/constants/biomeRollTable'
import { DICE, SUITS } from '@/lib/constants/misc'
import { suitIsRed } from '@/lib/suitGlyphs'
import type { Suit } from '@/lib/types'
import { useCharacterContext } from '@/components/CharacterSheet/CharacterContext'
import './JournalMarkdown.css'
import { BiomeTag } from '../BiomeTag/BiomeTag'
import { CoordChip } from '../CoordChip/CoordChip'
import { _Translator, useTranslations } from 'next-intl'

const BIOME_ENTRIES = BIOME_ROLL_TABLE.map(biome => ({
  key: `common.biomes.${biome.biome}`,
  biomeId: biome.biome,
}))

const SUIT_ENTRIES = Object.entries(SUITS).map(([suitId, symbol]) => ({
  key: `common.suits.${suitId}`,
  label: symbol,
  suitId,
}))

const DICE_ENTRIES = DICE.map((symbol, index) => ({
  key: `common.dice.${index + 1}`,
  label: symbol,
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

function getStaticTokenRules(t: _Translator): JournalInlineTokenRule[] {
  const STATIC_TOKEN_RULES: JournalInlineTokenRule[] = [
    ...BIOME_ENTRIES.map(entry => ({
      key: `biome:${entry.biomeId}`,
      match: t(entry.key),
      wordBoundary: true,
    })),
    {
      key: 'word:success',
      match: t('common.check_success_word'),
      wordBoundary: true,
    },
    {
      key: 'word:failure',
      match: t('common.check_failure_word'),
      wordBoundary: true,
    },
    { key: 'symbol:sun', match: '☼' },
    { key: 'symbol:moon', match: '☾' },
    ...SUIT_ENTRIES.map(entry => ({
      key: `symbol:${entry.suitId}`,
      match: entry.label ?? t(entry.key),
    })),
    ...DICE_ENTRIES.map(entry => ({
      key: `symbol:${entry.value}`,
      match: entry.label ?? t(entry.key),
    })),
    ...SYMBOL_ALIAS_RULES,
  ]

  return STATIC_TOKEN_RULES
}

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

function buildCoordinateRules(text: string): JournalInlineTokenRule[] {
  return extractDisplayedCellReferences(text).map(reference => ({
    key: `coord:${reference}`,
    match: reference,
    wordBoundary: true,
  }))
}

export function JournalMarkdown({ markdown }: { markdown: string }) {
  const { getCellData } = useCharacterContext()
  const { settings } = useSettings()
  const t = useTranslations()

  const renderTokenSegment = (
    tokenKey: string,
    value: string,
    key: string
  ): ReactNode => {
    const biome = BIOME_BY_TOKEN_KEY.get(tokenKey)
    if (biome) {
      return <BiomeTag key={key} biome={biome.biomeId} />
    }

    if (tokenKey.startsWith('coord:')) {
      const reference = tokenKey.slice('coord:'.length)
      const cellData = getCellData(reference)
      if (cellData) {
        return (
          <CoordChip
            key={key}
            biome={cellData.biome}
            value={cellData.ref}
            coord={cellData.coord}
          />
        )
      }
      return <CoordChip key={key} biome='unexplored' value={reference} />
    }

    const renderer = TOKEN_RENDERERS.get(tokenKey)
    if (!renderer) return value
    return renderer(value, key)
  }

  const renderHighlightedText = (text: string): ReactNode => {
    if (!text) return text

    const tokenRules = [
      ...getStaticTokenRules(t),
      ...buildCoordinateRules(text),
    ]
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
      const inhabitantSummary = href
        ? getInhabitantSummaryFromUrl(href, t)
        : null
      const villageSummary =
        !inhabitantSummary && href
          ? getVillageSummaryFromUrl(href, t, {
              mergeDuplicateEstablishments:
                settings.village.mergeDuplicateEstablishments,
            })
          : null
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
