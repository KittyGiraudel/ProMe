'use client'

import { Card, Typography } from 'antd'
import { HomeQuickTools } from '@/components/HomeQuickTools/HomeQuickTools'
import { copy } from '@/messages/fr'
import { BlockedLink } from '@/components/Navigation/BlockedLink'
import './HomeHub.css'

const generators = [
  {
    href: '/generators/inhabitant',
    title: copy.hub.inhabitantCardTitle,
    description: copy.hub.inhabitantCardDescription,
  },
  {
    href: '/generators/village',
    title: copy.hub.villageCardTitle,
    description: copy.hub.villageCardDescription,
  },
  {
    href: '/characters',
    title: copy.hub.playerCharacterCardTitle,
    description: copy.hub.playerCharacterCardDescription,
  },
] as const

export function HomeHub() {
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
            <BlockedLink href={g.href} className='home-hub__card'>
              <Card
                hoverable
                className='home-hub__card'
                title={g.title}
                extra={<span className='home-hub__cta'>{copy.hub.open}</span>}>
                <p className='home-hub__card-text'>{g.description}</p>
              </Card>
            </BlockedLink>
          </li>
        ))}
      </ul>
      <HomeQuickTools />
    </div>
  )
}
