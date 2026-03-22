'use client'

import { Typography } from 'antd'
import Link from 'next/link'
import type { ReactNode } from 'react'
import './GeneratorPageShell.css'

type GeneratorPageShellProps = {
  title: string
  description?: string
  backHref?: string
  backLabel?: string
  children: ReactNode
}

export function GeneratorPageShell({
  title,
  description,
  backHref,
  backLabel,
  children,
}: GeneratorPageShellProps) {
  return (
    <div className='generator-page-shell'>
      <div className='generator-page-shell__inner'>
        {backHref ? (
          <Link href={backHref} className='generator-page-shell__back'>
            {backLabel ?? '←'}
          </Link>
        ) : null}
        <Typography.Title level={2} className='generator-page-shell__title'>
          {title}
        </Typography.Title>
        {description ? (
          <p className='generator-page-shell__description'>{description}</p>
        ) : null}
        <div className='generator-page-shell__body'>{children}</div>
      </div>
    </div>
  )
}
