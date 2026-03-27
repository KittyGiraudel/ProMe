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
import { Button } from '@/components/Button/Button'
import { useTranslations } from 'next-intl'
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
              <Typography.Text style={{ color: 'var(--lsdp-muted)' }}>
                {content}
              </Typography.Text>
            ),
            count: fields.length,
          })}
          extra={
            <Tooltip title={t('rulebook.spellbook_footnote')}>
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
