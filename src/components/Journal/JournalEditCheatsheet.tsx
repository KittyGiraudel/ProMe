'use client'

import { Typography } from 'antd'
import { useTranslations } from 'next-intl'

const MARKDOWN_GUIDE_URL = 'https://www.markdownguide.org/basic-syntax/'

/**
 * Sidebar copy for the journal editor: Markdown pointer + automatic replacements + token syntax.
 */
export function JournalEditCheatsheet() {
  const t = useTranslations()

  return (
    <div className='Journal__cheatsheet'>
      <Typography.Title level={5} className='Journal__cheatsheetTitle'>
        {t('characters.journal.cheatsheet.markdown_title')}
      </Typography.Title>
      <p className='Journal__cheatsheetBlock'>
        {t.rich('characters.journal.cheatsheet.markdown_intro', {
          guide: chunks => (
            <Typography.Link
              href={MARKDOWN_GUIDE_URL}
              target='_blank'
              rel='noreferrer'>
              {chunks}
            </Typography.Link>
          ),
        })}
      </p>

      <Typography.Title level={5} className='Journal__cheatsheetTitle'>
        {t('characters.journal.cheatsheet.embellishment_title')}
      </Typography.Title>
      <ul className='Journal__cheatsheetList'>
        <li>
          {t('characters.journal.cheatsheet.embellishment_biome', {
            example: t('biomes.fieldSea.name'),
          })}
        </li>
        <li>
          {t('characters.journal.cheatsheet.embellishment_checks', {
            success: t('common.check_success_word'),
            failure: t('common.check_failure_word'),
          })}
        </li>
        <li>{t('characters.journal.cheatsheet.embellishment_stars')}</li>
        <li>{t('characters.journal.cheatsheet.embellishment_dice')}</li>
        <li>{t('characters.journal.cheatsheet.embellishment_cards')}</li>
        <li>
          {t.rich('characters.journal.cheatsheet.embellishment_cells', {
            e13: () => <code>E13</code>,
            b07: () => <code>B07@1,0</code>,
          })}
        </li>
      </ul>

      <Typography.Title level={5} className='Journal__cheatsheetTitle'>
        {t('characters.journal.cheatsheet.shortcuts_title')}
      </Typography.Title>
      <ul className='Journal__cheatsheetList'>
        <li>
          {t.rich('characters.journal.cheatsheet.shortcuts_suits', {
            braceS: () => <code>{'{S}'}</code>,
            braceH: () => <code>{'{H}'}</code>,
            braceD: () => <code>{'{D}'}</code>,
            braceC: () => <code>{'{C}'}</code>,
          })}
        </li>
        <li>
          {t.rich('characters.journal.cheatsheet.shortcuts_dice', {
            die1: () => <code>{'{1}'}</code>,
            die2: () => <code>{'{2}'}</code>,
            die3: () => <code>{'{3}'}</code>,
            die4: () => <code>{'{4}'}</code>,
            die5: () => <code>{'{5}'}</code>,
            die6: () => <code>{'{6}'}</code>,
          })}
        </li>
        <li>
          <code className='Journal__cheatsheetCode'>{'{village/<id>}'}</code>
          {' : '}
          {t('characters.journal.cheatsheet.shortcuts_village')}
        </li>
        <li>
          <code className='Journal__cheatsheetCode'>{'{npc/<id>}'}</code>
          {' : '}
          {t('characters.journal.cheatsheet.shortcuts_npc')}
        </li>
        <li>
          <code className='Journal__cheatsheetCode'>{'{protector/<id>}'}</code>
          {' : '}
          {t('characters.journal.cheatsheet.shortcuts_protector')}
        </li>
      </ul>
    </div>
  )
}
