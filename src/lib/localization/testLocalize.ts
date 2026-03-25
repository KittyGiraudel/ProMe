import { defaultLocale } from '@/messages/locales'
import { copy as frCopy } from '@/messages/fr'
import { createLocalize, type Localize } from './localize'

/**
 * Test helper: provides a stable `Localize` object without needing the React context.
 * Using real message copy keeps assertions deterministic (e.g. village link summaries).
 */
export const testLocalize: Localize = createLocalize({
  locale: defaultLocale,
  copy: frCopy,
})

