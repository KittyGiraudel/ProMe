import { useTranslations } from 'next-intl'
import { BiomeBubble } from '@/components/BiomeBubble/BiomeBubble'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { BIOME_IDS } from '@/constants/misc'

import './MapLegend.css'

export function MapLegend() {
  const t = useTranslations()
  const { settings } = useSettings()

  return (
    <ul className='MapLegend'>
      <li>
        <BiomeBubble
          biome='unexplored'
          style={
            {
              fontSize: '1.8em',
            } as React.CSSProperties
          }
        />
        {t('biomes.unexplored.name')}
      </li>
      {BIOME_IDS.map(biome => (
        <li key={biome}>
          <BiomeBubble
            biome={biome}
            style={{ fontSize: '1.8em' } as React.CSSProperties}
            withPattern={settings.map.showBiomeBackground}
          />
          {t(`biomes.${biome}.name`)}
        </li>
      ))}
    </ul>
  )
}
