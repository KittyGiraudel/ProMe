'use client'

import { Card, Checkbox, Form, Space, Typography } from 'antd'
import { Layout } from '@/components/Layout/Layout'
import { useSettings } from '@/app/contexts/SettingsContext'
import { useLocalize } from '@/app/contexts/LocalizationContext'

type SettingsFormValues = {
  adaptiveNightMode: boolean
  timelineReverseChronological: boolean
  villageMergeDuplicateEstablishments: boolean
}

export function SettingsPageClient() {
  const { settings, updateSettings } = useSettings()
  const localize = useLocalize()

  const initialValues: SettingsFormValues = {
    adaptiveNightMode: settings.sheet.adaptiveNightMode,
    timelineReverseChronological: settings.journal.timelineReverseChronological,
    villageMergeDuplicateEstablishments:
      settings.village.mergeDuplicateEstablishments,
  }

  const handleValuesChange = (_: unknown, allValues: SettingsFormValues) => {
    updateSettings(prev => ({
      ...prev,
      sheet: {
        ...prev.sheet,
        adaptiveNightMode: allValues.adaptiveNightMode === true,
      },
      journal: {
        ...prev.journal,
        timelineReverseChronological:
          allValues.timelineReverseChronological === true,
      },
      village: {
        ...prev.village,
        mergeDuplicateEstablishments:
          allValues.villageMergeDuplicateEstablishments === true,
      },
    }))
  }

  return (
    <Layout
      title={localize.string('settings.pageTitle')}
      pageCoverBiome='silentDesert'>
      <Form<SettingsFormValues>
        key={`${settings.sheet.adaptiveNightMode}-${settings.journal.timelineReverseChronological}-${settings.village.mergeDuplicateEstablishments}`}
        layout='vertical'
        initialValues={initialValues}
        onValuesChange={handleValuesChange}>
        <Card title={localize.string('settings.sectionSheet')}>
          <Space orientation='vertical' size='small'>
            <Form.Item
              name='adaptiveNightMode'
              valuePropName='checked'
              style={{ marginBottom: 0 }}>
              <Checkbox>
                {localize.string('settings.adaptiveNightModeLabel')}
              </Checkbox>
            </Form.Item>
            <Typography.Text type='secondary'>
              {localize.string('settings.adaptiveNightModeHelp')}
            </Typography.Text>
          </Space>
        </Card>
        <Card
          title={localize.string('settings.sectionJournal')}
          style={{ marginTop: 16 }}>
          <Space orientation='vertical' size='small'>
            <Form.Item
              name='timelineReverseChronological'
              valuePropName='checked'
              style={{ marginBottom: 0 }}>
              <Checkbox>
                {localize.string(
                  'settings.journalTimelineReverseChronologicalLabel'
                )}
              </Checkbox>
            </Form.Item>
            <Typography.Text type='secondary'>
              {localize.string(
                'settings.journalTimelineReverseChronologicalHelp'
              )}
            </Typography.Text>
          </Space>
        </Card>
        <Card
          title={localize.string('settings.sectionVillage')}
          style={{ marginTop: 16 }}>
          <Space orientation='vertical' size='small'>
            <Form.Item
              name='villageMergeDuplicateEstablishments'
              valuePropName='checked'
              style={{ marginBottom: 0 }}>
              <Checkbox>
                {localize.string(
                  'settings.villageMergeDuplicateEstablishmentsLabel'
                )}
              </Checkbox>
            </Form.Item>
            <Typography.Text type='secondary'>
              {localize.string(
                'settings.villageMergeDuplicateEstablishmentsHelp'
              )}
            </Typography.Text>
          </Space>
        </Card>
      </Form>
    </Layout>
  )
}
