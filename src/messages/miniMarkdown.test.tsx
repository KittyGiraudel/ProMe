import { createElement, Fragment } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { miniMarkdown } from './miniMarkdown'

function renderMd(source: string): string {
  return renderToStaticMarkup(
    createElement(Fragment, null, miniMarkdown(source))
  )
}

describe('miniMarkdown', () => {
  it('returns null for empty input', () => {
    expect(miniMarkdown('')).toBeNull()
  })

  it('leaves plain text unchanged', () => {
    expect(renderMd('hello')).toBe('hello')
  })

  it('wraps **segments** in strong', () => {
    expect(renderMd('a **bold** b')).toBe('a <strong>bold</strong> b')
  })

  it('wraps *segments* in em outside bold', () => {
    expect(renderMd('a *italic* b')).toBe('a <em>italic</em> b')
  })

  it('does not nest * inside ** (splitter cannot span inner asterisks)', () => {
    expect(renderMd('**a *i* b**')).not.toContain('<strong>')
  })

  it('applies bold and italic as separate runs in one string', () => {
    expect(renderMd('**bold** and *italic*')).toBe(
      '<strong>bold</strong> and <em>italic</em>'
    )
  })
})
