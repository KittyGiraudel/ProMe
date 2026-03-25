import { createTranslator } from 'use-intl/core'
import frMessages from '../../../messages/fr.json'

/**
 * Unit-test `t()` mock for next-intl-style translators.
 *
 * Business-logic code (URL codecs, markdown link summaries, generators) expects
 * an `_Translator` function. Creating a real translator via `use-intl/core`
 * keeps formatting/ICU behavior consistent with production.
 */
export const testLocalize = createTranslator({
  locale: 'fr',
  messages: frMessages,
})

