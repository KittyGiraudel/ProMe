'use client'

import { App, Button, Card, Popconfirm, Space, Typography } from 'antd'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { Layout } from '@/components/Layout/Layout'
import { BlockedLink } from '@/components/Navigation/BlockedLink'
import { getCharacterStore } from '@/lib/playerCharacter/store'
import { saveDraft } from '@/lib/playerCharacter/draftStorage'
import { createPlayerCharacter } from '@/lib/playerCharacter/model'
import type { PlayerCharacter } from '@/lib/playerCharacter/types'
import { copy } from '@/messages/fr'

export function CharacterLibraryClient() {
  const { message } = App.useApp()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const store = useMemo(() => getCharacterStore(), [])
  // Keep initial render consistent with the server (no localStorage access on SSR).
  const [characters, setCharacters] = useState<PlayerCharacter[]>([])

  useEffect(() => {
    setCharacters(store.list())
  }, [store])

  const refresh = () => setCharacters(store.list())

  const handleCreate = () => {
    const draft = createPlayerCharacter()
    saveDraft(draft)
    router.push(`/characters/${draft.id}`)
  }

  const handleDelete = (id: string) => {
    store.delete(id)
    refresh()
    message.success(copy.playerCharacters.deleteSuccess)
  }

  const handleExport = async () => {
    const content = store.exportAll()
    try {
      await navigator.clipboard.writeText(content)
      message.success(copy.playerCharacters.exportCopied)
    } catch {
      message.error(copy.playerCharacters.exportCopyError)
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
        copy.playerCharacters.importSuccess(
          result.totalRead,
          result.created,
          result.updated
        )
      )
    } catch {
      message.error(copy.playerCharacters.importError)
    } finally {
      event.target.value = ''
    }
  }

  return (
    <Layout
      title={copy.playerCharacters.pageTitle}
      description={copy.playerCharacters.pageDescription}>
      <Space style={{ marginBottom: 16, flexWrap: 'wrap' }}>
        <Button type='primary' onClick={handleCreate}>
          {copy.playerCharacters.create}
        </Button>
        <Button onClick={handleImportClick}>
          {copy.playerCharacters.import}
        </Button>
        <Button onClick={handleExport}>
          {copy.playerCharacters.exportAll}
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
          <Typography.Text type='secondary'>
            {copy.playerCharacters.empty}
          </Typography.Text>
        </Card>
      ) : (
        <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
          {characters.map(character => (
            <Card
              key={character.id}
              title={character.name || copy.playerCharacters.unnamed}
              extra={
                <Space>
                  <BlockedLink href={`/characters/${character.id}`}>
                    {copy.playerCharacters.open}
                  </BlockedLink>
                  <Popconfirm
                    title={copy.playerCharacters.deleteConfirmTitle}
                    description={copy.playerCharacters.deleteConfirmDescription}
                    okText={copy.playerCharacters.delete}
                    cancelText={copy.playerCharacters.cancel}
                    onConfirm={() => handleDelete(character.id)}>
                    <Button type='link' danger>
                      {copy.playerCharacters.delete}
                    </Button>
                  </Popconfirm>
                </Space>
              }>
              <Space orientation='vertical' size={4}>
                <Typography.Text>
                  {copy.playerCharacters.archetypeLabel}:{' '}
                  {copy.playerCharacters.archetypes[character.archetype]}
                </Typography.Text>
                <Typography.Text type='secondary'>
                  {copy.playerCharacters.updatedLabel}:{' '}
                  {new Date(character.updatedAt).toLocaleString('fr-FR')}
                </Typography.Text>
              </Space>
            </Card>
          ))}
        </Space>
      )}
    </Layout>
  )
}
