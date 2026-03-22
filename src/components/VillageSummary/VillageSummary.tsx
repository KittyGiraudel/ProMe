'use client'

import { RedoOutlined } from '@ant-design/icons'
import { useMemo, useState } from 'react'
import { Button, Card, Checkbox, Tooltip, Typography } from 'antd'
import { encodePlayingCard } from '@/lib/codec/cards'
import type { PlayingCard } from '@/lib/types'
import { suitIsRed } from '@/lib/suitGlyphs'
import {
  establishmentLineFromSizeTier,
  rankUsesEstablishmentSizeTiers,
} from '@/lib/village/data/establishments'
import { mergeEstablishmentSizeTiers } from '@/lib/village/mergeEstablishmentSizeTiers'
import type { VillageRoll } from '@/lib/village/generate'
import type { CharacterRoll } from '@/lib/character/generate'
import type { VillageEstablishmentRow } from '@/lib/village/resolveDisplay'
import {
  ownerSlotIndexByEstablishmentIndex,
  resolveVillageDisplay,
} from '@/lib/village/resolveDisplay'
import { PlayingCardLabel } from '@/components/PlayingCardLabel/PlayingCardLabel'
import { RichText } from '@/components/RichText/RichText'
import { copy } from '@/messages/fr'
import { formatVillageRulebookPagesJoined } from '@/messages/formatCopy'
import { VillageEstablishmentLine } from './VillageEstablishmentLine'
import './VillageSummary.css'

type VillageSummaryProps = {
  roll: VillageRoll | null
  owners: CharacterRoll[] | null
  /** Appended to inhabitant links so the character page can offer « Retour au village ». */
  characterPageVillageQuery?: string | null
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
    const tiered = rankUsesEstablishmentSizeTiers(r.card.rank)
    const key = tiered ? `tier:${r.card.rank}` : `plain:${r.text}`
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
    if (key.startsWith('tier:')) {
      const tiers = rows.map(rr => (suitIsRed(rr.card.suit) ? 2 : 1) as 1 | 2)
      const merged = mergeEstablishmentSizeTiers(tiers)
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
  characterPageVillageQuery,
  onRerollPrimarySlot,
  onRerollOwner,
}: VillageSummaryProps) {
  const [grouped, setGrouped] = useState(false)

  const display = useMemo(
    () => (roll ? resolveVillageDisplay(roll) : null),
    [roll]
  )

  const ownerSlotByEstIndex = useMemo(
    () =>
      display
        ? ownerSlotIndexByEstablishmentIndex(display.establishments)
        : null,
    [display]
  )

  const ownersOk =
    owners &&
    display &&
    ownerSlotByEstIndex &&
    owners.length === ownerSlotByEstIndex.filter(s => s !== null).length

  const establishmentBlocks = useMemo(() => {
    if (!display || !ownerSlotByEstIndex) return null
    if (!grouped) {
      return display.establishments.map((row, i) => {
        const ownerSlot = ownerSlotByEstIndex[i]!
        return (
          <VillageEstablishmentLine
            key={`${encodePlayingCard(row.card)}-${i}`}
            lineNumber={i + 1}
            title={row.text}
            card={row.card}
            rulebookPages={[row.rulebookPage]}
            rerollPrimarySlot={row.rerollPrimarySlot ?? null}
            onRerollPrimarySlot={onRerollPrimarySlot}
            characterPageVillageQuery={characterPageVillageQuery}
            ownerEntries={
              ownersOk && ownerSlot !== null
                ? [{ roll: owners![ownerSlot]!, ownerIndex: ownerSlot }]
                : undefined
            }
            onRerollOwner={onRerollOwner}
          />
        )
      })
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
        characterPageVillageQuery={characterPageVillageQuery}
        ownerEntries={
          ownersOk
            ? g.ownerIndices.flatMap(estIdx => {
                const ownerSlot = ownerSlotByEstIndex[estIdx]!
                if (ownerSlot === null) return []
                return [
                  {
                    roll: owners![ownerSlot]!,
                    ownerIndex: ownerSlot,
                  },
                ]
              })
            : undefined
        }
        onRerollOwner={onRerollOwner}
      />
    ))
  }, [
    characterPageVillageQuery,
    display,
    grouped,
    onRerollOwner,
    onRerollPrimarySlot,
    ownerSlotByEstIndex,
    owners,
    ownersOk,
  ])

  const villageFootnote = (
    <Typography.Text type='secondary' className='generator-rulebook-footnote'>
      {copy.rulebook.villageFootnote}
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
              <Tooltip title={copy.village.groupedToggleTooltip}>
                <span className='village-summary__dupes-toggle-tooltip-target'>
                  <Checkbox
                    checked={grouped}
                    onChange={e => setGrouped(e.target.checked)}>
                    {copy.village.groupedToggle}
                  </Checkbox>
                </span>
              </Tooltip>
            </div>
          </div>
        </div>
      </Card>
      {villageFootnote}
    </>
  )
}
