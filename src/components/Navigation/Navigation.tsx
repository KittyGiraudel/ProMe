import { MenuFoldOutlined } from '@ant-design/icons'
import { Drawer } from 'antd'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { BIOME_IDS } from '@/constants/misc'
import { useCharactersQuery } from '@/hooks/useQuery'
import { usePathname } from '@/i18n/navigation'
import { biomeIdToSlug } from '@/lib/biomes/biomeSlug'
import { AuthButton } from '../AuthButton/AuthButton'
import { Logo } from '../Logo/Logo'
import { useSettings } from '../PageSettings/SettingsContext'
import { BlockedLink } from './BlockedLink'
import { SkipLink } from './SkipLink'
import { ThemeToggleButton } from './ThemeToggleButton'

import './Navigation.css'

export function Navigation({
  disableThemeToggle,
}: {
  disableThemeToggle?: boolean
}) {
  const t = useTranslations()
  const { settings, updateSettings } = useSettings()
  const { data: characters } = useCharactersQuery()
  const pathname = usePathname()
  const [isNavDrawerOpen, setNavDrawerOpen] = useState(false)
  const [isGeneratorsSubmenuExpanded, setIsGeneratorsSubmenuExpanded] =
    useState(false)
  const [isBiomesSubmenuExpanded, setIsBiomesSubmenuExpanded] = useState(false)
  const handleThemeToggle = () =>
    updateSettings(curr => ({
      ...curr,
      appearance: {
        ...curr.appearance,
        theme: curr.appearance.theme === 'dark' ? 'light' : 'dark',
      },
    }))

  return (
    <>
      <nav className='Nav'>
        <SkipLink />
        <ul className='Nav__list' data-orientation='horizontal'>
          <li
            className='Nav__item'
            data-active={pathname === '/'}
            data-presence='any'>
            <BlockedLink href='/' className='Nav__link'>
              <Logo />
            </BlockedLink>
          </li>
          <li
            className='Nav__item'
            data-active={pathname.startsWith('/characters')}
            data-presence='wide-only'>
            <button type='button' className='Nav__link'>
              {t('nav.characters')}
            </button>
            <ul className='Nav__submenu'>
              {characters?.slice(0, 3).map(character => (
                <li key={character.id} className='Nav__item'>
                  <BlockedLink
                    href={`/characters/${character.id}`}
                    className='Nav__link'>
                    {character.name}
                  </BlockedLink>
                </li>
              ))}
              <li className='Nav__item'>
                <BlockedLink href='/characters' className='Nav__link'>
                  {t('nav.all_characters')}
                </BlockedLink>
              </li>
              <li className='Nav__item'>
                <BlockedLink href='/characters/new' className='Nav__link'>
                  {t('nav.new_character')}
                </BlockedLink>
              </li>
            </ul>
          </li>
          <li className='Nav__item' data-presence='wide-only'>
            <button
              className='Nav__link'
              onClick={() => setIsGeneratorsSubmenuExpanded(prev => !prev)}
              onMouseEnter={() => setIsGeneratorsSubmenuExpanded(true)}
              onMouseLeave={() => setIsGeneratorsSubmenuExpanded(false)}>
              {t('home.generators_title')}
            </button>
            <ul
              className='Nav__submenu'
              aria-expanded={isGeneratorsSubmenuExpanded}
              onMouseEnter={() => setIsGeneratorsSubmenuExpanded(true)}
              onMouseLeave={() => setIsGeneratorsSubmenuExpanded(false)}>
              <li
                className='Nav__item'
                data-active={pathname.startsWith('/generators/npc')}>
                <BlockedLink href='/generators/npc' className='Nav__link'>
                  {t('nav.inhabitant_generator')}
                </BlockedLink>
              </li>
              <li
                className='Nav__item'
                data-active={pathname.startsWith('/generators/village')}>
                <BlockedLink href='/generators/village' className='Nav__link'>
                  {t('nav.village_generator')}
                </BlockedLink>
              </li>
            </ul>
          </li>
          <li className='Nav__item' data-presence='wide-only'>
            <button
              type='button'
              className='Nav__link'
              onClick={() => setIsBiomesSubmenuExpanded(prev => !prev)}
              onMouseEnter={() => setIsBiomesSubmenuExpanded(true)}
              onMouseLeave={() => setIsBiomesSubmenuExpanded(false)}>
              {t('nav.biomes')}
            </button>
            <ul
              className='Nav__submenu'
              aria-expanded={isBiomesSubmenuExpanded}
              onMouseEnter={() => setIsBiomesSubmenuExpanded(true)}
              onMouseLeave={() => setIsBiomesSubmenuExpanded(false)}>
              {BIOME_IDS.map(biome => {
                const slug = biomeIdToSlug(biome)
                return (
                  <li
                    className='Nav__item'
                    key={biome}
                    data-active={pathname.startsWith(`/biomes/${slug}`)}>
                    <BlockedLink href={`/biomes/${slug}`} className='Nav__link'>
                      {t(`biomes.${biome}.name`)}
                    </BlockedLink>
                  </li>
                )
              })}
            </ul>
          </li>
          <li
            className='Nav__item Nav__item--break'
            data-active={pathname.startsWith('/faq')}
            data-presence='wide-only'>
            <BlockedLink href='/faq' className='Nav__link'>
              {t('nav.faq')}
            </BlockedLink>
          </li>
          <li
            className='Nav__item'
            data-active={pathname.startsWith('/settings')}
            data-presence='wide-only'>
            <BlockedLink href='/settings' className='Nav__link'>
              {t('nav.settings')}
            </BlockedLink>
          </li>
          <li
            className='Nav__item'
            data-active={pathname.startsWith('/login')}
            data-presence='wide-only'>
            <AuthButton className='Nav__link' />
          </li>
          <li
            className='Nav__item Nav__item--break'
            data-presence='narrow-only'>
            <button
              type='button'
              className='Nav__link'
              onClick={() => setNavDrawerOpen(true)}>
              <MenuFoldOutlined /> {t('nav.menu')}
            </button>
          </li>
          <li className='Nav__item' data-presence='any'>
            <ThemeToggleButton
              theme={settings.appearance.theme}
              className='Nav__link'
              onToggle={handleThemeToggle}
              disabled={disableThemeToggle}
            />
          </li>
        </ul>
      </nav>
      <Drawer
        open={isNavDrawerOpen}
        onClose={() => setNavDrawerOpen(false)}
        placement='right'
        closable={{ placement: 'end' }}
        title={t('nav.menu')}
        mask={false}>
        <ul className='Nav__list' data-orientation='vertical'>
          <li
            className='Nav__item'
            data-active={pathname.startsWith('/characters')}>
            <button type='button' className='Nav__link'>
              {t('nav.characters')}
            </button>
            <ul className='Nav__submenu'>
              {characters?.slice(0, 3).map(character => (
                <li key={character.id} className='Nav__item'>
                  <BlockedLink
                    href={`/characters/${character.id}`}
                    className='Nav__link'>
                    {character.name}
                  </BlockedLink>
                </li>
              ))}
              <li className='Nav__item'>
                <BlockedLink href='/characters' className='Nav__link'>
                  {t('nav.all_characters')}
                </BlockedLink>
              </li>
              <li className='Nav__item'>
                <BlockedLink href='/characters/new' className='Nav__link'>
                  {t('nav.new_character')}
                </BlockedLink>
              </li>
            </ul>
          </li>
          <li className='Nav__item'>
            <span className='Nav__link'>{t('home.generators_title')}</span>
            <ul className='Nav__submenu'>
              <li
                className='Nav__item'
                data-active={pathname.startsWith('/generators/npc')}>
                <BlockedLink href='/generators/npc' className='Nav__link'>
                  {t('nav.inhabitant_generator')}
                </BlockedLink>
              </li>
              <li
                className='Nav__item'
                data-active={pathname.startsWith('/generators/village')}>
                <BlockedLink href='/generators/village' className='Nav__link'>
                  {t('nav.village_generator')}
                </BlockedLink>
              </li>
            </ul>
          </li>
          <li className='Nav__item'>
            <span className='Nav__link'>{t('nav.biomes')}</span>
            <ul className='Nav__submenu'>
              {BIOME_IDS.map(biome => {
                const slug = biomeIdToSlug(biome)
                return (
                  <li
                    className='Nav__item'
                    key={biome}
                    data-active={pathname.startsWith(`/biomes/${slug}`)}>
                    <BlockedLink href={`/biomes/${slug}`} className='Nav__link'>
                      {t(`biomes.${biome}.name`)}
                    </BlockedLink>
                  </li>
                )
              })}
            </ul>
          </li>
          <li
            className='Nav__item Nav__item--break'
            data-active={pathname.startsWith('/faq')}>
            <BlockedLink href='/faq' className='Nav__link'>
              {t('nav.faq')}
            </BlockedLink>
          </li>
          <li
            className='Nav__item'
            data-active={pathname.startsWith('/settings')}>
            <BlockedLink href='/settings' className='Nav__link'>
              {t('nav.settings')}
            </BlockedLink>
          </li>
          <li className='Nav__item' data-active={pathname.startsWith('/login')}>
            <AuthButton className='Nav__link' />
          </li>
        </ul>
      </Drawer>
    </>
  )
}
