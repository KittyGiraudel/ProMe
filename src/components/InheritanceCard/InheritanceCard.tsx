'use client'

import { Alert, Card, Form, Select } from 'antd'
import { useTranslations } from 'next-intl'
import type { InheritanceCandidate } from '@/hooks/useInheritanceCandidates'
import type { Archetype } from '@/lib/character/types'

export function InheritanceCard({
  candidates,
}: {
  candidates: InheritanceCandidate[]
}) {
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
    <Card title={t('new_character.inheritance_section')}>
      <Form.Item
        name='inheritFromCharacterId'
        label={t('new_character.inheritance_select_label')}
        help={t('new_character.inheritance_select_help')}
        style={{ marginBottom: description ? undefined : 0 }}>
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
      {description && <Alert title={description} type='info' />}
    </Card>
  )
}
