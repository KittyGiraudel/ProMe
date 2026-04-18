import type { PossibleBiomeId } from '@/lib/types'
import { BannerArt } from './BannerArt'

import './Banner.css'

type BannerProps = {
  // When set, tints the cover using global `[data-biome]` palette tokens.
  biome?: PossibleBiomeId
  withBannerImage?: boolean
}

// Full-bleed decorative banner (Notion-style cover) above page content.
export function Banner({ biome, withBannerImage }: BannerProps) {
  return (
    <div className='Banner' role='presentation' data-biome={biome}>
      <span
        className='Banner__background'
        data-pattern={!withBannerImage}
        data-image={withBannerImage}
      />
      {!withBannerImage && <BannerArt />}
    </div>
  )
}
