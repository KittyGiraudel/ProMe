import { Typography } from 'antd'
import type { MenuProps } from 'antd'
import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { useFormatter, useTranslations } from 'next-intl'
import { BIOME_IDS } from '@/lib/character/types'
import type { JournalEntryLink } from '@/lib/journal/cellReferenceIndex'
import { BiomeBubble } from '@/components/BiomeBubble/BiomeBubble'

const MAX_JOURNAL_LINKS_IN_MENU = 5

export function journalContentFirstLine(content: string): string {
  const normalized = content.replaceAll('\r\n', '\n').replaceAll('\r', '\n')
  const lines = normalized.split('\n').filter(line => line.trim())
  return (lines[0] ?? '').replace(/^#+/, '')
}

function useFormattedDate(date: string | undefined): string | null {
  const format = useFormatter()
  if (!date) return null
  const dateObj = new Date(date)
  if (Number.isNaN(dateObj.getTime())) return null
  return format.dateTime(dateObj, { dateStyle: 'medium' })
}

function JournalEntryMenuLabel({
  link,
}: {
  link: JournalEntryLink
}): ReactNode {
  const t = useTranslations()
  const snippet = journalContentFirstLine(link.content ?? '')
  const dateLabel = useFormattedDate(link.createdAt)
  const textValue = snippet || t('characters.journal.preview_empty')

  return (
    <span style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
      <Typography.Text
        style={{ flex: 1, minWidth: 0 }}
        ellipsis={{ tooltip: snippet ? textValue : undefined }}>
        {textValue}
      </Typography.Text>
      {dateLabel ? (
        <Typography.Text type='secondary' style={{ whiteSpace: 'nowrap' }}>
          {dateLabel}
        </Typography.Text>
      ) : null}
    </span>
  )
}

function useBiomeSubmenuChildren(): NonNullable<MenuProps['items']> {
  const t = useTranslations()

  const children = useMemo(
    () => [
      ...BIOME_IDS.map(id => ({
        key: `biome:${id}`,
        label: (
          <span className='Map__BiomeMenuItem'>
            <BiomeBubble biome={id} />
            <span>{t(`common.biomes.${id}`)}</span>
          </span>
        ),
      })),
      { type: 'divider' as const },
      {
        key: 'biome:clear',
        label: (
          <span className='Map__BiomeMenuItem'>
            <BiomeBubble biome='unexplored' />
            <span>{t('characters.map.unexplored')}</span>
          </span>
        ),
      },
      {
        key: 'biome:random',
        label: (
          <span className='Map__BiomeMenuItem'>
            <BiomeBubble biome='unexplored' />
            <span>{t('characters.map.random_biome')}</span>
          </span>
        ),
      },
    ],
    [t]
  )

  return children
}

function useIconSubmenuChildren(
  hasStoredIcon: boolean
): NonNullable<MenuProps['items']> {
  const t = useTranslations()

  const children = useMemo<NonNullable<MenuProps['items']>>(
    () => [
      {
        key: 'icon-picker',
        label: t('characters.map.pick_emoji'),
      },
      ...(hasStoredIcon
        ? [
            { type: 'divider' as const },
            {
              key: 'icon:clear',
              label: t('characters.map.clear_icon'),
            },
          ]
        : []),
    ],
    [hasStoredIcon, t]
  )

  return children
}

function useJournalSubmenuChildren(
  journalLinks: JournalEntryLink[]
): NonNullable<MenuProps['items']> {
  const t = useTranslations()

  const children = useMemo(
    () => [
      ...journalLinks.slice(0, MAX_JOURNAL_LINKS_IN_MENU).map(link => ({
        key: `journal:${link.entryId}`,
        label: <JournalEntryMenuLabel link={link} />,
      })),
      ...(journalLinks.length > MAX_JOURNAL_LINKS_IN_MENU
        ? [
            {
              key: 'journal:overflow',
              disabled: true,
              label: t('characters.map.journal_links_overflow', {
                count: journalLinks.length - MAX_JOURNAL_LINKS_IN_MENU,
              }),
            },
          ]
        : []),
    ],
    [journalLinks, t]
  )

  return children
}

export function useMapCellContextMenuItems({
  coordLabel,
  canMoveHere,
  hasCellContent,
  hasStoredIcon,
  journalLinks,
}: {
  coordLabel: string
  canMoveHere: boolean
  hasCellContent: boolean
  hasStoredIcon: boolean
  journalLinks: JournalEntryLink[]
}): MenuProps['items'] {
  const t = useTranslations()
  const journalSubmenuChildren = useJournalSubmenuChildren(journalLinks)
  const biomeSubmenuChildren = useBiomeSubmenuChildren()
  const iconSubmenuChildren = useIconSubmenuChildren(hasStoredIcon)

  return useMemo(() => {
    const actionItems: NonNullable<MenuProps['items']> = [
      {
        key: 'move',
        label: t('characters.map.move_here'),
        disabled: !canMoveHere,
        title: canMoveHere ? undefined : t('characters.map.move_neighbor_only'),
      },
      {
        key: 'clear',
        danger: true,
        label: t('characters.map.clear_cell'),
        disabled: !hasCellContent,
      },
    ]

    return [
      {
        key: 'coord-group',
        type: 'group',
        label: t('characters.map.selected_cell', { cell: coordLabel }),
        children: [],
      },
      {
        key: 'marking-group',
        type: 'group',
        label: t('characters.map.menu_marking_group'),
        children: [
          {
            key: 'biome',
            label: t('characters.map.biome_label'),
            children: biomeSubmenuChildren,
          },
          {
            key: 'icon',
            label: t('characters.map.icon_label'),
            children: iconSubmenuChildren,
          },
          ...(journalLinks.length > 0
            ? [
                {
                  key: 'journal',
                  label: t('characters.map.journal_links_label'),
                  children: journalSubmenuChildren,
                },
              ]
            : []),
        ],
      },
      {
        key: 'actions-group',
        type: 'group',
        label: t('characters.map.menu_actions_group'),
        children: actionItems,
      },
    ]
  }, [
    canMoveHere,
    coordLabel,
    hasCellContent,
    journalLinks,
    t,
    biomeSubmenuChildren,
    iconSubmenuChildren,
    journalSubmenuChildren,
  ])
}
