'use client'

import { RedoOutlined } from '@ant-design/icons'
import { Typography } from 'antd'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/Button/Button'
import { PlayingCardLabel } from '@/components/PlayingCardLabel/PlayingCardLabel'
import { establishmentDetailRulebookPage } from '@/lib/constants/rulebookPages'
import type { PlayingCard } from '@/lib/types'
import { formatRulebookReference } from '@/lib/village/formatRulebookReference'
import {
  VillageEstablishmentOwners,
  type VillageOwnerEntry,
} from './VillageEstablishmentOwners'

export type VillageEstablishmentLineProps = {
  lineNumber: number
  title: string
  card: PlayingCard
  /**
   * Optional rulebook citations for this line.
   *
   * - When omitted, we derive the page from `card.rank` (simple, non-grouped case).
   * - When grouping merges multiple underlying establishments, pass the full set of
   *   pages so the UI can cite everything represented by this single rendered line.
   */
  rulebookPages?: number[]
  rerollPrimarySlot: number | null
  onRerollPrimarySlot?: (slotIndex: number) => void
  ownerEntries?: VillageOwnerEntry[]
  onRerollOwner?: (ownerIndex: number) => void
}

export function VillageEstablishmentLine({
  lineNumber,
  title,
  card,
  rulebookPages,
  rerollPrimarySlot,
  onRerollPrimarySlot,
  ownerEntries,
  onRerollOwner,
}: VillageEstablishmentLineProps) {
  const t = useTranslations()
  const pages = rulebookPages ?? [establishmentDetailRulebookPage(card.rank)]
  const pagesLabel = formatRulebookReference(pages, t)

  return (
    <div className='VillageSummary__line'>
      <span className='VillageSummary__line-num'>{lineNumber}.</span>
      <div className='VillageSummary__line-body'>
        <div className='VillageSummary__line-inner'>
          <div className='VillageSummary__line-main'>
            <Typography.Text>{title}</Typography.Text>
            <span className='VillageSummary__line-card-wrap'>
              {' ('}
              <PlayingCardLabel card={card} compact />
              {')'}
            </span>
            {onRerollPrimarySlot && rerollPrimarySlot != null ? (
              <Button
                type='text'
                size='small'
                icon={<RedoOutlined />}
                aria-label={t('common.actions.reroll_card')}
                onClick={() => onRerollPrimarySlot(rerollPrimarySlot)}
                className='VillageSummary__line-reroll'
              />
            ) : null}
          </div>
          <span
            className='VillageSummary__line-page'
            aria-label={t('rulebook.page_citation', {
              page: pagesLabel,
            })}>
            {pagesLabel}
          </span>
        </div>
        <VillageEstablishmentOwners
          entries={ownerEntries}
          onRerollOwner={onRerollOwner}
        />
      </div>
    </div>
  )
}
