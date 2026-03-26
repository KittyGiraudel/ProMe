import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Col, Row } from 'antd'
import { CardDraw } from '@/components/CardDraw/CardDraw'
import { DiceRoll } from '@/components/DiceRoll/DiceRoll'

type Props = { params: Promise<{ locale: AppConfig['Locale'] }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('characters.tools.title'),
  }
}

export default function CharacterToolsPage() {
  return (
    <Row gutter={16}>
      <Col span={12}>
        <DiceRoll />
      </Col>
      <Col span={12}>
        <CardDraw />
      </Col>
    </Row>
  )
}
