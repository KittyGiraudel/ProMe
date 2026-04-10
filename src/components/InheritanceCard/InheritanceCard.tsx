'use client'

import { Alert, Card, Divider, Form, Select } from 'antd'
import { useTranslations } from 'next-intl'
import { CardCover } from '@/components/CardCover/CardCover'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import type { InheritanceCandidate } from '@/hooks/useInheritanceCandidates'
import type { Archetype } from '@/lib/character/types'

import './InheritanceCard.css'

export function InheritanceCard({
  candidates,
}: {
  candidates: InheritanceCandidate[]
}) {
  const { settings } = useSettings()
  const t = useTranslations()
  const form = Form.useFormInstance()
  const selectedId = Form.useWatch<string>('inheritFromCharacterId', {
    form,
    preserve: true,
  })
  const newArchetype = Form.useWatch<Archetype>('archetype', {
    form,
    preserve: true,
  })
  const newName = Form.useWatch<string>('name', { form, preserve: true }) ?? ''

  const selectedCandidate = candidates.find(c => c.id === selectedId)

  const description = selectedCandidate
    ? newArchetype === selectedCandidate.character.archetype
      ? t('new_character.inheritance_same_archetype_description', {
          nameNew: newName,
          nameOld: selectedCandidate.label,
        })
      : t('new_character.inheritance_different_archetype_description', {
          nameNew: newName,
          nameOld: selectedCandidate.label,
        })
    : null

  return (
    <>
      {settings.appearance.showImagery && (
        <CardCover
          url='/images/banner-core.avif'
          title={t('new_character.inheritance_section')}
          titleAs='h2'
          data-biome='unexplored'
          className='InheritanceCard__Cover'
          height='10em'
        />
      )}
      <Card
        className='InheritanceCard'
        title={
          settings.appearance.showImagery
            ? undefined
            : t('new_character.inheritance_section')
        }>
        <Form.Item
          name='inheritFromCharacterId'
          label={t('new_character.inheritance_select_label')}>
          <Select
            allowClear
            placeholder={t('new_character.inheritance_select_placeholder')}
            options={candidates.map(candidate => ({
              value: candidate.id,
              label: candidate.label,
            }))}
            notFoundContent={t('new_character.inheritance_empty')}
          />
        </Form.Item>

        {description && (
          <Alert
            className='InheritanceCard__Alert'
            description={description}
            type='info'
          />
        )}
        <Divider className='InheritanceCard__Divider' />
        <div className='InheritanceCard__Cols'>
          <div>
            <h3 className='InheritanceCard__ColLabel InheritanceCard__ColLabel--inherited'>
              {t('new_character.inheritance_list_inherited_label')}
            </h3>
            <ul className='InheritanceCard__List'>
              <li className='InheritanceCard__Row InheritanceCard__Row--inherited'>
                <span className='InheritanceCard__Dot' aria-hidden='true' />
                <span>{t('new_character.inheritance_inherited_map')}</span>
              </li>
              <li className='InheritanceCard__Row InheritanceCard__Row--inherited'>
                <span className='InheritanceCard__Dot' aria-hidden='true' />
                <span>{t('new_character.inheritance_inherited_journal')}</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='InheritanceCard__ColLabel InheritanceCard__ColLabel--fresh'>
              {t('new_character.inheritance_list_not_inherited_label')}
            </h3>
            <ul className='InheritanceCard__List'>
              <li className='InheritanceCard__Row InheritanceCard__Row--fresh'>
                <span className='InheritanceCard__Dot' aria-hidden='true' />
                <span>
                  {t('new_character.inheritance_not_soul_courage_stamina')}
                </span>
              </li>
              <li className='InheritanceCard__Row InheritanceCard__Row--fresh'>
                <span className='InheritanceCard__Dot' aria-hidden='true' />
                <span>
                  {t('new_character.inheritance_not_honor_inspiration')}
                </span>
              </li>
              <li className='InheritanceCard__Row InheritanceCard__Row--fresh'>
                <span className='InheritanceCard__Dot' aria-hidden='true' />
                <span>{t('new_character.inheritance_not_gold')}</span>
              </li>
              <li className='InheritanceCard__Row InheritanceCard__Row--fresh'>
                <span className='InheritanceCard__Dot' aria-hidden='true' />
                <span>{t('new_character.inheritance_not_inventory')}</span>
              </li>
              <li className='InheritanceCard__Row InheritanceCard__Row--fresh'>
                <span className='InheritanceCard__Dot' aria-hidden='true' />
                <span>{t('new_character.inheritance_not_spellbook')}</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </>
  )
}
