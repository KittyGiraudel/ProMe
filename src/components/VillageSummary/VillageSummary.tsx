'use client'

import { RedoOutlined } from '@ant-design/icons'
import { useMemo, useState } from 'react'
import { Button, Card, Checkbox, Typography } from 'antd'
import { encodePlayingCard } from '@/lib/lsdp/playingCardCodec'
import type { PlayingCard } from '@/lib/lsdp/types'
import { suitIsRed } from '@/lib/lsdp/suitGlyphs'
import {
  establishmentLineFromSizeTier,
  rankUsesPetiteGrandeEstablishment,
} from '@/lib/lsdp/village/data/establishments'
import { VILLAGE_RULEBOOK_PAGES } from '@/lib/lsdp/village/data/establishmentPages'
import { mergePetiteGrandeTiers } from '@/lib/lsdp/village/mergePetiteGrandeTiers'
import type { VillageRoll } from '@/lib/lsdp/village/generate'
import type { CharacterRoll } from '@/lib/lsdp/character/generate'
import type { VillageEstablishmentRow } from '@/lib/lsdp/village/resolveDisplay'
import { resolveVillageDisplay } from '@/lib/lsdp/village/resolveDisplay'
import { PlayingCardLabel } from '@/components/PlayingCardLabel/PlayingCardLabel'
import { RichText } from '@/components/RichText/RichText'
import { copy } from '@/messages/fr'
import {
  formatVillageRulebookPagesJoined,
  villageRulebookRefsNote,
} from '@/messages/formatCopy'
import { VillageEstablishmentLine } from './VillageEstablishmentLine'
import './VillageSummary.css'

type VillageSummaryProps = {
  roll: VillageRoll | null
  owners: CharacterRoll[] | null
  onRerollPrimarySlot?: (slotIndex: number) => void
  onRerollOwner?: (ownerIndex: number) => void
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
      text = establishmentLineFromSizeTier(first.card.rank, merged)
    } else {
      const baseText = first.text
      if (count === 1) {
        text = baseText
      } else if (count === 2) {
        text = `${copy.village.mergedEstablishmentLabel}${copy.common.emDashSpaced}${baseText}`
      } else {
        text = `${copy.village.mergedEstablishmentLabel} (×${count})${copy.common.emDashSpaced}${baseText}`
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
        <VillageEstablishmentLine
          key={`${encodePlayingCard(row.card)}-${i}`}
          lineNumber={i + 1}
          title={row.text}
          card={row.card}
          rulebookPages={[row.rulebookPage]}
          rerollPrimarySlot={row.rerollPrimarySlot ?? null}
          onRerollPrimarySlot={onRerollPrimarySlot}
          ownerEntries={
            ownersOk ? [{ roll: owners![i]!, ownerIndex: i }] : undefined
          }
          onRerollOwner={onRerollOwner}
        />
      ))
    }
    return groupEstablishments(display.establishments).map((g, i) => (
      <VillageEstablishmentLine
        key={g.key}
        lineNumber={i + 1}
        title={g.text}
        card={g.card}
        rulebookPages={g.rulebookPages}
        rerollPrimarySlot={g.rerollPrimarySlot}
        onRerollPrimarySlot={onRerollPrimarySlot}
        ownerEntries={
          ownersOk
            ? g.ownerIndices.map(idx => ({
                roll: owners![idx]!,
                ownerIndex: idx,
              }))
            : undefined
        }
        onRerollOwner={onRerollOwner}
      />
    ))
  }, [display, grouped, onRerollOwner, onRerollPrimarySlot, owners, ownersOk])

  const villageFootnote = (
    <Typography.Text type='secondary' className='generator-rulebook-footnote'>
      {villageRulebookRefsNote(
        VILLAGE_RULEBOOK_PAGES.villageChapter,
        VILLAGE_RULEBOOK_PAGES.establishmentTable
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
            {copy.village.emptySummaryBefore}
            {copy.village.rollAll}
            {copy.village.emptySummaryAfter}
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
          {copy.village.sectionEstablishments}
        </Typography.Title>
        {establishmentBlocks}

        {display.traits.length > 0 ? (
          <div className='village-summary__traits'>
            <Typography.Title
              level={5}
              className='village-summary__section-title'>
              {copy.village.sectionTraits}
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
                              aria-label={copy.village.rerollCard}
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
                      aria-label={`${copy.village.rulebookPageAria}: ${formatVillageRulebookPagesJoined([row.rulebookPage])}`}>
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
              text={copy.village.duplicateRuleHint}
            />
            <div className='village-summary__dupes-toggle'>
              <Checkbox
                checked={grouped}
                onChange={e => setGrouped(e.target.checked)}>
                {copy.village.groupedToggle}
              </Checkbox>
            </div>
          </div>
        </div>
      </Card>
      {villageFootnote}
    </>
  )
}
