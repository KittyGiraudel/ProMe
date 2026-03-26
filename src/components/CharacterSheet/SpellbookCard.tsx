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
import type { FormListFieldData } from 'antd/es/form'
import { Button } from '@/components/Button/Button'
import { useTranslations } from 'next-intl'
import { randomId } from '@/lib/character/model'

const SPELLBOOK_MAX = 6

export function SpellbookCard() {
  const { componentDisabled } = ConfigProvider.useConfig()
  const t = useTranslations()
  return (
    <Form.List name='spellbook'>
      {(fields, { add, remove }) => (
        <Card
          title={
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <span>{t('characters.inventory.spellbook_section')}</span>
              <Tooltip title={t('rulebook.spellbook_footnote')}>
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
            <Typography.Text type='secondary'>
              {t('characters.inventory.spellbook_status', {
                count: fields.length,
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
                  name={[field.name, 'name']}
                  label={t('characters.inventory.spell_name_placeholder')}
                  noStyle>
                  <Input
                    placeholder={t(
                      'characters.inventory.spell_name_placeholder'
                    )}
                    style={{ flex: 1, minWidth: 220 }}
                  />
                </Form.Item>

                <Form.Item
                  name={[field.name, 'note']}
                  label={t('characters.inventory.spell_note_placeholder')}
                  noStyle>
                  <Input
                    placeholder={t(
                      'characters.inventory.spell_note_placeholder'
                    )}
                    style={{ width: 240 }}
                  />
                </Form.Item>

                <Button
                  danger
                  onClick={() => remove(field.name)}
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
                </Button>
              </Space>
            </>
          )}
        </Card>
      )}
    </Form.List>
  )
}
