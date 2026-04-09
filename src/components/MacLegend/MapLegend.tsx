import { useTranslations } from 'next-intl'
import { BIOME_IDS } from '@/lib/constants/misc'
import { BiomeBubble } from '../BiomeBubble/BiomeBubble'
import { useSettings } from '../PageSettings/SettingsContext'

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
        {t('common.biomes.unexplored')}
      </li>
      {BIOME_IDS.map(biome => (
        <li key={biome}>
          <BiomeBubble
            biome={biome}
            style={{ fontSize: '1.8em' } as React.CSSProperties}
            withPattern={settings.map.showBiomeBackground}
          />
          {t(`common.biomes.${biome}`)}
        </li>
      ))}
    </ul>
  )
}
