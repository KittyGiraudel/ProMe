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
import { useCharacterLifeStatusActions } from './useCharacterLifeStatusActions'
import { CharacterSheetTabNav } from './CharacterSheetTabNav'
import { biomeAtCurrentMapPosition } from '@/lib/character/biomeAtCurrentMapPosition'

export function CharacterSheetShell({
  characterId,
  children,
}: {
  characterId: string
  children: ReactNode
}) {
  const {
    form,
    character,
    hydratedFromStore,
    saveErrors,
    setSaveErrors,
    getCharacterFromForm,
    onSaved,
  } = useCharacterSheetForm({ characterId })

  const {
    watchedClock,
    clockTotalSegments,
    healthCurrent,
    healthMax,
    courageCurrent,
    courageMax,
    staminaCurrent,
    staminaMax,
  } = useCharacterSheetDerived({ form, character })

  const { characterSheetNightMode, configTheme } = useCharacterSheetTheme({
    watchedClock,
    staminaCurrent,
    clockTotalSegments,
  })

  useCharacterSheetFormSync({
    form,
    characterId,
    watchedClock,
    clockTotalSegments,
    healthCurrent,
    healthMax,
    courageCurrent,
    courageMax,
    staminaCurrent,
    staminaMax,
  })

  useCharacterSheetDocumentTitle({
    hydratedFromStore,
    character,
    characterId,
  })

  const { handleMarkAsDead, handleRevive } = useCharacterLifeStatusActions({
    getCharacter: getCharacterFromForm,
    healthCurrent,
    onSaved,
    clearSaveErrors: () => setSaveErrors(null),
  })

  const { handleSave, handleExport } = useCharacterSheetMainActions({
    character,
    getCharacterFromForm,
    onSaved,
    setSaveErrors,
  })

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
