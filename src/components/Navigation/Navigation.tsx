import { MenuFoldOutlined } from '@ant-design/icons'
import { Button, Drawer } from 'antd'
import { useParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import { AuthButton } from '@/components/AuthButton/AuthButton'
import { Logo } from '@/components/Logo/Logo'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { BIOME_IDS } from '@/constants/misc'
import { useCharactersQuery } from '@/hooks/useQuery'
import { usePathname } from '@/i18n/navigation'
import { biomeIdToSlug } from '@/lib/biomes/biomeSlug'
import { AppLink } from './AppLink'
import { SkipLink } from './SkipLink'
import { ThemeToggleButton } from './ThemeToggleButton'

import './Navigation.css'

export function Navigation({
  disableThemeToggle,
}: {
  disableThemeToggle?: boolean
}) {
  const t = useTranslations()
  const locale = useLocale()
  const { settings, updateSettings } = useSettings()
  const { data: characters } = useCharactersQuery()
  // Note that `pathname` returns the unlocalized pathname, as defined in the
  // routing configuration (e.g. `/characters/[id]`).
  const pathname = usePathname()
  const { biome: activeBiomeSlug } = useParams<{ biome?: string }>()
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
            <AppLink to={{ route: 'home' }} block className='Nav__link'>
              <Logo />
            </AppLink>
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
                  <AppLink
                    to={{ route: 'character', params: { id: character.id } }}
                    block
                    className='Nav__link'>
                    {character.name}
                  </AppLink>
                </li>
              ))}
              <li className='Nav__item'>
                <AppLink
                  to={{ route: 'characters' }}
                  block
                  className='Nav__link'>
                  {t('nav.all_characters')}
                </AppLink>
              </li>
              <li className='Nav__item'>
                <AppLink
                  to={{ route: 'newCharacter' }}
                  block
                  className='Nav__link'>
                  {t('nav.new_character')}
                </AppLink>
              </li>
            </ul>
          </li>
          <li className='Nav__item' data-presence='wide-only'>
            <button
              className='Nav__link'
              onClick={() => setIsGeneratorsSubmenuExpanded(prev => !prev)}
              onMouseEnter={() => setIsGeneratorsSubmenuExpanded(true)}
              onMouseLeave={() => setIsGeneratorsSubmenuExpanded(false)}>
              {t('nav.generators')}
            </button>
            <ul
              className='Nav__submenu'
              aria-expanded={isGeneratorsSubmenuExpanded}
              onMouseEnter={() => setIsGeneratorsSubmenuExpanded(true)}
              onMouseLeave={() => setIsGeneratorsSubmenuExpanded(false)}>
              <li
                className='Nav__item'
                data-active={pathname.startsWith('/generators/npc')}>
                <AppLink
                  to={{ route: 'npcGenerator' }}
                  block
                  className='Nav__link'>
                  {t('nav.inhabitant_generator')}
                </AppLink>
              </li>
              <li
                className='Nav__item'
                data-active={pathname.startsWith('/generators/village')}>
                <AppLink
                  to={{ route: 'villageGenerator' }}
                  block
                  className='Nav__link'>
                  {t('nav.village_generator')}
                </AppLink>
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
                const slug = biomeIdToSlug(biome, locale)
                return (
                  <li
                    className='Nav__item'
                    key={biome}
                    data-active={activeBiomeSlug === slug}>
                    <AppLink
                      to={{ route: 'biome', params: { biome: slug } }}
                      block
                      className='Nav__link'>
                      {t(`biomes.${biome}.name`)}
                    </AppLink>
                  </li>
                )
              })}
            </ul>
          </li>
          <li
            className='Nav__item Nav__item--break'
            data-active={pathname.startsWith('/settings')}
            data-presence='wide-only'>
            <AppLink to={{ route: 'settings' }} block className='Nav__link'>
              {t('nav.settings')}
            </AppLink>
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
            <Button
              className='Nav__link'
              onClick={() => setNavDrawerOpen(true)}
              icon={<MenuFoldOutlined />}>
              {t('nav.menu')}
            </Button>
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
                  <AppLink
                    to={{ route: 'character', params: { id: character.id } }}
                    block
                    className='Nav__link'>
                    {character.name}
                  </AppLink>
                </li>
              ))}
              <li className='Nav__item'>
                <AppLink
                  to={{ route: 'characters' }}
                  block
                  className='Nav__link'>
                  {t('nav.all_characters')}
                </AppLink>
              </li>
              <li className='Nav__item'>
                <AppLink
                  to={{ route: 'newCharacter' }}
                  block
                  className='Nav__link'>
                  {t('nav.new_character')}
                </AppLink>
              </li>
            </ul>
          </li>
          <li className='Nav__item'>
            <span className='Nav__link'>{t('nav.generators')}</span>
            <ul className='Nav__submenu'>
              <li
                className='Nav__item'
                data-active={pathname.startsWith('/generators/npc')}>
                <AppLink
                  to={{ route: 'npcGenerator' }}
                  block
                  className='Nav__link'>
                  {t('nav.inhabitant_generator')}
                </AppLink>
              </li>
              <li
                className='Nav__item'
                data-active={pathname.startsWith('/generators/village')}>
                <AppLink
                  to={{ route: 'villageGenerator' }}
                  block
                  className='Nav__link'>
                  {t('nav.village_generator')}
                </AppLink>
              </li>
            </ul>
          </li>
          <li className='Nav__item'>
            <span className='Nav__link'>{t('nav.biomes')}</span>
            <ul className='Nav__submenu'>
              {BIOME_IDS.map(biome => {
                const slug = biomeIdToSlug(biome, locale)
                return (
                  <li
                    className='Nav__item'
                    key={biome}
                    data-active={activeBiomeSlug === slug}>
                    <AppLink
                      to={{ route: 'biome', params: { biome: slug } }}
                      block
                      className='Nav__link'>
                      {t(`biomes.${biome}.name`)}
                    </AppLink>
                  </li>
                )
              })}
            </ul>
          </li>
          <li
            className='Nav__item Nav__item--break'
            data-active={pathname.startsWith('/faq')}>
            <AppLink to={{ route: 'faq' }} block className='Nav__link'>
              {t('nav.faq')}
            </AppLink>
          </li>
          <li
            className='Nav__item'
            data-active={pathname.startsWith('/settings')}>
            <AppLink to={{ route: 'settings' }} block className='Nav__link'>
              {t('nav.settings')}
            </AppLink>
          </li>
          <li className='Nav__item' data-active={pathname.startsWith('/login')}>
            <AuthButton className='Nav__link' />
          </li>
        </ul>
      </Drawer>
    </>
  )
}
