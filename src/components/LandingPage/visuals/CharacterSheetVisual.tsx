import './CharacterSheetVisual.css'

export function CharacterSheetVisual() {
  return (
    <div className='CharacterSheetVisual' aria-hidden='true'>
      <div className='CharacterSheetVisual__name'>Elden · Shadow Forest</div>
      <div className='CharacterSheetVisual__stats'>
        {[
          { value: '8', label: 'Health' },
          { value: '6', label: 'Stamina' },
          { value: '3', label: 'Magic' },
          { value: '12', label: 'Gold' },
        ].map(s => (
          <div key={s.label} className='CharacterSheetVisual__stat'>
            <span className='CharacterSheetVisual__stat-value'>{s.value}</span>
            <span className='CharacterSheetVisual__stat-label'>{s.label}</span>
          </div>
        ))}
      </div>
      <div className='CharacterSheetVisual__inventory'>
        {[
          ['Healing Potion', '×2'],
          ['Old Lantern', '×1'],
          ['Rope (10m)', '×1'],
        ].map(([name, qty]) => (
          <div key={name} className='CharacterSheetVisual__item'>
            <span>{name}</span>
            <span>{qty}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
