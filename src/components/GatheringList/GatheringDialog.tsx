'use client'

import { Alert, Empty, Modal, Tabs, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import { BIOME_IDS } from '@/lib/constants/misc'
import type { GatherableBiomeId } from '@/lib/gathering/schema'
import { GATHERING_SCHEMA } from '@/lib/gathering/schema'
import type { BiomeId, TranslationKey } from '@/lib/types'
import { BiomeBubble } from '../BiomeBubble/BiomeBubble'
import { GatheringList } from './GatheringList'

type Props = {
  open: boolean
  onClose: () => void
  currentBiome: BiomeId | 'unexplored'
}

export function GatheringDialog({ open, onClose, currentBiome }: Props) {
  const t = useTranslations()
  const defaultActiveKey =
    currentBiome === 'unexplored' ? BIOME_IDS[0] : currentBiome

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={t('characters.map.gathering_dialog_title')}
      footer={null}
      destroyOnHidden>
      <Tabs
        defaultActiveKey={defaultActiveKey}
        items={BIOME_IDS.map(biome => {
          const baseKey = `common.gathering.${biome as GatherableBiomeId}`
          const hintKey = `${baseKey}.hint` as TranslationKey
          const warnKey = `${baseKey}.warning` as TranslationKey
          const key = t.has(hintKey)
            ? hintKey
            : t.has(warnKey)
              ? warnKey
              : undefined
          return {
            key: biome,
            label: (
              <>
                <BiomeBubble biome={biome} /> {t(`common.biomes.${biome}`)}
              </>
            ),
            children: GATHERING_SCHEMA[biome] ? (
              <>
                <GatheringList biome={biome as GatherableBiomeId} />
                {key && (
                  <Alert
                    type={key.includes('warning') ? 'warning' : 'info'}
                    title={t(key)}
                    style={{ marginTop: '1em' }}
                  />
                )}
              </>
            ) : (
              <Empty description={t('characters.map.gathering_empty')} />
            ),
          }
        })}
      />
    </Modal>
  )
}
