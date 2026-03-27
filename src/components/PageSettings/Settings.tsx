'use client'

import { useTranslations } from 'next-intl'
import { Card, Checkbox, Form, Space, Typography } from 'antd'
import { Layout } from '@/components/Layout/Layout'
import { useSettings } from './SettingsContext'

type SettingsFormValues = {
  adaptiveNightMode: boolean
  timelineReverseChronological: boolean
  villageMergeDuplicateEstablishments: boolean
  mapTickClockOnMove: boolean
}

export function Settings() {
  const { settings, updateSettings } = useSettings()
  const t = useTranslations()

  const initialValues: SettingsFormValues = {
    adaptiveNightMode: settings.sheet.adaptiveNightMode,
    timelineReverseChronological: settings.journal.timelineReverseChronological,
    villageMergeDuplicateEstablishments:
      settings.village.mergeDuplicateEstablishments,
    mapTickClockOnMove: settings.map.tickClockOnMove,
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
      map: {
        ...prev.map,
        tickClockOnMove: allValues.mapTickClockOnMove === true,
      },
    }))
  }

  return (
    <Layout
      title={t('settings.title')}
      bannerBiome='silentDesert'
      breadcrumbs={[
        { title: t('nav.home'), path: '/' },
        { title: t('nav.settings'), path: '/settings' },
      ]}>
      <Form<SettingsFormValues>
        key={`${settings.sheet.adaptiveNightMode}-${settings.journal.timelineReverseChronological}-${settings.village.mergeDuplicateEstablishments}-${settings.map.tickClockOnMove}`}
        layout='vertical'
        initialValues={initialValues}
        onValuesChange={handleValuesChange}>
        <Space orientation='vertical' size='large'>
          <Card title={t('settings.section_sheet')}>
            <Space orientation='vertical' size='small'>
              <Form.Item
                name='adaptiveNightMode'
                valuePropName='checked'
                noStyle>
                <Checkbox>{t('settings.adaptive_night_mode_label')}</Checkbox>
              </Form.Item>
              <Typography.Text type='secondary'>
                {t('settings.adaptive_night_mode_help')}
              </Typography.Text>
            </Space>
          </Card>
          <Card title={t('settings.section_journal')}>
            <Space orientation='vertical' size='small'>
              <Form.Item
                name='timelineReverseChronological'
                valuePropName='checked'
                noStyle>
                <Checkbox>
                  {t('settings.journal_timeline_reverse_chronological_label')}
                </Checkbox>
              </Form.Item>
              <Typography.Text type='secondary'>
                {t('settings.journal_timeline_reverse_chronological_help')}
              </Typography.Text>
            </Space>
          </Card>
          <Card title={t('settings.section_village')}>
            <Space orientation='vertical' size='small'>
              <Form.Item
                name='villageMergeDuplicateEstablishments'
                valuePropName='checked'
                noStyle>
                <Checkbox>
                  {t('settings.village_merge_duplicate_establishments_label')}
                </Checkbox>
              </Form.Item>
              <Typography.Text type='secondary'>
                {t('settings.village_merge_duplicate_establishments_help')}
              </Typography.Text>
            </Space>
          </Card>
          <Card title={t('settings.section_map')}>
            <Space orientation='vertical' size='small'>
              <Form.Item
                name='mapTickClockOnMove'
                valuePropName='checked'
                noStyle>
                <Checkbox>
                  {t('settings.map_tick_clock_on_move_label')}
                </Checkbox>
              </Form.Item>
              <Typography.Text type='secondary'>
                {t('settings.map_tick_clock_on_move_help')}
              </Typography.Text>
            </Space>
          </Card>
        </Space>
      </Form>
    </Layout>
  )
}
