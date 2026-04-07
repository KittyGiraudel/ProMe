'use client'

import { Alert, App, ConfigProvider, Form } from 'antd'
import { useTranslations } from 'next-intl'
import { type ReactNode } from 'react'
import { Button } from '@/components/Button/Button'
import { CharacterProvider } from '@/components/CharacterContext/CharacterContext'
import { CharacterSheetEmptyState } from '@/components/CharacterSheetEmptyState/CharacterSheetEmptyState'
import { CharacterSheetTabNav } from '@/components/CharacterSheetTabNav/CharacterSheetTabNav'
import { CharacterSheetValidationErrors } from '@/components/CharacterSheetValidationErrors/CharacterSheetValidationErrors'
import { CharacterStats } from '@/components/CharacterStats/CharacterStats'
import { CopyDropdown } from '@/components/CopyDropdown/CopyDropdown'
import { Layout } from '@/components/Layout/Layout'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { SettingsHint } from '@/components/SettingsHint/SettingsHint'
import { Spacing } from '@/components/Spacing/Spacing'
import { useBiomeAtCurrentMapPosition } from '@/hooks/useBiomeAtCurrentMapPosition'
import { useCharacterLink } from '@/hooks/useCharacterLink'
import { useCharacterSheetDocumentTitle } from '@/hooks/useCharacterSheetDocumentTitle'
import { useCharacterSheetForm } from '@/hooks/useCharacterSheetForm'
import { useCharacterSheetTheme } from '@/hooks/useCharacterSheetTheme'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useOnFieldsChanged } from '@/hooks/useOnFieldsChanged'
import { Link } from '@/i18n/navigation'
import { getProtectorSummary } from '@/lib/character/getProtectorSummary'
import { isCharacterDead } from '@/lib/character/lifeStatus'
import { toFormValues } from '@/lib/character/toFormValues'
import { AudioCard } from '../AudioCard/AudioCard'

export function CharacterSheetShell({
  characterId,
  children,
}: {
  characterId: string
  children: ReactNode
}) {
  const t = useTranslations()

  // Ant Design form + character from client store; unsaved-navigation guard;
  // merge form → Character for save/export; `saveForm` refreshes local character
  // state after persistence.
  const {
    activeTab,
    form,
    character,
    hydratedFromStore,
    saveForm,
    validationErrors,
  } = useCharacterSheetForm({ characterId })
  const onFieldsChange = useOnFieldsChanged(form)

  // Watches clock/stamina (preserve-aware) to drive adaptive sheet appearance
  // chrome and Ant Design theme.
  const { theme, appearance } = useCharacterSheetTheme(form)

  const { settings } = useSettings()
  const bannerBiome = useBiomeAtCurrentMapPosition(form)
  const getCharacterLink = useCharacterLink()
  const isDead = character ? isCharacterDead(character) : false

  // `generateMetadata` can’t see store-backed names; this sets `document.title`
  // after hydration (+ tab suffix).
  useCharacterSheetDocumentTitle({ character })

  // Enable full page shortcuts like cmd+S to save.
  useKeyboardShortcuts({ form, isDead })

  if (!character) {
    return <CharacterSheetEmptyState loading={!hydratedFromStore} />
  }

  // This `ConfigProvider` component is used to override the global theme for
  // the sheet when the adaptive appearance is enabled. The `App` component is
  // needed for the Ant Design notifications to adjust to this theme provider.
  return (
    <ConfigProvider theme={theme}>
      <App>
        <Layout
          appearance={appearance}
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
            onFieldsChange={onFieldsChange}
            scrollToFirstError
            initialValues={toFormValues(character)}
            onFinish={_values => {
              // We need *not* to pass the received values to our `saveForm`
              // function because:
              // 1. They do not contain journal entries since these entries are only
              //    registered when the edit modal is open.
              // 2. Our `saveForm` function already calls `getCharacterFromForm()`
              //    to get the correct values.
              saveForm()
            }}
            disabled={isDead}
            layout='vertical'
            colon={false}
            preserve>
            <CharacterSheetValidationErrors errors={validationErrors} />
            <CharacterProvider isDead={isDead} saveForm={saveForm}>
              <Spacing size='large'>
                {isDead ? (
                  <Alert
                    showIcon
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
                <AudioCard biome={bannerBiome} />
                {settings.sheet.singlePageMode && !isDead && (
                  <SettingsHint hintId='sheet' />
                )}
              </Spacing>
            </CharacterProvider>
          </Form>
        </Layout>
      </App>
    </ConfigProvider>
  )
}
