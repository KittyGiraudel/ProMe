'use client'

import { RedoOutlined } from '@ant-design/icons'
import { Typography } from 'antd'
import { PlayingCardLabel } from '@/components/PlayingCardLabel/PlayingCardLabel'
import type { PlayingCard } from '@/lib/types'
import { formatRulebookReference } from '@/lib/village/formatRulebookReference'
import {
  VillageEstablishmentOwners,
  type VillageOwnerEntry,
} from './VillageEstablishmentOwners'
import { Button } from '@/components/Button/Button'
import { useTranslations } from 'next-intl'

export type VillageEstablishmentLineProps = {
  lineNumber: number
  title: string
  card: PlayingCard
  rulebookPages: number[]
  rerollPrimarySlot: number | null
  onRerollPrimarySlot?: (slotIndex: number) => void
  inhabitantPageVillageQuery?: string | null
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
  inhabitantPageVillageQuery,
  ownerEntries,
  onRerollOwner,
}: VillageEstablishmentLineProps) {
  const t = useTranslations()
  const pagesLabel = formatRulebookReference(rulebookPages, t)

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
                aria-label={t('common.reroll_card')}
                onClick={() => onRerollPrimarySlot(rerollPrimarySlot)}
                className='village-summary__line-reroll'
              />
            ) : null}
          </div>
          <span
            className='village-summary__line-page'
            aria-label={t('rulebook.page_citation', {
              page: pagesLabel,
            })}>
            {pagesLabel}
          </span>
        </div>
        <VillageEstablishmentOwners
          entries={ownerEntries}
          inhabitantPageVillageQuery={inhabitantPageVillageQuery}
          onRerollOwner={onRerollOwner}
        />
      </div>
    </div>
  )
}
