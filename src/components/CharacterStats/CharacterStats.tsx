import { Col, Collapse, Row, Statistic } from 'antd'
import { useTranslations } from 'next-intl'
import {
  useWatchedCourage,
  useWatchedHonor,
  useWatchedInspiration,
  useWatchedMoney,
} from '@/hooks/useCharacterSheetDerived'

export function CharacterStats() {
  const t = useTranslations()
  const { courage } = useWatchedCourage()
  const { inspiration } = useWatchedInspiration()
  const { honor } = useWatchedHonor()
  const { money } = useWatchedMoney()

  return (
    <Collapse
      items={[
        {
          key: 1,
          label: t('characters.main_characteristics'),
          children: (
            <Row gutter={[16, 16]}>
              <Col xs={12} md={6}>
                <Statistic
                  title={t('characters.identity.honor_label')}
                  value={honor}
                />
              </Col>
              <Col xs={12} md={6}>
                <Statistic
                  title={t('characters.identity.inspiration_label')}
                  value={inspiration}
                />
              </Col>
              <Col xs={12} md={6}>
                <Statistic
                  title={t('characters.identity.courage_label')}
                  value={courage.current}
                />
              </Col>
              <Col xs={12} md={6}>
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
