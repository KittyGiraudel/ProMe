'use client'

import ReactMarkdown from 'react-markdown'
import { createJournalMarkdownRendererConfig } from '@/lib/markdown/journalMarkdown'
import '@/components/Markdown/JournalMarkdown.css'

const rendererConfig = createJournalMarkdownRendererConfig()

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
