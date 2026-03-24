'use client'

import { Alert, ConfigProvider, Divider, Form, Space, Tabs } from 'antd'
import type { TabsProps } from 'antd'
import { Layout } from '@/components/Layout/Layout'
import { isCharacterDead } from '@/lib/character/lifeStatus'
import { copy } from '@/messages/fr'
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
import type { CharacterSheetTabKey } from './characterSheetTabs'
import { useCharacterSheetActiveTab } from './useCharacterSheetActiveTab'
import { IdentityStatsTabSection } from './tabs/IdentityStatsTabSection'
import { CartographyTabSection } from './tabs/CartographyTabSection'
import { InventorySpellbookTabSection } from './tabs/InventorySpellbookTabSection'
import { JournalTabSection } from './tabs/JournalTabSection'
import { ToolsTabSection } from './tabs/ToolsTabSection'

export function CharacterSheetClient({ characterId }: { characterId: string }) {
  const { activeTabKey, setActiveTabKey } = useCharacterSheetActiveTab()

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

  const tabItems: TabsProps['items'] = [
    {
      key: 'identityStats',
      label: copy.characters.tabIdentityStats,
      children: (
        <IdentityStatsTabSection
          isDead={isDead}
          onMarkAsDead={handleMarkAsDead}
        />
      ),
      forceRender: true,
    },
    {
      key: 'cartography',
      label: copy.characters.tabCartography,
      children: <CartographyTabSection />,
      forceRender: true,
    },
    {
      key: 'inventorySpellbook',
      label: copy.characters.tabInventorySpellbook,
      children: (
        <InventorySpellbookTabSection
          isDead={isDead}
          inventoryLimit={inventoryLimit}
        />
      ),
      forceRender: true,
    },
    {
      key: 'journal',
      label: copy.characters.tabJournal,
      children: <JournalTabSection />,
      forceRender: true,
    },
    {
      key: 'tools',
      label: copy.characters.tabTools,
      children: <ToolsTabSection />,
      forceRender: true,
    },
  ]

  return (
    <Layout
      sheetNightChrome={characterSheetNightMode}
      title={character.name || copy.characters.unnamed}
      description={copy.characters.sheetDescription}
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

                <Tabs
                  activeKey={activeTabKey}
                  onChange={key => setActiveTabKey(key as CharacterSheetTabKey)}
                  destroyOnHidden={false}
                  items={tabItems}
                />
              </Space>
            </div>
          </ConfigProvider>
        </CharacterProvider>
      </Form>
    </Layout>
  )
}
