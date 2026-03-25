'use client'

import { RedoOutlined } from '@ant-design/icons'
import { useMemo } from 'react'
import { Card, Empty, Typography } from 'antd'
import { encodePlayingCard } from '@/lib/codec/cards'
import type { VillageRoll } from '@/lib/village/generate'
import type { InhabitantRoll } from '@/lib/inhabitant/generate'
import { groupEstablishments } from '@/lib/village/groupEstablishments'
import { PlayingCardLabel } from '@/components/PlayingCardLabel/PlayingCardLabel'
import { RichText } from '@/components/RichText/RichText'
import { formatRulebookReference } from '@/lib/village/formatRulebookReference'
import { VillageEstablishmentLine } from './VillageEstablishmentLine'
import { Button } from '@/components/Button/Button'
import { useSettings } from '@/app/[locale]/contexts/SettingsContext'
import { useTranslations } from 'next-intl'
import { useVillageGenerator } from '@/app/[locale]/generators/village/useVillageGenerator'
import './VillageSummary.css'

type VillageSummaryProps = {
  roll: VillageRoll | null
  owners: InhabitantRoll[] | null
  /** Appended to inhabitant links so the inhabitant page can offer « Retour au village ». */
  inhabitantPageVillageQuery?: string | null
  onRerollPrimarySlot?: (slotIndex: number) => void
  onRerollOwner?: (ownerIndex: number) => void
}

export function VillageSummary({
  roll,
  owners,
  inhabitantPageVillageQuery,
  onRerollPrimarySlot,
  onRerollOwner,
}: VillageSummaryProps) {
  const { resolveVillageDisplay, ownerSlotIndexByEstablishmentIndex } =
    useVillageGenerator()
  const { settings } = useSettings()
  const t = useTranslations()
  const grouped = settings.village.mergeDuplicateEstablishments

  const display = useMemo(
    () => (roll ? resolveVillageDisplay(roll) : null),
    [roll, t, resolveVillageDisplay]
  )

  const ownerSlotByEstIndex = useMemo(
    () =>
      display
        ? ownerSlotIndexByEstablishmentIndex(display.establishments)
        : null,
    [display, ownerSlotIndexByEstablishmentIndex]
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
            inhabitantPageVillageQuery={inhabitantPageVillageQuery}
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
    return groupEstablishments(display.establishments, t).map((g, i) => (
      <VillageEstablishmentLine
        key={g.key}
        lineNumber={i + 1}
        title={g.text}
        card={g.card}
        rulebookPages={g.rulebookPages}
        rerollPrimarySlot={g.rerollPrimarySlot}
        onRerollPrimarySlot={onRerollPrimarySlot}
        inhabitantPageVillageQuery={inhabitantPageVillageQuery}
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
    inhabitantPageVillageQuery,
    display,
    grouped,
    onRerollOwner,
    onRerollPrimarySlot,
    ownerSlotByEstIndex,
    owners,
    ownersOk,
    t,
  ])

  const villageFootnote = (
    <Typography.Text type='secondary' className='generator-rulebook-footnote'>
      {t('rulebook.village_footnote')}
    </Typography.Text>
  )

  if (!roll || !display) {
    return (
      <>
        <Card
          className='village-summary village-summary--empty'
          variant='borderless'>
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
    <>
      <Card className='village-summary' variant='borderless'>
        <Typography.Title level={5} className='village-summary__section-title'>
          {t('village.section_establishments')}
        </Typography.Title>
        {establishmentBlocks}

        {display.traits.length > 0 ? (
          <div className='village-summary__traits'>
            <Typography.Title
              level={5}
              className='village-summary__section-title'>
              {t('village.section_traits')}
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
                              aria-label={t('common.reroll_card')}
                              onClick={() =>
                                onRerollPrimarySlot(inst.primarySlot)
                              }
                              className='village-summary__line-reroll'
                            />
                          ))
                        : null}
                    </div>
                    <span className='village-summary__line-page'>
                      {formatRulebookReference([row.rulebookPage], t)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Card>
      {villageFootnote}
    </>
  )
}
