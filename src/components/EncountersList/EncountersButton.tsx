'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Button } from '@/components/Button/Button'
import type { BiomeId } from '@/lib/types'
import { EncountersDialog } from './EncountersDialog'

export function EncountersButton({
  currentBiome,
}: {
  currentBiome: BiomeId | 'unexplored'
}) {
  const t = useTranslations()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button type='link' htmlType='button' onClick={() => setOpen(true)}>
        {t('characters.map.encounters_button')}
      </Button>
      <EncountersDialog
        open={open}
        onClose={() => setOpen(false)}
        currentBiome={currentBiome}
      />
    </>
  )
}
