'use client'

import { Card, Form, Select, Typography } from 'antd'
import type { InheritanceCandidate } from './useInheritanceCandidates'
import { useTranslations } from 'next-intl'

export function InheritanceCard({
  candidates,
}: {
  candidates: InheritanceCandidate[]
}) {
  const t = useTranslations()

  return (
    <Card title={t('characters.inheritance_section')}>
      <Form.Item
        name='inheritFromCharacterId'
        label={t('characters.inheritance_select_label')}
        help={t('characters.inheritance_select_help')}
        style={{ marginBottom: 0 }}>
        <Select
          allowClear
          placeholder={t('characters.inheritance_select_placeholder')}
          options={candidates.map(candidate => ({
            value: candidate.id,
            label: candidate.label,
          }))}
          notFoundContent={t('characters.inheritance_empty')}
        />
      </Form.Item>
    </Card>
  )
}
