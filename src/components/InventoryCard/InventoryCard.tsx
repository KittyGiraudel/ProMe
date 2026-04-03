'use client'

import {
  Card,
  ConfigProvider,
  Empty,
  Form,
  Input,
  InputNumber,
  Tooltip,
  Typography,
} from 'antd'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/Button/Button'
import { HelpButton } from '@/components/HelpButton/HelpButton'
import { useWatchedInventory } from '@/hooks/useCharacterSheetDerived'
import { randomId } from '@/lib/character/model'
import { Spacing } from '../Spacing/Spacing'

import './InventoryCard.css'

export function InventoryCard() {
  const t = useTranslations()
  const { componentDisabled } = ConfigProvider.useConfig()
  const { limit: inventoryLimit } = useWatchedInventory()

  return (
    <Form.List name='inventory'>
      {(fields, { add, remove }) => (
        <Card
          title={t.rich('characters.inventory.inventory_section', {
            status: content => (
              <Typography.Text type='secondary'>{content}</Typography.Text>
            ),
            limit: inventoryLimit,
            count: fields.length,
          })}
          extra={
            <Tooltip title={t('rulebook.inventory_footnote')}>
              <HelpButton label={t('rulebook.information')} />
            </Tooltip>
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
                    }
                    htmlType='button'>
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
                    danger
                    onClick={() => remove(field.name)}
                    htmlType='button'>
                    {t('common.actions.delete')}
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
