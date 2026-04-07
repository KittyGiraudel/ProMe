import { useFormatter, useTranslations } from 'next-intl'
import './CharacterSheetVisual.css'

export function CharacterSheetVisual() {
  const t = useTranslations()
  const format = useFormatter()
  return (
    <div className='CharacterSheetVisual' aria-hidden='true'>
      <div className='CharacterSheetVisual__name'>
        {t('landing.features.character.demo.name')}
      </div>
      <div className='CharacterSheetVisual__stats'>
        {[
          { value: '3', label: t('characters.identity.health_label_short') },
          { value: '4', label: t('characters.identity.stamina_label_short') },
          { value: '2', label: t('characters.identity.courage_label_short') },
          {
            value: format.number(1200),
            label: t('characters.identity.money_label'),
          },
        ].map(s => (
          <div key={s.label} className='CharacterSheetVisual__stat'>
            <span className='CharacterSheetVisual__stat-value'>{s.value}</span>
            <span className='CharacterSheetVisual__stat-label'>{s.label}</span>
          </div>
        ))}
      </div>
      <div className='CharacterSheetVisual__inventory'>
        {[
          { name: t('landing.features.character.demo.items.1'), qty: '×2' },
          { name: t('landing.features.character.demo.items.2'), qty: '×10' },
          { name: t('landing.features.character.demo.items.3'), qty: '×1' },
        ].map(({ name, qty }) => (
          <div key={name} className='CharacterSheetVisual__item'>
            <span>{name}</span>
            <span>{qty}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
