'use client'

import { Alert, App, ConfigProvider, Divider, Form, Space } from 'antd'
import { Layout } from '@/components/Layout/Layout'
import { randomId } from '@/lib/character/model'
import { isCharacterDead } from '@/lib/character/lifeStatus'
import { copy } from '@/messages/fr'
import { IdentityCard } from '@/components/CharacterSheet/IdentityCard'
import { CharacteristicsCard } from '@/components/CharacterSheet/CharacteristicsCard'
import { ClockCard } from '@/components/CharacterSheet/ClockCard'
import { MapCard } from '@/components/CharacterSheet/MapCard'
import { InventoryCard } from '@/components/CharacterSheet/InventoryCard'
import { SpellbookCard } from '@/components/CharacterSheet/SpellbookCard'
import { NotesCard } from '@/components/CharacterSheet/NotesCard'
import { Button } from '@/components/Button/Button'
import { CharacterProvider } from '@/components/CharacterSheet/CharacterContext'
import { toFormValues } from './characterSheetForm'
import { useCharacterSheetDerived } from './useCharacterSheetDerived'
import { CharacterSheetEmptyState } from './CharacterSheetEmptyState'
import { useCharacterSheetForm } from './useCharacterSheetForm'
import { useCharacterSheetFormSync } from './useCharacterSheetFormSync'
import { useCharacterSheetMainActions } from './useCharacterSheetMainActions'
import { useCharacterSheetTheme } from './useCharacterSheetTheme'
import { useCharacterLifeStatusActions } from './useCharacterLifeStatusActions'

export function CharacterSheetClient({ characterId }: { characterId: string }) {
  const {
    form,
    character,
    saveErrors,
    setSaveErrors,
    getCharacterFromForm,
    onSaved,
  } = useCharacterSheetForm({ characterId })
  const isDead = character ? isCharacterDead(character) : false

  const sheetCharacterId = character?.id
  const {
    watchedClock,
    inventoryLimit,
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
    sheetCharacterId,
    watchedClock,
    clockTotalSegments,
    healthCurrent,
    healthMax,
    courageCurrent,
    courageMax,
    staminaCurrent,
    staminaMax,
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

  if (!character) {
    return <CharacterSheetEmptyState />
  }

  return (
    <Layout
      sheetNightChrome={characterSheetNightMode}
      title={character.name || copy.characters.unnamed}
      description={copy.characters.sheetDescription}
      breadcrumbs={[
        { label: copy.nav.homeLink, href: '/' },
        { label: copy.characters.pageTitle, href: '/characters' },
      ]}>
      <Form
        key={`${character.id}-${character.updatedAt}`}
        form={form}
        initialValues={toFormValues(character)}
        onFinish={handleSave}
        disabled={isDead}
        layout='vertical'
        colon={false}>
        <CharacterProvider form={form}>
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

                <IdentityCard isArchetypeReadonly />
                <CharacteristicsCard />
                <ClockCard />
                <MapCard />
                <Form.List name='inventory'>
                  {(fields, { add, remove }) => (
                    <InventoryCard
                      fields={fields}
                      inventoryLimit={inventoryLimit}
                      onAddItem={() => {
                        if (isDead) return
                        add({
                          id: randomId(),
                          label: '',
                          quantity: 1,
                          note: '',
                        })
                      }}
                      onRemoveItem={index => {
                        if (isDead) return
                        remove(index)
                      }}
                    />
                  )}
                </Form.List>
                <Form.List name='spellbook'>
                  {(fields, { add, remove }) => (
                    <SpellbookCard
                      fields={fields}
                      onAddSpell={() => {
                        if (isDead) return
                        add({
                          id: randomId(),
                          name: '',
                          note: '',
                        })
                      }}
                      onRemoveSpell={index => {
                        if (isDead) return
                        remove(index)
                      }}
                    />
                  )}
                </Form.List>
                <Form.List name='journalEntries'>
                  {(fields, { add, remove }) => (
                    <NotesCard
                      fields={fields}
                      onAddEntry={() => {
                        if (isDead) return
                        add({
                          id: randomId(),
                          content: '',
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        })
                      }}
                      onRemoveEntry={index => {
                        if (isDead) return
                        remove(index)
                      }}
                    />
                  )}
                </Form.List>
              </Space>

              <Divider />

              {!isDead ? (
                <Space wrap>
                  <Button type='primary' htmlType='submit'>
                    {copy.characters.save}
                  </Button>
                  <Button onClick={handleExport}>
                    {copy.characters.exportOne}
                  </Button>
                  <Button
                    danger
                    htmlType='button'
                    type='link'
                    onClick={handleMarkAsDead}>
                    {copy.characters.markDeadAction}
                  </Button>
                </Space>
              ) : null}
            </div>
          </ConfigProvider>
        </CharacterProvider>
      </Form>
      {isDead && (
        <Space wrap>
          <Button
            htmlType='button'
            type='primary'
            danger
            onClick={handleRevive}>
            {copy.characters.reviveAction}
          </Button>
          <Button onClick={handleExport}>{copy.characters.exportOne}</Button>
        </Space>
      )}
    </Layout>
  )
}
