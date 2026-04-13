import InfoCircleFilled from '@ant-design/icons/lib/icons/InfoCircleFilled'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'
import { useNotify } from '@/hooks/useNotify'
import type { RandomBiomeResult } from '@/lib/random/randomBiome'

export function useRandomBiomeDiscoveredNotification() {
  const t = useTranslations()
  const notification = useNotify()

  return useCallback(
    (rolled: RandomBiomeResult) => {
      const biomeName = t(`biomes.${rolled.biome}.name`)
      notification.open({
        icon: (
          <span className='Map__NotificationIcon' data-biome={rolled.biome}>
            <InfoCircleFilled />
          </span>
        ),
        title: t('characters.map.random_biome_discovered_title'),
        description: t('characters.map.random_biome_discovered_description', {
          biomeName,
          additionalTilesToMark: rolled.additionalTilesToMark,
        }),
        duration: 10,
        placement: 'topRight',
      })
    },
    [notification, t]
  )
}
