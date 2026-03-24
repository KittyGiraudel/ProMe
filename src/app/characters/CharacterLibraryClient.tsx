'use client'

import { App, Card, Empty, Popconfirm, Space, Typography } from 'antd'
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { Layout } from '@/components/Layout/Layout'
import { BlockedLink } from '@/components/Navigation/BlockedLink'
import { getCharacterStore } from '@/lib/character/store'
import type { Character } from '@/lib/character/types'
import { copy } from '@/messages/fr'
import { Button } from '@/components/Button/Button'
import { isCharacterDead } from '@/lib/character/lifeStatus'

export function CharacterLibraryClient() {
  const { message } = App.useApp()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const store = useMemo(() => getCharacterStore(), [])
  // Keep initial render consistent with the server (no localStorage access on SSR).
  const [characters, setCharacters] = useState<Character[]>([])

  useEffect(() => {
    setCharacters(store.list())
  }, [store])

  const refresh = () => setCharacters(store.list())

  const handleDelete = (id: string) => {
    store.delete(id)
    refresh()
    message.success(copy.characters.deleteSuccess)
  }

  const handleExport = async () => {
    const content = store.exportAll()
    try {
      await navigator.clipboard.writeText(content)
      message.success(copy.characters.exportCopied)
    } catch {
      message.error(copy.characters.exportCopyError)
    }
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const raw = await file.text()
      const result = store.importAll(raw, 'upsert')
      refresh()
      message.success(
        copy.characters.importSuccess(
          result.totalRead,
          result.created,
          result.updated
        )
      )
    } catch {
      message.error(copy.characters.importError)
    } finally {
      event.target.value = ''
    }
  }

  return (
    <Layout
      title={copy.characters.pageTitle}
      description={copy.characters.pageDescription}>
      <Space style={{ marginBottom: 16, flexWrap: 'wrap' }}>
        <Button type='primary' href='/characters/new'>
          {copy.characters.create}
        </Button>
        <Button onClick={handleImportClick}>{copy.characters.import}</Button>
        <Button onClick={handleExport}>{copy.characters.exportAll}</Button>
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
          <Empty description={copy.characters.empty} />
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
                    {dead && copy.characters.deadListSymbol}{' '}
                    {character.name || copy.characters.unnamed}
                    {dead ? (
                      <>
                        <span style={{ opacity: 0.5 }}>
                          {copy.common.emDashSpaced}
                        </span>
                        <Typography.Text type='danger'>
                          {copy.characters.deadStatusLabel}
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
                    <BlockedLink href={`/characters/${character.id}`}>
                      {copy.characters.open}
                    </BlockedLink>
                    <Popconfirm
                      title={copy.characters.deleteConfirmTitle}
                      description={copy.characters.deleteConfirmDescription}
                      okText={copy.characters.delete}
                      cancelText={copy.characters.cancel}
                      onConfirm={() => handleDelete(character.id)}>
                      <Button type='link' danger>
                        {copy.characters.delete}
                      </Button>
                    </Popconfirm>
                  </Space>
                }>
                <Space orientation='vertical' size={4}>
                  <Typography.Text>
                    {copy.characters.archetypeLabel}:{' '}
                    {copy.characters.archetypes[character.archetype]}
                  </Typography.Text>
                  <Typography.Text type='secondary'>
                    {copy.characters.updatedLabel}:{' '}
                    {new Date(character.updatedAt).toLocaleString('fr-FR')}
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
