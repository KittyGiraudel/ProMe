import type { BiomeId } from '@/lib/types'

export type SoundVariant = 'mix' | 'music' | 'ambiance'

export type TrackEntry = {
  file: string
  name: string
  hasMusic: boolean
  hasAmbiance: boolean
}

const CATALOG: Record<BiomeId, [TrackEntry, TrackEntry]> = {
  shadowForest: [
    {
      file: '344_Yokai_Forest',
      name: 'Yōkai Forest',
      hasMusic: true,
      hasAmbiance: true,
    },
    {
      file: '313_Dusk_of_the_Dryad',
      name: 'Dusk of the Dryad',
      hasMusic: true,
      hasAmbiance: true,
    },
  ],
  floodedPlains: [
    {
      file: '353_Spirit_of_the_Plains',
      name: 'Spirit of the Plains',
      hasMusic: true,
      hasAmbiance: true,
    },
    {
      file: '234_Lush_World',
      name: 'Lush World',
      hasMusic: true,
      hasAmbiance: true,
    },
  ],
  mushroomJungle: [
    {
      file: '228_Mushroom_Forest',
      name: 'Mushroom Forest',
      hasMusic: true,
      hasAmbiance: true,
    },
    {
      file: '332_Myconid_Colony',
      name: 'Myconid Colony',
      hasMusic: true,
      hasAmbiance: true,
    },
  ],
  fieldSea: [
    {
      file: '96_Windswept_Plains',
      name: 'Windswept Plains',
      hasMusic: false,
      hasAmbiance: false,
    },
    {
      file: '305_Hidden_Valley',
      name: 'Hidden Valley',
      hasMusic: true,
      hasAmbiance: true,
    },
  ],
  silentDesert: [
    {
      file: '138_Desert_Winds',
      name: 'Desert Winds',
      hasMusic: false,
      hasAmbiance: true,
    },
    {
      file: '361_Ancient_Beacon',
      name: 'Ancient Beacon',
      hasMusic: true,
      hasAmbiance: true,
    },
  ],
  giganticGardens: [
    {
      file: '423_Magical_Flora',
      name: 'Magical Flora',
      hasMusic: true,
      hasAmbiance: true,
    },
    {
      file: '275_Lorekeeper_Grove',
      name: 'Lorekeeper Grove',
      hasMusic: true,
      hasAmbiance: true,
    },
  ],
}

export function getTrackPath(track: TrackEntry, variant: SoundVariant): string {
  let filename: string
  if (variant === 'music' && track.hasMusic) {
    filename = `${track.file}_MUS_Only.mp3`
  } else if (variant === 'ambiance' && track.hasAmbiance) {
    filename = `${track.file}_AMB_Only.mp3`
  } else {
    filename = `${track.file}.mp3`
  }
  if (process.env.NODE_ENV === 'production') {
    return `/audio/${encodeURIComponent(filename)}`
  }
  return `https://pub-6f5ba7aac9c745d3ac681827814ac01a.r2.dev/musics/${encodeURIComponent(filename)}`
}

export function getTracksForBiome(biome: BiomeId): [TrackEntry, TrackEntry] {
  return CATALOG[biome]
}

export function getAllTrackPaths(variant: SoundVariant): string[] {
  return Object.values(CATALOG).flatMap(tracks =>
    tracks.map(track => getTrackPath(track, variant))
  )
}

export function pickRandomTrack(biome: BiomeId): TrackEntry {
  const tracks = getTracksForBiome(biome)
  return tracks[Math.floor(Math.random() * tracks.length)]
}
