'use client'

import {
  Card,
  ConfigProvider,
  Empty,
  Form,
  Input,
  Space,
  Tooltip,
  Typography,
} from 'antd'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/Button/Button'
import { HelpButton } from '@/components/HelpButton/HelpButton'
import { randomId } from '@/lib/character/model'

import './SpellbookCard.css'

const SPELLBOOK_MAX = 6

export function SpellbookCard() {
  const { componentDisabled } = ConfigProvider.useConfig()
  const t = useTranslations()

  return (
    <Form.List name='spellbook'>
      {(fields, { add, remove }) => (
        <Card
          title={t.rich('characters.inventory.spellbook_section', {
            status: content => (
              <Typography.Text type='secondary'>{content}</Typography.Text>
            ),
            count: fields.length,
          })}
          extra={
            <Tooltip title={t('rulebook.spellbook_footnote')}>
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
                        name: '',
                        note: '',
                      })
                    }
                    disabled={fields.length >= SPELLBOOK_MAX}
                    htmlType='button'>
                    {t('characters.inventory.add_spell')}
                  </Button>,
                ]
              : undefined
          }>
          {fields.length > 0 ? (
            <Space orientation='vertical' style={{ width: '100%' }}>
              {fields.map(field => (
                <Space
                  key={field.key}
                  style={{ width: '100%' }}
                  className='SpellbookCard__Row'>
                  <Form.Item
                    name={[field.name, 'name']}
                    label={t('characters.inventory.spell_name_label')}
                    noStyle>
                    <Input
                      placeholder={t('characters.inventory.spell_name_label')}
                    />
                  </Form.Item>

                  <Form.Item
                    name={[field.name, 'note']}
                    label={t('characters.inventory.spell_note_label')}
                    noStyle>
                    <Input
                      placeholder={t('characters.inventory.spell_note_label')}
                    />
                  </Form.Item>

                  <Button
                    danger
                    onClick={() => remove(field.name)}
                    htmlType='button'>
                    {t('common.actions.delete')}
                  </Button>
                </Space>
              ))}
            </Space>
          ) : (
            <Empty description={t('characters.inventory.spellbook_empty')} />
          )}
        </Card>
      )}
    </Form.List>
  )
}
