'use client'

import { Card, Empty, Space, Typography } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Layout } from '@/components/Layout/Layout'
import { BlockedLink } from '@/components/Navigation/BlockedLink'
import { getCharacterStore } from '@/lib/character/store'
import type { Character } from '@/lib/character/types'
import { Button } from '@/components/Button/Button'
import { isCharacterDead } from '@/lib/character/lifeStatus'
import { characterSheetTabHref } from '@/app/characters/[id]/characterSheetRoutes'
import { useCharacterLibraryActions } from './useCharacterLibraryActions'
import { useLocalize } from '@/app/contexts/LocalizationContext'

export function CharacterLibraryClient() {
  const localize = useLocalize()
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
    <Layout
      title={localize.string('characters.pageTitle')}
      pageCoverBiome='floodedPlains'>
      <Space style={{ marginBottom: 16, flexWrap: 'wrap' }}>
        <Button type='primary' href='/characters/new'>
          {localize.string('characters.create')}
        </Button>
        <Button onClick={handleImportClick}>
          {localize.string('characters.import')}
        </Button>
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
          <Empty description={localize.string('characters.empty')} />
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
                    {dead && localize.string('characters.deadListSymbol')}{' '}
                    {character.name || localize.string('characters.unnamed')}
                    {dead ? (
                      <>
                        <span style={{ opacity: 0.5 }}>—</span>
                        <Typography.Text type='danger'>
                          {localize.string('characters.deadStatusLabel')}
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
                      {localize.string('characters.open')}
                    </BlockedLink>
                  </Space>
                }>
                <Space orientation='vertical' size={4}>
                  <Typography.Text>
                    {localize.template('characters.archetypeLine', {
                      value: localize.string(
                        `archetypes.${character.archetype}`
                      ),
                    })}
                  </Typography.Text>
                  <Typography.Text type='secondary'>
                    {localize.string('characters.updatedLine', {
                      value: localize.date(character.updatedAt) ?? '',
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
