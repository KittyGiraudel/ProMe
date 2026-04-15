import { MenuFoldOutlined } from '@ant-design/icons'
import { Drawer, Grid } from 'antd'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { BIOME_IDS } from '@/constants/misc'
import { usePathname } from '@/i18n/navigation'
import { biomeIdToSlug } from '@/lib/biomes/biomeSlug'
import { AuthButton } from '../AuthButton/AuthButton'
import { Logo } from '../Logo/Logo'
import { useSettings } from '../PageSettings/SettingsContext'
import { BlockedLink } from './BlockedLink'
import { ThemeToggleButton } from './ThemeToggleButton'

import './NewNavigation.css'

export function NewNavigation() {
  const t = useTranslations()
  const { settings, updateSettings } = useSettings()
  const pathname = usePathname()
  const { md, xs, ...rest } = Grid.useBreakpoint()
  const [open, setOpen] = useState(false)
  console.log(md, rest)

  if (xs) {
    return (
      <>
        <nav className='NewNavigation'>
          <ul className='NewNavigation__list'>
            <li className='NewNavigation__item' data-active={pathname === '/'}>
              <BlockedLink href='/' className='NewNavigation__link'>
                <Logo />
              </BlockedLink>
            </li>
            <li
              className='NewNavigation__item NewNavigation__item--break'
              data-active={pathname === '/'}>
              <button
                type='button'
                className='NewNavigation__link'
                onClick={() => setOpen(true)}>
                <MenuFoldOutlined /> {t('nav.menu')}
              </button>
            </li>
            <li className='NewNavigation__item'>
              <ThemeToggleButton
                theme={settings.appearance.theme}
                className='NewNavigation__link'
                onToggle={() =>
                  updateSettings(prev => ({
                    ...prev,
                    appearance: {
                      ...prev.appearance,
                      theme:
                        prev.appearance.theme === 'dark' ? 'light' : 'dark',
                    },
                  }))
                }
              />
            </li>
          </ul>
        </nav>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          placement='right'
          closable={{ placement: 'end' }}
          title={t('nav.menu')}
          mask={false}>
          <ul className='NewNavigation__list' data-orientation='vertical'>
            <li
              className='NewNavigation__item'
              data-active={pathname.startsWith('/characters')}>
              <BlockedLink href='/characters' className='NewNavigation__link'>
                {t('nav.characters')}
              </BlockedLink>
            </li>
            <li className='NewNavigation__item'>
              <a className='NewNavigation__link'>
                {t('home.generators_title')}
              </a>
              <ul className='NewNavigation__submenu'>
                <li
                  className='NewNavigation__item'
                  data-active={pathname.startsWith('/generators/npc')}>
                  <BlockedLink
                    href='/generators/npc'
                    className='NewNavigation__link'>
                    {t('nav.inhabitant_generator')}
                  </BlockedLink>
                </li>
                <li
                  className='NewNavigation__item'
                  data-active={pathname.startsWith('/generators/village')}>
                  <BlockedLink
                    href='/generators/village'
                    className='NewNavigation__link'>
                    {t('nav.village_generator')}
                  </BlockedLink>
                </li>
              </ul>
            </li>
            <li className='NewNavigation__item'>
              <a className='NewNavigation__link'>{t('nav.biomes')}</a>
              <ul className='NewNavigation__submenu'>
                {BIOME_IDS.map(biome => (
                  <li
                    className='NewNavigation__item'
                    key={biome}
                    data-active={pathname.startsWith(
                      `/biomes/${biomeIdToSlug(biome)}`
                    )}>
                    <BlockedLink
                      href={`/biomes/${biomeIdToSlug(biome)}`}
                      className='NewNavigation__link'>
                      {t(`biomes.${biome}.name`)}
                    </BlockedLink>
                  </li>
                ))}
              </ul>
            </li>
            <li
              className='NewNavigation__item NewNavigation__item--break'
              data-active={pathname.startsWith('/faq')}>
              <BlockedLink href='/faq' className='NewNavigation__link'>
                {t('nav.faq')}
              </BlockedLink>
            </li>
            <li
              className='NewNavigation__item'
              data-active={pathname.startsWith('/settings')}>
              <BlockedLink href='/settings' className='NewNavigation__link'>
                {t('nav.settings')}
              </BlockedLink>
            </li>
            <li
              className='NewNavigation__item'
              data-active={pathname.startsWith('/login')}>
              <AuthButton className='NewNavigation__link' />
            </li>
          </ul>
        </Drawer>
      </>
    )
  }

  return (
    <nav className='NewNavigation'>
      <ul className='NewNavigation__list'>
        <li className='NewNavigation__item' data-active={pathname === '/'}>
          <BlockedLink href='/' className='NewNavigation__link'>
            <Logo />
          </BlockedLink>
        </li>
        <li
          className='NewNavigation__item'
          data-active={pathname.startsWith('/characters')}>
          <BlockedLink href='/characters' className='NewNavigation__link'>
            {t('nav.characters')}
          </BlockedLink>
        </li>
        <li className='NewNavigation__item'>
          <a className='NewNavigation__link'>{t('home.generators_title')}</a>
          <ul className='NewNavigation__submenu'>
            <li
              className='NewNavigation__item'
              data-active={pathname.startsWith('/generators/npc')}>
              <BlockedLink
                href='/generators/npc'
                className='NewNavigation__link'>
                {t('nav.inhabitant_generator')}
              </BlockedLink>
            </li>
            <li
              className='NewNavigation__item'
              data-active={pathname.startsWith('/generators/village')}>
              <BlockedLink
                href='/generators/village'
                className='NewNavigation__link'>
                {t('nav.village_generator')}
              </BlockedLink>
            </li>
          </ul>
        </li>
        <li className='NewNavigation__item'>
          <a className='NewNavigation__link'>{t('nav.biomes')}</a>
          <ul className='NewNavigation__submenu'>
            {BIOME_IDS.map(biome => (
              <li
                className='NewNavigation__item'
                key={biome}
                data-active={pathname.startsWith(
                  `/biomes/${biomeIdToSlug(biome)}`
                )}>
                <BlockedLink
                  href={`/biomes/${biomeIdToSlug(biome)}`}
                  className='NewNavigation__link'>
                  {t(`biomes.${biome}.name`)}
                </BlockedLink>
              </li>
            ))}
          </ul>
        </li>
        <li
          className='NewNavigation__item NewNavigation__item--break'
          data-active={pathname.startsWith('/faq')}>
          <BlockedLink href='/faq' className='NewNavigation__link'>
            {t('nav.faq')}
          </BlockedLink>
        </li>
        <li
          className='NewNavigation__item'
          data-active={pathname.startsWith('/settings')}>
          <BlockedLink href='/settings' className='NewNavigation__link'>
            {t('nav.settings')}
          </BlockedLink>
        </li>
        <li
          className='NewNavigation__item'
          data-active={pathname.startsWith('/login')}>
          <AuthButton className='NewNavigation__link' />
        </li>
        <li className='NewNavigation__item'>
          <ThemeToggleButton
            theme={settings.appearance.theme}
            className='NewNavigation__link'
            onToggle={() =>
              updateSettings(prev => ({
                ...prev,
                appearance: {
                  ...prev.appearance,
                  theme: prev.appearance.theme === 'dark' ? 'light' : 'dark',
                },
              }))
            }
          />
        </li>
      </ul>
    </nav>
  )
}
