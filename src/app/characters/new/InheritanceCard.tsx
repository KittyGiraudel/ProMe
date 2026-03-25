'use client'

import { Card, Form, Select, Typography } from 'antd'
import type { InheritanceCandidate } from './useInheritanceCandidates'
import { useLocalize } from '@/app/contexts/LocalizationContext'

export function InheritanceCard({
  candidates,
}: {
  candidates: InheritanceCandidate[]
}) {
  const localize = useLocalize()

  return (
    <Card title={localize.string('characters.inheritanceSection')}>
      <Form.Item
        name='inheritFromCharacterId'
        label={localize.string('characters.inheritanceSelectLabel')}
        help={localize.string('characters.inheritanceSelectHelp')}
        style={{ marginBottom: 0 }}>
        <Select
          allowClear
          placeholder={localize.string(
            'characters.inheritanceSelectPlaceholder'
          )}
          options={candidates.map(candidate => ({
            value: candidate.id,
            label: candidate.label,
          }))}
          notFoundContent={localize.string('characters.inheritanceEmpty')}
        />
      </Form.Item>
    </Card>
  )
}
