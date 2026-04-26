'use client'

import { Card, Col, Form, Input, Row, Select } from 'antd'
import { useTranslations } from 'next-intl'
import { GENDERS } from '@/constants/misc'
import { useWatchedIdentity } from '@/hooks/useCharacterSheetDerived'

import './IdentityCard.css'

export function IdentityCard({
  isArchetypeReadonly = false,
}: {
  isArchetypeReadonly?: boolean
}) {
  const t = useTranslations()
  const { gender, archetype } = useWatchedIdentity()

  return (
    <Card title={t('characters.identity.identity_section')} id='identity'>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Form.Item
            rules={[{ required: true }]}
            name='name'
            label={t('characters.identity.name_label')}
            style={{ marginBottom: 0 }}>
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            rules={[{ required: true }]}
            name='archetype'
            label={t('characters.identity.archetype_label')}
            style={{ marginBottom: 0 }}>
            <Select
              disabled={isArchetypeReadonly}
              style={{ width: '100%' }}
              options={[
                {
                  value: 'swordbearer',
                  label: t('common.archetypes.name.swordbearer', { gender }),
                },
                {
                  value: 'wanderer',
                  label: t('common.archetypes.name.wanderer', { gender }),
                },
                {
                  value: 'troubadour',
                  label: t('common.archetypes.name.troubadour', { gender }),
                },
              ]}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            name='gender'
            label={t('characters.identity.gender_label')}
            style={{ marginBottom: 0 }}>
            <Select
              allowClear
              style={{ width: '100%' }}
              options={GENDERS.map(gender => ({
                value: gender,
                label: t(`common.genders.${gender}`),
              }))}
            />
          </Form.Item>
        </Col>
      </Row>

      {archetype ? (
        <Row style={{ marginTop: 16 }}>
          <Col xs={24}>
            <p className='IdentityCard__Power'>
              <strong>{t(`common.archetypes.power.${archetype}_title`)}</strong>
              {t(`common.archetypes.power.${archetype}_description`)}
            </p>
          </Col>
        </Row>
      ) : null}
    </Card>
  )
}
