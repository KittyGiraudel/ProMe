import MoonOutlined from '@ant-design/icons/lib/icons/MoonOutlined'
import SunOutlined from '@ant-design/icons/lib/icons/SunOutlined'
import { Badge } from 'antd'
import './TimelineIcon.css'
import { JournalEntryPhase } from '@/lib/character/types'

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
        <MoonOutlined className='TimelineIcon__icon TimelineIcon__icon--night' />
      ) : (
        <SunOutlined className='TimelineIcon__icon TimelineIcon__icon--day' />
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
