'use client'

import RedoOutlined from '@ant-design/icons/lib/icons/RedoOutlined'
import { Tooltip, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/Button/Button'
import { HelpButton } from '@/components/HelpButton/HelpButton'
import { PlayingCardLabel } from '@/components/PlayingCardLabel/PlayingCardLabel'
import { establishmentDetailRulebookPage } from '@/constants/rulebookPages'
import type { PlayingCard } from '@/lib/types'
import { formatRulebookReference } from '@/lib/village/formatRulebookReference'
import {
  type OwnerEntry,
  VillageEstablishmentOwners,
} from './VillageEstablishmentOwners'

export type VillageEstablishmentLineProps = {
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
  ownerEntries?: OwnerEntry[]
  onRerollOwner?: (ownerIndex: number) => void
}

export function VillageEstablishmentLine({
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
    <li className='VillageSummary__item'>
      <div className='VillageSummary__container'>
        <Typography.Text>
          {title}
          <Tooltip title={pagesLabel}>
            <HelpButton label={t('rulebook.information')} />
          </Tooltip>
        </Typography.Text>

        <PlayingCardLabel card={card} compact />
        <Tooltip title={t('common.actions.reroll_card')}>
          <Button
            type='text'
            size='small'
            disabled={!onRerollPrimarySlot || rerollPrimarySlot == null}
            icon={<RedoOutlined />}
            aria-label={t('common.actions.reroll_card')}
            onClick={() => onRerollPrimarySlot?.(rerollPrimarySlot!)}
          />
        </Tooltip>
      </div>

      <VillageEstablishmentOwners
        entries={ownerEntries}
        onRerollOwner={onRerollOwner}
      />
    </li>
  )
}
