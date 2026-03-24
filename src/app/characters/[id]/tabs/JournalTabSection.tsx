'use client'

import { Form } from 'antd'
import { randomId } from '@/lib/character/model'
import { NotesCard } from '@/components/CharacterSheet/NotesCard'

export function JournalTabSection() {
  return (
    <Form.List name='journalEntries'>
      {(fields, { add, remove }) => (
        <NotesCard
          fields={fields}
          onAddEntry={() => {
            add({
              id: randomId(),
              content: '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })
          }}
          onRemoveEntry={index => {
            remove(index)
          }}
        />
      )}
    </Form.List>
  )
}
