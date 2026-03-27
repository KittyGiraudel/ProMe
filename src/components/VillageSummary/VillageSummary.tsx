'use client'

import { RedoOutlined } from '@ant-design/icons'
import { useMemo } from 'react'
import { Card, Empty, Space, Typography } from 'antd'
import { encodePlayingCard } from '@/lib/codec/cards'
import type { VillageRoll } from '@/lib/village/generate'
import type { InhabitantRoll } from '@/lib/inhabitant/generate'
import { groupEstablishments } from '@/lib/village/groupEstablishments'
import { PlayingCardLabel } from '@/components/PlayingCardLabel/PlayingCardLabel'
import { RichText } from '@/components/RichText/RichText'
import { formatRulebookReference } from '@/lib/village/formatRulebookReference'
import {
  establishmentDetailRulebookPage,
  RULEBOOK_PAGES,
} from '@/lib/constants/rulebookPages'
import { VillageEstablishmentLine } from './VillageEstablishmentLine'
import { Button } from '@/components/Button/Button'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { useTranslations } from 'next-intl'
import {
  ownerSlotIndexByEstablishmentIndex,
  resolveVillageDisplay,
  type VillageEstablishmentRow,
} from '@/lib/village/resolveVillageDisplay'
import './VillageSummary.css'

type VillageSummaryProps = {
  roll: VillageRoll | null
  owners: InhabitantRoll[] | null
  onRerollPrimarySlot?: (slotIndex: number) => void
  onRerollOwner?: (ownerIndex: number) => void
}

type OwnerEntry = { roll: InhabitantRoll; ownerIndex: number }

function UngroupedEstablishmentsList({
  establishments,
  ownerSlotByEstIndex,
  owners,
  ownersOk,
  onRerollPrimarySlot,
  onRerollOwner,
}: {
  establishments: readonly VillageEstablishmentRow[]
  ownerSlotByEstIndex: readonly (number | null)[]
  owners: InhabitantRoll[] | null
  ownersOk: boolean
  onRerollPrimarySlot?: (slotIndex: number) => void
  onRerollOwner?: (ownerIndex: number) => void
}) {
  return establishments.map((row, i) => {
    const ownerSlot = ownerSlotByEstIndex[i] ?? null
    const ownerEntries: OwnerEntry[] | undefined =
      ownersOk && ownerSlot !== null && owners
        ? [{ roll: owners[ownerSlot]!, ownerIndex: ownerSlot }]
        : undefined

    return (
      <VillageEstablishmentLine
        key={`${encodePlayingCard(row.card)}-${i}`}
        lineNumber={i + 1}
        title={row.text}
        card={row.card}
        rerollPrimarySlot={row.rerollPrimarySlot ?? null}
        onRerollPrimarySlot={onRerollPrimarySlot}
        ownerEntries={ownerEntries}
        onRerollOwner={onRerollOwner}
      />
    )
  })
}

function GroupedEstablishmentsList({
  groupedEstablishments,
  establishments,
  ownerSlotByEstIndex,
  owners,
  ownersOk,
  onRerollPrimarySlot,
  onRerollOwner,
}: {
  groupedEstablishments: ReturnType<typeof groupEstablishments>
  establishments: readonly VillageEstablishmentRow[]
  ownerSlotByEstIndex: readonly (number | null)[]
  owners: InhabitantRoll[] | null
  ownersOk: boolean
  onRerollPrimarySlot?: (slotIndex: number) => void
  onRerollOwner?: (ownerIndex: number) => void
}) {
  return groupedEstablishments.map((g, i) => {
    const rulebookPages = Array.from(
      new Set(
        g.ownerIndices.map(estIdx =>
          establishmentDetailRulebookPage(establishments[estIdx]!.card.rank)
        )
      )
    ).sort((a, b) => a - b)

    const ownerEntries: OwnerEntry[] | undefined =
      ownersOk && owners
        ? g.ownerIndices.flatMap(estIdx => {
            const ownerIndex = ownerSlotByEstIndex[estIdx] ?? null
            if (ownerIndex === null) return []
            return [{ roll: owners[ownerIndex]!, ownerIndex }]
          })
        : undefined

    return (
      <VillageEstablishmentLine
        key={g.key}
        lineNumber={i + 1}
        title={g.text}
        card={g.card}
        rulebookPages={rulebookPages}
        rerollPrimarySlot={g.rerollPrimarySlot}
        onRerollPrimarySlot={onRerollPrimarySlot}
        ownerEntries={ownerEntries}
        onRerollOwner={onRerollOwner}
      />
    )
  })
}

export function VillageSummary({
  roll,
  owners,
  onRerollPrimarySlot,
  onRerollOwner,
}: VillageSummaryProps) {
  const { settings } = useSettings()
  const t = useTranslations()
  const grouped = settings.village.mergeDuplicateEstablishments

  const display = useMemo(
    () => (roll ? resolveVillageDisplay(roll, t) : null),
    [roll, t]
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

  const groupedEstablishments = useMemo(() => {
    if (!display || !grouped) return null
    return groupEstablishments(display.establishments, t)
  }, [display, grouped, t])

  const villageFootnote = (
    <Typography.Paragraph type='secondary' className='VillageSummary__footnote'>
      {t('rulebook.village_footnote')}
    </Typography.Paragraph>
  )

  if (!roll || !display) {
    return (
      <>
        <Card variant='borderless'>
          <Empty
            description={t('village.empty_summary', {
              button: t('village.generate'),
            })}
          />
        </Card>
        {villageFootnote}
      </>
    )
  }

  return (
    <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
      <Card
        className='VillageSummary'
        title={t('village.section_establishments')}>
        {!grouped ? (
          <UngroupedEstablishmentsList
            establishments={display.establishments}
            ownerSlotByEstIndex={ownerSlotByEstIndex ?? []}
            owners={owners}
            ownersOk={Boolean(ownersOk)}
            onRerollPrimarySlot={onRerollPrimarySlot}
            onRerollOwner={onRerollOwner}
          />
        ) : groupedEstablishments ? (
          <GroupedEstablishmentsList
            groupedEstablishments={groupedEstablishments}
            establishments={display.establishments}
            ownerSlotByEstIndex={ownerSlotByEstIndex ?? []}
            owners={owners}
            ownersOk={Boolean(ownersOk)}
            onRerollPrimarySlot={onRerollPrimarySlot}
            onRerollOwner={onRerollOwner}
          />
        ) : (
          <Empty description={t('common.generic_error')} />
        )}
      </Card>

      {display.traits.length > 0 ? (
        <Card title={t('village.section_traits')}>
          <ul className='VillageSummary__trait-list'>
            {display.traits.map(row => (
              <li
                key={row.instances.map(x => x.primarySlot).join('-')}
                className='VillageSummary__trait-item'>
                <div className='VillageSummary__line-inner'>
                  <div className='VillageSummary__line-main'>
                    <RichText text={row.text} />
                    <span className='VillageSummary__line-card-wrap'>
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
                            aria-label={t('common.reroll_card')}
                            onClick={() =>
                              onRerollPrimarySlot(inst.primarySlot)
                            }
                            className='VillageSummary__line-reroll'
                          />
                        ))
                      : null}
                  </div>
                  <span className='VillageSummary__line-page'>
                    {formatRulebookReference(
                      [RULEBOOK_PAGES.village.establishmentTable],
                      t
                    )}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
      {villageFootnote}
    </Space>
  )
}
