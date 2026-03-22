'use client'

import { RedoOutlined } from '@ant-design/icons'
import { Button, Typography } from 'antd'
import { PlayingCardLabel } from '@/components/PlayingCardLabel/PlayingCardLabel'
import type { PlayingCard } from '@/lib/lsdp/types'
import { formatVillageRulebookPagesJoined, fr } from '@/messages/fr'
import {
  VillageEstablishmentOwners,
  type VillageOwnerEntry,
} from './VillageEstablishmentOwners'

export type VillageEstablishmentLineProps = {
  lineNumber: number
  title: string
  card: PlayingCard
  rulebookPages: number[]
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
  const pagesLabel = formatVillageRulebookPagesJoined(rulebookPages)
  return (
    <div className='village-summary__line'>
      <span className='village-summary__line-num'>{lineNumber}.</span>
      <div className='village-summary__line-body'>
        <div className='village-summary__line-inner'>
          <div className='village-summary__line-main'>
            <Typography.Text className='village-summary__line-name'>
              {title}
            </Typography.Text>
            <span className='village-summary__line-card-wrap'>
              {' ('}
              <PlayingCardLabel card={card} compact />
              {')'}
            </span>
            {onRerollPrimarySlot && rerollPrimarySlot != null ? (
              <Button
                type='text'
                size='small'
                icon={<RedoOutlined />}
                aria-label={fr.village.rerollCard}
                onClick={() => onRerollPrimarySlot(rerollPrimarySlot)}
                className='village-summary__line-reroll'
              />
            ) : null}
          </div>
          <span
            className='village-summary__line-page'
            aria-label={`${fr.village.rulebookPageAria}: ${pagesLabel}`}>
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
