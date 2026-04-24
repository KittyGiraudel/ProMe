'use client'

import type { ReactNode } from 'react'
import { useFadeIn } from '../../hooks/useFadeIn'
import { RichText } from '../RichText/RichText'

import './LandingFeature.css'

type ColorScheme =
  | 'sage'
  | 'purple-dark'
  | 'parchment'
  | 'terracotta-dark'
  | 'teal'
  | 'gold-dark'

type Props = {
  number: string
  title: string
  body: string
  tags: string[]
  visual: ReactNode
  reversed?: boolean
  colorScheme: ColorScheme
}

export function LandingFeature({
  number,
  title,
  body,
  tags,
  visual,
  reversed = false,
  colorScheme,
}: Props) {
  const ref = useFadeIn<HTMLElement>()

  return (
    <section
      ref={ref}
      data-color-scheme={colorScheme}
      data-reversed={reversed}
      className='LandingFeature'>
      <div className='LandingFeature__inner'>
        <div className='LandingFeature__text'>
          <p className='LandingFeature__number'>{number}</p>
          <h2 className='LandingFeature__title'>{title}</h2>
          <div className='LandingFeature__body'>
            <RichText text={body} />
          </div>
          <div className='LandingFeature__tags'>
            {tags.map(tag => (
              <span key={tag} className='LandingFeature__tag'>
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className='LandingFeature__visual'>{visual}</div>
      </div>
    </section>
  )
}
