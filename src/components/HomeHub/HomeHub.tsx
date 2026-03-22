'use client'

import { Card, Typography } from 'antd'
import { useRouter } from 'next/navigation'
import { fr } from '@/messages/fr'
import './HomeHub.css'

const generators = [
  {
    href: '/generators/character',
    title: fr.hub.characterCardTitle,
    description: fr.hub.characterCardDescription,
  },
  {
    href: '/generators/village',
    title: fr.hub.villageCardTitle,
    description: fr.hub.villageCardDescription,
  },
] as const

export function HomeHub() {
  const router = useRouter()

  return (
    <div className='home-hub'>
      <header className='home-hub__header'>
        <Typography.Title level={1} className='home-hub__title'>
          {fr.hub.title}
        </Typography.Title>
        <p className='home-hub__subtitle'>{fr.hub.subtitle}</p>
      </header>
      <ul className='home-hub__list'>
        {generators.map(g => (
          <li key={g.href} className='home-hub__item'>
            <Card
              hoverable
              role='link'
              tabIndex={0}
              className='home-hub__card'
              title={g.title}
              extra={<span className='home-hub__cta'>{fr.hub.open}</span>}
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
    </div>
  )
}
