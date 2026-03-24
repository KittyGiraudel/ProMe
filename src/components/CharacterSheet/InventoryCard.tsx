'use client'

import { QuestionCircleOutlined } from '@ant-design/icons'
import {
  Card,
  ConfigProvider,
  Divider,
  Form,
  Input,
  InputNumber,
  Space,
  Tooltip,
  Typography,
} from 'antd'
import type { FormListFieldData } from 'antd/es/form'
import { copy } from '@/messages/fr'
import { Button } from '@/components/Button/Button'
import { useInventoryLimit } from '@/app/characters/[id]/useInventoryLimit'

export function InventoryCard({
  fields,
  onAddItem,
  onRemoveItem,
}: {
  fields: FormListFieldData[]
  onAddItem: () => void
  onRemoveItem: (index: number | number[]) => void
}) {
  const { componentDisabled } = ConfigProvider.useConfig()
  const inventoryLimit = useInventoryLimit()
  const atCap = inventoryLimit > 0 && fields.length >= inventoryLimit
  const cannotAdd = inventoryLimit <= 0 || atCap

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
          <span>{copy.characters.inventorySection}</span>
          <Tooltip title={copy.characters.inventoryFootnote}>
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
          {copy.characters.inventoryStatus(fields.length, inventoryLimit)}
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
              label={copy.characters.itemNamePlaceholder}
              noStyle>
              <Input
                placeholder={copy.characters.itemNamePlaceholder}
                style={{ flex: 1, minWidth: 220 }}
              />
            </Form.Item>

            <Form.Item name={[field.name, 'quantity']} label='Quantité' noStyle>
              <InputNumber min={1} style={{ width: 110 }} />
            </Form.Item>

            <Form.Item
              name={[field.name, 'note']}
              label={copy.characters.itemNotePlaceholder}
              noStyle>
              <Input
                placeholder={copy.characters.itemNotePlaceholder}
                style={{ width: 240 }}
              />
            </Form.Item>

            <Button
              danger
              onClick={() => onRemoveItem(field.name)}
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
              onClick={onAddItem}
              disabled={cannotAdd}
              htmlType='button'>
              {copy.characters.addItem}
            </Button>
          </Space>
        </>
      )}
    </Card>
  )
}
