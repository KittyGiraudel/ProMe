'use client'

import type { _Translator } from 'next-intl'
import type { CSSProperties, ReactNode } from 'react'
import { BiomeTag } from '@/components/BiomeTag/BiomeTag'
import { CoordChip } from '@/components/CoordChip/CoordChip'
import { JournalReferencePreview } from '@/components/JournalReferencePreview/JournalReferencePreview'
import type { CharacterCellData } from '@/components/PageCharacterSheet/CharacterContext'
import { getCharacterStore } from '@/lib/character/store'
import { BIOME_ROLL_TABLE } from '@/lib/constants/biomeRollTable'
import { DICE, SUITS } from '@/lib/constants/misc'
import { extractDisplayedCellReferences } from '@/lib/hex/coordinates'
import { getNpcJournalSummary } from '@/lib/markdown/inhabitantLinkSummary'
import type { JournalEmbellishUiRule } from '@/lib/markdown/journalEmbellishText'
import {
  journalLiteralRule,
  journalRegexRule,
} from '@/lib/markdown/journalEmbellishText'
import { getProtectorJournalSummary } from '@/lib/markdown/protectorLinkSummary'
import { getVillageJournalSummary } from '@/lib/markdown/villageLinkSummary'
import { suitIsRed } from '@/lib/suitGlyphs'
import type { Suit } from '@/lib/types'
import { decodeVillageFactionParam } from '@/lib/village/villageUrlCodec'

/** Everything needed to build journal embellishment rules for the current character sheet + locale. */
export type JournalEmbellishmentBuildContext = {
  t: _Translator
  getCellData: (ref: string) => CharacterCellData | null
  mergeVillageDuplicateEstablishments: boolean
  // When false, reference previews and coord chips do not navigate
  // (e.g. edit-modal preview).
  interactive?: boolean
}

function accentSpan(
  color: string,
  children: ReactNode,
  reactKey: string,
  dataZoom?: boolean
): ReactNode {
  return (
    <span
      key={reactKey}
      className='JournalMarkdown__accent'
      data-zoom={dataZoom ? true : undefined}
      style={{ '--color': color } as CSSProperties}>
      {children}
    </span>
  )
}

/**
 * Coordinate-specific rules derived from `text` (hex cell references like `E13`).
 */
function coordEmbellishmentRules(
  ctx: JournalEmbellishmentBuildContext,
  text: string
): JournalEmbellishUiRule[] {
  return extractDisplayedCellReferences(text).map(reference =>
    journalLiteralRule(
      `coord:${reference}`,
      reference,
      true,
      ({ reactKey }) => {
        const cellData = ctx.getCellData(reference)
        if (cellData) {
          return (
            <CoordChip
              key={reactKey}
              biome={cellData.biome}
              value={cellData.ref}
              coord={cellData.coord}
              interactive={ctx.interactive}
            />
          )
        }
        return (
          <CoordChip
            key={reactKey}
            biome='unexplored'
            value={reference}
            interactive={ctx.interactive}
          />
        )
      }
    )
  )
}

/**
 * All journal embellishment rules except coordinates (coordinates depend on the current text chunk).
 */
function staticJournalEmbellishmentRules(
  ctx: JournalEmbellishmentBuildContext
): JournalEmbellishUiRule[] {
  const { t, mergeVillageDuplicateEstablishments } = ctx

  const biomeRules: JournalEmbellishUiRule[] = BIOME_ROLL_TABLE.map(row =>
    journalLiteralRule(
      `biome:${row.biome}`,
      t(`common.biomes.${row.biome}`),
      true,
      ({ reactKey }) => <BiomeTag key={reactKey} biome={row.biome} />
    )
  )

  const suitRules: JournalEmbellishUiRule[] = Object.entries(SUITS).flatMap(
    ([name, symbol]) => {
      const matchText = symbol
      const color = suitIsRed(name as Suit) ? 'red' : 'black'
      return [
        journalLiteralRule(
          `symbol:${name}`,
          matchText,
          undefined,
          ({ reactKey }) => (
            <span
              key={reactKey}
              className='JournalMarkdown__accent'
              data-zoom
              style={{ '--color': color } as CSSProperties}>
              {symbol}
            </span>
          )
        ),
        journalLiteralRule(
          `symbol-brace-letter:${name}`,
          `{${name[0].toUpperCase()}}`,
          undefined,
          ({ reactKey }) => (
            <span
              key={reactKey}
              className='JournalMarkdown__accent'
              data-zoom
              style={{ '--color': color } as CSSProperties}>
              {symbol}
            </span>
          )
        ),
      ]
    }
  )

  const diceRules: JournalEmbellishUiRule[] = DICE.flatMap((symbol, index) => [
    journalLiteralRule(
      `symbol:${index + 1}`,
      symbol,
      undefined,
      ({ reactKey }) => (
        <span key={reactKey} data-zoom>
          {symbol}
        </span>
      )
    ),
    journalLiteralRule(
      `symbol-brace:${index + 1}`,
      `{${index + 1}}`,
      undefined,
      ({ reactKey }) => (
        <span key={reactKey} data-zoom>
          {symbol}
        </span>
      )
    ),
  ])

  const journalRefRules: JournalEmbellishUiRule[] = [
    journalRegexRule(
      'journalRef:village',
      String.raw`\{village\/([^}]+)\}`,
      undefined,
      1,
      ({ slice, refId, reactKey }) => {
        const id = refId?.trim()
        if (!id) return slice
        const queryIndex = id.indexOf('?')
        const encodedId = queryIndex >= 0 ? id.slice(0, queryIndex) : id
        const faction = decodeVillageFactionParam(
          queryIndex >= 0
            ? new URLSearchParams(id.slice(queryIndex)).get('f')
            : null
        )
        const summary = getVillageJournalSummary(
          encodedId,
          t,
          { mergeDuplicateEstablishments: mergeVillageDuplicateEstablishments },
          faction
        )
        if (!summary) return slice
        return (
          <JournalReferencePreview
            key={reactKey}
            kind='village'
            referenceId={encodedId}
            href={ctx.interactive ? `/generators/village/${id}` : undefined}
            label={summary}
          />
        )
      }
    ),
    journalRegexRule(
      'journalRef:npc',
      String.raw`\{npc\/([^}]+)\}`,
      undefined,
      1,
      ({ slice, refId, reactKey }) => {
        const id = refId?.trim()
        if (!id) return slice
        const summary = getNpcJournalSummary(id, t)
        if (!summary) return slice
        return (
          <JournalReferencePreview
            key={reactKey}
            kind='npc'
            referenceId={id}
            href={ctx.interactive ? `/generators/npc/${id}` : undefined}
            label={summary}
          />
        )
      }
    ),
    journalRegexRule(
      'journalRef:protector',
      String.raw`\{protector\/([^}]+)\}`,
      undefined,
      1,
      ({ slice, refId, reactKey }) => {
        const id = refId?.trim()
        if (!id) return slice
        const ch = getCharacterStore().get(id)
        const label = ch
          ? getProtectorJournalSummary(ch, t)
          : t('character_list.unknown')
        return (
          <JournalReferencePreview
            key={reactKey}
            kind='protector'
            referenceId={id}
            href={ctx.interactive ? `/characters/${id}/identity` : undefined}
            label={label}
          />
        )
      }
    ),
  ]

  return [
    ...biomeRules,
    journalLiteralRule(
      'word:success',
      t('common.check_success_word'),
      true,
      ({ slice, reactKey }) => accentSpan('green', slice, reactKey)
    ),
    journalLiteralRule(
      'word:failure',
      t('common.check_failure_word'),
      true,
      ({ slice, reactKey }) => accentSpan('red', slice, reactKey)
    ),
    journalLiteralRule('symbol:sun', '☼', undefined, ({ slice, reactKey }) =>
      accentSpan('#d4a017', slice, reactKey)
    ),
    journalLiteralRule('symbol:moon', '☾', undefined, ({ slice, reactKey }) =>
      accentSpan('#1f3f8b', slice, reactKey)
    ),
    ...suitRules,
    ...diceRules,
    ...journalRefRules,
  ]
}

/**
 * Full rule list for one markdown text node: static replacements + coordinates found in `text`.
 */
export function buildJournalMarkdownEmbellishmentRules(
  ctx: JournalEmbellishmentBuildContext,
  text: string
): JournalEmbellishUiRule[] {
  return [
    ...staticJournalEmbellishmentRules(ctx),
    ...coordEmbellishmentRules(ctx, text),
  ]
}
