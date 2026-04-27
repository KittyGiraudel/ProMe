'use client'

import { Empty, Modal, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { AppLinkButton } from '@/components/AppLinkButton/AppLinkButton'
import { InhabitantSummary } from '@/components/InhabitantSummary/InhabitantSummary'
import { AppLink } from '@/components/Navigation/AppLink'
import { VillageSummary } from '@/components/VillageSummary/VillageSummary'
import { useCharacterQuery } from '@/hooks/useQuery'
import type { AppRouteTo } from '@/i18n/navigation'
import { decodeInhabitantRollParam } from '@/lib/inhabitant/inhabitantUrlCodec'
import {
  decodeVillageIdParam,
  decodeVillageIdRollParam,
} from '@/lib/village/villageIdCodec'

import './JournalReferencePreview.css'

/** Rich inline link for `{village/…}`, `{npc/…}`, or `{protector/…}` journal tokens. */
export type JournalReferencePreviewProps =
  | {
      kind: 'village'
      /** Village route `[id]` segment (roll + owners). */
      referenceId: string
      href?: AppRouteTo
      label: string
      className?: string
    }
  | {
      kind: 'npc'
      /** Encoded NPC roll payload (same as generator path segment). */
      referenceId: string
      href?: AppRouteTo
      label: string
      className?: string
    }
  | {
      kind: 'protector'
      /** Character id from the local store (same idea: opaque id string). */
      referenceId: string
      href?: AppRouteTo
      label: string
      className?: string
    }

/**
 * Click opens a modal with a summary; the anchor still carries `href` for open-in-new-tab / copy link.
 */
export function JournalReferencePreview(props: JournalReferencePreviewProps) {
  const t = useTranslations()
  const [open, setOpen] = useState(false)
  const referenceId = props.referenceId

  const { data: protectorCharacter } = useCharacterQuery({
    id: props.referenceId,
    skip: props.kind !== 'protector',
  })

  const decoded = useMemo(() => {
    if (props.kind === 'npc') {
      const roll = decodeInhabitantRollParam(referenceId, t)
      return roll ? { kind: 'npc' as const, roll } : null
    }
    if (props.kind === 'village') {
      const result = decodeVillageIdParam(referenceId, t)
      if (result) return { kind: 'village' as const, ...result }

      const rollOnly = decodeVillageIdRollParam(referenceId)
      return rollOnly
        ? { kind: 'village-roll-only' as const, roll: rollOnly }
        : null
    }
    return protectorCharacter
      ? { kind: 'protector' as const, character: protectorCharacter }
      : null
  }, [props.kind, referenceId, t, protectorCharacter])

  if (!props.href) {
    return (
      <span
        className={['JournalReferencePreview__static', props.className]
          .filter(Boolean)
          .join(' ')}>
        {props.label}
      </span>
    )
  }
  const href = props.href

  const modalTitle =
    props.kind === 'npc'
      ? t('inhabitant.title')
      : props.kind === 'village'
        ? t('village.title')
        : t('characters.identity.title')

  return (
    <>
      <AppLink
        className={props.className}
        to={props.href}
        onClick={event => {
          event.preventDefault()
          setOpen(true)
        }}>
        {props.label}
      </AppLink>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
        centered
        width={860}
        title={modalTitle}
        destroyOnHidden
        footer={(_, { OkBtn }) => (
          <>
            <AppLinkButton to={href} target='_blank' variant='link'>
              {t('common.actions.open_in_new_tab')}
            </AppLinkButton>
            <OkBtn />
          </>
        )}>
        {decoded?.kind === 'npc' ? (
          <InhabitantSummary roll={decoded.roll} />
        ) : decoded?.kind === 'village' ? (
          <VillageSummary roll={decoded.roll} owners={decoded.owners} />
        ) : decoded?.kind === 'village-roll-only' ? (
          <VillageSummary roll={decoded.roll} owners={null} />
        ) : decoded?.kind === 'protector' ? (
          <div>
            <Typography.Title
              level={4}
              className='JournalReferencePreview__title'>
              {decoded.character.name}
            </Typography.Title>
            <Typography.Text type='secondary'>
              {t('characters.identity.archetype_label')} :{' '}
              {t(`common.archetypes.name.${decoded.character.archetype}`, {
                gender: decoded.character.gender ?? 'indeterminate',
              })}
            </Typography.Text>
          </div>
        ) : (
          <Empty description={t('common.could_not_parse_link')}>
            <AppLinkButton to={href} target='_blank' variant='link'>
              {t('common.actions.open_in_new_tab')}
            </AppLinkButton>
          </Empty>
        )}
      </Modal>
    </>
  )
}
