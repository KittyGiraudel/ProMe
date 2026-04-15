# Audio Player Rework

**Date:** 2026-04-15  
**Status:** Approved

## Goal

Replace the two-player layout on the biome page with a single player that lets the user cycle through the two tracks via prev/next buttons. Apply the same single-player treatment to the character sheet. The player should adapt visually to the active biome theme (biome page) while looking correct in standard light/dark mode (character sheet). The existing cross-fade behaviour must not be broken.

## Layout

Three rows inside the existing card/wrapper surface:

1. **Track name row** — track name centred, flanked by thin rule lines using the accent colour
2. **Progress row** — `MM:SS · seek slider · MM:SS`
3. **Controls row** — `⏮ ▶/⏸ ⏭` left-aligned, volume slider (≤64 px wide) right-aligned

All icon-only buttons (`⏮`, `▶/⏸`, `⏭`) are wrapped in `<Tooltip>` with a text label. Icons use Ant Design icon components (`StepBackwardOutlined`, `StepForwardOutlined`, `PlayCircleOutlined`, `PauseOutlined`).

The restart-to-zero button is removed; ⏮ now means "previous track" (not rewind).

## Track Selection

A new hook `useTrackSelector(biome: PossibleBiomeId)` manages which of the two tracks is active. It returns:

```ts
{
  track: TrackEntry | null
  url: string | null
  trackIndex: number        // 0 or 1
  trackCount: number        // always 2
  goToPrev: () => void
  goToNext: () => void
}
```

Prev/next wrap around (next on track 2 goes to track 1, prev on track 1 goes to track 2).

Both `BiomeAudio` and `AudioCard` use this hook. They pass `url`, `name`, `onPrev`, and `onNext` down to `AudioPlayer`. `AudioPlayer` renders prev/next buttons when the callbacks are provided (optional props), so it can still be used standalone without them.

## Biome Theming

`AudioPlayer.css` uses CSS custom properties with fallbacks so no prop or context is needed:

- Rule lines + slider fill colour: `var(--biome-accent, var(--ant-color-primary))`
- Text: `color: inherit` — flows from the wrapper

On the biome page the `--biome-accent` token is set per-biome → the player picks up the biome colour. In the character sheet there are no biome tokens → `--ant-color-primary` applies, which respects the active light/dark Ant Design theme.

## Cross-Fading

The cross-fade logic lives entirely inside `AudioPlayer`'s `handleBiomeChange` effect, which is keyed on the `url` prop. Switching tracks changes `url` in the parent; the effect fires identically to a biome navigation change — fade out the old `Howl`, build and auto-play the new one. No changes to the effect itself.

## Files Affected

| File | Change |
|---|---|
| `src/components/AudioPlayer/AudioPlayer.tsx` | New layout, prev/next buttons with Tooltips, `onPrev`/`onNext` optional props |
| `src/components/AudioPlayer/AudioPlayer.css` | New three-row layout, rule-line decoration, biome token fallbacks, volume slider width |
| `src/components/AudioPlayer/useTrackSelector.ts` | New hook — track index state + navigation |
| `src/components/PageBiome/BiomeAudio.tsx` | Use `useTrackSelector`, single player, remove grid |
| `src/components/PageBiome/BiomeAudio.css` | Remove grid styles |
| `src/components/AudioCard/AudioCard.tsx` | Use `useTrackSelector` instead of `useBiomeTrack(biome, 'random')` |
| `src/components/AudioPlayer/useBiomeTrack.ts` | Delete — no callers remain after the rework |

`useMediaSession` is unchanged.
