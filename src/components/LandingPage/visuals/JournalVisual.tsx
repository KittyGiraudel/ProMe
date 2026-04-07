import { useTranslations } from 'next-intl'
import './JournalVisual.css'

export function JournalVisual() {
  const t = useTranslations()
  return (
    <div className='JournalVisual' aria-hidden='true'>
      <div className='JournalVisual__date'>
        {t('landing.features.journal.demo.title')}
      </div>
      <div className='JournalVisual__title'>
        {t('landing.features.journal.demo.content')}
      </div>
      <div className='JournalVisual__line JournalVisual__line--full' />
      <div className='JournalVisual__line JournalVisual__line--med' />
      <div className='JournalVisual__embed'>
        📍 {t('landing.features.journal.demo.embed')}
      </div>
      <div className='JournalVisual__line JournalVisual__line--full' />
      <div className='JournalVisual__line JournalVisual__line--short' />
      <div className='JournalVisual__line JournalVisual__line--med' />
    </div>
  )
}
