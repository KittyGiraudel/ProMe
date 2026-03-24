import type { BiomeId } from '@/lib/character/types'
import { PageCoverArt } from './PageCoverArt'
import './PageCover.css'

type PageCoverProps = {
  /** When set, tints the cover using global `[data-biome]` palette tokens. */
  biome?: BiomeId | 'unexplored'
}

/** Full-bleed decorative banner (Notion-style cover) above page content. */
export function PageCover({ biome }: PageCoverProps) {
  return (
    <div
      className='page-cover'
      role='presentation'
      aria-hidden='true'
      {...(biome !== undefined ? { 'data-biome': biome } : {})}>
      <PageCoverArt />
    </div>
  )
}
