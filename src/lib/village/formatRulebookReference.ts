import { Localize } from "../localization/localize";

export function formatRulebookReference(pages: number[], localize: Localize): string {
  return [...new Set(pages)]
    .sort((a, b) => a - b)
    .map((page) => localize.string('rulebook.pageCitation', { page }))
    .join(' · ')
}