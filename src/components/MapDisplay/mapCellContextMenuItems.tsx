import type { MenuProps } from 'antd'
import { Typography } from 'antd'
import { useFormatter, useTranslations } from 'next-intl'
import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { useCallback, useMemo } from 'react'
import { BiomeBubble } from '@/components/BiomeBubble/BiomeBubble'
import { Link } from '@/i18n/navigation'
import { HexCoordinate } from '@/lib/character/types'
import { BIOME_IDS } from '@/lib/constants/misc'
import type { JournalEntryLink } from '@/lib/journal/cellReferenceIndex'
import { type BiomeId, TranslationKey } from '@/lib/types'
import { useMapActions } from './useMapActions'
import { useJournalIndex, useMapState } from './useMapState'

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
  const textValue = snippet || t('characters.journal.entry_empty')

  return (
    <Link
      href='./journal#journal-entry-${entryId}'
      style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
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
    </Link>
  )
}

function useBiomeSubmenuChildren(
  coord: HexCoordinate
): NonNullable<MenuProps['items']> {
  const t = useTranslations()
  const { setBiomeAt, setRandomBiomeAt } = useMapActions()

  const assignBiomeItem = useCallback(
    (id: BiomeId) => ({
      key: `biome:${id}`,
      label: (
        <span className='Map__BiomeMenuItem'>
          <BiomeBubble biome={id} />
          <span>{t(`common.biomes.${id}` as TranslationKey)}</span>
        </span>
      ),
      onClick: () => setBiomeAt(coord, id),
    }),
    [t, setBiomeAt, coord]
  )

  const assignUnexploredBiome = useMemo(
    () => ({
      key: 'biome:clear',
      label: (
        <span className='Map__BiomeMenuItem'>
          <BiomeBubble biome='unexplored' />
          <span>{t('characters.map.unexplored')}</span>
        </span>
      ),
      onClick: () => setBiomeAt(coord, undefined),
    }),
    [t, setBiomeAt, coord]
  )

  const assignRandomBiomeItem = useMemo(
    () => ({
      key: 'biome:random',
      label: (
        <span className='Map__BiomeMenuItem'>
          <BiomeBubble biome='unexplored' />
          <span>{t('characters.map.random_biome')}</span>
        </span>
      ),
      onClick: () => setRandomBiomeAt(coord),
    }),
    [t, setRandomBiomeAt, coord]
  )

  return useMemo(
    () => [
      ...BIOME_IDS.map(assignBiomeItem),
      { type: 'divider' as const },
      assignUnexploredBiome,
      assignRandomBiomeItem,
    ],
    [assignBiomeItem, assignUnexploredBiome, assignRandomBiomeItem]
  )
}

function useIconSubmenuChildren(
  coord: HexCoordinate,
  hasStoredIcon: boolean,
  setEmojiModalOpen: Dispatch<SetStateAction<boolean>>
): NonNullable<MenuProps['items']> {
  const t = useTranslations()
  const { setIconAt } = useMapActions()

  const openEmojiPickerItem = useMemo(
    () => ({
      key: 'icon-picker',
      label: t('characters.map.pick_emoji'),
      onClick: () => setEmojiModalOpen(true),
    }),
    [t, setEmojiModalOpen]
  )

  const clearEmojiItem = useMemo(
    () => ({
      key: 'icon:clear',
      label: t('characters.map.clear_icon'),
      onClick: () => setIconAt(coord, undefined),
    }),
    [t, setIconAt, coord]
  )

  return useMemo(
    () => [
      openEmojiPickerItem,
      ...(hasStoredIcon ? [{ type: 'divider' as const }, clearEmojiItem] : []),
    ],
    [hasStoredIcon, openEmojiPickerItem, clearEmojiItem]
  )
}

function useJournalSubmenuChildren(
  journalLinks: JournalEntryLink[]
): NonNullable<MenuProps['items']> {
  const t = useTranslations()

  const overflowItem = useMemo(
    () => ({
      key: 'journal:overflow',
      disabled: true,
      label: t('characters.map.journal_links_overflow', {
        count: journalLinks.length - MAX_JOURNAL_LINKS_IN_MENU,
      }),
    }),
    [journalLinks, t]
  )

  const journalItem = useCallback(
    (link: JournalEntryLink) => ({
      key: `journal:${link.entryId}`,
      label: <JournalEntryMenuLabel link={link} />,
    }),
    []
  )

  return useMemo(
    () => [
      ...journalLinks.slice(0, MAX_JOURNAL_LINKS_IN_MENU).map(journalItem),
      ...(journalLinks.length > MAX_JOURNAL_LINKS_IN_MENU
        ? [overflowItem]
        : []),
    ],
    [journalLinks, overflowItem, journalItem]
  )
}

export function useMapCellContextMenuItems({
  coord,
  setEmojiModalOpen,
  isReachable,
}: {
  coord: HexCoordinate
  isReachable: boolean
  setEmojiModalOpen: Dispatch<SetStateAction<boolean>>
}): MenuProps['items'] {
  const t = useTranslations()
  const { getLinksForCell } = useJournalIndex()
  const { moveToCell, clearCellAt } = useMapActions()
  const { getCellState } = useMapState()
  const journalLinks = getLinksForCell(coord)
  const { icon, biome } = getCellState(coord)
  const journalSubmenuChildren = useJournalSubmenuChildren(journalLinks)
  const biomeSubmenuChildren = useBiomeSubmenuChildren(coord)
  const iconSubmenuChildren = useIconSubmenuChildren(
    coord,
    !!icon,
    setEmojiModalOpen
  )
  const hasCellContent = Boolean(icon || biome)

  return useMemo(() => {
    const actionItems: NonNullable<MenuProps['items']> = [
      {
        key: 'move',
        label: t('characters.map.move_here'),
        disabled: !isReachable,
        title: t('characters.map.move_neighbor_only'),
        onClick: () => moveToCell(coord),
      },
      {
        key: 'clear',
        danger: true,
        label: t('characters.map.clear_cell'),
        disabled: !hasCellContent,
        onClick: () => clearCellAt(coord),
      },
    ]

    return [
      {
        key: 'marking-group',
        type: 'group',
        label: t('characters.map.menu_marking_group'),
        children: [
          {
            key: 'biome-group',
            label: t('characters.map.biome_label'),
            children: biomeSubmenuChildren,
          },
          {
            key: 'icon-group',
            label: t('characters.map.icon_label'),
            children: iconSubmenuChildren,
          },
          ...(journalLinks.length > 0
            ? [
                {
                  key: 'journal_group',
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
    t,
    isReachable,
    hasCellContent,
    journalLinks,
    biomeSubmenuChildren,
    iconSubmenuChildren,
    journalSubmenuChildren,
    clearCellAt,
    coord,
    moveToCell,
  ])
}
