'use client'

import { Card, Typography } from 'antd'
import { HomeQuickTools } from '@/components/HomeQuickTools/HomeQuickTools'
import { useRouter } from 'next/navigation'
import { copy } from '@/messages/fr'
import './HomeHub.css'

const generators = [
  {
    href: '/generators/character',
    title: copy.hub.characterCardTitle,
    description: copy.hub.characterCardDescription,
  },
  {
    href: '/generators/village',
    title: copy.hub.villageCardTitle,
    description: copy.hub.villageCardDescription,
  },
] as const

export function HomeHub() {
  const router = useRouter()

  return (
    <div className='home-hub'>
      <header className='home-hub__header'>
        <Typography.Title level={1} className='home-hub__title'>
          {copy.hub.title}
        </Typography.Title>
        <p className='home-hub__subtitle'>{copy.hub.subtitle}</p>
      </header>
      <h2 className='home-hub__section-title'>{copy.hub.generatorsTitle}</h2>
      <ul className='home-hub__list'>
        {generators.map(g => (
          <li key={g.href} className='home-hub__item'>
            <Card
              hoverable
              role='link'
              tabIndex={0}
              className='home-hub__card'
              title={g.title}
              extra={<span className='home-hub__cta'>{copy.hub.open}</span>}
              onClick={() => router.push(g.href)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  router.push(g.href)
                }
              }}>
              <p className='home-hub__card-text'>{g.description}</p>
            </Card>
          </li>
        ))}
      </ul>
      <HomeQuickTools />
    </div>
  )
}
