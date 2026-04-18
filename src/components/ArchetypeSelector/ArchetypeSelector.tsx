'use client'

import { useTranslations } from 'next-intl'
import { ARCHETYPES } from '@/constants/misc'
import { getDefaultPoolsForArchetype } from '@/lib/character/model'
import type { Archetype } from '@/lib/character/types'
import type { Gender } from '@/lib/types'
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden'

import './ArchetypeSelector.css'

type ArchetypeSelectorProps = {
  value?: Archetype
  onChange?: (value: Archetype) => void
  gender?: Gender
}

export function ArchetypeSelector({
  value,
  onChange,
  gender,
}: ArchetypeSelectorProps) {
  const t = useTranslations()

  return (
    <fieldset className='ArchetypeSelector'>
      <VisuallyHidden as='legend'>
        {t('characters.identity.archetype_label')}
      </VisuallyHidden>
      {ARCHETYPES.map(archetype => {
        const pools = getDefaultPoolsForArchetype(archetype)

        return (
          <label
            key={archetype}
            className='ArchetypeSelector__Card'
            style={
              {
                '--archetype-image': `url("/images/archetype-${archetype}.avif")`,
              } as React.CSSProperties
            }>
            <input
              type='radio'
              className='ArchetypeSelector__Input'
              name='archetype'
              value={archetype}
              checked={value === archetype}
              onChange={() => onChange?.(archetype)}
            />
            <div className='ArchetypeSelector__Name'>
              {t(`common.archetypes.name.${archetype}`, {
                gender: gender ?? 'indeterminate',
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
                {t(`common.archetypes.power.${archetype}_title`)}
              </span>
              {t(`common.archetypes.power.${archetype}_description`)}
            </div>
          </label>
        )
      })}
    </fieldset>
  )
}
