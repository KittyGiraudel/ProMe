'use client'

import { Alert, ConfigProvider, Form, Space } from 'antd'
import { useTranslations } from 'next-intl'
import { type ReactNode, useMemo } from 'react'
import { Button } from '@/components/Button/Button'
import { CopyDropdown } from '@/components/CopyDropdown/CopyDropdown'
import { Layout } from '@/components/Layout/Layout'
import { CharacterProvider } from '@/components/PageCharacterSheet/CharacterContext'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { SettingsHint } from '@/components/SettingsHint/SettingsHint'
import { Link } from '@/i18n/navigation'
import { biomeAtCurrentMapPosition } from '@/lib/character/biomeAtCurrentMapPosition'
import { getProtectorSummary } from '@/lib/character/getProtectorSummary'
import { isCharacterDead } from '@/lib/character/lifeStatus'
import { CharacterStats } from '../CharacterStats/CharacterStats'
import { CharacterSheetEmptyState } from './CharacterSheetEmptyState'
import { CharacterSheetTabNav } from './CharacterSheetTabNav'
import { toFormValues } from './characterSheetForm'
import {
  useCharacterLifeStatusActions,
  useWarnDeath,
} from './useCharacterLifeStatusActions'
import { useCharacterLink } from './useCharacterLink'
import { useCharacterSheetDocumentTitle } from './useCharacterSheetDocumentTitle'
import { useCharacterSheetForm } from './useCharacterSheetForm'
import { useCharacterSheetFormSync } from './useCharacterSheetFormSync'
import { useCharacterSheetMainActions } from './useCharacterSheetMainActions'
import { useCharacterSheetTheme } from './useCharacterSheetTheme'

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

  const { settings } = useSettings()

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

  const getCharacterLink = useCharacterLink()

  if (!character) {
    return <CharacterSheetEmptyState loading={!hydratedFromStore} />
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
        ...(settings.sheet.singlePageMode
          ? [{ title: character.name, path: undefined }]
          : [
              {
                title: character.name,
                path: getCharacterLink({ tabId: 'identity' }),
              },
              {
                title: t(`characters.${activeTab}.title`),
                path: undefined,
              },
            ]),
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
                          <Link href={getCharacterLink({ tabId: 'actions' })}>
                            {content}
                          </Link>
                        ),
                      }
                    )}
                  />
                ) : null}

                <CharacterSheetTabNav />
                <CharacterStats />
                {children}
                {settings.sheet.singlePageMode && (
                  <SettingsHint hintId='sheet' />
                )}
              </Space>
            </div>
          </ConfigProvider>
        </CharacterProvider>
      </Form>
    </Layout>
  )
}
