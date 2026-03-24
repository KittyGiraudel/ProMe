'use client'

import { Tag } from 'antd'
import type { ReactNode } from 'react'
import { cloneElement, isValidElement } from 'react'
import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import { createJournalMarkdownRendererConfig } from '@/lib/markdown/journalMarkdown'
import { copy } from '@/messages/fr'
import '@/components/Markdown/JournalMarkdown.css'
import { BiomeBubble } from '../BiomeBubble/BiomeBubble'

const BIOME_ENTRIES = [
  {
    label: copy.characters.mapBiomes.shadowForest,
    biomeId: 'shadowForest',
  },
  {
    label: copy.characters.mapBiomes.floodedPlains,
    biomeId: 'floodedPlains',
  },
  {
    label: copy.characters.mapBiomes.mushroomJungle,
    biomeId: 'mushroomJungle',
  },
  {
    label: copy.characters.mapBiomes.fieldSea,
    biomeId: 'fieldSea',
  },
  {
    label: copy.characters.mapBiomes.silentDesert,
    biomeId: 'silentDesert',
  },
  {
    label: copy.characters.mapBiomes.giganticGardens,
    biomeId: 'giganticGardens',
  },
] as const

const BIOME_BY_LABEL = new Map<string, (typeof BIOME_ENTRIES)[number]>(
  BIOME_ENTRIES.map(entry => [entry.label, entry])
)
const BIOME_MATCH_RE = new RegExp(
  `(${BIOME_ENTRIES.map(entry => escapeRegExp(entry.label))
    .sort((a, b) => b.length - a.length)
    .join('|')})`,
  'gi'
)

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function renderBiomeText(text: string): ReactNode {
  if (!text) return text

  const parts = text.split(BIOME_MATCH_RE)
  if (parts.length === 1) return text

  return parts.map((part, index) => {
    const biome = BIOME_BY_LABEL.get(part)
    if (!biome) return part

    return (
      <Tag
        key={`${biome.biomeId}-${index}`}
        className='journal-markdown__biome-tag'
        data-biome={biome.biomeId}>
        {biome.label}
      </Tag>
    )
  })
}

function renderWithBiomeHighlights(node: ReactNode): ReactNode {
  if (typeof node === 'string') return renderBiomeText(node)
  if (Array.isArray(node)) return node.map(renderWithBiomeHighlights)
  if (!isValidElement<{ children?: ReactNode }>(node)) return node
  if (!node.props.children) return node

  return cloneElement(
    node,
    undefined,
    renderWithBiomeHighlights(node.props.children)
  )
}

const biomeAwareComponents: Components = {
  p: ({ children, ...props }) => (
    <p {...props}>{renderWithBiomeHighlights(children)}</p>
  ),
  li: ({ children, ...props }) => (
    <li {...props}>{renderWithBiomeHighlights(children)}</li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote {...props}>{renderWithBiomeHighlights(children)}</blockquote>
  ),
  h1: ({ children, ...props }) => (
    <h1 {...props}>{renderWithBiomeHighlights(children)}</h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 {...props}>{renderWithBiomeHighlights(children)}</h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 {...props}>{renderWithBiomeHighlights(children)}</h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 {...props}>{renderWithBiomeHighlights(children)}</h4>
  ),
}

const rendererConfig = createJournalMarkdownRendererConfig({
  components: biomeAwareComponents,
})

export function JournalMarkdown({ markdown }: { markdown: string }) {
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
