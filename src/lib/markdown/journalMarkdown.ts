import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'

/** Pure string transform applied before react-markdown parses the journal body. */
export type JournalMarkdownTransform = (markdown: string) => string

export type JournalMarkdownRendererConfig = {
  transforms?: JournalMarkdownTransform[]
  components?: Components
}

/** Applies transforms in order (fold-left). */
export function applyJournalMarkdownTransforms(
  markdown: string,
  transforms: JournalMarkdownTransform[] = [],
): string {
  return transforms.reduce((acc, transform) => transform(acc), markdown)
}

/**
 * Shared config for journal markdown: GFM + optional custom components/transforms.
 */
export function createJournalMarkdownRendererConfig(
  config: JournalMarkdownRendererConfig = {},
) {
  return {
    remarkPlugins: [remarkGfm],
    components: config.components,
    transform: (markdown: string) =>
      applyJournalMarkdownTransforms(markdown, config.transforms),
  }
}
