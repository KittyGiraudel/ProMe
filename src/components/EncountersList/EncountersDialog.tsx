'use client'

import { Modal, Tabs } from 'antd'
import { useTranslations } from 'next-intl'
import { BiomeBubble } from '@/components/BiomeBubble/BiomeBubble'
import { Button } from '@/components/Button/Button'
import { useCardDrawNotification } from '@/components/CardDrawResult/CardDrawResult'
import { useDiceRollNotification } from '@/components/DiceRollResult/DiceRollResult'
import { Spacing } from '@/components/Spacing/Spacing'
import { BIOME_IDS } from '@/lib/constants/misc'
import type { PossibleBiomeId } from '@/lib/types'
import { EncountersList } from './EncountersList'

type Props = {
  open: boolean
  onClose: () => void
  currentBiome: PossibleBiomeId
}

export function EncountersDialog({ open, onClose, currentBiome }: Props) {
  const t = useTranslations()
  const defaultActiveKey =
    currentBiome === 'unexplored' ? BIOME_IDS[0] : currentBiome
  const openDiceRollNotification = useDiceRollNotification()
  const openCardDrawNotification = useCardDrawNotification()

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={t('characters.map.encounters_dialog_title')}
      footer={
        <Spacing orientation='horizontal' size='small'>
          <Button
            htmlType='button'
            type='link'
            onClick={openCardDrawNotification}>
            {t('characters.tools.card_action')}
          </Button>
          <Button
            htmlType='button'
            type='link'
            onClick={openDiceRollNotification}>
            {t('characters.tools.die_action')}
          </Button>
        </Spacing>
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
