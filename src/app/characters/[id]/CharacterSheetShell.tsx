'use client'

import { Alert, ConfigProvider, Form, Space } from 'antd'
import { useMemo, type ReactNode } from 'react'
import { Layout } from '@/components/Layout/Layout'
import { isCharacterDead } from '@/lib/character/lifeStatus'
import { copy } from '@/messages/fr'
import { Button } from '@/components/Button/Button'
import { CharacterProvider } from '@/components/CharacterSheet/CharacterContext'
import { toFormValues } from './characterSheetForm'
import { useCharacterSheetDerived } from './useCharacterSheetDerived'
import { CharacterSheetEmptyState } from './CharacterSheetEmptyState'
import { useCharacterSheetDocumentTitle } from './useCharacterSheetDocumentTitle'
import { useCharacterSheetForm } from './useCharacterSheetForm'
import { useCharacterSheetFormSync } from './useCharacterSheetFormSync'
import { useCharacterSheetMainActions } from './useCharacterSheetMainActions'
import { useCharacterSheetTheme } from './useCharacterSheetTheme'
import {
  useCharacterLifeStatusActions,
  useWarnDeath,
} from './useCharacterLifeStatusActions'
import { CharacterSheetTabNav } from './CharacterSheetTabNav'
import { biomeAtCurrentMapPosition } from '@/lib/character/biomeAtCurrentMapPosition'

export function CharacterSheetShell({
  characterId,
  children,
}: {
  characterId: string
  children: ReactNode
}) {
  // Ant Design form + character from client store; unsaved-navigation guard;
  // merge form → Character for save/export; `onSaved` refreshes local character
  // state after persistence.
  const {
    form,
    character,
    hydratedFromStore,
    saveErrors,
    setSaveErrors,
    onSaved,
  } = useCharacterSheetForm({ characterId })

  // Watches clock/stamina (preserve-aware) to drive adaptive sheet “night”
  // chrome and Ant Design theme.
  const { characterSheetNightMode, configTheme } = useCharacterSheetTheme({
    form,
    character,
  })

  // Side effects: remap clock index when stamina changes total segments; clamp
  // health/courage/stamina current values so they never exceed max (also uses
  // derived watches internally).
  useCharacterSheetFormSync({
    form,
    character,
  })

  // `generateMetadata` can’t see store-backed names; this sets `document.title`
  // after hydration (+ tab suffix).
  useCharacterSheetDocumentTitle({
    hydratedFromStore,
    character,
    characterId,
  })

  // Mark dead / revive and death-suggestion flow; reads live health from the
  // form via derived watches.
  const { handleMarkAsDead, handleRevive } = useCharacterLifeStatusActions({
    form,
    character,
    onSaved,
    setSaveErrors,
  })

  // Warn the user when their health crosses to non-positive and suggest
  // marking the character as dead.
  useWarnDeath({ form, character, handleMarkAsDead })

  // Form `onFinish` save to store and JSON export download (both use full
  // `getCharacterFromForm()` snapshot).
  const { handleSave, handleExport } = useCharacterSheetMainActions({
    form,
    character,
    onSaved,
    setSaveErrors,
  })

  // Layout page-cover biome follows map position even when the active tab is not the map.
  const watchedMap = Form.useWatch('map', form)
  const pageCoverBiome = useMemo(
    () => biomeAtCurrentMapPosition(watchedMap),
    [watchedMap]
  )

  if (!character) {
    return <CharacterSheetEmptyState />
  }

  const isDead = character ? isCharacterDead(character) : false

  return (
    <Layout
      sheetNightChrome={characterSheetNightMode}
      pageCoverBiome={pageCoverBiome}
      title={character.name || copy.characters.unnamed}
      breadcrumbs={[
        { label: copy.nav.homeLink, href: '/' },
        { label: copy.characters.pageTitle, href: '/characters' },
      ]}
      headerActions={[
        !isDead ? (
          <Button
            key='save'
            type='primary'
            htmlType='submit'
            form={character.id}>
            {copy.characters.save}
          </Button>
        ) : null,
        <Button key='export' onClick={handleExport}>
          {copy.characters.export}
        </Button>,
        isDead ? (
          <Button
            key='revive'
            htmlType='button'
            type='primary'
            danger
            onClick={handleRevive}>
            {copy.characters.reviveAction}
          </Button>
        ) : null,
      ]}>
      <Form
        id={character.id}
        key={`${character.id}-${character.updatedAt}`}
        form={form}
        initialValues={toFormValues(character)}
        onFinish={handleSave}
        disabled={isDead}
        layout='vertical'
        colon={false}
        preserve>
        <CharacterProvider form={form} onMarkAsDead={handleMarkAsDead}>
          <ConfigProvider theme={configTheme}>
            <div
              data-sheet-night={characterSheetNightMode ? 'true' : undefined}>
              <Space
                orientation='vertical'
                size='middle'
                style={{ width: '100%' }}>
                {saveErrors ? (
                  <Alert type='error' title={saveErrors.join('; ')} />
                ) : null}
                {isDead ? (
                  <Alert
                    type='error'
                    title={copy.characters.deadReadonlyTitle}
                    description={copy.characters.deadReadonlyDescription}
                  />
                ) : null}

                <CharacterSheetTabNav characterId={character.id} />
                {children}
              </Space>
            </div>
          </ConfigProvider>
        </CharacterProvider>
      </Form>
    </Layout>
  )
}
