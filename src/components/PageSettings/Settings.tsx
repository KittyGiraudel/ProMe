'use client'

import { Alert, Card, Checkbox, Col, Form, Row, Select, Space } from 'antd'
import { AppConfig, useLocale, useTranslations } from 'next-intl'
import { Layout } from '@/components/Layout/Layout'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { useSettings } from './SettingsContext'

type SettingsFormValues = {
  adaptiveNightMode: boolean
  sheetSinglePageMode: boolean
  timelineReverseChronological: boolean
  villageMergeDuplicateEstablishments: boolean
  mapTickClockOnMove: boolean
}

export function Settings() {
  const { settings, updateSettings } = useSettings()
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleLocaleChange = (locale: string) =>
    router.replace(pathname, { locale: locale as AppConfig['Locale'] })

  const initialValues: SettingsFormValues = {
    adaptiveNightMode: settings.sheet.adaptiveNightMode,
    sheetSinglePageMode: settings.sheet.singlePageMode,
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
        singlePageMode: allValues.sheetSinglePageMode === true,
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
        key={`${settings.sheet.adaptiveNightMode}-${settings.sheet.singlePageMode}-${settings.journal.timelineReverseChronological}-${settings.village.mergeDuplicateEstablishments}-${settings.map.tickClockOnMove}`}
        layout='vertical'
        initialValues={initialValues}
        onValuesChange={handleValuesChange}>
        <Space orientation='vertical' size='large'>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title={t('settings.section_language')}>
                <Space orientation='vertical' size='small'>
                  <Form.Item
                    label={t(`settings.language_label`)}
                    style={{ marginBottom: 0 }}>
                    <Select
                      value={locale}
                      onChange={handleLocaleChange}
                      options={routing.locales.map(l => ({
                        value: l,
                        label: t(`settings.language_${l}`),
                      }))}
                    />
                  </Form.Item>
                  <Alert
                    style={{ marginTop: 12 }}
                    title={t('settings.language_warning')}
                    type='warning'
                  />
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title={t('settings.section_sheet')}>
                <Space orientation='vertical' size='medium'>
                  <Form.Item
                    name='adaptiveNightMode'
                    valuePropName='checked'
                    help={t('settings.adaptive_night_mode_help')}>
                    <Checkbox>
                      {t('settings.adaptive_night_mode_label')}
                    </Checkbox>
                  </Form.Item>
                  <Form.Item
                    name='sheetSinglePageMode'
                    valuePropName='checked'
                    help={t('settings.sheet_single_page_mode_help')}>
                    <Checkbox>
                      {t('settings.sheet_single_page_mode_label')}
                    </Checkbox>
                  </Form.Item>
                </Space>
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title={t('settings.section_journal')}>
                <Space orientation='vertical' size='small'>
                  <Form.Item
                    name='timelineReverseChronological'
                    valuePropName='checked'
                    help={t(
                      'settings.journal_timeline_reverse_chronological_help'
                    )}>
                    <Checkbox>
                      {t(
                        'settings.journal_timeline_reverse_chronological_label'
                      )}
                    </Checkbox>
                  </Form.Item>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title={t('settings.section_map')}>
                <Space orientation='vertical' size='small'>
                  <Form.Item
                    name='mapTickClockOnMove'
                    valuePropName='checked'
                    help={t('settings.map_tick_clock_on_move_help')}>
                    <Checkbox>
                      {t('settings.map_tick_clock_on_move_label')}
                    </Checkbox>
                  </Form.Item>
                </Space>
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title={t('settings.section_village')}>
                <Space orientation='vertical' size='small'>
                  <Form.Item
                    name='villageMergeDuplicateEstablishments'
                    valuePropName='checked'
                    help={t(
                      'settings.village_merge_duplicate_establishments_help'
                    )}>
                    <Checkbox>
                      {t(
                        'settings.village_merge_duplicate_establishments_label'
                      )}
                    </Checkbox>
                  </Form.Item>
                </Space>
              </Card>
            </Col>
          </Row>
        </Space>
      </Form>
    </Layout>
  )
}
