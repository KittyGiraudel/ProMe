'use client'

import { Alert, Button, Card, Checkbox, Col, Form, Row, Select } from 'antd'
import { AppConfig, useLocale, useTranslations } from 'next-intl'
import { Layout } from '@/components/Layout/Layout'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { DEFAULT_SETTINGS } from '@/lib/settings/model'
import { Spacing } from '../Spacing/Spacing'
import { useSettings } from './SettingsContext'

type SettingsFormValues = {
  adaptiveNightMode: boolean
  sheetSinglePageMode: boolean
  timelineReverseChronological: boolean
  villageMergeDuplicateEstablishments: boolean
  mapTickClockOnMove: boolean
  mapShowBiomeBackground: boolean
  mapCoordinatesDisplay: 'axes' | 'cells' | 'both'
}

export function Settings() {
  const [form] = Form.useForm<SettingsFormValues>()
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
    mapShowBiomeBackground: settings.map.showBiomeBackground,
    mapCoordinatesDisplay: settings.map.coordinatesDisplay,
  }

  const handleReset = () => {
    updateSettings(() => DEFAULT_SETTINGS)
    form.setFieldsValue({
      adaptiveNightMode: DEFAULT_SETTINGS.sheet.adaptiveNightMode,
      sheetSinglePageMode: DEFAULT_SETTINGS.sheet.singlePageMode,
      timelineReverseChronological:
        DEFAULT_SETTINGS.journal.timelineReverseChronological,
      villageMergeDuplicateEstablishments:
        DEFAULT_SETTINGS.village.mergeDuplicateEstablishments,
      mapTickClockOnMove: DEFAULT_SETTINGS.map.tickClockOnMove,
      mapShowBiomeBackground: DEFAULT_SETTINGS.map.showBiomeBackground,
      mapCoordinatesDisplay: DEFAULT_SETTINGS.map.coordinatesDisplay,
    })
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
        showBiomeBackground: allValues.mapShowBiomeBackground !== false,
        coordinatesDisplay: allValues.mapCoordinatesDisplay ?? 'both',
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
      ]}
      headerActions={
        <Button onClick={handleReset}>{t('common.actions.reset')}</Button>
      }>
      <Form<SettingsFormValues>
        form={form}
        layout='vertical'
        initialValues={initialValues}
        onValuesChange={handleValuesChange}>
        <Spacing>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title={t('settings.section_language')}>
                <Spacing size='small'>
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
                </Spacing>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title={t('settings.section_sheet')}>
                <Spacing>
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
                </Spacing>
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title={t('settings.section_map')}>
                <Spacing size='small'>
                  <Form.Item
                    name='mapTickClockOnMove'
                    valuePropName='checked'
                    help={t('settings.map_tick_clock_on_move_help')}>
                    <Checkbox>
                      {t('settings.map_tick_clock_on_move_label')}
                    </Checkbox>
                  </Form.Item>
                  <Form.Item
                    name='mapShowBiomeBackground'
                    valuePropName='checked'
                    help={t('settings.map_show_biome_background_help')}>
                    <Checkbox>
                      {t('settings.map_show_biome_background_label')}
                    </Checkbox>
                  </Form.Item>
                  <Form.Item
                    name='mapCoordinatesDisplay'
                    label={t('settings.map_coordinates_display_label')}
                    help={t('settings.map_coordinates_display_help')}
                    style={{ marginBottom: 0 }}>
                    <Select
                      options={[
                        {
                          value: 'both',
                          label: t('settings.map_coordinates_display_both'),
                        },
                        {
                          value: 'axes',
                          label: t('settings.map_coordinates_display_axes'),
                        },
                        {
                          value: 'cells',
                          label: t('settings.map_coordinates_display_cells'),
                        },
                      ]}
                    />
                  </Form.Item>
                </Spacing>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Spacing>
                <Card title={t('settings.section_journal')}>
                  <Spacing size='small'>
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
                  </Spacing>
                </Card>
                <Card title={t('settings.section_village')}>
                  <Spacing size='small'>
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
                  </Spacing>
                </Card>
              </Spacing>
            </Col>
          </Row>
        </Spacing>
      </Form>
    </Layout>
  )
}
