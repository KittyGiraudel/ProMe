'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFormatter, useTranslations } from 'next-intl'
import { Card, Empty, Space, Typography } from 'antd'
import { getCharacterStore } from '@/lib/character/store'
import type { Character } from '@/lib/character/types'
import { isCharacterDead } from '@/lib/character/lifeStatus'
import { Layout } from '@/components/Layout/Layout'
import { BlockedLink } from '@/components/Navigation/BlockedLink'
import { Button } from '@/components/Button/Button'
import { useCharacterLibraryActions } from './useCharacterLibraryActions'

export function CharacterLibrary() {
  const t = useTranslations()
  const format = useFormatter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const store = useMemo(() => getCharacterStore(), [])

  // Keep initial render consistent with the server (no localStorage access on SSR).
  const [characters, setCharacters] = useState<Character[]>([])

  const refresh = useCallback(() => setCharacters(store.list()), [store])
  useEffect(() => refresh(), [])

  const { handleImportFile } = useCharacterLibraryActions({ refresh })
  const handleImportClick = useCallback(() => fileInputRef.current?.click(), [])

  return (
    <Layout
      title={t('characters.title')}
      bannerBiome='floodedPlains'
      breadcrumbs={[
        { title: t('nav.home'), path: '/' },
        { title: t('nav.characters'), path: '/characters' },
      ]}>
      <Space>
        <Button type='primary' href='/characters/new'>
          {t('new_character.create')}
        </Button>
        <Button onClick={handleImportClick}>{t('new_character.import')}</Button>
      </Space>

      <input
        ref={fileInputRef}
        type='file'
        accept='application/json'
        style={{ display: 'none' }}
        onChange={handleImportFile}
      />

      {characters.length === 0 ? (
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
                <Space>
                  <BlockedLink href={`/characters/${character.id}/identity`}>
                    {t('common.actions.open')}
                  </BlockedLink>
                </Space>
              }>
              <Space orientation='vertical' size={4}>
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
              </Space>
            </Card>
          )
        })
      )}
    </Layout>
  )
}
