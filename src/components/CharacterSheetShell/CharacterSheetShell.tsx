'use client'

import { Alert, ConfigProvider, Form } from 'antd'
import { useTranslations } from 'next-intl'
import { type ReactNode, useMemo } from 'react'
import { Button } from '@/components/Button/Button'
import { CharacterProvider } from '@/components/CharacterContext/CharacterContext'
import { CharacterSheetEmptyState } from '@/components/CharacterSheetEmptyState/CharacterSheetEmptyState'
import { CharacterSheetTabNav } from '@/components/CharacterSheetTabNav/CharacterSheetTabNav'
import { CharacterStats } from '@/components/CharacterStats/CharacterStats'
import { CopyDropdown } from '@/components/CopyDropdown/CopyDropdown'
import { Layout } from '@/components/Layout/Layout'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { SettingsHint } from '@/components/SettingsHint/SettingsHint'
import { Spacing } from '@/components/Spacing/Spacing'
import { toFormValues } from '@/hooks/useCharacterFromForm'
import { useCharacterLink } from '@/hooks/useCharacterLink'
import { useWatchedMap } from '@/hooks/useCharacterSheetDerived'
import { useCharacterSheetDocumentTitle } from '@/hooks/useCharacterSheetDocumentTitle'
import { useCharacterSheetForm } from '@/hooks/useCharacterSheetForm'
import { useCharacterSheetTheme } from '@/hooks/useCharacterSheetTheme'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { Link } from '@/i18n/navigation'
import { biomeAtCurrentMapPosition } from '@/lib/character/biomeAtCurrentMapPosition'
import { getProtectorSummary } from '@/lib/character/getProtectorSummary'
import { isCharacterDead } from '@/lib/character/lifeStatus'

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
  const { activeTab, form, character, hydratedFromStore, saveForm } =
    useCharacterSheetForm({ characterId })

  // Watches clock/stamina (preserve-aware) to drive adaptive sheet “night”
  // chrome and Ant Design theme.
  const { characterSheetNightMode, configTheme } = useCharacterSheetTheme({
    form,
  })

  // `generateMetadata` can’t see store-backed names; this sets `document.title`
  // after hydration (+ tab suffix).
  useCharacterSheetDocumentTitle({ character })

  const { settings } = useSettings()

  // Layout page-cover biome follows map position even when the active tab is not the map.
  // @TODO: consider whether we can use `getCellState` instead
  const map = useWatchedMap(form)
  const bannerBiome = useMemo(() => biomeAtCurrentMapPosition(map), [map])

  const getCharacterLink = useCharacterLink()
  const isDead = character ? isCharacterDead(character) : false

  useKeyboardShortcuts({ form, isDead })

  if (!character) {
    return <CharacterSheetEmptyState loading={!hydratedFromStore} />
  }

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
        onFinish={saveForm}
        disabled={isDead}
        layout='vertical'
        colon={false}
        preserve>
        <CharacterProvider
          form={form}
          character={character}
          saveForm={saveForm}
          isDead={isDead}>
          <ConfigProvider theme={configTheme}>
            <div
              data-sheet-night={characterSheetNightMode ? 'true' : undefined}>
              <Spacing>
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
                {settings.sheet.singlePageMode && !isDead && (
                  <SettingsHint hintId='sheet' />
                )}
              </Spacing>
            </div>
          </ConfigProvider>
        </CharacterProvider>
      </Form>
    </Layout>
  )
}
