'use client'

import { RedoOutlined } from '@ant-design/icons'
import { useMemo, useState } from 'react'
import { Button, Card, Checkbox, Typography } from 'antd'
import { encodePlayingCard } from '@/lib/lsdp/playingCardCodec'
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
  onRerollPrimarySlot?: (slotIndex: number) => void
}

function groupEstablishments(rows: VillageEstablishmentRow[]): {
  key: string
  text: string
  count: number
  card: PlayingCard
  rerollPrimarySlot: number | null
  rulebookPages: number[]
}[] {
  const order: string[] = []
  const map = new Map<string, { rows: VillageEstablishmentRow[] }>()
  for (const r of rows) {
    const pg = rankUsesPetiteGrandeEstablishment(r.card.rank)
    const key = pg ? `pg:${r.card.rank}` : `plain:${r.text}`
    const cur = map.get(key)
    if (!cur) {
      map.set(key, { rows: [r] })
      order.push(key)
    } else {
      cur.rows.push(r)
    }
  }
  return order.map(key => {
    const { rows } = map.get(key)!
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
    }
  })
}

export function VillageSummary({
  roll,
  onRerollPrimarySlot,
}: VillageSummaryProps) {
  const [grouped, setGrouped] = useState(false)

  const display = useMemo(
    () => (roll ? resolveVillageDisplay(roll) : null),
    [roll]
  )

  const establishmentBlocks = useMemo(() => {
    if (!display) return null
    if (!grouped) {
      return display.establishments.map((row, i) => (
        <div
          key={`${encodePlayingCard(row.card)}-${i}`}
          className='village-summary__line'>
          <span className='village-summary__line-num'>{i + 1}.</span>
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
        </div>
      ))
    }
    return groupEstablishments(display.establishments).map((g, i) => (
      <div key={g.key} className='village-summary__line'>
        <span className='village-summary__line-num'>{i + 1}.</span>
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
      </div>
    ))
  }, [display, grouped, onRerollPrimarySlot])

  if (!roll || !display) {
    return (
      <Card
        className='village-summary village-summary--empty'
        variant='borderless'>
        <Typography.Text type='secondary'>
          {fr.village.emptySummaryBefore}
          {fr.village.rollAll}
          {fr.village.emptySummaryAfter}
        </Typography.Text>
      </Card>
    )
  }

  return (
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
              <li key={row.primarySlot} className='village-summary__trait-item'>
                <div className='village-summary__line-inner'>
                  <div className='village-summary__line-main village-summary__line-main--trait'>
                    <RichText
                      as='span'
                      text={row.text}
                      className='village-summary__line-name village-summary__line-name--trait'
                    />
                    <span className='village-summary__line-card-wrap'>
                      {' ('}
                      <PlayingCardLabel card={row.card} compact />
                      {')'}
                    </span>
                    {onRerollPrimarySlot ? (
                      <Button
                        type='text'
                        size='small'
                        icon={<RedoOutlined />}
                        aria-label={fr.village.rerollCard}
                        onClick={() => onRerollPrimarySlot(row.primarySlot)}
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
        <Typography.Text
          type='secondary'
          className='village-summary__hint-books'>
          {villageRulebookRefsNoteFr(
            VILLAGE_RULEBOOK_PAGES_FR.villageChapter,
            VILLAGE_RULEBOOK_PAGES_FR.establishmentTable
          )}
        </Typography.Text>
      </div>
    </Card>
  )
}
