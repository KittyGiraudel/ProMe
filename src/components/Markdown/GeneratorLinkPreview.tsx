'use client'

import { useMemo, useState } from 'react'
import { Empty, Modal } from 'antd'
import { useTranslations } from 'next-intl'
import { parseGeneratorLink } from '@/lib/markdown/generatorLink'
import { decodeInhabitantRollParam } from '@/lib/inhabitant/inhabitantUrlCodec'
import {
  decodeVillageIdParam,
  decodeVillageIdRollParam,
} from '@/lib/village/villageIdCodec'
import { InhabitantSummary } from '@/components/InhabitantSummary/InhabitantSummary'
import { VillageSummary } from '@/components/VillageSummary/VillageSummary'
import { Button } from '../Button/Button'

export function GeneratorLinkPreview({
  href,
  label,
}: {
  href: string
  label: string
}) {
  const t = useTranslations()
  const [open, setOpen] = useState(false)

  const parsed = useMemo(() => parseGeneratorLink(href), [href])
  const decoded = useMemo(() => {
    if (!parsed) return null
    if (parsed.kind === 'npc') {
      const roll = decodeInhabitantRollParam(parsed.encodedId, t)
      return roll ? { kind: 'npc' as const, roll } : null
    }
    const result = decodeVillageIdParam(parsed.encodedId, t)
    if (result) return { kind: 'village' as const, ...result }

    // Village URLs in the wild may include only the roll segment (or have owners
    // that fail validation). In that case, still show the village details without owners.
    const rollOnly = decodeVillageIdRollParam(parsed.encodedId)
    return rollOnly
      ? { kind: 'village-roll-only' as const, roll: rollOnly }
      : null
  }, [parsed, t])

  const title =
    parsed?.kind === 'npc' ? t('inhabitant.title') : t('village.title')

  return (
    <>
      <a
        href={href}
        onClick={event => {
          // Keep link semantics for copy/open-in-new-tab, but default click opens modal.
          event.preventDefault()
          setOpen(true)
        }}>
        {label}
      </a>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
        centered
        width={860}
        title={title}
        footer={(_, { OkBtn }) => (
          <>
            <Button href={href} target='_blank' rel='noreferrer' variant='link'>
              {t('common.open_in_new_tab')}
            </Button>
            <OkBtn />
          </>
        )}>
        {decoded?.kind === 'npc' ? (
          <InhabitantSummary roll={decoded.roll} />
        ) : decoded?.kind === 'village' ? (
          <VillageSummary roll={decoded.roll} owners={decoded.owners} />
        ) : decoded?.kind === 'village-roll-only' ? (
          <VillageSummary roll={decoded.roll} owners={null} />
        ) : (
          <Empty description={t('common.could_not_parse_link')}>
            <a href={href} target='_blank' rel='noreferrer'>
              {t('common.open_in_new_tab')}
            </a>
          </Empty>
        )}
      </Modal>
    </>
  )
}
