'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Button } from '@/components/Button/Button'
import type { BiomeId } from '@/lib/types'
import { GatheringDialog } from './GatheringDialog'

export function GatheringButton({
  currentBiome,
}: {
  currentBiome: BiomeId | 'unexplored'
}) {
  const t = useTranslations()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button type='link' htmlType='button' onClick={() => setOpen(true)}>
        {t('characters.map.gathering_button')}
      </Button>
      <GatheringDialog
        open={open}
        onClose={() => setOpen(false)}
        currentBiome={currentBiome}
      />
    </>
  )
}
