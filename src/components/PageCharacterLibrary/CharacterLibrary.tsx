'use client'

import { Card, Empty, Skeleton, Typography } from 'antd'
import { useFormatter, useTranslations } from 'next-intl'
import { useCallback, useRef } from 'react'
import { Button } from '@/components/Button/Button'
import { Layout } from '@/components/Layout/Layout'
import { BlockedLink } from '@/components/Navigation/BlockedLink'
import { Spacing } from '@/components/Spacing/Spacing'
import { useCharacterLibraryActions } from '@/hooks/useCharacterLibraryActions'
import { useCharacterLink } from '@/hooks/useCharacterLink'
import { useCharacters } from '@/hooks/useCharacters'
import { useHydration } from '@/hooks/useHydration'
import { isCharacterDead } from '@/lib/character/lifeStatus'

export function CharacterLibrary() {
  const t = useTranslations()
  const format = useFormatter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const characters = useCharacters()
  const hydrated = useHydration()

  const { handleImportFile } = useCharacterLibraryActions()
  const handleImportClick = useCallback(() => fileInputRef.current?.click(), [])
  const getCharacterLink = useCharacterLink({ tabId: 'identity' })

  return (
    <Layout
      title={t('characters.title')}
      bannerBiome='floodedPlains'
      breadcrumbs={[
        { title: t('nav.home'), path: '/' },
        { title: t('nav.characters'), path: '/characters' },
      ]}>
      <Spacing orientation='horizontal' size='small'>
        <Button type='primary' href='/characters/new'>
          {t('new_character.create')}
        </Button>
        <Button onClick={handleImportClick}>{t('new_character.import')}</Button>
      </Spacing>

      <input
        ref={fileInputRef}
        type='file'
        accept='application/json'
        style={{ display: 'none' }}
        onChange={handleImportFile}
      />

      {!hydrated ? (
        <Card>
          <Skeleton active />
        </Card>
      ) : characters.length === 0 ? (
        <Card>
          <Empty description={t('characters_list.empty')} />
        </Card>
      ) : (
        characters.map(character => {
          const dead = isCharacterDead(character)
          const name = character.name || t('characters_list.unnamed')

          return (
            <Card
              key={character.id}
              className='u-contain-layout u-cv-auto-card'
              title={
                dead
                  ? t.rich('characters_list.dead_character_name', {
                      name,
                      separator: parts => (
                        <Typography.Text type='secondary'>
                          {parts}
                        </Typography.Text>
                      ),
                      status: parts => (
                        <Typography.Text type='danger'>{parts}</Typography.Text>
                      ),
                    })
                  : name
              }
              styles={
                dead
                  ? {
                      header: { opacity: 0.75 },
                      body: { opacity: 0.75 },
                    }
                  : undefined
              }
              extra={
                <BlockedLink
                  href={getCharacterLink({ characterId: character.id })}>
                  {t('common.actions.open')}
                </BlockedLink>
              }>
              <Spacing size='small'>
                <Typography.Text>
                  {t('characters_list.archetype_line', {
                    value: t(`common.archetypes.name.${character.archetype}`, {
                      gender: character.gender ?? 'indeterminate',
                    }),
                  })}
                </Typography.Text>
                <Typography.Text type='secondary'>
                  {t('characters_list.updated_line', {
                    value: format.dateTime(new Date(character.updatedAt), {
                      dateStyle: 'medium',
                    }),
                  })}
                </Typography.Text>
              </Spacing>
            </Card>
          )
        })
      )}
    </Layout>
  )
}
