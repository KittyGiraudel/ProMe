'use client'

import { Card, Form, Select, Typography } from 'antd'
import type { InheritanceCandidate } from './useInheritanceCandidates'
import { copy } from '@/messages/fr'

export function InheritanceCard({
  candidates,
}: {
  candidates: InheritanceCandidate[]
}) {
  return (
    <Card title={copy.characters.inheritanceSection}>
      <Form.Item
        name='inheritFromCharacterId'
        label={copy.characters.inheritanceSelectLabel}
        help={copy.characters.inheritanceSelectHelp}
        style={{ marginBottom: 0 }}>
        <Select
          allowClear
          placeholder={copy.characters.inheritanceSelectPlaceholder}
          options={candidates.map(candidate => ({
            value: candidate.id,
            label: candidate.label,
          }))}
          notFoundContent={copy.characters.inheritanceEmpty}
        />
      </Form.Item>
    </Card>
  )
}
