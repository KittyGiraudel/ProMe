'use client'

import { Form, type FormInstance } from 'antd'
import type {
  Archetype,
  CharacterMapState,
  JournalEntry,
  StatPool,
} from '@/lib/character/types'
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

  return { name, archetype, gender }
}

export function useWatchedStats(oForm?: FormInstance) {
  const iForm = Form.useFormInstance()
  const form = oForm ?? iForm
  const watchOpts = { form, preserve: true } as const
  const stamina =
    Form.useWatch<StatPool>('stamina', watchOpts) ?? FALLBACK_STAT_POOL
  const health =
    Form.useWatch<StatPool>('health', watchOpts) ?? FALLBACK_STAT_POOL
  const courage =
    Form.useWatch<StatPool>('courage', watchOpts) ?? FALLBACK_STAT_POOL

  return { stamina, health, courage }
}

export function useWatchedMap(oForm?: FormInstance) {
  const iForm = Form.useFormInstance()
  const form = oForm ?? iForm
  return Form.useWatch<CharacterMapState>('map', { form, preserve: true })
}

export function useWatchedClock(oForm?: FormInstance) {
  const iForm = Form.useFormInstance()
  const form = oForm ?? iForm
  return Form.useWatch<number>('clock', { form, preserve: true }) ?? 0
}

export function useWatchedJournal(oForm?: FormInstance) {
  const iForm = Form.useFormInstance()
  const form = oForm ?? iForm
  return (
    Form.useWatch<JournalEntry[]>('journalEntries', {
      form,
      preserve: true,
    }) ?? []
  )
}
