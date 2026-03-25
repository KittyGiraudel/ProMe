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
import { Button } from '@/components/Button/Button'
import { useInventoryLimit } from '@/app/[locale]/characters/[id]/useInventoryLimit'
import { useTranslations } from 'next-intl'

export function InventoryCard({
  fields,
  onAddItem,
  onRemoveItem,
}: {
  fields: FormListFieldData[]
  onAddItem: () => void
  onRemoveItem: (index: number | number[]) => void
}) {
  const t = useTranslations()
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
          <span>{t('characters.inventory_section')}</span>
          <Tooltip title={t('characters.inventory_footnote')}>
            <Button
              type='text'
              size='small'
              htmlType='button'
              icon={<QuestionCircleOutlined />}
              aria-label={t('rulebook.information')}
            />
          </Tooltip>
        </div>
      }>
      <Space orientation='vertical' style={{ width: '100%' }}>
        <Typography.Text
          type={fields.length >= inventoryLimit ? 'danger' : 'secondary'}>
          {t('characters.inventory_status', {
            count: fields.length,
            limit: inventoryLimit,
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
              name={[field.name, 'label']}
              label={t('characters.item_name_placeholder')}
              noStyle>
              <Input
                placeholder={t('characters.item_name_placeholder')}
                style={{ flex: 1, minWidth: 220 }}
              />
            </Form.Item>

            <Form.Item
              name={[field.name, 'quantity']}
              label={t('characters.item_quantity_placeholder')}
              noStyle>
              <InputNumber min={1} style={{ width: 110 }} />
            </Form.Item>

            <Form.Item
              name={[field.name, 'note']}
              label={t('characters.item_note_placeholder')}
              noStyle>
              <Input
                placeholder={t('characters.item_note_placeholder')}
                style={{ width: 240 }}
              />
            </Form.Item>

            <Button
              danger
              onClick={() => onRemoveItem(field.name)}
              htmlType='button'>
              {t('common.delete')}
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
              {t('characters.add_item')}
            </Button>
          </Space>
        </>
      )}
    </Card>
  )
}
