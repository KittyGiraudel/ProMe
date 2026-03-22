'use client'

import { RedoOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Button, Card, Checkbox, Typography } from 'antd'
import { encodeCharacterRoll } from '@/lib/lsdp/character/characterUrlCodec'
import {
  getAgeBand,
  getPersonality,
  type CharacterRoll,
} from '@/lib/lsdp/character/generate'
import { encodePlayingCard } from '@/lib/lsdp/playingCardCodec'
import { genderCompactSymbol } from '@/lib/lsdp/genderSymbols'
import type { PlayingCard } from '@/lib/lsdp/types'
import { suitIsRed } from '@/lib/lsdp/suitGlyphs'
import {
  establishmentLineFrFromSizeTier,
  rankUsesPetiteGrandeEstablishment,
} from '@/lib/lsdp/village/data/establishments'
import { VILLAGE_RULEBOOK_PAGES_FR } from '@/lib/lsdp/village/data/establishmentPages'
import { mergePetiteGrandeTiers } from '@/lib/lsdp/village/mergePetiteGrandeTiers'
import type { VillageRoll } from '@/lib/lsdp/village/generate'
import type { VillageEstablishmentRow } from '@/lib/lsdp/village/resolveDisplay'
import { resolveVillageDisplay } from '@/lib/lsdp/village/resolveDisplay'
import { PlayingCardLabel } from '@/components/PlayingCardLabel/PlayingCardLabel'
import { RichText } from '@/components/RichText/RichText'
import {
  formatVillageRulebookPagesJoined,
  fr,
  villageRulebookRefsNoteFr,
} from '@/messages/fr'
import './VillageSummary.css'

type VillageSummaryProps = {
  roll: VillageRoll | null
  owners: CharacterRoll[] | null
  onRerollPrimarySlot?: (slotIndex: number) => void
  onRerollOwner?: (ownerIndex: number) => void
}

type OwnerEntry = { roll: CharacterRoll; ownerIndex: number }

function VillageEstablishmentOwners({
  entries,
  onRerollOwner,
}: {
  entries: OwnerEntry[] | undefined
  onRerollOwner?: (ownerIndex: number) => void
}) {
  if (!entries?.length) return null
  const multi = entries.length > 1

  const renderRow = (e: OwnerEntry) => {
    const age = getAgeBand(e.roll)
    const personality = getPersonality(e.roll)
    const c = encodeURIComponent(encodeCharacterRoll(e.roll))
    return (
      <div className='village-summary__owner-row'>
        <span className='village-summary__owner-main'>
          <span className='village-summary__owner-line-start'>
            {genderCompactSymbol(e.roll.gender)}{' '}
            <Link
              href={`/generators/character?c=${c}`}
              className='village-summary__owner-name-link'
              aria-label={fr.village.openInCharacterBuilder}>
              {e.roll.name}
            </Link>
            {` (${fr.races[e.roll.race]})`}
          </span>
          <span className='village-summary__owner-sep'> — </span>
          <span className='village-summary__owner-age-personality'>
            {fr.ageBands[age]}, {fr.personalities[personality]}
          </span>
        </span>
        <span className='village-summary__owner-actions'>
          {onRerollOwner ? (
            <Button
              type='text'
              size='small'
              icon={<RedoOutlined />}
              aria-label={fr.village.rerollOwner}
              onClick={() => onRerollOwner(e.ownerIndex)}
              className='village-summary__owner-reroll'
            />
          ) : null}
        </span>
      </div>
    )
  }

  return (
    <div className='village-summary__owners'>
      <Typography.Text
        type='secondary'
        className='village-summary__owners-heading'>
        {multi ? fr.village.coOwnersLabel : fr.village.ownerLabel}
        {' :'}
      </Typography.Text>
      {multi ? (
        <ul className='village-summary__owners-list'>
          {entries.map(e => (
            <li key={e.ownerIndex} className='village-summary__owners-item'>
              {renderRow(e)}
            </li>
          ))}
        </ul>
      ) : (
        <div className='village-summary__owners-one'>
          {renderRow(entries[0]!)}
        </div>
      )}
    </div>
  )
}

function groupEstablishments(rows: VillageEstablishmentRow[]): {
  key: string
  text: string
  count: number
  card: PlayingCard
  rerollPrimarySlot: number | null
  rulebookPages: number[]
  ownerIndices: number[]
}[] {
  const order: string[] = []
  const map = new Map<
    string,
    { rows: VillageEstablishmentRow[]; ownerIndices: number[] }
  >()
  rows.forEach((r, idx) => {
    const pg = rankUsesPetiteGrandeEstablishment(r.card.rank)
    const key = pg ? `pg:${r.card.rank}` : `plain:${r.text}`
    const cur = map.get(key)
    if (!cur) {
      map.set(key, { rows: [r], ownerIndices: [idx] })
      order.push(key)
    } else {
      cur.rows.push(r)
      cur.ownerIndices.push(idx)
    }
  })
  return order.map(key => {
    const { rows, ownerIndices } = map.get(key)!
    const count = rows.length
    const first = rows[0]!
    let text: string
    if (key.startsWith('pg:')) {
      const tiers = rows.map(rr => (suitIsRed(rr.card.suit) ? 2 : 1) as 1 | 2)
      const merged = mergePetiteGrandeTiers(tiers)
      text = establishmentLineFrFromSizeTier(first.card.rank, merged)
    } else {
      const baseText = first.text
      if (count === 1) {
        text = baseText
      } else if (count === 2) {
        text = `${fr.village.mergedEstablishmentLabel} — ${baseText}`
      } else {
        text = `${fr.village.mergedEstablishmentLabel} (×${count}) — ${baseText}`
      }
    }
    const slots = rows.flatMap(rr =>
      rr.rerollPrimarySlot != null ? [rr.rerollPrimarySlot] : []
    )
    const rulebookPages: number[] = []
    for (const rr of rows) {
      if (!rulebookPages.includes(rr.rulebookPage)) {
        rulebookPages.push(rr.rulebookPage)
      }
    }
    rulebookPages.sort((a, b) => a - b)
    const rerollPrimarySlot =
      count === 1 && slots.length === 1 ? slots[0]! : null
    return {
      key,
      text,
      count,
      card: first.card,
      rerollPrimarySlot,
      rulebookPages,
      ownerIndices,
    }
  })
}

export function VillageSummary({
  roll,
  owners,
  onRerollPrimarySlot,
  onRerollOwner,
}: VillageSummaryProps) {
  const [grouped, setGrouped] = useState(false)

  const display = useMemo(
    () => (roll ? resolveVillageDisplay(roll) : null),
    [roll]
  )

  const ownersOk =
    owners && display && owners.length === display.establishments.length

  const establishmentBlocks = useMemo(() => {
    if (!display) return null
    if (!grouped) {
      return display.establishments.map((row, i) => (
        <div
          key={`${encodePlayingCard(row.card)}-${i}`}
          className='village-summary__line'>
          <span className='village-summary__line-num'>{i + 1}.</span>
          <div className='village-summary__line-body'>
            <div className='village-summary__line-inner'>
              <div className='village-summary__line-main'>
                <Typography.Text className='village-summary__line-name'>
                  {row.text}
                </Typography.Text>
                <span className='village-summary__line-card-wrap'>
                  {' ('}
                  <PlayingCardLabel card={row.card} compact />
                  {')'}
                </span>
                {onRerollPrimarySlot && row.rerollPrimarySlot != null ? (
                  <Button
                    type='text'
                    size='small'
                    icon={<RedoOutlined />}
                    aria-label={fr.village.rerollCard}
                    onClick={() => onRerollPrimarySlot(row.rerollPrimarySlot!)}
                    className='village-summary__line-reroll'
                  />
                ) : null}
              </div>
              <span
                className='village-summary__line-page'
                aria-label={`${fr.village.rulebookPageAria}: ${formatVillageRulebookPagesJoined([row.rulebookPage])}`}>
                {formatVillageRulebookPagesJoined([row.rulebookPage])}
              </span>
            </div>
            <VillageEstablishmentOwners
              entries={
                ownersOk ? [{ roll: owners![i]!, ownerIndex: i }] : undefined
              }
              onRerollOwner={onRerollOwner}
            />
          </div>
        </div>
      ))
    }
    return groupEstablishments(display.establishments).map((g, i) => (
      <div key={g.key} className='village-summary__line'>
        <span className='village-summary__line-num'>{i + 1}.</span>
        <div className='village-summary__line-body'>
          <div className='village-summary__line-inner'>
            <div className='village-summary__line-main'>
              <Typography.Text className='village-summary__line-name'>
                {g.text}
              </Typography.Text>
              <span className='village-summary__line-card-wrap'>
                {' ('}
                <PlayingCardLabel card={g.card} compact />
                {')'}
              </span>
              {onRerollPrimarySlot && g.rerollPrimarySlot != null ? (
                <Button
                  type='text'
                  size='small'
                  icon={<RedoOutlined />}
                  aria-label={fr.village.rerollCard}
                  onClick={() => onRerollPrimarySlot(g.rerollPrimarySlot!)}
                  className='village-summary__line-reroll'
                />
              ) : null}
            </div>
            <span
              className='village-summary__line-page'
              aria-label={`${fr.village.rulebookPageAria}: ${formatVillageRulebookPagesJoined(g.rulebookPages)}`}>
              {formatVillageRulebookPagesJoined(g.rulebookPages)}
            </span>
          </div>
          <VillageEstablishmentOwners
            entries={
              ownersOk
                ? g.ownerIndices.map(idx => ({
                    roll: owners![idx]!,
                    ownerIndex: idx,
                  }))
                : undefined
            }
            onRerollOwner={onRerollOwner}
          />
        </div>
      </div>
    ))
  }, [display, grouped, onRerollOwner, onRerollPrimarySlot, owners, ownersOk])

  const villageFootnote = (
    <Typography.Text type='secondary' className='generator-rulebook-footnote'>
      {villageRulebookRefsNoteFr(
        VILLAGE_RULEBOOK_PAGES_FR.villageChapter,
        VILLAGE_RULEBOOK_PAGES_FR.establishmentTable
      )}
    </Typography.Text>
  )

  if (!roll || !display) {
    return (
      <>
        <Card
          className='village-summary village-summary--empty'
          variant='borderless'>
          <Typography.Text type='secondary'>
            {fr.village.emptySummaryBefore}
            {fr.village.rollAll}
            {fr.village.emptySummaryAfter}
          </Typography.Text>
        </Card>
        {villageFootnote}
      </>
    )
  }

  return (
    <>
      <Card className='village-summary' variant='borderless'>
        <Typography.Title level={5} className='village-summary__section-title'>
          {fr.village.sectionEstablishments}
        </Typography.Title>
        {establishmentBlocks}

        {display.traits.length > 0 ? (
          <div className='village-summary__traits'>
            <Typography.Title
              level={5}
              className='village-summary__section-title'>
              {fr.village.sectionTraits}
            </Typography.Title>
            <ul className='village-summary__trait-list'>
              {display.traits.map(row => (
                <li
                  key={row.instances.map(x => x.primarySlot).join('-')}
                  className='village-summary__trait-item'>
                  <div className='village-summary__line-inner'>
                    <div className='village-summary__line-main village-summary__line-main--trait'>
                      <RichText
                        as='span'
                        text={row.text}
                        className='village-summary__line-name village-summary__line-name--trait'
                      />
                      <span className='village-summary__line-card-wrap'>
                        {' ('}
                        {row.instances.map((inst, idx) => (
                          <span key={inst.primarySlot}>
                            {idx > 0 ? ' · ' : null}
                            <PlayingCardLabel card={inst.card} compact />
                          </span>
                        ))}
                        {')'}
                      </span>
                      {onRerollPrimarySlot
                        ? row.instances.map(inst => (
                            <Button
                              key={inst.primarySlot}
                              type='text'
                              size='small'
                              icon={<RedoOutlined />}
                              aria-label={fr.village.rerollCard}
                              onClick={() =>
                                onRerollPrimarySlot(inst.primarySlot)
                              }
                              className='village-summary__line-reroll'
                            />
                          ))
                        : null}
                    </div>
                    <span
                      className='village-summary__line-page'
                      aria-label={`${fr.village.rulebookPageAria}: ${formatVillageRulebookPagesJoined([row.rulebookPage])}`}>
                      {formatVillageRulebookPagesJoined([row.rulebookPage])}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className='village-summary__hint'>
          <div className='village-summary__dupes-block'>
            <RichText
              as='p'
              className='village-summary__dupes-explanation'
              text={fr.village.duplicateRuleHint}
            />
            <div className='village-summary__dupes-toggle'>
              <Checkbox
                checked={grouped}
                onChange={e => setGrouped(e.target.checked)}>
                {fr.village.groupedToggle}
              </Checkbox>
            </div>
          </div>
        </div>
      </Card>
      {villageFootnote}
    </>
  )
}
