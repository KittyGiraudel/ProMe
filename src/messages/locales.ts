import { copy as frCopy } from './fr'

export const defaultLocale = 'fr' as const
export type Locale = typeof defaultLocale

export const messagesByLocale = {
  fr: frCopy,
} as const satisfies Record<string, unknown>

export type Messages = (typeof messagesByLocale)['fr']

export function getMessages(locale: Locale = defaultLocale): Messages {
  return messagesByLocale[locale]
}

