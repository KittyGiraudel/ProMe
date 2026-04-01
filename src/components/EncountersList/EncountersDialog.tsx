'use client'

import { App, Modal, Space, Tabs } from 'antd'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/Button/Button'
import { CardDrawResult } from '@/components/CardDraw/CardDrawResult'
import { DiceRollResult } from '@/components/DiceRoll/DiceRollResult'
import { BIOME_IDS } from '@/lib/constants/misc'
import type { BiomeId } from '@/lib/types'
import { BiomeBubble } from '../BiomeBubble/BiomeBubble'
import { EncountersList } from './EncountersList'

type Props = {
  open: boolean
  onClose: () => void
  currentBiome: BiomeId | 'unexplored'
}

export function EncountersDialog({ open, onClose, currentBiome }: Props) {
  const t = useTranslations()
  const { notification } = App.useApp()
  const defaultActiveKey =
    currentBiome === 'unexplored' ? BIOME_IDS[0] : currentBiome

  function handleDrawCard() {
    notification.open({
      title: t('characters.tools.card_title'),
      description: <CardDrawResult />,
      placement: 'bottomLeft',
    })
  }

  function handleRollDie() {
    notification.open({
      title: t('characters.tools.die_title'),
      description: <DiceRollResult />,
      placement: 'bottomLeft',
    })
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={t('characters.map.encounters_dialog_title')}
      footer={
        <Space>
          <Button htmlType='button' type='link' onClick={handleDrawCard}>
            {t('characters.tools.card_action')}
          </Button>
          <Button htmlType='button' type='link' onClick={handleRollDie}>
            {t('characters.tools.die_action')}
          </Button>
        </Space>
      }
      width='min(900px, 96vw)'
      destroyOnHidden>
      <Tabs
        defaultActiveKey={defaultActiveKey}
        items={BIOME_IDS.map(biome => ({
          key: biome,
          label: (
            <>
              <BiomeBubble biome={biome} /> {t(`common.biomes.${biome}`)}
            </>
          ),
          children: <EncountersList biome={biome} />,
        }))}
      />
    </Modal>
  )
}
