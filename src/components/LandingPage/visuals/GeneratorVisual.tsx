import { useTranslations } from 'next-intl'
import './GeneratorVisual.css'

export function GeneratorVisual() {
  const t = useTranslations()
  const ATTRS = [
    { label: t('inhabitant.section_age'), value: '34' },
    {
      label: t('inhabitant.section_personality'),
      value: t('common.personalities.curious', { gender: 'woman' }),
    },
    { label: t('inhabitant.section_faction'), value: 'Bruja' },
    {
      label: t('inhabitant.section_context'),
      value: t('landing.features.generators.demo.context'),
    },
  ]
  return (
    <div className='GeneratorVisual' aria-hidden='true'>
      <div className='GeneratorVisual__name'>
        {t('landing.features.generators.demo.name')}
      </div>
      <div className='GeneratorVisual__role'>
        {t('landing.features.generators.demo.role')}
      </div>
      <div className='GeneratorVisual__attrs'>
        {ATTRS.map(({ label, value }) => (
          <div key={label} className='GeneratorVisual__attr'>
            <span>{label}</span>
            <span className='GeneratorVisual__attr-value'>{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
