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

import './Navigation.css'

export function Navigation() {
  const t = useTranslations()
  const { settings, updateSettings } = useSettings()
  const pathname = usePathname()
  const { xs } = Grid.useBreakpoint()
  const [open, setOpen] = useState(false)
  const handleThemeToggle = () =>
    updateSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        theme: prev.appearance.theme === 'dark' ? 'light' : 'dark',
      },
    }))

  if (xs) {
    return (
      <>
        <nav className='Navigation'>
          <ul className='Navigation__list'>
            <li className='Navigation__item' data-active={pathname === '/'}>
              <BlockedLink href='/' className='Navigation__link'>
                <Logo />
              </BlockedLink>
            </li>
            <li className='Navigation__item Navigation__item--break'>
              <button
                type='button'
                className='Navigation__link'
                onClick={() => setOpen(true)}>
                <MenuFoldOutlined /> {t('nav.menu')}
              </button>
            </li>
            <li className='Navigation__item'>
              <ThemeToggleButton
                theme={settings.appearance.theme}
                className='Navigation__link'
                onToggle={handleThemeToggle}
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
          <ul className='Navigation__list' data-orientation='vertical'>
            <li
              className='Navigation__item'
              data-active={pathname.startsWith('/characters')}>
              <BlockedLink href='/characters' className='Navigation__link'>
                {t('nav.characters')}
              </BlockedLink>
            </li>
            <li className='Navigation__item'>
              <span className='Navigation__link'>
                {t('home.generators_title')}
              </span>
              <ul className='Navigation__submenu'>
                <li
                  className='Navigation__item'
                  data-active={pathname.startsWith('/generators/npc')}>
                  <BlockedLink
                    href='/generators/npc'
                    className='Navigation__link'>
                    {t('nav.inhabitant_generator')}
                  </BlockedLink>
                </li>
                <li
                  className='Navigation__item'
                  data-active={pathname.startsWith('/generators/village')}>
                  <BlockedLink
                    href='/generators/village'
                    className='Navigation__link'>
                    {t('nav.village_generator')}
                  </BlockedLink>
                </li>
              </ul>
            </li>
            <li className='Navigation__item'>
              <span className='Navigation__link'>{t('nav.biomes')}</span>
              <ul className='Navigation__submenu'>
                {BIOME_IDS.map(biome => {
                  const slug = biomeIdToSlug(biome)
                  return (
                    <li
                      className='Navigation__item'
                      key={biome}
                      data-active={pathname.startsWith(`/biomes/${slug}`)}>
                      <BlockedLink
                        href={`/biomes/${slug}`}
                        className='Navigation__link'>
                        {t(`biomes.${biome}.name`)}
                      </BlockedLink>
                    </li>
                  )
                })}
              </ul>
            </li>
            <li
              className='Navigation__item Navigation__item--break'
              data-active={pathname.startsWith('/faq')}>
              <BlockedLink href='/faq' className='Navigation__link'>
                {t('nav.faq')}
              </BlockedLink>
            </li>
            <li
              className='Navigation__item'
              data-active={pathname.startsWith('/settings')}>
              <BlockedLink href='/settings' className='Navigation__link'>
                {t('nav.settings')}
              </BlockedLink>
            </li>
            <li
              className='Navigation__item'
              data-active={pathname.startsWith('/login')}>
              <AuthButton className='Navigation__link' />
            </li>
          </ul>
        </Drawer>
      </>
    )
  }

  return (
    <nav className='Navigation'>
      <ul className='Navigation__list'>
        <li className='Navigation__item' data-active={pathname === '/'}>
          <BlockedLink href='/' className='Navigation__link'>
            <Logo />
          </BlockedLink>
        </li>
        <li
          className='Navigation__item'
          data-active={pathname.startsWith('/characters')}>
          <BlockedLink href='/characters' className='Navigation__link'>
            {t('nav.characters')}
          </BlockedLink>
        </li>
        <li className='Navigation__item'>
          <span className='Navigation__link'>{t('home.generators_title')}</span>
          <ul className='Navigation__submenu'>
            <li
              className='Navigation__item'
              data-active={pathname.startsWith('/generators/npc')}>
              <BlockedLink href='/generators/npc' className='Navigation__link'>
                {t('nav.inhabitant_generator')}
              </BlockedLink>
            </li>
            <li
              className='Navigation__item'
              data-active={pathname.startsWith('/generators/village')}>
              <BlockedLink
                href='/generators/village'
                className='Navigation__link'>
                {t('nav.village_generator')}
              </BlockedLink>
            </li>
          </ul>
        </li>
        <li className='Navigation__item'>
          <span className='Navigation__link'>{t('nav.biomes')}</span>
          <ul className='Navigation__submenu'>
            {BIOME_IDS.map(biome => {
              const slug = biomeIdToSlug(biome)
              return (
                <li
                  className='Navigation__item'
                  key={biome}
                  data-active={pathname.startsWith(`/biomes/${slug}`)}>
                  <BlockedLink
                    href={`/biomes/${slug}`}
                    className='Navigation__link'>
                    {t(`biomes.${biome}.name`)}
                  </BlockedLink>
                </li>
              )
            })}
          </ul>
        </li>
        <li
          className='Navigation__item Navigation__item--break'
          data-active={pathname.startsWith('/faq')}>
          <BlockedLink href='/faq' className='Navigation__link'>
            {t('nav.faq')}
          </BlockedLink>
        </li>
        <li
          className='Navigation__item'
          data-active={pathname.startsWith('/settings')}>
          <BlockedLink href='/settings' className='Navigation__link'>
            {t('nav.settings')}
          </BlockedLink>
        </li>
        <li
          className='Navigation__item'
          data-active={pathname.startsWith('/login')}>
          <AuthButton className='Navigation__link' />
        </li>
        <li className='Navigation__item'>
          <ThemeToggleButton
            theme={settings.appearance.theme}
            className='Navigation__link'
            onToggle={handleThemeToggle}
          />
        </li>
      </ul>
    </nav>
  )
}
