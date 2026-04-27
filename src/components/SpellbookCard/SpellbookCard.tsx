'use client'

import {
  Button,
  Card,
  ConfigProvider,
  Empty,
  Form,
  Input,
  Typography,
} from 'antd'
import { useTranslations } from 'next-intl'
import { HelpButton } from '@/components/HelpButton/HelpButton'
import { Spacing } from '@/components/Spacing/Spacing'
import { randomId } from '@/lib/character/model'

import './SpellbookCard.css'
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined'

const SPELLBOOK_MAX = 6

export function SpellbookCard() {
  const { componentDisabled } = ConfigProvider.useConfig()
  const t = useTranslations()

  return (
    <Form.List name='spellbook'>
      {(fields, { add, remove }) => (
        <Card
          title={
            <h2>
              {t.rich('characters.inventory.spellbook_section', {
                status: content => (
                  <Typography.Text type='secondary'>{content}</Typography.Text>
                ),
                count: fields.length,
              })}
            </h2>
          }
          extra={
            <HelpButton
              label={t('rulebook.information')}
              tooltip={t('rulebook.spellbook_footnote')}
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
                        name: '',
                        note: '',
                      })
                    }
                    disabled={fields.length >= SPELLBOOK_MAX}>
                    {t('characters.inventory.add_spell')}
                  </Button>,
                ]
              : undefined
          }
          id='spellbook'>
          {fields.length > 0 ? (
            <Spacing>
              {fields.map(field => (
                <Spacing
                  key={field.key}
                  orientation='horizontal'
                  size='small'
                  fullWidth
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
                    className='SpellbookCard__DeleteButton'
                    danger
                    onClick={() => remove(field.name)}
                    aria-label={t('common.actions.delete')}
                    icon={<DeleteOutlined />}>
                    <span className='SpellbookCard__DeleteButton-label'>
                      {t('common.actions.delete')}
                    </span>
                  </Button>
                </Spacing>
              ))}
            </Spacing>
          ) : (
            <Empty description={t('characters.inventory.spellbook_empty')} />
          )}
        </Card>
      )}
    </Form.List>
  )
}
