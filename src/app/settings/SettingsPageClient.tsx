'use client'

import { Card, Checkbox, Form, Space, Typography } from 'antd'
import { Layout } from '@/components/Layout/Layout'
import { useSettings } from '@/app/contexts/SettingsContext'
import { copy } from '@/messages/fr'

type SettingsFormValues = {
  adaptiveNightMode: boolean
}

export function SettingsPageClient() {
  const { settings, updateSettings } = useSettings()

  const initialValues: SettingsFormValues = {
    adaptiveNightMode: settings.sheet.adaptiveNightMode,
  }

  const handleValuesChange = (_: unknown, allValues: SettingsFormValues) => {
    updateSettings(prev => ({
      ...prev,
      sheet: {
        ...prev.sheet,
        adaptiveNightMode: allValues.adaptiveNightMode === true,
      },
    }))
  }

  return (
    <Layout title={copy.settings.pageTitle}>
      <Form<SettingsFormValues>
        key={settings.sheet.adaptiveNightMode ? 'night-on' : 'night-off'}
        layout='vertical'
        initialValues={initialValues}
        onValuesChange={handleValuesChange}>
        <Card title={copy.settings.sectionSheet}>
          <Space orientation='vertical' size='small'>
            <Form.Item
              name='adaptiveNightMode'
              valuePropName='checked'
              style={{ marginBottom: 0 }}>
              <Checkbox>{copy.settings.adaptiveNightModeLabel}</Checkbox>
            </Form.Item>
            <Typography.Text type='secondary'>
              {copy.settings.adaptiveNightModeHelp}
            </Typography.Text>
          </Space>
        </Card>
      </Form>
    </Layout>
  )
}
