'use client'

import { Card, Empty, Space, Tooltip } from 'antd'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { HelpButton } from '@/components/HelpButton/HelpButton'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import type { InhabitantRoll } from '@/lib/inhabitant/generate'
import type { VillageRoll } from '@/lib/village/generate'
import { groupEstablishments } from '@/lib/village/groupEstablishments'
import {
  ownerSlotIndexByEstablishmentIndex,
  resolveVillageDisplay,
} from '@/lib/village/resolveVillageDisplay'
import { GroupedEstablishmentsList } from './GroupedEstablishmentsList'
import { TraitsList } from './TraitsList'
import { UngroupedEstablishmentsList } from './UngroupedEstablishmentsList'

import './VillageSummary.css'

export type VillageSummaryProps = {
  roll: VillageRoll | null
  owners: InhabitantRoll[] | null
  onRerollPrimarySlot?: (slotIndex: number) => void
  onRerollOwner?: (ownerIndex: number) => void
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

  if (!roll || !display) {
    return (
      <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
        <Card>
          <Empty
            description={t('village.empty_summary', {
              button: t('common.actions.generate'),
            })}
          />
        </Card>
      </Space>
    )
  }

  return (
    <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
      <Card
        title={t('village.section_establishments')}
        extra={
          <Tooltip title={t('rulebook.village_footnote')}>
            <HelpButton label={t('rulebook.information')} />
          </Tooltip>
        }>
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
        <Card
          title={t('village.section_traits')}
          extra={
            <Tooltip title={t('rulebook.village_footnote')}>
              <HelpButton label={t('rulebook.information')} />
            </Tooltip>
          }>
          <TraitsList
            traits={display.traits}
            onRerollPrimarySlot={onRerollPrimarySlot}
          />
        </Card>
      ) : null}
    </Space>
  )
}
