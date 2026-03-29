'use client'

import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'
import { cloneElement, isValidElement } from 'react'
import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import { buildJournalMarkdownEmbellishmentRules } from '@/components/JournalMarkdown/journalMarkdownEmbellishmentRules'
import { useCharacterContext } from '@/components/PageCharacterSheet/CharacterContext'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { tokenizeJournalEmbellishUiRules } from '@/lib/markdown/journalEmbellishText'
import { createJournalMarkdownRendererConfig } from '@/lib/markdown/journalMarkdown'
import './JournalMarkdown.css'

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
  const { getCellData } = useCharacterContext()
  const { settings } = useSettings()
  const t = useTranslations()

  const renderHighlightedText = (text: string): ReactNode => {
    if (!text) return text

    const rules = buildJournalMarkdownEmbellishmentRules(
      {
        t,
        getCellData,
        mergeVillageDuplicateEstablishments:
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
    a: ({ children, node: _node, href, ...props }) => (
      <a {...props} href={interactive ? href : undefined}>
        {renderWithHighlights(children)}
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
