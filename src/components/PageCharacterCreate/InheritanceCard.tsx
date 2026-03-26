'use client'

import { useTranslations } from 'next-intl'
import { Card, Form, Select } from 'antd'
import type { InheritanceCandidate } from './useInheritanceCandidates'

export function InheritanceCard({
  candidates,
}: {
  candidates: InheritanceCandidate[]
}) {
  const t = useTranslations()

  return (
    <Card title={t('new_character.inheritance_section')}>
      <Form.Item
        name='inheritFromCharacterId'
        label={t('new_character.inheritance_select_label')}
        help={t('new_character.inheritance_select_help')}
        style={{ marginBottom: 0 }}>
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
    </Card>
  )
}
