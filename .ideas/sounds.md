# Sounds

Because this is a role playing game about whismy and adventure, the use of ambiance sounds and music can go a long way in making the game more immersive. The official rulebook recommends some soundtracks from TableTopAudio.com for each biome, which I have downloaded and placed in the `public/musics` folder:

- `shadowForest`: Yōkai Forest (`344_Yokai_Forest.mp3`) and Dusk of the Dryad (`313_Dusk_of_the_Dryad.mp3`)
- `floodedPlains`: Spirit of the Plains (`353_Spirit_of_the_Plains.mp3`) and Lush World (`234_Lush_World.mp3`)
- `mushroomJungle`: Mushroom Forest (`228_Mushroom_Forest.mp3`) and Myconid Colony (`332_Myconid_Colony.mp3`)
- `fieldSea`: Windswept Plains (`96_Windswept_Plains.mp3`) and Hidden Valley (`305_Hidden_Valley.mp3`)
- `silentDesert`: Desert Winds (`138_Desert_Winds.mp3`) and Ancient Beacon (`361_Ancient_Beacon.mp3`)
- `giganticGardens`: Magical Flora (`423_Magical_Flora.mp3`) and Lorekeeper Grove (`275_Lorekeeper_Grove.mp3`)

Note: the Core cell (E13) has no biome and therefore will have no soundtrack. I like that it’s silent. It’s the first tile at the beginning of the adventure, you start in silence as you awaken. And then when you start exploring, sound begins to emerge.

## Interface

I am not super sure where is the best place to put it. For the time being, I think we can insert the audio player/component at the bottom of the character shell. It’s important the audio is preserved when changing tabs when using the multi-page mode.

## Settings

We need a new setting about this, so the user can turn sound on or off. I think it should start as off, since it can be a little intrusive. Perhaps we should indicate next to the setting that this will load a significant amount of data (see “Performance” below) to avoid surprise-downloading 100Mb on a small mobile plan.

## Performance

We have 6 biomes, with 2 soundtracks each, each 10 minutes long. Each file is about 15Mb in size, which is of course significant. There are a few things to consider:

1. Once a soundtrack has been loaded in the browser, we should aggressively cache it so it’s never downloaded again. We may be able to use the Cache API for this?
2. When entering a biome, the soundtrack should start playing almost instantly. Of course 1–2s loading time is fine, but we shouldn’t wait 20 seconds to load the track. So if needed, we may need to preload all soundtracks in the browser so they’re ready to play when needed.

I’m thinking maybe we just preload them when enabling the sound setting (see “Settings” above), and then cache them in the browser so they’re never downloaded again — we could even show a small notification saying “Preloading all music soundtracks…” or something depending on how long we expect it to take. I think it’s important we don’t download ~200Mb of sound every time we load the page, so let’s make sure they’re preloaded and cached once and for all.

Compression: If file size is still an issue, tools like Audacity or FFmpeg can help compress the MP3s further without noticeable quality loss. Right now, I just downloaded the audio files from https://tabletopaudio.com, and I don’t know if they are pre-compressed. The FAQ states:

> I create all the sounds as high fidelity,lossless, 24 bit/48khz uncompressed audio files before dithering and encoding for the web. The 10 minute ambience files are eventually compressed into 192kbit/sec mp3 files, which for me are the best balance between file size (cost) and fidelity.

Maybe we don’t touch them for now, and we can explore that later if needed.

## UX

When moving on the map, we need to adjust the playing sound to the current biome. Given we have 2 files for each biome, maybe we should pick at random? I don’t have a better idea as to which file to pick for a given biome.

Regarding transitions, here are several cases to consider:

- Moving to a cell with the same biome: do nothing, keep playing the current audio file, don’t reset it.
- Moving to a cell to a different biome: fade out the current sound over a few seconds + start the new sound.
- Moving to the Core cell (no biome): fade out the current sound over a few seconds.

I was hoping we could render a small audio widget so you can play/pause the soundtrack, and adjust the volume, but I’ve heard that for fading out the volume when switching biomes (to avoid an abrupt sound change which would be disruptive), we may need the Audio API. I believe fading out can be done like this (feel free to ignore if not relevant):

```js
// Setup audio context and gain node for fading
const audioContext = new (window.AudioContext || window.webkitAudioContext)()
const gainNode = audioContext.createGain()
const source = audioContext.createMediaElementSource(audioElement)
source.connect(gainNode).connect(audioContext.destination)

// Fade out over 3 seconds
function fadeOut() {
  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 2
  )
  setTimeout(() => audioElement.pause(), 3_000)
}
```

I don’t think we need fade-in because all soundtracks have built-in fade-in. They never start abruptly.

## Nice-to-have

### Variants

The default soundtracks are always a mix of ambiance sounds + music background. Because I am a Patreon of TableTopAudio.com, we have variants for most soundtracks: either music-only (`MUS_Only`) or ambiance-only (`AMB_Only`). It could be nice to make this configuration in the settings: some people may like the ambiance but not the music, or vice versa.

Note that it’s possible for a given soundtrack to have no variant, or to be missing a specific variant, so we need to account for that. For instance, the “Desert Winds” soundtrack has a single variant: `138_Desert_Winds_AMB_Only.mp3` which is ambiance-only — there is no music-only variant. That means picking “music-only” in the settings should:

- Look up if the other soundtrack for that biome has a music-only soundtrack.
  - If it does, load this one to honor the user’s choice.
  - If it doesn’t, load `138_Desert_Winds.mp3` (or the other soundtrack for the biome).

It’s worth considering the performance implications as well though, because it means loading up to 3 times 6 soundtracks. Perhaps we can make it so that when you change the setting, we fetch all 6 relevant soundtracks at that moment (so if you pick ambiance-only, we fetch only these variants).

### Hotkey

Maybe cmd+M could mute/unmute the player, so you can rapidly toggle it. Not sure if it’s a good idea, just an idea.

## Open questions

- What should we do if a file fail to load? Can this even happen? Maybe the audio component could render a small error state and offer to retry loading the audio or something?
