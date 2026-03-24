'use client'

import {
  Alert,
  App,
  ConfigProvider,
  Divider,
  Form,
  Space,
  Typography,
  theme as antdTheme,
} from 'antd'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Layout } from '@/components/Layout/Layout'
import { BlockedLink } from '@/components/Navigation/BlockedLink'
import { useSettings } from '@/app/contexts/SettingsContext'
import {
  computeClockSegmentsPerHalfFromStamina,
  computeClockTotalSegmentsFromStamina,
  getDefaultPoolsForArchetype,
  randomId,
  remapClockPositionForTotalSegments,
} from '@/lib/character/model'
import { getCharacterStore } from '@/lib/character/store'
import { stringifyCharacters } from '@/lib/character/store/migrations'
import type {
  CharacterMapState,
  InventoryItem,
  JournalEntry,
  Archetype,
  Character,
  SpellEntry,
  StatPool,
} from '@/lib/character/types'
import { isCharacterDead } from '@/lib/character/lifeStatus'
import type { Gender } from '@/lib/types'
import { copy } from '@/messages/fr'
import { IdentityCard } from '@/components/CharacterSheet/IdentityCard'
import { CharacteristicsCard } from '@/components/CharacterSheet/CharacteristicsCard'
import { ClockCard } from '@/components/CharacterSheet/ClockCard'
import { MapCard } from '@/components/CharacterSheet/MapCard'
import { InventoryCard } from '@/components/CharacterSheet/InventoryCard'
import { SpellbookCard } from '@/components/CharacterSheet/SpellbookCard'
import { NotesCard } from '@/components/CharacterSheet/NotesCard'
import { Button } from '@/components/Button/Button'
import { useUnsavedChangesGuard } from '@/hooks/useUnsavedChangesGuard'
import { CharacterProvider } from '@/components/CharacterSheet/CharacterContext'
import { useCharacterLifeStatusActions } from './useCharacterLifeStatusActions'

const CHARACTER_SHEET_NIGHT_THEME = {
  algorithm: antdTheme.darkAlgorithm,
  token: {
    colorPrimary: '#5cb399',
    colorBgLayout: '#1a2420',
    colorBgContainer: '#243029',
    colorBgElevated: '#2d3b36',
    colorText: '#e8f0ed',
    colorTextSecondary: '#9eb5ac',
    colorBorder: '#3d4f47',
    colorBorderSecondary: '#3d4f47',
    borderRadius: 10,
    fontSize: 15,
    fontFamily:
      'var(--font-geist-sans), system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  components: {
    Layout: {
      bodyBg: '#1a2420',
    },
  },
}

export function CharacterSheetClient({ characterId }: { characterId: string }) {
  const { message, modal } = App.useApp()
  const store = useMemo(() => getCharacterStore(), [])
  const { settings } = useSettings()

  const [sheetState, setSheetState] = useState<{
    character: Character | null
    mode: 'saved' | 'none'
  }>({ character: null, mode: 'none' })

  // Avoid hydration mismatches by deferring localStorage/sessionStorage reads to the client.
  useEffect(() => {
    void Promise.resolve().then(() => {
      const saved = store.get(characterId)
      if (saved) {
        setSheetState({ character: saved, mode: 'saved' })
        return
      }

      setSheetState({ character: null, mode: 'none' })
    })
  }, [characterId, store])

  const character = sheetState.character
  const mode = sheetState.mode
  const isDead = character ? isCharacterDead(character) : false

  type SheetFormValues = {
    name: string
    archetype: Archetype
    gender?: Gender
    honor: number
    inspiration: number
    money: number
    health: StatPool
    courage: StatPool
    stamina: StatPool
    clock: number
    map: CharacterMapState
    inventory: InventoryItem[]
    spellbook: SpellEntry[]
    journalEntries: JournalEntry[]
  }

  const [form] = Form.useForm<SheetFormValues>()
  const [saveErrors, setSaveErrors] = useState<string[] | null>(null)

  const toFormValues = (pc: Character): SheetFormValues => ({
    name: pc.name,
    archetype: pc.archetype,
    gender: pc.gender,
    honor: pc.honor,
    inspiration: pc.inspiration,
    money: pc.money,
    health: pc.health,
    courage: pc.courage,
    stamina: pc.stamina,
    clock: pc.clock,
    map: pc.map,
    inventory: pc.inventory,
    spellbook: pc.spellbook,
    journalEntries: pc.journalEntries,
  })

  const fallbackArchetype: Archetype = 'warrior'
  const fallbackStatPool: StatPool = { current: 0, max: 0 }

  // Watch only the fields we need so UI re-renders when we add/remove items.
  const watchedArchetypeRaw = Form.useWatch('archetype', form) as
    | Archetype
    | undefined
  const watchedStaminaRaw = Form.useWatch('stamina', form) as
    | StatPool
    | undefined
  const watchedClockRaw = Form.useWatch('clock', form) as number | undefined
  const watchedHealthRaw = Form.useWatch('health', form) as StatPool | undefined
  const watchedCourageRaw = Form.useWatch('courage', form) as
    | StatPool
    | undefined

  const watchedArchetype =
    watchedArchetypeRaw ?? character?.archetype ?? fallbackArchetype
  const watchedStamina =
    watchedStaminaRaw ?? character?.stamina ?? fallbackStatPool
  const watchedClock = watchedClockRaw ?? character?.clock ?? 0
  const watchedHealth =
    watchedHealthRaw ?? character?.health ?? fallbackStatPool
  const watchedCourage =
    watchedCourageRaw ?? character?.courage ?? fallbackStatPool

  const inventoryCap = Math.max(0, watchedStamina?.current ?? 0) * 6
  const inventoryLimit = Math.min(30, inventoryCap)
  const clockTotalSegments = computeClockTotalSegmentsFromStamina(
    watchedStamina.current
  )
  const clockSegmentsPerHalf = computeClockSegmentsPerHalfFromStamina(
    watchedStamina.current
  )
  const clockPositionForPhase = Math.min(
    Math.max(0, Math.trunc(watchedClock)),
    Math.max(0, clockTotalSegments - 1)
  )
  const isClockNight = clockPositionForPhase >= clockSegmentsPerHalf
  const sheetDarkWithClockNightEnabled = settings.sheet.adaptiveNightMode
  const characterSheetNightMode = isClockNight && sheetDarkWithClockNightEnabled

  const prevArchetypeRef = useRef<Archetype | null>(null)
  const prevClockTotalSegmentsRef = useRef<number | null>(null)
  const deathSuggestionNotificationKeyRef = useRef(
    `death-suggestion-${characterId}`
  )

  const sheetCharacterId = character?.id
  const characterArchetype = character?.archetype

  const healthCurrent = watchedHealth?.current
  const healthMax = watchedHealth?.max
  const courageCurrent = watchedCourage?.current
  const courageMax = watchedCourage?.max
  const staminaCurrent = watchedStamina?.current
  const staminaMax = watchedStamina?.max

  useEffect(() => {
    if (!characterArchetype) return
    prevArchetypeRef.current = characterArchetype
  }, [characterArchetype, sheetCharacterId])

  useEffect(() => {
    if (!sheetCharacterId) return
    if (prevArchetypeRef.current === null) return
    if (prevArchetypeRef.current === watchedArchetype) return

    const pools = getDefaultPoolsForArchetype(watchedArchetype)
    form.setFieldsValue({
      health: pools.health,
      courage: pools.courage,
      stamina: pools.stamina,
    })
    prevArchetypeRef.current = watchedArchetype
  }, [watchedArchetype, sheetCharacterId, form])

  useEffect(() => {
    if (!sheetCharacterId) return
    const staminaCurrent = form.getFieldValue(['stamina', 'current']) as
      | number
      | undefined
    prevClockTotalSegmentsRef.current = computeClockTotalSegmentsFromStamina(
      staminaCurrent ?? 0
    )
  }, [sheetCharacterId, form])

  useEffect(() => {
    if (!sheetCharacterId) return
    const previous = prevClockTotalSegmentsRef.current
    if (previous === null) {
      prevClockTotalSegmentsRef.current = clockTotalSegments
      return
    }
    if (previous === clockTotalSegments) return
    const remapped = remapClockPositionForTotalSegments(
      watchedClock,
      previous,
      clockTotalSegments
    )
    form.setFieldValue('clock', remapped)
    prevClockTotalSegmentsRef.current = clockTotalSegments
  }, [sheetCharacterId, clockTotalSegments, watchedClock, form])

  useEffect(() => {
    if (healthCurrent == null || healthMax == null) return
    if (healthCurrent <= healthMax) return
    form.setFieldValue(['health', 'current'], healthMax)
  }, [healthCurrent, healthMax, form])

  useEffect(() => {
    if (courageCurrent == null || courageMax == null) return
    if (courageCurrent <= courageMax) return
    form.setFieldValue(['courage', 'current'], courageMax)
  }, [courageCurrent, courageMax, form])

  useEffect(() => {
    if (staminaCurrent == null || staminaMax == null) return
    if (staminaCurrent <= staminaMax) return
    form.setFieldValue(['stamina', 'current'], staminaMax)
  }, [staminaCurrent, staminaMax, form])

  const isFormDirty = useCallback(() => form.isFieldsTouched(), [form])
  const confirmUnsavedLeave = useCallback(
    ({ onLeave, onStay }: { onLeave: () => void; onStay: () => void }) => {
      modal.confirm({
        title: copy.characters.unsavedChangesTitle,
        content: copy.characters.unsavedChangesDescription,
        okText: copy.characters.unsavedChangesLeave,
        cancelText: copy.characters.unsavedChangesStay,
        onOk: onLeave,
        onCancel: onStay,
      })
    },
    [modal]
  )
  useUnsavedChangesGuard({
    isDirty: isFormDirty,
    confirmLeave: confirmUnsavedLeave,
    resetToken: `${characterId}|${mode}|${character?.updatedAt ?? ''}`,
  })

  const getCurrentCharacterFromForm = useCallback((): Character => {
    if (!character) {
      throw new Error('Character not loaded')
    }
    const values = form.getFieldsValue(true) as SheetFormValues
    return { ...character, ...values }
  }, [character, form])

  const { handleMarkAsDead, handleRevive } = useCharacterLifeStatusActions({
    getCharacter: getCurrentCharacterFromForm,
    deathSuggestionNotificationKey: deathSuggestionNotificationKeyRef.current,
    healthCurrent,
    onSaved: saved => setSheetState({ character: saved, mode: 'saved' }),
    clearSaveErrors: () => setSaveErrors(null),
  })

  const handleFinish = () => {
    if (!character) return
    if (isDead) {
      message.warning(copy.characters.deadReadonlyDescription)
      return
    }
    setSaveErrors(null)

    try {
      const saved = store.save(getCurrentCharacterFromForm())
      setSaveErrors(null)
      setSheetState({ character: saved, mode: 'saved' })
      message.success(copy.characters.saveSuccess)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      const parts = msg
        .split(';')
        .map(part => part.trim())
        .filter(Boolean)
      setSaveErrors(parts.length ? parts : [msg])
      message.error(msg)
    }
  }

  const handleExportCharacter = async () => {
    if (!character) return
    const formValues = form.getFieldsValue(true)
    const payload: Character = {
      ...character,
      ...formValues,
    }
    const content = stringifyCharacters([payload])
    try {
      await navigator.clipboard.writeText(content)
      message.success(copy.characters.exportCopied)
    } catch {
      message.error(copy.characters.exportCopyError)
    }
  }

  if (!character) {
    return (
      <Layout
        title={copy.characters.sheetTitle}
        description={copy.characters.sheetDescription}
        breadcrumbs={[
          { label: copy.nav.homeLink, href: '/' },
          { label: copy.characters.pageTitle, href: '/characters' },
        ]}>
        <Alert
          type='warning'
          title={copy.characters.notFoundTitle}
          description={
            <Space orientation='vertical'>
              <Typography.Text>
                {copy.characters.notFoundDescription}
              </Typography.Text>
              <BlockedLink href='/characters'>
                {copy.characters.backToLibrary}
              </BlockedLink>
            </Space>
          }
        />
      </Layout>
    )
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
        key={`${character.id}-${mode}-${character.updatedAt}`}
        form={form}
        initialValues={toFormValues(character)}
        onFinish={handleFinish}
        disabled={isDead}
        layout='vertical'
        colon={false}>
        <CharacterProvider form={form}>
          <ConfigProvider
            theme={
              characterSheetNightMode ? CHARACTER_SHEET_NIGHT_THEME : undefined
            }>
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
                  <Button onClick={handleExportCharacter}>
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
          <Button onClick={handleExportCharacter}>
            {copy.characters.exportOne}
          </Button>
        </Space>
      )}
    </Layout>
  )
}
