'use client'

import { useTranslations } from 'next-intl'
import { getDefaultPoolsForArchetype } from '@/lib/character/model'
import type { Archetype } from '@/lib/character/types'
import './ArchetypeSelector.css'

const ARCHETYPE_ICONS: Record<Archetype, string> = {
  warrior: '⚔️',
  pilgrim: '🧳',
  bard: '🎵',
}

const ARCHETYPES: Archetype[] = ['warrior', 'pilgrim', 'bard']

type Props = {
  value?: Archetype
  onChange?: (value: Archetype) => void
}

export function ArchetypeSelector({ value, onChange }: Props) {
  const t = useTranslations()

  return (
    <fieldset className='ArchetypeSelector'>
      {ARCHETYPES.map(archetype => {
        const pools = getDefaultPoolsForArchetype(archetype)

        return (
          <label key={archetype} className='ArchetypeSelector__Card'>
            <input
              type='radio'
              className='ArchetypeSelector__Input'
              name='archetype'
              value={archetype}
              checked={value === archetype}
              onChange={() => onChange?.(archetype)}
            />
            <div
              className={`ArchetypeSelector__Image ArchetypeSelector__Image--${archetype}`}>
              <span className='ArchetypeSelector__Icon'>
                {ARCHETYPE_ICONS[archetype]}
              </span>
            </div>
            <div className='ArchetypeSelector__Body'>
              <div className='ArchetypeSelector__Name'>
                {t(`common.archetypes.name.${archetype}`, {
                  gender: 'indeterminate',
                })}
              </div>
              <blockquote className='ArchetypeSelector__Quote'>
                {t(`common.archetypes.lore.${archetype}`)}
              </blockquote>
              <div className='ArchetypeSelector__Stats'>
                <div className='ArchetypeSelector__StatPill'>
                  <span className='ArchetypeSelector__StatLabel'>
                    {t('characters.identity.health_label_short')}
                  </span>
                  <span className='ArchetypeSelector__StatValue ArchetypeSelector__StatValue--health'>
                    {pools.health.max}
                  </span>
                </div>
                <div className='ArchetypeSelector__StatPill'>
                  <span className='ArchetypeSelector__StatLabel'>
                    {t('characters.identity.courage_label_short')}
                  </span>
                  <span className='ArchetypeSelector__StatValue ArchetypeSelector__StatValue--courage'>
                    {pools.courage.max}
                  </span>
                </div>
                <div className='ArchetypeSelector__StatPill'>
                  <span className='ArchetypeSelector__StatLabel'>
                    {t('characters.identity.stamina_label_short')}
                  </span>
                  <span className='ArchetypeSelector__StatValue ArchetypeSelector__StatValue--stamina'>
                    {pools.stamina.max}
                  </span>
                </div>
              </div>
              <div className='ArchetypeSelector__Power'>
                <span className='ArchetypeSelector__PowerLabel'>
                  {t('characters.identity.archetype_power_label')}
                </span>
                {t(`common.archetypes.power.${archetype}_description`)}
              </div>
            </div>
          </label>
        )
      })}
    </fieldset>
  )
}
