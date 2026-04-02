import { Col, Collapse, Row, Statistic } from 'antd'
import { useTranslations } from 'next-intl'
import { useWatchedStats } from '@/hooks/useCharacterSheetDerived'

export function CharacterStats() {
  const t = useTranslations()
  const { courage, inspiration, honor, money } = useWatchedStats()

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
                  value={inspiration}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title={t('characters.identity.honor_label')}
                  value={honor}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title={t('characters.identity.courage_label')}
                  value={courage.current}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title={t('characters.identity.money_label')}
                  value={money}
                />
              </Col>
            </Row>
          ),
        },
      ]}
    />
  )
}
