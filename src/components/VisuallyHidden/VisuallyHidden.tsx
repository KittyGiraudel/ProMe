import React from 'react'
import './VisuallyHidden.css'

export function VisuallyHidden({
  children,
  as = 'span',
}: {
  children: React.ReactNode
  as?: React.ElementType
}) {
  return React.createElement(as, { className: 'VisuallyHidden' }, children)
}
