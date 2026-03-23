'use client'

import { Button, Card, Form, Input, Space, Typography } from 'antd'
import { copy } from '@/messages/fr'
import type { FormListFieldData } from 'antd'
import { randomId } from '@/lib/playerCharacter/model'

export function SpellbookCard() {
  return (
    <Form.List name='spellbook'>
      {(fields, { add, remove }) => (
        <>
          <Card
            title={copy.playerCharacters.spellbookSection}
            extra={
              <Button
                size='small'
                onClick={() =>
                  add({
                    id: randomId(),
                    name: '',
                    note: '',
                  })
                }
                disabled={fields.length >= 6}
                htmlType='button'>
                {copy.playerCharacters.addSpell}
              </Button>
            }>
            <Space orientation='vertical' style={{ width: '100%' }}>
              <Typography.Text type='secondary'>
                {copy.playerCharacters.spellbookStatus(fields.length)}
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
                    label={copy.playerCharacters.spellNamePlaceholder}
                    noStyle>
                    <Input
                      placeholder={copy.playerCharacters.spellNamePlaceholder}
                      style={{ flex: 1, minWidth: 220 }}
                    />
                  </Form.Item>

                  <Form.Item
                    name={[field.name, 'note']}
                    label={copy.playerCharacters.spellNotePlaceholder}
                    noStyle>
                    <Input
                      placeholder={copy.playerCharacters.spellNotePlaceholder}
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
          </Card>
          <Typography.Text
            type='secondary'
            className='generator-rulebook-footnote character-sheet-rulebook-footnote'>
            {copy.playerCharacters.spellbookFootnote}
          </Typography.Text>
        </>
      )}
    </Form.List>
  )
}
