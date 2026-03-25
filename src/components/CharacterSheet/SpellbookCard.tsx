'use client'

import { QuestionCircleOutlined } from '@ant-design/icons'
import {
  Card,
  ConfigProvider,
  Divider,
  Form,
  Input,
  Space,
  Tooltip,
  Typography,
} from 'antd'
import type { FormListFieldData } from 'antd/es/form'
import { Button } from '@/components/Button/Button'
import { useLocalize } from '@/app/contexts/LocalizationContext'

const SPELLBOOK_MAX = 6

export function SpellbookCard({
  fields,
  onAddSpell,
  onRemoveSpell,
}: {
  fields: FormListFieldData[]
  onAddSpell: () => void
  onRemoveSpell: (index: number | number[]) => void
}) {
  const { componentDisabled } = ConfigProvider.useConfig()
  const localize = useLocalize()
  return (
    <Card
      title={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <span>{localize.string('characters.spellbookSection')}</span>
          <Tooltip title={localize.string('characters.spellbookFootnote')}>
            <Button
              type='text'
              size='small'
              htmlType='button'
              icon={<QuestionCircleOutlined />}
              aria-label={localize.string('rulebook.information')}
            />
          </Tooltip>
        </div>
      }>
      <Space orientation='vertical' style={{ width: '100%' }}>
        <Typography.Text type='secondary'>
          {localize.string('characters.spellbookStatus', {
            count: fields.length,
          })}
        </Typography.Text>
        {fields.map(field => (
          <div
            key={field.key}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              width: '100%',
              alignItems: 'center',
            }}>
            <Form.Item
              name={[field.name, 'name']}
              label={localize.string('characters.spellNamePlaceholder')}
              noStyle>
              <Input
                placeholder={localize.string('characters.spellNamePlaceholder')}
                style={{ flex: 1, minWidth: 220 }}
              />
            </Form.Item>

            <Form.Item
              name={[field.name, 'note']}
              label={localize.string('characters.spellNotePlaceholder')}
              noStyle>
              <Input
                placeholder={localize.string('characters.spellNotePlaceholder')}
                style={{ width: 240 }}
              />
            </Form.Item>

            <Button
              danger
              onClick={() => onRemoveSpell(field.name)}
              htmlType='button'>
              {localize.string('common.delete')}
            </Button>
          </div>
        ))}
      </Space>
      {!componentDisabled && (
        <>
          <Divider />
          <Space
            wrap
            align='end'
            style={{ width: '100%' }}
            orientation='vertical'>
            <Button
              type='dashed'
              onClick={onAddSpell}
              disabled={fields.length >= SPELLBOOK_MAX}
              htmlType='button'>
              {localize.string('characters.addSpell')}
            </Button>
          </Space>
        </>
      )}
    </Card>
  )
}
