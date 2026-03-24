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
import { copy } from '@/messages/fr'
import { Button } from '@/components/Button/Button'

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
          <span>{copy.characters.spellbookSection}</span>
          <Tooltip title={copy.characters.spellbookFootnote}>
            <Button
              type='text'
              size='small'
              htmlType='button'
              icon={<QuestionCircleOutlined />}
              aria-label='Informations du livre de règles'
            />
          </Tooltip>
        </div>
      }>
      <Space orientation='vertical' style={{ width: '100%' }}>
        <Typography.Text type='secondary'>
          {copy.characters.spellbookStatus(fields.length)}
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
              label={copy.characters.spellNamePlaceholder}
              noStyle>
              <Input
                placeholder={copy.characters.spellNamePlaceholder}
                style={{ flex: 1, minWidth: 220 }}
              />
            </Form.Item>

            <Form.Item
              name={[field.name, 'note']}
              label={copy.characters.spellNotePlaceholder}
              noStyle>
              <Input
                placeholder={copy.characters.spellNotePlaceholder}
                style={{ width: 240 }}
              />
            </Form.Item>

            <Button
              danger
              onClick={() => onRemoveSpell(field.name)}
              htmlType='button'>
              {copy.characters.delete}
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
              {copy.characters.addSpell}
            </Button>
          </Space>
        </>
      )}
    </Card>
  )
}
