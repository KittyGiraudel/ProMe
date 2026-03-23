'use client'

import { QuestionCircleOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  InputNumber,
  Space,
  Tooltip,
  Typography,
} from 'antd'
import { copy } from '@/messages/fr'
import { randomId } from '@/lib/playerCharacter/model'

export function InventoryCard({ inventoryLimit }: { inventoryLimit: number }) {
  return (
    <Form.List name='inventory'>
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
                <span>{copy.playerCharacters.inventorySection}</span>
                <Tooltip title={copy.playerCharacters.inventoryFootnote}>
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
                disabled={fields.length >= inventoryLimit}
                htmlType='button'>
                {copy.playerCharacters.addItem}
              </Button>
            </Space>
          </Card>
        </>
      )}
    </Form.List>
  )
}
