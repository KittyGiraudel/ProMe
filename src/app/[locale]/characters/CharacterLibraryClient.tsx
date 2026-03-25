'use client'

import { Card, Empty, Space, Typography } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useFormatter, useTranslations } from 'next-intl'
import { Layout } from '@/components/Layout/Layout'
import { BlockedLink } from '@/components/Navigation/BlockedLink'
import { getCharacterStore } from '@/lib/character/store'
import type { Character } from '@/lib/character/types'
import { Button } from '@/components/Button/Button'
import { isCharacterDead } from '@/lib/character/lifeStatus'
import { characterSheetTabHref } from '@/app/[locale]/characters/[id]/characterSheetRoutes'
import { useCharacterLibraryActions } from './useCharacterLibraryActions'

export function CharacterLibraryClient() {
  const t = useTranslations()
  const format = useFormatter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const store = useMemo(() => getCharacterStore(), [])
  // Keep initial render consistent with the server (no localStorage access on SSR).
  const [characters, setCharacters] = useState<Character[]>([])

  useEffect(() => {
    setCharacters(store.list())
  }, [store])

  const refresh = () => setCharacters(store.list())

  const { handleImportFile } = useCharacterLibraryActions({
    refresh,
  })

  const handleImportClick = () => fileInputRef.current?.click()

  return (
    <Layout title={t('characters.page_title')} pageCoverBiome='floodedPlains'>
      <Space style={{ marginBottom: 16, flexWrap: 'wrap' }}>
        <Button type='primary' href='/characters/new'>
          {t('characters.create')}
        </Button>
        <Button onClick={handleImportClick}>{t('characters.import')}</Button>
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
          <Empty description={t('characters.empty')} />
        </Card>
      ) : (
        <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
          {characters.map(character => {
            const dead = isCharacterDead(character)

            return (
              <Card
                key={character.id}
                title={
                  <>
                    {dead && t('characters.dead_list_symbol')}{' '}
                    {character.name || t('characters.unnamed')}
                    {dead ? (
                      <>
                        <span style={{ opacity: 0.5 }}>—</span>
                        <Typography.Text type='danger'>
                          {t('characters.dead_status_label')}
                        </Typography.Text>
                      </>
                    ) : null}
                  </>
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
                    <BlockedLink
                      href={characterSheetTabHref(character.id, 'identity')}>
                      {t('common.open')}
                    </BlockedLink>
                  </Space>
                }>
                <Space orientation='vertical' size={4}>
                  <Typography.Text>
                    {t('characters.archetype_line', {
                      value: t(`common.archetypes.${character.archetype}`),
                    })}
                  </Typography.Text>
                  <Typography.Text type='secondary'>
                    {t('characters.updated_line', {
                      value: format.dateTime(new Date(character.updatedAt), {
                        dateStyle: 'medium',
                      }),
                    })}
                  </Typography.Text>
                </Space>
              </Card>
            )
          })}
        </Space>
      )}
    </Layout>
  )
}
