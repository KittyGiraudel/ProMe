'use client'

import { Menu } from 'antd'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { AuthButton } from '@/components/AuthButton/AuthButton'
import { Logo } from '@/components/Logo/Logo'
import { BIOME_IDS } from '@/constants/misc'
import { usePathname } from '@/i18n/navigation'
import { useAuth } from '@/lib/auth/context'
import { biomeIdToSlug } from '@/lib/biomes/biomeSlug'
import { BlockedLink } from './BlockedLink'

import './Navigation.css'

export function Navigation() {
  const t = useTranslations()
  const pathname = usePathname()
  const { loading } = useAuth()

  const items = useMemo(
    () => [
      {
        key: '/',
        label: (
          <BlockedLink href='/'>
            <Logo />
          </BlockedLink>
        ),
      },
      {
        key: '/characters',
        label: (
          <BlockedLink href='/characters'>{t('nav.characters')}</BlockedLink>
        ),
      },
      {
        key: 'generators',
        label: <span>{t('home.generators_title')}</span>,
        popupOffset: [-16, 0],
        children: [
          {
            key: '/generators/npc',
            label: (
              <BlockedLink href='/generators/npc'>
                {t('nav.inhabitant_generator')}
              </BlockedLink>
            ),
          },
          {
            key: '/generators/village',
            label: (
              <BlockedLink href='/generators/village'>
                {t('nav.village_generator')}
              </BlockedLink>
            ),
          },
        ],
      },
      {
        key: '/biomes',
        label: <span>{t('nav.biomes')}</span>,
        popupOffset: [-16, 0],
        children: BIOME_IDS.map(biome => ({
          key: `/biomes/${biomeIdToSlug(biome)}`,
          label: (
            <BlockedLink href={`/biomes/${biomeIdToSlug(biome)}`}>
              {t(`biomes.${biome}.name`)}
            </BlockedLink>
          ),
        })),
      },
      {
        key: '/faq',
        label: (
          <BlockedLink href='/faq' data-position='right'>
            {t('nav.faq')}
          </BlockedLink>
        ),
      },
      {
        key: '/settings',
        label: <BlockedLink href='/settings'>{t('nav.settings')}</BlockedLink>,
      },
      {
        key: '/authentication',
        label: <AuthButton />,
      },
    ],
    [t]
  )

  const selected = useMemo(() => {
    if (pathname.startsWith('/generators/npc'))
      return ['/generators', '/generators/npc']
    if (pathname.startsWith('/generators/village'))
      return ['/generators', '/generators/village']
    if (pathname.startsWith('/faq')) return ['/faq']
    if (pathname.startsWith('/settings')) return ['/settings']
    if (pathname.startsWith('/characters')) return ['/characters']
    for (const biome of BIOME_IDS) {
      if (pathname.startsWith(`/biomes/${biomeIdToSlug(biome)}`))
        return [`/biomes`, `/biomes/${biomeIdToSlug(biome)}`]
    }
    if (!loading && pathname.startsWith('/login')) return ['/authentication']
    if (pathname === '/') return ['/']
    return []
  }, [pathname, loading])

  return (
    <Menu
      className='Navigation'
      theme='dark'
      mode='horizontal'
      items={items}
      selectedKeys={selected}
      multiple
    />
  )
}
