import { Col, Collapse, Row, Statistic } from 'antd'
import { useCharacterContext } from '../PageCharacterSheet/CharacterContext'
import { StatPool } from '@/lib/character/types'
import { useTranslations } from 'next-intl'

export function CharacterStats() {
  const { getCharacterValue } = useCharacterContext()
  const t = useTranslations()

  return (
    <Collapse
      items={[
        {
          key: 1,
          label: t('characters.main_characteristics'),
          children: (
            <Row>
              <Col span={6}>
                <Statistic
                  title={t('characters.identity.inspiration_label')}
                  value={getCharacterValue('inspiration')}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title={t('characters.identity.honor_label')}
                  value={getCharacterValue('honor')}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title={t('characters.identity.courage_label')}
                  value={(getCharacterValue('courage') as StatPool).current}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title={t('characters.identity.money_label')}
                  value={getCharacterValue('money')}
                />
              </Col>
            </Row>
          ),
        },
      ]}
    />
  )
}
