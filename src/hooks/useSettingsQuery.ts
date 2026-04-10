'use client'

import { loadSettings } from '@/lib/settings/storage'
import type { AppSettings } from '@/lib/settings/types'
import { type QueryResult, useQuery } from './useQuery'

export function useSettingsQuery(): QueryResult<AppSettings> {
  return useQuery(() => Promise.resolve(loadSettings()))
}
