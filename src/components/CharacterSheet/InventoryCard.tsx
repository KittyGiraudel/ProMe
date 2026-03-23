'use client'

import { Button, Card, Form, Input, InputNumber, Space, Typography } from 'antd'
import { copy } from '@/messages/fr'
import { randomId } from '@/lib/playerCharacter/model'

export function InventoryCard({ inventoryLimit }: { inventoryLimit: number }) {
  return (
    <Form.List name='inventory'>
      {(fields, { add, remove }) => (
        <Card
          title={copy.playerCharacters.inventorySection}
          extra={
            <Button
              size='small'
              onClick={() =>
                add({
                  id: randomId(),
                  label: '',
                  quantity: 1,
                  note: '',
                })
              }
              disabled={fields.length >= inventoryLimit}
              htmlType='button'>
              {copy.playerCharacters.addItem}
            </Button>
          }>
          <Space orientation='vertical' style={{ width: '100%' }}>
            <Typography.Text
              type={fields.length >= inventoryLimit ? 'danger' : 'secondary'}>
              {copy.playerCharacters.inventoryStatus(
                fields.length,
                inventoryLimit
              )}
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
                  name={[field.name, 'label']}
                  label={copy.playerCharacters.itemNamePlaceholder}
                  noStyle>
                  <Input
                    placeholder={copy.playerCharacters.itemNamePlaceholder}
                    style={{ flex: 1, minWidth: 220 }}
                  />
                </Form.Item>

                <Form.Item
                  name={[field.name, 'quantity']}
                  label='Quantité'
                  noStyle>
                  <InputNumber min={1} style={{ width: 110 }} />
                </Form.Item>

                <Form.Item
                  name={[field.name, 'note']}
                  label={copy.playerCharacters.itemNotePlaceholder}
                  noStyle>
                  <Input
                    placeholder={copy.playerCharacters.itemNotePlaceholder}
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
        </Card>
      )}
    </Form.List>
  )
}
