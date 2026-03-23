'use client'

import {
  Alert,
  App,
  Button,
  Card,
  Divider,
  Input,
  InputNumber,
  Select,
  Space,
  Typography,
} from 'antd'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { GeneratorPageShell } from '@/components/GeneratorPageShell/GeneratorPageShell'
import {
  computeInventoryCap,
  getDefaultPoolsForArchetype,
  validatePlayerCharacterForPersistence,
} from '@/lib/playerCharacter/model'
import { loadDraft, clearDraft } from '@/lib/playerCharacter/draftStorage'
import { getCharacterStore } from '@/lib/playerCharacter/store'
import type {
  InventoryItem,
  PlayerCharacter,
  SpellEntry,
  StatPool,
} from '@/lib/playerCharacter/types'
import { GENDERS } from '@/lib/types'
import { copy } from '@/messages/fr'

function replaceAt<T>(list: T[], index: number, value: T): T[] {
  return list.map((item, idx) => (idx === index ? value : item))
}

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

  const [saveErrors, setSaveErrors] = useState<string[] | null>(null)

  const updateCharacter = (
    updater: (current: PlayerCharacter) => PlayerCharacter
  ) => {
    setSheetState(state => {
      if (!state.character) return state
      return { ...state, character: updater(state.character) }
    })
  }

  const handleSave = () => {
    if (!character) return
    const validation = validatePlayerCharacterForPersistence(character)
    if (!validation.ok) {
      setSaveErrors(validation.errors)
      message.error(validation.errors.join('; '))
      return
    }

    try {
      const saved = store.save(character)
      if (mode === 'draft') clearDraft(character.id)
      setSaveErrors(null)
      setSheetState({ character: saved, mode: 'saved' })
      message.success(copy.playerCharacters.saveSuccess)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      setSaveErrors([msg])
      message.error(msg)
    }
  }

  const handleCancel = () => {
    if (mode === 'draft') {
      clearDraft(characterId)
      router.push('/characters')
      return
    }
    const saved = store.get(characterId)
    if (!saved) {
      setSheetState({ character: null, mode: 'none' })
      return
    }
    setSaveErrors(null)
    setSheetState({ character: saved, mode: 'saved' })
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
        <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
          <Card title={copy.playerCharacters.identitySection}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 16,
                width: '100%',
              }}>
              <Input
                addonBefore={copy.playerCharacters.nameLabel}
                value={character.name}
                aria-label={copy.playerCharacters.nameLabel}
                onChange={event =>
                  updateCharacter(current => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                style={{ flex: 1, minWidth: 220 }}
              />
              <Select
                value={character.archetype}
                style={{ width: 220 }}
                options={[
                  {
                    value: 'guerrier',
                    label: copy.playerCharacters.archetypes.guerrier,
                  },
                  {
                    value: 'pelerin',
                    label: copy.playerCharacters.archetypes.pelerin,
                  },
                  {
                    value: 'troubadour',
                    label: copy.playerCharacters.archetypes.troubadour,
                  },
                ]}
                aria-label={copy.playerCharacters.archetypeLabel}
                onChange={value => {
                  const pools = getDefaultPoolsForArchetype(value)
                  updateCharacter(current => ({
                    ...current,
                    archetype: value,
                    ame: pools.ame,
                    courage: pools.courage,
                    endurance: pools.endurance,
                  }))
                }}
              />
              <Select
                allowClear
                placeholder={copy.playerCharacters.genderPlaceholder}
                value={character.gender}
                style={{ width: 200 }}
                options={GENDERS.map(gender => ({
                  value: gender,
                  label: copy.genders[gender],
                }))}
                aria-label={copy.playerCharacters.genderPlaceholder}
                onChange={value =>
                  updateCharacter(current => ({
                    ...current,
                    gender: value ?? undefined,
                  }))
                }
              />
            </div>
          </Card>

          {saveErrors ? (
            <Alert type='error' title={saveErrors.join('; ')} />
          ) : null}

          <Space wrap>
            <Button onClick={handleCancel}>
              {copy.playerCharacters.cancel}
            </Button>
            <Button type='primary' onClick={handleSave}>
              {copy.playerCharacters.save}
            </Button>
          </Space>
        </Space>
      </GeneratorPageShell>
    )
  }

  const inventoryCap = computeInventoryCap(character)
  const inventoryLimit = Math.min(30, inventoryCap)
  const isOverInventoryCap = character.inventory.length > inventoryLimit

  const updatePool = (
    pool: keyof Pick<PlayerCharacter, 'ame' | 'courage' | 'endurance'>,
    nextPool: StatPool
  ) => {
    updateCharacter(current => ({ ...current, [pool]: nextPool }))
  }

  const addInventoryItem = () => {
    updateCharacter(current => ({
      ...current,
      inventory: [
        ...current.inventory,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          label: '',
          quantity: 1,
        },
      ],
    }))
  }

  const addSpell = () => {
    updateCharacter(current => ({
      ...current,
      spellbook: [
        ...current.spellbook,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: '',
        },
      ],
    }))
  }

  return (
    <GeneratorPageShell
      title={character.name || copy.playerCharacters.unnamed}
      description={copy.playerCharacters.sheetDescription}
      backHref='/characters'
      backLabel={copy.playerCharacters.backToLibrary}>
      <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
        {saveErrors ? (
          <Alert type='error' title={saveErrors.join('; ')} />
        ) : null}
        <Card title={copy.playerCharacters.identitySection}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              width: '100%',
            }}>
            <Input
              addonBefore={copy.playerCharacters.nameLabel}
              value={character.name}
              aria-label={copy.playerCharacters.nameLabel}
              onChange={event =>
                updateCharacter(current => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              style={{ flex: 1, minWidth: 220 }}
            />
            <Select
              value={character.archetype}
              style={{ width: 220 }}
              options={[
                {
                  value: 'guerrier',
                  label: copy.playerCharacters.archetypes.guerrier,
                },
                {
                  value: 'pelerin',
                  label: copy.playerCharacters.archetypes.pelerin,
                },
                {
                  value: 'troubadour',
                  label: copy.playerCharacters.archetypes.troubadour,
                },
              ]}
              aria-label={copy.playerCharacters.archetypeLabel}
              onChange={value =>
                updateCharacter(current => ({
                  ...current,
                  archetype: value,
                }))
              }
            />
            <Select
              allowClear
              placeholder={copy.playerCharacters.genderPlaceholder}
              value={character.gender}
              style={{ width: 200 }}
              options={GENDERS.map(gender => ({
                value: gender,
                label: copy.genders[gender],
              }))}
              aria-label={copy.playerCharacters.genderPlaceholder}
              onChange={value =>
                updateCharacter(current => ({
                  ...current,
                  gender: value ?? undefined,
                }))
              }
            />
          </div>
        </Card>

        <Card title={copy.playerCharacters.characteristicsSection}>
          <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
            <Space wrap>
              <InputNumber
                addonBefore={copy.playerCharacters.honneurLabel}
                value={character.honneur}
                aria-label={copy.playerCharacters.honneurLabel}
                onChange={value =>
                  updateCharacter(current => ({
                    ...current,
                    honneur: Number(value ?? 0),
                  }))
                }
              />
              <InputNumber
                addonBefore={copy.playerCharacters.inspirationLabel}
                value={character.inspiration}
                aria-label={copy.playerCharacters.inspirationLabel}
                onChange={value =>
                  updateCharacter(current => ({
                    ...current,
                    inspiration: Number(value ?? 0),
                  }))
                }
              />
              <InputNumber
                addonBefore={copy.playerCharacters.piecesLabel}
                min={0}
                value={character.pieces}
                aria-label={copy.playerCharacters.piecesLabel}
                onChange={value =>
                  updateCharacter(current => ({
                    ...current,
                    pieces: Math.max(0, Number(value ?? 0)),
                  }))
                }
              />
            </Space>

            <Divider />

            <Space
              orientation='vertical'
              size='small'
              style={{ width: '100%' }}>
              {(
                [
                  ['ame', copy.playerCharacters.ameLabel],
                  ['courage', copy.playerCharacters.courageLabel],
                  ['endurance', copy.playerCharacters.enduranceLabel],
                ] as const
              ).map(([poolKey, label]) => {
                const value = character[poolKey]
                return (
                  <Space key={poolKey} wrap>
                    <Typography.Text style={{ minWidth: 90 }}>
                      {label}
                    </Typography.Text>
                    <InputNumber
                      addonBefore={copy.playerCharacters.currentLabel}
                      aria-label={`${label} ${copy.playerCharacters.currentLabel}`}
                      min={0}
                      value={value.current}
                      onChange={nextCurrent =>
                        updatePool(poolKey, {
                          current: Math.max(
                            0,
                            Math.min(Number(nextCurrent ?? 0), value.max)
                          ),
                          max: value.max,
                        })
                      }
                    />
                    <InputNumber
                      addonBefore={copy.playerCharacters.maxLabel}
                      aria-label={`${label} ${copy.playerCharacters.maxLabel}`}
                      min={0}
                      value={value.max}
                      onChange={nextMax =>
                        updatePool(poolKey, {
                          max: Math.max(0, Number(nextMax ?? 0)),
                          current: Math.min(
                            value.current,
                            Math.max(0, Number(nextMax ?? 0))
                          ),
                        })
                      }
                    />
                  </Space>
                )
              })}
            </Space>
          </Space>
        </Card>

        <Card
          title={copy.playerCharacters.inventorySection}
          extra={
            <Button
              size='small'
              onClick={addInventoryItem}
              disabled={character.inventory.length >= inventoryLimit}>
              {copy.playerCharacters.addItem}
            </Button>
          }>
          <Space orientation='vertical' style={{ width: '100%' }}>
            <Typography.Text type={isOverInventoryCap ? 'danger' : 'secondary'}>
              {copy.playerCharacters.inventoryStatus(
                character.inventory.length,
                inventoryLimit
              )}
            </Typography.Text>
            {character.inventory.map((item, index) => (
              <InventoryRow
                key={item.id}
                item={item}
                onChange={next =>
                  updateCharacter(current => ({
                    ...current,
                    inventory: replaceAt(current.inventory, index, next),
                  }))
                }
                onDelete={() =>
                  updateCharacter(current => ({
                    ...current,
                    inventory: current.inventory.filter(
                      entry => entry.id !== item.id
                    ),
                  }))
                }
              />
            ))}
          </Space>
        </Card>

        <Card
          title={copy.playerCharacters.spellbookSection}
          extra={
            <Button
              size='small'
              onClick={addSpell}
              disabled={character.spellbook.length >= 6}>
              {copy.playerCharacters.addSpell}
            </Button>
          }>
          <Space orientation='vertical' style={{ width: '100%' }}>
            <Typography.Text type='secondary'>
              {copy.playerCharacters.spellbookStatus(
                character.spellbook.length
              )}
            </Typography.Text>
            {character.spellbook.map((spell, index) => (
              <SpellRow
                key={spell.id}
                spell={spell}
                onChange={next =>
                  updateCharacter(current => ({
                    ...current,
                    spellbook: replaceAt(current.spellbook, index, next),
                  }))
                }
                onDelete={() =>
                  updateCharacter(current => ({
                    ...current,
                    spellbook: current.spellbook.filter(
                      entry => entry.id !== spell.id
                    ),
                  }))
                }
              />
            ))}
          </Space>
        </Card>

        <Card title={copy.playerCharacters.notesSection}>
          <Space orientation='vertical' style={{ width: '100%' }}>
            <Input.TextArea
              rows={5}
              value={character.notes}
              aria-label={copy.playerCharacters.notesSection}
              onChange={event =>
                updateCharacter(current => ({
                  ...current,
                  notes: event.target.value,
                }))
              }
            />
            <Divider style={{ margin: '8px 0' }} />
            <Button onClick={handleSave}>{copy.playerCharacters.save}</Button>
          </Space>
        </Card>
      </Space>
    </GeneratorPageShell>
  )
}

function InventoryRow({
  item,
  onChange,
  onDelete,
}: {
  item: InventoryItem
  onChange: (next: InventoryItem) => void
  onDelete: () => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        width: '100%',
        alignItems: 'center',
      }}>
      <Input
        placeholder={copy.playerCharacters.itemNamePlaceholder}
        value={item.label}
        aria-label={copy.playerCharacters.itemNamePlaceholder}
        onChange={event => onChange({ ...item, label: event.target.value })}
        style={{ flex: 1, minWidth: 220 }}
      />
      <InputNumber
        aria-label='Quantité'
        min={1}
        value={item.quantity}
        onChange={value =>
          onChange({ ...item, quantity: Math.max(1, Number(value ?? 1)) })
        }
        style={{ width: 110 }}
      />
      <Input
        placeholder={copy.playerCharacters.itemNotePlaceholder}
        value={item.note}
        aria-label={copy.playerCharacters.itemNotePlaceholder}
        onChange={event => onChange({ ...item, note: event.target.value })}
        style={{ width: 240 }}
      />
      <Button
        danger
        onClick={onDelete}
        aria-label={copy.playerCharacters.delete}>
        {copy.playerCharacters.delete}
      </Button>
    </div>
  )
}

function SpellRow({
  spell,
  onChange,
  onDelete,
}: {
  spell: SpellEntry
  onChange: (next: SpellEntry) => void
  onDelete: () => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        width: '100%',
        alignItems: 'center',
      }}>
      <Input
        placeholder={copy.playerCharacters.spellNamePlaceholder}
        value={spell.name}
        aria-label={copy.playerCharacters.spellNamePlaceholder}
        onChange={event => onChange({ ...spell, name: event.target.value })}
        style={{ flex: 1, minWidth: 220 }}
      />
      <Input
        placeholder={copy.playerCharacters.spellNotePlaceholder}
        value={spell.note}
        aria-label={copy.playerCharacters.spellNotePlaceholder}
        onChange={event => onChange({ ...spell, note: event.target.value })}
        style={{ width: 240 }}
      />
      <Button
        danger
        onClick={onDelete}
        aria-label={copy.playerCharacters.delete}>
        {copy.playerCharacters.delete}
      </Button>
    </div>
  )
}
