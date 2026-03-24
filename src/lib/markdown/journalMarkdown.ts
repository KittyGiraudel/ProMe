import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'

export type JournalMarkdownTransform = (markdown: string) => string

export type JournalMarkdownRendererConfig = {
  transforms?: JournalMarkdownTransform[]
  components?: Components
}

export function applyJournalMarkdownTransforms(
  markdown: string,
  transforms: JournalMarkdownTransform[] = [],
): string {
  return transforms.reduce((acc, transform) => transform(acc), markdown)
}

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
