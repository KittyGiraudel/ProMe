import type { BiomeId } from '@/lib/character/types'
import { BannerArt } from './BannerArt'
import './Banner.css'

type BannerProps = {
  /** When set, tints the cover using global `[data-biome]` palette tokens. */
  biome?: BiomeId | 'unexplored'
}

/** Full-bleed decorative banner (Notion-style cover) above page content. */
export function Banner({ biome }: BannerProps) {
  return (
    <div
      className='page-cover'
      role='presentation'
      aria-hidden='true'
      {...(biome !== undefined ? { 'data-biome': biome } : {})}>
      <BannerArt />
    </div>
  )
}
