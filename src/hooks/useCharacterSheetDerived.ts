'use client'

import { Form, type FormInstance } from 'antd'
import { useCallback, useMemo } from 'react'
import { normalizeMapState } from '@/lib/character/mapState'
import { randomId } from '@/lib/character/model'
import type {
  Archetype,
  CellCoordinate,
  CharacterMapState,
  InventoryItem,
  JournalEntry,
  StatPool,
} from '@/lib/character/types'
import { buildCellReferenceToJournalEntriesIndex } from '@/lib/journal/cellReferenceIndex'
import { formatDisplayedCellReference } from '@/lib/map/coordinates'
import { Gender } from '@/lib/types'

const FALLBACK_STAT_POOL: StatPool = { current: 0, max: 0 }

export function useWatchedIdentity(oForm?: FormInstance) {
  const iForm = Form.useFormInstance()
  const form = oForm ?? iForm
  const archetype = Form.useWatch<Archetype>('archetype', {
    form,
    preserve: true,
  })
  const gender =
    Form.useWatch<Gender>('gender', { form, preserve: true }) ?? 'indeterminate'
  const name = Form.useWatch<string>('name', { form, preserve: true }) ?? ''

  return useMemo(() => ({ name, archetype, gender }), [name, archetype, gender])
}

export function useWatchedStamina(oForm?: FormInstance) {
  const iForm = Form.useFormInstance()
  const form = oForm ?? iForm
  const stamina =
    Form.useWatch<StatPool>('stamina', { form, preserve: true }) ??
    FALLBACK_STAT_POOL

  const updateCurrentStamina = useCallback(
    (stamina: number) => form.setFieldValue(['stamina', 'current'], stamina),
    []
  )
  const updateMaxStamina = useCallback(
    (stamina: number) => form.setFieldValue(['stamina', 'max'], stamina),
    []
  )

  return useMemo(
    () => ({ stamina, updateCurrentStamina, updateMaxStamina }),
    [stamina, updateCurrentStamina, updateMaxStamina]
  )
}

export function useWatchedHealth(oForm?: FormInstance) {
  const iForm = Form.useFormInstance()
  const form = oForm ?? iForm
  const health =
    Form.useWatch<StatPool>('health', { form, preserve: true }) ??
    FALLBACK_STAT_POOL

  const updateCurrentHealth = useCallback(
    (health: number) => form.setFieldValue(['health', 'current'], health),
    []
  )
  const updateMaxHealth = useCallback(
    (health: number) => form.setFieldValue(['health', 'max'], health),
    []
  )

  return useMemo(
    () => ({ health, updateCurrentHealth, updateMaxHealth }),
    [health, updateCurrentHealth, updateMaxHealth]
  )
}

export function useWatchedCourage(oForm?: FormInstance) {
  const iForm = Form.useFormInstance()
  const form = oForm ?? iForm
  const courage =
    Form.useWatch<StatPool>('courage', { form, preserve: true }) ??
    FALLBACK_STAT_POOL

  const updateCurrentCourage = useCallback(
    (courage: number) => form.setFieldValue(['courage', 'current'], courage),
    []
  )
  const updateMaxCourage = useCallback(
    (courage: number) => form.setFieldValue(['courage', 'max'], courage),
    []
  )

  return useMemo(
    () => ({ courage, updateCurrentCourage, updateMaxCourage }),
    [courage, updateCurrentCourage, updateMaxCourage]
  )
}

export function useWatchedHonor(oForm?: FormInstance) {
  const iForm = Form.useFormInstance()
  const form = oForm ?? iForm
  const honor = Form.useWatch<number>('honor', { form, preserve: true }) ?? 0

  const updateHonor = useCallback(
    (honor: number) => form.setFieldValue('honor', honor),
    []
  )

  return useMemo(() => ({ honor, updateHonor }), [honor, updateHonor])
}

export function useWatchedInspiration(oForm?: FormInstance) {
  const iForm = Form.useFormInstance()
  const form = oForm ?? iForm
  const inspiration =
    Form.useWatch<number>('inspiration', { form, preserve: true }) ?? 0

  const updateInspiration = useCallback(
    (inspiration: number) => form.setFieldValue('inspiration', inspiration),
    []
  )

  return useMemo(
    () => ({ inspiration, updateInspiration }),
    [inspiration, updateInspiration]
  )
}

export function useWatchedMoney(oForm?: FormInstance) {
  const iForm = Form.useFormInstance()
  const form = oForm ?? iForm
  const money = Form.useWatch<number>('money', { form, preserve: true }) ?? 0

  const incrementMoney = useCallback(
    (quantity: number) => form.setFieldValue('money', money + quantity),
    [money, form]
  )

  return useMemo(() => ({ money, incrementMoney }), [money, incrementMoney])
}

export function useWatchedMap(oForm?: FormInstance) {
  const iForm = Form.useFormInstance()
  const form = oForm ?? iForm
  const map = Form.useWatch<CharacterMapState>('map', { form, preserve: true })
  const updateMap = useCallback(
    (updater: (current: CharacterMapState) => CharacterMapState) => {
      const current = normalizeMapState(
        form.getFieldValue('map') as CharacterMapState | undefined
      )
      form.setFieldValue('map', updater(current))
    },
    [form]
  )

  return useMemo(() => ({ map, updateMap }), [map, updateMap])
}

export function useWatchedClock(oForm?: FormInstance) {
  const iForm = Form.useFormInstance()
  const form = oForm ?? iForm
  const clock = Form.useWatch<number>('clock', { form, preserve: true }) ?? 0
  const updateClock = useCallback(
    (clock: number) => form.setFieldValue('clock', clock),
    [form]
  )

  return useMemo(() => ({ clock, updateClock }), [clock, updateClock])
}

export function useWatchedJournal(oForm?: FormInstance) {
  const iForm = Form.useFormInstance()
  const form = oForm ?? iForm

  const entries = Form.useWatch<JournalEntry[]>('journalEntries', {
    form,
    preserve: true,
  })

  const index = useMemo(
    () => buildCellReferenceToJournalEntriesIndex(entries),
    [entries]
  )

  const getLinksForCell = useCallback(
    (coord: CellCoordinate) =>
      index.get(formatDisplayedCellReference(coord)) ?? [],
    [index]
  )

  const getEntry = useCallback(
    (fieldName: number) => entries?.[fieldName],
    [entries]
  )

  const updateEntryField = useCallback(
    (fieldName: number, key: string, value: unknown) => {
      form.setFieldValue(['journalEntries', fieldName, key], value)
    },
    [form]
  )

  return useMemo(
    () => ({
      entries: entries ?? [],
      getEntry,
      getLinksForCell,
      updateEntryField,
    }),
    [entries, getEntry, getLinksForCell, updateEntryField]
  )
}

export function useWatchedInventory(oForm?: FormInstance) {
  const iForm = Form.useFormInstance()
  const form = oForm ?? iForm
  const inventory = Form.useWatch<InventoryItem[]>('inventory', {
    form,
    preserve: true,
  })

  const { stamina } = useWatchedStamina()
  const inventoryCap = Math.max(0, stamina.current ?? 0) * 6
  const limit = Math.min(30, inventoryCap)

  const addItem = useCallback(
    (quantity: number, label: string) => {
      const existing = inventory.find(
        item => item.label.toLowerCase() === label.toLowerCase()
      )
      if (existing) {
        form.setFieldValue(
          'inventory',
          inventory.map(item =>
            item === existing
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        )
      } else {
        if (limit > 0 && inventory.length >= limit) return
        form.setFieldValue('inventory', [
          ...inventory,
          { id: randomId(), quantity, label, note: '' },
        ])
      }
    },
    [inventory, limit, form]
  )

  return useMemo(
    () => ({ inventory: inventory ?? [], limit, addItem }),
    [inventory, limit, addItem]
  )
}
