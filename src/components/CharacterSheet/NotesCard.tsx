'use client'

import { Card, Form, Input } from 'antd'
import { copy } from '@/messages/fr'

export function NotesCard() {
  return (
    <Card title={copy.playerCharacters.notesSection}>
      <Form.Item
        name='notes'
        label={copy.playerCharacters.notesSection}
        style={{ marginBottom: 0 }}>
        <Input.TextArea rows={5} />
      </Form.Item>
    </Card>
  )
}
