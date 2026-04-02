import MoonFilled from '@ant-design/icons/lib/icons/MoonFilled'
import SunFilled from '@ant-design/icons/lib/icons/SunFilled'
import { Badge } from 'antd'
import { JournalEntryPhase } from '@/lib/character/types'

import './TimelineIcon.css'

export function TimelineIcon({
  phase,
  slice,
}: {
  phase: JournalEntryPhase
  slice?: number
}) {
  return (
    <span className='TimelineIcon'>
      {phase === 'night' ? (
        <MoonFilled className='TimelineIcon__icon TimelineIcon__icon--night' />
      ) : (
        <SunFilled className='TimelineIcon__icon TimelineIcon__icon--day' />
      )}
      {slice ? (
        <Badge
          count={slice}
          className='TimelineIcon__badge'
          color={phase === 'night' ? '#1f3f8b' : '#d4a017'}
        />
      ) : null}
    </span>
  )
}
