'use client'

import { useMemo, type ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { Alert, ConfigProvider, Form, Space } from 'antd'
import { Link } from '@/i18n/navigation'
import { Layout } from '@/components/Layout/Layout'
import { isCharacterDead } from '@/lib/character/lifeStatus'
import { biomeAtCurrentMapPosition } from '@/lib/character/biomeAtCurrentMapPosition'
import { Button } from '@/components/Button/Button'
import { CharacterProvider } from '@/components/PageCharacterSheet/CharacterContext'
import { CopyDropdown } from '@/components/CopyDropdown/CopyDropdown'
import { getProtectorSummary } from '@/lib/character/getProtectorSummary'
import { toFormValues } from './characterSheetForm'
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
import { CharacterStats } from '../CharacterStats/CharacterStats'

export function CharacterSheetShell({
  characterId,
  children,
}: {
  characterId: string
  children: ReactNode
}) {
  const t = useTranslations()

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
    activeTab,
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
  })

  // Mark dead / revive and death-suggestion flow; reads live health from the
  // form via derived watches.
  const { onKill, onRevive } = useCharacterLifeStatusActions({
    form,
    character,
    onSaved,
    setSaveErrors,
  })

  // Warn the user when their health crosses to non-positive and suggest
  // marking the character as dead.
  useWarnDeath({ form, character, onKill })

  // Form `onFinish` save to store, delete from store, and JSON export download.
  const { onSave, onExport, onDelete } = useCharacterSheetMainActions({
    form,
    character,
    onSaved,
    setSaveErrors,
  })

  // Layout page-cover biome follows map position even when the active tab is not the map.
  const watchedMap = Form.useWatch('map', form)
  const bannerBiome = useMemo(
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
      bannerBiome={bannerBiome}
      title={character.name || t('characters_list.unnamed')}
      breadcrumbs={[
        { title: t('nav.home'), path: '/' },
        { title: t('nav.characters'), path: '/characters' },
        { title: character.name, path: `/characters/${character.id}/identity` },
        {
          title: t(`characters.${activeTab}.title`),
          path: undefined,
        },
      ]}
      headerActions={[
        <CopyDropdown
          key='sheet-copy'
          description={getProtectorSummary(character, t)}
          journalBrace={`{protector/${character.id}}`}
        />,
        ...(!isDead
          ? [
              <Button
                key='save'
                type='primary'
                htmlType='submit'
                form={character.id}>
                {t('common.actions.save')}
              </Button>,
            ]
          : []),
      ]}>
      <Form
        id={character.id}
        key={`${character.id}-${character.updatedAt}`}
        form={form}
        initialValues={toFormValues(character)}
        onFinish={onSave}
        disabled={isDead}
        layout='vertical'
        colon={false}
        preserve>
        <CharacterProvider
          form={form}
          onKill={onKill}
          onExport={onExport}
          onRevive={onRevive}
          onDelete={onDelete}
          isDead={isDead}>
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
                    showIcon
                    closable
                    type='warning'
                    title={t('characters.dead_readonly_title')}
                    description={t.rich(
                      'characters.dead_readonly_description',
                      {
                        gender: character.gender ?? 'indeterminate',
                        link: content => (
                          <Link href='./actions'>{content}</Link>
                        ),
                      }
                    )}
                  />
                ) : null}

                <CharacterSheetTabNav characterId={character.id} />
                <CharacterStats />
                {children}
              </Space>
            </div>
          </ConfigProvider>
        </CharacterProvider>
      </Form>
    </Layout>
  )
}
