import './GeneratorVisual.css'

const ATTRS = [
  { label: 'Age', value: '34' },
  { label: 'Personality', value: 'Cautious, warm' },
  { label: 'Faction', value: "Wanderer's Guild" },
  { label: 'Context', value: 'Seeking rare herbs' },
]

export function GeneratorVisual() {
  return (
    <div className='GeneratorVisual' aria-hidden='true'>
      <div className='GeneratorVisual__name'>Mara Ashwood</div>
      <div className='GeneratorVisual__role'>Herbalist · Wanderer's Guild</div>
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
