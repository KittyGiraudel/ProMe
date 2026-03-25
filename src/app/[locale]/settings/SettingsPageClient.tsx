'use client'

import { Card, Checkbox, Form, Space, Typography } from 'antd'
import { Layout } from '@/components/Layout/Layout'
import { useSettings } from '@/app/[locale]/contexts/SettingsContext'
import { useTranslations } from 'next-intl'

type SettingsFormValues = {
  adaptiveNightMode: boolean
  timelineReverseChronological: boolean
  villageMergeDuplicateEstablishments: boolean
}

export function SettingsPageClient() {
  const { settings, updateSettings } = useSettings()
  const t = useTranslations()

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
    <Layout title={t('settings.title')} pageCoverBiome='silentDesert'>
      <Form<SettingsFormValues>
        key={`${settings.sheet.adaptiveNightMode}-${settings.journal.timelineReverseChronological}-${settings.village.mergeDuplicateEstablishments}`}
        layout='vertical'
        initialValues={initialValues}
        onValuesChange={handleValuesChange}>
        <Card title={t('settings.section_sheet')}>
          <Space orientation='vertical' size='small'>
            <Form.Item
              name='adaptiveNightMode'
              valuePropName='checked'
              style={{ marginBottom: 0 }}>
              <Checkbox>{t('settings.adaptive_night_mode_label')}</Checkbox>
            </Form.Item>
            <Typography.Text type='secondary'>
              {t('settings.adaptive_night_mode_help')}
            </Typography.Text>
          </Space>
        </Card>
        <Card title={t('settings.section_journal')} style={{ marginTop: 16 }}>
          <Space orientation='vertical' size='small'>
            <Form.Item
              name='timelineReverseChronological'
              valuePropName='checked'
              style={{ marginBottom: 0 }}>
              <Checkbox>
                {t('settings.journal_timeline_reverse_chronological_label')}
              </Checkbox>
            </Form.Item>
            <Typography.Text type='secondary'>
              {t('settings.journal_timeline_reverse_chronological_help')}
            </Typography.Text>
          </Space>
        </Card>
        <Card title={t('settings.section_village')} style={{ marginTop: 16 }}>
          <Space orientation='vertical' size='small'>
            <Form.Item
              name='villageMergeDuplicateEstablishments'
              valuePropName='checked'
              style={{ marginBottom: 0 }}>
              <Checkbox>
                {t('settings.village_merge_duplicate_establishments_label')}
              </Checkbox>
            </Form.Item>
            <Typography.Text type='secondary'>
              {t('settings.village_merge_duplicate_establishments_help')}
            </Typography.Text>
          </Space>
        </Card>
      </Form>
    </Layout>
  )
}
