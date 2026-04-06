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
  appTheme: 'light' | 'dark'
  adaptiveNightMode: boolean
  sheetSinglePageMode: boolean
  timelineReverseChronological: boolean
  journalCreateEntryOnMove: boolean
  villageMergeDuplicateEstablishments: boolean
  mapTickClockOnMove: boolean
  mapShowBiomeBackground: boolean
  mapCoordinatesDisplay: 'axes' | 'cells' | 'both'
  mapStyle: 'flat' | 'tilted' | 'tilting-on-hover'
  soundEnabled: boolean
  soundVariant: 'mix' | 'music' | 'ambiance'
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
    appTheme: settings.appearance.theme,
    adaptiveNightMode: settings.sheet.adaptiveNightMode,
    sheetSinglePageMode: settings.sheet.singlePageMode,
    timelineReverseChronological: settings.journal.timelineReverseChronological,
    journalCreateEntryOnMove: settings.journal.createEntryOnMove,
    villageMergeDuplicateEstablishments:
      settings.village.mergeDuplicateEstablishments,
    mapTickClockOnMove: settings.map.tickClockOnMove,
    mapShowBiomeBackground: settings.map.showBiomeBackground,
    mapCoordinatesDisplay: settings.map.coordinatesDisplay,
    mapStyle: settings.map.style,
    soundEnabled: settings.sound.enabled,
    soundVariant: settings.sound.variant,
  }

  const handleReset = () => {
    updateSettings(() => DEFAULT_SETTINGS)
    form.setFieldsValue({
      appTheme: DEFAULT_SETTINGS.appearance.theme,
      adaptiveNightMode: DEFAULT_SETTINGS.sheet.adaptiveNightMode,
      sheetSinglePageMode: DEFAULT_SETTINGS.sheet.singlePageMode,
      timelineReverseChronological:
        DEFAULT_SETTINGS.journal.timelineReverseChronological,
      journalCreateEntryOnMove: DEFAULT_SETTINGS.journal.createEntryOnMove,
      villageMergeDuplicateEstablishments:
        DEFAULT_SETTINGS.village.mergeDuplicateEstablishments,
      mapTickClockOnMove: DEFAULT_SETTINGS.map.tickClockOnMove,
      mapShowBiomeBackground: DEFAULT_SETTINGS.map.showBiomeBackground,
      mapCoordinatesDisplay: DEFAULT_SETTINGS.map.coordinatesDisplay,
      mapStyle: DEFAULT_SETTINGS.map.style,
      soundEnabled: DEFAULT_SETTINGS.sound.enabled,
      soundVariant: DEFAULT_SETTINGS.sound.variant,
    })
  }

  const handleValuesChange = (_: unknown, allValues: SettingsFormValues) => {
    updateSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        theme: allValues.appTheme ?? 'light',
      },
      sheet: {
        ...prev.sheet,
        adaptiveNightMode: allValues.adaptiveNightMode === true,
        singlePageMode: allValues.sheetSinglePageMode === true,
      },
      journal: {
        ...prev.journal,
        timelineReverseChronological:
          allValues.timelineReverseChronological === true,
        createEntryOnMove: allValues.journalCreateEntryOnMove === true,
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
        style: allValues.mapStyle ?? 'flat',
      },
      sound: {
        ...prev.sound,
        enabled: allValues.soundEnabled === true,
        variant: allValues.soundVariant ?? 'mix',
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
              <Card title={t('settings.section_appearance')}>
                <Form.Item
                  name='appTheme'
                  label={t('settings.app_theme_label')}
                  style={{ marginBottom: 0 }}>
                  <Select
                    options={[
                      {
                        value: 'light',
                        label: t('settings.app_theme_light'),
                      },
                      {
                        value: 'dark',
                        label: t('settings.app_theme_dark'),
                      },
                    ]}
                  />
                </Form.Item>
              </Card>
            </Col>
          </Row>
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
                    extra={t('settings.adaptive_night_mode_help')}>
                    <Checkbox>
                      {t('settings.adaptive_night_mode_label')}
                    </Checkbox>
                  </Form.Item>
                  <Form.Item
                    name='sheetSinglePageMode'
                    valuePropName='checked'
                    extra={t('settings.sheet_single_page_mode_help')}>
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
                    extra={t('settings.map_tick_clock_on_move_help')}>
                    <Checkbox>
                      {t('settings.map_tick_clock_on_move_label')}
                    </Checkbox>
                  </Form.Item>
                  <Form.Item
                    name='mapShowBiomeBackground'
                    valuePropName='checked'
                    extra={t('settings.map_show_biome_background_help')}>
                    <Checkbox>
                      {t('settings.map_show_biome_background_label')}
                    </Checkbox>
                  </Form.Item>
                  <Form.Item
                    name='mapCoordinatesDisplay'
                    label={t('settings.map_coordinates_display_label')}
                    extra={t('settings.map_coordinates_display_help')}>
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
                  <Form.Item
                    name='mapStyle'
                    label={t('settings.map_style_label')}
                    extra={t('settings.map_style_help')}
                    style={{ marginBottom: 0 }}>
                    <Select
                      options={[
                        {
                          value: 'flat',
                          label: t('settings.map_style_flat'),
                        },
                        {
                          value: 'tilted',
                          label: t('settings.map_style_tilted'),
                        },
                        {
                          value: 'tilting-on-hover',
                          label: t('settings.map_style_tilting_on_hover'),
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
                      extra={t(
                        'settings.journal_timeline_reverse_chronological_help'
                      )}>
                      <Checkbox>
                        {t(
                          'settings.journal_timeline_reverse_chronological_label'
                        )}
                      </Checkbox>
                    </Form.Item>
                    <Form.Item
                      name='journalCreateEntryOnMove'
                      valuePropName='checked'
                      extra={t(
                        'settings.journal_create_entry_on_map_move_help'
                      )}>
                      <Checkbox>
                        {t('settings.journal_create_entry_on_map_move_label')}
                      </Checkbox>
                    </Form.Item>
                  </Spacing>
                </Card>
                <Card title={t('settings.section_village')}>
                  <Spacing size='small'>
                    <Form.Item
                      name='villageMergeDuplicateEstablishments'
                      valuePropName='checked'
                      extra={t(
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
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title={t('settings.section_sound')}>
                <Spacing size='small'>
                  <Form.Item
                    name='soundEnabled'
                    valuePropName='checked'
                    extra={t('settings.sound_enabled_help')}>
                    <Checkbox>{t('settings.sound_enabled_label')}</Checkbox>
                  </Form.Item>
                  <Form.Item
                    name='soundVariant'
                    label={t('settings.sound_variant_label')}
                    extra={t('settings.sound_variant_help')}
                    style={{ marginBottom: 0 }}>
                    <Select
                      options={[
                        {
                          value: 'mix',
                          label: t('settings.sound_variant_mix'),
                        },
                        {
                          value: 'music',
                          label: t('settings.sound_variant_music'),
                        },
                        {
                          value: 'ambiance',
                          label: t('settings.sound_variant_ambiance'),
                        },
                      ]}
                    />
                  </Form.Item>
                </Spacing>
              </Card>
            </Col>
          </Row>
        </Spacing>
      </Form>
    </Layout>
  )
}
