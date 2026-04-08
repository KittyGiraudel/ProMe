'use client'

import { Alert, App, Col, ConfigProvider, Form, Row } from 'antd'
import { useTranslations } from 'next-intl'
import { ActionsCard } from '@/components/ActionsCard/ActionsCard'
import { AudioCard } from '@/components/AudioCard/AudioCard'
import { Button } from '@/components/Button/Button'
import { CardDraw } from '@/components/CardDraw/CardDraw'
import { CharacteristicsCard } from '@/components/CharacteristicsCard/CharacteristicsCard'
import { CharacterSheetEmptyState } from '@/components/CharacterSheetEmptyState/CharacterSheetEmptyState'
import { CharacterSheetValidationErrors } from '@/components/CharacterSheetValidationErrors/CharacterSheetValidationErrors'
import { CharacterStats } from '@/components/CharacterStats/CharacterStats'
import { ClockCard } from '@/components/ClockCard/ClockCard'
import { CopyDropdown } from '@/components/CopyDropdown/CopyDropdown'
import { DiceRoll } from '@/components/DiceRoll/DiceRoll'
import { IdentityCard } from '@/components/IdentityCard/IdentityCard'
import { InventoryCard } from '@/components/InventoryCard/InventoryCard'
import { JournalCard } from '@/components/JournalCard/JournalCard'
import { Layout } from '@/components/Layout/Layout'
import { MapCard } from '@/components/MapCard/MapCard'
import { Spacing } from '@/components/Spacing/Spacing'
import { SpellbookCard } from '@/components/SpellbookCard/SpellbookCard'
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

export function CharacterSheet({ characterId }: { characterId: string }) {
  const t = useTranslations()
  const { form, character, hydratedFromStore, saveForm, validationErrors } =
    useCharacterSheetForm({ characterId })
  const onFieldsChange = useOnFieldsChanged(form)
  const { theme, appearance } = useCharacterSheetTheme(form)
  const bannerBiome = useBiomeAtCurrentMapPosition(form)
  const getCharacterLink = useCharacterLink()
  const isDead = character ? isCharacterDead(character) : false

  useCharacterSheetDocumentTitle({ character })
  useKeyboardShortcuts({ form, isDead })

  if (!character) {
    return <CharacterSheetEmptyState loading={!hydratedFromStore} />
  }

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
            { title: character.name, path: undefined },
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
            onFinish={() => {
              // Do NOT pass the received values to saveForm: journal entries
              // are not registered when the edit modal is closed, and saveForm
              // calls getCharacterFromForm() internally for correct values.
              saveForm()
            }}
            disabled={isDead}
            layout='vertical'
            colon={false}
            preserve>
            <Spacing size='large'>
              <CharacterSheetValidationErrors errors={validationErrors} />
              {isDead ? (
                <Alert
                  showIcon
                  type='warning'
                  title={t('characters.dead_readonly_title')}
                  description={t.rich('characters.dead_readonly_description', {
                    gender: character.gender ?? 'indeterminate',
                    link: content => (
                      <Link href={getCharacterLink({ tabId: 'actions' })}>
                        {content}
                      </Link>
                    ),
                  })}
                />
              ) : null}
              <CharacterStats />
              <IdentityCard isArchetypeReadonly />
              <CharacteristicsCard isDead={isDead} saveForm={saveForm} />
              <MapCard isDead={isDead} />
              <ClockCard />
              <JournalCard isDead={isDead} />
              <InventoryCard />
              <SpellbookCard />
              <Row gutter={[16, 16]} id='tools'>
                <Col xs={24} md={12}>
                  <DiceRoll />
                </Col>
                <Col xs={24} md={12}>
                  <CardDraw />
                </Col>
              </Row>
              <ActionsCard isDead={isDead} saveForm={saveForm} />
              <AudioCard biome={bannerBiome} />
            </Spacing>
          </Form>
        </Layout>
      </App>
    </ConfigProvider>
  )
}
