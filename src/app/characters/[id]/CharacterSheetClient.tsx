'use client'

import { Alert, App, Button, Divider, Form, Space, Typography } from 'antd'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { GeneratorPageShell } from '@/components/GeneratorPageShell/GeneratorPageShell'
import { getDefaultPoolsForArchetype } from '@/lib/playerCharacter/model'
import { loadDraft, clearDraft } from '@/lib/playerCharacter/draftStorage'
import { getCharacterStore } from '@/lib/playerCharacter/store'
import type {
  InventoryItem,
  PlayerArchetype,
  PlayerCharacter,
  SpellEntry,
  StatPool,
} from '@/lib/playerCharacter/types'
import type { Gender } from '@/lib/types'
import { copy } from '@/messages/fr'
import { IdentityCard } from '@/components/CharacterSheet/IdentityCard'
import { CharacteristicsCard } from '@/components/CharacterSheet/CharacteristicsCard'
import { InventoryCard } from '@/components/CharacterSheet/InventoryCard'
import { SpellbookCard } from '@/components/CharacterSheet/SpellbookCard'
import { NotesCard } from '@/components/CharacterSheet/NotesCard'

export function CharacterSheetClient({ characterId }: { characterId: string }) {
  const { message } = App.useApp()
  const store = useMemo(() => getCharacterStore(), [])
  const router = useRouter()

  const [sheetState, setSheetState] = useState<{
    character: PlayerCharacter | null
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
    archetype: PlayerArchetype
    gender?: Gender
    honneur: number
    inspiration: number
    pieces: number
    ame: StatPool
    courage: StatPool
    endurance: StatPool
    inventory: InventoryItem[]
    spellbook: SpellEntry[]
    notes: string
  }

  const [form] = Form.useForm<SheetFormValues>()
  const [saveErrors, setSaveErrors] = useState<string[] | null>(null)

  const toFormValues = (pc: PlayerCharacter): SheetFormValues => ({
    name: pc.name,
    archetype: pc.archetype,
    gender: pc.gender,
    honneur: pc.honneur,
    inspiration: pc.inspiration,
    pieces: pc.pieces,
    ame: pc.ame,
    courage: pc.courage,
    endurance: pc.endurance,
    inventory: pc.inventory,
    spellbook: pc.spellbook,
    notes: pc.notes,
  })

  const fallbackArchetype: PlayerArchetype = 'guerrier'
  const fallbackStatPool: StatPool = { current: 0, max: 0 }

  // Watch only the fields we need so UI re-renders when we add/remove items.
  const watchedArchetypeRaw = Form.useWatch('archetype', form) as
    | PlayerArchetype
    | undefined
  const watchedEnduranceRaw = Form.useWatch('endurance', form) as
    | StatPool
    | undefined
  const watchedAmeRaw = Form.useWatch('ame', form) as StatPool | undefined
  const watchedCourageRaw = Form.useWatch('courage', form) as
    | StatPool
    | undefined

  const watchedArchetype =
    watchedArchetypeRaw ?? character?.archetype ?? fallbackArchetype
  const watchedEndurance =
    watchedEnduranceRaw ?? character?.endurance ?? fallbackStatPool
  const watchedAme = watchedAmeRaw ?? character?.ame ?? fallbackStatPool
  const watchedCourage =
    watchedCourageRaw ?? character?.courage ?? fallbackStatPool

  const inventoryCap = Math.max(0, watchedEndurance?.current ?? 0) * 6
  const inventoryLimit = Math.min(30, inventoryCap)

  const prevArchetypeRef = useRef<PlayerArchetype | null>(null)

  const sheetCharacterId = character?.id
  const characterArchetype = character?.archetype

  const ameCurrent = watchedAme?.current
  const ameMax = watchedAme?.max
  const courageCurrent = watchedCourage?.current
  const courageMax = watchedCourage?.max
  const enduranceCurrent = watchedEndurance?.current
  const enduranceMax = watchedEndurance?.max

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
      ame: pools.ame,
      courage: pools.courage,
      endurance: pools.endurance,
    })
    prevArchetypeRef.current = watchedArchetype
  }, [watchedArchetype, sheetCharacterId, form])

  useEffect(() => {
    if (ameCurrent == null || ameMax == null) return
    if (ameCurrent <= ameMax) return
    form.setFieldValue(['ame', 'current'], ameMax)
  }, [ameCurrent, ameMax, form])

  useEffect(() => {
    if (courageCurrent == null || courageMax == null) return
    if (courageCurrent <= courageMax) return
    form.setFieldValue(['courage', 'current'], courageMax)
  }, [courageCurrent, courageMax, form])

  useEffect(() => {
    if (enduranceCurrent == null || enduranceMax == null) return
    if (enduranceCurrent <= enduranceMax) return
    form.setFieldValue(['endurance', 'current'], enduranceMax)
  }, [enduranceCurrent, enduranceMax, form])

  const handleCancel = () => {
    if (mode !== 'draft') return
    clearDraft(characterId)
    router.push('/characters')
  }

  const handleFinish = (values: SheetFormValues) => {
    if (!character) return
    setSaveErrors(null)

    try {
      const payload: PlayerCharacter = {
        ...character,
        ...values,
      }

      const saved = store.save(payload)
      if (mode === 'draft') clearDraft(character.id)
      setSaveErrors(null)
      setSheetState({ character: saved, mode: 'saved' })
      message.success(copy.playerCharacters.saveSuccess)
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

  if (!character) {
    return (
      <GeneratorPageShell
        title={copy.playerCharacters.sheetTitle}
        description={copy.playerCharacters.sheetDescription}
        backHref='/characters'
        backLabel={copy.playerCharacters.backToLibrary}>
        <Alert
          type='warning'
          title={copy.playerCharacters.notFoundTitle}
          description={
            <Space orientation='vertical'>
              <Typography.Text>
                {copy.playerCharacters.notFoundDescription}
              </Typography.Text>
              <Link href='/characters'>
                {copy.playerCharacters.backToLibrary}
              </Link>
            </Space>
          }
        />
      </GeneratorPageShell>
    )
  }

  if (mode === 'draft') {
    return (
      <GeneratorPageShell
        title={character.name || copy.playerCharacters.unnamed}
        description={copy.playerCharacters.sheetDescription}>
        <Form
          key={`${character.id}-${mode}`}
          form={form}
          initialValues={toFormValues(character)}
          onFinish={handleFinish}
          layout='vertical'
          colon={false}>
          <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
            {saveErrors ? (
              <Alert type='error' title={saveErrors.join('; ')} />
            ) : null}
            <IdentityCard />
            <Space wrap>
              <Button htmlType='button' onClick={handleCancel}>
                {copy.playerCharacters.cancel}
              </Button>
              <Button type='primary' htmlType='submit'>
                {copy.playerCharacters.save}
              </Button>
            </Space>
          </Space>
        </Form>
      </GeneratorPageShell>
    )
  }

  return (
    <GeneratorPageShell
      title={character.name || copy.playerCharacters.unnamed}
      description={copy.playerCharacters.sheetDescription}
      backHref='/characters'
      backLabel={copy.playerCharacters.backToLibrary}>
      <Form
        key={`${character.id}-${mode}`}
        form={form}
        initialValues={toFormValues(character)}
        onFinish={handleFinish}
        layout='vertical'
        colon={false}>
        <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
          {saveErrors ? (
            <Alert type='error' title={saveErrors.join('; ')} />
          ) : null}

          <IdentityCard />
          <CharacteristicsCard />
          <InventoryCard inventoryLimit={inventoryLimit} />
          <SpellbookCard />
          <NotesCard />
        </Space>

        <Divider />

        <Space wrap>
          <Button type='primary' htmlType='submit'>
            {copy.playerCharacters.save}
          </Button>
        </Space>
      </Form>
    </GeneratorPageShell>
  )
}
