import './JournalVisual.css'

export function JournalVisual() {
  return (
    <div className='JournalVisual' aria-hidden='true'>
      <div className='JournalVisual__date'>Day 12 · Flooded Plains</div>
      <div className='JournalVisual__title'>The bridge is gone.</div>
      <div className='JournalVisual__line JournalVisual__line--full' />
      <div className='JournalVisual__line JournalVisual__line--med' />
      <div className='JournalVisual__embed'>
        📍 Arrived at the Flooded Plains
      </div>
      <div className='JournalVisual__line JournalVisual__line--full' />
      <div className='JournalVisual__line JournalVisual__line--short' />
      <div className='JournalVisual__line JournalVisual__line--med' />
    </div>
  )
}
