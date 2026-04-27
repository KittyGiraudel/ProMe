'use client'

import {
  Button,
  Card,
  ConfigProvider,
  Empty,
  Form,
  Input,
  InputNumber,
  Typography,
} from 'antd'
import { useTranslations } from 'next-intl'
import { HelpButton } from '@/components/HelpButton/HelpButton'
import { Spacing } from '@/components/Spacing/Spacing'
import { useWatchedInventory } from '@/hooks/useCharacterSheetDerived'
import { randomId } from '@/lib/character/model'

import './InventoryCard.css'
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined'

export function InventoryCard() {
  const t = useTranslations()
  const { componentDisabled } = ConfigProvider.useConfig()
  const { limit: inventoryLimit } = useWatchedInventory()

  return (
    <Form.List name='inventory'>
      {(fields, { add, remove }) => (
        <Card
          title={
            <h2>
              {t.rich('characters.inventory.inventory_section', {
                status: content => (
                  <Typography.Text type='secondary'>{content}</Typography.Text>
                ),
                limit: inventoryLimit,
                count: fields.length,
              })}
            </h2>
          }
          extra={
            <HelpButton
              label={t('rulebook.information')}
              tooltip={t('rulebook.inventory_footnote')}
            />
          }
          actions={
            !componentDisabled
              ? [
                  <Button
                    key='add'
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
                    }>
                    {t('characters.inventory.add_item')}
                  </Button>,
                ]
              : undefined
          }
          id='inventory'>
          {fields.length > 0 ? (
            <Spacing orientation='vertical' size='small'>
              {fields.map(field => (
                <Spacing
                  key={field.key}
                  orientation='horizontal'
                  size='small'
                  fullWidth
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
                    className='InventoryCard__DeleteButton'
                    danger
                    onClick={() => remove(field.name)}
                    aria-label={t('common.actions.delete')}
                    icon={<DeleteOutlined />}>
                    <span className='InventoryCard__DeleteButton-label'>
                      {t('common.actions.delete')}
                    </span>
                  </Button>
                </Spacing>
              ))}
            </Spacing>
          ) : (
            <Empty description={t('characters.inventory.inventory_empty')} />
          )}
        </Card>
      )}
    </Form.List>
  )
}
