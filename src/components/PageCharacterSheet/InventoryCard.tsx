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
import { Button } from '@/components/Button/Button'
import { useInventoryLimit } from '@/components/PageCharacterSheet/useInventoryLimit'
import { useTranslations } from 'next-intl'
import { randomId } from '@/lib/character/model'
import './InventoryCard.css'

export function InventoryCard() {
  const t = useTranslations()
  const { componentDisabled } = ConfigProvider.useConfig()
  const inventoryLimit = useInventoryLimit()

  return (
    <Form.List name='inventory'>
      {(fields, { add, remove }) => (
        <Card
          title={t.rich('characters.inventory.inventory_section', {
            status: content => (
              <Typography.Text style={{ color: 'var(--lsdp-muted)' }}>
                {content}
              </Typography.Text>
            ),
            limit: inventoryLimit,
            count: fields.length,
          })}
          extra={
            <Tooltip title={t('rulebook.inventory_footnote')}>
              <Button
                type='text'
                size='small'
                htmlType='button'
                icon={<QuestionCircleOutlined />}
                aria-label={t('rulebook.information')}
              />
            </Tooltip>
          }
          actions={
            !componentDisabled
              ? [
                  <Button
                    onClick={() =>
                      add({
                        id: randomId(),
                        label: '',
                        quantity: 1,
                        note: '',
                      })
                    }
                    disabled={
                      inventoryLimit <= 0 ||
                      (inventoryLimit > 0 && fields.length >= inventoryLimit)
                    }
                    htmlType='button'>
                    {t('characters.inventory.add_item')}
                  </Button>,
                ]
              : undefined
          }>
          <Space orientation='vertical' style={{ width: '100%' }}>
            {fields.map(field => (
              <Space
                style={{ width: '100%' }}
                key={field.key}
                className='InventoryCard__Row'>
                <Form.Item
                  name={[field.name, 'quantity']}
                  label={t('characters.inventory.item_quantity_label')}
                  noStyle>
                  <InputNumber min={1} />
                </Form.Item>

                <Form.Item
                  name={[field.name, 'label']}
                  label={t('characters.inventory.item_name_label')}
                  noStyle>
                  <Input
                    placeholder={t('characters.inventory.item_name_label')}
                  />
                </Form.Item>

                <Form.Item
                  name={[field.name, 'note']}
                  label={t('characters.inventory.item_note_label')}
                  noStyle>
                  <Input
                    placeholder={t('characters.inventory.item_note_label')}
                  />
                </Form.Item>

                <Button
                  danger
                  onClick={() => remove(field.name)}
                  htmlType='button'>
                  {t('common.delete')}
                </Button>
              </Space>
            ))}
          </Space>
        </Card>
      )}
    </Form.List>
  )
}
