'use client'

import { miniMarkdown } from '@/messages/miniMarkdown'
import type { ElementType } from 'react'
import './RichText.css'

type RichTextProps = {
  text: string
  /** Default: span */
  as?: ElementType
  className?: string
}

export function RichText({
  text,
  as: Component = 'span',
  className,
}: RichTextProps) {
  const rootClass = ['rich-text', className].filter(Boolean).join(' ')
  return <Component className={rootClass}>{miniMarkdown(text)}</Component>
}
