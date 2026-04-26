import { describe, expect, it } from 'vitest'
import {
  getAllTrackPaths,
  getTrackPath,
  getTracksForBiome,
  pickRandomTrack,
} from './catalog'

const CDN = 'https://pub-6f5ba7aac9c745d3ac681827814ac01a.r2.dev/musics'

describe('getTrackPath', () => {
  it('mix variant always returns {file}.mp3', () => {
    const track = {
      file: '344_Yokai_Forest',
      name: 'Yōkai Forest',
      hasMusic: true,
      hasAmbiance: true,
    }
    expect(getTrackPath(track, 'mix')).toBe(`${CDN}/344_Yokai_Forest.mp3`)
  })

  it('music variant with hasMusic=true returns _MUS_Only.mp3', () => {
    const track = {
      file: '344_Yokai_Forest',
      name: 'Yōkai Forest',
      hasMusic: true,
      hasAmbiance: true,
    }
    expect(getTrackPath(track, 'music')).toBe(
      `${CDN}/344_Yokai_Forest_MUS_Only.mp3`
    )
  })

  it('music variant with hasMusic=false falls back to {file}.mp3', () => {
    const track = {
      file: '96_Windswept_Plains',
      name: 'Windswept Plains',
      hasMusic: false,
      hasAmbiance: false,
    }
    expect(getTrackPath(track, 'music')).toBe(`${CDN}/96_Windswept_Plains.mp3`)
  })

  it('ambiance variant with hasAmbiance=true returns _AMB_Only.mp3', () => {
    const track = {
      file: '344_Yokai_Forest',
      name: 'Yōkai Forest',
      hasMusic: true,
      hasAmbiance: true,
    }
    expect(getTrackPath(track, 'ambiance')).toBe(
      `${CDN}/344_Yokai_Forest_AMB_Only.mp3`
    )
  })

  it('ambiance variant with hasAmbiance=false falls back to {file}.mp3', () => {
    const track = {
      file: '96_Windswept_Plains',
      name: 'Windswept Plains',
      hasMusic: false,
      hasAmbiance: false,
    }
    expect(getTrackPath(track, 'ambiance')).toBe(
      `${CDN}/96_Windswept_Plains.mp3`
    )
  })
})

describe('getTracksForBiome', () => {
  it('returns [TrackEntry, TrackEntry] for shadowWoods', () => {
    const tracks = getTracksForBiome('shadowWoods')
    expect(tracks).toHaveLength(2)
    expect(tracks[0].file).toBe('344_Yokai_Forest')
    expect(tracks[1].file).toBe('313_Dusk_of_the_Dryad')
  })

  it('returns [TrackEntry, TrackEntry] for sunkenSavanna', () => {
    const tracks = getTracksForBiome('sunkenSavanna')
    expect(tracks).toHaveLength(2)
    expect(tracks[0].file).toBe('353_Spirit_of_the_Plains')
    expect(tracks[1].file).toBe('234_Lush_World')
  })

  it('returns [TrackEntry, TrackEntry] for mushroomJungle', () => {
    const tracks = getTracksForBiome('mushroomJungle')
    expect(tracks).toHaveLength(2)
    expect(tracks[0].file).toBe('228_Mushroom_Forest')
    expect(tracks[1].file).toBe('332_Myconid_Colony')
  })

  it('returns [TrackEntry, TrackEntry] for prairieSea', () => {
    const tracks = getTracksForBiome('prairieSea')
    expect(tracks).toHaveLength(2)
    expect(tracks[0].file).toBe('96_Windswept_Plains')
    expect(tracks[1].file).toBe('305_Hidden_Valley')
  })

  it('returns [TrackEntry, TrackEntry] for silentWastes', () => {
    const tracks = getTracksForBiome('silentWastes')
    expect(tracks).toHaveLength(2)
    expect(tracks[0].file).toBe('138_Desert_Winds')
    expect(tracks[1].file).toBe('361_Ancient_Beacon')
  })

  it('returns [TrackEntry, TrackEntry] for titanGarden', () => {
    const tracks = getTracksForBiome('titanGarden')
    expect(tracks).toHaveLength(2)
    expect(tracks[0].file).toBe('423_Magical_Flora')
    expect(tracks[1].file).toBe('275_Lorekeeper_Grove')
  })

  it('prairieSea first track has no music or ambiance variants', () => {
    const [first] = getTracksForBiome('prairieSea')
    expect(first.file).toBe('96_Windswept_Plains')
    expect(first.hasMusic).toBe(false)
    expect(first.hasAmbiance).toBe(false)
  })

  it('silentWastes first track has ambiance but no music variant', () => {
    const [first] = getTracksForBiome('silentWastes')
    expect(first.file).toBe('138_Desert_Winds')
    expect(first.hasMusic).toBe(false)
    expect(first.hasAmbiance).toBe(true)
  })
})

describe('getAllTrackPaths', () => {
  it('returns 12 paths for mix variant', () => {
    expect(getAllTrackPaths('mix')).toHaveLength(12)
  })

  it('returns 12 paths for music variant', () => {
    expect(getAllTrackPaths('music')).toHaveLength(12)
  })

  it('returns 12 paths for ambiance variant', () => {
    expect(getAllTrackPaths('ambiance')).toHaveLength(12)
  })

  it('music variant contains MUS_Only path for tracks that have it', () => {
    const paths = getAllTrackPaths('music')
    expect(paths).toContain(`${CDN}/344_Yokai_Forest_MUS_Only.mp3`)
  })

  it('music variant falls back to .mp3 for tracks without music variant', () => {
    const paths = getAllTrackPaths('music')
    expect(paths).toContain(`${CDN}/96_Windswept_Plains.mp3`)
  })

  it('ambiance variant contains AMB_Only path for tracks that have it', () => {
    const paths = getAllTrackPaths('ambiance')
    expect(paths).toContain(`${CDN}/138_Desert_Winds_AMB_Only.mp3`)
  })
})

describe('pickRandomTrack', () => {
  it('returns one of the two tracks for a given biome', () => {
    const tracks = getTracksForBiome('shadowWoods')
    const picked = pickRandomTrack('shadowWoods')
    expect(tracks).toContainEqual(picked)
  })

  it('returns a TrackEntry with required fields', () => {
    const picked = pickRandomTrack('titanGarden')
    expect(picked).toHaveProperty('file')
    expect(picked).toHaveProperty('name')
    expect(picked).toHaveProperty('hasMusic')
    expect(picked).toHaveProperty('hasAmbiance')
  })
})
