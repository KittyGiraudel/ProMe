'use client'

import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'
import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import { buildJournalMarkdownEmbellishmentRules } from '@/components/JournalMarkdown/journalMarkdownEmbellishmentRules'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import {
  getGlobalFromDisplayedCellLabel,
  parseDisplayedCellReference,
  SheetCoordinateWithLabel,
} from '@/lib/hex/coordinates'
import { tokenizeJournalEmbellishUiRules } from '@/lib/markdown/journalEmbellishText'
import { createJournalMarkdownRendererConfig } from '@/lib/markdown/journalMarkdown'
import './JournalMarkdown.css'
import { useCallback } from 'react'
import { useMapState } from '../MapDisplay/useMapState'
import { renderWithHighlights } from '../RichText/RichText'

/**
 * Renders journal markdown with remark-gfm, then applies inline embellishment
 * (biomes, dice, `{village/…}` tokens, etc.) inside text nodes only.
 */
export function JournalMarkdown({
  markdown,
  interactive = true,
}: {
  markdown: string
  // When false, markdown and embellishment links do not navigate
  // (e.g. edit-modal preview).
  interactive?: boolean
}) {
  const { getCellState } = useMapState()
  const wrappedGetCellState = useCallback(
    (ref: string | SheetCoordinateWithLabel) => {
      const parsed =
        typeof ref === 'string' ? parseDisplayedCellReference(ref) : ref
      if (!parsed) return null
      const coord = getGlobalFromDisplayedCellLabel(parsed, parsed.label)
      return coord ? getCellState(coord) : null
    },
    [getCellState]
  )
  const { settings } = useSettings()
  const t = useTranslations()

  const highlighter = (text: string): ReactNode => {
    if (!text) return text

    const rules = buildJournalMarkdownEmbellishmentRules(
      {
        t,
        getCellState: wrappedGetCellState,
        mergeDuplicateEstablishments:
          settings.village.mergeDuplicateEstablishments,
        interactive,
      },
      text
    )

    const segments = tokenizeJournalEmbellishUiRules(text, rules)
    const output: ReactNode[] = segments.map((segment, index) => {
      if (segment.type === 'text') return segment.value
      const rule = rules[segment.ruleIndex]!
      return rule.render({
        slice: segment.slice,
        refId: segment.refId,
        reactKey: `emb-${index}`,
      })
    })

    if (output.length === 1 && output[0] === text) return text
    return output
  }

  const markdownComponents: Components = {
    p: ({ children, node: _node, ...props }) => (
      <p {...props}>{renderWithHighlights(children, highlighter)}</p>
    ),
    li: ({ children, node: _node, ...props }) => (
      <li {...props}>{renderWithHighlights(children, highlighter)}</li>
    ),
    blockquote: ({ children, node: _node, ...props }) => (
      <blockquote {...props}>
        {renderWithHighlights(children, highlighter)}
      </blockquote>
    ),
    h1: ({ children, node: _node, ...props }) => (
      <h1 {...props}>{renderWithHighlights(children, highlighter)}</h1>
    ),
    h2: ({ children, node: _node, ...props }) => (
      <h2 {...props}>{renderWithHighlights(children, highlighter)}</h2>
    ),
    h3: ({ children, node: _node, ...props }) => (
      <h3 {...props}>{renderWithHighlights(children, highlighter)}</h3>
    ),
    h4: ({ children, node: _node, ...props }) => (
      <h4 {...props}>{renderWithHighlights(children, highlighter)}</h4>
    ),
    a: ({ children, node: _node, href, ...props }) => (
      <a {...props} href={interactive ? href : undefined}>
        {renderWithHighlights(children, highlighter)}
      </a>
    ),
  }

  const rendererConfig = createJournalMarkdownRendererConfig({
    components: markdownComponents,
  })

  return (
    <div className='JournalMarkdown'>
      <ReactMarkdown
        remarkPlugins={rendererConfig.remarkPlugins}
        components={rendererConfig.components}>
        {rendererConfig.transform(markdown)}
      </ReactMarkdown>
    </div>
  )
}
