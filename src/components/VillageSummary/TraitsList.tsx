import RedoOutlined from '@ant-design/icons/lib/icons/RedoOutlined'
import { Button, Tooltip } from 'antd'
import { useTranslations } from 'next-intl'
import { VillageTraitRow } from '@/lib/village/resolveVillageDisplay'
import { PlayingCardLabel } from '../PlayingCardLabel/PlayingCardLabel'
import { RichText } from '../RichText/RichText'
export function TraitsList({
  traits,
  onRerollPrimarySlot,
}: {
  traits: VillageTraitRow[]
  onRerollPrimarySlot?: (slotIndex: number) => void
}) {
  const t = useTranslations()

  return (
    <ul className='VillageSummary__list'>
      {traits.map(row => (
        <li
          key={row.instances.map(x => x.primarySlot).join('-')}
          className='VillageSummary__item'>
          <div className='VillageSummary__container'>
            <RichText text={row.text} />
            {row.instances.map(inst => (
              <span key={inst.primarySlot}>
                <PlayingCardLabel card={inst.card} compact />
                <Tooltip title={t('common.actions.reroll_card')}>
                  <Button
                    key={inst.primarySlot}
                    type='text'
                    size='small'
                    icon={<RedoOutlined />}
                    disabled={!onRerollPrimarySlot}
                    aria-label={t('common.actions.reroll_card')}
                    onClick={() => onRerollPrimarySlot?.(inst.primarySlot)}
                  />
                </Tooltip>
              </span>
            ))}
          </div>
        </li>
      ))}
    </ul>
  )
}
