import { _Translator } from "next-intl";

export function formatRulebookReference(pages: number[], t: _Translator): string {
  return [...new Set(pages)]
    .sort((a, b) => a - b)
    .map((page) => t('rulebook.page_citation', { page }))
    .join(' · ')
}