'use client'

import { QuestionCircleOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  Space,
  Tooltip,
  Typography,
} from 'antd'
import { copy } from '@/messages/fr'
import type { FormListFieldData } from 'antd'
import { randomId } from '@/lib/playerCharacter/model'

export function SpellbookCard() {
  return (
    <Form.List name='spellbook'>
      {(fields, { add, remove }) => (
        <>
          <Card
            title={
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                <span>{copy.playerCharacters.spellbookSection}</span>
                <Tooltip title={copy.playerCharacters.spellbookFootnote}>
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
                {copy.playerCharacters.spellbookStatus(fields.length)}
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
                    label={copy.playerCharacters.spellNamePlaceholder}
                    noStyle>
                    <Input
                      placeholder={copy.playerCharacters.spellNamePlaceholder}
                      style={{ flex: 1, minWidth: 220 }}
                    />
                  </Form.Item>

                  <Form.Item
                    name={[field.name, 'note']}
                    label={copy.playerCharacters.spellNotePlaceholder}
                    noStyle>
                    <Input
                      placeholder={copy.playerCharacters.spellNotePlaceholder}
                      style={{ width: 240 }}
                    />
                  </Form.Item>

                  <Button
                    danger
                    onClick={() => remove(field.name)}
                    htmlType='button'>
                    {copy.playerCharacters.delete}
                  </Button>
                </div>
              ))}
            </Space>
            <Divider />
            <Space
              wrap
              align='end'
              style={{ width: '100%' }}
              orientation='vertical'>
              <Button
                type='dashed'
                onClick={() =>
                  add({
                    id: randomId(),
                    label: '',
                    quantity: 1,
                    note: '',
                  })
                }
                disabled={fields.length >= 6}
                htmlType='button'>
                {copy.playerCharacters.addSpell}
              </Button>
            </Space>
          </Card>
        </>
      )}
    </Form.List>
  )
}
