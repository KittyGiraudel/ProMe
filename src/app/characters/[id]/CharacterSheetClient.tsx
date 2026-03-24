'use client'

import {
  Alert,
  App,
  Button,
  ConfigProvider,
  Divider,
  Form,
  Space,
  Typography,
  theme as antdTheme,
} from 'antd'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Layout } from '@/components/Layout/Layout'
import { BlockedLink } from '@/components/Navigation/BlockedLink'
import { useNavigationBlocker } from '@/app/contexts/NavigationBlockerContext'
import { useSettings } from '@/app/contexts/SettingsContext'
import {
  computeClockSegmentsPerHalfFromStamina,
  computeClockTotalSegmentsFromStamina,
  getDefaultPoolsForArchetype,
  randomId,
  remapClockPositionForTotalSegments,
} from '@/lib/character/model'
import { loadDraft, clearDraft } from '@/lib/character/draftStorage'
import { getCharacterStore } from '@/lib/character/store'
import { stringifyCharacters } from '@/lib/character/store/migrations'
import type {
  CharacterClock,
  CharacterMapState,
  InventoryItem,
  Archetype,
  Character,
  SpellEntry,
  StatPool,
} from '@/lib/character/types'
import type { Gender } from '@/lib/types'
import { copy } from '@/messages/fr'
import { IdentityCard } from '@/components/CharacterSheet/IdentityCard'
import { CharacteristicsCard } from '@/components/CharacterSheet/CharacteristicsCard'
import { ClockCard } from '@/components/CharacterSheet/ClockCard'
import { MapCard } from '@/components/CharacterSheet/MapCard'
import { MapFormValueAnchor } from '@/components/CharacterSheet/MapFormValueAnchor'
import { InventoryCard } from '@/components/CharacterSheet/InventoryCard'
import { SpellbookCard } from '@/components/CharacterSheet/SpellbookCard'
import { NotesCard } from '@/components/CharacterSheet/NotesCard'

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
  const router = useRouter()
  const { setHandler } = useNavigationBlocker()
  const { settings } = useSettings()

  const [sheetState, setSheetState] = useState<{
    character: Character | null
    mode: 'draft' | 'saved' | 'none'
  }>({ character: null, mode: 'none' })

  // Avoid hydration mismatches by deferring localStorage/sessionStorage reads to the client.
  useEffect(() => {
    void Promise.resolve().then(() => {
      const saved = store.get(characterId)
      if (saved) {
        setSheetState({ character: saved, mode: 'saved' })
        return
      }

      const draft = loadDraft(characterId)
      if (draft) {
        setSheetState({ character: draft, mode: 'draft' })
        return
      }

      setSheetState({ character: null, mode: 'none' })
    })
  }, [characterId, store])

  const character = sheetState.character
  const mode = sheetState.mode

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
    clock: CharacterClock
    map: CharacterMapState
    inventory: InventoryItem[]
    spellbook: SpellEntry[]
    notes: string
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
    clock: {
      position: pc.clock.position,
    },
    map: pc.map,
    inventory: pc.inventory,
    spellbook: pc.spellbook,
    notes: pc.notes,
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
  const watchedClockRaw = Form.useWatch('clock', form) as
    | CharacterClock
    | undefined
  const watchedHealthRaw = Form.useWatch('health', form) as StatPool | undefined
  const watchedCourageRaw = Form.useWatch('courage', form) as
    | StatPool
    | undefined

  const watchedArchetype =
    watchedArchetypeRaw ?? character?.archetype ?? fallbackArchetype
  const watchedStamina =
    watchedStaminaRaw ?? character?.stamina ?? fallbackStatPool
  const watchedClock = watchedClockRaw ?? character?.clock ?? { position: 0 }
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
    Math.max(0, Math.trunc(watchedClock.position ?? 0)),
    Math.max(0, clockTotalSegments - 1)
  )
  const isClockNight = clockPositionForPhase >= clockSegmentsPerHalf
  const sheetDarkWithClockNightEnabled = settings.sheet.adaptiveNightMode
  const characterSheetNightMode =
    isClockNight && sheetDarkWithClockNightEnabled && mode === 'saved'

  const prevArchetypeRef = useRef<Archetype | null>(null)
  const prevClockTotalSegmentsRef = useRef<number | null>(null)
  const leaveConfirmingRef = useRef(false)
  const interceptionReadyRef = useRef(false)
  const stableUrlRef = useRef<string>('')

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
      watchedClock.position,
      previous,
      clockTotalSegments
    )
    form.setFieldValue(['clock', 'position'], remapped)
    prevClockTotalSegmentsRef.current = clockTotalSegments
  }, [sheetCharacterId, clockTotalSegments, watchedClock.position, form])

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

  const attemptLeave = useCallback(
    (onLeave: () => void, onStay?: () => void) => {
      const hasUnsavedChanges =
        interceptionReadyRef.current && form.isFieldsTouched()
      if (!hasUnsavedChanges) {
        onLeave()
        return
      }

      if (leaveConfirmingRef.current) return
      leaveConfirmingRef.current = true

      modal.confirm({
        title: copy.characters.unsavedChangesTitle,
        content: copy.characters.unsavedChangesDescription,
        okText: copy.characters.unsavedChangesLeave,
        cancelText: copy.characters.unsavedChangesStay,
        onOk: () => {
          leaveConfirmingRef.current = false
          onLeave()
        },
        onCancel: () => {
          leaveConfirmingRef.current = false
          onStay?.()
        },
      })
    },
    [form, modal]
  )

  useEffect(() => {
    setHandler(() => (navigate: () => void) => {
      attemptLeave(navigate)
    })
    return () => setHandler(null)
  }, [attemptLeave, setHandler])

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!interceptionReadyRef.current) return
      if (!form.isFieldsTouched()) return
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [form])

  // Mark when the form is "settled" so we don't prompt during initial hydration/setup.
  useEffect(() => {
    interceptionReadyRef.current = false
    leaveConfirmingRef.current = false
    stableUrlRef.current =
      window.location.pathname + window.location.search + window.location.hash
    const t = window.setTimeout(() => {
      interceptionReadyRef.current = true
    }, 0)
    return () => window.clearTimeout(t)
  }, [characterId, mode, character?.updatedAt])

  useEffect(() => {
    const onPopState = () => {
      if (!interceptionReadyRef.current) return
      if (!form.isFieldsTouched()) return
      if (leaveConfirmingRef.current) return

      attemptLeave(
        () => {
          // Navigation already happened; if user confirms we do nothing.
        },
        () => {
          // Navigation was cancelled; revert URL back.
          history.pushState(null, '', stableUrlRef.current)
        }
      )
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [form, attemptLeave])

  const handleCancel = () => {
    if (mode !== 'draft') return
    attemptLeave(() => {
      clearDraft(characterId)
      router.push('/characters')
    })
  }

  const handleFinish = (values: SheetFormValues) => {
    if (!character) return
    setSaveErrors(null)

    try {
      const archetype =
        mode === 'saved' ? character.archetype : values.archetype

      const payload: Character = {
        ...character,
        ...values,
        archetype,
      }

      const saved = store.save(payload)
      if (mode === 'draft') clearDraft(character.id)
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

  if (mode === 'draft') {
    return (
      <Layout
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
          layout='vertical'
          colon={false}>
          <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
            {saveErrors ? (
              <Alert type='error' title={saveErrors.join('; ')} />
            ) : null}
            <IdentityCard isArchetypeReadonly={false} />
            <Space wrap>
              <Button htmlType='button' onClick={handleCancel}>
                {copy.characters.cancel}
              </Button>
              <Button type='primary' htmlType='submit'>
                {copy.characters.save}
              </Button>
            </Space>
          </Space>
        </Form>
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
        layout='vertical'
        colon={false}>
        <ConfigProvider
          theme={
            characterSheetNightMode ? CHARACTER_SHEET_NIGHT_THEME : undefined
          }>
          <div data-sheet-night={characterSheetNightMode ? 'true' : undefined}>
            <Space
              orientation='vertical'
              size='middle'
              style={{ width: '100%' }}>
              {saveErrors ? (
                <Alert type='error' title={saveErrors.join('; ')} />
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
                    onAddItem={() =>
                      add({
                        id: randomId(),
                        label: '',
                        quantity: 1,
                        note: '',
                      })
                    }
                    onRemoveItem={remove}
                  />
                )}
              </Form.List>
              <Form.List name='spellbook'>
                {(fields, { add, remove }) => (
                  <SpellbookCard
                    fields={fields}
                    onAddSpell={() =>
                      add({
                        id: randomId(),
                        name: '',
                        note: '',
                      })
                    }
                    onRemoveSpell={remove}
                  />
                )}
              </Form.List>
              <NotesCard />
            </Space>

            <Divider />

            <Space wrap>
              <Button type='primary' htmlType='submit'>
                {copy.characters.save}
              </Button>
              <Button onClick={handleExportCharacter}>
                {copy.characters.exportOne}
              </Button>
            </Space>
          </div>
        </ConfigProvider>
      </Form>
    </Layout>
  )
}
