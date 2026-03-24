import { describe, expect, it } from 'vitest'
import {
  applyJournalMarkdownTransforms,
  createJournalMarkdownRendererConfig,
} from './journalMarkdown'

describe('markdown/journalMarkdown', () => {
  it('applies transforms in order', () => {
    const output = applyJournalMarkdownTransforms('abc', [
      value => `${value}-1`,
      value => `${value}-2`,
    ])
    expect(output).toBe('abc-1-2')
  })

  it('creates renderer config with default remark plugins', () => {
    const config = createJournalMarkdownRendererConfig()
    expect(config.remarkPlugins.length).toBeGreaterThan(0)
    expect(config.transform('text')).toBe('text')
  })
})
